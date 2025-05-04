
import { jsPDF } from 'jspdf';
import { DynamicFields } from '../types';

// Add dynamic risk assessment section to the PDF if provided
export const addDynamicSection = (
  doc: jsPDF,
  autoTable: any,
  dynamicFields: DynamicFields,
  startY: number,
  margin: number
): number => {
  // Check if any dynamic fields are provided before adding this section
  if (!dynamicFields["Dynamic Reason"] && 
      !dynamicFields["New Restrictions"] && 
      !dynamicFields.Remarks) {
    return startY; // Return same Y position if no dynamic fields to add
  }

  autoTable(doc, {
    startY: startY,
    head: [['Dynamic Risk Assessment']],
    body: [['']],
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 2,
      fontStyle: 'bold' as const
    },
    margin: { left: margin, right: margin }
  });
      
  let y = (doc as any).lastAutoTable.finalY;
      
  autoTable(doc, {
    startY: y,
    head: [['Dynamic Reason:', 'New Restrictions:', 'Remarks:']],
    body: [[
      dynamicFields["Dynamic Reason"], 
      dynamicFields["New Restrictions"],
      dynamicFields.Remarks
    ]],
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 2,
      overflow: 'linebreak' as const, // Enable text wrapping
    },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 90 },
      2: { cellWidth: 50 }
    }
  });
      
  y = (doc as any).lastAutoTable.finalY;
      
  autoTable(doc, {
    startY: y,
    head: [['Dynamic Officer Name:', 'Dynamic Officer Post:', 'Dynamic Date:']],
    body: [[
      dynamicFields["Dynamic Officer Name"], 
      dynamicFields["Dynamic Officer Post"],
      dynamicFields["Dynamic Date"]
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
