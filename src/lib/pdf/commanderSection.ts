
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
  // Add commander sign-off information in a table with full width
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
    headStyles: {
      fillColor: [5, 52, 133], // Changed to #053485 (RGB: 5, 52, 133)
      textColor: [255, 255, 255], // White text for better contrast
      fontStyle: 'bold'
    }
    // Removed column styles to ensure full width matching the publications table
  });

  return (doc as any).lastAutoTable.finalY;
};
