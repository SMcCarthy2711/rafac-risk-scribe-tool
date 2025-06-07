
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RiskEntry as RiskEntryType } from "@/lib/types";

interface RiskFormFieldsProps {
  currentRisk: RiskEntryType;
  onInputChange: (field: keyof RiskEntryType, value: string) => void;
}

const RiskFormFields: React.FC<RiskFormFieldsProps> = ({ currentRisk, onInputChange }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="ref">Ref</Label>
        <Input
          id="ref"
          value={currentRisk.Ref}
          readOnly
          className="bg-slate-100"
          placeholder="Reference number (auto-generated)"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="activity">Activity/Element</Label>
        <Input
          id="activity"
          value={currentRisk["Activity/Element"]}
          onChange={(e) => onInputChange("Activity/Element", e.target.value)}
          placeholder="Enter activity or element"
        />
      </div>
      
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="hazards">Hazards Identified</Label>
        <Input
          id="hazards"
          value={currentRisk["Hazards Identified"]}
          onChange={(e) => onInputChange("Hazards Identified", e.target.value)}
          placeholder="Describe hazards"
        />
      </div>
      
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="who-harmed">Who or What Might be Harmed and How</Label>
        <Input
          id="who-harmed"
          value={currentRisk["Who or What Might be Harmed and How"]}
          onChange={(e) => onInputChange("Who or What Might be Harmed and How", e.target.value)}
          placeholder="Describe who/what might be harmed"
        />
      </div>
      
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="existing-controls">Existing Control Measures</Label>
        <Input
          id="existing-controls"
          value={currentRisk["Existing Control Measures"]}
          onChange={(e) => onInputChange("Existing Control Measures", e.target.value)}
          placeholder="Describe existing controls"
        />
      </div>
    </>
  );
};

export default RiskFormFields;
