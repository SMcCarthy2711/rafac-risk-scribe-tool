
import { jsPDF } from 'jspdf';
import { CommanderFields } from '../types';

const blueHeader = [5, 52, 133];

export const addCommanderSection = (
  doc: jsPDF,
  autoTable: any,
  commanderFields: CommanderFields,
  startY: number,
  margin: number
): number => {
  const sections = [
    {
      label: 'Activity Commander',
      description: 'The control measures when implemented are suitable and sufficient for the assessed activity to proceed:',
      data: commanderFields.activityCommander,
    },
    {
      label: 'Activity Commander Sign Off',
      description: 'After additional control measures the risk rating is 15 or above. Further authority / additional resource is required. Until the risks posed are deemed ALARP and tolerable the activity will not take place:',
      data: commanderFields.activityCommanderAdditional,
    },
    {
      label: 'Second Signature (OC or Nominated Rep)',
      description: 'I am aware of the activity and satisfied the RA is suitable and sufficient:',
      data: commanderFields.secondSignature,
    },
  ];

  let y = startY;

  sections.forEach((section) => {
    // Description row
    autoTable(doc, {
      startY: y,
      head: [[`${section.label} - ${section.description}`]],
      body: [],
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      margin: { left: margin, right: margin },
      headStyles: {
        fillColor: blueHeader,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
    });
    y = (doc as any).lastAutoTable.finalY;

    // Fields row
    autoTable(doc, {
      startY: y,
      head: [['Name:', 'Post:', 'Date:', 'Signature:']],
      body: [[
        section.data.Name,
        section.data.Post,
        section.data.Date,
        section.data.Signature,
      ]],
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2, minCellHeight: 12 },
      margin: { left: margin, right: margin },
      headStyles: {
        fillColor: blueHeader,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
    });
    y = (doc as any).lastAutoTable.finalY;
  });

  return y;
};
