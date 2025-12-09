-- Update Profiles Table (linked to auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text default 'client',
  company text,
  phone text,
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Payments Table
create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid references invoices(id) on delete cascade,
  amount decimal(10, 2) not null,
  date timestamptz default now(),
  method text, -- 'Credit Card', 'Bank Transfer', etc.
  status text default 'Completed',
  transaction_id text,
  created_at timestamptz default now()
);

-- Renewals Table
create table if not exists renewals (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text, -- 'Domain', 'Hosting', etc.
  renew_date date not null,
  amount decimal(10, 2) not null,
  status text default 'Active', -- 'Active', 'Expiring', 'Expired'
  auto_renew boolean default true,
  created_at timestamptz default now()
);

-- Activities Table (for user activity log)
create table if not exists activities (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  type text, -- 'login', 'update', 'ticket_create', etc.
  description text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table payments enable row level security;
alter table renewals enable row level security;
alter table activities enable row level security;

-- Basic Policies
create policy "Users can view their own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

create policy "Users can view their own payments" on payments for select using (
  exists (select 1 from invoices where invoices.id = payments.invoice_id and invoices.client_id = auth.uid())
);

create policy "Users can view renewals" on renewals for select using (true); -- Adjust as needed

create policy "Users can view their own activity" on activities for select using (auth.uid() = user_id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as 4146
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'role', 'client'));
  return new;
end;
4146 language plpgsql security definer;

-- Check if trigger exists before creating to avoid errors in repeated runs (optional, but good practice)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ADMIN SEED INSTRUCTION
-- To create an admin user:
-- 1. Sign up a new user via the app or Supabase dashboard.
-- 2. Run this SQL to update their role to 'admin':
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
