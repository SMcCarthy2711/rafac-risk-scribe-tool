
-- Allow authenticated users to insert pre-saved risks
CREATE POLICY "Authenticated users can insert pre-saved risks"
ON public.pre_saved_risks
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update pre-saved risks
CREATE POLICY "Authenticated users can update pre-saved risks"
ON public.pre_saved_risks
FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated users to delete pre-saved risks
CREATE POLICY "Authenticated users can delete pre-saved risks"
ON public.pre_saved_risks
FOR DELETE
TO authenticated
USING (true);

-- Allow authenticated users to insert risk categories
CREATE POLICY "Authenticated users can insert risk categories"
ON public.risk_categories
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update risk categories
CREATE POLICY "Authenticated users can update risk categories"
ON public.risk_categories
FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated users to delete risk categories
CREATE POLICY "Authenticated users can delete risk categories"
ON public.risk_categories
FOR DELETE
TO authenticated
USING (true);

-- Allow authenticated users to insert risk subcategories
CREATE POLICY "Authenticated users can insert risk subcategories"
ON public.risk_subcategories
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update risk subcategories
CREATE POLICY "Authenticated users can update risk subcategories"
ON public.risk_subcategories
FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated users to delete risk subcategories
CREATE POLICY "Authenticated users can delete risk subcategories"
ON public.risk_subcategories
FOR DELETE
TO authenticated
USING (true);
