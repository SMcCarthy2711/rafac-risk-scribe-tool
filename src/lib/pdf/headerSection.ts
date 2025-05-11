
import { jsPDF } from 'jspdf';
import { HeaderFields } from '../types';

// Add header section tables to the PDF - updated to match example image format
export const addHeaderSection = async (
  doc: jsPDF,
  autoTable: any,
  headerFields: HeaderFields,
  startY: number,
  margin: number
): Promise<number> => {
  
  // Top row with two merged cells
  autoTable(doc, {
    startY: startY,
    head: [['RAFAC Risk Assessment Form', 'For Cadet Activities']],
    theme: 'grid',
    styles: {
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
      cellPadding: 2,
      lineWidth: 0.1,
    },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 165 },
      1: { cellWidth: 165 }
    }
  });
  
  let y = (doc as any).lastAutoTable.finalY;
  
  // Second row with one merged cell spanning the width
  autoTable(doc, {
    startY: y,
    body: [['This form is used to record the risk assessment process for RAF Air Cadet activities.']],
    theme: 'grid',
    styles: {
      fontSize: 9,
      halign: 'center',
      cellPadding: 2,
      lineWidth: 0.1,
    },
    margin: { left: margin, right: margin }
  });
  
  y = (doc as any).lastAutoTable.finalY;
  
  // RAFAC Formation and Assessor info row
  autoTable(doc, {
    startY: y,
    head: [['RAFAC Formation:', 'Assessor (No, Rank, Name):', 'Assessor\'s Signature:', 'Assessment Date:']],
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
      lineWidth: 0.1,
    },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 110 },
      1: { cellWidth: 110 },
      2: { cellWidth: 70 },
      3: { cellWidth: 40 }
    }
  });
    
  y = (doc as any).lastAutoTable.finalY;
    
  // Activity Title row - with "Step 1a" annotation like in the example
  autoTable(doc, {
    startY: y,
    head: [['Activity (Step 1a):', 'Type of Risk Assessment:']],
    body: [[
      headerFields["Activity Title"],
      headerFields["Risk Assessment Type"] ? headerFields["Risk Assessment Type"] : 
      `Generic ${headerFields["Risk Assessment Type"] === "Generic" ? "☑" : "☐"}     Specific ${headerFields["Risk Assessment Type"] === "Specific" ? "☑" : "☐"}`
    ]],
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 2,
      lineWidth: 0.1,
    },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 220 },
      1: { cellWidth: 110 }
    }
  });
    
  y = (doc as any).lastAutoTable.finalY;
    
  // Publications - create a numbered list format similar to the example
  const publicationsText = headerFields.Publications || "";
  const publications = publicationsText.split('\n').map((item, index) => `${index + 1}.    ${item.trim()}`).join('\n');
  
  autoTable(doc, {
    startY: y,
    head: [['Relevant Publications / Pamphlets / Procedures:']],
    body: [[publications]],
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 2,
      lineWidth: 0.1,
    },
    margin: { left: margin, right: margin }
  });
    
  return (doc as any).lastAutoTable.finalY;
};

