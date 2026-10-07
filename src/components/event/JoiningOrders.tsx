import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Download, QrCode } from "lucide-react";
import { exportJoiningOrdersPdf } from "@/lib/eventDocumentPdf";

interface JoiningOrdersProps {
  eventPlan: any;
  riskAssessment: any;
  eventDescription?: string;
}

const JoiningOrders: React.FC<JoiningOrdersProps> = ({ eventPlan, riskAssessment, eventDescription }) => {
  const [joiningOrder, setJoiningOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadJoiningOrder();
  }, [eventPlan?.id]);

  const loadJoiningOrder = async () => {
    if (!eventPlan?.id) return;

    try {
      const { data, error } = await supabase
        .from("joining_orders")
        .select("*")
        .eq("event_plan_id", eventPlan.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setJoiningOrder(data);
    } catch (error) {
      console.error("Error loading joining order:", error);
    }
  };

  const generateJoiningOrder = async () => {
    if (!eventPlan) {
      toast.error("Event plan data not available");
      return;
    }

    setLoading(true);
    try {
      // Load additional data needed for joining orders
      const [travelData, kitData, scheduleData] = await Promise.all([
        supabase.from("travel_plans").select("*").eq("event_plan_id", eventPlan.id).maybeSingle(),
        supabase.from("kit_lists").select("*").eq("event_plan_id", eventPlan.id).maybeSingle(),
        supabase.from("event_schedules").select("*").eq("event_plan_id", eventPlan.id).order("date").order("start_time")
      ]);

      const joData = {
        event_name: eventPlan.name,
        location: eventPlan.location,
        start_date: eventPlan.start_date,
        end_date: eventPlan.end_date,
        staff_lead: eventPlan.staff_lead,
        emergency_contact: eventPlan.emergency_contact,
        event_description: eventDescription || "",
        travel_plan: travelData.data,
        kit_list: kitData.data,
        schedule: scheduleData.data,
        risk_assessment: {
          title: riskAssessment?.activity_title,
          assessor: riskAssessment?.assessor_name,
          date: riskAssessment?.assessment_date
        }
      };

      const qrCodeData = `Event: ${eventPlan.name}\nLocation: ${eventPlan.location}\nDate: ${eventPlan.start_date}`;

      if (joiningOrder?.id) {
        const { error } = await supabase
          .from("joining_orders")
          .update({
            content: joData,
            qr_code_data: qrCodeData
          })
          .eq("id", joiningOrder.id);
        if (error) throw error;
      } else {
        // Get current user for RLS compliance
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          toast.error("Please log in to create joining orders");
          return;
        }

        const { data, error } = await supabase
          .from("joining_orders")
          .insert({
            user_id: user.id,
            event_plan_id: eventPlan.id,
            content: joData,
            qr_code_data: qrCodeData
          })
          .select()
          .single();
        if (error) throw error;
        setJoiningOrder(data);
      }

      toast.success("Joining orders generated successfully");
    } catch (error) {
      console.error("Error generating joining order:", error);
      toast.error("Failed to generate joining orders");
    } finally {
      setLoading(false);
    }
  };

  const exportJoiningOrders = () => {
    if (!joiningOrder?.content) {
      toast.error("No joining orders to export");
      return;
    }

    const content = joiningOrder.content;
    exportJoiningOrdersPdf({
      eventPlan: content,
      riskAssessment: content.risk_assessment,
      travelPlan: content.travel_plan,
      kitList: content.kit_list,
      schedule: content.schedule,
      eventDescription: content.event_description,
    });
    toast.success("Joining orders PDF exported");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Joining Orders Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <p className="text-slate-600">
            Generate joining orders that pull information from all the event planning modules above.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={generateJoiningOrder}
              disabled={loading}
              className="bg-rafac-blue hover:bg-rafac-navy text-white"
            >
              {loading ? "Generating..." : "Generate Joining Orders"}
            </Button>
            
            {joiningOrder && (
              <Button
                onClick={exportJoiningOrders}
                variant="outline"
                className="border-rafac-blue text-rafac-blue hover:bg-rafac-blue hover:text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>
            )}
          </div>
        </div>

        {joiningOrder?.content && (
          <Card className="bg-slate-50">
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Event: {joiningOrder.content.event_name}</h4>
                  <p className="text-sm text-slate-600">Location: {joiningOrder.content.location}</p>
                  <p className="text-sm text-slate-600">Date: {joiningOrder.content.start_date}</p>
                  {joiningOrder.content.event_description && (
                    <p className="text-sm text-slate-600 mt-2">Description: {joiningOrder.content.event_description}</p>
                  )}
                </div>
                
                {joiningOrder.qr_code_data && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-sm text-slate-600">
                      <QrCode className="h-4 w-4" />
                      QR Code Data: {joiningOrder.qr_code_data}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default JoiningOrders;
