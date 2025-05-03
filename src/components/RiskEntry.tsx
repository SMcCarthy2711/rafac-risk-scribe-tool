import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RiskEntry as RiskEntryType } from "@/lib/types";
import { toast } from "sonner";

const emptyRisk: RiskEntryType = {
  "Ref": "",
  "Activity/Element": "",
  "Hazards Identified": "",
  "Who or What Might be Harmed and How": "",
  "Existing Control Measures": "",
  "Likelihood": "1",
  "Impact": "1",
  "Risk Rating (LxI)": "1",
  "Is Risk Acceptable": "Yes",
  "Reasonable Additional Control Measures": "",
  "Revised Likelihood": "1",
  "Revised Impact": "1",
  "Revised Risk Rating (LxI)": "1",
  "List Required Actions (Who, When and How)": ""
};

interface RiskEntryProps {
  onAddRisk: (risk: RiskEntryType) => void;
  nextRefNumber: number; // New prop to receive the next reference number
}

const RiskEntry: React.FC<RiskEntryProps> = ({ onAddRisk, nextRefNumber }) => {
  const [currentRisk, setCurrentRisk] = useState<RiskEntryType>({
    "Ref": nextRefNumber.toString(),
    "Activity/Element": "",
    "Hazards Identified": "",
    "Who or What Might be Harmed and How": "",
    "Existing Control Measures": "",
    "Likelihood": "1",
    "Impact": "1",
    "Risk Rating (LxI)": "1",
    "Is Risk Acceptable": "Yes",
    "Reasonable Additional Control Measures": "",
    "Revised Likelihood": "1",
    "Revised Impact": "1",
    "Revised Risk Rating (LxI)": "1",
    "List Required Actions (Who, When and How)": ""
  });

  useEffect(() => {
    // Update ref when nextRefNumber prop changes
    setCurrentRisk(prev => ({
      ...prev,
      "Ref": nextRefNumber.toString()
    }));
  }, [nextRefNumber]);

  const handleInputChange = (field: keyof RiskEntryType, value: string) => {
    setCurrentRisk((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    // Calculate risk rating when likelihood or impact changes
    const l = parseInt(currentRisk.Likelihood) || 0;
    const i = parseInt(currentRisk.Impact) || 0;
    handleInputChange("Risk Rating (LxI)", (l * i).toString());
  }, [currentRisk.Likelihood, currentRisk.Impact]);

  useEffect(() => {
    // Calculate revised risk rating when revised likelihood or impact changes
    const l = parseInt(currentRisk["Revised Likelihood"]) || 0;
    const i = parseInt(currentRisk["Revised Impact"]) || 0;
    handleInputChange("Revised Risk Rating (LxI)", (l * i).toString());
  }, [currentRisk["Revised Likelihood"], currentRisk["Revised Impact"]]);

  const handleAddRisk = () => {
    // Simple validation to ensure key fields are filled
    if (!currentRisk["Activity/Element"] || !currentRisk["Hazards Identified"]) {
      toast.error("Please fill in Activity/Element and Hazards Identified");
      return;
    }

    onAddRisk({...currentRisk});
    
    // Reset form with incremented reference number (keep this for UX, even though the parent component will update nextRefNumber)
    setCurrentRisk({
      "Ref": (nextRefNumber + 1).toString(),
      "Activity/Element": "",
      "Hazards Identified": "",
      "Who or What Might be Harmed and How": "",
      "Existing Control Measures": "",
      "Likelihood": "1",
      "Impact": "1",
      "Risk Rating (LxI)": "1",
      "Is Risk Acceptable": "Yes",
      "Reasonable Additional Control Measures": "",
      "Revised Likelihood": "1",
      "Revised Impact": "1",
      "Revised Risk Rating (LxI)": "1",
      "List Required Actions (Who, When and How)": ""
    });
    
    toast.success("Risk entry added successfully!");
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-rafac-blue text-white">
        <CardTitle>Risk Entry</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              onChange={(e) => handleInputChange("Activity/Element", e.target.value)}
              placeholder="Enter activity or element"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="hazards">Hazards Identified</Label>
            <Input
              id="hazards"
              value={currentRisk["Hazards Identified"]}
              onChange={(e) => handleInputChange("Hazards Identified", e.target.value)}
              placeholder="Describe hazards"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="who-harmed">Who or What Might be Harmed and How</Label>
            <Input
              id="who-harmed"
              value={currentRisk["Who or What Might be Harmed and How"]}
              onChange={(e) => handleInputChange("Who or What Might be Harmed and How", e.target.value)}
              placeholder="Describe who/what might be harmed"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="existing-controls">Existing Control Measures</Label>
            <Input
              id="existing-controls"
              value={currentRisk["Existing Control Measures"]}
              onChange={(e) => handleInputChange("Existing Control Measures", e.target.value)}
              placeholder="Describe existing controls"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="likelihood">Likelihood (1-5)</Label>
            <Select 
              value={currentRisk.Likelihood} 
              onValueChange={(value) => handleInputChange("Likelihood", value)}
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
              onValueChange={(value) => handleInputChange("Impact", value)}
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
            <Select 
              value={currentRisk["Is Risk Acceptable"]} 
              onValueChange={(value) => handleInputChange("Is Risk Acceptable", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Is risk acceptable?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="additional-controls">Reasonable Additional Control Measures</Label>
            <Input
              id="additional-controls"
              value={currentRisk["Reasonable Additional Control Measures"]}
              onChange={(e) => handleInputChange("Reasonable Additional Control Measures", e.target.value)}
              placeholder="Describe additional controls"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="revised-likelihood">Revised Likelihood (1-5)</Label>
            <Select 
              value={currentRisk["Revised Likelihood"]} 
              onValueChange={(value) => handleInputChange("Revised Likelihood", value)}
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
              onValueChange={(value) => handleInputChange("Revised Impact", value)}
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
              onChange={(e) => handleInputChange("List Required Actions (Who, When and How)", e.target.value)}
              placeholder="Describe required actions"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleAddRisk} className="bg-rafac-blue hover:bg-rafac-navy">Add Risk</Button>
      </CardFooter>
    </Card>
  );
};

export default RiskEntry;
