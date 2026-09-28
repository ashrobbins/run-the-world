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

-- The 92 Club: a ground-hopping tour of every club across the top four English
-- divisions (Premier League, Championship, League One, League Two).
insert into journeys (
  id, name, description, journey_type,
  start_name, start_lat, start_lng,
  destination_name, destination_lat, destination_lng,
  total_distance, is_published
) values (
  '00000000-0000-0000-0000-000000000006',
  'The 92 Club',
  'A ground-hopping tour of all 92 clubs across the Premier League, Championship, League One, and League Two.',
  'curated',
  'Plymouth Argyle', 50.380346, -4.168399,
  'Swansea City', 51.619596, -3.945925,
  2914.5, true
) on conflict (id) do nothing;

insert into checkpoints (
  journey_id, name, country_code, sequence_number, distance_from_start, lat, lng, description
) values
  ('00000000-0000-0000-0000-000000000006', 'Plymouth Argyle', 'uk', 1, 0, 50.380346, -4.168399, 'Home of Plymouth Argyle — Home Park.'),
  ('00000000-0000-0000-0000-000000000006', 'Exeter City', 'uk', 2, 59.1, 50.7266, -3.5334, 'Home of Exeter City — St James Park.'),
  ('00000000-0000-0000-0000-000000000006', 'Cardiff City', 'uk', 3, 147.6, 51.488858, -3.168129, 'Home of Cardiff City — Cardiff City Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Newport County', 'uk', 4, 164.2, 51.588548, -2.989782, 'Home of Newport County — Rodney Parade.'),
  ('00000000-0000-0000-0000-000000000006', 'Bristol Rovers', 'uk', 5, 193.6, 51.484253, -2.59953, 'Home of Bristol Rovers — Memorial Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Bristol City', 'uk', 6, 198.4, 51.44214, -2.613509, 'Home of Bristol City — Ashton Gate.'),
  ('00000000-0000-0000-0000-000000000006', 'Swindon Town', 'uk', 7, 258.1, 51.566264, -1.773482, 'Home of Swindon Town — County Ground.'),
  ('00000000-0000-0000-0000-000000000006', 'Oxford United', 'uk', 8, 299.3, 51.75355, -1.258646, 'Home of Oxford United — Kassam Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Wycombe Wanderers', 'uk', 9, 336.9, 51.629547, -0.751436, 'Home of Wycombe Wanderers — Adams Park.'),
  ('00000000-0000-0000-0000-000000000006', 'Watford', 'uk', 10, 360.9, 51.649516, -0.40509, 'Home of Watford — Vicarage Road.'),
  ('00000000-0000-0000-0000-000000000006', 'Barnet', 'uk', 11, 370.5, 51.6117, -0.2802, 'Home of Barnet — The Hive Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Queens Park Rangers', 'uk', 12, 382.5, 51.508096, -0.230514, 'Home of Queens Park Rangers — Loftus Road.'),
  ('00000000-0000-0000-0000-000000000006', 'Fulham', 'uk', 13, 386.2, 51.475, -0.2217, 'Home of Fulham — Craven Cottage.'),
  ('00000000-0000-0000-0000-000000000006', 'Chelsea', 'uk', 14, 388.5, 51.4816, -0.191, 'Home of Chelsea — Stamford Bridge.'),
  ('00000000-0000-0000-0000-000000000006', 'Brentford', 'uk', 15, 395.3, 51.4906, -0.2886, 'Home of Brentford — Gtech Community Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Arsenal', 'uk', 16, 409.7, 51.5549, -0.1084, 'Home of Arsenal — Emirates Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Tottenham Hotspur', 'uk', 17, 415.9, 51.6043, -0.0662, 'Home of Tottenham Hotspur — Tottenham Hotspur Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Leyton Orient', 'uk', 18, 422.1, 51.560029, -0.011387, 'Home of Leyton Orient — Brisbane Road.'),
  ('00000000-0000-0000-0000-000000000006', 'West Ham United', 'uk', 19, 424.5, 51.5386, -0.0166, 'Home of West Ham United — London Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Millwall', 'uk', 20, 430.8, 51.4864, -0.0508, 'Home of Millwall — The Den.'),
  ('00000000-0000-0000-0000-000000000006', 'AFC Wimbledon', 'uk', 21, 435.2, 51.449799, -0.073757, 'Home of AFC Wimbledon — Plough Lane.'),
  ('00000000-0000-0000-0000-000000000006', 'Crystal Palace', 'uk', 22, 440.9, 51.3983, -0.0855, 'Home of Crystal Palace — Selhurst Park.'),
  ('00000000-0000-0000-0000-000000000006', 'Bromley', 'uk', 23, 448.2, 51.387547, 0.017514, 'Home of Bromley — Hayes Lane.'),
  ('00000000-0000-0000-0000-000000000006', 'Charlton Athletic', 'uk', 24, 459.2, 51.4861, 0.0362, 'Home of Charlton Athletic — The Valley.'),
  ('00000000-0000-0000-0000-000000000006', 'Gillingham', 'uk', 25, 497.1, 51.38508, 0.558206, 'Home of Gillingham — Priestfield Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Colchester United', 'uk', 26, 557.2, 51.87836, 0.915004, 'Home of Colchester United — Weston Homes Community Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Ipswich Town', 'uk', 27, 582.4, 52.055, 1.1447, 'Home of Ipswich Town — Portman Road.'),
  ('00000000-0000-0000-0000-000000000006', 'Norwich City', 'uk', 28, 646.7, 52.623797, 1.31406, 'Home of Norwich City — Carrow Road.'),
  ('00000000-0000-0000-0000-000000000006', 'Cambridge United', 'uk', 29, 737.6, 52.2058, 0.1614, 'Home of Cambridge United — Abbey Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Stevenage', 'uk', 30, 779.6, 51.901363, -0.202337, 'Home of Stevenage — Lamex Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Luton Town', 'uk', 31, 795.4, 51.884022, -0.429791, 'Home of Luton Town — Kenilworth Road.'),
  ('00000000-0000-0000-0000-000000000006', 'Milton Keynes Dons', 'uk', 32, 824, 52.043182, -0.757416, 'Home of Milton Keynes Dons — Stadium MK.'),
  ('00000000-0000-0000-0000-000000000006', 'Northampton Town', 'uk', 33, 847.6, 52.238144, -0.895914, 'Home of Northampton Town — Sixfields Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Coventry City', 'uk', 34, 894.5, 52.4483, -1.4952, 'Home of Coventry City — Coventry Building Society Arena.'),
  ('00000000-0000-0000-0000-000000000006', 'Birmingham City', 'uk', 35, 920.3, 52.476645, -1.872329, 'Home of Birmingham City — St Andrew''s.'),
  ('00000000-0000-0000-0000-000000000006', 'Aston Villa', 'uk', 36, 924, 52.5092, -1.8848, 'Home of Aston Villa — Villa Park.'),
  ('00000000-0000-0000-0000-000000000006', 'West Bromwich Albion', 'uk', 37, 933.4, 52.536909, -2.016442, 'Home of West Bromwich Albion — The Hawthorns.'),
  ('00000000-0000-0000-0000-000000000006', 'Walsall', 'uk', 38, 937.3, 52.57026, -1.998986, 'Home of Walsall — Bescot Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Wolverhampton Wanderers', 'uk', 39, 946.4, 52.591035, -2.12843, 'Home of Wolverhampton Wanderers — Molineux Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Burton Albion', 'uk', 40, 987.3, 52.80316, -1.631388, 'Home of Burton Albion — Pirelli Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Derby County', 'uk', 41, 1004.3, 52.91205, -1.453314, 'Home of Derby County — Pride Park Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Notts County', 'uk', 42, 1026, 52.937, -1.1333, 'Home of Notts County — Meadow Lane.'),
  ('00000000-0000-0000-0000-000000000006', 'Nottingham Forest', 'uk', 43, 1026.3, 52.9399, -1.1327, 'Home of Nottingham Forest — City Ground.'),
  ('00000000-0000-0000-0000-000000000006', 'Mansfield Town', 'uk', 44, 1049.4, 53.14438, -1.196964, 'Home of Mansfield Town — One Call Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Chesterfield', 'uk', 45, 1067.9, 53.23586, -1.427393, 'Home of Chesterfield — SMH Group Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Sheffield United', 'uk', 46, 1082.9, 53.368754, -1.471667, 'Home of Sheffield United — Bramall Lane.'),
  ('00000000-0000-0000-0000-000000000006', 'Sheffield Wednesday', 'uk', 47, 1087.4, 53.404125, -1.503411, 'Home of Sheffield Wednesday — Hillsborough Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Rotherham United', 'uk', 48, 1097.1, 53.428976, -1.362403, 'Home of Rotherham United — New York Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Barnsley', 'uk', 49, 1112.5, 53.54927, -1.475716, 'Home of Barnsley — Oakwell.'),
  ('00000000-0000-0000-0000-000000000006', 'Huddersfield Town', 'uk', 50, 1135.4, 53.6464, -1.78202, 'Home of Huddersfield Town — Accu Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Bradford City', 'uk', 51, 1152.9, 53.803732, -1.76029, 'Home of Bradford City — Valley Parade.'),
  ('00000000-0000-0000-0000-000000000006', 'Leeds United', 'uk', 52, 1165.6, 53.7778, -1.572, 'Home of Leeds United — Elland Road.'),
  ('00000000-0000-0000-0000-000000000006', 'York City', 'uk', 53, 1203.6, 53.959526, -1.081793, 'Home of York City — LNER Community Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Doncaster Rovers', 'uk', 54, 1252.2, 53.5228, -1.1017, 'Home of Doncaster Rovers — Eco-Power Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Lincoln City', 'uk', 55, 1302.2, 53.221762, -0.540476, 'Home of Lincoln City — Sincil Bank.'),
  ('00000000-0000-0000-0000-000000000006', 'Grimsby Town', 'uk', 56, 1352.9, 53.56031, -0.028589, 'Home of Grimsby Town — Blundell Park.'),
  ('00000000-0000-0000-0000-000000000006', 'Hull City', 'uk', 57, 1383.3, 53.7461, -0.3671, 'Home of Hull City — MKM Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Middlesbrough', 'uk', 58, 1492.2, 54.599574, -1.186718, 'Home of Middlesbrough — Riverside Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Sunderland', 'uk', 59, 1529.5, 54.9144, -1.3883, 'Home of Sunderland — Stadium of Light.'),
  ('00000000-0000-0000-0000-000000000006', 'Newcastle United', 'uk', 60, 1545.9, 54.9756, -1.6217, 'Home of Newcastle United — St James'' Park.'),
  ('00000000-0000-0000-0000-000000000006', 'Burnley', 'uk', 61, 1683.8, 53.788668, -2.236437, 'Home of Burnley — Turf Moor.'),
  ('00000000-0000-0000-0000-000000000006', 'Accrington Stanley', 'uk', 62, 1693.1, 53.752964, -2.365044, 'Home of Accrington Stanley — Wham Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Blackburn Rovers', 'uk', 63, 1701.8, 53.7288, -2.491352, 'Home of Blackburn Rovers — Ewood Park.'),
  ('00000000-0000-0000-0000-000000000006', 'Preston North End', 'uk', 64, 1715.8, 53.77407, -2.689936, 'Home of Preston North End — Deepdale.'),
  ('00000000-0000-0000-0000-000000000006', 'Blackpool', 'uk', 65, 1739.2, 53.804309, -3.042006, 'Home of Blackpool — Bloomfield Road.'),
  ('00000000-0000-0000-0000-000000000006', 'Fleetwood Town', 'uk', 66, 1751.8, 53.916899, -3.027022, 'Home of Fleetwood Town — Highbury Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Wigan Athletic', 'uk', 67, 1800.5, 53.54607, -2.631824, 'Home of Wigan Athletic — DW Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Bolton Wanderers', 'uk', 68, 1814.4, 53.578987, -2.428225, 'Home of Bolton Wanderers — Toughsheet Community Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Salford City', 'uk', 69, 1826.7, 53.513739, -2.279341, 'Home of Salford City — Moor Lane.'),
  ('00000000-0000-0000-0000-000000000006', 'Manchester United', 'uk', 70, 1832.3, 53.4631, -2.2913, 'Home of Manchester United — Old Trafford.'),
  ('00000000-0000-0000-0000-000000000006', 'Manchester City', 'uk', 71, 1838.8, 53.4831, -2.2004, 'Home of Manchester City — Etihad Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Oldham Athletic', 'uk', 72, 1847.9, 53.553999, -2.13069, 'Home of Oldham Athletic — Boundary Park.'),
  ('00000000-0000-0000-0000-000000000006', 'Rochdale', 'uk', 73, 1853.7, 53.605851, -2.144662, 'Home of Rochdale — Crown Oil Arena.'),
  ('00000000-0000-0000-0000-000000000006', 'Stockport County', 'uk', 74, 1876.6, 53.40104, -2.169646, 'Home of Stockport County — Edgeley Park.'),
  ('00000000-0000-0000-0000-000000000006', 'Crewe Alexandra', 'uk', 75, 1915, 53.097829, -2.445733, 'Home of Crewe Alexandra — Mornflake Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Port Vale', 'uk', 76, 1932.6, 53.05, -2.1936, 'Home of Port Vale — Vale Park.'),
  ('00000000-0000-0000-0000-000000000006', 'Stoke City', 'uk', 77, 1934.3, 53.034766, -2.189182, 'Home of Stoke City — bet365 Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Shrewsbury Town', 'uk', 78, 1988.2, 52.6892, -2.7513, 'Home of Shrewsbury Town — Croud Meadow.'),
  ('00000000-0000-0000-0000-000000000006', 'Wrexham', 'uk', 79, 2031.2, 53.0453, -3.0002, 'Home of Wrexham — Racecourse Ground.'),
  ('00000000-0000-0000-0000-000000000006', 'Tranmere Rovers', 'uk', 80, 2068, 53.375396, -3.034846, 'Home of Tranmere Rovers — Prenton Park.'),
  ('00000000-0000-0000-0000-000000000006', 'Liverpool', 'uk', 81, 2075.8, 53.4308, -2.9608, 'Home of Liverpool — Anfield.'),
  ('00000000-0000-0000-0000-000000000006', 'Everton', 'uk', 82, 2078.7, 53.4478, -2.9925, 'Home of Everton — Everton Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Leicester City', 'uk', 83, 2230.5, 52.654876, -1.142562, 'Home of Leicester City — King Power Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Peterborough United', 'uk', 84, 2292, 52.549171, -0.249502, 'Home of Peterborough United — London Road.'),
  ('00000000-0000-0000-0000-000000000006', 'Reading', 'uk', 85, 2423.2, 51.455647, -0.972165, 'Home of Reading — Select Car Leasing Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Crawley Town', 'uk', 86, 2490.9, 51.0956, -0.1874, 'Home of Crawley Town — Broadfield Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Brighton & Hove Albion', 'uk', 87, 2517.9, 50.8617, -0.0837, 'Home of Brighton & Hove Albion — Amex Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Portsmouth', 'uk', 88, 2588, 50.79816, -1.07687, 'Home of Portsmouth — Fratton Park.'),
  ('00000000-0000-0000-0000-000000000006', 'Southampton', 'uk', 89, 2613.5, 50.905315, -1.39774, 'Home of Southampton — St Mary''s Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'AFC Bournemouth', 'uk', 90, 2649.8, 50.7352, -1.8387, 'Home of AFC Bournemouth — Vitality Stadium.'),
  ('00000000-0000-0000-0000-000000000006', 'Cheltenham Town', 'uk', 91, 2780.7, 51.904506, -2.057559, 'Home of Cheltenham Town — Whaddon Road.'),
  ('00000000-0000-0000-0000-000000000006', 'Swansea City', 'uk', 92, 2914.5, 51.619596, -3.945925, 'Home of Swansea City — Swansea.com Stadium.')
on conflict (journey_id, sequence_number) do nothing;

-- Unpublish the retired curated journeys (kept in the table — not deleted — so any
-- existing user progress against them is preserved).
update journeys set is_published = false where id in (
  '00000000-0000-0000-0000-000000000001', -- Winchester -> Sydney
  '00000000-0000-0000-0000-000000000004'  -- Camino de Santiago
);

-- The 92 Club: each checkpoint's landmark is its own stadium.
insert into checkpoint_landmarks (checkpoint_id, name, icon_key, sequence_number)
select id, v.name, v.icon_key, v.seq from checkpoints c
join (values
  ('Plymouth Argyle', 'Home Park', 'stadium', 1),
  ('Exeter City', 'St James Park', 'stadium', 1),
  ('Cardiff City', 'Cardiff City Stadium', 'stadium', 1),
  ('Newport County', 'Rodney Parade', 'stadium', 1),
  ('Bristol Rovers', 'Memorial Stadium', 'stadium', 1),
  ('Bristol City', 'Ashton Gate', 'stadium', 1),
  ('Swindon Town', 'County Ground', 'stadium', 1),
  ('Oxford United', 'Kassam Stadium', 'stadium', 1),
  ('Wycombe Wanderers', 'Adams Park', 'stadium', 1),
  ('Watford', 'Vicarage Road', 'stadium', 1),
  ('Barnet', 'The Hive Stadium', 'stadium', 1),
  ('Queens Park Rangers', 'Loftus Road', 'stadium', 1),
  ('Fulham', 'Craven Cottage', 'stadium', 1),
  ('Chelsea', 'Stamford Bridge', 'stadium', 1),
  ('Brentford', 'Gtech Community Stadium', 'stadium', 1),
  ('Arsenal', 'Emirates Stadium', 'stadium', 1),
  ('Tottenham Hotspur', 'Tottenham Hotspur Stadium', 'stadium', 1),
  ('Leyton Orient', 'Brisbane Road', 'stadium', 1),
  ('West Ham United', 'London Stadium', 'stadium', 1),
  ('Millwall', 'The Den', 'stadium', 1),
  ('AFC Wimbledon', 'Plough Lane', 'stadium', 1),
  ('Crystal Palace', 'Selhurst Park', 'stadium', 1),
  ('Bromley', 'Hayes Lane', 'stadium', 1),
  ('Charlton Athletic', 'The Valley', 'stadium', 1),
  ('Gillingham', 'Priestfield Stadium', 'stadium', 1),
  ('Colchester United', 'Weston Homes Community Stadium', 'stadium', 1),
  ('Ipswich Town', 'Portman Road', 'stadium', 1),
  ('Norwich City', 'Carrow Road', 'stadium', 1),
  ('Cambridge United', 'Abbey Stadium', 'stadium', 1),
  ('Stevenage', 'Lamex Stadium', 'stadium', 1),
  ('Luton Town', 'Kenilworth Road', 'stadium', 1),
  ('Milton Keynes Dons', 'Stadium MK', 'stadium', 1),
  ('Northampton Town', 'Sixfields Stadium', 'stadium', 1),
  ('Coventry City', 'Coventry Building Society Arena', 'stadium', 1),
  ('Birmingham City', 'St Andrew''s', 'stadium', 1),
  ('Aston Villa', 'Villa Park', 'stadium', 1),
  ('West Bromwich Albion', 'The Hawthorns', 'stadium', 1),
  ('Walsall', 'Bescot Stadium', 'stadium', 1),
  ('Wolverhampton Wanderers', 'Molineux Stadium', 'stadium', 1),
  ('Burton Albion', 'Pirelli Stadium', 'stadium', 1),
  ('Derby County', 'Pride Park Stadium', 'stadium', 1),
  ('Notts County', 'Meadow Lane', 'stadium', 1),
  ('Nottingham Forest', 'City Ground', 'stadium', 1),
  ('Mansfield Town', 'One Call Stadium', 'stadium', 1),
  ('Chesterfield', 'SMH Group Stadium', 'stadium', 1),
  ('Sheffield United', 'Bramall Lane', 'stadium', 1),
  ('Sheffield Wednesday', 'Hillsborough Stadium', 'stadium', 1),
  ('Rotherham United', 'New York Stadium', 'stadium', 1),
  ('Barnsley', 'Oakwell', 'stadium', 1),
  ('Huddersfield Town', 'Accu Stadium', 'stadium', 1),
  ('Bradford City', 'Valley Parade', 'stadium', 1),
  ('Leeds United', 'Elland Road', 'stadium', 1),
  ('York City', 'LNER Community Stadium', 'stadium', 1),
  ('Doncaster Rovers', 'Eco-Power Stadium', 'stadium', 1),
  ('Lincoln City', 'Sincil Bank', 'stadium', 1),
  ('Grimsby Town', 'Blundell Park', 'stadium', 1),
  ('Hull City', 'MKM Stadium', 'stadium', 1),
  ('Middlesbrough', 'Riverside Stadium', 'stadium', 1),
  ('Sunderland', 'Stadium of Light', 'stadium', 1),
  ('Newcastle United', 'St James'' Park', 'stadium', 1),
  ('Burnley', 'Turf Moor', 'stadium', 1),
  ('Accrington Stanley', 'Wham Stadium', 'stadium', 1),
  ('Blackburn Rovers', 'Ewood Park', 'stadium', 1),
  ('Preston North End', 'Deepdale', 'stadium', 1),
  ('Blackpool', 'Bloomfield Road', 'stadium', 1),
  ('Fleetwood Town', 'Highbury Stadium', 'stadium', 1),
  ('Wigan Athletic', 'DW Stadium', 'stadium', 1),
  ('Bolton Wanderers', 'Toughsheet Community Stadium', 'stadium', 1),
  ('Salford City', 'Moor Lane', 'stadium', 1),
  ('Manchester United', 'Old Trafford', 'stadium', 1),
  ('Manchester City', 'Etihad Stadium', 'stadium', 1),
  ('Oldham Athletic', 'Boundary Park', 'stadium', 1),
  ('Rochdale', 'Crown Oil Arena', 'stadium', 1),
  ('Stockport County', 'Edgeley Park', 'stadium', 1),
  ('Crewe Alexandra', 'Mornflake Stadium', 'stadium', 1),
  ('Port Vale', 'Vale Park', 'stadium', 1),
  ('Stoke City', 'bet365 Stadium', 'stadium', 1),
  ('Shrewsbury Town', 'Croud Meadow', 'stadium', 1),
  ('Wrexham', 'Racecourse Ground', 'stadium', 1),
  ('Tranmere Rovers', 'Prenton Park', 'stadium', 1),
  ('Liverpool', 'Anfield', 'stadium', 1),
  ('Everton', 'Everton Stadium', 'stadium', 1),
  ('Leicester City', 'King Power Stadium', 'stadium', 1),
  ('Peterborough United', 'London Road', 'stadium', 1),
  ('Reading', 'Select Car Leasing Stadium', 'stadium', 1),
  ('Crawley Town', 'Broadfield Stadium', 'stadium', 1),
  ('Brighton & Hove Albion', 'Amex Stadium', 'stadium', 1),
  ('Portsmouth', 'Fratton Park', 'stadium', 1),
  ('Southampton', 'St Mary''s Stadium', 'stadium', 1),
  ('AFC Bournemouth', 'Vitality Stadium', 'stadium', 1),
  ('Cheltenham Town', 'Whaddon Road', 'stadium', 1),
  ('Swansea City', 'Swansea.com Stadium', 'stadium', 1)
) as v(cp_name, name, icon_key, seq) on v.cp_name = c.name
where c.journey_id = '00000000-0000-0000-0000-000000000006'
on conflict (checkpoint_id, sequence_number) do nothing;
