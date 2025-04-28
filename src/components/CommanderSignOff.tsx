
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CommanderFields } from "@/lib/types";

interface CommanderSignOffProps {
  commanderFields: CommanderFields;
  setCommanderFields: React.Dispatch<React.SetStateAction<CommanderFields>>;
}

const CommanderSignOff: React.FC<CommanderSignOffProps> = ({ commanderFields, setCommanderFields }) => {
  const handleInputChange = (field: keyof CommanderFields, value: string) => {
    setCommanderFields((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-rafac-blue text-white">
        <CardTitle>Commander Sign-off</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(commanderFields) as Array<keyof CommanderFields>).map((field) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>{field}</Label>
              <Input
                id={field}
                value={commanderFields[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                placeholder={`Enter ${field}`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommanderSignOff;
