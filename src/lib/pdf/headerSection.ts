
import { jsPDF } from 'jspdf';
import { HeaderFields } from '../types';
import { addSvgLogo } from './utils';

// Add header section tables to the PDF - updated to match example image format
export const addHeaderSection = async (
  doc: jsPDF,
  autoTable: any,
  headerFields: HeaderFields,
  startY: number,
  margin: number
): Promise<number> => {
  // First, add the SVG logo at the top
  const pageWidth = doc.internal.pageSize.width;
  let currentY = startY;
  
  // Add the RAFAC SVG header
  currentY = await addSvgLogo(doc, currentY, margin, pageWidth);
  
  // Add some space after the logo
  currentY += 5;
  
  // RAFAC Formation and Assessor info row - fixed margins to prevent overhang
  autoTable(doc, {
    startY: currentY,
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
    tableWidth: 'auto', // Let the table adjust to the content within margins
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 'auto' }
    }
  });
    
  let y = (doc as any).lastAutoTable.finalY;
    
  // Activity Title row - fixed margins to prevent overhang
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
    tableWidth: 'auto', // Let the table adjust to the content within margins
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 'auto' }
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
