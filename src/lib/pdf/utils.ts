
import { jsPDF } from 'jspdf';

// Helper function to truncate text if needed
export const truncateText = (text: string, maxLength: number) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

// Helper function to set the basic PDF document settings
export const createPdfDocument = () => {
  return new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });
};

// Add header information to the PDF - updated to match example image
export const addPdfHeader = (doc: jsPDF, margin: number, pageWidth: number) => {
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text("Uncontrolled copy when printed", margin, margin);
  doc.text("RAFAC Form 5010(c)", pageWidth - 35, margin);
};

// Add version number at bottom of page - updated to match example image
export const addVersionNumber = (doc: jsPDF, pageWidth: number, pageHeight: number) => {
  doc.setFontSize(8);
  doc.text("Version: 2.0", pageWidth - 25, pageHeight - 5);
};
