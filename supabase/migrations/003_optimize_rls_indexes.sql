create index if not exists health_events_user_id_idx on public.health_events(user_id);
create index if not exists care_relationships_clinician_id_idx on public.care_relationships(clinician_id);
drop policy if exists "events_select_own" on public.health_events;
drop policy if exists "clinician_select_consented_events" on public.health_events;
create policy "events_select_authorized" on public.health_events for select to authenticated using(
 (select auth.uid())=user_id or exists(
  select 1 from public.care_relationships cr
  join public.aura_profiles cp on cp.id=(select auth.uid())
  where cr.patient_id=health_events.user_id
    and cr.clinician_id=(select auth.uid())
    and cr.status='active'
    and cp.role='clinician'
 )
);
