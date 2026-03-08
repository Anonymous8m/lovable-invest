CREATE POLICY "Admins can insert plans"
ON public.investment_plans
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update plans"
ON public.investment_plans
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete plans"
ON public.investment_plans
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));