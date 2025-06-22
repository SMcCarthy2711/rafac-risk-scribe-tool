import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Package, Plus, X } from "lucide-react";

const KitList = ({ eventPlanId }) => {
  const [kitList, setKitList] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [cadetKit, setCadetKit] = useState([]);
  const [staffKit, setStaffKit] = useState([]);
  const [newCadetItem, setNewCadetItem] = useState("");
  const [newStaffItem, setNewStaffItem] = useState("");

  useEffect(() => {
    loadKitList();
    loadTemplates();
  }, [eventPlanId]);

  const loadKitList = async () => {
    if (!eventPlanId) return;

    try {
      const { data, error } = await supabase
        .from("kit_lists")
        .select("*")
        .eq("event_plan_id", eventPlanId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setKitList(data);
        // Safely parse JSON arrays
        setCadetKit(Array.isArray(data.cadet_kit) ? data.cadet_kit : []);
        setStaffKit(Array.isArray(data.staff_kit) ? data.staff_kit : []);
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

  const saveKitList = async () => {
    if (!eventPlanId) return;

    try {
      const kitData = {
        event_plan_id: eventPlanId,
        cadet_kit: cadetKit,
        staff_kit: staffKit,
        activity_type: "Custom"
      };

      if (kitList) {
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

  const handleAddCadetItem = () => {
    if (newCadetItem.trim() === "") return;
    setCadetKit([...cadetKit, newCadetItem.trim()]);
    setNewCadetItem("");
  };

  const handleAddStaffItem = () => {
    if (newStaffItem.trim() === "") return;
    setStaffKit([...staffKit, newStaffItem.trim()]);
    setNewStaffItem("");
  };

  const handleRemoveCadetItem = (index) => {
    const newKit = [...cadetKit];
    newKit.splice(index, 1);
    setCadetKit(newKit);
  };

  const handleRemoveStaffItem = (index) => {
    const newKit = [...staffKit];
    newKit.splice(index, 1);
    setStaffKit(newKit);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Kit List
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cadet Kit */}
        <div className="space-y-2">
          <Label>Cadet Kit</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Add item"
              value={newCadetItem}
              onChange={(e) => setNewCadetItem(e.target.value)}
            />
            <Button type="button" onClick={handleAddCadetItem} className="bg-green-500 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {cadetKit.map((item, index) => (
              <Badge key={index} className="gap-1 items-center">
                {item}
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveCadetItem(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Staff Kit */}
        <div className="space-y-2">
          <Label>Staff Kit</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Add item"
              value={newStaffItem}
              onChange={(e) => setNewStaffItem(e.target.value)}
            />
            <Button type="button" onClick={handleAddStaffItem} className="bg-green-500 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {staffKit.map((item, index) => (
              <Badge key={index} className="gap-1 items-center">
                {item}
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveStaffItem(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>

        <Button onClick={saveKitList} className="bg-rafac-blue hover:bg-rafac-navy text-white">
          Save Kit List
        </Button>
      </CardContent>
    </Card>
  );
};

export default KitList;
