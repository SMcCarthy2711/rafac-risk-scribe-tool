
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { HeaderFields } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/components/AuthWrapper";
import { LogOut, Shield } from "lucide-react";

interface HeaderProps {
  headerFields: HeaderFields;
  setHeaderFields: React.Dispatch<React.SetStateAction<HeaderFields>>;
}

const Header: React.FC<HeaderProps> = ({ headerFields, setHeaderFields }) => {
  const handleInputChange = (field: keyof HeaderFields, value: string) => {
    setHeaderFields((prev) => ({ ...prev, [field]: value }));
  };

  const { user, signOut } = useAuth();

  return (
    <Card className="w-full">
      <CardHeader className="bg-rafac-blue text-white">
        <div className="flex justify-between items-center">
          <CardTitle>Risk Assessment Header Details</CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="squadron">RAFAC Squadron/Formation</Label>
            <Input
              id="squadron"
              value={headerFields.Squadron}
              onChange={(e) => handleInputChange("Squadron", e.target.value)}
              placeholder="e.g. 1234 (City) Squadron"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assessor">Assessor (No, Rank, Name)</Label>
            <Input
              id="assessor"
              value={headerFields["Assessor Name"]}
              onChange={(e) => handleInputChange("Assessor Name", e.target.value)}
              placeholder="e.g. F12345 Flt Lt J Smith"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity">Activity Title</Label>
            <Input
              id="activity"
              value={headerFields["Activity Title"]}
              onChange={(e) => handleInputChange("Activity Title", e.target.value)}
              placeholder="e.g. Annual Camp Field Day"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Assessment Date</Label>
            <Input
              id="date"
              value={headerFields["Assessment Date"]}
              onChange={(e) => handleInputChange("Assessment Date", e.target.value)}
              placeholder="DD/MM/YYYY"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="publications">Relevant Publications / Pamphlets / Procedures</Label>
            <Textarea
              id="publications"
              value={headerFields.Publications}
              onChange={(e) => handleInputChange("Publications", e.target.value)}
              placeholder="Enter relevant publications, one per line"
              className="min-h-[100px]"
            />
            <p className="text-xs text-gray-500">Each line will be numbered in the final document.</p>
          </div>

          <div className="space-y-4 md:col-span-2">
            <Label>Type of Risk Assessment</Label>
            <RadioGroup 
              value={headerFields["Risk Assessment Type"] || ""} 
              onValueChange={(value) => handleInputChange("Risk Assessment Type", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Generic" id="generic" />
                <Label htmlFor="generic" className="cursor-pointer">Generic</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Specific" id="specific" />
                <Label htmlFor="specific" className="cursor-pointer">Specific</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Header;
