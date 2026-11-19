
export interface HeaderFields {
  "Squadron": string;
  "Assessor Name": string;
  "Activity Title": string;
  "Assessment Date": string;
  "Publications": string;
  "Risk Assessment Type": "Generic" | "Specific" | ""; // Limited to these two options
  "Review 1 Date"?: string; // RA Review (Step 5) - first review date
  "Review 2 Date"?: string; // RA Review (Step 5) - second review date
  "Review 3 Date"?: string; // RA Review (Step 5) - third review date
  "Review 4 Date"?: string; // RA Review (Step 5) - fourth review date
  "SvgLogo"?: string; // Optional SVG logo data
  "PngImage"?: string; // Optional PNG image path
}

export interface RiskEntry {
  section?: "activity" | "environmental";
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

export interface SignOffEntry {
  Name: string;
  Post: string;
  Date: string;
  Signature: string;
}

export interface CommanderFields {
  activityCommander: SignOffEntry;
  activityCommanderAdditional: SignOffEntry;
  secondSignature: SignOffEntry;
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
