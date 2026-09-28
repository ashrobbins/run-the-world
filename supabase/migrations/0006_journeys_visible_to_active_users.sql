-- An unpublished curated journey (e.g. one retired from the "New Journey" library)
-- was becoming completely unreadable via RLS for users still actively on it, since
-- the read policy only allowed is_published = true or created_by = auth.uid(). That
-- broke Home/journey-detail for anyone with an active user_journeys row pointing at
-- a since-unpublished journey. Also allow a read when the requesting user has an
-- active user_journeys row referencing the journey.

drop policy "journeys are readable" on journeys;

create policy "journeys are readable" on journeys
  for select using (
    is_published = true
    or created_by = auth.uid()
    or exists (
      select 1 from user_journeys uj
      where uj.journey_id = journeys.id and uj.user_id = auth.uid()
    )
  );
