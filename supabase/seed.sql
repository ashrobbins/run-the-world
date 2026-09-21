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

-- "Did you know?" facts (unlock_content) and landmarks per checkpoint — shown on the
-- checkpoint quick-view modal and the checkpoint-unlocked celebration screen.
-- `unlock_content is null` keeps this safe to re-run without clobbering edits.

update checkpoints set unlock_content = 'Winchester was the ancient capital of England before London took over in the 12th century.' where journey_id = '00000000-0000-0000-0000-000000000001' and name = 'Winchester' and unlock_content is null;
update checkpoints set unlock_content = 'Calais is the closest French port to England — just 34 km across the Channel at its narrowest point.' where journey_id = '00000000-0000-0000-0000-000000000001' and name = 'Calais' and unlock_content is null;
update checkpoints set unlock_content = 'Reims Cathedral has been the coronation site of 25 French kings, starting with Louis VIII in 1223.' where journey_id = '00000000-0000-0000-0000-000000000001' and name = 'Reims' and unlock_content is null;
update checkpoints set unlock_content = 'The Eiffel Tower was originally built as a temporary exhibit for the 1889 World''s Fair — it was almost torn down in 1909.' where journey_id = '00000000-0000-0000-0000-000000000001' and name = 'Paris' and unlock_content is null;
update checkpoints set unlock_content = 'Vienna has been ranked the world''s most liveable city multiple times by the Economist Intelligence Unit.' where journey_id = '00000000-0000-0000-0000-000000000001' and name = 'Vienna' and unlock_content is null;
update checkpoints set unlock_content = 'Istanbul is the only major city in the world that spans two continents — Europe and Asia.' where journey_id = '00000000-0000-0000-0000-000000000001' and name = 'Istanbul' and unlock_content is null;
update checkpoints set unlock_content = 'The Sydney Opera House''s roof is covered in over one million glazed tiles.' where journey_id = '00000000-0000-0000-0000-000000000001' and name = 'Sydney' and unlock_content is null;

insert into checkpoint_landmarks (checkpoint_id, name, icon_key, sequence_number)
select id, v.name, v.icon_key, v.seq from checkpoints c
join (values
  ('Winchester', 'Winchester Cathedral', 'cathedral', 1),
  ('Winchester', 'King Alfred Statue', 'statue', 2),
  ('Calais', 'Calais Lighthouse', 'tower', 1),
  ('Calais', 'Burghers of Calais', 'statue', 2),
  ('Reims', 'Reims Cathedral', 'cathedral', 1),
  ('Reims', 'Palace of Tau', 'castle', 2),
  ('Paris', 'Eiffel Tower', 'tower', 1),
  ('Paris', 'Arc de Triomphe', 'arch', 2),
  ('Paris', 'Louvre Pyramid', 'pyramid', 3),
  ('Vienna', 'Schönbrunn Palace', 'castle', 1),
  ('Vienna', 'St. Stephen''s Cathedral', 'cathedral', 2),
  ('Istanbul', 'Hagia Sophia', 'cathedral', 1),
  ('Istanbul', 'Galata Tower', 'tower', 2),
  ('Istanbul', 'Bosphorus Bridge', 'bridge', 3),
  ('Sydney', 'Sydney Opera House', 'monument', 1),
  ('Sydney', 'Sydney Harbour Bridge', 'bridge', 2)
) as v(cp_name, name, icon_key, seq) on v.cp_name = c.name
where c.journey_id = '00000000-0000-0000-0000-000000000001'
on conflict (checkpoint_id, sequence_number) do nothing;

