-- Dev RLS policies for invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to SELECT and INSERT (dev only)
CREATE POLICY "dev_select_invoices" ON public.invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY "dev_insert_invoices" ON public.invoices FOR INSERT TO authenticated WITH CHECK (true);

-- For quick dev testing, you may uncomment below to allow public SELECT (not for prod):
-- CREATE POLICY "dev_public_select_invoices" ON public.invoices FOR SELECT TO public USING (true);
