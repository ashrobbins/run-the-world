-- Phase 1 seed data: one curated journey with checkpoints, matching the design mockups.
-- user_journeys / activities rows are created at runtime once a real user signs up and
-- starts this journey — there's no fake auth.users row seeded here.

insert into journeys (
  id, name, description, journey_type,
  start_name, start_lat, start_lng,
  destination_name, destination_lat, destination_lng,
  total_distance, is_published
) values (
  '00000000-0000-0000-0000-000000000001',
  'Winchester → Sydney',
  'The Classic Crossing — through Western Europe and the Middle East, all the way to Sydney.',
  'curated',
  'Winchester', 51.0632, -1.3080,
  'Sydney', -33.8688, 151.2093,
  12436, true
);

insert into checkpoints (
  journey_id, name, country_code, sequence_number, distance_from_start, lat, lng, description
) values
  ('00000000-0000-0000-0000-000000000001', 'Winchester', 'uk',        1, 0,     51.0632, -1.3080, 'The start of the journey.'),
  ('00000000-0000-0000-0000-000000000001', 'Calais',     'france',    2, 184,   50.9513,  1.8587, 'Crossing into mainland Europe.'),
  ('00000000-0000-0000-0000-000000000001', 'Reims',      'france',    3, 309,   49.2583,  4.0317, 'Home of the cathedral where French kings were crowned.'),
  ('00000000-0000-0000-0000-000000000001', 'Paris',      'france',    4, 523,   48.8566,  2.3522, 'The Eiffel Tower, Arc de Triomphe, and the Louvre.'),
  ('00000000-0000-0000-0000-000000000001', 'Vienna',     'austria',   5, 1562,  48.2082, 16.3738, 'The imperial capital of Austria.'),
  ('00000000-0000-0000-0000-000000000001', 'Istanbul',   'turkey',    6, 2340,  41.0082, 28.9784, 'Where Europe meets Asia.'),
  ('00000000-0000-0000-0000-000000000001', 'Sydney',     'australia', 7, 12436, -33.8688, 151.2093, 'Journey''s end.');
