
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RiskEntry as RiskEntryType } from "@/lib/types";

interface RevisedRiskFieldsProps {
  currentRisk: RiskEntryType;
  onInputChange: (field: keyof RiskEntryType, value: string) => void;
}

const RevisedRiskFields: React.FC<RevisedRiskFieldsProps> = ({ currentRisk, onInputChange }) => {
  return (
    <>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="additional-controls">Reasonable Additional Control Measures</Label>
        <Input
          id="additional-controls"
          value={currentRisk["Reasonable Additional Control Measures"]}
          onChange={(e) => onInputChange("Reasonable Additional Control Measures", e.target.value)}
          placeholder="Describe additional controls"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="revised-likelihood">Revised Likelihood (1-5)</Label>
        <Select 
          value={currentRisk["Revised Likelihood"]} 
          onValueChange={(value) => onInputChange("Revised Likelihood", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select revised likelihood" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map(num => (
              <SelectItem key={`rl-${num}`} value={num.toString()}>{num}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="revised-impact">Revised Impact (1-5)</Label>
        <Select 
          value={currentRisk["Revised Impact"]} 
          onValueChange={(value) => onInputChange("Revised Impact", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select revised impact" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map(num => (
              <SelectItem key={`ri-${num}`} value={num.toString()}>{num}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="revised-risk-rating">Revised Risk Rating (LxI)</Label>
        <Input
          id="revised-risk-rating"
          value={currentRisk["Revised Risk Rating (LxI)"]}
          readOnly
          className="bg-slate-100"
        />
      </div>
      
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="required-actions">List Required Actions (Who, When and How)</Label>
        <Input
          id="required-actions"
          value={currentRisk["List Required Actions (Who, When and How)"]}
          onChange={(e) => onInputChange("List Required Actions (Who, When and How)", e.target.value)}
          placeholder="Describe required actions"
        />
      </div>
    </>
  );
};

export default RevisedRiskFields;
