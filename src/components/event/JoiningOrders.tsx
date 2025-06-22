
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Download, QrCode } from "lucide-react";

const JoiningOrders = ({ eventPlan, riskAssessment }) => {
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
        const { data, error } = await supabase
          .from("joining_orders")
          .insert({
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

    // Create a simple HTML export
    const content = joiningOrder.content;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Joining Orders - ${content.event_name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #0066cc; padding-bottom: 10px; }
          .section { margin: 20px 0; }
          .kit-item { margin: 5px 0; }
          .schedule-item { border: 1px solid #ddd; padding: 10px; margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>JOINING ORDERS</h1>
          <h2>${content.event_name}</h2>
        </div>
        
        <div class="section">
          <h3>Event Details</h3>
          <p><strong>Location:</strong> ${content.location || 'TBC'}</p>
          <p><strong>Date:</strong> ${content.start_date || 'TBC'} ${content.end_date && content.end_date !== content.start_date ? `to ${content.end_date}` : ''}</p>
          <p><strong>Staff Lead:</strong> ${content.staff_lead || 'TBC'}</p>
          <p><strong>Emergency Contact:</strong> ${content.emergency_contact || 'TBC'}</p>
        </div>

        ${content.travel_plan ? `
        <div class="section">
          <h3>Travel Arrangements</h3>
          <p><strong>Collection Point:</strong> ${content.travel_plan.collection_point || 'TBC'}</p>
          <p><strong>Departure Time:</strong> ${content.travel_plan.departure_time || 'TBC'}</p>
          <p><strong>Return Time:</strong> ${content.travel_plan.return_time || 'TBC'}</p>
        </div>
        ` : ''}

        ${content.kit_list && content.kit_list.cadet_kit ? `
        <div class="section">
          <h3>Required Kit</h3>
          ${content.kit_list.cadet_kit.map(item => `<div class="kit-item">• ${item}</div>`).join('')}
        </div>
        ` : ''}
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `joining-orders-${content.event_name.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
                Export as HTML
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
