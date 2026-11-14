import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import React from 'react';

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost:3000' });
Object.defineProperty(globalThis, 'window', { value: dom.window, configurable: true });
Object.defineProperty(globalThis, 'document', { value: dom.window.document, configurable: true });
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
Object.defineProperty(globalThis, 'HTMLElement', { value: dom.window.HTMLElement, configurable: true });
Object.defineProperty(globalThis, 'Element', { value: dom.window.Element, configurable: true });
Object.defineProperty(globalThis, 'localStorage', { value: dom.window.localStorage, configurable: true });
Object.defineProperty(globalThis, 'sessionStorage', { value: dom.window.sessionStorage, configurable: true });
Object.defineProperty(globalThis, 'requestAnimationFrame', { value: (callback: FrameRequestCallback) => setTimeout(callback, 0), configurable: true });
Object.defineProperty(globalThis, 'cancelAnimationFrame', { value: clearTimeout, configurable: true });
dom.window.matchMedia = () => ({ matches: true, media: '', onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } });
dom.window.Element.prototype.scrollIntoView = () => {};

test('editing clears the verdict; a new local scan uses the edited message and resets the checklist', async () => {
  const { render, screen, fireEvent, waitFor, cleanup } = await import('@testing-library/react');
  const { default: Home } = await import('../src/app/page.tsx');
  let postCount = 0;
  const originalFetch = globalThis.fetch;
  const copied: string[] = [];
  Object.defineProperty(dom.window.navigator, 'clipboard', { value: { writeText: async (text: string) => { copied.push(text); } }, configurable: true });
  globalThis.fetch = async (input, init) => {
    if (init?.method === 'POST') postCount += 1;
    return new Response(JSON.stringify({ serverAiAvailable: false }), { status: 200 });
  };

  try {
    render(<Home />);
    await waitFor(() => assert.ok(screen.getByText('What this message tells us')));
    fireEvent.click(screen.getAllByRole('button', { name: 'Mark checked' })[0]);
    assert.ok(screen.getByText('1 of 5 Checked'));

    const textarea = screen.getByLabelText('Suspicious Message Content') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'A new message about lunch.' } });
    assert.equal(screen.queryByText('What this message tells us'), null);

    fireEvent.click(screen.getByRole('button', { name: 'Analyze Message' }));
    await waitFor(() => assert.ok(screen.getByText('What this message tells us')));
    assert.ok(screen.getByText('0 of 5 Checked'));
    assert.equal(postCount, 0, 'default scans must not send the message to the server');

    fireEvent.click(screen.getByRole('button', { name: 'Copy full report' }));
    await waitFor(() => assert.equal(copied.length, 1));
    assert.match(copied[0], /A new message about lunch/);
    assert.ok(!copied[0].includes('CR982314'));
  } finally {
    cleanup();
    globalThis.fetch = originalFetch;
  }
});

test('Gemini runs only when selected and a fallback is disclosed beside the verdict', async () => {
  const { render, screen, fireEvent, waitFor, cleanup } = await import('@testing-library/react');
  const { default: Home } = await import('../src/app/page.tsx');
  const { analyzeMessageLocally } = await import('../src/lib/detector.ts');
  const originalFetch = globalThis.fetch;
  let postCount = 0;
  globalThis.fetch = async (_input, init) => {
    if (init?.method === 'POST') {
      postCount += 1;
      return new Response(JSON.stringify(analyzeMessageLocally('A routine message.')), { status: 200 });
    }
    return new Response(JSON.stringify({ serverAiAvailable: true }), { status: 200 });
  };

  try {
    render(<Home />);
    await waitFor(() => assert.ok(screen.getByText('What this message tells us')));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Use Gemini for this scan' }));
    fireEvent.click(screen.getByRole('button', { name: 'Analyze Message' }));
    await waitFor(() => assert.ok(screen.getByText(/Gemini was unavailable/)));
    assert.equal(postCount, 1);
    assert.equal((screen.getByRole('checkbox', { name: 'Use Gemini for this scan' }) as HTMLInputElement).checked, false);
  } finally {
    cleanup();
    globalThis.fetch = originalFetch;
  }
});
