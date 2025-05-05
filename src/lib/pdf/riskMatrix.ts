
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
  
  // Draw main guidance box - smaller font size and more compact layout
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.1);
  
  // Setup text properties for guidance section with reduced font size
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7); // Reduced from 8
  doc.setTextColor(0, 112, 192); // blue text
  doc.text('Key Guidance', startX + 2, startY + 4); // Reduced Y spacing
  doc.text('This section provides an overview of the key concepts for completing a RAFAC risk assessment.', startX + 22, startY + 4);
  doc.text('Refer to Notes section for further information.', startX + 2, startY + 7); // Reduced Y spacing
  
  // Reset to black text and normal font for the rest of the content with reduced spacing
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(6.5); // Reduced font size further
  
  doc.setFont('helvetica', 'bold');
  doc.text('Hazard', startX + 2, startY + 11);
  doc.setFont('helvetica', 'normal');
  doc.text('is anything that may cause harm, e.g. working at height on a ladder.', startX + 22, startY + 11);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Risk', startX + 2, startY + 15);
  doc.setFont('helvetica', 'normal');
  doc.text('is the chance of someone being harmed by the hazard. Risk is measured by multiplying the likelihood', startX + 22, startY + 15);
  doc.text('of it happening with its impact (severity). E.g. it is \'', startX + 2, startY + 18);
  doc.setFont('helvetica', 'bold');
  doc.text('Possible\'', startX + 130, startY + 18);
  doc.setFont('helvetica', 'normal');
  doc.text('that someone who is not competent could fall from a ladder (3 rating)', startX + 155, startY + 18);
  doc.text('resulting in \'', startX + 2, startY + 21);
  doc.setFont('helvetica', 'bold');
  doc.text('Moderate\'', startX + 35, startY + 21);
  doc.setFont('helvetica', 'normal');
  doc.text('impact with multiple injuries (2 rating), creating a score of 3x2=6 (low).', startX + 65, startY + 21);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Dynamic Risk Assessment', startX + 2, startY + 25);
  doc.setFont('helvetica', 'normal');
  doc.text('compliments generic and specific risk assessment. It is beholden on the person creating', startX + 85, startY + 25);
  doc.text('the risk to continue to monitor the activity and control measures.', startX + 2, startY + 28);
  
  // Draw the 5-step process at the bottom with reduced height
  const stepY = startY + 32; // Reduced from 68
  doc.setFillColor(0, 112, 192); // Using blue color directly
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  
  doc.setFillColor(0, 112, 192); // Using blue color directly
  doc.rect(startX + 2, stepY, 25, 8, 'F'); // Smaller box
  doc.text('5 Step', startX + 5, stepY + 3);
  doc.text('Process', startX + 5, stepY + 7);
  
  // Step 1
  doc.setTextColor(255, 0, 0);
  doc.text('Step 1', startX + 32, stepY + 3);
  doc.setTextColor(0, 0, 0);
  doc.text('- Identify', startX + 48, stepY + 3);
  doc.text('the hazards', startX + 32, stepY + 7);
  
  // Step 2
  doc.setTextColor(255, 0, 0);
  doc.text('Step 2', startX + 80, stepY + 3);
  doc.setTextColor(0, 0, 0);
  doc.text('- Decide who might', startX + 96, stepY + 3);
  doc.text('be harmed and how', startX + 80, stepY + 7);
  
  // Step 3
  doc.setTextColor(255, 0, 0);
  doc.text('Step 3', startX + 145, stepY + 3);
  doc.setTextColor(0, 0, 0);
  doc.text('- Evaluate the risks and decide on', startX + 161, stepY + 3);
  doc.text('precautions (control measures)', startX + 145, stepY + 7);
  
  // Step 4
  doc.setTextColor(255, 0, 0);
  doc.text('Step 4', startX + 230, stepY + 3);
  doc.setTextColor(0, 0, 0);
  doc.text('- Record your findings. Implement control', startX + 246, stepY + 3);
  doc.text('measures. Brief participants prior to activity.', startX + 230, stepY + 7);
  
  // Step 5
  doc.setTextColor(255, 0, 0);
  doc.text('Step 5', startX + 350, stepY + 3);
  doc.setTextColor(0, 0, 0);
  doc.text('- Review your risk assessment', startX + 366, stepY + 3);
  doc.text('and update as necessary', startX + 350, stepY + 7);
  
  // Draw arrow for the steps
  doc.setDrawColor(255, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(startX + 27, stepY + 4, startX + 30, stepY + 4);
  doc.line(startX + 30, stepY + 2, startX + 32, stepY + 4);
  doc.line(startX + 30, stepY + 6, startX + 32, stepY + 4);
  
  // Draw Likelihood and Impact tables - move to the right side to save space
  const tableStartX = startX + width - 250; // Adjusted to move tables to the right
  const tableStartY = startY + 5;
  
  // Likelihood table header - smaller with reduced spacing
  doc.setFillColor(242, 242, 242); // Using lightGray directly
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.1);
  doc.rect(tableStartX, tableStartY, 55, 8, 'FD'); // Smaller width
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text('Likelihood (L)', tableStartX + 12, tableStartY + 5);
  
  // X column
  doc.rect(tableStartX + 55, tableStartY, 20, 8, 'FD'); // Smaller width
  doc.text('x', tableStartX + 65, tableStartY + 5);
  
  // Impact column
  doc.rect(tableStartX + 75, tableStartY, 55, 8, 'FD'); // Smaller width
  doc.text('Impact (I)', tableStartX + 100, tableStartY + 5);
  
  // Equal sign
  doc.rect(tableStartX + 130, tableStartY, 20, 8, 'FD'); // Smaller width
  doc.text('=', tableStartX + 140, tableStartY + 5);
  
  // Likelihood and Impact ratings - smaller font and more compact
  doc.setFontSize(6);
  let likeY = tableStartY + 13; // Reduced spacing
  
  doc.text('5 - Highly Probable', tableStartX + 5, likeY);
  doc.text('4 - Probable', tableStartX + 5, likeY + 5); // Reduced spacing
  doc.text('3 - Possible', tableStartX + 5, likeY + 10); // Reduced spacing
  doc.text('2 - Unlikely', tableStartX + 5, likeY + 15); // Reduced spacing
  doc.text('1 - Remote', tableStartX + 5, likeY + 20); // Reduced spacing
  
  // Impact ratings
  doc.text('1 - Minor', tableStartX + 80, likeY);
  doc.text('2 - Moderate', tableStartX + 80, likeY + 5);
  doc.text('3 - Major', tableStartX + 80, likeY + 10);
  doc.text('4 - Severe', tableStartX + 80, likeY + 15);
  doc.text('5 - Critical', tableStartX + 80, likeY + 20);
  
  // Multiplied by text (vertically)
  doc.text("Multiplied by", tableStartX + 65, likeY + 10, {
    align: "center",
    angle: 270
  });
  
  // Equals text (vertically)
  doc.text("Equals", tableStartX + 140, likeY + 10, {
    align: "center",
    angle: 270
  });
  
  // Impact note
  doc.setFontSize(5.5);
  doc.text('Note: impact', tableStartX + 105, likeY + 8);
  doc.text('number unlikely', tableStartX + 105, likeY + 11);
  doc.text('to change with', tableStartX + 105, likeY + 14);
  doc.text('control measures', tableStartX + 105, likeY + 17);
  
  // Draw Risk Score Calculation table
  const riskTableX = width - 90 + startX; // Adjusted to avoid overlap
  const riskTableY = tableStartY;
  
  // Header
  doc.setFillColor(242, 242, 242); // Using lightGray directly
  doc.rect(riskTableX, riskTableY, 80, 8, 'FD'); // Smaller width and height
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text('Risk Score Calculation', riskTableX + 20, riskTableY + 5);
  
  // Likelihood header
  doc.rect(riskTableX, riskTableY + 8, 80, 7, 'FD'); // Smaller width and height
  doc.setFontSize(6);
  doc.text('Likelihood', riskTableX + 36, riskTableY + 13);
  
  // Create the grid headers
  const colWidth = 12; // Smaller grid cells
  doc.rect(riskTableX, riskTableY + 15, 16, 7, 'FD'); // Smaller width and height
  doc.text('Impact', riskTableX + 4, riskTableY + 20);
  
  // Column headers (1-5)
  for (let i = 0; i < 5; i++) {
    doc.setTextColor(255, 0, 0);
    doc.rect(riskTableX + 16 + (i * colWidth), riskTableY + 15, colWidth, 7, 'FD'); // Smaller width and height
    doc.text(`${i + 1}`, riskTableX + 20 + (i * colWidth), riskTableY + 20);
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
    doc.rect(riskTableX, riskTableY + 22 + (i * colWidth), 16, colWidth, 'FD'); // Smaller width and height
    doc.setTextColor(0, 0, 0);
    doc.text(`${5-i}`, riskTableX + 8, riskTableY + 30 + (i * colWidth));
    
    // Cells
    for (let j = 0; j < 5; j++) {
      doc.setFillColor(cellColors[i][j][0], cellColors[i][j][1], cellColors[i][j][2]);
      doc.rect(riskTableX + 16 + (j * colWidth), riskTableY + 22 + (i * colWidth), colWidth, colWidth, 'FD'); // Smaller width and height
      doc.setTextColor(0, 0, 0);
      doc.text(riskScores[i][j], riskTableX + 20 + (j * colWidth), riskTableY + 30 + (i * colWidth));
    }
  }
  
  // Impact text (vertically)
  doc.text("Impact", riskTableX + 8, riskTableY + 40, {
    align: "center",
    angle: 270
  });
  
  return Promise.resolve();
};
