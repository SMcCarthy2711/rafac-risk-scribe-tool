import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Calendar, FileText, LogOut, FolderOpen } from "lucide-react";
import { useAuth } from "@/components/AuthWrapper";

const Dashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-4">
        <img src="/lovable-uploads/8ec214f7-9bc9-4aec-9515-b58b16054452.png" alt="Royal Air Force Logo" className="h-16 w-auto" />
        <Button variant="ghost" size="sm" onClick={signOut} className="text-slate-500 hover:text-slate-700">
          <LogOut className="h-4 w-4 mr-1" /> Sign Out
        </Button>
      </div>

      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rafac-blue rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-rafac-blue mb-2">RAFAC Event Planner</h1>
          <p className="text-slate-600">What would you like to do?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg hover:border-rafac-blue transition-all duration-200 group"
            onClick={() => navigate("/risk-assessment")}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-14 h-14 bg-rafac-blue/10 rounded-full flex items-center justify-center mb-3 group-hover:bg-rafac-blue/20 transition-colors">
                <FileText className="h-7 w-7 text-rafac-blue" />
              </div>
              <CardTitle className="text-lg text-rafac-blue">Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Create a standardized risk assessment for activities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg hover:border-green-600 transition-all duration-200 group"
            onClick={() => navigate("/risk-assessment")}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-100 transition-colors">
                <Calendar className="h-7 w-7 text-green-600" />
              </div>
              <CardTitle className="text-lg text-green-700">Activity / Event Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Plan a complete activity with travel, kit lists, and schedules.
              </CardDescription>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg hover:border-amber-600 transition-all duration-200 group"
            onClick={() => navigate("/saved")}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-amber-100 transition-colors">
                <FolderOpen className="h-7 w-7 text-amber-600" />
              </div>
              <CardTitle className="text-lg text-amber-700">Saved Items</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                View and manage previous risk assessments and event plans.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
