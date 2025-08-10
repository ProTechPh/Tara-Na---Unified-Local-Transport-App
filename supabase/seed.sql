-- Seed data for routes and stops
insert into routes (id, name, type, lgu, polyline)
values
  (gen_random_uuid(), 'Jeepney Line A', 'jeepney', 'Quezon City', null),
  (gen_random_uuid(), 'Tricycle Zone 5', 'tricycle', 'Antipolo', null),
  (gen_random_uuid(), 'Bus EDSA Southbound', 'bus', 'Mandaluyong', null);

-- We'll pick one route id for stops using CTE
with r as (
  select id from routes where name = 'Jeepney Line A' limit 1
)
insert into stops (route_id, name, lat, lng)
values
  ((select id from r), 'Stop 1', 14.5995, 120.9842),
  ((select id from r), 'Stop 2', 14.6095, 120.9942);
