import { jsPDF } from 'jspdf';
import RAFACSVG from '@/lib/pdf/RAFAC RISK Headder-2.svg';

// Truncate text to a maximum length
export const truncateText = (text: string, maxLength: number): string =>
  !text ? '' : text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

// Create a new jsPDF document
export const createPdfDocument = (): jsPDF =>
  new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

// Add SVG logo to the top of page 1
export const addSvgLogo = async (
  doc: jsPDF,
  margin: number
): Promise<number> => {
  try {
    const pageWidth = doc.internal.pageSize.getWidth();
    const aspectRatio = 1107 / 255;
    const logoWidth = pageWidth - margin * 2;
    const logoHeight = logoWidth / aspectRatio;

    const svgUrl = RAFACSVG;
    const response = await fetch(svgUrl);
    const svgText = await response.text();
    const svgBase64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgText)));

    doc.addImage(svgBase64, 'SVG', margin, margin, logoWidth, logoHeight);
    console.log(`RAFAC SVG header added: ${logoWidth}mm x ${logoHeight}mm`);

    return margin + logoHeight;
  } catch (error) {
    console.error('Error adding RAFAC SVG header:', error);
    return margin;
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
