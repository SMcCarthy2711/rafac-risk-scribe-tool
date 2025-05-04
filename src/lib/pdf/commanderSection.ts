
import { jsPDF } from 'jspdf';
import { CommanderFields } from '../types';

// Add commander section to the PDF
export const addCommanderSection = (
  doc: jsPDF,
  autoTable: any,
  commanderFields: CommanderFields,
  startY: number,
  margin: number
): number => {
  // Add commander sign-off information in a table with adjusted widths
  autoTable(doc, {
    startY: startY,
    head: [['Commander Name:', 'Commander Post:', 'Commander Date:']],
    body: [[
      commanderFields["Commander Name"], 
      commanderFields["Commander Post"],
      commanderFields["Commander Date"]
    ]],
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 2,
    },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 90 },
      2: { cellWidth: 50 }
    }
  });

  return (doc as any).lastAutoTable.finalY;
};
