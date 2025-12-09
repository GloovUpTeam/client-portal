-- RLS policies for development
-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to SELECT and INSERT (dev only)
CREATE POLICY "Authenticated users can SELECT invoices (dev)"
    ON public.invoices
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can INSERT invoices (dev)"
    ON public.invoices
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Optionally, for quick dev testing, uncomment to allow public SELECT (not for prod):
-- CREATE POLICY "Public can SELECT invoices (dev only)"
--     ON public.invoices
--     FOR SELECT
--     TO public
--     USING (true);
