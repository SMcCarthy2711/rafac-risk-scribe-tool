
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Plus } from "lucide-react";
import { riskCategories, preSavedRisks, PreSavedRisk } from "@/lib/preSavedRisks";
import { RiskEntry as RiskEntryType } from "@/lib/types";

interface PreSavedRiskSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectRisk: (risk: RiskEntryType) => void;
  nextRefNumber: number;
}

const PreSavedRiskSelector: React.FC<PreSavedRiskSelectorProps> = ({
  open,
  onOpenChange,
  onSelectRisk,
  nextRefNumber
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const handleRiskSelect = (preSavedRisk: PreSavedRisk) => {
    const riskEntry: RiskEntryType = {
      "Ref": nextRefNumber.toString(),
      "Activity/Element": preSavedRisk.activityElement,
      "Hazards Identified": preSavedRisk.hazardsIdentified,
      "Who or What Might be Harmed and How": preSavedRisk.whoMightBeHarmed,
      "Existing Control Measures": preSavedRisk.existingControlMeasures,
      "Likelihood": preSavedRisk.likelihood,
      "Impact": preSavedRisk.impact,
      "Risk Rating (LxI)": (parseInt(preSavedRisk.likelihood) * parseInt(preSavedRisk.impact)).toString(),
      "Is Risk Acceptable": (parseInt(preSavedRisk.likelihood) * parseInt(preSavedRisk.impact)) < 10 ? "Yes" : "No",
      "Reasonable Additional Control Measures": preSavedRisk.additionalControlMeasures || "",
      "Revised Likelihood": preSavedRisk.likelihood,
      "Revised Impact": preSavedRisk.impact,
      "Revised Risk Rating (LxI)": (parseInt(preSavedRisk.likelihood) * parseInt(preSavedRisk.impact)).toString(),
      "List Required Actions (Who, When and How)": preSavedRisk.requiredActions || ""
    };

    onSelectRisk(riskEntry);
    onOpenChange(false);
    
    // Reset navigation state
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const handleBack = () => {
    if (selectedSubcategory) {
      setSelectedSubcategory(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  const filteredRisks = preSavedRisks.filter(risk => {
    if (!selectedCategory) return false;
    if (selectedCategory && !selectedSubcategory) {
      return risk.category === selectedCategory;
    }
    return risk.category === selectedCategory && risk.subcategory === selectedSubcategory;
  });

  const selectedCategoryData = riskCategories.find(cat => cat.id === selectedCategory);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {(selectedCategory || selectedSubcategory) && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle>
              {!selectedCategory 
                ? "Select Risk Category"
                : !selectedSubcategory && selectedCategoryData?.subcategories
                  ? `${selectedCategoryData.name} - Select Subcategory`
                  : `Pre-Saved Risks ${selectedSubcategory ? `- ${selectedSubcategory}` : `- ${selectedCategoryData?.name}`}`
              }
            </DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          {!selectedCategory ? (
            // Category Selection
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {riskCategories.map((category) => (
                <Card 
                  key={category.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories?.map((sub) => (
                        <Badge key={sub} variant="secondary" className="text-xs">
                          {sub}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {preSavedRisks.filter(risk => risk.category === category.id).length} risks available
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !selectedSubcategory && selectedCategoryData?.subcategories ? (
            // Subcategory Selection
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCategoryData.subcategories.map((subcategory) => (
                <Card 
                  key={subcategory}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedSubcategory(subcategory)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{subcategory}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {preSavedRisks.filter(risk => 
                        risk.category === selectedCategory && risk.subcategory === subcategory
                      ).length} risks available
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Risk Selection
            <div className="space-y-4">
              {filteredRisks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No pre-saved risks available for this category.
                </p>
              ) : (
                filteredRisks.map((risk) => (
                  <Card key={risk.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{risk.activityElement}</CardTitle>
                        <Button onClick={() => handleRiskSelect(risk)} size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Risk
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <strong className="text-sm">Hazards:</strong>
                        <p className="text-sm text-muted-foreground">{risk.hazardsIdentified}</p>
                      </div>
                      <div>
                        <strong className="text-sm">Who Might be Harmed:</strong>
                        <p className="text-sm text-muted-foreground">{risk.whoMightBeHarmed}</p>
                      </div>
                      <div>
                        <strong className="text-sm">Existing Controls:</strong>
                        <p className="text-sm text-muted-foreground">{risk.existingControlMeasures}</p>
                      </div>
                      <div className="flex gap-4 pt-2">
                        <Badge variant="outline">Likelihood: {risk.likelihood}</Badge>
                        <Badge variant="outline">Impact: {risk.impact}</Badge>
                        <Badge variant="outline">
                          Risk Rating: {parseInt(risk.likelihood) * parseInt(risk.impact)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PreSavedRiskSelector;
