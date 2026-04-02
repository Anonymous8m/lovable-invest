
-- Add transaction_pin column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS transaction_pin text DEFAULT '';

-- Admin SELECT policy on user_investments
CREATE POLICY "Admins can view all investments"
ON public.user_investments
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin UPDATE policy on user_investments
CREATE POLICY "Admins can update investments"
ON public.user_investments
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
