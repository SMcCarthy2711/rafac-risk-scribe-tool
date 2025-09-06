-- Add user_id columns to all user-specific tables
ALTER TABLE public.event_plans 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.joining_orders 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.kit_lists 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.risk_assessments 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.travel_plans 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.event_schedules 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can manage their event plans" ON public.event_plans;
DROP POLICY IF EXISTS "Authenticated users can manage their joining orders" ON public.joining_orders;
DROP POLICY IF EXISTS "Authenticated users can manage their kit lists" ON public.kit_lists;
DROP POLICY IF EXISTS "Authenticated users can manage their risk assessments" ON public.risk_assessments;
DROP POLICY IF EXISTS "Authenticated users can manage their travel plans" ON public.travel_plans;
DROP POLICY IF EXISTS "Authenticated users can manage their event schedules" ON public.event_schedules;

-- Create secure RLS policies that restrict access to user's own records
-- Event Plans
CREATE POLICY "Users can view their own event plans" 
ON public.event_plans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own event plans" 
ON public.event_plans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own event plans" 
ON public.event_plans 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own event plans" 
ON public.event_plans 
FOR DELETE 
USING (auth.uid() = user_id);

-- Joining Orders
CREATE POLICY "Users can view their own joining orders" 
ON public.joining_orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own joining orders" 
ON public.joining_orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own joining orders" 
ON public.joining_orders 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own joining orders" 
ON public.joining_orders 
FOR DELETE 
USING (auth.uid() = user_id);

-- Kit Lists
CREATE POLICY "Users can view their own kit lists" 
ON public.kit_lists 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own kit lists" 
ON public.kit_lists 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own kit lists" 
ON public.kit_lists 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own kit lists" 
ON public.kit_lists 
FOR DELETE 
USING (auth.uid() = user_id);

-- Risk Assessments
CREATE POLICY "Users can view their own risk assessments" 
ON public.risk_assessments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own risk assessments" 
ON public.risk_assessments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own risk assessments" 
ON public.risk_assessments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own risk assessments" 
ON public.risk_assessments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Travel Plans
CREATE POLICY "Users can view their own travel plans" 
ON public.travel_plans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own travel plans" 
ON public.travel_plans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own travel plans" 
ON public.travel_plans 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own travel plans" 
ON public.travel_plans 
FOR DELETE 
USING (auth.uid() = user_id);

-- Event Schedules
CREATE POLICY "Users can view their own event schedules" 
ON public.event_schedules 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own event schedules" 
ON public.event_schedules 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own event schedules" 
ON public.event_schedules 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own event schedules" 
ON public.event_schedules 
FOR DELETE 
USING (auth.uid() = user_id);