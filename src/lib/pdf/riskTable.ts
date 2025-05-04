import { jsPDF } from 'jspdf';
import { RiskEntry } from '../types';

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

  // Create rows for each risk with wrapped text (no truncation)
  const riskRows = risks.map(risk => [
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
    { content: risk["Revised Likelihood"], styles: { halign: 'center', fontStyle: 'bold' } },
    { content: risk["Revised Impact"], styles: { halign: 'center', fontStyle: 'bold' } },
    { content: risk["Revised Risk Rating (LxI)"], styles: { halign: 'center', fontStyle: 'bold' } },
    risk["List Required Actions (Who, When and How)"]
  ]);

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
    // Keep column widths but ensure overall table respects margin
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 30 },
      5: { cellWidth: 8 },
      6: { cellWidth: 8 },
      7: { cellWidth: 12 },
      8: { cellWidth: 15 },
      9: { cellWidth: 25 },
      10: { cellWidth: 8 },
      11: { cellWidth: 8 },
      12: { cellWidth: 15 },
      13: { cellWidth: 25 },
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      fontSize: 7
    }
  });

  return (doc as any).lastAutoTable.finalY + 5;
};
