
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Clock, Car, Plus, Trash2 } from "lucide-react";

interface Vehicle {
  vrn: string;
  driver_name: string;
  capacity: string;
}

const TravelPlan = ({ eventPlanId }) => {
  const [travelPlan, setTravelPlan] = useState(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    loadTravelPlan();
  }, [eventPlanId]);

  const loadTravelPlan = async () => {
    if (!eventPlanId) return;

    try {
      const { data, error } = await supabase
        .from("travel_plans")
        .select("*")
        .eq("event_plan_id", eventPlanId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setTravelPlan(data);
        // Safely parse vehicle details JSON
        const vehicleData = data.vehicle_details;
        if (Array.isArray(vehicleData)) {
          // Convert Json objects to Vehicle objects with proper type casting
          const vehicleList = vehicleData.map(vehicle => {
            const vehicleObj = vehicle as any; // Cast to any to access properties
            return {
              vrn: vehicleObj?.vrn || "",
              driver_name: vehicleObj?.driver_name || "",
              capacity: vehicleObj?.capacity || ""
            };
          });
          setVehicles(vehicleList);
        } else {
          setVehicles([]);
        }
      }
    } catch (error) {
      console.error("Error loading travel plan:", error);
      toast.error("Failed to load travel plan");
    }
  };

  const handleUpdate = async (field, value) => {
    if (!eventPlanId) return;

    try {
      // Get current user for RLS compliance
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error("Please log in to update travel plan");
        return;
      }

      const updateData = { [field]: value };

      if (travelPlan) {
        const { error } = await supabase
          .from("travel_plans")
          .update(updateData)
          .eq("id", travelPlan.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("travel_plans")
          .insert({ user_id: user.id, event_plan_id: eventPlanId, ...updateData })
          .select()
          .single();
        if (error) throw error;
        setTravelPlan(data);
      }

      toast.success("Travel plan updated");
    } catch (error) {
      console.error("Error updating travel plan:", error);
      toast.error("Failed to update travel plan");
    }
  };

  const handleSave = async () => {
    try {
      // Get current user for RLS compliance
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error("Please log in to save travel plan");
        return;
      }

      // Convert Vehicle array to Json-compatible format
      const vehicleDetailsJson = vehicles.filter(v => v.vrn || v.driver_name).map(v => ({
        vrn: v.vrn,
        driver_name: v.driver_name,
        capacity: v.capacity
      }));

      const travelData = {
        user_id: user.id,
        event_plan_id: eventPlanId,
        collection_point: travelPlan?.collection_point || "",
        drop_off_point: travelPlan?.drop_off_point || "",
        departure_time: travelPlan?.departure_time || null,
        return_time: travelPlan?.return_time || null,
        transport_method: travelPlan?.transport_method || "",
        vehicle_details: vehicleDetailsJson as any, // Cast to any to satisfy Json type
        map_link: travelPlan?.map_link || ""
      };

      if (travelPlan?.id) {
        const { error } = await supabase
          .from("travel_plans")
          .update(travelData)
          .eq("id", travelPlan.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("travel_plans")
          .insert(travelData)
          .select()
          .single();
        if (error) throw error;
        setTravelPlan(data);
      }

      toast.success("Travel plan saved successfully");
    } catch (error) {
      console.error("Error saving travel plan:", error);
      toast.error("Failed to save travel plan");
    }
  };

  const addVehicle = () => {
    setVehicles([...vehicles, { vrn: "", driver_name: "", capacity: "" }]);
  };

  const removeVehicle = (index) => {
    setVehicles(vehicles.filter((_, i) => i !== index));
  };

  const updateVehicle = (index, field, value) => {
    const updated = [...vehicles];
    updated[index][field] = value;
    setVehicles(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Travel Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="collection-point">Collection Point</Label>
            <Input
              id="collection-point"
              value={travelPlan?.collection_point || ""}
              onChange={(e) => setTravelPlan(prev => ({ ...prev, collection_point: e.target.value }))}
              placeholder="Enter collection point"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="drop-off-point">Drop-off Point</Label>
            <Input
              id="drop-off-point"
              value={travelPlan?.drop_off_point || ""}
              onChange={(e) => setTravelPlan(prev => ({ ...prev, drop_off_point: e.target.value }))}
              placeholder="Enter drop-off point"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="departure-time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Departure Time
            </Label>
            <Input
              id="departure-time"
              type="time"
              value={travelPlan?.departure_time || ""}
              onChange={(e) => setTravelPlan(prev => ({ ...prev, departure_time: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="return-time">Return Time</Label>
            <Input
              id="return-time"
              type="time"
              value={travelPlan?.return_time || ""}
              onChange={(e) => setTravelPlan(prev => ({ ...prev, return_time: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transport-method" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            Transport Method
          </Label>
          <Input
            id="transport-method"
            value={travelPlan?.transport_method || ""}
            onChange={(e) => setTravelPlan(prev => ({ ...prev, transport_method: e.target.value }))}
            placeholder="e.g., Minibus, Walking, Public Transport"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-medium">Vehicle Details</Label>
            <Button onClick={addVehicle} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Vehicle
            </Button>
          </div>
          
          {vehicles.map((vehicle, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label>Vehicle Registration</Label>
                <Input
                  value={vehicle.vrn}
                  onChange={(e) => updateVehicle(index, "vrn", e.target.value)}
                  placeholder="e.g., AB12 CDE"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Driver Name</Label>
                <Input
                  value={vehicle.driver_name}
                  onChange={(e) => updateVehicle(index, "driver_name", e.target.value)}
                  placeholder="Enter driver name"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Capacity</Label>
                <Input
                  type="number"
                  value={vehicle.capacity}
                  onChange={(e) => updateVehicle(index, "capacity", e.target.value)}
                  placeholder="Seats"
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  onClick={() => removeVehicle(index)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="map-link">Map Link (Optional)</Label>
          <Input
            id="map-link"
            value={travelPlan?.map_link || ""}
            onChange={(e) => setTravelPlan(prev => ({ ...prev, map_link: e.target.value }))}
            placeholder="Enter Google Maps or other map link"
          />
        </div>

        <Button onClick={handleSave} className="bg-rafac-blue hover:bg-rafac-navy text-white">
          Save Travel Plan
        </Button>
      </CardContent>
    </Card>
  );
};

export default TravelPlan;
