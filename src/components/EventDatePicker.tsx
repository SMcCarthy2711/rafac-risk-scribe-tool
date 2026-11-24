import { useEffect, useState } from 'react';
import { format, isValid, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { displayDateEntry, parseDateEntry } from '@/lib/dateEntry';

interface Props { id: string; label: string; value: string; onChange: (value: string) => void; min?: string }

export default function EventDatePicker({ id, label, value, onChange, min }: Props) {
  const [draft, setDraft] = useState(() => displayDateEntry(value));
  const [invalid, setInvalid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { setDraft(displayDateEntry(value)); setInvalid(false); }, [value]);
  const normalizedValue = parseDateEntry(value) || value;
  const parsed = normalizedValue ? parse(normalizedValue, 'yyyy-MM-dd', new Date()) : undefined;
  const selected = parsed && isValid(parsed) && parsed.getFullYear() >= 1000 ? parsed : undefined;
  const commit = () => {
    if (!draft.trim()) { setInvalid(false); if (value) onChange(''); return; }
    const date = parseDateEntry(draft);
    if (!date || (min && date < min)) { setInvalid(true); return; }
    setInvalid(false);
    if (date !== normalizedValue) onChange(date);
  };
  const year = selected?.getFullYear() || new Date().getFullYear();
  return <div className="space-y-1">
    <div className="flex gap-2">
      <Input id={id} aria-label={label} aria-invalid={invalid} aria-describedby={invalid ? `${id}-error` : undefined} value={draft} placeholder="DD/MM/YYYY" inputMode="numeric" onChange={event => { setDraft(event.target.value); setInvalid(false); }} onBlur={commit} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); commit(); } }} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild><Button type="button" variant="outline" size="icon" className="shrink-0" aria-label={`Choose ${label}`} title={`Choose ${label}`}><CalendarIcon className="h-4 w-4" /></Button></PopoverTrigger>
        <PopoverContent className="w-auto p-0 pointer-events-auto" align="end">
          <Calendar mode="single" selected={selected} defaultMonth={selected} captionLayout="dropdown-buttons" classNames={{ caption_label: 'hidden', caption_dropdowns: 'flex items-center justify-center gap-2 px-7', dropdown: 'rounded border border-input bg-background text-foreground text-sm h-8 px-1', dropdown_month: 'relative', dropdown_year: 'relative', vhidden: 'sr-only' }} fromYear={year - 100} toYear={year + 100} disabled={min ? { before: parse(min, 'yyyy-MM-dd', new Date()) } : undefined} onSelect={date => { if (!date) return; const next = format(date, 'yyyy-MM-dd'); setDraft(displayDateEntry(next)); setInvalid(false); onChange(next); setOpen(false); }} initialFocus className="pointer-events-auto" />
        </PopoverContent>
      </Popover>
    </div>
    {invalid && <p id={`${id}-error`} className="text-xs text-destructive">Enter a valid date as DD/MM/YYYY{min ? ` on or after ${displayDateEntry(min)}` : ''}.</p>}
  </div>;
}