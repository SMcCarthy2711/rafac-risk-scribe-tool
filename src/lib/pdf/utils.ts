
import { jsPDF } from 'jspdf';
import 'svg2pdf.js';

// Truncate text to a maximum length
export const truncateText = (text: string, maxLength: number): string =>
  !text ? '' : text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

// Create a new jsPDF document
export const createPdfDocument = (): jsPDF =>
  new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

// Add SVG logo to the top of page 1 - taking up 1/4 of the page
export const addSvgLogo = async (
  doc: jsPDF,
  margin: number
): Promise<number> => {
  try {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Calculate logo dimensions to take up 1/4 of the page height
    const logoHeight = pageHeight / 4;
    const logoWidth = pageWidth - margin * 2;

    console.log(`Page dimensions: ${pageWidth}mm x ${pageHeight}mm`);
    console.log(`Logo will be: ${logoWidth}mm x ${logoHeight}mm`);

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
    
    console.log('Parsed SVG element successfully');
    
    // Use svg2pdf to convert and add the SVG
    const { svg2pdf } = await import('svg2pdf.js');
    await svg2pdf(svgElement, doc, {
      x: margin,
      y: margin,
      width: logoWidth,
      height: logoHeight
    });
    
    console.log(`SVG added to PDF using svg2pdf at position (${margin}, ${margin}) with size ${logoWidth}x${logoHeight}`);
    return margin + logoHeight + 5;

  } catch (error) {
    console.error('Error in addSvgLogo:', error);
    
    // Fallback: add a text header if SVG fails
    doc.setFontSize(16);
    doc.setTextColor(5, 52, 133);
    doc.text('RAFAC RISK ASSESSMENT', margin, margin + 10);
    console.log('Added fallback text header due to SVG loading failure');
    
    return margin + 20;
  }
};

// Add header text to the PDF
export const addPdfHeader = (doc: jsPDF, margin: number, pageWidth: number): void => {
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('Uncontrolled copy when printed', margin, margin);
  doc.text('RAFAC Form 5010(c)', pageWidth - 35, margin);
};

// Add version info to the bottom of the PDF
export const addVersionNumber = (
  doc: jsPDF,
  pageWidth: number,
  pageHeight: number
): void => {
  doc.setFontSize(8);
  doc.text('Version: 2.0X', pageWidth - 25, pageHeight - 5);
};
