import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
const { window } = new JSDOM('');
Object.assign(globalThis, { window, document: window.document, Element: window.Element, Node: window.Node });
const { richTextPlain, richTextRuns, sanitizeRichText } = await import('./richText');
test('legacy plain text is preserved', () => { assert.equal(richTextPlain('Cadets & staff\nKeep clear'), 'Cadets & staff\nKeep clear'); });
test('all requested inline styles survive conversion', () => {
  const runs = richTextRuns('<p><strong>Bold</strong><em>Italic</em><u>Underline</u><s>Strike</s></p>');
  assert.equal(runs.find(r => r.text === 'Bold')?.bold, true);
  assert.equal(runs.find(r => r.text === 'Italic')?.italic, true);
  assert.equal(runs.find(r => r.text === 'Underline')?.underline, true);
  assert.equal(runs.find(r => r.text === 'Strike')?.strike, true);
});
test('numbered and bullet lists retain separate items', () => { assert.equal(richTextPlain('<ul><li><p>Kit</p></li><li><p>Water</p></li></ul><ol><li>Check</li><li>Brief</li></ol>'), '• Kit\n• Water\n1. Check\n2. Brief'); });
test('empty formatted additional controls remain empty', () => { assert.equal(richTextPlain('<p><br></p>').trim(), ''); });
test('unsafe markup is removed', () => { assert.equal(sanitizeRichText('<p onclick="alert(1)">Safe</p><script>alert(1)</script><img src=x onerror=alert(1)>'), '<p>Safe</p>'); });
