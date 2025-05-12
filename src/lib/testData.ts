
import { RiskAssessment } from "./types";

// A simple RAF logo SVG for testing
const rafSvgLogo = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200" width="800" height="200">
  <rect x="50" y="50" width="700" height="100" fill="#003D87" stroke="#FFFFFF" stroke-width="2"/>
  <text x="400" y="120" font-family="Arial" font-size="60" fill="#FFFFFF" text-anchor="middle">RAF RISK ASSESSMENT</text>
  <circle cx="120" cy="100" r="40" fill="#CE1126"/>
</svg>
`;

export const getTestData = (): RiskAssessment => {
  return {
    header: {
      "Squadron": "1234 (Example) Squadron",
      "Assessor Name": "F/Sgt John Smith",
      "Activity Title": "Annual Camp - Adventure Training",
      "Assessment Date": new Date().toLocaleDateString("en-GB"),
      "Publications": "AP1034 - RAF Health and Safety Guidelines\nACP 4 - Air Cadet Health and Safety Manual\nJSP 375 - MOD Health and Safety Handbook",
      "Risk Assessment Type": "Generic",
      "SvgLogo": rafSvgLogo // Adding the SVG logo to test data
    },
    risks: [
      {
        "Ref": "1",
        "Activity/Element": "Hiking in mountainous terrain",
        "Hazards Identified": "Adverse weather conditions, steep terrain, navigation errors",
        "Who or What Might be Harmed and How": "All personnel - risk of injury from slips/falls, hypothermia, or becoming lost",
        "Existing Control Measures": "Weather forecast checked prior to activity, route cards prepared, qualified Mountain Leader present, appropriate equipment issued",
        "Likelihood": "2",
        "Impact": "4",
        "Risk Rating (LxI)": "8",
        "Is Risk Acceptable": "Yes",
        "Reasonable Additional Control Measures": "Group size limited to 1:6 ratio of staff to cadets, regular radio check-ins scheduled",
        "Revised Likelihood": "1",
        "Revised Impact": "4",
        "Revised Risk Rating (LxI)": "4",
        "List Required Actions (Who, When and How)": "Staff to conduct equipment checks before departure, confirm comms plan the day before"
      },
      {
        "Ref": "2",
        "Activity/Element": "Transport to and from activity location",
        "Hazards Identified": "Road traffic accidents, vehicle breakdown",
        "Who or What Might be Harmed and How": "All personnel - risk of injury from collision or being stranded",
        "Existing Control Measures": "Approved RAFAC drivers only, vehicles serviced and checked before journey, journey management plan in place",
        "Likelihood": "2",
        "Impact": "5",
        "Risk Rating (LxI)": "10",
        "Is Risk Acceptable": "Yes",
        "Reasonable Additional Control Measures": "Secondary transport option available, emergency contact details for all personnel carried in vehicles",
        "Revised Likelihood": "1",
        "Revised Impact": "5",
        "Revised Risk Rating (LxI)": "5",
        "List Required Actions (Who, When and How)": "Lead staff to brief all drivers on route and contingency plans the day before departure"
      }
    ],
    commander: {
      "Commander Name": "Sqn Ldr Jane Williams",
      "Commander Post": "Officer Commanding",
      "Commander Date": new Date().toLocaleDateString("en-GB")
    },
    dynamic: {
      "Dynamic Reason": "Weather forecast deteriorated with heavy rain and wind warnings",
      "New Restrictions": "Activity limited to lower altitude routes only, emergency shelter points identified every 2km",
      "Remarks": "Activity duration reduced by 2 hours to ensure return before forecast storm front arrives",
      "Dynamic Officer Name": "Flt Lt Robert Johnson",
      "Dynamic Officer Post": "Activity Lead",
      "Dynamic Date": new Date().toLocaleDateString("en-GB")
    }
  };
};
