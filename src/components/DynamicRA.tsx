import RichTextEditor from "./RichTextEditor";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DynamicFields } from "@/lib/types";
import EventDatePicker from './EventDatePicker';
import { displayDateEntry } from '@/lib/dateEntry';

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
            <RichTextEditor
              id="dynamic-reason"
              value={dynamicFields["Dynamic Reason"]}
              onChange={(value) => handleInputChange("Dynamic Reason", value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-restrictions">New Restrictions</Label>
            <RichTextEditor
              id="new-restrictions"
              value={dynamicFields["New Restrictions"]}
              onChange={(value) => handleInputChange("New Restrictions", value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <RichTextEditor
              id="remarks"
              value={dynamicFields.Remarks}
              onChange={(value) => handleInputChange("Remarks", value)}
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
              <EventDatePicker
                id="dynamic-date"
                label="Dynamic Date"
                value={dynamicFields["Dynamic Date"]}
                onChange={(value) => handleInputChange("Dynamic Date", displayDateEntry(value))}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicRA;
