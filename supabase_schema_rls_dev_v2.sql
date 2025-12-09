-- DEV ONLY: enable select/insert on tickets & invoices for authenticated users
-- WARNING: This relaxes security. Revert in production.

-- 1. Tickets
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dev_allow_select_insert_tickets" ON public.tickets;
CREATE POLICY "dev_allow_select_insert_tickets" ON public.tickets
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- 2. Invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dev_allow_select_insert_invoices" ON public.invoices;
CREATE POLICY "dev_allow_select_insert_invoices" ON public.invoices
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Profiles (allow reading minimally)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "dev_profiles_select" ON public.profiles;
CREATE POLICY "dev_profiles_select" ON public.profiles 
  FOR SELECT USING (auth.uid() IS NOT NULL);
