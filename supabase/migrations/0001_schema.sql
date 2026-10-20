-- Pocket Thon: core schema
create extension if not exists "pgcrypto";

-- Helper: updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- profiles ---------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null,
  role text not null default 'participant' check (role in ('participant','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index profiles_email_key on public.profiles (lower(email));
create trigger profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile for every new auth user. Role is ALWAYS participant;
-- never read from user-supplied metadata.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), new.email, 'participant');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- registration number sequence ------------------------------------------
create sequence public.registration_seq start 1001;
create or replace function public.next_registration_number()
returns text language sql as $$
  select 'PT-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.registration_seq')::text, 5, '0');
$$;

-- teams ------------------------------------------------------------------
create table public.teams (
  id uuid primary key default gen_random_uuid(),
  team_name text not null check (char_length(team_name) between 2 and 80),
  team_leader_id uuid not null references auth.users(id) on delete cascade,
  team_code text not null unique default upper(substr(encode(gen_random_bytes(4),'hex'),1,8)),
  created_at timestamptz not null default now()
);
create index teams_leader_idx on public.teams(team_leader_id);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (team_id, user_id),
  unique (user_id)  -- one team per participant
);
create index team_members_team_idx on public.team_members(team_id);

-- registrations ----------------------------------------------------------
create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  registration_number text not null unique default public.next_registration_number(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null,
  phone text not null check (phone ~ '^\+?[0-9]{10,15}$'),
  college text not null,
  course text not null,
  study_year smallint not null check (study_year between 1 and 8),
  city text not null,
  state text not null,
  github_url text not null,
  linkedin_url text,
  skills text[] not null default '{}',
  participation_type text not null check (participation_type in ('individual','team')),
  team_name text,
  team_size smallint not null default 1 check (team_size between 1 and 6),
  project_idea text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index registrations_email_key on public.registrations (lower(email));
create index registrations_status_idx on public.registrations(status);
create index registrations_college_idx on public.registrations(lower(college));
create index registrations_created_idx on public.registrations(created_at desc);
create trigger registrations_updated before update on public.registrations
  for each row execute function public.set_updated_at();

-- projects ---------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null unique references public.teams(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 150),
  description text not null,
  repository_url text,
  demo_url text,
  submission_status text not null default 'draft' check (submission_status in ('draft','submitted','under_review','accepted','rejected')),
  submitted_at timestamptz,
  updated_at timestamptz not null default now()
);
create trigger projects_updated before update on public.projects
  for each row execute function public.set_updated_at();

-- announcements ----------------------------------------------------------
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger announcements_updated before update on public.announcements
  for each row execute function public.set_updated_at();

-- event_settings (single row) -------------------------------------------
create table public.event_settings (
  id uuid primary key default gen_random_uuid(),
  event_name text not null default 'Pocket Thon',
  event_date timestamptz,
  registration_deadline timestamptz,
  registration_open boolean not null default true,
  description text not null default '',
  content jsonb not null default '{}'::jsonb, -- schedule, prizes, faq, sponsors, themes, contact, social
  updated_at timestamptz not null default now()
);
create unique index event_settings_singleton on public.event_settings ((true));
create trigger event_settings_updated before update on public.event_settings
  for each row execute function public.set_updated_at();
insert into public.event_settings (event_name, description) values ('Pocket Thon', '');
