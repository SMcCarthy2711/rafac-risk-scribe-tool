
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Download, FileText, Users, UserCheck } from "lucide-react";

const generateEventPackHTML = (eventPlan, riskAssessment, travelData, kitData, scheduleData, joiningData) => {
  const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-GB", { 
    weekday: "long", year: "numeric", month: "long", day: "numeric" 
  }) : 'TBC';

  const groupedSchedule = scheduleData?.reduce((acc, item) => {
    const date = item.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {}) || {};

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Complete Event Pack - ${eventPlan.name}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 3px solid #0066cc; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin: 30px 0; page-break-inside: avoid; }
        .section h2 { color: #0066cc; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
        .section h3 { color: #333; margin-top: 25px; }
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; margin: 15px 0; }
        .info-item { background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #0066cc; }
        .info-label { font-weight: bold; color: #334155; margin-bottom: 5px; }
        .kit-item { margin: 8px 0; padding: 8px; background: #f1f5f9; border-radius: 4px; }
        .kit-caption { font-style: italic; font-size: 0.9em; color: #64748b; margin-left: 15px; }
        .schedule-day { margin: 20px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
        .schedule-date { background: #0066cc; color: white; padding: 12px; font-weight: bold; }
        .schedule-item { padding: 12px; border-bottom: 1px solid #e2e8f0; display: grid; grid-template-columns: 120px 1fr 150px 100px; gap: 15px; align-items: center; }
        .schedule-item:last-child { border-bottom: none; }
        .risk-summary { background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 15px 0; }
        .contact-box { background: #dcfce7; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 15px 0; }
        @media print { 
          .section { page-break-inside: avoid; }
          body { font-size: 12px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>COMPLETE EVENT PACK</h1>
        <h2>${eventPlan.name}</h2>
        <p style="color: #64748b; margin: 10px 0;">Generated on ${new Date().toLocaleDateString("en-GB")}</p>
      </div>

      <div class="section">
        <h2>Event Overview</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Event Name</div>
            ${eventPlan.name}
          </div>
          <div class="info-item">
            <div class="info-label">Location</div>
            ${eventPlan.location || 'TBC'}
          </div>
          <div class="info-item">
            <div class="info-label">Start Date</div>
            ${formatDate(eventPlan.start_date)}
          </div>
          <div class="info-item">
            <div class="info-label">End Date</div>
            ${formatDate(eventPlan.end_date)}
          </div>
          <div class="info-item">
            <div class="info-label">Staff Lead</div>
            ${eventPlan.staff_lead || 'TBC'}
          </div>
          <div class="info-item">
            <div class="info-label">Participants</div>
            ${eventPlan.total_cadets || 0} Cadets, ${eventPlan.total_staff || 0} Staff
          </div>
        </div>

        <div class="contact-box">
          <h3 style="margin-top: 0; color: #166534;">Emergency Contact</h3>
          <p style="margin: 0; font-size: 1.1em;">${eventPlan.emergency_contact || 'Please contact the squadron'}</p>
        </div>
      </div>

      ${riskAssessment ? `
      <div class="section">
        <h2>Risk Assessment Information</h2>
        <div class="risk-summary">
          <h3 style="margin-top: 0; color: #991b1b;">Linked Risk Assessment</h3>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Activity Title</div>
              ${riskAssessment.activity_title || 'N/A'}
            </div>
            <div class="info-item">
              <div class="info-label">Assessor</div>
              ${riskAssessment.assessor_name || 'N/A'}
            </div>
            <div class="info-item">
              <div class="info-label">Assessment Date</div>
              ${formatDate(riskAssessment.assessment_date)}
            </div>
            <div class="info-item">
              <div class="info-label">Squadron</div>
              ${riskAssessment.squadron || 'N/A'}
            </div>
          </div>
          <p><strong>Note:</strong> This event is conducted under the authority of the linked risk assessment. All identified risks and control measures apply.</p>
        </div>
      </div>
      ` : ''}

      ${travelData ? `
      <div class="section">
        <h2>Travel Arrangements</h2>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Transport Method</div>
            ${travelData.transport_method || 'TBC'}
          </div>
          <div class="info-item">
            <div class="info-label">Collection Point</div>
            ${travelData.collection_point || 'TBC'}
          </div>
          <div class="info-item">
            <div class="info-label">Drop-off Point</div>
            ${travelData.drop_off_point || 'TBC'}
          </div>
          <div class="info-item">
            <div class="info-label">Departure Time</div>
            ${travelData.departure_time || 'TBC'}
          </div>
          <div class="info-item">
            <div class="info-label">Return Time</div>
            ${travelData.return_time || 'TBC'}
          </div>
          ${travelData.map_link ? `
          <div class="info-item">
            <div class="info-label">Map Link</div>
            <a href="${travelData.map_link}" target="_blank">${travelData.map_link}</a>
          </div>
          ` : ''}
        </div>

        ${travelData.vehicle_details?.length ? `
        <h3>Vehicle Details</h3>
        ${travelData.vehicle_details.map(vehicle => `
          <div class="info-item">
            <div class="info-label">Vehicle ${vehicle.vrn || 'TBC'}</div>
            Driver: ${vehicle.driver_name || 'TBC'}
          </div>
        `).join('')}
        ` : ''}
      </div>
      ` : ''}

      ${kitData ? `
      <div class="section">
        <h2>Required Kit Lists</h2>
        ${kitData.activity_type ? `<p><strong>Activity Type:</strong> ${kitData.activity_type}</p>` : ''}
        
        ${kitData.cadet_kit?.general?.length ? `
        <h3>General Kit (All Cadets)</h3>
        ${kitData.cadet_kit.general.map(item => `
          <div class="kit-item">
            • ${item.item}
            ${item.caption ? `<div class="kit-caption">${item.caption}</div>` : ''}
          </div>
        `).join('')}
        ` : ''}

        ${kitData.cadet_kit?.male?.length ? `
        <h3>Male Specific Kit</h3>
        ${kitData.cadet_kit.male.map(item => `
          <div class="kit-item">
            • ${item.item}
            ${item.caption ? `<div class="kit-caption">${item.caption}</div>` : ''}
          </div>
        `).join('')}
        ` : ''}

        ${kitData.cadet_kit?.female?.length ? `
        <h3>Female Specific Kit</h3>
        ${kitData.cadet_kit.female.map(item => `
          <div class="kit-item">
            • ${item.item}
            ${item.caption ? `<div class="kit-caption">${item.caption}</div>` : ''}
          </div>
        `).join('')}
        ` : ''}

        ${kitData.staff_kit?.length ? `
        <h3>Staff Kit</h3>
        ${kitData.staff_kit.map(item => `
          <div class="kit-item">
            • ${item.item}
            ${item.caption ? `<div class="kit-caption">${item.caption}</div>` : ''}
          </div>
        `).join('')}
        ` : ''}
      </div>
      ` : ''}

      ${scheduleData?.length ? `
      <div class="section">
        <h2>Event Schedule</h2>
        ${Object.keys(groupedSchedule).sort().map(date => `
          <div class="schedule-day">
            <div class="schedule-date">${formatDate(date)}</div>
            ${groupedSchedule[date].map(item => `
              <div class="schedule-item">
                <div><strong>${item.start_time} - ${item.end_time}</strong></div>
                <div><strong>${item.activity}</strong></div>
                <div>Lead: ${item.lead_person || 'TBC'}</div>
                <div>${item.target_audience}</div>
              </div>
              ${item.notes ? `<div style="padding: 0 12px 12px; font-style: italic; color: #64748b;">Notes: ${item.notes}</div>` : ''}
            `).join('')}
          </div>
        `).join('')}
      </div>
      ` : ''}

      <div class="section">
        <h2>Important Notes</h2>
        <ul style="margin: 15px 0; padding-left: 25px;">
          <li>All participants must arrive at the specified collection point on time</li>
          <li>Ensure all required kit is packed and clearly labelled</li>
          <li>Emergency contact details must be readily available</li>
          <li>This event operates under the linked risk assessment - all safety protocols must be followed</li>
          <li>Any changes to the plan will be communicated through official channels</li>
        </ul>
      </div>

      <div class="section">
        <h2>Contact Information</h2>
        <div class="contact-box">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Staff Lead</div>
              ${eventPlan.staff_lead || 'TBC'}
            </div>
            <div class="info-item">
              <div class="info-label">Emergency Contact</div>
              ${eventPlan.emergency_contact || 'Please contact the squadron'}
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; color: #64748b; font-size: 0.9em;">
        <p>This document was generated on ${new Date().toLocaleDateString("en-GB")} at ${new Date().toLocaleTimeString("en-GB")}</p>
        <p>Risk Assessment Reference: ${riskAssessment?.activity_title || 'N/A'} (${formatDate(riskAssessment?.assessment_date)})</p>
      </div>
    </body>
    </html>
  `;
};

const ExportOptions = ({ eventPlan, riskAssessment }) => {
  const exportEventPack = async () => {
    if (!eventPlan) {
      toast.error("Event plan data not available");
      return;
    }

    try {
      toast.info("Generating complete event pack...");
      
      // Load all related data
      const [travelData, kitData, scheduleData, joiningData] = await Promise.all([
        supabase.from("travel_plans").select("*").eq("event_plan_id", eventPlan.id).maybeSingle(),
        supabase.from("kit_lists").select("*").eq("event_plan_id", eventPlan.id).maybeSingle(),
        supabase.from("event_schedules").select("*").eq("event_plan_id", eventPlan.id).order("date").order("start_time"),
        supabase.from("joining_orders").select("*").eq("event_plan_id", eventPlan.id).maybeSingle()
      ]);

      // Generate comprehensive HTML document
      const html = generateEventPackHTML(eventPlan, riskAssessment, travelData.data, kitData.data, scheduleData.data, joiningData.data);
      
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `event-pack-${eventPlan.name.replace(/\s+/g, '-').toLowerCase()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Complete event pack exported successfully");
    } catch (error) {
      console.error("Error exporting event pack:", error);
      toast.error("Failed to export event pack");
    }
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
