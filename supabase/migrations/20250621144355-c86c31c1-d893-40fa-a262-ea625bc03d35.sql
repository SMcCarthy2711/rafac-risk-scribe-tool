
-- Create enum for risk assessment types
CREATE TYPE public.risk_assessment_type AS ENUM ('Generic', 'Specific');

-- Create risk categories table
CREATE TABLE public.risk_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create risk subcategories table
CREATE TABLE public.risk_subcategories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.risk_categories(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pre-saved risks table
CREATE TABLE public.pre_saved_risks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.risk_categories(id) ON DELETE CASCADE NOT NULL,
  subcategory_id UUID REFERENCES public.risk_subcategories(id) ON DELETE SET NULL,
  activity_element TEXT NOT NULL,
  hazards_identified TEXT NOT NULL,
  who_might_be_harmed TEXT NOT NULL,
  existing_control_measures TEXT NOT NULL,
  likelihood INTEGER NOT NULL CHECK (likelihood BETWEEN 1 AND 5),
  impact INTEGER NOT NULL CHECK (impact BETWEEN 1 AND 5),
  additional_control_measures TEXT,
  required_actions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) - making these tables publicly readable for simplicity
-- since pre-saved risks are likely to be organizational templates
ALTER TABLE public.risk_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pre_saved_risks ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view risk categories" 
  ON public.risk_categories 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can view risk subcategories" 
  ON public.risk_subcategories 
  FOR SELECT 
  USING (true);

CREATE POLICY "Anyone can view pre-saved risks" 
  ON public.pre_saved_risks 
  FOR SELECT 
  USING (true);

-- Insert default categories
INSERT INTO public.risk_categories (name) VALUES
  ('Aviation Activities'),
  ('Fieldcraft & Outdoor Activities'),
  ('Sports & Physical Training'),
  ('Facilities & Equipment'),
  ('Transport & Travel');

-- Insert default subcategories
INSERT INTO public.risk_subcategories (category_id, name) 
SELECT id, subcategory FROM public.risk_categories, 
UNNEST(ARRAY[
  'Flying Training', 'Ground Operations', 'Aircraft Maintenance'
]) AS subcategory 
WHERE name = 'Aviation Activities';

INSERT INTO public.risk_subcategories (category_id, name) 
SELECT id, subcategory FROM public.risk_categories, 
UNNEST(ARRAY[
  'Camping', 'Navigation', 'Survival Training'
]) AS subcategory 
WHERE name = 'Fieldcraft & Outdoor Activities';

INSERT INTO public.risk_subcategories (category_id, name) 
SELECT id, subcategory FROM public.risk_categories, 
UNNEST(ARRAY[
  'Team Sports', 'Individual Training', 'Adventure Training'
]) AS subcategory 
WHERE name = 'Sports & Physical Training';

INSERT INTO public.risk_subcategories (category_id, name) 
SELECT id, subcategory FROM public.risk_categories, 
UNNEST(ARRAY[
  'Building Operations', 'Equipment Use', 'Maintenance'
]) AS subcategory 
WHERE name = 'Facilities & Equipment';

INSERT INTO public.risk_subcategories (category_id, name) 
SELECT id, subcategory FROM public.risk_categories, 
UNNEST(ARRAY[
  'Road Transport', 'Public Transport', 'Walking/Cycling'
]) AS subcategory 
WHERE name = 'Transport & Travel';

-- Insert sample pre-saved risks
INSERT INTO public.pre_saved_risks (
  category_id, subcategory_id, activity_element, hazards_identified, 
  who_might_be_harmed, existing_control_measures, likelihood, impact,
  additional_control_measures, required_actions
) 
SELECT 
  c.id,
  s.id,
  'Flying in adverse weather conditions',
  'Poor visibility, turbulence, strong winds, precipitation affecting aircraft control',
  'Aircrew, passengers, ground personnel',
  'Weather briefing, minimum weather limits, qualified instructor supervision',
  2,
  4,
  'Enhanced weather monitoring, alternative routing plans',
  'Pre-flight weather check (Instructor, Before each flight)'
FROM public.risk_categories c
JOIN public.risk_subcategories s ON c.id = s.category_id
WHERE c.name = 'Aviation Activities' AND s.name = 'Flying Training';

INSERT INTO public.pre_saved_risks (
  category_id, subcategory_id, activity_element, hazards_identified, 
  who_might_be_harmed, existing_control_measures, likelihood, impact,
  additional_control_measures, required_actions
) 
SELECT 
  c.id,
  s.id,
  'Campfire activities',
  'Burns from fire, smoke inhalation, fire spreading to vegetation',
  'All participants, particularly those tending the fire',
  'Fire safety briefing, designated fire area, fire extinguisher available',
  2,
  3,
  'Fire marshal appointed, burn ban awareness',
  'Fire safety check (Adult supervisor, Every 30 minutes)'
FROM public.risk_categories c
JOIN public.risk_subcategories s ON c.id = s.category_id
WHERE c.name = 'Fieldcraft & Outdoor Activities' AND s.name = 'Camping';

INSERT INTO public.pre_saved_risks (
  category_id, subcategory_id, activity_element, hazards_identified, 
  who_might_be_harmed, existing_control_measures, likelihood, impact,
  additional_control_measures, required_actions
) 
SELECT 
  c.id,
  s.id,
  'Contact sports activities',
  'Player collisions, falls, equipment impact injuries',
  'All players, particularly those in high-contact positions',
  'Protective equipment, qualified referee, first aid kit available',
  3,
  3,
  'Pre-game safety briefing, equipment inspection',
  'Equipment check (Coach, Before each session)'
FROM public.risk_categories c
JOIN public.risk_subcategories s ON c.id = s.category_id
WHERE c.name = 'Sports & Physical Training' AND s.name = 'Team Sports';

INSERT INTO public.pre_saved_risks (
  category_id, subcategory_id, activity_element, hazards_identified, 
  who_might_be_harmed, existing_control_measures, likelihood, impact,
  additional_control_measures, required_actions
) 
SELECT 
  c.id,
  s.id,
  'Minibus transportation',
  'Vehicle breakdown, road traffic accidents, driver fatigue',
  'All passengers, driver, other road users',
  'Licensed driver, vehicle MOT, insurance coverage, seatbelts',
  2,
  4,
  'Pre-journey vehicle check, emergency contact procedures',
  'Vehicle inspection (Driver, Before departure)'
FROM public.risk_categories c
JOIN public.risk_subcategories s ON c.id = s.category_id
WHERE c.name = 'Transport & Travel' AND s.name = 'Road Transport';

INSERT INTO public.pre_saved_risks (
  category_id, subcategory_id, activity_element, hazards_identified, 
  who_might_be_harmed, existing_control_measures, likelihood, impact,
  additional_control_measures, required_actions
) 
SELECT 
  c.id,
  s.id,
  'Workshop tool usage',
  'Cuts from sharp tools, eye injuries from debris, electric shock',
  'All workshop users, particularly inexperienced cadets',
  'Safety briefing, protective equipment, adult supervision',
  2,
  3,
  'Tool safety training, regular equipment maintenance',
  'Safety equipment check (Instructor, Before each session)'
FROM public.risk_categories c
JOIN public.risk_subcategories s ON c.id = s.category_id
WHERE c.name = 'Facilities & Equipment' AND s.name = 'Equipment Use';
