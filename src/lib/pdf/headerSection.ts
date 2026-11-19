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
  
  // Bring the first table slightly closer to the diagram.
  const gapAfterLogo = 2; // mm
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

  // Publications takes the left half of the row; RA Review (Step 5) sits on the right half.
  const pageWidth = doc.internal.pageSize.width;
  const halfWidth = (pageWidth - margin * 2) / 2;

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
    margin: { left: margin },
    tableWidth: halfWidth,
    headStyles: {
      fillColor: [5, 52, 133], // Changed to #053485 (RGB: 5, 52, 133)
      textColor: [255, 255, 255], // White text for better contrast
      fontStyle: 'bold'
    }
  });

  const publicationsFinalY = (doc as any).lastAutoTable.finalY;

  // RA Review (Step 5) - right half: the title cell spans both rows as one
  // coloured cell, with 5 date boxes (Original Assessment, Review 1-4) beside it.
  // The date cells stretch down so the bottom of the row meets the risk table
  // (i.e. aligns with the bottom of the taller publications box).
  const reviewTableConfig = (bodyMinHeight: number) => ({
    startY: y,
    head: [[
      { content: 'RA Review (Step 5):', rowSpan: 2, styles: { valign: 'middle' as const } },
      { content: 'Original\nAssessment', styles: { halign: 'center' as const, fontSize: 6 } },
      { content: 'Review 1', styles: { halign: 'center' as const, fontSize: 6 } },
      { content: 'Review 2', styles: { halign: 'center' as const, fontSize: 6 } },
      { content: 'Review 3', styles: { halign: 'center' as const, fontSize: 6 } },
      { content: 'Review 4', styles: { halign: 'center' as const, fontSize: 6 } }
    ]],
    body: [[
      // Placeholder for the column covered by the rowSpan title cell
      { content: '', styles: { minCellHeight: bodyMinHeight } },
      { content: headerFields["Assessment Date"] || '', styles: { halign: 'center' as const, valign: 'middle' as const } },
      { content: headerFields["Review 1 Date"] || '', styles: { halign: 'center' as const, valign: 'middle' as const } },
      { content: headerFields["Review 2 Date"] || '', styles: { halign: 'center' as const, valign: 'middle' as const } },
      { content: headerFields["Review 3 Date"] || '', styles: { halign: 'center' as const, valign: 'middle' as const } },
      { content: headerFields["Review 4 Date"] || '', styles: { halign: 'center' as const, valign: 'middle' as const } }
    ]],
    theme: 'grid',
    styles: {
      fontSize: 7,
      cellPadding: 2,
      lineWidth: 0.1,
    },
    margin: { left: margin + halfWidth },
    tableWidth: halfWidth,
    columnStyles: {
      0: { cellWidth: 28 },
    },
    headStyles: {
      fillColor: [5, 52, 133], // Changed to #053485 (RGB: 5, 52, 133)
      textColor: [255, 255, 255], // White text for better contrast
      fontStyle: 'bold'
    }
  });

  // Measure the exact header row height with a head-only pass on a throwaway
  // document, so the date row can be stretched to end flush with the
  // publications box (no gap above the risk table).
  const measureDoc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const headOnlyConfig = { ...reviewTableConfig(0), body: [] as any[] };
  autoTable(measureDoc, headOnlyConfig);
  const reviewHeadHeight = (measureDoc as any).lastAutoTable.finalY - y;

  const reviewBodyMinHeight = Math.max(0, publicationsFinalY - y - reviewHeadHeight);
  autoTable(doc, reviewTableConfig(reviewBodyMinHeight));

  const reviewFinalY = (doc as any).lastAutoTable.finalY;

  return Math.max(publicationsFinalY, reviewFinalY);
};
