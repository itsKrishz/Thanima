-- Alter rsvps table to add columns for soft deletes and updates
alter table public.rsvps 
  add column if not exists is_deleted boolean not null default false,
  add column if not exists deleted_at timestamptz default null,
  add column if not exists updated_at timestamptz default now();

-- Policy updates for admin users
drop policy if exists "Admins can read RSVPs" on public.rsvps;
create policy "Admins can perform all actions" on public.rsvps
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Security definer functions for anonymous clients

-- 1. Fetch RSVP by ID
create or replace function public.get_rsvp_by_id(rsvp_id uuid)
returns table (
  id uuid,
  full_name text,
  graduation_year text,
  department text,
  phone_number text,
  email text,
  attending_status text,
  sadhya_status text,
  guest_count integer,
  special_requirements text,
  created_at timestamptz,
  updated_at timestamptz,
  is_deleted boolean
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select r.id, r.full_name, r.graduation_year, r.department, r.phone_number, r.email,
         r.attending_status, r.sadhya_status, r.guest_count, r.special_requirements, r.created_at, r.updated_at, r.is_deleted
  from public.rsvps r
  where r.id = rsvp_id and r.is_deleted = false;
end;
$$;

-- 2. Find RSVP by phone and email
create or replace function public.find_rsvp_by_details(phone text, mail text)
returns table (id uuid)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select r.id
  from public.rsvps r
  where r.phone_number = phone 
    and (r.email = mail or (r.email is null and (mail = '' or mail is null)))
    and r.is_deleted = false;
end;
$$;

-- 3. Update RSVP by ID
create or replace function public.update_rsvp_by_id(
  rsvp_id uuid,
  f_name text,
  grad_year text,
  dept text,
  phone text,
  mail text,
  attend text,
  sadhya text,
  reqs text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.rsvps
  set full_name = f_name,
      graduation_year = grad_year,
      department = dept,
      phone_number = phone,
      email = nullif(mail, ''),
      attending_status = attend,
      sadhya_status = nullif(sadhya, ''),
      special_requirements = nullif(reqs, ''),
      updated_at = now()
  where id = rsvp_id and is_deleted = false;
  
  return found;
end;
$$;
