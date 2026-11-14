import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeMessageLocally,
  extractUrls,
  isOfficialDerivDomain,
  isOfficialDerivUrl
} from '../src/lib/detector.ts';
import { PRESET_MESSAGES } from '../src/lib/presets.ts';

test('1. Empty or whitespace input handling', () => {
  const emptyRes = analyzeMessageLocally('');
  assert.equal(emptyRes.score, 0);
  assert.equal(emptyRes.riskLevel, 'SAFE');
  assert.equal(emptyRes.badgeText, 'NO INPUT');
  assert.equal(emptyRes.redFlags.length, 0);

  const spacesRes = analyzeMessageLocally('     \n\t   ');
  assert.equal(spacesRes.score, 0);
  assert.equal(spacesRes.riskLevel, 'SAFE');
});

test('2. Preset 1 - Urgent Account Suspension & Telegram OTP lure', () => {
  const p1 = PRESET_MESSAGES.find(p => p.id === 'preset-1-scam');
  assert.ok(p1, 'Preset 1 must exist');

  const res = analyzeMessageLocally(p1.text);
  assert.equal(res.riskLevel, 'SCAM');
  assert.equal(res.badgeText, 'HIGH RISK SCAM');
  assert.ok(res.score >= 65, `Expected score >= 65, got ${res.score}`);

  // Must detect urgency
  const hasUrgency = res.redFlags.some(rf => rf.category === 'urgency');
  assert.ok(hasUrgency, 'Must detect urgency flag');

  // Must detect credential harvesting
  const hasCredential = res.redFlags.some(rf => rf.category === 'credential');
  assert.ok(hasCredential, 'Must detect credential harvesting flag');

  // Must detect unofficial domain (.xyz)
  const hasDomain = res.redFlags.some(rf => rf.category === 'domain');
  assert.ok(hasDomain, 'Must detect unofficial domain');

  // Must detect off-platform Telegram lure
  const hasRedirect = res.redFlags.some(rf => rf.category === 'redirect');
  assert.ok(hasRedirect, 'Must detect off-platform redirect to Telegram bot');
});

test('3. Preset 2 - Fake $250 VIP Deposit Bonus on .xyz link', () => {
  const p2 = PRESET_MESSAGES.find(p => p.id === 'preset-2-phishing');
  assert.ok(p2, 'Preset 2 must exist');
  assert.ok(p2.text.includes('.xyz'), 'Preset 2 must use .xyz link per challenge specification');

  const res = analyzeMessageLocally(p2.text);
  assert.ok(res.riskLevel === 'SUSPICIOUS' || res.riskLevel === 'SCAM', `Expected SUSPICIOUS or SCAM, got ${res.riskLevel}`);
  assert.ok(res.score >= 25, `Expected score >= 25, got ${res.score}`);

  // Must detect financial bait
  const hasFinancial = res.redFlags.some(rf => rf.category === 'financial');
  assert.ok(hasFinancial, 'Must detect financial giveaway / bonus bait');

  // Must detect unofficial domain (.xyz)
  const hasDomain = res.redFlags.some(rf => rf.category === 'domain');
  assert.ok(hasDomain, 'Must detect unofficial domain');
});

test('4. Preset 3 - Legitimate Deriv monthly statement notice', () => {
  const p3 = PRESET_MESSAGES.find(p => p.id === 'preset-3-safe');
  assert.ok(p3, 'Preset 3 must exist');

  const res = analyzeMessageLocally(p3.text);
  assert.equal(res.riskLevel, 'SAFE');
  assert.equal(res.badgeText, 'VERIFIED SAFE PATTERN');
  assert.equal(res.score, 0);
  assert.equal(res.redFlags.length, 0);
  assert.ok(res.safeIndicators.length > 0, 'Must detect safe indicators');
});

test('5. Preset 4 - 100% Win Rate Signal Bot Scam with WhatsApp and seed phrase', () => {
  const p4 = PRESET_MESSAGES.find(p => p.id === 'preset-4-signals');
  assert.ok(p4, 'Preset 4 must exist');

  const res = analyzeMessageLocally(p4.text);
  assert.equal(res.riskLevel, 'SCAM');
  assert.ok(res.score >= 65);

  const hasSeed = res.redFlags.some(rf => rf.category === 'credential');
  assert.ok(hasSeed, 'Must detect seed phrase credential harvesting');

  const hasWa = res.redFlags.some(rf => rf.category === 'redirect');
  assert.ok(hasWa, 'Must detect WhatsApp lure');
});

test('6. Preset 5 - Official 2FA Login Notification is SAFE', () => {
  const p5 = PRESET_MESSAGES.find(p => p.id === 'preset-5-safe-login');
  assert.ok(p5, 'Preset 5 must exist');

  const res = analyzeMessageLocally(p5.text);
  assert.equal(res.riskLevel, 'SAFE');
  assert.equal(res.redFlags.length, 0);
});

