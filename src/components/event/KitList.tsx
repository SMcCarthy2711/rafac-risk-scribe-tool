
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Package, Plus, Trash2, Copy } from "lucide-react";

const KitList = ({ eventPlanId }) => {
  const [kitList, setKitList] = useState(null);
  const [cadetKit, setCadetKit] = useState([]);
  const [staffKit, setStaffKit] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  useEffect(() => {
    loadKitList();
    loadTemplates();
  }, [eventPlanId]);

  const loadKitList = async () => {
    try {
      const { data, error } = await supabase
        .from("kit_lists")
        .select("*")
        .eq("event_plan_id", eventPlanId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setKitList(data);
        setCadetKit(data.cadet_kit || []);
        setStaffKit(data.staff_kit || []);
      }
    } catch (error) {
      console.error("Error loading kit list:", error);
      toast.error("Failed to load kit list");
    }
  };

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("kit_lists")
        .select("*")
        .is("event_plan_id", null);

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error("Error loading templates:", error);
    }
  };

  const handleSave = async () => {
    try {
      const kitData = {
        event_plan_id: eventPlanId,
        activity_type: kitList?.activity_type || "",
        cadet_kit: cadetKit,
        staff_kit: staffKit
      };

      if (kitList?.id) {
        const { error } = await supabase
          .from("kit_lists")
          .update(kitData)
          .eq("id", kitList.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("kit_lists")
          .insert(kitData)
          .select()
          .single();
        if (error) throw error;
        setKitList(data);
      }

      toast.success("Kit list saved successfully");
    } catch (error) {
      console.error("Error saving kit list:", error);
      toast.error("Failed to save kit list");
    }
  };

  const addKitItem = (type) => {
    if (type === "cadet") {
      setCadetKit([...cadetKit, ""]);
    } else {
      setStaffKit([...staffKit, ""]);
    }
  };

  const removeKitItem = (type, index) => {
    if (type === "cadet") {
      setCadetKit(cadetKit.filter((_, i) => i !== index));
    } else {
      setStaffKit(staffKit.filter((_, i) => i !== index));
    }
  };

  const updateKitItem = (type, index, value) => {
    if (type === "cadet") {
      const updated = [...cadetKit];
      updated[index] = value;
      setCadetKit(updated);
    } else {
      const updated = [...staffKit];
      updated[index] = value;
      setStaffKit(updated);
    }
  };

  const loadTemplate = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    if (template) {
      setCadetKit(template.cadet_kit || []);
      setStaffKit(template.staff_kit || []);
      setKitList(prev => ({ ...prev, activity_type: template.activity_type }));
      toast.success("Template loaded successfully");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Kit List
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Selection */}
        <div className="flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <Label>Load from Template</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.activity_type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={loadTemplate} disabled={!selectedTemplate} variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Load Template
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="activity-type">Activity Type</Label>
          <Input
            id="activity-type"
            value={kitList?.activity_type || ""}
            onChange={(e) => setKitList(prev => ({ ...prev, activity_type: e.target.value }))}
            placeholder="e.g., Adventure Training, Range Day"
          />
        </div>

        {/* Cadet Kit */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-medium">Cadet Kit</Label>
            <Button onClick={() => addKitItem("cadet")} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </div>
          
          {cadetKit.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => updateKitItem("cadet", index, e.target.value)}
                placeholder="Enter kit item"
                className="flex-1"
              />
              <Button
                onClick={() => removeKitItem("cadet", index)}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Staff Kit */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-medium">Staff Kit</Label>
            <Button onClick={() => addKitItem("staff")} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </div>
          
          {staffKit.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => updateKitItem("staff", index, e.target.value)}
                placeholder="Enter kit item"
                className="flex-1"
              />
              <Button
                onClick={() => removeKitItem("staff", index)}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button onClick={handleSave} className="bg-rafac-blue hover:bg-rafac-navy text-white">
          Save Kit List
        </Button>
      </CardContent>
    </Card>
  );
};

export default KitList;
