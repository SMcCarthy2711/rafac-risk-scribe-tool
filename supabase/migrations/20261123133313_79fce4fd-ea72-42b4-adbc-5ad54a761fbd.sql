ALTER TABLE public.event_plans ADD COLUMN description text NOT NULL DEFAULT '', ADD COLUMN sms_reference text NOT NULL DEFAULT '', ADD COLUMN lead_squadron text NOT NULL DEFAULT '', ADD COLUMN other_squadrons text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.event_schedules ADD COLUMN end_date date;
UPDATE public.event_schedules SET end_date = date WHERE end_date IS NULL;