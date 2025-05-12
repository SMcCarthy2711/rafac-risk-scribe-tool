export interface HeaderFields {
  "Squadron": string;
  "Assessor Name": string;
  "Activity Title": string;
  "Assessment Date": string;
  "Publications": string;
  "Risk Assessment Type": string;
  "SvgLogo"?: string; // Optional SVG logo data
}

export interface RiskEntry {
  Ref: string;
  "Activity/Element": string;
  "Hazards Identified": string;
  "Who or What Might be Harmed and How": string;
  "Existing Control Measures": string;
  Likelihood: string;
  Impact: string;
  "Risk Rating (LxI)": string;
  "Is Risk Acceptable": string;
  "Reasonable Additional Control Measures": string;
  "Revised Likelihood": string;
  "Revised Impact": string;
  "Revised Risk Rating (LxI)": string;
  "List Required Actions (Who, When and How)": string;
}

export interface CommanderFields {
  "Commander Name": string;
  "Commander Post": string;
  "Commander Date": string;
}

export interface DynamicFields {
  "Dynamic Reason": string;
  "New Restrictions": string;
  Remarks: string;
  "Dynamic Officer Name": string;
  "Dynamic Officer Post": string;
  "Dynamic Date": string;
}

export interface RiskAssessment {
  header: HeaderFields;
  risks: RiskEntry[];
  commander: CommanderFields;
  dynamic: DynamicFields;
}
