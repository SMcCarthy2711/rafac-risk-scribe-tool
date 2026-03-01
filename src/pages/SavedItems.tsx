import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Home, FileText, Calendar, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

const SavedItems = () => {
  const navigate = useNavigate();
  const [riskAssessments, setRiskAssessments] = useState<any[]>([]);
  const [eventPlans, setEventPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [raRes, epRes] = await Promise.all([
        supabase.from("risk_assessments").select("*").order("created_at", { ascending: false }),
        supabase.from("event_plans").select("*").order("created_at", { ascending: false }),
      ]);
      setRiskAssessments(raRes.data || []);
      setEventPlans(epRes.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRA = async (id: string) => {
    const { error } = await supabase.from("risk_assessments").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Risk assessment deleted");
    setRiskAssessments(prev => prev.filter(r => r.id !== id));
  };

  const deleteEP = async (id: string) => {
    const { error } = await supabase.from("event_plans").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Event plan deleted");
    setEventPlans(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={() => navigate("/")} className="border-rafac-blue text-rafac-blue hover:bg-rafac-blue hover:text-white">
            <Home className="mr-2 h-4 w-4" /> Home
          </Button>
          <h1 className="text-xl font-bold text-rafac-blue">Saved Items</h1>
          <img src="/lovable-uploads/8ec214f7-9bc9-4aec-9515-b58b16054452.png" alt="RAF Logo" className="h-16 w-auto" />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rafac-blue mx-auto mb-4" />
            <p className="text-slate-500">Loading...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Risk Assessments */}
            <div>
              <h2 className="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-rafac-blue" /> Risk Assessments
              </h2>
              {riskAssessments.length === 0 ? (
                <p className="text-slate-400 text-sm">No saved risk assessments yet.</p>
              ) : (
                <div className="space-y-2">
                  {riskAssessments.map(ra => (
                    <Card key={ra.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="flex items-center justify-between py-4">
                        <div>
                          <p className="font-medium">{ra.activity_title || "Untitled"}</p>
                          <p className="text-sm text-slate-500">
                            {ra.squadron && `${ra.squadron} · `}
                            {ra.assessment_date || new Date(ra.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => navigate(`/risk-assessment/${ra.id}`)}>
                            <Pencil className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => navigate(`/event-builder/${ra.id}`)}>
                            <Calendar className="h-4 w-4 mr-1" /> Event
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => deleteRA(ra.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Event Plans */}
            <div>
              <h2 className="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" /> Event Plans
              </h2>
              {eventPlans.length === 0 ? (
                <p className="text-slate-400 text-sm">No saved event plans yet.</p>
              ) : (
                <div className="space-y-2">
                  {eventPlans.map(ep => (
                    <Card key={ep.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="flex items-center justify-between py-4">
                        <div>
                          <p className="font-medium">{ep.name || "Untitled"}</p>
                          <p className="text-sm text-slate-500">
                            {ep.location && `${ep.location} · `}
                            {ep.start_date || new Date(ep.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {ep.risk_assessment_id && (
                            <Button size="sm" variant="outline" onClick={() => navigate(`/event-builder/${ep.risk_assessment_id}`)}>
                              Open
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => deleteEP(ep.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedItems;
