
export interface PreSavedRisk {
  id: string;
  category: string;
  subcategory?: string;
  activityElement: string;
  hazardsIdentified: string;
  whoMightBeHarmed: string;
  existingControlMeasures: string;
  likelihood: string;
  impact: string;
  additionalControlMeasures?: string;
  requiredActions?: string;
}

export interface RiskCategory {
  id: string;
  name: string;
  subcategories?: string[];
}

// Default categories and pre-saved risks
export const riskCategories: RiskCategory[] = [
  {
    id: "aviation",
    name: "Aviation Activities",
    subcategories: ["Flying Training", "Ground Operations", "Aircraft Maintenance"]
  },
  {
    id: "fieldcraft",
    name: "Fieldcraft & Outdoor Activities",
    subcategories: ["Camping", "Navigation", "Survival Training"]
  },
  {
    id: "sports",
    name: "Sports & Physical Training",
    subcategories: ["Team Sports", "Individual Training", "Adventure Training"]
  },
  {
    id: "facilities",
    name: "Facilities & Equipment",
    subcategories: ["Building Operations", "Equipment Use", "Maintenance"]
  },
  {
    id: "transport",
    name: "Transport & Travel",
    subcategories: ["Road Transport", "Public Transport", "Walking/Cycling"]
  }
];

export const preSavedRisks: PreSavedRisk[] = [
  {
    id: "flying-weather",
    category: "aviation",
    subcategory: "Flying Training",
    activityElement: "Flying in adverse weather conditions",
    hazardsIdentified: "Poor visibility, turbulence, strong winds, precipitation affecting aircraft control",
    whoMightBeHarmed: "Aircrew, passengers, ground personnel",
    existingControlMeasures: "Weather briefing, minimum weather limits, qualified instructor supervision",
    likelihood: "2",
    impact: "4",
    additionalControlMeasures: "Enhanced weather monitoring, alternative routing plans",
    requiredActions: "Pre-flight weather check (Instructor, Before each flight)"
  },
  {
    id: "camping-fire",
    category: "fieldcraft",
    subcategory: "Camping",
    activityElement: "Campfire activities",
    hazardsIdentified: "Burns from fire, smoke inhalation, fire spreading to vegetation",
    whoMightBeHarmed: "All participants, particularly those tending the fire",
    existingControlMeasures: "Fire safety briefing, designated fire area, fire extinguisher available",
    likelihood: "2",
    impact: "3",
    additionalControlMeasures: "Fire marshal appointed, burn ban awareness",
    requiredActions: "Fire safety check (Adult supervisor, Every 30 minutes)"
  },
  {
    id: "sports-collision",
    category: "sports",
    subcategory: "Team Sports",
    activityElement: "Contact sports activities",
    hazardsIdentified: "Player collisions, falls, equipment impact injuries",
    whoMightBeHarmed: "All players, particularly those in high-contact positions",
    existingControlMeasures: "Protective equipment, qualified referee, first aid kit available",
    likelihood: "3",
    impact: "3",
    additionalControlMeasures: "Pre-game safety briefing, equipment inspection",
    requiredActions: "Equipment check (Coach, Before each session)"
  },
  {
    id: "transport-minibus",
    category: "transport",
    subcategory: "Road Transport",
    activityElement: "Minibus transportation",
    hazardsIdentified: "Vehicle breakdown, road traffic accidents, driver fatigue",
    whoMightBeHarmed: "All passengers, driver, other road users",
    existingControlMeasures: "Licensed driver, vehicle MOT, insurance coverage, seatbelts",
    likelihood: "2",
    impact: "4",
    additionalControlMeasures: "Pre-journey vehicle check, emergency contact procedures",
    requiredActions: "Vehicle inspection (Driver, Before departure)"
  },
  {
    id: "equipment-tools",
    category: "facilities",
    subcategory: "Equipment Use",
    activityElement: "Workshop tool usage",
    hazardsIdentified: "Cuts from sharp tools, eye injuries from debris, electric shock",
    whoMightBeHarmed: "All workshop users, particularly inexperienced cadets",
    existingControlMeasures: "Safety briefing, protective equipment, adult supervision",
    likelihood: "2",
    impact: "3",
    additionalControlMeasures: "Tool safety training, regular equipment maintenance",
    requiredActions: "Safety equipment check (Instructor, Before each session)"
  }
];
