
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, FileText, Calendar, MapPin, Package, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import EventOverview from "@/components/event/EventOverview";
import TravelPlan from "@/components/event/TravelPlan";
import KitList from "@/components/event/KitList";
import EventSchedule from "@/components/event/EventSchedule";
import JoiningOrders from "@/components/event/JoiningOrders";
import ExportOptions from "@/components/event/ExportOptions";

const EventBuilder = () => {
  const { riskAssessmentId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [eventPlan, setEventPlan] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!riskAssessmentId) {
        toast.error("No risk assessment ID provided");
        navigate("/");
        return;
      }

      try {
        // Load the original risk assessment
        const { data: raData, error: raError } = await supabase
          .from("risk_assessments")
          .select("*")
          .eq("id", riskAssessmentId)
          .single();

        if (raError) throw raError;
        setRiskAssessment(raData);

        // Check if an event plan already exists for this risk assessment
        const { data: epData, error: epError } = await supabase
          .from("event_plans")
          .select("*")
          .eq("risk_assessment_id", riskAssessmentId)
          .maybeSingle();

        if (epError && epError.code !== 'PGRST116') throw epError;

        if (!epData) {
          // Create a new event plan
          const { data: newEventPlan, error: createError } = await supabase
            .from("event_plans")
            .insert({
              risk_assessment_id: riskAssessmentId,
              name: raData.activity_title || "New Event",
              staff_lead: raData.assessor_name || ""
            })
            .select()
            .single();

          if (createError) throw createError;
          setEventPlan(newEventPlan);
        } else {
          setEventPlan(epData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load event data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [riskAssessmentId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rafac-blue mx-auto mb-4"></div>
          <p className="text-slate-600">Loading event builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="mb-4 border-rafac-blue text-rafac-blue hover:bg-rafac-blue hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Risk Assessment
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-rafac-blue mb-2">Event Builder</h1>
            <p className="text-slate-600">
              Based on: <span className="font-semibold">{riskAssessment?.activity_title}</span>
            </p>
          </div>
        </div>

        {/* Risk Assessment Summary Card */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Linked Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Squadron:</span> {riskAssessment?.squadron}
              </div>
              <div>
                <span className="font-medium">Assessor:</span> {riskAssessment?.assessor_name}
              </div>
              <div>
                <span className="font-medium">Date:</span> {riskAssessment?.assessment_date}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Planning Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="travel" className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Travel
            </TabsTrigger>
            <TabsTrigger value="kit" className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              Kit List
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="joining" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Joining Orders
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <EventOverview eventPlan={eventPlan} setEventPlan={setEventPlan} />
          </TabsContent>

          <TabsContent value="travel">
            <TravelPlan eventPlanId={eventPlan?.id} />
          </TabsContent>

          <TabsContent value="kit">
            <KitList eventPlanId={eventPlan?.id} />
          </TabsContent>

          <TabsContent value="schedule">
            <EventSchedule eventPlanId={eventPlan?.id} />
          </TabsContent>

          <TabsContent value="joining">
            <JoiningOrders eventPlan={eventPlan} riskAssessment={riskAssessment} />
          </TabsContent>

          <TabsContent value="export">
            <ExportOptions eventPlan={eventPlan} riskAssessment={riskAssessment} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EventBuilder;
