
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RiskEntry } from "@/lib/types";

interface RiskListProps {
  risks: RiskEntry[];
}

const RiskList: React.FC<RiskListProps> = ({ risks }) => {
  if (risks.length === 0) {
    return (
      <Card className="w-full mt-4">
        <CardHeader className="bg-rafac-blue text-white">
          <CardTitle>Added Risks</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">No risks have been added yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mt-4">
      <CardHeader className="bg-rafac-blue text-white">
        <CardTitle>Added Risks</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-100">
            <TableRow>
              <TableHead>Ref</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Hazards</TableHead>
              <TableHead>Risk Rating</TableHead>
              <TableHead>Acceptable</TableHead>
              <TableHead>Revised Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {risks.map((risk, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{risk.Ref}</TableCell>
                <TableCell>{risk["Activity/Element"]}</TableCell>
                <TableCell>{risk["Hazards Identified"]}</TableCell>
                <TableCell>{risk["Risk Rating (LxI)"]}</TableCell>
                <TableCell>{risk["Is Risk Acceptable"]}</TableCell>
                <TableCell>{risk["Revised Risk Rating (LxI)"]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RiskList;