update checkpoints set unlock_content = 'Route 66 was one of the original U.S. highways, established in 1926, stretching 2,448 miles.' where journey_id = '00000000-0000-0000-0000-000000000002' and name = 'Chicago, IL' and unlock_content is null;
update checkpoints set unlock_content = 'Abraham Lincoln lived in Springfield for over 20 years before becoming president.' where journey_id = '00000000-0000-0000-0000-000000000002' and name = 'Springfield, IL' and unlock_content is null;
update checkpoints set unlock_content = 'The Gateway Arch is the tallest man-made monument in the Western Hemisphere at 630 feet.' where journey_id = '00000000-0000-0000-0000-000000000002' and name = 'St Louis, MO' and unlock_content is null;
update checkpoints set unlock_content = 'Tulsa was once known as the Oil Capital of the World during the early 20th-century oil boom.' where journey_id = '00000000-0000-0000-0000-000000000002' and name = 'Tulsa, OK' and unlock_content is null;
update checkpoints set unlock_content = 'Oklahoma City''s state capitol is the only one in the US with an active oil well on its grounds.' where journey_id = '00000000-0000-0000-0000-000000000002' and name = 'Oklahoma City, OK' and unlock_content is null;
update checkpoints set unlock_content = 'Cadillac Ranch consists of ten Cadillacs buried nose-first in the ground, a public art installation since 1974.' where journey_id = '00000000-0000-0000-0000-000000000002' and name = 'Amarillo, TX' and unlock_content is null;
update checkpoints set unlock_content = 'Flagstaff was the world''s first International Dark Sky City, designated in 2001.' where journey_id = '00000000-0000-0000-0000-000000000002' and name = 'Flagstaff, AZ' and unlock_content is null;
update checkpoints set unlock_content = 'The Santa Monica Pier marks the official western end of the historic Route 66.' where journey_id = '00000000-0000-0000-0000-000000000002' and name = 'Santa Monica, CA' and unlock_content is null;

insert into checkpoint_landmarks (checkpoint_id, name, icon_key, sequence_number)
select id, v.name, v.icon_key, v.seq from checkpoints c
join (values
  ('Chicago, IL', 'Willis Tower', 'tower', 1),
  ('Chicago, IL', 'Cloud Gate', 'statue', 2),
  ('Springfield, IL', 'Lincoln''s Home', 'monument', 1),
  ('St Louis, MO', 'Gateway Arch', 'arch', 1),
  ('Tulsa, OK', 'Golden Driller', 'statue', 1),
  ('Oklahoma City, OK', 'State Capitol', 'monument', 1),
  ('Amarillo, TX', 'Cadillac Ranch', 'monument', 1),
  ('Flagstaff, AZ', 'Lowell Observatory', 'tower', 1),
  ('Flagstaff, AZ', 'San Francisco Peaks', 'mountain', 2),
  ('Santa Monica, CA', 'Santa Monica Pier', 'bridge', 1)
) as v(cp_name, name, icon_key, seq) on v.cp_name = c.name
where c.journey_id = '00000000-0000-0000-0000-000000000002'
on conflict (checkpoint_id, sequence_number) do nothing;

update checkpoints set unlock_content = 'The Great Wall isn''t a single continuous wall — it''s a series of walls built over 2,000 years by different dynasties.' where journey_id = '00000000-0000-0000-0000-000000000003' and name = 'Beijing' and unlock_content is null;
update checkpoints set unlock_content = 'Badaling is the most-visited and best-restored section of the Great Wall, receiving millions of visitors a year.' where journey_id = '00000000-0000-0000-0000-000000000003' and name = 'Badaling' and unlock_content is null;
update checkpoints set unlock_content = 'Mutianyu''s section of the Wall is surrounded by lush forest and is less crowded than Badaling.' where journey_id = '00000000-0000-0000-0000-000000000003' and name = 'Mutianyu' and unlock_content is null;
update checkpoints set unlock_content = 'Jinshanling is known for having some of the best-preserved original Ming-dynasty brickwork on the entire Wall.' where journey_id = '00000000-0000-0000-0000-000000000003' and name = 'Jinshanling' and unlock_content is null;
update checkpoints set unlock_content = 'Simatai is one of the few sections of the Wall open for night visits, lit up after dark.' where journey_id = '00000000-0000-0000-0000-000000000003' and name = 'Simatai' and unlock_content is null;

insert into checkpoint_landmarks (checkpoint_id, name, icon_key, sequence_number)
select id, v.name, v.icon_key, v.seq from checkpoints c
join (values
  ('Beijing', 'Forbidden City', 'castle', 1),
  ('Beijing', 'Temple of Heaven', 'cathedral', 2),
  ('Badaling', 'Badaling Watchtower', 'tower', 1),
  ('Mutianyu', 'Mutianyu Watchtowers', 'tower', 1),
  ('Jinshanling', 'Jinshanling Towers', 'tower', 1),
  ('Simatai', 'Simatai Watchtower', 'castle', 1)
) as v(cp_name, name, icon_key, seq) on v.cp_name = c.name
where c.journey_id = '00000000-0000-0000-0000-000000000003'
on conflict (checkpoint_id, sequence_number) do nothing;

