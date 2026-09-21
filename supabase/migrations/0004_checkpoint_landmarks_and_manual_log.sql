-- Landmarks shown on a checkpoint's stamp modal / unlocked celebration screen.
create table checkpoint_landmarks (
  id uuid primary key default gen_random_uuid(),
  checkpoint_id uuid not null references checkpoints (id) on delete cascade,
  name text not null,
  icon_key text not null,
  sequence_number int not null,
  unique (checkpoint_id, sequence_number)
);

alter table checkpoint_landmarks enable row level security;

create policy "checkpoint_landmarks are publicly readable" on checkpoint_landmarks
  for select using (true);

create index checkpoint_landmarks_checkpoint_id_idx on checkpoint_landmarks (checkpoint_id, sequence_number);

-- Manual run logging: activities no longer require a Strava activity id.
alter table activities add column source text not null default 'strava' check (source in ('strava', 'manual'));
alter table activities alter column strava_activity_id drop not null;
