
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RiskEntry as RiskEntryType } from "@/lib/types";

interface Category {
  id: string;
  name: string;
  subcategories?: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  category_id: string;
}

interface PreSavedRisk {
  id: string;
  category_id: string;
  subcategory_id: string | null;
  activity_element: string;
  hazards_identified: string;
  who_might_be_harmed: string;
  existing_control_measures: string;
  likelihood: number;
  impact: number;
  additional_control_measures: string | null;
  required_actions: string | null;
}

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

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['risk-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('risk_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Category[];
    },
    enabled: open
  });

  // Fetch subcategories for selected category
  const { data: subcategories = [] } = useQuery({
    queryKey: ['risk-subcategories', selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      
      const { data, error } = await supabase
        .from('risk_subcategories')
        .select('*')
        .eq('category_id', selectedCategory)
        .order('name');
      
      if (error) throw error;
      return data as Subcategory[];
    },
    enabled: open && !!selectedCategory
  });

  // Fetch pre-saved risks for selected category/subcategory
  const { data: preSavedRisks = [] } = useQuery({
    queryKey: ['pre-saved-risks', selectedCategory, selectedSubcategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      
      let query = supabase
        .from('pre_saved_risks')
        .select('*')
        .eq('category_id', selectedCategory);
      
      if (selectedSubcategory) {
        query = query.eq('subcategory_id', selectedSubcategory);
      }
      
      const { data, error } = await query.order('activity_element');
      
      if (error) throw error;
      return data as PreSavedRisk[];
    },
    enabled: open && !!selectedCategory
  });

  const handleRiskSelect = (preSavedRisk: PreSavedRisk) => {
    const riskEntry: RiskEntryType = {
      "Ref": nextRefNumber.toString(),
      "Activity/Element": preSavedRisk.activity_element,
      "Hazards Identified": preSavedRisk.hazards_identified,
      "Who or What Might be Harmed and How": preSavedRisk.who_might_be_harmed,
      "Existing Control Measures": preSavedRisk.existing_control_measures,
      "Likelihood": preSavedRisk.likelihood.toString(),
      "Impact": preSavedRisk.impact.toString(),
      "Risk Rating (LxI)": (preSavedRisk.likelihood * preSavedRisk.impact).toString(),
      "Is Risk Acceptable": (preSavedRisk.likelihood * preSavedRisk.impact) < 10 ? "Yes" : "No",
      "Reasonable Additional Control Measures": preSavedRisk.additional_control_measures || "",
      "Revised Likelihood": preSavedRisk.likelihood.toString(),
      "Revised Impact": preSavedRisk.impact.toString(),
      "Revised Risk Rating (LxI)": (preSavedRisk.likelihood * preSavedRisk.impact).toString(),
      "List Required Actions (Who, When and How)": preSavedRisk.required_actions || ""
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

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
  const hasSubcategories = subcategories.length > 0;

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
                : !selectedSubcategory && hasSubcategories
                  ? `${selectedCategoryData?.name} - Select Subcategory`
                  : `Pre-Saved Risks ${selectedSubcategory ? `- ${subcategories.find(s => s.id === selectedSubcategory)?.name}` : `- ${selectedCategoryData?.name}`}`
              }
            </DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          {!selectedCategory ? (
            // Category Selection
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <Card 
                  key={category.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Click to view available risks
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !selectedSubcategory && hasSubcategories ? (
            // Subcategory Selection
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subcategories.map((subcategory) => (
                <Card 
                  key={subcategory.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedSubcategory(subcategory.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{subcategory.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Click to view available risks
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Risk Selection
            <div className="space-y-4">
              {preSavedRisks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No pre-saved risks available for this category.
                </p>
              ) : (
                preSavedRisks.map((risk) => (
                  <Card key={risk.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{risk.activity_element}</CardTitle>
                        <Button onClick={() => handleRiskSelect(risk)} size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Risk
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <strong className="text-sm">Hazards:</strong>
                        <p className="text-sm text-muted-foreground">{risk.hazards_identified}</p>
                      </div>
                      <div>
                        <strong className="text-sm">Who Might be Harmed:</strong>
                        <p className="text-sm text-muted-foreground">{risk.who_might_be_harmed}</p>
                      </div>
                      <div>
                        <strong className="text-sm">Existing Controls:</strong>
                        <p className="text-sm text-muted-foreground">{risk.existing_control_measures}</p>
                      </div>
                      <div className="flex gap-4 pt-2">
                        <Badge variant="outline">Likelihood: {risk.likelihood}</Badge>
                        <Badge variant="outline">Impact: {risk.impact}</Badge>
                        <Badge variant="outline">
                          Risk Rating: {risk.likelihood * risk.impact}
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
