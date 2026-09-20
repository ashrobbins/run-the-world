-- Allow users to delete their own custom journeys (checkpoints + user_journeys
-- cascade via the existing FKs). Curated journeys are never deletable this way
-- since created_by is null for them and this policy requires a match.
create policy "users can delete their own custom journeys" on journeys
  for delete using (created_by = auth.uid() and journey_type = 'custom');
