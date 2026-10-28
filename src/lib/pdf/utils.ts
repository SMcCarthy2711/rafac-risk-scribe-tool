
import { jsPDF } from 'jspdf';
import { svg2pdf } from 'svg2pdf.js';

// Truncate text to a maximum length
export const truncateText = (text: string, maxLength: number): string =>
  !text ? '' : text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

// Create a new jsPDF document
export const createPdfDocument = (): jsPDF =>
  new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

// Add SVG logo to the top of page 1 - with 10px margins on all sides
export const addSvgLogo = async (
  doc: jsPDF,
  margin: number
): Promise<number> => {
  // 10px margins converted to mm (1px ≈ 0.352778mm)
  const logoMargin = 10 * 0.352778;
  // Shift all content down by a further 10px so the header sits clear of the page top.
  const topOffset = 10 * 0.352778;
  try {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Set specific margins for the logo (10px converted to mm)
    
    // Calculate logo width accounting for left and right margins
    const logoWidth = pageWidth - (logoMargin * 2); // Subtract both left and right margins
    console.log(`Page dimensions: ${pageWidth}mm x ${pageHeight}mm`);

    // Try to load SVG from public directory
    const svgUrl = '/RAFAC_RISK_Header.svg';
    console.log(`Attempting to load SVG from: ${svgUrl}`);
    
    const response = await fetch(svgUrl);
    console.log(`Fetch response status: ${response.status}`);
    console.log(`Fetch response ok: ${response.ok}`);
    
    if (!response.ok) {
      throw new Error(`Failed to load SVG: ${response.status} - ${response.statusText}`);
    }
    
    const svgText = await response.text();
    console.log(`SVG loaded successfully, content length: ${svgText.length}`);
    console.log(`SVG content preview: ${svgText.substring(0, 200)}...`);
    
    // Clean up the SVG text - remove any BOM or extra whitespace
    const cleanSvgText = svgText.trim().replace(/^\uFEFF/, '');
    
    // Parse the SVG as DOM element
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(cleanSvgText, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;
    const viewBox = svgElement.getAttribute('viewBox')?.trim().split(/[\s,]+/).map(Number);
    const aspectRatio = viewBox && viewBox.length === 4 && viewBox[2] > 0 && viewBox[3] > 0
      ? viewBox[2] / viewBox[3]
      : 1107 / 255;
    // Match the drawing's aspect ratio so unused viewport space does not inflate the table gap.
    const logoHeight = logoWidth / aspectRatio;
    
    console.log('Parsed SVG element successfully');
    
    // Use svg2pdf to convert and add the SVG with 10px side margins and the extra 10px top offset
    await svg2pdf(svgElement, doc, {
      x: logoMargin, // 10px left margin
      y: logoMargin + topOffset, // 10px top margin, shifted down 10px more
      width: logoWidth,
      height: logoHeight
    });
    
    console.log(`SVG added to PDF using svg2pdf at position (${logoMargin}, ${logoMargin + topOffset}) with size ${logoWidth}x${logoHeight}`);
    return logoMargin + topOffset + logoHeight; // Return position after logo (no extra gap here)

  } catch (error) {
    console.error('Error in addSvgLogo:', error);
    
    // Fallback: add a text header if SVG fails
    doc.setFontSize(16);
    doc.setTextColor(5, 52, 133);
    doc.text('RAFAC RISK ASSESSMENT', logoMargin, logoMargin + topOffset + 10);
    console.log('Added fallback text header due to SVG loading failure');
    
    return logoMargin + topOffset + 20;
  }
};

// Add header text to the PDF
export const addPdfHeader = (doc: jsPDF, margin: number, pageWidth: number): void => {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(128, 128, 128);
  // Keep the labels above the diagram, which starts at the 10px top margin.
  doc.text('Uncontrolled copy when Printed', margin, 2.5);
  doc.text('RAFAC Form 5010(c)', pageWidth - margin, 2.5, { align: 'right' });
};

// Add version info to the bottom of the PDF
export const addVersionNumber = (
  doc: jsPDF,
  pageWidth: number,
  pageHeight: number,
  margin = 12
): void => {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(128, 128, 128);
  doc.text('Version 2.0x', pageWidth - margin, pageHeight - 5, { align: 'right' });
};
