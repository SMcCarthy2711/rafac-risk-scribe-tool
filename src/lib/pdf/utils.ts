
import { jsPDF } from 'jspdf';
import RAFACSVG from '../pdf/RAFAC RISK Headder-2.svg';

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

// Add SVG logo to the top of the PDF with specific dimensions (1107x255)
export const addSvgLogo = async (doc: jsPDF, startY: number, margin: number, pageWidth: number) => {
  try {
    // Convert the specified dimensions (1107x255) to appropriate scale for PDF
    // For reference: A4 landscape is 297mm x 210mm
    // We need to scale the large SVG dimensions down to fit the page width while maintaining aspect ratio
    
    // Calculate aspect ratio of the original SVG
    const aspectRatio = 1107 / 255;
    
    // Calculate the width to use (page width minus margins)
    const logoWidth = pageWidth - (margin * 2);
    
    // Calculate height based on the aspect ratio
    const logoHeight = logoWidth / aspectRatio;
    
    console.log(`Adding SVG with width: ${logoWidth}mm, height: ${logoHeight}mm`);
    
    // Add the SVG image to the document
    doc.addImage(RAFACSVG, 'SVG', margin, startY, logoWidth, logoHeight);
    
    console.log("RAFAC SVG header added successfully");
    
    // Return the Y position after the image for further content
    return startY + logoHeight;
  } catch (error) {
    console.error("Error adding RAFAC SVG header:", error);
    return startY; // Return original position if there's an error
  }
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

// Helper function to add a PNG image to the PDF with proper margins
export const addPngImage = async (doc: jsPDF, imagePath: string, startY: number, margin: number, width: number) => {
  try {
    // Calculate height based on width to maintain aspect ratio
    const height = width * 0.3; // Adjust aspect ratio as needed for the PNG
    
    // Add the PNG image to the document
    doc.addImage(imagePath, 'PNG', margin, startY, width, height);
    
    console.log("PNG image added successfully");
    
    // Return the Y position after the image for further content
    return startY + height;
  } catch (error) {
    console.error("Error adding PNG image:", error);
    return startY; // Return original position if there's an error
  }
};

// Keep the SVG function for backward compatibility
export const addSvgImage = async (doc: jsPDF, svgData: string, startY: number, margin: number, width: number) => {
  try {
    // Calculate height based on width to maintain aspect ratio
    const height = width * 0.25; // Assuming a 4:1 aspect ratio, adjust as needed
    
    // For SVGs: ensure it has proper encoding
    // If it's a URL or base64, it should work directly
    // If not, we need to encode it
    let processedSvgData = svgData;
    
    // If not already a data URL and not an HTTP URL, convert to data URL
    if (!svgData.startsWith('data:') && !svgData.startsWith('http')) {
      processedSvgData = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
    
    // Add the SVG image to the document
    doc.addImage(processedSvgData, 'SVG', margin, startY, width, height);
    
    console.log("SVG image added successfully");
    
    // Return the Y position after the image for further content
    return startY + height;
  } catch (error) {
    console.error("Error adding SVG image:", error);
    return startY; // Return original position if there's an error
  }
};
