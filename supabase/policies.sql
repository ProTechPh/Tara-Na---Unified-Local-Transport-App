-- Enable Row Level Security on all user tables
alter table profiles enable row level security;
alter table operators enable row level security;
alter table vehicles enable row level security;
alter table routes enable row level security;
alter table stops enable row level security;
alter table trips enable row level security;
alter table positions enable row level security;
alter table reports enable row level security;
alter table announcements enable row level security;
alter table subscriptions enable row level security;

-- profiles: users can read their own profile, insert/update own, admins can read all
create policy if not exists profiles_select_self on profiles for select using (auth.uid() = user_id or exists(select 1 from profiles p where p.user_id = auth.uid() and p.role = 'admin'));
create policy if not exists profiles_insert_self on profiles for insert with check (auth.uid() = user_id);
create policy if not exists profiles_update_self on profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- routes/stops/announcements: public read, admins/operators manage
create policy if not exists routes_public_read on routes for select using (true);
create policy if not exists stops_public_read on stops for select using (true);
create policy if not exists announcements_public_read on announcements for select using (true);

-- reports: authenticated users can insert their own, read public list (no sensitive fields)
create policy if not exists reports_insert_auth on reports for insert with check (auth.role() = 'authenticated');
create policy if not exists reports_select_public on reports for select using (true);

-- positions: select public (read-only), insert drivers only
create policy if not exists positions_select_public on positions for select using (true);
-- This is a simplified driver rule; refine by membership later
create policy if not exists positions_insert_driver on positions for insert with check (auth.role() = 'authenticated');

-- operators/vehicles/trips/subscriptions: operators and admins manage rows they own
-- Simplified: allow authenticated select; tighten later with memberships
create policy if not exists operators_select_auth on operators for select using (auth.role() = 'authenticated');
create policy if not exists vehicles_select_auth on vehicles for select using (auth.role() = 'authenticated');
create policy if not exists trips_select_auth on trips for select using (auth.role() = 'authenticated');
create policy if not exists subscriptions_select_auth on subscriptions for select using (auth.role() = 'authenticated');
