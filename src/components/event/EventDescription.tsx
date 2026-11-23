
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";

interface EventDescriptionProps {
  description: string;
  setDescription: (description: string) => void;
  onSave: () => Promise<void>;
  saving: boolean;
}

const EventDescription: React.FC<EventDescriptionProps> = ({ description, setDescription, onSave, saving }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Event Description
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="event-description">Event Description</Label>
          <RichTextEditor
            id="event-description"
            value={description}
            onChange={setDescription}
            label="Event Description"
          />
          <Button onClick={onSave} disabled={saving}>{saving ? 'Saving…' : 'Save Description'}</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventDescription;
