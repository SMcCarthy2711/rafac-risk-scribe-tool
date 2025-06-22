
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Users, MapPin, Calendar, Phone } from "lucide-react";

const EventOverview = ({ eventPlan, setEventPlan }) => {
  const handleUpdate = async (field, value) => {
    try {
      const { data, error } = await supabase
        .from("event_plans")
        .update({ [field]: value })
        .eq("id", eventPlan.id)
        .select()
        .single();

      if (error) throw error;
      setEventPlan(data);
      toast.success("Event overview updated");
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event overview");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Event Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="event-name">Event Name</Label>
            <Input
              id="event-name"
              value={eventPlan?.name || ""}
              onChange={(e) => handleUpdate("name", e.target.value)}
              placeholder="Enter event name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="staff-lead">Staff Lead</Label>
            <Input
              id="staff-lead"
              value={eventPlan?.staff_lead || ""}
              onChange={(e) => handleUpdate("staff_lead", e.target.value)}
              placeholder="Enter staff lead name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </Label>
          <Input
            id="location"
            value={eventPlan?.location || ""}
            onChange={(e) => handleUpdate("location", e.target.value)}
            placeholder="Enter event location"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="start-date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Start Date
            </Label>
            <Input
              id="start-date"
              type="date"
              value={eventPlan?.start_date || ""}
              onChange={(e) => handleUpdate("start_date", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={eventPlan?.end_date || ""}
              onChange={(e) => handleUpdate("end_date", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="total-cadets">Total Cadets</Label>
            <Input
              id="total-cadets"
              type="number"
              min="0"
              value={eventPlan?.total_cadets || 0}
              onChange={(e) => handleUpdate("total_cadets", parseInt(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="total-staff">Total Staff</Label>
            <Input
              id="total-staff"
              type="number"
              min="0"
              value={eventPlan?.total_staff || 0}
              onChange={(e) => handleUpdate("total_staff", parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="emergency-contact" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Emergency Contact
          </Label>
          <Input
            id="emergency-contact"
            value={eventPlan?.emergency_contact || ""}
            onChange={(e) => handleUpdate("emergency_contact", e.target.value)}
            placeholder="Enter emergency contact details"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EventOverview;
