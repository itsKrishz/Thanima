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

-- 4. Insert RSVP (Security Definer)
create or replace function public.insert_rsvp(
  f_name text,
  grad_year text,
  dept text,
  phone text,
  mail text,
  attend text,
  sadhya text,
  reqs text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  insert into public.rsvps (
    full_name,
    graduation_year,
    department,
    phone_number,
    email,
    attending_status,
    sadhya_status,
    guest_count,
    special_requirements
  ) values (
    f_name,
    grad_year,
    dept,
    phone,
    nullif(mail, ''),
    attend,
    nullif(sadhya, ''),
    1, -- guest_count constraint
    nullif(reqs, '')
  )
  returning id into new_id;
  
  return new_id;
end;
$$;

-- 5. Update unique index to exclude soft-deleted records
drop index if exists public.rsvps_phone_number_unique;
create unique index rsvps_phone_number_unique
  on public.rsvps (phone_number)
  where (is_deleted = false);

-- 6. Add registration_number column to public.rsvps
alter table public.rsvps add column if not exists registration_number text not null default '';

-- Drop existing functions before recreating them to prevent return type/signature mismatch errors
drop function if exists public.get_rsvp_by_id(uuid);
drop function if exists public.insert_rsvp(text, text, text, text, text, text, text, text);
drop function if exists public.update_rsvp_by_id(uuid, text, text, text, text, text, text, text, text);

-- 7. Recreate get_rsvp_by_id to return registration_number
create or replace function public.get_rsvp_by_id(rsvp_id uuid)
returns table (
  id uuid,
  full_name text,
  registration_number text,
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
  select r.id, r.full_name, r.registration_number, r.graduation_year, r.department, r.phone_number, r.email,
         r.attending_status, r.sadhya_status, r.guest_count, r.special_requirements, r.created_at, r.updated_at, r.is_deleted
  from public.rsvps r
  where r.id = rsvp_id and r.is_deleted = false;
end;
$$;

-- 8. Recreate insert_rsvp with registration_number and without sadhya
create or replace function public.insert_rsvp(
  f_name text,
  reg_num text,
  grad_year text,
  dept text,
  phone text,
  mail text,
  attend text,
  reqs text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id uuid;
begin
  insert into public.rsvps (
    full_name,
    registration_number,
    graduation_year,
    department,
    phone_number,
    email,
    attending_status,
    guest_count,
    special_requirements
  ) values (
    f_name,
    reg_num,
    grad_year,
    dept,
    phone,
    nullif(mail, ''),
    attend,
    1, -- guest_count constraint
    nullif(reqs, '')
  )
  returning id into new_id;
  
  return new_id;
end;
$$;

-- 9. Recreate update_rsvp_by_id with registration_number and without sadhya
create or replace function public.update_rsvp_by_id(
  rsvp_id uuid,
  f_name text,
  reg_num text,
  grad_year text,
  dept text,
  phone text,
  mail text,
  attend text,
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
      registration_number = reg_num,
      graduation_year = grad_year,
      department = dept,
      phone_number = phone,
      email = nullif(mail, ''),
      attending_status = attend,
      special_requirements = nullif(reqs, ''),
      updated_at = now()
  where id = rsvp_id and is_deleted = false;
  
  return found;
end;
$$;



