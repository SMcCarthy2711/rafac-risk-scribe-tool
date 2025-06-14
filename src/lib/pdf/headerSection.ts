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
  
  // Add exactly 10px gap (converted to mm) after the logo before the tables
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
    
  // Activity Title row - clean and show only the selected risk assessment type
  let riskTypeDisplay: string = headerFields["Risk Assessment Type"] || "Generic";
  
  // Clean the risk type display to remove any unwanted characters
  riskTypeDisplay = riskTypeDisplay.trim();
  
  // Remove any potential HTML entities, checkboxes, or special characters
  riskTypeDisplay = riskTypeDisplay.replace(/&[^;]+;/g, ''); // Remove HTML entities like &amp;
  riskTypeDisplay = riskTypeDisplay.replace(/[☑☐✓✗]/g, ''); // Remove checkbox symbols
  riskTypeDisplay = riskTypeDisplay.replace(/[&]/g, ''); // Remove & characters
  riskTypeDisplay = riskTypeDisplay.trim(); // Trim again after cleaning
  
  // Ensure we only have "Generic" or "Specific"
  let finalRiskType: "Generic" | "Specific";
  if (riskTypeDisplay.toLowerCase().includes('generic')) {
    finalRiskType = 'Generic';
  } else if (riskTypeDisplay.toLowerCase().includes('specific')) {
    finalRiskType = 'Specific';
  } else {
    finalRiskType = 'Generic'; // Default fallback
  }
  
  autoTable(doc, {
    startY: y,
    head: [['Activity (Step 1a):', 'Type of Risk Assessment:']],
    body: [[
      headerFields["Activity Title"],
      finalRiskType
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
