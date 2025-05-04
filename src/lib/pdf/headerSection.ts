
import { jsPDF } from 'jspdf';
import { HeaderFields } from '../types';

// Add header section tables to the PDF
export const addHeaderSection = async (
  doc: jsPDF,
  autoTable: any,
  headerFields: HeaderFields,
  startY: number,
  margin: number
): Promise<number> => {
  // Header section with Squadron info - adjusted column widths and adding signature box
  autoTable(doc, {
    startY: startY,
    head: [['RAFAC Formation:', 'Assessor (No, Rank, Name):', 'Signature:', 'Assessment Date:']],
    body: [[
      headerFields.Squadron, 
      headerFields["Assessor Name"],
      '', // Empty cell for signature
      headerFields["Assessment Date"]
    ]],
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 2,
    },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 70 },
      2: { cellWidth: 50 }, // Width for signature box
      3: { cellWidth: 40 }
    }
  });
    
  let y = (doc as any).lastAutoTable.finalY + 3;
    
  // Activity Title - adjusted column widths
  autoTable(doc, {
    startY: y,
    head: [['Activity (Step 1a):', 'Type of Risk Assessment:']],
    body: [[
      headerFields["Activity Title"],
      headerFields["Risk Assessment Type"] || "Generic ☐     Specific ☑"
    ]],
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 2,
    },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 140 },
      1: { cellWidth: 90 }
    }
  });
    
  y = (doc as any).lastAutoTable.finalY + 3;
    
  // Publications - using the user's input from the form
  autoTable(doc, {
    startY: y,
    head: [['Relevant Publications / Pamphlets / Procedures:']],
    body: [[headerFields.Publications || ""]],
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 2,
    },
    margin: { left: margin, right: margin }
  });
    
  return (doc as any).lastAutoTable.finalY + 5;
};
