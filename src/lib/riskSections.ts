import type { RiskEntry } from './types';
export const environmentalHeading = 'Activity Environmental Risk / Impact (Step 3k):';
export const splitRisks = (risks: RiskEntry[]) => ({
  activity: risks.filter(risk => risk.section !== 'environmental'),
  environmental: risks.filter(risk => risk.section === 'environmental'),
});
