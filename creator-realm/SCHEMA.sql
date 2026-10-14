-- Kaevoryn Creator's Realm — private-draft schema reference
-- Installed in the dedicated Kaevoryn Creator Realm project; never apply to TikNation.
-- Review PRIVATE_BACKEND_SETUP.md before re-running.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.creator_realm_owners (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
revoke all on table private.creator_realm_owners from public, anon, authenticated;

-- SECURITY DEFINER is used only to check the private allowlist.
-- Keep the search_path empty and schema-qualify every referenced object.
create or replace function private.creator_realm_is_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1
    from private.creator_realm_owners as owner_record
    where owner_record.user_id = (select auth.uid())
  );
$function$;

revoke all on function private.creator_realm_is_owner() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.creator_realm_is_owner() to authenticated;

create table if not exists public.creator_realm_projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 120),
  status text not null default 'draft'
    check (status in ('draft', 'preview', 'awaiting_approval', 'approved', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  unique (id, owner_id)
);

create table if not exists public.creator_realm_revisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  owner_id uuid not null,
  revision_number integer not null check (revision_number > 0),
  content jsonb not null default '{}'::jsonb
    check (jsonb_typeof(content) = 'object'),
  status text not null default 'draft'
    check (status in ('draft', 'preview', 'awaiting_approval', 'approved', 'published')),
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  published_at timestamptz,
  unique (project_id, revision_number),
  foreign key (project_id, owner_id)
    references public.creator_realm_projects(id, owner_id)
    on delete cascade
);

create index if not exists creator_realm_projects_owner_updated_idx
  on public.creator_realm_projects(owner_id, updated_at desc);
create index if not exists creator_realm_revisions_project_created_idx
  on public.creator_realm_revisions(project_id, created_at desc);

alter table public.creator_realm_projects enable row level security;
alter table public.creator_realm_revisions enable row level security;

revoke all on table public.creator_realm_projects from public, anon;
revoke all on table public.creator_realm_revisions from public, anon;
grant select, insert, update, delete on table public.creator_realm_projects to authenticated;
grant select, insert, update, delete on table public.creator_realm_revisions to authenticated;

drop policy if exists "Realm owner can read projects" on public.creator_realm_projects;
create policy "Realm owner can read projects"
on public.creator_realm_projects for select
to authenticated
using (
  private.creator_realm_is_owner()
  and owner_id = (select auth.uid())
);

drop policy if exists "Realm owner can create projects" on public.creator_realm_projects;
create policy "Realm owner can create projects"
on public.creator_realm_projects for insert
to authenticated
with check (
  private.creator_realm_is_owner()
  and owner_id = (select auth.uid())
);

drop policy if exists "Realm owner can update projects" on public.creator_realm_projects;
create policy "Realm owner can update projects"
on public.creator_realm_projects for update
to authenticated
using (
  private.creator_realm_is_owner()
  and owner_id = (select auth.uid())
)
with check (
  private.creator_realm_is_owner()
  and owner_id = (select auth.uid())
);

drop policy if exists "Realm owner can delete projects" on public.creator_realm_projects;
create policy "Realm owner can delete projects"
on public.creator_realm_projects for delete
to authenticated
using (
  private.creator_realm_is_owner()
  and owner_id = (select auth.uid())
);

drop policy if exists "Realm owner can read revisions" on public.creator_realm_revisions;
create policy "Realm owner can read revisions"
on public.creator_realm_revisions for select
to authenticated
using (
  private.creator_realm_is_owner()
  and owner_id = (select auth.uid())
);

drop policy if exists "Realm owner can create revisions" on public.creator_realm_revisions;
create policy "Realm owner can create revisions"
on public.creator_realm_revisions for insert
to authenticated
with check (
  private.creator_realm_is_owner()
  and owner_id = (select auth.uid())
);

drop policy if exists "Realm owner can update revisions" on public.creator_realm_revisions;
create policy "Realm owner can update revisions"
on public.creator_realm_revisions for update
to authenticated
using (
  private.creator_realm_is_owner()
  and owner_id = (select auth.uid())
)
with check (
  private.creator_realm_is_owner()
  and owner_id = (select auth.uid())
);

drop policy if exists "Realm owner can delete revisions" on public.creator_realm_revisions;
create policy "Realm owner can delete revisions"
on public.creator_realm_revisions for delete
to authenticated
using (
  private.creator_realm_is_owner()
  and owner_id = (select auth.uid())
);


-- Defense in depth: browser-authenticated clients must never be able to mark
-- a revision or project as published. Only a trusted server-side service role
-- may perform the final publication transition. Keep that service credential
-- out of the browser and out of this repository.
create or replace function public.creator_realm_guard_published_state()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  if (new.status = 'published' or new.published_at is not null)
     and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Publishing is only allowed through the trusted deployment service'
      using errcode = '42501';
  end if;
  return new;
end;
$function$;

revoke all on function public.creator_realm_guard_published_state() from public, anon, authenticated;

drop trigger if exists creator_realm_projects_guard_published on public.creator_realm_projects;
create trigger creator_realm_projects_guard_published
before insert or update on public.creator_realm_projects
for each row execute function public.creator_realm_guard_published_state();

drop trigger if exists creator_realm_revisions_guard_published on public.creator_realm_revisions;
create trigger creator_realm_revisions_guard_published
before insert or update on public.creator_realm_revisions
for each row execute function public.creator_realm_guard_published_state();

comment on table private.creator_realm_owners is
  'Server-managed allowlist for the single authorized Creator Realm owner.';
comment on function private.creator_realm_is_owner() is
  'Returns true only when the current authenticated user is in the private owner allowlist.';
comment on table public.creator_realm_projects is
  'Private Creator Realm projects; access is restricted by RLS and the private owner allowlist.';
comment on table public.creator_realm_revisions is
  'Private saved project revisions. Deployment approval must be enforced by the future publishing workflow.';


-- A narrow browser-callable RPC reports only whether the current session is
-- the allowlisted owner. It uses invoker security; the private helper performs
-- the constrained allowlist lookup.
create or replace function public.creator_realm_owner_status()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $function$
  select private.creator_realm_is_owner();
$function$;

revoke all on function public.creator_realm_owner_status() from public, anon;
grant execute on function public.creator_realm_owner_status() to authenticated;
