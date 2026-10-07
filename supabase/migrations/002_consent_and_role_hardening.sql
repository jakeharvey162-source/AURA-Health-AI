-- Harden authorization and add explicit consented care relationships.
revoke update on public.aura_profiles from authenticated;
grant update(display_name,preferred_language) on public.aura_profiles to authenticated;

create table if not exists public.care_relationships(
 id uuid primary key default gen_random_uuid(),
 patient_id uuid not null references auth.users(id) on delete cascade,
 clinician_id uuid not null references auth.users(id) on delete cascade,
 status text not null default 'pending' check(status in('pending','active','revoked')),
 consented_at timestamptz,
 revoked_at timestamptz,
 created_at timestamptz not null default now(),
 unique(patient_id,clinician_id)
);
alter table public.care_relationships enable row level security;
grant select,insert,update on public.care_relationships to authenticated;
create policy "relationship_participants_select" on public.care_relationships for select to authenticated using((select auth.uid())=patient_id or (select auth.uid())=clinician_id);
create policy "patient_creates_relationship" on public.care_relationships for insert to authenticated with check((select auth.uid())=patient_id and status='pending');
create policy "patient_controls_consent" on public.care_relationships for update to authenticated using((select auth.uid())=patient_id) with check((select auth.uid())=patient_id);

create policy "clinician_select_consented_events" on public.health_events for select to authenticated using(
 exists(select 1 from public.care_relationships cr join public.aura_profiles cp on cp.id=(select auth.uid()) where cr.patient_id=health_events.user_id and cr.clinician_id=(select auth.uid()) and cr.status='active' and cp.role='clinician')
);
