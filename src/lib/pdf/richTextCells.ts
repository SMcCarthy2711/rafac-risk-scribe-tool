import type { jsPDF } from 'jspdf';
import type { CellHookData } from 'jspdf-autotable';
import { richTextPlain, richTextRuns } from '../richText';

export const richCell = (value: string) => ({ content: richTextPlain(value), richText: value, styles: { fontStyle: 'bold' as const } });

// AutoTable handles wrapping and pagination; draw the same lines with their original inline marks.
export function richTextCellHooks(doc: jsPDF) {
  const pending = new WeakMap<object, string[]>();
  const offsets = new Map<object, number>();
  return {
    willDrawCell(data: CellHookData) {
      if (data.section !== 'body' || typeof data.cell.raw !== 'object' || !data.cell.raw || !('richText' in data.cell.raw)) return;
      pending.set(data.cell, [...data.cell.text]);
      data.cell.text = [];
    },
    didDrawCell(data: CellHookData) {
      const lines = pending.get(data.cell);
      if (!lines || typeof data.cell.raw !== 'object' || !data.cell.raw || !('richText' in data.cell.raw)) return;
      data.cell.text = lines;
      const raw = data.cell.raw;
      const runs = richTextRuns(String(raw.richText));
      const text = runs.map(run => run.text).join('');
      let cursor = offsets.get(raw) || 0;
      const size = data.cell.styles.fontSize;
      const scale = doc.internal.scaleFactor;
      const lineHeight = size / scale * doc.getLineHeightFactor();
      let y = data.cell.y + data.cell.padding('top') + size / scale * 0.85;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(size);
      for (const line of lines) {
        const found = text.indexOf(line, cursor);
        const start = found < 0 ? cursor : found;
        const end = start + line.length;
        let offset = 0;
        let x = data.cell.x + data.cell.padding('left');
        for (const run of runs) {
          const a = Math.max(start, offset), b = Math.min(end, offset + run.text.length);
          if (b > a) {
            const part = run.text.slice(a - offset, b - offset);
            doc.setFont('helvetica', run.bold ? (run.italic ? 'bolditalic' : 'bold') : (run.italic ? 'italic' : 'normal'));
            doc.text(part, x, y);
            const width = doc.getTextWidth(part);
            doc.setLineWidth(0.15);
            if (run.underline) doc.line(x, y + 0.4, x + width, y + 0.4);
            if (run.strike) doc.line(x, y - size / scale * 0.3, x + width, y - size / scale * 0.3);
            x += width;
          }
          offset += run.text.length;
        }
        cursor = end;
        y += lineHeight;
      }
      offsets.set(raw, cursor);
    },
  };
}