update checkpoints set unlock_content = 'Pilgrims have walked the Camino de Santiago for over 1,000 years, since the 9th century.' where journey_id = '00000000-0000-0000-0000-000000000004' and name = 'Saint-Jean-Pied-de-Port' and unlock_content is null;
update checkpoints set unlock_content = 'Pamplona''s Running of the Bulls (Sanfermines) takes place every July and dates back to the 14th century.' where journey_id = '00000000-0000-0000-0000-000000000004' and name = 'Pamplona' and unlock_content is null;
update checkpoints set unlock_content = 'Burgos Cathedral is a UNESCO World Heritage Site and took over 300 years to complete.' where journey_id = '00000000-0000-0000-0000-000000000004' and name = 'Burgos' and unlock_content is null;
update checkpoints set unlock_content = 'León Cathedral is famous for having more stained glass than almost any other Gothic cathedral in the world.' where journey_id = '00000000-0000-0000-0000-000000000004' and name = 'Leon' and unlock_content is null;
update checkpoints set unlock_content = 'The Knights Templar built the castle at Ponferrada in the 12th century to protect pilgrims on the Camino.' where journey_id = '00000000-0000-0000-0000-000000000004' and name = 'Ponferrada' and unlock_content is null;
update checkpoints set unlock_content = 'Legend holds that the remains of the apostle St. James are buried beneath Santiago Cathedral.' where journey_id = '00000000-0000-0000-0000-000000000004' and name = 'Santiago de Compostela' and unlock_content is null;

insert into checkpoint_landmarks (checkpoint_id, name, icon_key, sequence_number)
select id, v.name, v.icon_key, v.seq from checkpoints c
join (values
  ('Saint-Jean-Pied-de-Port', 'Citadel of Saint-Jean', 'castle', 1),
  ('Pamplona', 'Pamplona Bull Ring', 'monument', 1),
  ('Burgos', 'Burgos Cathedral', 'cathedral', 1),
  ('Leon', 'León Cathedral', 'cathedral', 1),
  ('Ponferrada', 'Templar Castle', 'castle', 1),
  ('Santiago de Compostela', 'Santiago Cathedral', 'cathedral', 1)
) as v(cp_name, name, icon_key, seq) on v.cp_name = c.name
where c.journey_id = '00000000-0000-0000-0000-000000000004'
on conflict (checkpoint_id, sequence_number) do nothing;

update checkpoints set unlock_content = 'Big Ben is actually the name of the bell inside the tower, not the tower itself — officially the Elizabeth Tower.' where journey_id = '00000000-0000-0000-0000-000000000005' and name = 'London' and unlock_content is null;
update checkpoints set unlock_content = 'The White Cliffs of Dover are made of soft chalk deposited over 66 million years ago.' where journey_id = '00000000-0000-0000-0000-000000000005' and name = 'Dover' and unlock_content is null;
update checkpoints set unlock_content = 'On a clear day, you can see the White Cliffs of Dover from the beaches of Calais.' where journey_id = '00000000-0000-0000-0000-000000000005' and name = 'Calais' and unlock_content is null;
update checkpoints set unlock_content = 'Notre-Dame de Paris took nearly 200 years to build, from 1163 to around 1345.' where journey_id = '00000000-0000-0000-0000-000000000005' and name = 'Paris' and unlock_content is null;

insert into checkpoint_landmarks (checkpoint_id, name, icon_key, sequence_number)
select id, v.name, v.icon_key, v.seq from checkpoints c
join (values
  ('London', 'Big Ben', 'tower', 1),
  ('London', 'Tower Bridge', 'bridge', 2),
  ('Dover', 'Dover Castle', 'castle', 1),
  ('Dover', 'The White Cliffs', 'mountain', 2),
  ('Calais', 'Calais Lighthouse', 'tower', 1),
  ('Paris', 'Eiffel Tower', 'tower', 1),
  ('Paris', 'Notre-Dame', 'cathedral', 2)
) as v(cp_name, name, icon_key, seq) on v.cp_name = c.name
where c.journey_id = '00000000-0000-0000-0000-000000000005'
on conflict (checkpoint_id, sequence_number) do nothing;
