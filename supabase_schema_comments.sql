-- Create ticket_comments table
create table if not exists public.ticket_comments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.tickets(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  text text not null,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.ticket_comments enable row level security;

-- Policies
create policy "Authenticated users can view ticket comments" on public.ticket_comments
  for select using (auth.role() = 'authenticated');

create policy "Authenticated users can insert ticket comments" on public.ticket_comments
  for insert with check (auth.role() = 'authenticated');
