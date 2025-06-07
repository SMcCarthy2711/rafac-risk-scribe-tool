
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
  // First, add the SVG logo at the top with 10px margin
  let currentY = startY;
  
  // Add the RAFAC SVG header
  currentY = await addSvgLogo(doc, margin);
  
  // Add 10px gap (converted to mm) after the logo before the tables
  const gapAfterLogo = 10 * 0.352778; // Convert 10px to mm
  currentY += gapAfterLogo;
  
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
    },
    headStyles: {
      fillColor: [5, 52, 133], // Changed to #053485 (RGB: 5, 52, 133)
      textColor: [255, 255, 255], // White text for better contrast
      fontStyle: 'bold'
    }
  });
    
  let y = (doc as any).lastAutoTable.finalY;
    
  // Activity Title row - format the risk assessment type with bold/strikethrough
  const isGeneric = headerFields["Risk Assessment Type"] === "Generic";
  
  // Create formatted text with HTML-like tags for jsPDF
  const genericText = isGeneric ? "**Generic ☑**" : "~~Generic ☐~~";
  const specificText = !isGeneric ? "**Specific ☑**" : "~~Specific ☐~~";
  const riskTypeDisplay = `${genericText}    ${specificText}`;
  
  autoTable(doc, {
    startY: y,
    head: [['Activity (Step 1a):', 'Type of Risk Assessment:']],
    body: [[
      headerFields["Activity Title"],
      riskTypeDisplay
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
    },
    headStyles: {
      fillColor: [5, 52, 133], // Changed to #053485 (RGB: 5, 52, 133)
      textColor: [255, 255, 255], // White text for better contrast
      fontStyle: 'bold'
    },
    // Custom styling for the risk assessment type cell
    didParseCell: function(data: any) {
      if (data.row.index === 0 && data.column.index === 1) {
        // Parse the text to apply formatting
        const text = data.cell.text[0];
        if (text.includes('**') || text.includes('~~')) {
          // Split the text and apply formatting
          const parts = text.split('    ');
          let formattedText = '';
          
          parts.forEach((part: string, index: number) => {
            if (part.includes('**')) {
              // Bold formatting for selected option
              const cleanText = part.replace(/\*\*/g, '');
              formattedText += cleanText;
            } else if (part.includes('~~')) {
              // Strikethrough formatting for unselected option
              const cleanText = part.replace(/~~/g, '');
              formattedText += cleanText;
            } else {
              formattedText += part;
            }
            
            if (index < parts.length - 1) {
              formattedText += '    ';
            }
          });
          
          data.cell.text = [formattedText];
        }
      }
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
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: [5, 52, 133], // Changed to #053485 (RGB: 5, 52, 133)
      textColor: [255, 255, 255], // White text for better contrast
      fontStyle: 'bold'
    }
  });
    
  return (doc as any).lastAutoTable.finalY;
};
