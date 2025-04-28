
import { RiskAssessment } from "./types";

const exportToPDF = async (assessment: RiskAssessment) => {
  try {
    // Since we can't directly use reportlab in browser, we'll use jspdf
    // First, import it dynamically
    const { jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    
    // Create a new document
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(0, 48, 135); // RAFAC blue
    doc.text('Risk Assessment Form - RAFAC', 14, 20);
    
    // Add header fields
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    let y = 30;
    
    Object.entries(assessment.header).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 14, y);
      y += 7;
    });
    
    // Add risks table
    y += 5;
    doc.text('Risk Entries', 14, y);
    y += 5;
    
    // Prepare table data
    const headers = [
      'Ref', 
      'Activity', 
      'Hazards', 
      'Who/What', 
      'Controls', 
      'L', 
      'I', 
      'Rating', 
      'Ok?', 
      'Add. Controls', 
      'Rev L', 
      'Rev I', 
      'Rev Rating', 
      'Actions'
    ];
    
    const rows = assessment.risks.map(risk => [
      risk.Ref,
      risk["Activity/Element"],
      risk["Hazards Identified"],
      risk["Who or What Might be Harmed and How"],
      risk["Existing Control Measures"],
      risk.Likelihood,
      risk.Impact,
      risk["Risk Rating (LxI)"],
      risk["Is Risk Acceptable"],
      risk["Reasonable Additional Control Measures"],
      risk["Revised Likelihood"],
      risk["Revised Impact"],
      risk["Revised Risk Rating (LxI)"],
      risk["List Required Actions (Who, When and How)"]
    ]);
    
    autoTable(doc, {
      startY: y,
      head: [headers],
      body: rows,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 48, 135], // RAFAC blue
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8
      },
      styles: {
        fontSize: 7,
        cellPadding: 1,
      },
      columnStyles: {
        0: { cellWidth: 10 }, // Ref
        1: { cellWidth: 20 }, // Activity
        2: { cellWidth: 20 }, // Hazards
        3: { cellWidth: 25 }, // Who/What
        4: { cellWidth: 20 }, // Controls
        5: { cellWidth: 8 }, // L
        6: { cellWidth: 8 }, // I
        7: { cellWidth: 10 }, // Rating
        8: { cellWidth: 10 }, // Ok?
        9: { cellWidth: 25 }, // Add. Controls
        10: { cellWidth: 8 }, // Rev L
        11: { cellWidth: 8 }, // Rev I
        12: { cellWidth: 10 }, // Rev Rating
        13: { cellWidth: 25 }, // Actions
      }
    });
    
    // Add commander sign-off information
    let finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text('Commander Sign-off:', 14, finalY);
    finalY += 7;
    
    Object.entries(assessment.commander).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 14, finalY);
      finalY += 7;
    });
    
    // Add Dynamic RA information if provided
    if (assessment.dynamic["Dynamic Reason"] || 
        assessment.dynamic["New Restrictions"] || 
        assessment.dynamic.Remarks ||
        assessment.dynamic["Dynamic Officer Name"]) {
      
      finalY += 3;
      doc.text('Dynamic Risk Assessment:', 14, finalY);
      finalY += 7;
      
      if (assessment.dynamic["Dynamic Reason"]) {
        doc.text(`Dynamic Reason: ${assessment.dynamic["Dynamic Reason"]}`, 14, finalY);
        finalY += 7;
      }
      
      if (assessment.dynamic["New Restrictions"]) {
        doc.text(`New Restrictions: ${assessment.dynamic["New Restrictions"]}`, 14, finalY);
        finalY += 7;
      }
      
      if (assessment.dynamic.Remarks) {
        doc.text(`Remarks: ${assessment.dynamic.Remarks}`, 14, finalY);
        finalY += 7;
      }
      
      if (assessment.dynamic["Dynamic Officer Name"]) {
        doc.text(`Dynamic Officer: ${assessment.dynamic["Dynamic Officer Name"]}, ${assessment.dynamic["Dynamic Officer Post"]}`, 14, finalY);
        finalY += 7;
      }
      
      if (assessment.dynamic["Dynamic Date"]) {
        doc.text(`Date: ${assessment.dynamic["Dynamic Date"]}`, 14, finalY);
      }
    }
    
    // Save the PDF
    doc.save('RAFAC_Risk_Assessment.pdf');
    
    return true;
  } catch (error) {
    console.error("Error generating PDF: ", error);
    return false;
  }
};

export default exportToPDF;
