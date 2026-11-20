import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RiskEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pencil, Trash2, Leaf } from 'lucide-react';
import { editorContent, sanitizeRichText } from '@/lib/richText';
import { environmentalHeading } from '@/lib/riskSections';
import RiskFormFields from './RiskFormFields';
import RiskCalculationFields from './RiskCalculationFields';
import RevisedRiskFields from './RevisedRiskFields';

interface RiskListProps {
  risks: RiskEntry[];
  onEditRisk: (index: number, risk: RiskEntry) => void;
  onDeleteRisk?: (index: number) => void;
}
const RiskList: React.FC<RiskListProps> = ({ risks, onEditRisk, onDeleteRisk }) => {
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [editingRisk, setEditingRisk] = React.useState<RiskEntry | null>(null);
  const handleInputChange = (field: keyof RiskEntry, value: string) => {
    setEditingRisk(prev => {
      if (!prev) return null;
      const next = { ...prev, [field]: value };
      if (field === 'Likelihood' || field === 'Impact') {
        const rating = (parseInt(next.Likelihood) || 0) * (parseInt(next.Impact) || 0);
        next['Risk Rating (LxI)'] = String(rating);
        next['Is Risk Acceptable'] = rating < 10 ? 'Yes' : 'No';
      }
      if (field === 'Revised Likelihood' || field === 'Revised Impact') next['Revised Risk Rating (LxI)'] = String((parseInt(next['Revised Likelihood']) || 0) * (parseInt(next['Revised Impact']) || 0));
      return next;
    });
  };
  const entries = risks.map((risk, index) => ({ risk, index }));
  const display = (value: string) => <div className="rich-text-display" dangerouslySetInnerHTML={{ __html: sanitizeRichText(editorContent(value || '')) }} />;
  const renderSection = (environmental: boolean) => {
    const rows = entries.filter(({ risk }) => (risk.section === 'environmental') === environmental);
    if (environmental && !rows.length) return null;
    return <section className="mt-6" key={String(environmental)}>
      <h2 className="text-lg font-semibold mb-3">{environmental ? environmentalHeading : 'Added Risks'}</h2>
      {!rows.length ? <p className="text-muted-foreground py-4">No risks have been added yet.</p> : <div className="overflow-x-auto"><Table>
        <TableHeader><TableRow><TableHead>Ref</TableHead><TableHead>Activity</TableHead><TableHead>Hazards</TableHead><TableHead>Risk Rating</TableHead><TableHead>Acceptable</TableHead><TableHead>Revised Rating</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
        <TableBody>{rows.map(({ risk, index }) => <TableRow key={index}>
          <TableCell className="font-medium">{risk.Ref}</TableCell>
          <TableCell className="whitespace-normal min-w-36 max-w-72">{display(risk['Activity/Element'])}</TableCell>
          <TableCell className="whitespace-normal min-w-36 max-w-72">{display(risk['Hazards Identified'])}</TableCell>
          <TableCell>{risk['Risk Rating (LxI)']}</TableCell><TableCell>{risk['Is Risk Acceptable']}</TableCell><TableCell>{risk['Revised Risk Rating (LxI)']}</TableCell>
          <TableCell><div className="flex flex-wrap gap-1">
            <Button variant="ghost" size="sm" onClick={() => { setEditingIndex(index); setEditingRisk({ ...risk }); }}><Pencil />Edit</Button>
            <Button variant="ghost" size="sm" title={environmental ? 'Remove environmental marking' : 'Mark as environmental risk'} aria-label={environmental ? 'Remove environmental marking' : 'Mark as environmental risk'} className={environmental ? 'text-primary' : 'text-muted-foreground'} onClick={() => onEditRisk(index, { ...risk, section: environmental ? 'activity' : 'environmental' })}><Leaf className={environmental ? 'fill-current' : ''} /></Button>
            {onDeleteRisk && <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDeleteRisk(index)}><Trash2 />Delete</Button>}
          </div></TableCell>
        </TableRow>)}</TableBody>
      </Table></div>}
    </section>;
  };
  return <>
    {renderSection(false)}{renderSection(true)}
    <Dialog open={editingIndex !== null} onOpenChange={open => { if (!open) { setEditingIndex(null); setEditingRisk(null); } }}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto"><DialogHeader><DialogTitle>Edit Risk Entry</DialogTitle></DialogHeader>
        {editingRisk && <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <RiskFormFields currentRisk={editingRisk} onInputChange={handleInputChange} />
          <RiskCalculationFields currentRisk={editingRisk} onInputChange={handleInputChange} />
          <RevisedRiskFields currentRisk={editingRisk} onInputChange={handleInputChange} />
          <div className="md:col-span-2 flex justify-end gap-2"><Button variant="outline" onClick={() => { setEditingIndex(null); setEditingRisk(null); }}>Cancel</Button><Button onClick={() => { if (editingIndex === null) return; onEditRisk(editingIndex, editingRisk); setEditingIndex(null); setEditingRisk(null); }}>Save Changes</Button></div>
        </div>}
      </DialogContent>
    </Dialog>
  </>;
};
export default RiskList;
