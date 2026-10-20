-- Pocket Thon: Row Level Security

-- Trusted admin check. SECURITY DEFINER avoids recursive RLS on profiles.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.is_team_member(t uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.team_members where team_id = t and user_id = auth.uid())
      or exists (select 1 from public.teams where id = t and team_leader_id = auth.uid());
$$;

alter table public.profiles enable row level security;
alter table public.registrations enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.projects enable row level security;
alter table public.announcements enable row level security;
alter table public.event_settings enable row level security;

-- profiles ---------------------------------------------------------------
create policy profiles_select_own on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy profiles_update_own on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());
-- No insert/delete policies: rows are created by trigger only.

-- Block role changes from anyone except service role / SQL editor.
create or replace function public.protect_profile_role()
returns trigger language plpgsql as $$
begin
  if new.role is distinct from old.role and coalesce(auth.role(),'') <> 'service_role' then
    raise exception 'role cannot be changed by this user';
  end if;
  if new.email is distinct from old.email and coalesce(auth.role(),'') <> 'service_role' then
    raise exception 'email cannot be changed here';
  end if;
  return new;
end $$;
create trigger profiles_protect_role before update on public.profiles
  for each row execute function public.protect_profile_role();

-- registrations ----------------------------------------------------------
create policy registrations_select on public.registrations for select
  using (user_id = auth.uid() or public.is_admin());
create policy registrations_insert_own on public.registrations for insert
  with check (user_id = auth.uid() and status = 'pending' and admin_notes is null);
create policy registrations_update_own on public.registrations for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy registrations_admin_all on public.registrations for all
  using (public.is_admin()) with check (public.is_admin());

-- Participants may not change status, admin_notes, identity columns.
create or replace function public.protect_registration_fields()
returns trigger language plpgsql as $$
begin
  if coalesce(auth.role(),'') = 'service_role' or public.is_admin() then
    return new;
  end if;
  if new.status is distinct from old.status
     or new.admin_notes is distinct from old.admin_notes
     or new.registration_number is distinct from old.registration_number
     or new.user_id is distinct from old.user_id
     or new.email is distinct from old.email then
    raise exception 'protected registration fields cannot be modified';
  end if;
  return new;
end $$;
create trigger registrations_protect before update on public.registrations
  for each row execute function public.protect_registration_fields();

-- teams ------------------------------------------------------------------
create policy teams_select on public.teams for select
  using (team_leader_id = auth.uid() or public.is_team_member(id) or public.is_admin());
create policy teams_insert on public.teams for insert with check (team_leader_id = auth.uid());
create policy teams_update_leader on public.teams for update
  using (team_leader_id = auth.uid()) with check (team_leader_id = auth.uid());
create policy teams_delete on public.teams for delete
  using (team_leader_id = auth.uid() or public.is_admin());

-- team_members -----------------------------------------------------------
create policy team_members_select on public.team_members for select
  using (user_id = auth.uid() or public.is_team_member(team_id) or public.is_admin());
create policy team_members_insert_self on public.team_members for insert
  with check (user_id = auth.uid()
    or exists (select 1 from public.teams t where t.id = team_id and t.team_leader_id = auth.uid()));
create policy team_members_delete on public.team_members for delete
  using (user_id = auth.uid()
    or exists (select 1 from public.teams t where t.id = team_id and t.team_leader_id = auth.uid())
    or public.is_admin());

-- projects ---------------------------------------------------------------
create policy projects_select on public.projects for select
  using (public.is_team_member(team_id) or public.is_admin());
create policy projects_write_team on public.projects for all
  using (public.is_team_member(team_id)) with check (public.is_team_member(team_id));
create policy projects_admin_all on public.projects for all
  using (public.is_admin()) with check (public.is_admin());

-- announcements ----------------------------------------------------------
create policy announcements_select_published on public.announcements for select
  using (published = true or public.is_admin());
create policy announcements_admin_write on public.announcements for all
  using (public.is_admin()) with check (public.is_admin());

-- event_settings: public read (needed for landing page), admin write ------
create policy event_settings_select on public.event_settings for select using (true);
create policy event_settings_admin_write on public.event_settings for all
  using (public.is_admin()) with check (public.is_admin());

-- Public aggregate stats without exposing rows ---------------------------
create or replace function public.public_stats()
returns json language sql stable security definer set search_path = public as $$
  select json_build_object(
    'participants', (select count(*) from public.registrations),
    'teams', (select count(*) from public.teams),
    'projects', (select count(*) from public.projects where submission_status <> 'draft')
  );
$$;
grant execute on function public.public_stats() to anon, authenticated;

-- To promote an admin (run manually in the SQL editor, never from the app):
--   update public.profiles set role = 'admin' where email = 'you@example.com';
