-- Run the World — initial schema (Phase 1)
-- Auth is handled by Supabase Auth (auth.users). We only add app-specific tables.

create extension if not exists "pgcrypto";

-- Per-user app preferences, keyed to the Supabase Auth user.
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  unit_preference text not null default 'km' check (unit_preference in ('km', 'mi')),
  created_at timestamptz not null default now()
);

-- One row per user's connected Strava account. Tokens are written/read only by the
-- service-role client (never exposed to the browser) — see lib/supabase/admin.ts.
create table strava_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  strava_athlete_id bigint not null,
  access_token text not null,
  refresh_token text not null,
  token_expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

-- Curated or custom journeys. Publicly readable; not user-scoped.
create table journeys (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  journey_type text not null default 'curated' check (journey_type in ('curated', 'custom')),
  start_name text not null,
  start_lat double precision not null,
  start_lng double precision not null,
  destination_name text not null,
  destination_lat double precision not null,
  destination_lng double precision not null,
  total_distance double precision not null, -- km
  route_geometry jsonb, -- GeoJSON LineString, nullable until real routing exists
  image_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Ordered checkpoints along a journey's route.
create table checkpoints (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references journeys (id) on delete cascade,
  name text not null,
  country_code text not null, -- drives CheckpointMarker's flag rendering
  sequence_number int not null,
  distance_from_start double precision not null, -- km
  lat double precision not null,
  lng double precision not null,
  description text,
  image_url text,
  unlock_content text,
  created_at timestamptz not null default now(),
  unique (journey_id, sequence_number)
);

-- A user's progress through a specific journey.
create table user_journeys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  journey_id uuid not null references journeys (id) on delete cascade,
  distance_completed double precision not null default 0, -- km
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'active' check (status in ('active', 'completed', 'abandoned')),
  created_at timestamptz not null default now(),
  unique (user_id, journey_id)
);

-- Derived-only record of each counted Strava activity. Deliberately has NO raw-payload
-- column — the import pipeline discards the raw Strava response after mapping these
-- fields out of it. strava_activity_id is retained indefinitely as a dedup/mapping key
-- and to let us act on Strava delete/update webhooks later.
create table activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  strava_activity_id bigint not null,
  activity_type text not null,
  distance double precision not null, -- km
  activity_date timestamptz not null,
  counted_for_progress boolean not null default true,
  created_at timestamptz not null default now(),
  unique (user_id, strava_activity_id)
);

create index activities_user_id_activity_date_idx on activities (user_id, activity_date desc);
create index checkpoints_journey_id_sequence_idx on checkpoints (journey_id, sequence_number);

-- Row Level Security: every user-scoped table only exposes a user's own rows.
alter table profiles enable row level security;
alter table strava_connections enable row level security;
alter table user_journeys enable row level security;
alter table activities enable row level security;
alter table journeys enable row level security;
alter table checkpoints enable row level security;

create policy "profiles are self-readable" on profiles
  for select using (auth.uid() = id);
create policy "profiles are self-writable" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "strava_connections are self-readable" on strava_connections
  for select using (auth.uid() = user_id);
create policy "strava_connections are self-writable" on strava_connections
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "user_journeys are self-readable" on user_journeys
  for select using (auth.uid() = user_id);
create policy "user_journeys are self-writable" on user_journeys
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "activities are self-readable" on activities
  for select using (auth.uid() = user_id);
create policy "activities are self-writable" on activities
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "journeys are publicly readable" on journeys
  for select using (is_published = true);

create policy "checkpoints are publicly readable" on checkpoints
  for select using (true);

-- Keep strava_connections.updated_at current on token refresh.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger strava_connections_set_updated_at
  before update on strava_connections
  for each row execute function set_updated_at();

-- Auto-create a profile row when a new auth user signs up.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
