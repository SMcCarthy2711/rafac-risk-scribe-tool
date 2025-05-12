
import { RiskAssessment } from "./types";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { createPdfDocument, addPdfHeader, addVersionNumber, addSvgImage } from './pdf/utils';
import { addHeaderSection } from './pdf/headerSection';
import { addRiskTable } from './pdf/riskTable';
import { addCommanderSection } from './pdf/commanderSection';
import { addDynamicSection } from './pdf/dynamicSection';

// SVG placeholder - replace with your actual SVG
const placeholderSvg = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgNjAwIDE1MCI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YwZjBmMCIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPgogICAgUkFGQUMgUmlzayBNYXRyaXggKFJlcGxhY2Ugd2l0aCB5b3VyIFNWRykKICA8L3RleHQ+Cjwvc3ZnPg==';

const exportToPDF = async (assessment: RiskAssessment) => {
  try {
    // Import the required libraries
    const { default: autoTable } = await import('jspdf-autotable');
    
    // Create a new document in landscape orientation
    const doc = createPdfDocument();
    
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Define consistent margins for all tables - increased margin for better presentation
    const margin = 12; // Increased from 10 to 12
    const effectiveWidth = pageWidth - (2 * margin);
    
    // Add header - Form title and "Uncontrolled copy when printed"
    addPdfHeader(doc, margin, pageWidth);
    
    // Add SVG image instead of risk matrix
    const matrixStartY = margin + 5;
    
    // Add the SVG image with consistent margins
    const yAfterImage = await addSvgImage(doc, placeholderSvg, matrixStartY, margin, effectiveWidth);
    
    // Now add the main form fields with better spacing
    const y = yAfterImage + 10; // Add space after the SVG
    
    // Add header section with Squadron info - using the same margins for all tables
    const headerSectionY = await addHeaderSection(doc, autoTable, assessment.header, y, margin);
    
    // Add risk table
    const riskTableY = addRiskTable(doc, autoTable, assessment.risks, headerSectionY, margin);
    
    // Add commander sign-off information
    const commanderSectionY = addCommanderSection(doc, autoTable, assessment.commander, riskTableY, margin);
    
    // Add Dynamic RA information if provided
    const dynamicSectionY = addDynamicSection(doc, autoTable, assessment.dynamic, commanderSectionY + 5, margin);
    
    // Add version number at bottom right
    addVersionNumber(doc, pageWidth, pageHeight);
    
    // Save the PDF
    doc.save('RAFAC_Risk_Assessment_5010c.pdf');
    
    return true;
  } catch (error) {
    console.error("Error generating PDF: ", error);
    return false;
  }
};

export default exportToPDF;
