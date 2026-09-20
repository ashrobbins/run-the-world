-- Phase 1+ seed data: curated journeys with checkpoints, matching the design mockups.
-- user_journeys / activities rows are created at runtime once a real user signs up and
-- starts a journey — there's no fake auth.users row seeded here.
--
-- Every insert here uses a fixed id and `on conflict do nothing`, so re-running this
-- file against a database that already has some of these rows (e.g. after adding new
-- curated journeys) is safe.

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
) on conflict (id) do nothing;

insert into checkpoints (
  journey_id, name, country_code, sequence_number, distance_from_start, lat, lng, description
) values
  ('00000000-0000-0000-0000-000000000001', 'Winchester', 'uk',        1, 0,     51.0632, -1.3080, 'The start of the journey.'),
  ('00000000-0000-0000-0000-000000000001', 'Calais',     'france',    2, 184,   50.9513,  1.8587, 'Crossing into mainland Europe.'),
  ('00000000-0000-0000-0000-000000000001', 'Reims',      'france',    3, 309,   49.2583,  4.0317, 'Home of the cathedral where French kings were crowned.'),
  ('00000000-0000-0000-0000-000000000001', 'Paris',      'france',    4, 523,   48.8566,  2.3522, 'The Eiffel Tower, Arc de Triomphe, and the Louvre.'),
  ('00000000-0000-0000-0000-000000000001', 'Vienna',     'austria',   5, 1562,  48.2082, 16.3738, 'The imperial capital of Austria.'),
  ('00000000-0000-0000-0000-000000000001', 'Istanbul',   'turkey',    6, 2340,  41.0082, 28.9784, 'Where Europe meets Asia.'),
  ('00000000-0000-0000-0000-000000000001', 'Sydney',     'australia', 7, 12436, -33.8688, 151.2093, 'Journey''s end.')
on conflict (journey_id, sequence_number) do nothing;

-- Route 66: Chicago -> Santa Monica
insert into journeys (
  id, name, description, journey_type,
  start_name, start_lat, start_lng,
  destination_name, destination_lat, destination_lng,
  total_distance, is_published
) values (
  '00000000-0000-0000-0000-000000000002',
  'Route 66',
  'Chicago to Santa Monica along America''s most storied highway.',
  'curated',
  'Chicago', 41.8781, -87.6298,
  'Santa Monica', 34.0195, -118.4912,
  3940, true
) on conflict (id) do nothing;

insert into checkpoints (
  journey_id, name, country_code, sequence_number, distance_from_start, lat, lng, description
) values
  ('00000000-0000-0000-0000-000000000002', 'Chicago, IL',       'usa', 1, 0,    41.8781, -87.6298,  'The start of the Mother Road.'),
  ('00000000-0000-0000-0000-000000000002', 'Springfield, IL',   'usa', 2, 300,  39.7817, -89.6501,  'Home of Abraham Lincoln.'),
  ('00000000-0000-0000-0000-000000000002', 'St Louis, MO',      'usa', 3, 460,  38.6270, -90.1994,  'Gateway to the West.'),
  ('00000000-0000-0000-0000-000000000002', 'Tulsa, OK',         'usa', 4, 830,  36.1540, -95.9928,  'The Oil Capital of the World.'),
  ('00000000-0000-0000-0000-000000000002', 'Oklahoma City, OK', 'usa', 5, 960,  35.4676, -97.5164,  'The heart of Oklahoma.'),
  ('00000000-0000-0000-0000-000000000002', 'Amarillo, TX',      'usa', 6, 1300, 35.2220, -101.8313, 'Home of the Cadillac Ranch.'),
  ('00000000-0000-0000-0000-000000000002', 'Flagstaff, AZ',     'usa', 7, 2200, 35.1983, -111.6513, 'Gateway to the Grand Canyon.'),
  ('00000000-0000-0000-0000-000000000002', 'Santa Monica, CA',  'usa', 8, 3940, 34.0195, -118.4912, 'The end of the trail.')
on conflict (journey_id, sequence_number) do nothing;

-- Great Wall of China: Beijing -> Simatai
insert into journeys (
  id, name, description, journey_type,
  start_name, start_lat, start_lng,
  destination_name, destination_lat, destination_lng,
  total_distance, is_published
) values (
  '00000000-0000-0000-0000-000000000003',
  'Great Wall of China',
  'A tour along five of the Wall''s most iconic sections.',
  'curated',
  'Beijing', 40.4319, 116.5704,
  'Simatai', 40.6547, 117.2431,
  220, true
) on conflict (id) do nothing;

