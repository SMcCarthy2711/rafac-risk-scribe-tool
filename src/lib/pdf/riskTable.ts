
import { jsPDF } from 'jspdf';
import { RiskEntry } from '../types';

// Background colours for rating cells (columns h and m), matching the Risk Score Calculation matrix
const ratingColor = (value: string | undefined): number[] | undefined => {
  const rating = parseInt((value ?? '').trim(), 10);
  if (!Number.isFinite(rating)) return undefined; // blank / non-numeric -> no colour
  const clamped = Math.min(Math.max(rating, 1), 25);
  if (clamped <= 4) return [61, 190, 102];    // green
  if (clamped <= 9) return [135, 216, 92];    // light green
  if (clamped <= 14) return [251, 255, 47];   // yellow
  if (clamped <= 19) return [245, 168, 34];   // orange
  if (clamped <= 24) return [242, 36, 22];    // red
  return [179, 36, 40];                       // dark red (25)
};

// Add risk table to the PDF
export const addRiskTable = (
  doc: jsPDF,
  autoTable: any,
  risks: RiskEntry[],
  startY: number,
  margin: number
): number => {
  // Main risk table headers - with proper typings
  const riskHeaders = [
    [
      { content: '(a)\nRef', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
      { content: '(b)\nActivity', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
      { content: '(c)\nHazards', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
      { content: '(d)\nWho/What', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
      { content: '(e)\nControls', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
      { content: '(f)\nL', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
      { content: '(g)\nI', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
      { content: '(h)\nRating', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
      { content: '(i)\nAccept?', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
      { content: '(j)\nAdditional\nControls', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
      { content: '(k)\nL', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
      { content: '(l)\nI', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
      { content: '(m)\nRevised\nRating', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
      { content: '(n)\nActions', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } }
    ]
  ];

  // Create rows for each risk with wrapped text (no truncation).
  // When a row has no Additional Controls (column j), columns k, l and m stay blank.
  const riskRows = risks.map(risk => {
    const hasAdditionalControls = (risk["Reasonable Additional Control Measures"] ?? "").trim().length > 0;
    return [
      risk.Ref,
      risk["Activity/Element"],
      risk["Hazards Identified"],
      risk["Who or What Might be Harmed and How"],
      risk["Existing Control Measures"],
      { content: risk.Likelihood, styles: { halign: 'center', fontStyle: 'bold' } },
      { content: risk.Impact, styles: { halign: 'center', fontStyle: 'bold' } },
      { content: risk["Risk Rating (LxI)"], styles: { halign: 'center', fontStyle: 'bold' } },
      { content: risk["Is Risk Acceptable"], styles: { halign: 'center', fontStyle: 'bold' } },
      risk["Reasonable Additional Control Measures"],
      { content: hasAdditionalControls ? risk["Revised Likelihood"] : '', styles: { halign: 'center', fontStyle: 'bold' } },
      { content: hasAdditionalControls ? risk["Revised Impact"] : '', styles: { halign: 'center', fontStyle: 'bold' } },
      { content: hasAdditionalControls ? risk["Revised Risk Rating (LxI)"] : '', styles: { halign: 'center', fontStyle: 'bold' } },
      risk["List Required Actions (Who, When and How)"]
    ];
  });

  // Add a default example row if no risks
  if (riskRows.length === 0) {
    riskRows.push([
      'E.g.', 
      'Driving to / from training', 
      'Driver fatigue causes RTA',
      'Injuries to personnel',
      'Designated drivers · JSP800',
      { content: '2', styles: { halign: 'center', fontStyle: 'bold' } }, 
      { content: '5', styles: { halign: 'center', fontStyle: 'bold' } }, 
      { content: '10', styles: { halign: 'center', fontStyle: 'bold' } },
      { content: 'NO', styles: { halign: 'center', fontStyle: 'bold' } },
      'Vehicle commander to monitor',
      { content: '1', styles: { halign: 'center', fontStyle: 'bold' } },
      { content: '5', styles: { halign: 'center', fontStyle: 'bold' } },
      { content: '5', styles: { halign: 'center', fontStyle: 'bold' } },
      'CFAV to implement controls'
    ]);
  }

  // Create the main risk table with optimized column widths and text wrapping
  autoTable(doc, {
    startY: startY,
    head: riskHeaders,
    body: riskRows,
    theme: 'grid',
    styles: {
      fontSize: 7,
      cellPadding: 1,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      overflow: 'linebreak' as const, // Enable text wrapping
    },
    margin: { left: margin, right: margin },
    tableWidth: 'auto', // Let the table adjust to the content within margins
    // Remove fixed column widths to allow automatic adjustment
    columnStyles: {
      // Keep minimal width guidance for the narrow columns while allowing flexibility
      5: { cellWidth: 'auto' }, // Likelihood
      6: { cellWidth: 'auto' }, // Impact
      7: { cellWidth: 'auto' }, // Rating
      8: { cellWidth: 'auto' }, // Accept?
      10: { cellWidth: 'auto' }, // Revised L
      11: { cellWidth: 'auto' }, // Revised I
      12: { cellWidth: 'auto' }, // Revised Rating
    },
    headStyles: {
      fillColor: [5, 52, 133], // Changed from [240, 240, 240] to #053485 (RGB: 5, 52, 133)
      textColor: [255, 255, 255], // Changed text color to white for better contrast
      fontStyle: 'bold',
      fontSize: 7
    }
  });

  return (doc as any).lastAutoTable.finalY + 5;
};
