
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Clock, Plus, Trash2, Calendar } from "lucide-react";

const EventSchedule = ({ eventPlanId }) => {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [newItem, setNewItem] = useState({
    date: "",
    start_time: "",
    end_time: "",
    activity: "",
    lead_person: "",
    target_audience: "All",
    notes: ""
  });

  useEffect(() => {
    loadSchedule();
  }, [eventPlanId]);

  const loadSchedule = async () => {
    try {
      const { data, error } = await supabase
        .from("event_schedules")
        .select("*")
        .eq("event_plan_id", eventPlanId)
        .order("date", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) throw error;
      setScheduleItems(data || []);
    } catch (error) {
      console.error("Error loading schedule:", error);
      toast.error("Failed to load schedule");
    }
  };

  const addScheduleItem = async () => {
    if (!newItem.date || !newItem.start_time || !newItem.end_time || !newItem.activity) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("event_schedules")
        .insert({
          event_plan_id: eventPlanId,
          ...newItem
        })
        .select()
        .single();

      if (error) throw error;

      setScheduleItems([...scheduleItems, data]);
      setNewItem({
        date: "",
        start_time: "",
        end_time: "",
        activity: "",
        lead_person: "",
        target_audience: "All",
        notes: ""
      });
      toast.success("Schedule item added");
    } catch (error) {
      console.error("Error adding schedule item:", error);
      toast.error("Failed to add schedule item");
    }
  };

  const removeScheduleItem = async (id) => {
    try {
      const { error } = await supabase
        .from("event_schedules")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setScheduleItems(scheduleItems.filter(item => item.id !== id));
      toast.success("Schedule item removed");
    } catch (error) {
      console.error("Error removing schedule item:", error);
      toast.error("Failed to remove schedule item");
    }
  };

  const groupedSchedule = scheduleItems.reduce((acc, item) => {
    const date = item.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Event Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Schedule Item */}
        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Add Schedule Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newItem.date}
                  onChange={(e) => setNewItem(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time *</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={newItem.start_time}
                  onChange={(e) => setNewItem(prev => ({ ...prev, start_time: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time *</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={newItem.end_time}
                  onChange={(e) => setNewItem(prev => ({ ...prev, end_time: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activity">Activity *</Label>
                <Input
                  id="activity"
                  value={newItem.activity}
                  onChange={(e) => setNewItem(prev => ({ ...prev, activity: e.target.value }))}
                  placeholder="Enter activity name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lead-person">Lead Person</Label>
                <Input
                  id="lead-person"
                  value={newItem.lead_person}
                  onChange={(e) => setNewItem(prev => ({ ...prev, lead_person: e.target.value }))}
                  placeholder="Enter lead person name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target-audience">Target Audience</Label>
                <Select
                  value={newItem.target_audience}
                  onValueChange={(value) => setNewItem(prev => ({ ...prev, target_audience: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Cadets">Cadets Only</SelectItem>
                    <SelectItem value="Staff">Staff Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={newItem.notes}
                  onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Optional notes"
                />
              </div>
            </div>

            <Button onClick={addScheduleItem} className="bg-rafac-blue hover:bg-rafac-navy text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add to Schedule
            </Button>
          </CardContent>
        </Card>

        {/* Schedule Display */}
        <div className="space-y-6">
          {Object.keys(groupedSchedule).sort().map(date => (
            <Card key={date}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(date).toLocaleDateString("en-GB", { 
                    weekday: "long", 
                    year: "numeric", 
                    month: "long", 
                    day: "numeric" 
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {groupedSchedule[date].map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                        <div>
                          <span className="text-sm font-medium text-slate-600">Time:</span>
                          <p className="font-medium">{item.start_time} - {item.end_time}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-600">Activity:</span>
                          <p className="font-medium">{item.activity}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-600">Lead:</span>
                          <p>{item.lead_person || "TBC"}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-600">Audience:</span>
                          <p>{item.target_audience}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => removeScheduleItem(item.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {Object.keys(groupedSchedule).length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No schedule items added yet. Add your first item above.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventSchedule;
