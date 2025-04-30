
import { RiskAssessment } from "./types";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Helper function to truncate text
const truncateText = (text: string, maxLength: number) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

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
    
    // Define margins to prevent content from going off page
    const margin = 10;
    const effectiveWidth = pageWidth - (2 * margin);
    
    // Add header - Form title and "Uncontrolled copy when printed"
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Uncontrolled copy when printed", margin, margin);
    doc.text("RAFAC Form 5010(c)", pageWidth - 30, margin);
    
    // Add guidance and risk matrix image from the provided image
    const matrixStartY = margin + 10;
    const matrixHeight = 70;
    
    // Load the risk matrix image
    const img = new Image();
    img.src = '/lovable-uploads/339eab27-a618-4257-be6a-69d3eb8d952a.png';
    
    // Use a promise to ensure image is loaded before adding to PDF
    await new Promise<void>((resolve) => {
      img.onload = () => {
        // Calculate the aspect ratio to maintain proportions
        const imgAspect = img.width / img.height;
        const displayHeight = matrixHeight;
        const displayWidth = displayHeight * imgAspect;
        
        // Center the image horizontally
        const xPos = margin + (effectiveWidth - displayWidth) / 2;
        
        // Add the image to the PDF
        doc.addImage(
          img, 
          'PNG', 
          xPos, 
          matrixStartY, 
          displayWidth, 
          displayHeight
        );
        resolve();
      };
      // Fallback in case image fails to load
      img.onerror = () => {
        console.error("Failed to load risk matrix image");
        resolve();
      };
    });
    
    // Now add the main form fields with better spacing
    let y = matrixStartY + matrixHeight + 5;
    
    // Header section with Squadron info - adjusted column widths
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
        fontSize: 9,
        cellPadding: 2,
      },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 90 },
        2: { cellWidth: 50 }
      }
    });
    
    y = (doc as any).lastAutoTable.finalY + 3;
    
    // Activity Title - adjusted column widths
    autoTable(doc, {
      startY: y,
      head: [['Activity (Step 1a):', 'Type of Risk Assessment:']],
      body: [[
        assessment.header["Activity Title"],
        assessment.header["Risk Assessment Type"] || "Generic ☐     Specific ☑"
      ]],
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 140 },
        1: { cellWidth: 90 }
      }
    });
    
    y = (doc as any).lastAutoTable.finalY + 3;
    
    // Publications - using the user's input from the form instead of hardcoded text
    autoTable(doc, {
      startY: y,
      head: [['Relevant Publications / Pamphlets / Procedures:']],
      body: [[assessment.header["Publications"] || ""]],
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
      margin: { left: margin, right: margin }
    });
    
    y = (doc as any).lastAutoTable.finalY + 5;
    
    // Main risk table headers - with proper typings
    const riskHeaders = [
      [
        { content: '(a)\nRef', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
        { content: '(b)\nActivity', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
        { content: '(c)\nHazards', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
        { content: '(d)\nWho/What', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
        { content: '(e)\nControls', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
        { content: '(f)\nL', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
        { content: '(g)\nI', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
        { content: '(h)\nRating', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
        { content: '(i)\nAccept?', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
        { content: '(j)\nAdditional\nControls', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
        { content: '(k)\nL', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
        { content: '(l)\nI', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
        { content: '(m)\nRevised\nRating', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } },
        { content: '(n)\nActions', styles: { halign: 'center' as const, valign: 'middle' as const, fontStyle: 'bold' as const } }
      ]
    ];
    
    // Create rows for each risk with truncated text
    const riskRows = assessment.risks.map(risk => [
      risk.Ref,
      truncateText(risk["Activity/Element"], 25),
      truncateText(risk["Hazards Identified"], 25),
      truncateText(risk["Who or What Might be Harmed and How"], 25),
      truncateText(risk["Existing Control Measures"], 30),
      risk.Likelihood,
      risk.Impact,
      risk["Risk Rating (LxI)"],
      risk["Is Risk Acceptable"],
      truncateText(risk["Reasonable Additional Control Measures"], 25),
      risk["Revised Likelihood"],
      risk["Revised Impact"],
      risk["Revised Risk Rating (LxI)"],
      truncateText(risk["List Required Actions (Who, When and How)"], 25)
    ]);
    
    // Add a default example row if no risks
    if (riskRows.length === 0) {
      riskRows.push([
        'E.g.', 
        'Driving to / from training', 
        'Driver fatigue causes RTA',
        'Injuries to personnel',
        'Designated drivers · JSP800',
        '2', 
        '5', 
        '10',
        'NO',
        'Vehicle commander to monitor',
        '1',
        '5',
        '5',
        'CFAV to implement controls'
      ]);
    }
    
    // Create the main risk table with optimized column widths
    autoTable(doc, {
      startY: y,
      head: riskHeaders,
      body: riskRows,
      theme: 'grid',
      styles: {
        fontSize: 7,
        cellPadding: 1,
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        overflow: 'ellipsize' as const,
      },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30 },
        5: { cellWidth: 8 },
        6: { cellWidth: 8 },
        7: { cellWidth: 12 },
        8: { cellWidth: 15 },
        9: { cellWidth: 25 },
        10: { cellWidth: 8 },
        11: { cellWidth: 8 },
        12: { cellWidth: 15 },
        13: { cellWidth: 25 },
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fontSize: 7
      }
    });
    
    y = (doc as any).lastAutoTable.finalY + 5;
    
    // Add commander sign-off information in a table with adjusted widths
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
        fontSize: 9,
        cellPadding: 2,
      },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 90 },
        2: { cellWidth: 50 }
      }
    });
    
    // Add Dynamic RA information if provided with better spacing
    if (assessment.dynamic["Dynamic Reason"] || assessment.dynamic["New Restrictions"] || assessment.dynamic.Remarks) {
      y = (doc as any).lastAutoTable.finalY + 5;
      
      autoTable(doc, {
        startY: y,
        head: [['Dynamic Risk Assessment']],
        body: [['']],
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 2,
          fontStyle: 'bold' as const
        },
        margin: { left: margin, right: margin }
      });
      
      y = (doc as any).lastAutoTable.finalY;
      
      autoTable(doc, {
        startY: y,
        head: [['Dynamic Reason:', 'New Restrictions:', 'Remarks:']],
        body: [[
          truncateText(assessment.dynamic["Dynamic Reason"], 30), 
          truncateText(assessment.dynamic["New Restrictions"], 30),
          truncateText(assessment.dynamic.Remarks, 30)
        ]],
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 2,
        },
        margin: { left: margin, right: margin },
        columnStyles: {
          0: { cellWidth: 90 },
          1: { cellWidth: 90 },
          2: { cellWidth: 50 }
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
          fontSize: 9,
          cellPadding: 2,
        },
        margin: { left: margin, right: margin },
        columnStyles: {
          0: { cellWidth: 90 },
          1: { cellWidth: 90 },
          2: { cellWidth: 50 }
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
