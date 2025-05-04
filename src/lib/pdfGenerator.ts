
import { RiskAssessment } from "./types";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { createPdfDocument, addPdfHeader, addVersionNumber } from './pdf/utils';
import { addRiskMatrix } from './pdf/riskMatrix';
import { addHeaderSection } from './pdf/headerSection';
import { addRiskTable } from './pdf/riskTable';
import { addCommanderSection } from './pdf/commanderSection';
import { addDynamicSection } from './pdf/dynamicSection';

const exportToPDF = async (assessment: RiskAssessment) => {
  try {
    // Import the required libraries
    const { default: autoTable } = await import('jspdf-autotable');
    
    // Create a new document in landscape orientation
    const doc = createPdfDocument();
    
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Define margins to prevent content from going off page
    const margin = 10;
    const effectiveWidth = pageWidth - (2 * margin);
    
    // Add header - Form title and "Uncontrolled copy when printed"
    addPdfHeader(doc, margin, pageWidth);
    
    // Add guidance and risk matrix image from the provided image
    const matrixStartY = margin + 10;
    const matrixHeight = 70;
    
    // Add the risk matrix image
    await addRiskMatrix(doc, matrixStartY, matrixHeight, margin, effectiveWidth);
    
    // Now add the main form fields with better spacing
    let y = matrixStartY + matrixHeight + 5;
    
    // Add header section with Squadron info
    y = await addHeaderSection(doc, autoTable, assessment.header, y, margin);
    
    // Add risk table
    y = addRiskTable(doc, autoTable, assessment.risks, y, margin);
    
    // Add commander sign-off information
    y = addCommanderSection(doc, autoTable, assessment.commander, y, margin);
    
    // Add Dynamic RA information if provided
    y = addDynamicSection(doc, autoTable, assessment.dynamic, y + 5, margin);
    
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
