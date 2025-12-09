-- DEV ONLY: Temporarily relax RLS policies for development
-- Run this in Supabase SQL Editor if you are getting 403/406 errors on fetch

-- 1. Profiles: Allow all authenticated users to select all profiles (for team view etc)
-- (Ideally you should only allow selecting your own or team members)
drop policy if exists "allow_select_profiles_for_auth" on public.profiles;
create policy "allow_select_profiles_for_auth" on public.profiles
  for select using (auth.role() = 'authenticated');

-- 2. Tickets: Allow all authenticated users to view all tickets (for dev)
drop policy if exists "allow_select_tickets_for_auth" on public.tickets;
create policy "allow_select_tickets_for_auth" on public.tickets
  for select using (auth.role() = 'authenticated');

-- 3. Invoices: Allow all authenticated users to view all invoices
drop policy if exists "allow_select_invoices_for_auth" on public.invoices;
create policy "allow_select_invoices_for_auth" on public.invoices
  for select using (auth.role() = 'authenticated');

-- 4. Attachments: Allow public read (if bucket is public) or auth read
-- (Storage policies are separate, check Storage > Policies in dashboard)

-- REVERT INSTRUCTION:
-- To revert, delete these policies and re-apply strict ones from supabase_schema.sql
