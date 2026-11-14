import test from 'node:test';
import assert from 'node:assert/strict';
import { GET, POST } from '../src/app/api/analyze/route.ts';
import { NextRequest } from 'next/server';

function createMockRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost:3000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

test('API 1. Empty message returns HTTP 400', async () => {
  const req = createMockRequest({ message: '' });
  const res = await POST(req);
  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.error, 'Message text is required');
});

test('API 2. Non-string message returns HTTP 400', async () => {
  const req = createMockRequest({ message: 12345 });
  const res = await POST(req);
  assert.equal(res.status, 400);
});

test('API 3. Preset 1 scam message returns HTTP 200 with score >= 65 and SCAM level', async () => {
  const req = createMockRequest({
    message: '[URGENT] Deriv Security Alert: Unusual withdrawal attempt detected on your account. Your funds will be frozen within 2 hours. Send your 6-digit OTP to @DerivSupportOfficial_bot on Telegram immediately: https://deriv-verify-security.xyz/auth'
  });
  const res = await POST(req);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.riskLevel, 'SCAM');
  assert.equal(data.badgeText, 'HIGH RISK SCAM');
  assert.ok(data.score >= 65);
  assert.ok(data.redFlags.length >= 3);
});

test('API 4. Preset 2 suspicious bonus returns HTTP 200 with SUSPICIOUS level and financial bait', async () => {
  const req = createMockRequest({
    message: 'Congratulations! Selected for Deriv VIP Trader Anniversary Giveaway! Deposit minimum $50 today and receive instant $250 bonus match. Claim limited bonus slot: https://deriv-promotions-bonus.xyz/claim'
  });
  const res = await POST(req);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.riskLevel === 'SUSPICIOUS' || data.riskLevel === 'SCAM');
  assert.ok(data.score >= 25);
  assert.ok(data.redFlags.some((f: { category: string }) => f.category === 'financial'));
});

test('API 5. Preset 3 safe statement returns HTTP 200 with SAFE level and score 0', async () => {
  const req = createMockRequest({
    message: 'Dear Deriv client, your monthly account trading statement is now available at https://app.deriv.com. Deriv will never ask for your password or 2FA OTP.'
  });
  const res = await POST(req);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.riskLevel, 'SAFE');
  assert.equal(data.badgeText, 'NO WARNING SIGNS FOUND');
  assert.equal(data.score, 0);
  assert.equal(data.redFlags.length, 0);
});

test('API 6. Homoglyph spoofing returns HTTP 200 with homoglyph-spoofing flag', async () => {
  const req = createMockRequest({
    message: 'Please update your security settings at https://der\u0456v.com/login'
  });
  const res = await POST(req);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.redFlags.some((f: { id: string }) => f.id === 'homoglyph-spoofing'));
});

test('API 7. Availability reveals only whether a server key exists', async () => {
  const response = await GET();
  const data = await response.json();
  assert.deepEqual(Object.keys(data), ['serverAiAvailable']);
  assert.equal(typeof data.serverAiAvailable, 'boolean');
});

test('API 8. Local-only request never calls Gemini', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('Unexpected network request'); };
  try {
    const response = await POST(createMockRequest({ message: 'Hello there.' }));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).engineUsed, 'heuristic');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('API 9. Gemini cannot downgrade a locally detected scam', async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl = '';
  let sentKey = '';
  globalThis.fetch = async (input, init) => {
    requestedUrl = String(input);
    sentKey = new Headers(init?.headers).get('x-goog-api-key') || '';
    return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify({ score: 0, riskLevel: 'SAFE', redFlags: [] }) }] } }] }), { status: 200 });
  };
  try {
    const response = await POST(createMockRequest({
      message: 'Urgent! Send your OTP to @support_bot immediately: https://fake-deriv.xyz',
      mode: 'ai',
      customApiKey: 'test-key',
    }));
    const data = await response.json();
    assert.equal(data.engineUsed, 'hybrid');
    assert.equal(data.riskLevel, 'SCAM');
    assert.ok(data.score >= 65);
    assert.match(requestedUrl, /gemini-3\.5-flash/);
    assert.ok(!requestedUrl.includes('test-key'));
    assert.equal(sentKey, 'test-key');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('API 10. Gemini failure returns a labeled local result', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response('unavailable', { status: 503 });
  try {
    const response = await POST(createMockRequest({ message: 'Hello there.', mode: 'ai', customApiKey: 'test-key' }));
    assert.equal((await response.json()).engineUsed, 'heuristic');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('API 11. Oversized messages are rejected before analysis', async () => {
  const response = await POST(createMockRequest({ message: 'a'.repeat(10_001), mode: 'ai' }));
  assert.equal(response.status, 413);
});

test('API 12. Invalid Gemini output falls back to the local scanner', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: '{}' }] } }] }), { status: 200 });
  try {
    const response = await POST(createMockRequest({ message: 'Hello there.', mode: 'ai', customApiKey: 'test-key' }));
    assert.equal((await response.json()).engineUsed, 'heuristic');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
