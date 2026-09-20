-- Adds support for user-created custom journeys alongside the existing curated ones.

alter table journeys add column created_by uuid references auth.users (id) on delete cascade;

drop policy "journeys are publicly readable" on journeys;

create policy "journeys are readable" on journeys
  for select using (is_published = true or created_by = auth.uid());

create policy "users can insert their own custom journeys" on journeys
  for insert with check (created_by = auth.uid() and journey_type = 'custom');

create policy "checkpoints are insertable for own custom journeys" on checkpoints
  for insert with check (
    exists (
      select 1 from journeys j
      where j.id = journey_id
        and j.created_by = auth.uid()
        and j.journey_type = 'custom'
    )
  );
