
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HeaderFields } from "@/lib/types";

interface HeaderProps {
  headerFields: HeaderFields;
  setHeaderFields: React.Dispatch<React.SetStateAction<HeaderFields>>;
}

const Header: React.FC<HeaderProps> = ({ headerFields, setHeaderFields }) => {
  const handleInputChange = (field: keyof HeaderFields, value: string) => {
    setHeaderFields((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-rafac-blue text-white">
        <CardTitle>Header Details</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(headerFields) as Array<keyof HeaderFields>).map((field) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>{field}</Label>
              <Input
                id={field}
                value={headerFields[field]}
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

export default Header;
