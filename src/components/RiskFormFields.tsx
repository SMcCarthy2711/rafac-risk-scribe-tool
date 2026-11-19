import RichTextEditor from "./RichTextEditor";

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
        <RichTextEditor
          id="activity"
          value={currentRisk["Activity/Element"]}
          onChange={(value) => onInputChange("Activity/Element", value)}
        />
      </div>
      
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="hazards">Hazards Identified</Label>
        <RichTextEditor
          id="hazards"
          value={currentRisk["Hazards Identified"]}
          onChange={(value) => onInputChange("Hazards Identified", value)}
        />
      </div>
      
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="who-harmed">Who or What Might be Harmed and How</Label>
        <RichTextEditor
          id="who-harmed"
          value={currentRisk["Who or What Might be Harmed and How"]}
          onChange={(value) => onInputChange("Who or What Might be Harmed and How", value)}
        />
      </div>
      
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="existing-controls">Existing Control Measures</Label>
        <RichTextEditor
          id="existing-controls"
          value={currentRisk["Existing Control Measures"]}
          onChange={(value) => onInputChange("Existing Control Measures", value)}
        />
      </div>
    </>
  );
};

export default RiskFormFields;
