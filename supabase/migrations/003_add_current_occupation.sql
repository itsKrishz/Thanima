-- 1. Add current_occupation column to public.rsvps
alter table public.rsvps add column if not exists current_occupation text not null default '';

-- 2. Drop existing functions to avoid return type or argument list mismatch
drop function if exists public.get_rsvp_by_id(uuid);
drop function if exists public.insert_rsvp(text, text, text, text, text, text, text, text);
drop function if exists public.update_rsvp_by_id(uuid, text, text, text, text, text, text, text, text);

-- 3. Recreate get_rsvp_by_id to return current_occupation
create or replace function public.get_rsvp_by_id(rsvp_id uuid)
returns table (
  id uuid,
  full_name text,
  registration_number text,
  graduation_year text,
  department text,
  current_occupation text,
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
  select r.id, r.full_name, r.registration_number, r.graduation_year, r.department, r.current_occupation, r.phone_number, r.email,
         r.attending_status, r.sadhya_status, r.guest_count, r.special_requirements, r.created_at, r.updated_at, r.is_deleted
  from public.rsvps r
  where r.id = rsvp_id and r.is_deleted = false;
end;
$$;

-- 4. Recreate insert_rsvp with current_occupation (curr_occ)
create or replace function public.insert_rsvp(
  f_name text,
  reg_num text,
  grad_year text,
  dept text,
  curr_occ text,
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
    current_occupation,
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
    curr_occ,
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

-- 5. Recreate update_rsvp_by_id with current_occupation (curr_occ)
create or replace function public.update_rsvp_by_id(
  rsvp_id uuid,
  f_name text,
  reg_num text,
  grad_year text,
  dept text,
  curr_occ text,
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
      current_occupation = curr_occ,
      phone_number = phone,
      email = nullif(mail, ''),
      attending_status = attend,
      special_requirements = nullif(reqs, ''),
      updated_at = now()
  where id = rsvp_id and is_deleted = false;
  
  return found;
end;
$$;

-- 6. Revoke public execute rights and grant explicitly to authenticated & anon roles for security
revoke execute on function public.get_rsvp_by_id(uuid) from public;
grant execute on function public.get_rsvp_by_id(uuid) to anon, authenticated;

revoke execute on function public.insert_rsvp(text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.insert_rsvp(text, text, text, text, text, text, text, text, text) to anon, authenticated;

revoke execute on function public.update_rsvp_by_id(uuid, text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.update_rsvp_by_id(uuid, text, text, text, text, text, text, text, text, text) to anon, authenticated;
