create extension if not exists pgcrypto;

create table if not exists public.boxes (
  id uuid primary key default gen_random_uuid(),
  box_number text unique not null,
  title text,
  origin_room text,
  destination_room text,
  contents text,
  category text,
  priority text default 'Normal' check (priority in ('Low', 'Normal', 'Important', 'Open First', 'Critical')),
  fragile boolean default false,
  status text default 'Planned' check (status in ('Planned', 'Packed', 'Loaded', 'Delivered', 'Unpacked', 'Missing')),
  current_location text,
  notes text,
  photo_path text,
  photo_url text,
  label_printed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.boxes add column if not exists photo_path text;
alter table public.boxes add column if not exists photo_url text;

create index if not exists boxes_box_number_idx on public.boxes (box_number);
create index if not exists boxes_status_idx on public.boxes (status);
create index if not exists boxes_priority_idx on public.boxes (priority);
create index if not exists boxes_destination_room_idx on public.boxes (destination_room);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists boxes_set_updated_at on public.boxes;
create trigger boxes_set_updated_at
before update on public.boxes
for each row execute function public.set_updated_at();

alter table public.boxes enable row level security;

drop policy if exists "Allow anonymous box reads" on public.boxes;
create policy "Allow anonymous box reads"
on public.boxes for select
to anon
using (true);

drop policy if exists "Allow anonymous box inserts" on public.boxes;
create policy "Allow anonymous box inserts"
on public.boxes for insert
to anon
with check (true);

drop policy if exists "Allow anonymous box updates" on public.boxes;
create policy "Allow anonymous box updates"
on public.boxes for update
to anon
using (true)
with check (true);

insert into storage.buckets (id, name, public)
values ('box-photos', 'box-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "Allow anonymous photo reads" on storage.objects;
create policy "Allow anonymous photo reads"
on storage.objects for select
to anon
using (bucket_id = 'box-photos');

drop policy if exists "Allow anonymous photo uploads" on storage.objects;
create policy "Allow anonymous photo uploads"
on storage.objects for insert
to anon
with check (bucket_id = 'box-photos');

drop policy if exists "Allow anonymous photo updates" on storage.objects;
create policy "Allow anonymous photo updates"
on storage.objects for update
to anon
using (bucket_id = 'box-photos')
with check (bucket_id = 'box-photos');
