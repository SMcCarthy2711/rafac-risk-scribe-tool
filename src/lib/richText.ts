import DOMPurify from 'dompurify';

export interface TextRun { text: string; bold?: boolean; italic?: boolean; underline?: boolean; strike?: boolean }
const allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'ul', 'ol', 'li'];
export const isRichText = (value: string) => /<\/?(?:p|br|strong|b|em|i|u|s|strike|ul|ol|li)(?:\s[^>]*)?\s*\/?>/i.test(value);
export const sanitizeRichText = (value: string) => DOMPurify.sanitize(value, { ALLOWED_TAGS: allowedTags, ALLOWED_ATTR: [] });
export const editorContent = (value: string) => isRichText(value) ? sanitizeRichText(value) : value.split('\n').map(line => `<p>${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`).join('');

export function richTextRuns(value: string): TextRun[] {
  if (!isRichText(value)) return [{ text: value }];
  const root = document.createElement('div');
  root.innerHTML = sanitizeRichText(value);
  const runs: TextRun[] = [];
  const append = (text: string, style: Omit<TextRun, 'text'> = {}) => { if (text) runs.push({ text, ...style }); };
  const newline = () => { if (runs.length && !runs[runs.length - 1].text.endsWith('\n')) append('\n'); };
  const walk = (node: Node, style: Omit<TextRun, 'text'> = {}) => {
    if (node.nodeType === 3) { append(node.textContent || '', style); return; }
    if (!(node instanceof Element)) return;
    const tag = node.tagName.toLowerCase();
    if (tag === 'br') { append('\n'); return; }
    const firstListParagraph = tag === 'p' && node.parentElement?.tagName === 'LI' && node === node.parentElement.firstElementChild;
    if (['p', 'li', 'ul', 'ol'].includes(tag) && !firstListParagraph) newline();
    if (tag === 'li') {
      const siblings = Array.from(node.parentElement?.children || []);
      append(node.parentElement?.tagName === 'OL' ? `${siblings.indexOf(node) + 1}. ` : '• ', style);
    }
    const next = { ...style, bold: style.bold || ['strong', 'b'].includes(tag), italic: style.italic || ['em', 'i'].includes(tag), underline: style.underline || tag === 'u', strike: style.strike || ['s', 'strike'].includes(tag) };
    node.childNodes.forEach(child => walk(child, next));
    if (['p', 'li', 'ul', 'ol'].includes(tag)) newline();
  };
  root.childNodes.forEach(node => walk(node));
  while (runs.at(-1)?.text === '\n') runs.pop();
  return runs;
}
export const richTextPlain = (value: string) => richTextRuns(value || '').map(run => run.text).join('');