insert into checkpoints (
  journey_id, name, country_code, sequence_number, distance_from_start, lat, lng, description
) values
  ('00000000-0000-0000-0000-000000000003', 'Beijing',      'china', 1, 0,   40.4319, 116.5704, 'The start, near the capital.'),
  ('00000000-0000-0000-0000-000000000003', 'Badaling',     'china', 2, 70,  40.3584, 116.0138, 'The most-visited section of the Wall.'),
  ('00000000-0000-0000-0000-000000000003', 'Mutianyu',     'china', 3, 120, 40.4319, 116.5704, 'Known for its watchtowers and forested setting.'),
  ('00000000-0000-0000-0000-000000000003', 'Jinshanling',  'china', 4, 170, 40.6547, 117.1994, 'A wilder, less-restored stretch of the Wall.'),
  ('00000000-0000-0000-0000-000000000003', 'Simatai',      'china', 5, 220, 40.6547, 117.2431, 'The final, steepest section.')
on conflict (journey_id, sequence_number) do nothing;

-- Camino de Santiago: Saint-Jean-Pied-de-Port -> Santiago de Compostela
insert into journeys (
  id, name, description, journey_type,
  start_name, start_lat, start_lng,
  destination_name, destination_lat, destination_lng,
  total_distance, is_published
) values (
  '00000000-0000-0000-0000-000000000004',
  'Camino de Santiago',
  'The classic French Way pilgrimage route across northern Spain.',
  'curated',
  'Saint-Jean-Pied-de-Port', 43.1633, -1.2377,
  'Santiago de Compostela', 42.8805, -8.5456,
  780, true
) on conflict (id) do nothing;

insert into checkpoints (
  journey_id, name, country_code, sequence_number, distance_from_start, lat, lng, description
) values
  ('00000000-0000-0000-0000-000000000004', 'Saint-Jean-Pied-de-Port', 'france', 1, 0,   43.1633, -1.2377, 'The traditional starting point.'),
  ('00000000-0000-0000-0000-000000000004', 'Pamplona',                'spain',  2, 70,  42.8125, -1.6458, 'Famous for the Running of the Bulls.'),
  ('00000000-0000-0000-0000-000000000004', 'Burgos',                  'spain',  3, 280, 42.3439, -3.6969, 'Home to a stunning Gothic cathedral.'),
  ('00000000-0000-0000-0000-000000000004', 'Leon',                    'spain',  4, 450, 42.5987, -5.5671, 'A major stop on the Meseta crossing.'),
  ('00000000-0000-0000-0000-000000000004', 'Ponferrada',              'spain',  5, 560, 42.5464, -6.5964, 'Home to the Templar Castle.'),
  ('00000000-0000-0000-0000-000000000004', 'Santiago de Compostela',  'spain',  6, 780, 42.8805, -8.5456, 'Journey''s end at the cathedral.')
on conflict (journey_id, sequence_number) do nothing;

-- London -> Paris: a weekend-sized adventure
insert into journeys (
  id, name, description, journey_type,
  start_name, start_lat, start_lng,
  destination_name, destination_lat, destination_lng,
  total_distance, is_published
) values (
  '00000000-0000-0000-0000-000000000005',
  'London → Paris',
  'A weekend-sized adventure across the Channel.',
  'curated',
  'London', 51.5074, -0.1278,
  'Paris', 48.8566, 2.3522,
  460, true
) on conflict (id) do nothing;

insert into checkpoints (
  journey_id, name, country_code, sequence_number, distance_from_start, lat, lng, description
) values
  ('00000000-0000-0000-0000-000000000005', 'London',  'uk',     1, 0,   51.5074, -0.1278, 'The start of the adventure.'),
  ('00000000-0000-0000-0000-000000000005', 'Dover',   'uk',     2, 120, 51.1279,  1.3134, 'The White Cliffs, and the Channel crossing.'),
  ('00000000-0000-0000-0000-000000000005', 'Calais',  'france', 3, 140, 50.9513,  1.8587, 'Arriving in mainland Europe.'),
  ('00000000-0000-0000-0000-000000000005', 'Paris',   'france', 4, 460, 48.8566,  2.3522, 'Journey''s end at the Eiffel Tower.')
on conflict (journey_id, sequence_number) do nothing;
