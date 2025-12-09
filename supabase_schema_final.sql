-- Create production tables: profiles, tickets, channels, channel_members, messages

-- Profiles: Linked to auth.users via auth_id
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text default 'client',
  company text,
  avatar_url text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(auth_id)
);

-- Tickets: Issues/Requests
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  priority text default 'normal', -- low, normal, high, urgent
  assign_to text, -- could be a profile_id or a name
  project_id uuid,
  status text default 'open', -- open, in_progress, resolved, closed
  attachments jsonb default '[]'::jsonb,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Channels: Chat rooms
create table if not exists public.channels (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text unique,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- Channel Members: Who is in which channel
create table if not exists public.channel_members (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid references public.channels(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  role text default 'member', -- admin, member, moderator
  created_at timestamptz default now(),
  unique(channel_id, profile_id)
);

-- Messages: Chat messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid references public.channels(id) on delete cascade,
  sender_id uuid references public.profiles(id),
  body text,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- RLS Helpers (Dev Safe - allow all for now, or basic auth checks)
alter table public.profiles enable row level security;
alter table public.tickets enable row level security;
alter table public.channels enable row level security;
alter table public.channel_members enable row level security;
alter table public.messages enable row level security;

-- Policies (Permissive for development, refine for production)
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = auth_id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = auth_id);

create policy "Authenticated users can view tickets" on public.tickets for select using (auth.role() = 'authenticated');
create policy "Authenticated users can create tickets" on public.tickets for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update tickets" on public.tickets for update using (auth.role() = 'authenticated');

create policy "Authenticated users can view channels" on public.channels for select using (auth.role() = 'authenticated');
create policy "Authenticated users can create channels" on public.channels for insert with check (auth.role() = 'authenticated');

create policy "Authenticated users can view messages" on public.messages for select using (auth.role() = 'authenticated');
create policy "Authenticated users can insert messages" on public.messages for insert with check (auth.role() = 'authenticated');

-- Storage bucket for ticket attachments
insert into storage.buckets (id, name, public) values ('ticket-attachments', 'ticket-attachments', true) on conflict (id) do nothing;
create policy "Ticket attachments are public" on storage.objects for select using (bucket_id = 'ticket-attachments');
create policy "Authenticated users can upload ticket attachments" on storage.objects for insert with check (bucket_id = 'ticket-attachments' and auth.role() = 'authenticated');
