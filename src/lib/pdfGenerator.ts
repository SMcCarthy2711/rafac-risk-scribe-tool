
import { RiskAssessment } from "./types";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { createPdfDocument, addPdfHeader, addVersionNumber, addSvgImage } from './pdf/utils';
import { addHeaderSection } from './pdf/headerSection';
import { addRiskTable } from './pdf/riskTable';
import { addCommanderSection } from './pdf/commanderSection';
import { addDynamicSection } from './pdf/dynamicSection';

// Path to the SVG file
const headerSvgPath = 'src/lib/pdf/RAFAC RISK Headder-2.svg';

const exportToPDF = async (assessment: RiskAssessment) => {
  try {
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = createPdfDocument();

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 12;

    // Add the SVG at the top of the PDF
    const svgWidth = 1107;
    const svgHeight = 255;
    const svgStartY = margin;
    const yAfterSvg = await addSvgImage(doc, headerSvgPath, svgStartY, margin, pageWidth - (2 * margin));

    // Adjust starting Y position after the SVG
    const y = yAfterSvg + 10;
    const headerSectionY = await addHeaderSection(doc, autoTable, assessment.header, y, margin);
    const riskTableY = addRiskTable(doc, autoTable, assessment.risks, headerSectionY, margin);
    const commanderSectionY = addCommanderSection(doc, autoTable, assessment.commander, riskTableY, margin);
    const dynamicSectionY = addDynamicSection(doc, autoTable, assessment.dynamic, commanderSectionY + 5, margin);

    addVersionNumber(doc, pageWidth, pageHeight);
    doc.save('RAFAC_Risk_Assessment_5010c.pdf');

    return true;
  } catch (error) {
    console.error("Error generating PDF: ", error);
    return false;
  }
};

export default exportToPDF;
