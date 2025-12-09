-- users (profiles)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(), -- for app-managed id if not using auth uid
  auth_id uuid, -- store supabase auth uid when using supabase auth
  email text not null unique,
  full_name text,
  role text default 'client',
  created_at timestamptz default now()
);

-- tickets
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  priority text default 'normal',
  status text default 'open',
  client_id uuid references public.users(id) on delete set null,
  assigned_to uuid references public.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- invoices
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null,
  client_id uuid references public.users(id) on delete set null,
  issued_date date,
  due_date date,
  total numeric(12,2) default 0,
  status text default 'pending',
  created_at timestamptz default now()
);

-- attachments (files for tickets/invoices)
create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.tickets(id) on delete cascade,
  invoice_id uuid references public.invoices(id) on delete cascade,
  storage_path text not null,
  public_url text,
  filename text,
  created_at timestamptz default now()
);

-- invoice items
create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references public.invoices(id) on delete cascade,
  description text,
  qty integer default 1,
  unit_price numeric(12,2) default 0,
  created_at timestamptz default now()
);

-- Enable RLS (only if you will add policies)
alter table public.tickets enable row level security;
alter table public.invoices enable row level security;

-- Example policy: allow authenticated users to select their own tickets (matching client_id)
create policy "select own tickets" on public.tickets
  for select
  using (auth.uid()::text = client_id::text);

-- Example policy to allow insert for authenticated (dev only)
create policy "insert tickets for auth" on public.tickets
  for insert
  with check (auth.uid()::text = client_id::text);
