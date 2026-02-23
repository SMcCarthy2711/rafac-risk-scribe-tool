import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Home, Plus, Pencil, Trash2, FolderPlus, Settings2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RiskForm {
  activity_element: string;
  hazards_identified: string;
  who_might_be_harmed: string;
  existing_control_measures: string;
  likelihood: number;
  impact: number;
  additional_control_measures: string;
  required_actions: string;
  category_id: string;
  subcategory_id: string | null;
}

const emptyRisk: RiskForm = {
  activity_element: "",
  hazards_identified: "",
  who_might_be_harmed: "",
  existing_control_measures: "",
  likelihood: 1,
  impact: 1,
  additional_control_measures: "",
  required_actions: "",
  category_id: "",
  subcategory_id: null,
};

const SettingsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [riskDialogOpen, setRiskDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  const [editingRiskId, setEditingRiskId] = useState<string | null>(null);
  const [riskForm, setRiskForm] = useState<RiskForm>(emptyRisk);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newSubcategoryCatId, setNewSubcategoryCatId] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const { data: categories = [] } = useQuery({
    queryKey: ["risk-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("risk_categories").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: subcategories = [] } = useQuery({
    queryKey: ["risk-subcategories-all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("risk_subcategories").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: risks = [] } = useQuery({
    queryKey: ["pre-saved-risks-all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pre_saved_risks").select("*").order("activity_element");
      if (error) throw error;
      return data;
    },
  });

  const filteredRisks = filterCategory === "all" ? risks : risks.filter(r => r.category_id === filterCategory);

  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || "Unknown";
  const getSubcategoryName = (id: string | null) => {
    if (!id) return null;
    return subcategories.find(s => s.id === id)?.name || null;
  };

  // Category CRUD
  const addCategory = async () => {
    if (!newCategoryName.trim()) return;
    const { error } = await supabase.from("risk_categories").insert({ name: newCategoryName.trim() });
    if (error) { toast.error("Failed to add category"); return; }
    toast.success("Category added");
    setNewCategoryName("");
    setCategoryDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["risk-categories"] });
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from("risk_categories").delete().eq("id", id);
    if (error) { toast.error("Failed to delete — remove risks in this category first"); return; }
    toast.success("Category deleted");
    queryClient.invalidateQueries({ queryKey: ["risk-categories"] });
  };

  // Subcategory CRUD
  const addSubcategory = async () => {
    if (!newSubcategoryName.trim() || !newSubcategoryCatId) return;
    const { error } = await supabase.from("risk_subcategories").insert({ name: newSubcategoryName.trim(), category_id: newSubcategoryCatId });
    if (error) { toast.error("Failed to add subcategory"); return; }
    toast.success("Subcategory added");
    setNewSubcategoryName("");
    setNewSubcategoryCatId("");
    setSubcategoryDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["risk-subcategories-all"] });
  };

  const deleteSubcategory = async (id: string) => {
    const { error } = await supabase.from("risk_subcategories").delete().eq("id", id);
    if (error) { toast.error("Failed to delete subcategory"); return; }
    toast.success("Subcategory deleted");
    queryClient.invalidateQueries({ queryKey: ["risk-subcategories-all"] });
  };

  // Risk CRUD
  const openAddRisk = () => {
    setEditingRiskId(null);
    setRiskForm(emptyRisk);
    setRiskDialogOpen(true);
  };

  const openEditRisk = (risk: any) => {
    setEditingRiskId(risk.id);
    setRiskForm({
      activity_element: risk.activity_element,
      hazards_identified: risk.hazards_identified,
      who_might_be_harmed: risk.who_might_be_harmed,
      existing_control_measures: risk.existing_control_measures,
      likelihood: risk.likelihood,
      impact: risk.impact,
      additional_control_measures: risk.additional_control_measures || "",
      required_actions: risk.required_actions || "",
      category_id: risk.category_id,
      subcategory_id: risk.subcategory_id,
    });
    setRiskDialogOpen(true);
  };

  const saveRisk = async () => {
    if (!riskForm.activity_element || !riskForm.category_id || !riskForm.hazards_identified || !riskForm.existing_control_measures || !riskForm.who_might_be_harmed) {
      toast.error("Please fill in all required fields");
      return;
    }
    const payload = {
      ...riskForm,
      subcategory_id: riskForm.subcategory_id || null,
    };

    if (editingRiskId) {
      const { error } = await supabase.from("pre_saved_risks").update(payload).eq("id", editingRiskId);
      if (error) { toast.error("Failed to update risk"); return; }
      toast.success("Risk updated");
    } else {
      const { error } = await supabase.from("pre_saved_risks").insert(payload);
      if (error) { toast.error("Failed to add risk"); return; }
      toast.success("Risk added");
    }
    setRiskDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["pre-saved-risks-all"] });
  };

  const deleteRisk = async (id: string) => {
    const { error } = await supabase.from("pre_saved_risks").delete().eq("id", id);
    if (error) { toast.error("Failed to delete risk"); return; }
    toast.success("Risk deleted");
    queryClient.invalidateQueries({ queryKey: ["pre-saved-risks-all"] });
  };

  const subcatsForCategory = subcategories.filter(s => s.category_id === riskForm.category_id);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={() => navigate("/")} className="border-rafac-blue text-rafac-blue hover:bg-rafac-blue hover:text-white">
            <Home className="mr-2 h-4 w-4" /> Home
          </Button>
          <h1 className="text-xl font-bold text-rafac-blue flex items-center gap-2">
            <Settings2 className="h-5 w-5" /> Settings
          </h1>
          <img src="/lovable-uploads/8ec214f7-9bc9-4aec-9515-b58b16054452.png" alt="RAF Logo" className="h-16 w-auto" />
        </div>

        {/* Categories & Subcategories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Risk Categories</CardTitle>
              <Button size="sm" onClick={() => setCategoryDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between py-1 border-b last:border-0">
                  <span className="text-sm">{cat.name}</span>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 h-7 w-7 p-0" onClick={() => deleteCategory(cat.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
              {categories.length === 0 && <p className="text-sm text-slate-400">No categories yet.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Subcategories</CardTitle>
              <Button size="sm" onClick={() => setSubcategoryDialogOpen(true)}>
                <FolderPlus className="h-4 w-4 mr-1" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {subcategories.map(sub => (
                <div key={sub.id} className="flex items-center justify-between py-1 border-b last:border-0">
                  <div>
                    <span className="text-sm">{sub.name}</span>
                    <span className="text-xs text-slate-400 ml-2">({getCategoryName(sub.category_id)})</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 h-7 w-7 p-0" onClick={() => deleteSubcategory(sub.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
              {subcategories.length === 0 && <p className="text-sm text-slate-400">No subcategories yet.</p>}
            </CardContent>
          </Card>
        </div>

        {/* Pre-Saved Risks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Pre-Saved Risks</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[180px] h-8 text-sm">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={openAddRisk}>
                <Plus className="h-4 w-4 mr-1" /> Add Risk
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredRisks.length === 0 && <p className="text-sm text-slate-400">No pre-saved risks found.</p>}
            {filteredRisks.map(risk => (
              <Card key={risk.id} className="bg-slate-50">
                <CardContent className="py-3 px-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{risk.activity_element}</p>
                      <p className="text-xs text-slate-500 mt-1 truncate">{risk.hazards_identified}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">{getCategoryName(risk.category_id)}</Badge>
                        {getSubcategoryName(risk.subcategory_id) && (
                          <Badge variant="outline" className="text-xs">{getSubcategoryName(risk.subcategory_id)}</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">L:{risk.likelihood} I:{risk.impact} = {risk.likelihood * risk.impact}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEditRisk(risk)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500 hover:text-red-700" onClick={() => deleteRisk(risk.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Add/Edit Risk Dialog */}
        <Dialog open={riskDialogOpen} onOpenChange={setRiskDialogOpen}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRiskId ? "Edit Risk" : "Add Pre-Saved Risk"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category *</Label>
                  <Select value={riskForm.category_id} onValueChange={v => setRiskForm(f => ({ ...f, category_id: v, subcategory_id: null }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Subcategory</Label>
                  <Select value={riskForm.subcategory_id || "none"} onValueChange={v => setRiskForm(f => ({ ...f, subcategory_id: v === "none" ? null : v }))}>
                    <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {subcatsForCategory.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Activity / Element *</Label>
                <Input value={riskForm.activity_element} onChange={e => setRiskForm(f => ({ ...f, activity_element: e.target.value }))} />
              </div>
              <div>
                <Label>Hazards Identified *</Label>
                <Textarea value={riskForm.hazards_identified} onChange={e => setRiskForm(f => ({ ...f, hazards_identified: e.target.value }))} rows={2} />
              </div>
              <div>
                <Label>Who Might Be Harmed *</Label>
                <Input value={riskForm.who_might_be_harmed} onChange={e => setRiskForm(f => ({ ...f, who_might_be_harmed: e.target.value }))} />
              </div>
              <div>
                <Label>Existing Control Measures *</Label>
                <Textarea value={riskForm.existing_control_measures} onChange={e => setRiskForm(f => ({ ...f, existing_control_measures: e.target.value }))} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Likelihood (1-5)</Label>
                  <Input type="number" min={1} max={5} value={riskForm.likelihood} onChange={e => setRiskForm(f => ({ ...f, likelihood: parseInt(e.target.value) || 1 }))} />
                </div>
                <div>
                  <Label>Impact (1-5)</Label>
                  <Input type="number" min={1} max={5} value={riskForm.impact} onChange={e => setRiskForm(f => ({ ...f, impact: parseInt(e.target.value) || 1 }))} />
                </div>
              </div>
              <div>
                <Label>Additional Control Measures</Label>
                <Textarea value={riskForm.additional_control_measures} onChange={e => setRiskForm(f => ({ ...f, additional_control_measures: e.target.value }))} rows={2} />
              </div>
              <div>
                <Label>Required Actions</Label>
                <Textarea value={riskForm.required_actions} onChange={e => setRiskForm(f => ({ ...f, required_actions: e.target.value }))} rows={2} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRiskDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveRisk} className="bg-rafac-blue hover:bg-rafac-navy text-white">
                {editingRiskId ? "Update" : "Add"} Risk
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Category Dialog */}
        <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Add Category</DialogTitle></DialogHeader>
            <div>
              <Label>Category Name</Label>
              <Input value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="e.g. Aviation Activities" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>Cancel</Button>
              <Button onClick={addCategory} className="bg-rafac-blue hover:bg-rafac-navy text-white">Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Subcategory Dialog */}
        <Dialog open={subcategoryDialogOpen} onOpenChange={setSubcategoryDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Add Subcategory</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Parent Category</Label>
                <Select value={newSubcategoryCatId} onValueChange={setNewSubcategoryCatId}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Subcategory Name</Label>
                <Input value={newSubcategoryName} onChange={e => setNewSubcategoryName(e.target.value)} placeholder="e.g. Flying Training" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSubcategoryDialogOpen(false)}>Cancel</Button>
              <Button onClick={addSubcategory} className="bg-rafac-blue hover:bg-rafac-navy text-white">Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SettingsPage;
