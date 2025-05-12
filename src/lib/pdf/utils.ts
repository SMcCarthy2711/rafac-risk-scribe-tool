
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

// Helper function to add an SVG image to the PDF with proper margins
export const addSvgImage = async (doc: jsPDF, svgUrl: string, startY: number, margin: number, width: number) => {
  try {
    // Calculate height based on width to maintain aspect ratio
    // You can adjust the aspect ratio as needed for your specific SVG
    const height = width * 0.25; // Assuming a 4:1 aspect ratio, adjust as needed
    
    // Add the SVG image to the document
    doc.addImage(svgUrl, 'SVG', margin, startY, width, height);
    
    // Return the Y position after the image for further content
    return startY + height;
  } catch (error) {
    console.error("Error adding SVG image:", error);
    return startY; // Return original position if there's an error
  }
};
