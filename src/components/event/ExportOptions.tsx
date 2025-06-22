
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, FileText, Users, UserCheck } from "lucide-react";

const ExportOptions = ({ eventPlan, riskAssessment }) => {
  const exportEventPack = () => {
    toast.info("Full event pack export coming soon - this will include all planning documents");
  };

  const exportCadetSummary = () => {
    if (!eventPlan) {
      toast.error("Event plan data not available");
      return;
    }

    const summary = `
CADET SUMMARY - ${eventPlan.name}

Event: ${eventPlan.name}
Location: ${eventPlan.location || 'TBC'}
Date: ${eventPlan.start_date || 'TBC'}
Staff Lead: ${eventPlan.staff_lead || 'TBC'}

What you need to know:
- This event is linked to risk assessment: ${riskAssessment?.activity_title || 'N/A'}
- Total participants: ${eventPlan.total_cadets || 0} cadets, ${eventPlan.total_staff || 0} staff
- Emergency contact: ${eventPlan.emergency_contact || 'TBC'}

For full details, see the complete joining orders.
    `;

    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cadet-summary-${eventPlan.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Cadet summary exported");
  };

  const exportParentSummary = () => {
    if (!eventPlan) {
      toast.error("Event plan data not available");
      return;
    }

    const summary = `
PARENT/GUARDIAN INFORMATION - ${eventPlan.name}

Your cadet is taking part in: ${eventPlan.name}
Location: ${eventPlan.location || 'TBC'}
Date: ${eventPlan.start_date || 'TBC'}

Staff Contact: ${eventPlan.staff_lead || 'TBC'}
Emergency Contact: ${eventPlan.emergency_contact || 'Please contact the squadron'}

This activity has been risk assessed and appropriate safety measures are in place.

If you have any questions, please contact the squadron.
    `;

    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `parent-summary-${eventPlan.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Parent summary exported");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-dashed border-2 hover:bg-slate-50 transition-colors">
            <CardHeader className="text-center pb-3">
              <FileText className="h-8 w-8 mx-auto text-rafac-blue mb-2" />
              <CardTitle className="text-lg">Complete Event Pack</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-slate-600 mb-4">
                Full PDF with all planning documents, risk assessment, and administrative details
              </p>
              <Button
                onClick={exportEventPack}
                className="bg-rafac-blue hover:bg-rafac-navy text-white w-full"
              >
                Export Full Pack
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 hover:bg-slate-50 transition-colors">
            <CardHeader className="text-center pb-3">
              <Users className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <CardTitle className="text-lg">Cadet Summary</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-slate-600 mb-4">
                Simplified version for cadets with key information and requirements
              </p>
              <Button
                onClick={exportCadetSummary}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white w-full"
              >
                Export Cadet Version
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 hover:bg-slate-50 transition-colors">
            <CardHeader className="text-center pb-3">
              <UserCheck className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <CardTitle className="text-lg">Parent Summary</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-slate-600 mb-4">
                Brief overview for parents/guardians with essential contact information
              </p>
              <Button
                onClick={exportParentSummary}
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white w-full"
              >
                Export Parent Version
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-slate-500">
          <p>All exports include the linked risk assessment reference for traceability</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportOptions;
