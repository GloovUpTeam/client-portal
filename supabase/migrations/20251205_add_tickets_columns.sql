-- Migration: Add missing columns to public.tickets for UI compatibility
ALTER TABLE public.tickets
  ADD COLUMN IF NOT EXISTS submitted_by uuid,
  ADD COLUMN IF NOT EXISTS project_id uuid,
  ADD COLUMN IF NOT EXISTS assign_to text,
  ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS priority text,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'open',
  ADD COLUMN IF NOT EXISTS due_date date;

-- Enable RLS and add dev policies
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dev_select_tickets" ON public.tickets FOR SELECT TO authenticated USING (true);
CREATE POLICY "dev_insert_tickets" ON public.tickets FOR INSERT TO authenticated WITH CHECK (true);
-- For quick dev testing, you may uncomment below to allow public SELECT (not for prod):
-- CREATE POLICY "dev_public_select_tickets" ON public.tickets FOR SELECT TO public USING (true);
