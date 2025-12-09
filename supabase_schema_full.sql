-- Full schema for client portal
-- Assumes Postgres with pgcrypto or uuid-ossp; Supabase provides gen_random_uuid()

-- Enable UUID generation (Supabase has gen_random_uuid())
-- create extension if not exists "uuid-ossp";

-- profiles: mirrors auth.users.id for 1:1 profile
create table if not exists public.profiles (
  id uuid primary key, -- equals auth.users.id
  full_name text,
  email text unique,
  role text default 'client',
  company text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- tickets
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  priority text check (priority in ('low','normal','high','urgent')) default 'normal',
  status text check (status in ('open','in_progress','resolved','closed')) default 'open',
  client_id uuid not null references public.profiles(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete cascade,
  assigned_to uuid references public.profiles(id) on delete set null,
  attachments jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
create index if not exists tickets_client_id_idx on public.tickets(client_id);
create index if not exists tickets_status_idx on public.tickets(status);

-- ticket_comments
create table if not exists public.ticket_comments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  attachments jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now()
);
create index if not exists ticket_comments_ticket_id_idx on public.ticket_comments(ticket_id);

-- attachments (generic attachments for invoices/tickets)
create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  owner_type text check (owner_type in ('ticket','invoice')),
  ticket_id uuid references public.tickets(id) on delete cascade,
  invoice_id uuid references public.invoices(id) on delete cascade,
  storage_path text,
  public_url text,
  created_at timestamp with time zone default now()
);

-- projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  status text check (status in ('active','paused','completed')) default 'active',
  owner_id uuid references public.profiles(id) on delete set null,
  start_date date,
  due_date date,
  progress numeric default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
create index if not exists projects_client_id_idx on public.projects(client_id);

-- invoices
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique,
  client_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric not null,
  status text check (status in ('Pending','Paid','Overdue')) default 'Pending',
  due_date date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
create index if not exists invoices_client_id_idx on public.invoices(client_id);
create index if not exists invoices_status_idx on public.invoices(status);

-- renewals
create table if not exists public.renewals (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  service_name text not null,
  next_renewal_date date,
  status text check (status in ('Upcoming','Due','Renewed','Cancelled')) default 'Upcoming',
  price numeric,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
create index if not exists renewals_client_id_idx on public.renewals(client_id);

-- Basic RLS setup (adjust to your needs)
-- Enable RLS
alter table public.profiles enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_comments enable row level security;
alter table public.attachments enable row level security;
alter table public.projects enable row level security;
alter table public.invoices enable row level security;
alter table public.renewals enable row level security;

-- Helper: allow authenticated users
create policy "Authenticated can select own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Authenticated can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Insert profile by self" on public.profiles
  for insert with check (auth.uid() = id);

-- Tickets: user can see/create their own
create policy "Select own tickets" on public.tickets
  for select using (auth.uid() = client_id);

create policy "Insert own tickets" on public.tickets
  for insert with check (auth.uid() = client_id and auth.uid() = created_by);

create policy "Update own tickets" on public.tickets
  for update using (auth.uid() = client_id);

-- Ticket comments
create policy "Select comments for own tickets" on public.ticket_comments
  for select using (exists (select 1 from public.tickets t where t.id = ticket_id and t.client_id = auth.uid()));

create policy "Insert comments by owner" on public.ticket_comments
  for insert with check (author_id = auth.uid());

-- Projects
create policy "Select own projects" on public.projects
  for select using (auth.uid() = client_id);

-- Invoices
create policy "Select own invoices" on public.invoices
  for select using (auth.uid() = client_id);

-- Renewals
create policy "Select own renewals" on public.renewals
  for select using (auth.uid() = client_id);

-- Optional: service role or admin bypass via custom claims (not included here)
