
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DynamicFields } from "@/lib/types";

interface DynamicRAProps {
  dynamicFields: DynamicFields;
  setDynamicFields: React.Dispatch<React.SetStateAction<DynamicFields>>;
}

const DynamicRA: React.FC<DynamicRAProps> = ({ dynamicFields, setDynamicFields }) => {
  const handleInputChange = (field: keyof DynamicFields, value: string) => {
    setDynamicFields((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-rafac-blue text-white">
        <CardTitle>Dynamic Risk Assessment</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dynamic-reason">Dynamic Reason</Label>
            <Textarea
              id="dynamic-reason"
              value={dynamicFields["Dynamic Reason"]}
              onChange={(e) => handleInputChange("Dynamic Reason", e.target.value)}
              placeholder="Reason for dynamic risk assessment"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-restrictions">New Restrictions</Label>
            <Textarea
              id="new-restrictions"
              value={dynamicFields["New Restrictions"]}
              onChange={(e) => handleInputChange("New Restrictions", e.target.value)}
              placeholder="New restrictions to be implemented"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={dynamicFields.Remarks}
              onChange={(e) => handleInputChange("Remarks", e.target.value)}
              placeholder="Additional remarks"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dynamic-officer-name">Dynamic Officer Name</Label>
              <Input
                id="dynamic-officer-name"
                value={dynamicFields["Dynamic Officer Name"]}
                onChange={(e) => handleInputChange("Dynamic Officer Name", e.target.value)}
                placeholder="Enter officer name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dynamic-officer-post">Dynamic Officer Post</Label>
              <Input
                id="dynamic-officer-post"
                value={dynamicFields["Dynamic Officer Post"]}
                onChange={(e) => handleInputChange("Dynamic Officer Post", e.target.value)}
                placeholder="Enter officer post"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dynamic-date">Dynamic Date</Label>
              <Input
                id="dynamic-date"
                value={dynamicFields["Dynamic Date"]}
                onChange={(e) => handleInputChange("Dynamic Date", e.target.value)}
                placeholder="DD/MM/YYYY"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicRA;
