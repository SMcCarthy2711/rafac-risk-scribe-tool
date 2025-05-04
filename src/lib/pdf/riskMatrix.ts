
import { jsPDF } from 'jspdf';

// Add risk matrix image to the PDF
export const addRiskMatrix = async (
  doc: jsPDF, 
  matrixStartY: number, 
  matrixHeight: number, 
  margin: number, 
  effectiveWidth: number
): Promise<void> => {
  // Load the risk matrix image
  const img = new Image();
  img.src = '/lovable-uploads/339eab27-a618-4257-be6a-69d3eb8d952a.png';
    
  // Use a promise to ensure image is loaded before adding to PDF
  return new Promise<void>((resolve) => {
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
};
