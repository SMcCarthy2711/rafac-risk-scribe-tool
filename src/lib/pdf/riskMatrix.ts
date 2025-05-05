
import { jsPDF } from 'jspdf';

// Create and add risk matrix to the PDF - reformatted to match example image
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
  
  // Define border color and width
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  
  // Draw the main outer rectangle for the entire matrix section
  doc.rect(startX, startY, width, matrixHeight + 15, 'S');
  
  // Split into two main sections - left (70%) and right (30%)
  const leftWidth = width * 0.7;
  const rightWidth = width * 0.3;
  
  // Draw line separating left and right sections
  doc.line(startX + leftWidth, startY, startX + leftWidth, startY + matrixHeight + 15);
  
  // Left section - Key Guidance
  doc.setFillColor(255, 255, 255);
  
  // Key Guidance header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(0, 112, 192); // blue text
  doc.text('Key Guidance', startX + 2, startY + 4);
  doc.text('This section provides an overview of the key concepts for completing a RAFAC risk assessment.', startX + 20, startY + 4);
  doc.text('Refer to Notes section for further information.', startX + 2, startY + 7);
  
  // Reset to black text for content
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(6);
  
  // Hazard and Risk definitions
  doc.setFont('helvetica', 'bold');
  doc.text('Hazard', startX + 2, startY + 10);
  doc.setFont('helvetica', 'normal');
  doc.text('is anything that may cause harm, e.g. working at height on a ladder.', startX + 15, startY + 10);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Risk', startX + 2, startY + 14);
  doc.setFont('helvetica', 'normal');
  doc.text('is the chance of someone being harmed by the hazard. Risk is measured by multiplying the likelihood', startX + 13, startY + 14);
  doc.text('of it happening with its impact (severity). E.g. it is \'', startX + 2, startY + 17);
  doc.setFont('helvetica', 'bold');
  doc.text('Possible\'', startX + 97, startY + 17);
  doc.setFont('helvetica', 'normal');
  doc.text('that someone who is not competent could fall from a ladder (3 rating)', startX + 115, startY + 17);
  doc.text('resulting in \'', startX + 2, startY + 20);
  doc.setFont('helvetica', 'bold');
  doc.text('Moderate\'', startX + 25, startY + 20);
  doc.setFont('helvetica', 'normal');
  doc.text('impact with multiple injuries (2 rating), creating a score of 3x2=6 (low).', startX + 50, startY + 20);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Dynamic Risk Assessment', startX + 2, startY + 24);
  doc.setFont('helvetica', 'normal');
  doc.text('compliments generic and specific risk assessment. Regardless of completing this', startX + 60, startY + 24);
  doc.text('RAFAC 5010C, it is beholden on the person creating the risk to continue to monitor the activity and the control', startX + 2, startY + 27);
  doc.text('measures.', startX + 2, startY + 30);
  
  // Draw 5-step process
  const stepY = startY + matrixHeight - 3;
  const stepHeight = 10;
  
  // Blue box for 5 Step Process
  doc.setFillColor(0, 112, 192);
  doc.rect(startX + 2, stepY, 20, stepHeight, 'F');
  
  // Text for 5 Step Process
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.text('5 Step', startX + 4, stepY + 3);
  doc.text('Process', startX + 4, stepY + 7);
  
  // Step 1
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 0, 0);
  doc.text('Step 1', startX + 25, stepY + 3);
  doc.setTextColor(0, 0, 0);
  doc.text('- Identify', startX + 35, stepY + 3);
  doc.text('the hazards', startX + 25, stepY + 7);
  
  // Step 2
  doc.setTextColor(255, 0, 0);
  doc.text('Step 2', startX + 65, stepY + 3);
  doc.setTextColor(0, 0, 0);
  doc.text('- Decide who might', startX + 75, stepY + 3);
  doc.text('be harmed and how', startX + 65, stepY + 7);
  
  // Step 3
  doc.setTextColor(255, 0, 0);
  doc.text('Step 3', startX + 125, stepY + 3);
  doc.setTextColor(0, 0, 0);
  doc.text('- Evaluate the risks and decide on', startX + 135, stepY + 3);
  doc.text('precautions (control measures)', startX + 125, stepY + 7);
  
  // Step 4
  doc.setTextColor(255, 0, 0);
  doc.text('Step 4', startX + 205, stepY + 3);
  doc.setTextColor(0, 0, 0);
  doc.text('- Record your findings. Implement control', startX + 215, stepY + 3);
  doc.text('measures. Brief participants prior to activity.', startX + 205, stepY + 7);
  
  // Step 5
  doc.setTextColor(255, 0, 0);
  doc.text('Step 5', startX + 320, stepY + 3);
  doc.setTextColor(0, 0, 0);
  doc.text('- Review your risk assessment', startX + 330, stepY + 3);
  doc.text('and update as necessary', startX + 320, stepY + 7);
  
  // RIGHT SECTION - Matrix Tables
  const rightStartX = startX + leftWidth + 5;
  const tableStartY = startY + 4;
  
  // Headers for Likelihood and Impact
  doc.setFillColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(0, 0, 0);
  
  // Likelihood column
  doc.text('Likelihood (L)', rightStartX, tableStartY);
  doc.text('x', rightStartX + 50, tableStartY);
  doc.text('Impact (I)', rightStartX + 65, tableStartY);
  doc.text('=', rightStartX + 105, tableStartY);
  
  // Likelihood ratings below header
  const likelihoodStartY = tableStartY + 5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 0, 0);
  doc.text('5', rightStartX, likelihoodStartY);
  doc.setTextColor(0, 0, 0);
  doc.text('- Highly Probable', rightStartX + 5, likelihoodStartY);
  
  doc.setTextColor(255, 0, 0);
  doc.text('4', rightStartX, likelihoodStartY + 4);
  doc.setTextColor(0, 0, 0);
  doc.text('- Probable', rightStartX + 5, likelihoodStartY + 4);
  
  doc.setTextColor(255, 0, 0);
  doc.text('3', rightStartX, likelihoodStartY + 8);
  doc.setTextColor(0, 0, 0);
  doc.text('- Possible', rightStartX + 5, likelihoodStartY + 8);
  
  doc.setTextColor(255, 0, 0);
  doc.text('2', rightStartX, likelihoodStartY + 12);
  doc.setTextColor(0, 0, 0);
  doc.text('- Unlikely', rightStartX + 5, likelihoodStartY + 12);
  
  doc.setTextColor(255, 0, 0);
  doc.text('1', rightStartX, likelihoodStartY + 16);
  doc.setTextColor(0, 0, 0);
  doc.text('- Remote', rightStartX + 5, likelihoodStartY + 16);
  
  // Impact ratings
  doc.setTextColor(255, 0, 0);
  doc.text('1', rightStartX + 60, likelihoodStartY);
  doc.setTextColor(0, 0, 0);
  doc.text('- Minor', rightStartX + 65, likelihoodStartY);
  
  doc.setTextColor(255, 0, 0);
  doc.text('2', rightStartX + 60, likelihoodStartY + 4);
  doc.setTextColor(0, 0, 0);
  doc.text('- Moderate', rightStartX + 65, likelihoodStartY + 4);
  
  doc.setTextColor(255, 0, 0);
  doc.text('3', rightStartX + 60, likelihoodStartY + 8);
  doc.setTextColor(0, 0, 0);
  doc.text('- Major', rightStartX + 65, likelihoodStartY + 8);
  
  doc.setTextColor(255, 0, 0);
  doc.text('4', rightStartX + 60, likelihoodStartY + 12);
  doc.setTextColor(0, 0, 0);
  doc.text('- Severe', rightStartX + 65, likelihoodStartY + 12);
  
  doc.setTextColor(255, 0, 0);
  doc.text('5', rightStartX + 60, likelihoodStartY + 16);
  doc.setTextColor(0, 0, 0);
  doc.text('- Critical', rightStartX + 65, likelihoodStartY + 16);
  
  // Add the Note about impact
  doc.setFontSize(5);
  doc.text('Note: impact', rightStartX + 65, likelihoodStartY + 20);
  doc.text('number is unlikely', rightStartX + 65, likelihoodStartY + 23);
  doc.text('to change with', rightStartX + 65, likelihoodStartY + 26);
  doc.text('control measures', rightStartX + 65, likelihoodStartY + 29);
  
  // Draw Risk Score Calculation table
  const riskTableX = rightStartX + 125;
  const riskTableY = tableStartY;
  
  // Risk Score Calculation header
  doc.setFillColor(255, 255, 255);
  doc.rect(riskTableX, riskTableY - 3, 50, 6, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(0, 0, 0);
  doc.text('Risk Score Calculation', riskTableX + 10, riskTableY);
  
  // Likelihood header
  doc.rect(riskTableX, riskTableY + 4, 50, 5, 'S');
  doc.text('Likelihood', riskTableX + 20, riskTableY + 8);
  
  // Column and row headers
  const cellSize = 8;
  
  // Impact header on left side
  doc.rect(riskTableX, riskTableY + 9, 10, 5, 'S');
  doc.text('Impact', riskTableX + 2, riskTableY + 13);
  
  // Column headers (1-5)
  for (let i = 0; i < 5; i++) {
    doc.rect(riskTableX + 10 + (i * cellSize), riskTableY + 9, cellSize, 5, 'S');
    doc.text(`${i + 1}`, riskTableX + 12 + (i * cellSize), riskTableY + 13);
  }
  
  // Cell colors for risk matrix
  const cellColors = [
    [[146, 208, 80], [146, 208, 80], [255, 255, 0], [255, 255, 0], [255, 192, 0]],  // 1 (bottom row)
    [[146, 208, 80], [255, 255, 0], [255, 255, 0], [255, 192, 0], [255, 192, 0]],   // 2
    [[255, 255, 0], [255, 255, 0], [255, 192, 0], [255, 192, 0], [255, 0, 0]],      // 3
    [[255, 255, 0], [255, 192, 0], [255, 192, 0], [255, 0, 0], [255, 0, 0]],        // 4
    [[255, 192, 0], [255, 192, 0], [255, 0, 0], [255, 0, 0], [255, 0, 0]]           // 5 (top row)
  ];
  
  // Risk score values
  const riskScores = [
    ['1', '2', '3', '4', '5'],     // Impact 1 × Likelihood 1-5
    ['2', '4', '6', '8', '10'],    // Impact 2 × Likelihood 1-5
    ['3', '6', '9', '12', '15'],   // Impact 3 × Likelihood 1-5
    ['4', '8', '12', '16', '20'],  // Impact 4 × Likelihood 1-5
    ['5', '10', '15', '20', '25']  // Impact 5 × Likelihood 1-5
  ];
  
  // Draw cells
  for (let i = 0; i < 5; i++) {
    // Row header (5,4,3,2,1 from top to bottom)
    doc.rect(riskTableX, riskTableY + 14 + (i * cellSize), 10, cellSize, 'S');
    doc.text(`${5-i}`, riskTableX + 5, riskTableY + 19 + (i * cellSize));
    
    // Risk score cells
    for (let j = 0; j < 5; j++) {
      const colorArray = cellColors[4-i][j];
      doc.setFillColor(colorArray[0], colorArray[1], colorArray[2]);
      doc.rect(riskTableX + 10 + (j * cellSize), riskTableY + 14 + (i * cellSize), cellSize, cellSize, 'FD');
      doc.text(riskScores[4-i][j], riskTableX + 12 + (j * cellSize), riskTableY + 19 + (i * cellSize));
    }
  }
  
  return Promise.resolve();
};
