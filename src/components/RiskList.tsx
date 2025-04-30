
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RiskEntry } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

interface RiskListProps {
  risks: RiskEntry[];
  onEditRisk: (index: number, risk: RiskEntry) => void;
}

const RiskList: React.FC<RiskListProps> = ({ risks, onEditRisk }) => {
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [editingRisk, setEditingRisk] = React.useState<RiskEntry | null>(null);

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setEditingRisk({...risks[index]});
    setEditDialogOpen(true);
  };

  const handleInputChange = (field: keyof RiskEntry, value: string) => {
    if (editingRisk) {
      setEditingRisk((prev) => prev ? { ...prev, [field]: value } : null);
    }
  };

  const handleSaveEdit = () => {
    if (editingRisk && editingIndex !== null) {
      onEditRisk(editingIndex, editingRisk);
      setEditDialogOpen(false);
    }
  };

  React.useEffect(() => {
    // Calculate risk rating when likelihood or impact changes
    if (editingRisk) {
      const l = parseInt(editingRisk.Likelihood) || 0;
      const i = parseInt(editingRisk.Impact) || 0;
      handleInputChange("Risk Rating (LxI)", (l * i).toString());
    }
  }, [editingRisk?.Likelihood, editingRisk?.Impact]);

  React.useEffect(() => {
    // Calculate revised risk rating when revised likelihood or impact changes
    if (editingRisk) {
      const l = parseInt(editingRisk["Revised Likelihood"]) || 0;
      const i = parseInt(editingRisk["Revised Impact"]) || 0;
      handleInputChange("Revised Risk Rating (LxI)", (l * i).toString());
    }
  }, [editingRisk?.["Revised Likelihood"], editingRisk?.["Revised Impact"]]);

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
    <>
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
                <TableHead>Actions</TableHead>
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
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditClick(index)}
                      className="flex items-center gap-1"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Risk Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Risk Entry</DialogTitle>
          </DialogHeader>

          {editingRisk && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Ref</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editingRisk.Ref}
                  onChange={(e) => handleInputChange("Ref", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Activity/Element</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editingRisk["Activity/Element"]}
                  onChange={(e) => handleInputChange("Activity/Element", e.target.value)}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Hazards Identified</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                  value={editingRisk["Hazards Identified"]}
                  onChange={(e) => handleInputChange("Hazards Identified", e.target.value)}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Who or What Might be Harmed and How</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editingRisk["Who or What Might be Harmed and How"]}
                  onChange={(e) => handleInputChange("Who or What Might be Harmed and How", e.target.value)}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Existing Control Measures</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editingRisk["Existing Control Measures"]}
                  onChange={(e) => handleInputChange("Existing Control Measures", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Likelihood (1-5)</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editingRisk.Likelihood}
                  onChange={(e) => handleInputChange("Likelihood", e.target.value)}
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={`l-${num}`} value={num.toString()}>{num}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Impact (1-5)</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editingRisk.Impact}
                  onChange={(e) => handleInputChange("Impact", e.target.value)}
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={`i-${num}`} value={num.toString()}>{num}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Risk Rating (LxI)</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-slate-100 px-3 py-2 text-sm"
                  value={editingRisk["Risk Rating (LxI)"]}
                  readOnly
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Is Risk Acceptable</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editingRisk["Is Risk Acceptable"]}
                  onChange={(e) => handleInputChange("Is Risk Acceptable", e.target.value)}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Reasonable Additional Control Measures</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editingRisk["Reasonable Additional Control Measures"]}
                  onChange={(e) => handleInputChange("Reasonable Additional Control Measures", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Revised Likelihood (1-5)</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editingRisk["Revised Likelihood"]}
                  onChange={(e) => handleInputChange("Revised Likelihood", e.target.value)}
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={`rl-${num}`} value={num.toString()}>{num}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Revised Impact (1-5)</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editingRisk["Revised Impact"]}
                  onChange={(e) => handleInputChange("Revised Impact", e.target.value)}
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={`ri-${num}`} value={num.toString()}>{num}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Revised Risk Rating (LxI)</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-slate-100 px-3 py-2 text-sm"
                  value={editingRisk["Revised Risk Rating (LxI)"]}
                  readOnly
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">List Required Actions (Who, When and How)</label>
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editingRisk["List Required Actions (Who, When and How)"]}
                  onChange={(e) => handleInputChange("List Required Actions (Who, When and How)", e.target.value)}
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button className="bg-rafac-blue hover:bg-rafac-navy" onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RiskList;
