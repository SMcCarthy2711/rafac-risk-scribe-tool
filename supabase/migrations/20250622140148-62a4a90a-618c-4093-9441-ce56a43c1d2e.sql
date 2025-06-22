
-- First create the risk_assessments table
CREATE TABLE public.risk_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  squadron TEXT,
  assessor_name TEXT,
  activity_title TEXT,
  assessment_date DATE,
  risk_assessment_type TEXT,
  publications TEXT,
  data JSONB, -- Store the full risk assessment data
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event plans table (now that risk_assessments exists)
CREATE TABLE public.event_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  risk_assessment_id UUID REFERENCES public.risk_assessments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  start_date DATE,
  end_date DATE,
  staff_lead TEXT,
  total_cadets INTEGER DEFAULT 0,
  total_staff INTEGER DEFAULT 0,
  emergency_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create travel plans table
CREATE TABLE public.travel_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_plan_id UUID REFERENCES public.event_plans(id) ON DELETE CASCADE NOT NULL,
  collection_point TEXT,
  drop_off_point TEXT,
  departure_time TIME,
  return_time TIME,
  transport_method TEXT,
  vehicle_details JSONB, -- Store array of {vrn, driver_name, capacity}
  map_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kit lists table (event_plan_id is nullable for templates)
CREATE TABLE public.kit_lists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_plan_id UUID REFERENCES public.event_plans(id) ON DELETE CASCADE, -- Nullable for templates
  activity_type TEXT,
  cadet_kit JSONB DEFAULT '[]'::jsonb, -- Array of kit items
  staff_kit JSONB DEFAULT '[]'::jsonb, -- Array of kit items
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event schedules table
CREATE TABLE public.event_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_plan_id UUID REFERENCES public.event_plans(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  activity TEXT NOT NULL,
  lead_person TEXT,
  target_audience TEXT DEFAULT 'All', -- 'Cadets', 'Staff', 'All'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create joining orders table
CREATE TABLE public.joining_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_plan_id UUID REFERENCES public.event_plans(id) ON DELETE CASCADE NOT NULL,
  content JSONB, -- Store the formatted joining order data
  qr_code_data TEXT, -- Store QR code data/link
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kit_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.joining_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you may want to restrict these later with authentication)
CREATE POLICY "Anyone can manage risk assessments" ON public.risk_assessments FOR ALL USING (true);
CREATE POLICY "Anyone can manage event plans" ON public.event_plans FOR ALL USING (true);
CREATE POLICY "Anyone can manage travel plans" ON public.travel_plans FOR ALL USING (true);
CREATE POLICY "Anyone can manage kit lists" ON public.kit_lists FOR ALL USING (true);
CREATE POLICY "Anyone can manage event schedules" ON public.event_schedules FOR ALL USING (true);
CREATE POLICY "Anyone can manage joining orders" ON public.joining_orders FOR ALL USING (true);

-- Insert some default kit list templates (with NULL event_plan_id for templates)
INSERT INTO public.kit_lists (event_plan_id, activity_type, cadet_kit, staff_kit) VALUES
(NULL, 'Adventure Training Template', 
'["Walking boots", "Waterproofs", "Warm clothing", "Day pack", "Water bottle", "Packed lunch", "Personal first aid kit", "Headtorch", "Spare batteries"]'::jsonb,
'["Risk assessment", "First aid kit", "Emergency contact details", "Mobile phone", "Map and compass", "Whistle", "Group shelter", "Spare clothing"]'::jsonb),
(NULL, 'Range Day Template', 
'["Combat boots", "DPM trousers", "Long sleeve shirt", "Eye protection", "Ear protection", "Water bottle", "Packed lunch"]'::jsonb,
'["Range safety briefing", "First aid kit", "Range safety equipment", "Ammunition", "Targets", "Cleaning kit", "Range flags"]'::jsonb),
(NULL, 'Fieldcraft Exercise Template', 
'["Combat boots", "DPM uniform", "Warm clothing", "Waterproofs", "Sleeping bag", "Roll mat", "Mess tins", "Water bottle", "Torch", "Spare batteries"]'::jsonb,
'["Field telephone", "First aid kit", "Cooking equipment", "Rations", "Map and compass", "Whistle", "Emergency shelter", "Spare equipment"]'::jsonb);