test('7. extractUrls parser accurately strips quotes, brackets, and trailing punctuation', () => {
  const raw = 'Visit "https://app.deriv.com", <https://deriv.com/help-centre>, and [https://fake-deriv.xyz/login]. Also check bit.ly/bonus!';
  const urls = extractUrls(raw);
  assert.ok(urls.includes('https://app.deriv.com'), 'Must extract unquoted https://app.deriv.com');
  assert.ok(urls.includes('https://deriv.com/help-centre'), 'Must extract unbracketed https://deriv.com/help-centre');
  assert.ok(urls.includes('https://fake-deriv.xyz/login'), 'Must extract unbracketed https://fake-deriv.xyz/login');
  assert.ok(urls.some(u => u.includes('bit.ly/bonus')), 'Must extract shortener');
});

test('8. Deceptive domain masquerading as Deriv (deriv.com.attacker.com) and NO safeIndicator leak', () => {
  const text = 'Urgent notice: Log in to your wallet at https://deriv.com.attacker-node.xyz/login';
  const res = analyzeMessageLocally(text);
  assert.ok(res.redFlags.some(rf => rf.category === 'domain'), 'Must flag deceptive domain');
  assert.ok(res.score >= 25);
  // Attacker domain must NEVER be credited in safeIndicators
  assert.ok(!res.safeIndicators.some(si => si.includes('https://deriv.com')), 'Must not leak safeIndicator for attacker subdomain');
});

test('9. IDN Homoglyph / Punycode anti-spoofing detection (e.g. Cyrillic i in derіv.com)', () => {
  // Cyrillic small letter byelorussian-ukrainian i (\u0456)
  const homoglyphUrl = 'https://der\u0456v.com/login';
  const res = analyzeMessageLocally(`Please verify your credentials at ${homoglyphUrl}`);
  assert.equal(res.riskLevel, 'SUSPICIOUS' || res.riskLevel === 'SCAM');
  assert.ok(res.redFlags.some(rf => rf.id === 'homoglyph-spoofing'), 'Must flag IDN homoglyph spoofing attack');
  assert.ok(res.score >= 35, `Expected score >= 35, got ${res.score}`);
});

test('10. Strict isOfficialDerivUrl & isOfficialDerivDomain validator', () => {
  assert.equal(isOfficialDerivDomain('deriv.com'), true);
  assert.equal(isOfficialDerivDomain('app.deriv.com'), true);
  assert.equal(isOfficialDerivDomain('smarttrader.deriv.com'), true);
  assert.equal(isOfficialDerivDomain('deriv.me'), true);
  assert.equal(isOfficialDerivDomain('deriv.be'), true);

  // Impostors
  assert.equal(isOfficialDerivDomain('deriv.com.attacker.com'), false);
  assert.equal(isOfficialDerivDomain('deriv-security.com'), false);
  assert.equal(isOfficialDerivDomain('fake-deriv.xyz'), false);
  assert.equal(isOfficialDerivDomain('xn--derv-n9d.com'), false);

  // URL checking: HTTPS required
  assert.equal(isOfficialDerivUrl('https://app.deriv.com'), true);
  assert.equal(isOfficialDerivUrl('http://app.deriv.com'), false); // Insecure HTTP
  assert.equal(isOfficialDerivUrl('https://deriv.com.attacker.com/login'), false);
  assert.equal(isOfficialDerivUrl('https://der\u0456v.com/login'), false);
});

test('11. Generic benign text does not claim it directs to official Deriv domains', () => {
  const benign = 'Hey John, are we still meeting for lunch at 1pm tomorrow?';
  const res = analyzeMessageLocally(benign);
  assert.equal(res.riskLevel, 'SAFE');
  assert.equal(res.score, 0);
  assert.equal(res.redFlags.length, 0);
  assert.ok(!res.summary.includes('It directs to verified deriv.com portals'), 'Benign text must not falsely claim it links to Deriv');
});

test('12. Very long message handling (fuzzing boundary test)', () => {
  const repetitiveText = 'Unusual activity detected on your Deriv account. '.repeat(100) + 'Send your 6-digit OTP to @support_bot';
  const res = analyzeMessageLocally(repetitiveText);
  assert.ok(res.score >= 65);
  assert.equal(res.riskLevel, 'SCAM');
});

test('13. Case insensitivity and mixed case manipulation', () => {
  const mixedCaseText = '[uRgEnT] dErIv aCcOuNt fRoZeN wItHiN 2 hOuRs. pRoViDe yOuR oTp cOdE!';
  const res = analyzeMessageLocally(mixedCaseText);
  assert.equal(res.riskLevel, 'SCAM');
  assert.ok(res.redFlags.some(rf => rf.category === 'urgency'));
  assert.ok(res.redFlags.some(rf => rf.category === 'credential'));
});
