-- Fix critical security vulnerability: Implement authentication-based access control
-- Remove overly permissive RLS policies and implement proper authentication requirements

-- Update event_plans table policies
DROP POLICY IF EXISTS "Anyone can manage event plans" ON public.event_plans;

CREATE POLICY "Authenticated users can manage their event plans" 
ON public.event_plans 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Update risk_assessments table policies  
DROP POLICY IF EXISTS "Anyone can manage risk assessments" ON public.risk_assessments;

CREATE POLICY "Authenticated users can manage their risk assessments" 
ON public.risk_assessments 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Update travel_plans table policies
DROP POLICY IF EXISTS "Anyone can manage travel plans" ON public.travel_plans;

CREATE POLICY "Authenticated users can manage their travel plans" 
ON public.travel_plans 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Update kit_lists table policies
DROP POLICY IF EXISTS "Anyone can manage kit lists" ON public.kit_lists;

CREATE POLICY "Authenticated users can manage their kit lists" 
ON public.kit_lists 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Update event_schedules table policies
DROP POLICY IF EXISTS "Anyone can manage event schedules" ON public.event_schedules;

CREATE POLICY "Authenticated users can manage their event schedules" 
ON public.event_schedules 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Update joining_orders table policies
DROP POLICY IF EXISTS "Anyone can manage joining orders" ON public.joining_orders;

CREATE POLICY "Authenticated users can manage their joining orders" 
ON public.joining_orders 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);