-- SARGAM'26 RSVP schema
-- Run this in the Supabase SQL editor.

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  graduation_year text not null,
  department text not null,
  phone_number text not null,
  email text,
  attending_status text not null check (attending_status in ('yes', 'no', 'maybe')),
  sadhya_status text check (sadhya_status in ('yes', 'no')),
  guest_count integer not null default 0 check (guest_count >= 0),
  special_requirements text,
  created_at timestamptz not null default now()
);

create unique index if not exists rsvps_phone_number_unique
  on public.rsvps (phone_number);

create index if not exists rsvps_created_at_idx
  on public.rsvps (created_at desc);

create index if not exists rsvps_attending_status_idx
  on public.rsvps (attending_status);

create index if not exists rsvps_graduation_year_idx
  on public.rsvps (graduation_year);

create index if not exists rsvps_department_idx
  on public.rsvps (department);

alter table public.rsvps enable row level security;

drop policy if exists "Public can submit RSVP" on public.rsvps;
create policy "Public can submit RSVP"
  on public.rsvps
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins can read RSVPs" on public.rsvps;
create policy "Admins can read RSVPs"
  on public.rsvps
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
