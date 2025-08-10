# “Tara Na” — Unified Local Transport App

Mission: Solve commuting chaos across the Philippines with one smart app.

This repository will host a cross-platform mobile app (React Native/Expo) and a Node.js API integrated with Supabase for auth, data, and realtime features.

Status: Server scaffold (Express) and Supabase schema/policies are present; mobile Expo app scaffold with env configured. Next: wire Supabase client in server, implement map screen.

## Core Features (MVP)
- Live map of jeepney, tricycle, bus routes per locality
- Crowd-sourced real-time vehicle positions and ETAs
- Safety reports from riders (reckless driving, fare scams)
- LGU announcements (closures, fare changes, weather alerts)

## Future (nice-to-have)
- QR payments (GCash/Maya) and fare QR generation
- Operator/driver dashboards (subscriptions)
- Business ads around the user’s route

## Architecture
- Mobile app: React Native via Expo (TypeScript), Map SDK (MapLibre GL or Google Maps)
- Backend API: Node.js (Express) with Supabase client
- Database: Supabase Postgres (RLS + Policies)
- Realtime: Supabase Realtime (vehicle positions, announcements)
- Maps: OpenStreetMap data, optional Google Maps Directions/Places as fallback

## Planned Repository Structure
- mobile/ — Expo app (React Native)
  - app.json, package.json, babel.config.js
  - src/
    - screens/, components/, hooks/, services/
    - features/map/, features/reports/, features/announcements/
- server/ — Node.js API (Express)
  - package.json, src/index.ts (or .js)
  - src/routes/, src/controllers/, src/services/
  - src/lib/supabase.ts (server SDK)
- supabase/
  - schema.sql — tables, RLS, indexes
  - seed.sql — seed routes/stops sample
  - policies.sql — RLS policies (split for clarity)
- docs/
  - architecture.md
  - data-model.md
  - api-contract.md
  - contributing.md

## Data Model (initial sketch)
- profiles (user_id, role[rider|driver|operator|admin], display_name)
- vehicles (id, operator_id, plate_no, type[jeepney|tricycle|bus])
- routes (id, name, type, lgu, polyline)
- stops (id, route_id, name, lat, lng)
- trips (id, route_id, vehicle_id, driver_id, status)
- positions (id, trip_id, lat, lng, speed, heading, ts)
- reports (id, author_id, type, text, route_id, trip_id, location, ts)
- announcements (id, lgu, title, body, severity, effective_from, effective_to)
- subscriptions (id, operator_id, plan, status, started_at, ends_at)

Notes:
- Enable RLS on all tables; public read for routes/stops/announcements with constraints; write restricted to owners/admins.
- positions inserted by drivers (or device trackers), broadcast via Realtime.

## API Endpoints (MVP draft)
- GET /health — health check
- GET /routes — list routes (filter by lgu/type)
- GET /routes/:id/stops — list stops
- GET /trips/:id/positions?since=ts — latest positions
- POST /reports — create safety report (auth required)
- GET /announcements?lgu= — public announcements

## Mobile App (MVP screens)
- Map screen: base map, selectable routes, live vehicles, ETAs
- Report screen: submit issue with category and optional photo
- Announcements screen: list + detail, filters per LGU
- Onboarding/auth: email OTP or magic link via Supabase Auth

## Prerequisites
- Node.js 18+
- pnpm (preferred) or npm/yarn
- Expo CLI (via npx expo)
- Supabase project (URL + anon/service keys)

## Environment Variables

Environment files are git-ignored by default (see .gitignore). Commit only example files (e.g., .env.example), never real secrets.

Mobile (Expo) — in mobile/.env:
- EXPO_PUBLIC_SUPABASE_URL=... — your Supabase project URL
- EXPO_PUBLIC_SUPABASE_ANON_KEY=... — your Supabase anon key
- EXPO_PUBLIC_SERVER_URL=http://<LAN-IP>:4000 — URL to the local API server for development
- MAPS_PROVIDER=maplibre | google — optional, choose the map provider

Server (Node.js) — in server/.env:
- SUPABASE_URL=...
- SUPABASE_SERVICE_KEY=...
- PORT=4000

Notes:
- Use your machine’s LAN IP (e.g., 192.168.x.x) for EXPO_PUBLIC_SERVER_URL when running on a physical device so it can reach your local API.
- EXPO_PUBLIC_ variables are embedded in the client bundle and are not secret. Never expose service keys in the mobile app.

## Quick Start (Mobile only for now)
- cd mobile
- Create mobile/.env and set the variables listed above
- pnpm install
- npx expo start

If using a physical device:
- Ensure the device and your dev machine are on the same network
- Use the LAN IP in EXPO_PUBLIC_SERVER_URL
- If you enable the API later, ensure your firewall allows inbound traffic on PORT

## Run (planned)
- server:
  - cd server
  - pnpm install
  - pnpm dev
- mobile:
  - cd mobile
  - pnpm install
  - npx expo start

## Roadmap (tracked)
- [x] Create supabase/schema.sql with initial tables and RLS stubs (see supabase/schema.sql; RLS policies in supabase/policies.sql)
- [x] Scaffold server (Express) with health and routes endpoints (GET /health, GET /routes, GET /routes/:id/stops)
- [ ] Add Supabase server client (service key) and env handling (env present via dotenv; client wiring pending)
- [x] Seed sample routes and stops (Metro Manila, sample LGU) (see supabase/seed.sql)
- [ ] Scaffold mobile (Expo) with Map screen using MapLibre or Google (base Expo app present; map screen pending)
- [ ] Wire mobile to API + Supabase Realtime for positions (basic /health fetch present; realtime pending)
- [ ] Implement reports create + list
- [ ] Implement announcements list
- [ ] Add CI tasks (lint/test/build)
- [x] Add .env.example files for mobile and server and reference in docs

## Licensing and Compliance
- Ensure compliance with local transport data policies and privacy laws.
- OSM usage must comply with ODbL; Google APIs require appropriate billing and terms.

## Security
- Never commit service keys or production credentials.
- Review RLS policies before enabling write paths in production.

---
This README is the blueprint. Next steps will add runnable server, mobile app, and Supabase schema within this repo.