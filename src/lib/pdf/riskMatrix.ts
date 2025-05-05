
import { jsPDF } from 'jspdf';

// Create and add risk matrix to the PDF
export const addRiskMatrix = async (
  doc: jsPDF, 
  matrixStartY: number, 
  matrixHeight: number, 
  margin: number, 
  effectiveWidth: number
): Promise<void> => {
  // Set starting position
  const startY = matrixStartY;
  const startX = margin;
  const width = effectiveWidth;
  
  // Define colors
  const colors = {
    green: [146, 208, 80],
    yellow: [255, 255, 0],
    amber: [255, 192, 0],
    red: [255, 0, 0],
    blue: [0, 112, 192],
    black: [0, 0, 0],
    white: [255, 255, 255],
    lightGray: [242, 242, 242]
  };
  
  // Draw main guidance box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.1);
  
  // Setup text properties for guidance section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 112, 192); // blue text
  doc.text('Key Guidance', startX + 2, startY + 5);
  doc.text('This section provides an overview of the key concepts for completing a RAFAC risk assessment.', startX + 25, startY + 5);
  doc.text('Refer to Notes section for further information. The first line of the risk assessment table, below, shows an illustrative', startX + 2, startY + 9);
  doc.text('example.', startX + 2, startY + 13);
  
  // Reset to black text and normal font for the rest of the content
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Hazard', startX + 2, startY + 18);
  doc.setFont('helvetica', 'normal');
  doc.text('is anything that may cause harm, e.g. working at height on a ladder.', startX + 25, startY + 18);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Risk', startX + 2, startY + 22);
  doc.setFont('helvetica', 'normal');
  doc.text('is the chance of someone or something being harmed by the hazard. Risk is measured by multiplying the', startX + 25, startY + 22);
  doc.text('likelihood of it happening with its impact (severity). Eg. it is \'', startX + 2, startY + 26);
  doc.setFont('helvetica', 'bold');
  doc.text('Possible\'', startX + 188, startY + 26);
  doc.setFont('helvetica', 'normal');
  doc.text('that someone who is not competent could fall', startX + 212, startY + 26);
  doc.text('from a ladder (3 rating) resulting in \'', startX + 2, startY + 30);
  doc.setFont('helvetica', 'bold');
  doc.text('Moderate\'', startX + 132, startY + 30);
  doc.setFont('helvetica', 'normal');
  doc.text('impact with multiple injuries (2 rating), creating a score of 3x2=6', startX + 170, startY + 30);
  doc.text('(low). However, reducing the risk to as low as reasonably practicable (ALARP) through the implementation of', startX + 2, startY + 34);
  doc.text('control measures eg. training on ladder use to ensure competency, the likelihood of injury would be reduced to', startX + 2, startY + 38);
  doc.text('\'', startX + 2, startY + 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Unlikely\'', startX + 4, startY + 42);
  doc.setFont('helvetica', 'normal');
  doc.text('(2 rating) giving a final score of 2x2=4 (very low).', startX + 35, startY + 42);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Note', startX + 2, startY + 46);
  doc.setFont('helvetica', 'normal');
  doc.text('- Persons undergoing training cannot be deemed competent until their capability is properly assessed.', startX + 25, startY + 46);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Dynamic Risk Assessment', startX + 2, startY + 50);
  doc.setFont('helvetica', 'normal');
  doc.text('compliments generic and specific risk assessment. Regardless of completing this', startX + 95, startY + 50);
  doc.text('RAFAC 5010C, it is beholden on the person creating the risk to continue to monitor the activity and the control', startX + 2, startY + 54);
  doc.text('measures. Any changes to the activity (including the environmental conditions) or the control measures, must be', startX + 2, startY + 58);
  doc.text('addressed via the mechanism of a dynamic risk assessment such that risks remain ALARP.', startX + 2, startY + 62);
  
  // Draw the 5-step process at the bottom
  const stepY = startY + 68;
  doc.setFillColor(0, 112, 192); // Using blue color directly
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  
  doc.setFillColor(0, 112, 192); // Using blue color directly
  doc.rect(startX + 2, stepY, 30, 10, 'F');
  doc.text('5 Step', startX + 5, stepY + 4);
  doc.text('Process', startX + 5, stepY + 8);
  
  // Step 1
  doc.setTextColor(255, 0, 0);
  doc.text('Step 1', startX + 38, stepY + 4);
  doc.setTextColor(0, 0, 0);
  doc.text('- Identify', startX + 58, stepY + 4);
  doc.text('the hazards', startX + 38, stepY + 8);
  
  // Step 2
  doc.setTextColor(255, 0, 0);
  doc.text('Step 2', startX + 95, stepY + 4);
  doc.setTextColor(0, 0, 0);
  doc.text('- Decide who might', startX + 115, stepY + 4);
  doc.text('be harmed and how', startX + 95, stepY + 8);
  
  // Step 3
  doc.setTextColor(255, 0, 0);
  doc.text('Step 3', startX + 175, stepY + 4);
  doc.setTextColor(0, 0, 0);
  doc.text('- Evaluate the risks and decide on', startX + 195, stepY + 4);
  doc.text('precautions (control measures)', startX + 175, stepY + 8);
  
  // Step 4
  doc.setTextColor(255, 0, 0);
  doc.text('Step 4', startX + 280, stepY + 4);
  doc.setTextColor(0, 0, 0);
  doc.text('- Record your significant findings. Implement control', startX + 300, stepY + 4);
  doc.text('measures. Brief participants prior to activity commencement.', startX + 280, stepY + 8);
  
  // Step 5
  doc.setTextColor(255, 0, 0);
  doc.text('Step 5', startX + 450, stepY + 4);
  doc.setTextColor(0, 0, 0);
  doc.text('- Review your risk assessment', startX + 470, stepY + 4);
  doc.text('and update as necessary', startX + 450, stepY + 8);
  
  // Draw arrow for the steps
  doc.setDrawColor(255, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(startX + 32, stepY + 5, startX + 35, stepY + 5);
  doc.line(startX + 35, stepY + 3, startX + 38, stepY + 5);
  doc.line(startX + 35, stepY + 7, startX + 38, stepY + 5);
  
  // Draw Likelihood and Impact tables
  const tableStartX = startX + width - 300;
  const tableStartY = startY + 5;
  
  // Likelihood table header
  doc.setFillColor(242, 242, 242); // Using lightGray directly
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.1);
  doc.rect(tableStartX, tableStartY, 70, 10, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('Likelihood (L)', tableStartX + 15, tableStartY + 6);
  
  // X column
  doc.rect(tableStartX + 70, tableStartY, 30, 10, 'FD');
  doc.text('x', tableStartX + 85, tableStartY + 6);
  
  // Impact column
  doc.rect(tableStartX + 100, tableStartY, 70, 10, 'FD');
  doc.text('Impact (I)', tableStartX + 125, tableStartY + 6);
  
  // Equal sign
  doc.rect(tableStartX + 170, tableStartY, 30, 10, 'FD');
  doc.text('=', tableStartX + 185, tableStartY + 6);
  
  // Likelihood ratings
  doc.setFontSize(7);
  let likeY = tableStartY + 15;
  
  doc.text('5 - Highly Probable', tableStartX + 5, likeY);
  doc.text('4 - Probable', tableStartX + 5, likeY + 8);
  doc.text('3 - Possible', tableStartX + 5, likeY + 16);
  doc.text('2 - Unlikely', tableStartX + 5, likeY + 24);
  doc.text('1 - Remote', tableStartX + 5, likeY + 32);
  
  // Impact ratings
  doc.text('1 - Minor', tableStartX + 105, likeY);
  doc.text('2 - Moderate', tableStartX + 105, likeY + 8);
  doc.text('3 - Major', tableStartX + 105, likeY + 16);
  doc.text('4 - Severe', tableStartX + 105, likeY + 24);
  doc.text('5 - Critical', tableStartX + 105, likeY + 32);
  
  // Multiplied by text (vertically)
  // Fix the translate, rotate and restore methods
  doc.text("Multiplied by", tableStartX + 85, likeY + 15, {
    align: "center",
    angle: 270
  });
  
  // Equals text (vertically)
  doc.text("Equals", tableStartX + 185, likeY + 15, {
    align: "center",
    angle: 270
  });
  
  // Impact note
  doc.setFontSize(6);
  doc.text('Note: impact', tableStartX + 135, likeY + 12);
  doc.text('number is', tableStartX + 135, likeY + 16);
  doc.text('unlikely to', tableStartX + 135, likeY + 20);
  doc.text('change with', tableStartX + 135, likeY + 24);
  doc.text('control', tableStartX + 135, likeY + 28);
  doc.text('measures', tableStartX + 135, likeY + 32);
  
  // Draw Risk Score Calculation table
  const riskTableX = width - 110 + startX;
  const riskTableY = tableStartY;
  
  // Header
  doc.setFillColor(242, 242, 242); // Using lightGray directly
  doc.rect(riskTableX, riskTableY, 100, 10, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text('Risk Score Calculation', riskTableX + 25, riskTableY + 6);
  
  // Likelihood header
  doc.rect(riskTableX, riskTableY + 10, 100, 10, 'FD');
  doc.setFontSize(7);
  doc.text('Likelihood', riskTableX + 45, riskTableY + 16);
  
  // Create the grid headers
  const colWidth = 16;
  doc.rect(riskTableX, riskTableY + 20, 20, 10, 'FD');
  doc.text('Impact', riskTableX + 5, riskTableY + 26);
  
  // Column headers (1-5)
  for (let i = 0; i < 5; i++) {
    doc.setTextColor(255, 0, 0);
    doc.rect(riskTableX + 20 + (i * colWidth), riskTableY + 20, colWidth, 10, 'FD');
    doc.text(`${i + 1}`, riskTableX + 28 + (i * colWidth), riskTableY + 26);
  }
  
  // Row headers and grid cells
  const rowColors = [
    [255, 0, 0],    // 5 - red
    [255, 192, 0],  // 4 - amber
    [255, 192, 0],  // 3 - amber
    [255, 255, 0],  // 2 - yellow
    [146, 208, 80]  // 1 - green
  ];
  
  const riskScores = [
    ['25', '20', '15', '10', '5'],  // 5
    ['20', '16', '12', '8', '4'],   // 4
    ['15', '12', '9', '6', '3'],    // 3
    ['10', '8', '6', '4', '2'],     // 2
    ['5', '4', '3', '2', '1']       // 1
  ];
  
  const cellColors = [
    [[255, 0, 0], [255, 0, 0], [255, 0, 0], [255, 192, 0], [255, 255, 0]],       // 5
    [[255, 0, 0], [255, 0, 0], [255, 192, 0], [255, 192, 0], [255, 255, 0]],     // 4
    [[255, 0, 0], [255, 192, 0], [255, 192, 0], [255, 255, 0], [146, 208, 80]],   // 3
    [[255, 192, 0], [255, 192, 0], [255, 255, 0], [255, 255, 0], [146, 208, 80]], // 2
    [[255, 255, 0], [255, 255, 0], [146, 208, 80], [146, 208, 80], [146, 208, 80]]  // 1
  ];
  
  for (let i = 0; i < 5; i++) {
    // Row header
    doc.setFillColor(rowColors[i][0], rowColors[i][1], rowColors[i][2]);
    doc.rect(riskTableX, riskTableY + 30 + (i * colWidth), 20, colWidth, 'FD');
    doc.setTextColor(0, 0, 0);
    doc.text(`${5-i}`, riskTableX + 10, riskTableY + 40 + (i * colWidth));
    
    // Cells
    for (let j = 0; j < 5; j++) {
      doc.setFillColor(cellColors[i][j][0], cellColors[i][j][1], cellColors[i][j][2]);
      doc.rect(riskTableX + 20 + (j * colWidth), riskTableY + 30 + (i * colWidth), colWidth, colWidth, 'FD');
      doc.setTextColor(0, 0, 0);
      doc.text(riskScores[i][j], riskTableX + 28 + (j * colWidth), riskTableY + 40 + (i * colWidth));
    }
  }
  
  // Impact text (vertically)
  doc.text("Impact", riskTableX + 10, riskTableY + 60, {
    align: "center",
    angle: 270
  });
  
  return Promise.resolve();
};
