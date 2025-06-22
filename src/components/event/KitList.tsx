
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Package } from "lucide-react";
import KitItem from "./KitItem";

interface KitItemData {
  item: string;
  caption: string;
}

interface KitListProps {
  eventPlanId: string;
}

const KitList: React.FC<KitListProps> = ({ eventPlanId }) => {
  const [kitList, setKitList] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [generalKit, setGeneralKit] = useState<KitItemData[]>([]);
  const [maleKit, setMaleKit] = useState<KitItemData[]>([]);
  const [femaleKit, setFemaleKit] = useState<KitItemData[]>([]);
  const [staffKit, setStaffKit] = useState<KitItemData[]>([]);

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
        // Parse the JSON data safely
        const cadetKitData = data.cadet_kit as any;
        if (cadetKitData && typeof cadetKitData === 'object') {
          setGeneralKit(Array.isArray(cadetKitData.general) ? cadetKitData.general : []);
          setMaleKit(Array.isArray(cadetKitData.male) ? cadetKitData.male : []);
          setFemaleKit(Array.isArray(cadetKitData.female) ? cadetKitData.female : []);
        }
        
        const staffKitData = data.staff_kit as any;
        setStaffKit(Array.isArray(staffKitData) ? staffKitData : []);
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
        cadet_kit: {
          general: generalKit,
          male: maleKit,
          female: femaleKit
        } as any,
        staff_kit: staffKit as any,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Kit List
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cadet Kit Section */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Cadet Kit</Label>
            
            <KitItem
              items={generalKit}
              setItems={setGeneralKit}
              title="General Kit (All Cadets)"
              placeholder="Add general kit item"
            />
            
            <KitItem
              items={maleKit}
              setItems={setMaleKit}
              title="Male Specific Kit"
              placeholder="Add male-specific kit item"
            />
            
            <KitItem
              items={femaleKit}
              setItems={setFemaleKit}
              title="Female Specific Kit"
              placeholder="Add female-specific kit item"
            />
          </div>

          {/* Staff Kit Section */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Staff Kit</Label>
            
            <KitItem
              items={staffKit}
              setItems={setStaffKit}
              title="Staff Kit"
              placeholder="Add staff kit item"
            />
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
