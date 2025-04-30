
import { RiskAssessment } from "./types";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const exportToPDF = async (assessment: RiskAssessment) => {
  try {
    // Import the required libraries
    const { default: autoTable } = await import('jspdf-autotable');
    
    // Create a new document in landscape orientation
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });
    
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Add header - Form title and "Uncontrolled copy when printed"
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Uncontrolled copy when printed", 14, 10);
    doc.text("RAFAC Form 5010(c)", pageWidth - 30, 10);
    
    // Add risk matrix box
    const matrixStartY = 20;
    const matrixHeight = 80;
    const matrixWidth = pageWidth - 28;
    
    // Draw outer box for guidance and risk matrix
    doc.setDrawColor(0);
    doc.setFillColor(240, 240, 240);
    doc.rect(14, matrixStartY, matrixWidth, matrixHeight, 'S');
    
    // Add guidance text
    doc.setFontSize(11);
    doc.setTextColor(0, 102, 204);
    doc.text("Key Guidance", 16, matrixStartY + 6);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text("This section provides an overview of the key concepts for completing a RAFAC risk assessment.", 65, matrixStartY + 6);
    doc.text("Refer to Notes section for further information. The first line of the risk assessment table, below, shows an illustrative example.", 16, matrixStartY + 12);
    
    // Draw the risk matrix - simplified for now
    doc.setDrawColor(0);
    doc.setLineWidth(0.1);
    
    const tableStartX = pageWidth - 100;
    doc.text("Risk Score Calculation", tableStartX, matrixStartY + 15);
    doc.rect(tableStartX - 10, matrixStartY + 10, 80, 60, 'S');
    
    // Add 5 Step Process at the bottom of the matrix box
    doc.setFontSize(9);
    doc.text("5 Step Process", 16, matrixStartY + matrixHeight - 6);
    doc.setTextColor(255, 0, 0);
    doc.text("Step 1", 70, matrixStartY + matrixHeight - 6);
    doc.setTextColor(0, 0, 0);
    doc.text("- Identify the hazards", 90, matrixStartY + matrixHeight - 6);
    
    doc.setTextColor(255, 0, 0);
    doc.text("Step 2", 150, matrixStartY + matrixHeight - 6);
    doc.setTextColor(0, 0, 0);
    doc.text("- Decide who might be harmed and how", 170, matrixStartY + matrixHeight - 6);
    
    // Now add the main form fields
    let y = matrixStartY + matrixHeight + 10;
    
    // Header section with Squadron info
    autoTable(doc, {
      startY: y,
      head: [['RAFAC Formation:', 'Assessor (No, Rank, Name):', 'Assessment Date:']],
      body: [[
        assessment.header.Squadron, 
        assessment.header["Assessor Name"],
        assessment.header["Assessment Date"]
      ]],
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 100 },
        2: { cellWidth: 60 }
      }
    });
    
    y = (doc as any).lastAutoTable.finalY + 5;
    
    // Activity Title
    autoTable(doc, {
      startY: y,
      head: [['Activity (Step 1a):', 'Type of Risk Assessment:']],
      body: [[
        assessment.header["Activity Title"],
        assessment.header["Risk Assessment Type"] || "Generic ☐     Specific ☑"
      ]],
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 120 },
        1: { cellWidth: 140 }
      }
    });
    
    y = (doc as any).lastAutoTable.finalY + 5;
    
    // Publications
    autoTable(doc, {
      startY: y,
      head: [['Relevant Publications / Pamphlets / Procedures:']],
      body: [[assessment.header["Publications"] || "1. Event Joining Instructions\n2. Pool Operating Procedures\n3. ACPDT1\n4. JSP800\n5. ACPEDT1 005"]],
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      }
    });
    
    y = (doc as any).lastAutoTable.finalY + 10;
    
    // Main risk table headers - Fix for TypeScript error with fontStyle
    const riskHeaders = [
      [
        { content: '(a)\nRef', styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' as 'bold' } },
        { content: '(b)\nActivity / Element\n(Step 1a)', styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' as 'bold' } },
        { content: '(c)\nHazards identified\n(Step 1b)', styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' as 'bold' } },
        { content: '(d)\nWho or what might be harmed and how\n(Step 2)', styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' as 'bold' } },
        { content: '(e)\nExisting control measures\n(Step 3a)', styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' as 'bold' } },
        { content: '(f)\nL\n(1-5)\n(Step 3b)', styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' as 'bold' } },
        { content: '(g)\nI\n(1-5)\n(Step 3c)', styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' as 'bold' } },
        { content: '(h)\nRisk Rating\n(L x I)\n(Step 3d)', styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' as 'bold' } },
        { content: '(i)\nIs risk acceptable?\n– Refer to\nRisk Score\nCalculation\nabove', styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' as 'bold' } },
        { content: '(j)\nReasonable additional\ncontrols that can be\nimplemented to reduce\nrisk to ALARP\n(Step 3f)', styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' as 'bold' } },
        { content: '(k)\nL\n(1-5)\n(Step 3g)', styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' as 'bold' } },
        { content: '(l)\nI\n(1-5)\n(Step 3h)', styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' as 'bold' } },
        { content: '(m)\nRisk Rating\n(L x I)\n(Step 3i)', styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' as 'bold' } },
        { content: '(n)\nList required action(s)\nto instigate controls\n(Who, When and How)\n(Step 3j)', styles: { halign: 'center', valign: 'middle', fontStyle: 'bold' as 'bold' } }
      ]
    ];
    
    // Create rows for each risk
    const riskRows = assessment.risks.map(risk => [
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
    
    // Add a default example row if no risks
    if (riskRows.length === 0) {
      riskRows.push([
        'E.g.', 
        'Driving to / from training area', 
        'Driver fatigue / distraction causes RTA',
        'Multiple injuries to cadet personnel and general public\nEquipment damage',
        'Designated, trained drivers · Compliance with JSP800\nSpill kits',
        '2', 
        '5', 
        '10',
        'NO',
        'Vehicle commander to ensure driver is concentrating and',
        '1',
        '5',
        '5',
        'CFAV in charge of road move to implement all controls and brief personnel.'
      ]);
    }
    
    // Create the main risk table
    autoTable(doc, {
      startY: y,
      head: riskHeaders,
      body: riskRows,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: 15 }, // Ref
        1: { cellWidth: 30 }, // Activity
        2: { cellWidth: 30 }, // Hazards
        3: { cellWidth: 35 }, // Who/What
        4: { cellWidth: 40 }, // Controls
        5: { cellWidth: 10 }, // L
        6: { cellWidth: 10 }, // I
        7: { cellWidth: 15 }, // Rating
        8: { cellWidth: 20 }, // Ok?
        9: { cellWidth: 40 }, // Add. Controls
        10: { cellWidth: 10 }, // Rev L
        11: { cellWidth: 10 }, // Rev I
        12: { cellWidth: 15 }, // Rev Rating
        13: { cellWidth: 40 }, // Actions
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 8
      }
    });
    
    y = (doc as any).lastAutoTable.finalY + 10;
    
    // Add commander sign-off information in a table
    autoTable(doc, {
      startY: y,
      head: [['Commander Name:', 'Commander Post:', 'Commander Date:']],
      body: [[
        assessment.commander["Commander Name"], 
        assessment.commander["Commander Post"],
        assessment.commander["Commander Date"]
      ]],
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      }
    });
    
    // Add Dynamic RA information if provided
    if (assessment.dynamic["Dynamic Reason"] || assessment.dynamic["New Restrictions"] || assessment.dynamic.Remarks) {
      y = (doc as any).lastAutoTable.finalY + 10;
      
      autoTable(doc, {
        startY: y,
        head: [['Dynamic Risk Assessment']],
        body: [['']],
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 3,
          fontStyle: 'bold' as 'bold'
        }
      });
      
      y = (doc as any).lastAutoTable.finalY;
      
      autoTable(doc, {
        startY: y,
        head: [['Dynamic Reason:', 'New Restrictions:', 'Remarks:']],
        body: [[
          assessment.dynamic["Dynamic Reason"], 
          assessment.dynamic["New Restrictions"],
          assessment.dynamic.Remarks
        ]],
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 3,
        }
      });
      
      y = (doc as any).lastAutoTable.finalY;
      
      autoTable(doc, {
        startY: y,
        head: [['Dynamic Officer Name:', 'Dynamic Officer Post:', 'Dynamic Date:']],
        body: [[
          assessment.dynamic["Dynamic Officer Name"], 
          assessment.dynamic["Dynamic Officer Post"],
          assessment.dynamic["Dynamic Date"]
        ]],
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 3,
        }
      });
    }
    
    // Add version number at bottom right
    doc.setFontSize(8);
    doc.text("Version: 2.0", pageWidth - 25, pageHeight - 5);
    
    // Save the PDF
    doc.save('RAFAC_Risk_Assessment_5010c.pdf');
    
    return true;
  } catch (error) {
    console.error("Error generating PDF: ", error);
    return false;
  }
};

export default exportToPDF;
