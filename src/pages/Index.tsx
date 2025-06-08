
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "@/components/Header";
import RiskEntry from "@/components/RiskEntry";
import RiskList from "@/components/RiskList";
import CommanderSignOff from "@/components/CommanderSignOff";
import DynamicRA from "@/components/DynamicRA";
import exportToPDF from "@/lib/pdfGenerator";
import { HeaderFields, RiskEntry as RiskEntryType, CommanderFields, DynamicFields } from "@/lib/types";
import { FilePenLine, FileText, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { getTestData } from "@/lib/testData";

// Import jsPDF
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Index = () => {
  // Initialize today's date in DD/MM/YYYY format
  const today = new Date().toLocaleDateString("en-GB");
  
  // State for active tab
  const [activeTab, setActiveTab] = useState("header");

  // State for form data
  const [headerFields, setHeaderFields] = useState<HeaderFields>({
    "Squadron": "",
    "Assessor Name": "",
    "Activity Title": "",
    "Assessment Date": today,
    "Publications": "",
    "Risk Assessment Type": ""
  });
  const [risks, setRisks] = useState<RiskEntryType[]>([]);
  // Keep track of next reference number - start with 1
  const [nextRefNumber, setNextRefNumber] = useState<number>(1);
  const [commanderFields, setCommanderFields] = useState<CommanderFields>({
    "Commander Name": "",
    "Commander Post": "",
    "Commander Date": today
  });
  const [dynamicFields, setDynamicFields] = useState<DynamicFields>({
    "Dynamic Reason": "",
    "New Restrictions": "",
    "Remarks": "",
    "Dynamic Officer Name": "",
    "Dynamic Officer Post": "",
    "Dynamic Date": today
  });

  const handleAddRisk = (risk: RiskEntryType) => {
    setRisks(prevRisks => [...prevRisks, risk]);
    // Increment the next reference number
    setNextRefNumber(nextRefNumber + 1);
  };

  const handleEditRisk = (index: number, updatedRisk: RiskEntryType) => {
    const newRisks = [...risks];
    newRisks[index] = updatedRisk;
    setRisks(newRisks);
    toast.success("Risk updated successfully!");
  };

  const handleExport = async () => {
    // Validate that we have at least basic header info
    if (!headerFields.Squadron || !headerFields["Activity Title"]) {
      toast.error("Please fill in Squadron and Activity Title before exporting");
      return;
    }

    // Validate that we have at least one risk
    if (risks.length === 0) {
      toast.error("Please add at least one risk before exporting");
      return;
    }

    // Compile all data
    const assessment = {
      header: headerFields,
      risks,
      commander: commanderFields,
      dynamic: dynamicFields
    };

    // Try to export as PDF
    const success = await exportToPDF(assessment);
    if (success) {
      toast.success("Risk Assessment exported successfully!");
    } else {
      toast.error("Failed to export Risk Assessment");
    }
  };

  const handleExportTestData = async () => {
    // Get example test data
    const testData = getTestData();
    
    // Try to export as PDF
    const success = await exportToPDF(testData);
    if (success) {
      toast.success("Test Risk Assessment PDF generated successfully!");
    } else {
      toast.error("Failed to generate test PDF");
    }
  };

  const handleNext = () => {
    const tabs = ["header", "risks", "commander", "dynamic"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const tabs = ["header", "risks", "commander", "dynamic"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Logo in top right */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8">
          <img src="/lovable-uploads/8ec214f7-9bc9-4aec-9515-b58b16054452.png" alt="Royal Air Force Logo" className="h-20 w-auto" />
        </div>
        
        <div className="text-center mb-8 pt-2">
          <div className="flex justify-center items-center gap-2 mb-1">
            <FilePenLine className="h-5 w-5 text-rafac-blue" />
            <h1 className="text-xl font-bold text-rafac-blue">Risk Assessment Generator</h1>
          </div>
          <p className="text-xs text-slate-600">Generate standardized risk assessments for activities</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mx-0 py-[11px]">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="header">Header Details</TabsTrigger>
            <TabsTrigger value="risks">Risk Entries</TabsTrigger>
            <TabsTrigger value="commander">Commander Sign-off</TabsTrigger>
            <TabsTrigger value="dynamic">Dynamic RA</TabsTrigger>
          </TabsList>

          <TabsContent value="header">
            <Header headerFields={headerFields} setHeaderFields={setHeaderFields} />
            <div className="mt-8 flex justify-end">
              <Button onClick={handleNext} className="bg-rafac-blue hover:bg-rafac-navy text-white">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="risks">
            <RiskEntry onAddRisk={handleAddRisk} nextRefNumber={nextRefNumber} />
            <RiskList risks={risks} onEditRisk={handleEditRisk} />
            <div className="mt-8 flex justify-between">
              <Button onClick={handleBack} variant="outline" className="border-rafac-blue text-rafac-blue hover:bg-rafac-blue hover:text-white">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleNext} className="bg-rafac-blue hover:bg-rafac-navy text-white">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="commander">
            <CommanderSignOff commanderFields={commanderFields} setCommanderFields={setCommanderFields} />
            <div className="mt-8 flex justify-between">
              <Button onClick={handleBack} variant="outline" className="border-rafac-blue text-rafac-blue hover:bg-rafac-blue hover:text-white">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleNext} className="bg-rafac-blue hover:bg-rafac-navy text-white">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="dynamic">
            <DynamicRA dynamicFields={dynamicFields} setDynamicFields={setDynamicFields} />
            <div className="mt-8 flex flex-col items-center gap-4">
              <Button onClick={handleBack} variant="outline" className="border-rafac-blue text-rafac-blue hover:bg-rafac-blue hover:text-white self-start">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <Button onClick={handleExport} className="bg-rafac-blue hover:bg-rafac-navy text-white py-2 px-8 text-lg">
                  <FileText className="mr-2 h-5 w-5" /> Export Risk Assessment PDF
                </Button>
                
                <Button 
                  onClick={handleExportTestData} 
                  variant="outline" 
                  className="border-rafac-blue text-rafac-blue hover:bg-rafac-blue hover:text-white"
                >
                  <Download className="mr-2 h-5 w-5" /> Generate Test PDF
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
