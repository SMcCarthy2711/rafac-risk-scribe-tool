
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CommanderFields, SignOffEntry } from "@/lib/types";

interface CommanderSignOffProps {
  commanderFields: CommanderFields;
  setCommanderFields: React.Dispatch<React.SetStateAction<CommanderFields>>;
}

const signOffSections = [
  {
    key: "activityCommander" as const,
    title: "Activity Commander",
    description:
      "Activity Commander - The control measures when implemented are suitable and sufficient for the assessed activity to proceed:",
  },
  {
    key: "activityCommanderAdditional" as const,
    title: "Activity Commander Sign Off",
    description:
      "Activity Commander - After additional control measures the risk rating is 15 or above. Further authority / additional resource is required. Until the risks posed are deemed ALARP and tolerable the activity will not take place:",
  },
  {
    key: "secondSignature" as const,
    title: "Second Signature",
    description:
      "Second Signature (OC or Nominated Rep) - I am aware of the activity and satisfied the RA is suitable and sufficient:",
  },
];

const fields: Array<{ key: keyof SignOffEntry; label: string }> = [
  { key: "Name", label: "Name" },
  { key: "Post", label: "Post" },
  { key: "Date", label: "Date" },
  { key: "Signature", label: "Signature" },
];

const CommanderSignOff: React.FC<CommanderSignOffProps> = ({
  commanderFields,
  setCommanderFields,
}) => {
  const handleChange = (
    section: keyof CommanderFields,
    field: keyof SignOffEntry,
    value: string
  ) => {
    setCommanderFields((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  return (
    <div className="space-y-6">
      {signOffSections.map((section) => (
        <Card key={section.key} className="w-full">
          <CardHeader className="bg-rafac-blue text-white">
            <CardTitle>{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-4 italic">
              {section.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((f) => (
                <div key={f.key} className="space-y-2">
                  <Label htmlFor={`${section.key}-${f.key}`}>{f.label}</Label>
                  <Input
                    id={`${section.key}-${f.key}`}
                    value={commanderFields[section.key][f.key]}
                    onChange={(e) =>
                      handleChange(section.key, f.key, e.target.value)
                    }
                    placeholder={`Enter ${f.label}`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CommanderSignOff;
