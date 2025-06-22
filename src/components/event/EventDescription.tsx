
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";

interface EventDescriptionProps {
  description: string;
  setDescription: (description: string) => void;
}

const EventDescription: React.FC<EventDescriptionProps> = ({ description, setDescription }) => {
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
          <Textarea
            id="event-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a detailed description of the event that will be included in joining orders..."
            className="min-h-[120px]"
          />
          <p className="text-xs text-gray-500">
            This description will be included in the joining orders to provide cadets and staff with detailed information about the event.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventDescription;
