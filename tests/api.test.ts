import test from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '../src/app/api/analyze/route.ts';
import { NextRequest } from 'next/server';

function createMockRequest(body: any): NextRequest {
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
  assert.ok(data.redFlags.some((f: any) => f.category === 'financial'));
});

test('API 5. Preset 3 safe statement returns HTTP 200 with SAFE level and score 0', async () => {
  const req = createMockRequest({
    message: 'Dear Deriv client, your monthly account trading statement is now available at https://app.deriv.com. Deriv will never ask for your password or 2FA OTP.'
  });
  const res = await POST(req);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.riskLevel, 'SAFE');
  assert.equal(data.badgeText, 'VERIFIED SAFE PATTERN');
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
  assert.ok(data.redFlags.some((f: any) => f.id === 'homoglyph-spoofing'));
});
