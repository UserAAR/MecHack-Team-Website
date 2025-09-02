-- Profiles with roles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role text check (role in ('admin','member')) default 'member',
  created_at timestamp with time zone default now()
);

-- News
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  content text,
  category text,
  slug text unique,
  image_url text,
  published_at timestamp with time zone,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  event_date date,
  image_url text,
  published_at timestamp with time zone,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  content text,
  image_url text,
  published_at timestamp with time zone,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.news enable row level security;
alter table public.events enable row level security;
alter table public.projects enable row level security;

-- Profiles policies
create policy if not exists "read own profile" on public.profiles for select
  using (auth.uid() = id);
create policy if not exists "update own profile" on public.profiles for update
  using (auth.uid() = id);

-- Helper: is_admin()
create or replace function public.is_admin() returns boolean language sql stable as $$
  select exists(
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- News policies
create policy if not exists "news select published" on public.news for select
  using (published_at is not null);
create policy if not exists "news admin write" on public.news for all
  using (public.is_admin()) with check (public.is_admin());

-- Events policies
create policy if not exists "events select published" on public.events for select
  using (published_at is not null);
create policy if not exists "events admin write" on public.events for all
  using (public.is_admin()) with check (public.is_admin());

-- Projects policies
create policy if not exists "projects select published" on public.projects for select
  using (published_at is not null);
create policy if not exists "projects admin write" on public.projects for all
  using (public.is_admin()) with check (public.is_admin());

-- Storage bucket (create via dashboard): 'media'
-- Make it public for read; restrict insert/update/delete via policies to admins. 