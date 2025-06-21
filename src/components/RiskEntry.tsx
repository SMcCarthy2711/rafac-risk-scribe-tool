
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskEntry as RiskEntryType } from "@/lib/types";
import { toast } from "sonner";
import { BookOpen } from "lucide-react";
import RiskFormFields from "./RiskFormFields";
import RiskCalculationFields from "./RiskCalculationFields";
import RevisedRiskFields from "./RevisedRiskFields";
import PreSavedRiskSelector from "./PreSavedRiskSelector";

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
  nextRefNumber: number;
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

  const [showPreSavedSelector, setShowPreSavedSelector] = useState(false);

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
    const riskRating = l * i;
    handleInputChange("Risk Rating (LxI)", riskRating.toString());
    
    // Automatically set "Is Risk Acceptable" based on risk rating
    const isAcceptable = riskRating < 10 ? "Yes" : "No";
    handleInputChange("Is Risk Acceptable", isAcceptable);
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

  const handlePreSavedRiskSelect = (risk: RiskEntryType) => {
    setCurrentRisk(risk);
    toast.success("Pre-saved risk loaded successfully!");
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="bg-rafac-blue text-white">
          <div className="flex justify-between items-center">
            <CardTitle>Risk Entry</CardTitle>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => setShowPreSavedSelector(true)}
              className="bg-white text-rafac-blue hover:bg-gray-100"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Add Pre-Saved Risk
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RiskFormFields 
              currentRisk={currentRisk} 
              onInputChange={handleInputChange} 
            />
            <RiskCalculationFields 
              currentRisk={currentRisk} 
              onInputChange={handleInputChange} 
            />
            <RevisedRiskFields 
              currentRisk={currentRisk} 
              onInputChange={handleInputChange} 
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleAddRisk} className="bg-rafac-blue hover:bg-rafac-navy">Add Risk</Button>
        </CardFooter>
      </Card>

      <PreSavedRiskSelector
        open={showPreSavedSelector}
        onOpenChange={setShowPreSavedSelector}
        onSelectRisk={handlePreSavedRiskSelect}
        nextRefNumber={nextRefNumber}
      />
    </>
  );
};

export default RiskEntry;
