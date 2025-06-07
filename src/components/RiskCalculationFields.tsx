
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RiskEntry as RiskEntryType } from "@/lib/types";

interface RiskCalculationFieldsProps {
  currentRisk: RiskEntryType;
  onInputChange: (field: keyof RiskEntryType, value: string) => void;
}

const RiskCalculationFields: React.FC<RiskCalculationFieldsProps> = ({ currentRisk, onInputChange }) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="likelihood">Likelihood (1-5)</Label>
        <Select 
          value={currentRisk.Likelihood} 
          onValueChange={(value) => onInputChange("Likelihood", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select likelihood" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map(num => (
              <SelectItem key={`l-${num}`} value={num.toString()}>{num}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="impact">Impact (1-5)</Label>
        <Select 
          value={currentRisk.Impact} 
          onValueChange={(value) => onInputChange("Impact", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select impact" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map(num => (
              <SelectItem key={`i-${num}`} value={num.toString()}>{num}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="risk-rating">Risk Rating (LxI)</Label>
        <Input
          id="risk-rating"
          value={currentRisk["Risk Rating (LxI)"]}
          readOnly
          className="bg-slate-100"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="acceptable">Is Risk Acceptable</Label>
        <Input
          id="acceptable"
          value={currentRisk["Is Risk Acceptable"]}
          readOnly
          className="bg-slate-100"
          placeholder="Auto-calculated based on risk rating"
        />
      </div>
    </>
  );
};

export default RiskCalculationFields;
