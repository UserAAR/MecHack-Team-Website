-- Roles & Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role text check (role in ('user','admin','superadmin')) default 'user',
  created_at timestamp with time zone default now()
);

-- Keep email in sync and ensure default role on auth.users insert
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.handle_user_email_change()
returns trigger as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update of email on auth.users
  for each row execute function public.handle_user_email_change();

-- Helpers
create or replace function public.is_admin() returns boolean language sql stable as $$
  select exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','superadmin'));
$$;

create or replace function public.is_superadmin() returns boolean language sql stable as $$
  select exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'superadmin');
$$;

-- Content tables (single table per entity with AZ fields)
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  title_az text,
  content_az text,
  slug text unique,
  cover_url text,
  published_at timestamp with time zone,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  title_az text,
  description_az text,
  content text,
  content_az text,
  slug text unique,
  cover_url text,
  published_at timestamp with time zone,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  title_az text,
  description_az text,
  location text,
  location_az text,
  slug text unique,
  cover_url text,
  starts_at timestamp with time zone,
  ends_at timestamp with time zone,
  published_at timestamp with time zone,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Backward-compat columns (safe no-ops if already exist)
alter table public.news add column if not exists excerpt text;
alter table public.news add column if not exists category text;
alter table public.news add column if not exists image_url text;
alter table public.projects add column if not exists summary text;
alter table public.projects add column if not exists image_url text;
alter table public.events add column if not exists event_date timestamp with time zone;
alter table public.events add column if not exists image_url text;

-- Update triggers for updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_news_updated_at on public.news;
create trigger trg_news_updated_at before update on public.news for each row execute function public.set_updated_at();

drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at before update on public.projects for each row execute function public.set_updated_at();

drop trigger if exists trg_events_updated_at on public.events;
create trigger trg_events_updated_at before update on public.events for each row execute function public.set_updated_at();

-- Indexes
create index if not exists idx_news_slug on public.news((lower(slug)));
create index if not exists idx_projects_slug on public.projects((lower(slug)));
create index if not exists idx_events_slug on public.events((lower(slug)));
create index if not exists idx_events_starts_at on public.events using btree (starts_at asc nulls last);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.news enable row level security;
alter table public.projects enable row level security;
alter table public.events enable row level security;

-- Profiles policies
create policy if not exists "profiles read self or admin" on public.profiles for select
  using (auth.uid() = id or public.is_admin());
create policy if not exists "profiles superadmin write" on public.profiles for all
  using (public.is_superadmin()) with check (public.is_superadmin());

-- Content policies
-- Public can read only published
create policy if not exists "news select published" on public.news for select using (published_at is not null);
create policy if not exists "projects select published" on public.projects for select using (published_at is not null);
create policy if not exists "events select published" on public.events for select using (published_at is not null);
-- Admins can read all
create policy if not exists "news admin read" on public.news for select using (public.is_admin());
create policy if not exists "projects admin read" on public.projects for select using (public.is_admin());
create policy if not exists "events admin read" on public.events for select using (public.is_admin());
-- Writes only for admin & superadmin
create policy if not exists "news admin write" on public.news for all using (public.is_admin()) with check (public.is_admin());
create policy if not exists "projects admin write" on public.projects for all using (public.is_admin()) with check (public.is_admin());
create policy if not exists "events admin write" on public.events for all using (public.is_admin()) with check (public.is_admin());

-- Storage policies for bucket 'media'
-- Execute these on storage schema (requires supabase storage enabled)
create policy if not exists "media public read" on storage.objects for select
  using (bucket_id = 'media');
create policy if not exists "media admin write" on storage.objects for all
  using (bucket_id = 'media' and public.is_admin()) with check (bucket_id = 'media' and public.is_admin());

-- Optional: basic audit log for destructive actions
create table if not exists public.audit_logs (
  id bigserial primary key,
  actor uuid,
  action text,
  entity text,
  entity_id uuid,
  created_at timestamp with time zone default now()
);

create or replace function public.log_audit()
returns trigger as $$
begin
  insert into public.audit_logs(actor, action, entity, entity_id)
  values (auth.uid(), TG_OP, TG_TABLE_NAME, coalesce(new.id, old.id));
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

drop trigger if exists trg_news_audit on public.news;
create trigger trg_news_audit after insert or update or delete on public.news for each row execute function public.log_audit();

drop trigger if exists trg_projects_audit on public.projects;
create trigger trg_projects_audit after insert or update or delete on public.projects for each row execute function public.log_audit();

drop trigger if exists trg_events_audit on public.events;
create trigger trg_events_audit after insert or update or delete on public.events for each row execute function public.log_audit(); 