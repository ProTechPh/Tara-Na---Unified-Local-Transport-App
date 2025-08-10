-- Supabase schema for “Tara Na”
-- Enable required extensions
create extension if not exists postgis;

-- Users/Profile
create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text check (role in ('rider','driver','operator','admin')) default 'rider',
  display_name text,
  created_at timestamptz default now()
);

-- Operators
create table if not exists operators (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  name text not null,
  created_at timestamptz default now()
);

-- Vehicles
create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  operator_id uuid references operators(id) on delete cascade,
  plate_no text,
  type text check (type in ('jeepney','tricycle','bus')) not null,
  created_at timestamptz default now()
);

-- Routes
create table if not exists routes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text check (type in ('jeepney','tricycle','bus')) not null,
  lgu text not null,
  polyline text, -- encoded polyline or GeoJSON id reference
  created_at timestamptz default now()
);

-- Stops
create table if not exists stops (
  id uuid primary key default gen_random_uuid(),
  route_id uuid references routes(id) on delete cascade,
  name text not null,
  lat double precision not null,
  lng double precision not null,
  created_at timestamptz default now()
);

-- Trips
create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  route_id uuid references routes(id) on delete set null,
  vehicle_id uuid references vehicles(id) on delete set null,
  driver_id uuid references auth.users(id) on delete set null,
  status text check (status in ('scheduled','active','completed','canceled')) default 'active',
  created_at timestamptz default now()
);

-- Positions (Realtime stream)
create table if not exists positions (
  id bigserial primary key,
  trip_id uuid references trips(id) on delete cascade,
  lat double precision not null,
  lng double precision not null,
  speed double precision,
  heading double precision,
  ts timestamptz default now()
);

-- Reports (Safety)
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users(id) on delete set null,
  type text not null,
  text text,
  route_id uuid references routes(id) on delete set null,
  trip_id uuid references trips(id) on delete set null,
  location jsonb, -- {lat,lng}
  ts timestamptz default now()
);

-- Announcements
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  lgu text not null,
  title text not null,
  body text,
  severity text check (severity in ('info','warning','critical')) default 'info',
  effective_from timestamptz default now(),
  effective_to timestamptz
);

-- Subscriptions (Operators)
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  operator_id uuid references operators(id) on delete cascade,
  plan text,
  status text check (status in ('trial','active','past_due','canceled')) default 'trial',
  started_at timestamptz default now(),
  ends_at timestamptz
);

-- Indexes
create index if not exists idx_routes_lgu on routes(lgu);
create index if not exists idx_routes_type on routes(type);
create index if not exists idx_positions_trip_ts on positions(trip_id, ts desc);
create index if not exists idx_announcements_lgu on announcements(lgu);
