# “Tara Na” — Unified Local Transport App

Mission: Solve commuting chaos across the Philippines with one smart app.

This repository hosts a cross-platform mobile app (React Native/Expo) and a Node.js API integrated with Supabase for auth, data, and realtime features.

Status: Server API for health, routes, stops, announcements, and reports is implemented with optional Supabase integration (in-memory fallback when not configured). Mobile app includes Announcements, Routes, and Reports screens wired to the API.

## Implemented Features
- LGU announcements listing and detail
- Routes list and stops per route
- Safety reports: create and list
- Health check endpoint for connectivity
- Demo mode: in-memory data when Supabase is not configured


## Architecture
- Mobile app: React Native via Expo (TypeScript), router via expo-router
- Backend API: Node.js (Express) with Supabase client
- Database: Supabase Postgres (RLS + Policies)
- Realtime: Supabase Realtime (vehicle positions, announcements)
- Maps: OpenStreetMap data, optional Google Maps Directions/Places as fallback

## Project Structure
- mobile/ — Expo app (React Native)
  - app/ — screens (index.tsx, announcements.tsx, routes.tsx, reports.tsx)
  - src/services/api.ts — API client used by screens
  - app.json, package.json, tsconfig.json
- server/ — Node.js API (Express)
  - src/index.ts — server entry
  - src/routes/ — routes.ts, announcements.ts, reports.ts
  - src/lib/supabase.ts — server Supabase client and config flag
  - package.json, tsconfig.json
- supabase/
  - schema.sql — tables, indexes
  - policies.sql — RLS policies
  - seed.sql — routes/stops sample
- docs/ — documentation placeholders (optional)

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

## Demo Mode (when Supabase is not configured)
- If server .env lacks SUPABASE_URL or SUPABASE_SERVICE_KEY, the API serves in-memory demo data to keep all features working.
- Endpoints with demo data: /routes, /routes/:id/stops, /announcements, /announcements/:id, /reports (GET/POST).
- Sample demo IDs:
  - Route IDs: 00000000-0000-4000-8000-000000000001 (Jeepney Line A), 00000000-0000-4000-8000-000000000002, 00000000-0000-4000-8000-000000000003
  - Announcement IDs: 10000000-0000-4000-8000-000000000001, 10000000-0000-4000-8000-000000000002

## API Endpoints
- GET /health — health check
- GET /routes — list routes (filter by lgu/type)
- GET /routes/:id/stops — list stops
- GET /announcements?lgu=&limit= — list announcements
- GET /announcements/:id — announcement detail
- GET /reports?limit=&route_id=&trip_id= — list safety reports
- POST /reports — create safety report

### Examples (curl)
- Health
  - curl http://localhost:4000/health
  - Response: { "ok": true, "service": "tara-na-server" }
- Routes
  - curl http://localhost:4000/routes
  - Response: { "data": [ { "id": "00000000-0000-4000-8000-000000000001", "name": "Jeepney Line A", "type": "jeepney", "lgu": "Quezon City" }, ... ] }
- Stops for a route
  - curl http://localhost:4000/routes/00000000-0000-4000-8000-000000000001/stops
- Announcements
  - curl "http://localhost:4000/announcements?limit=50"
- Announcement detail
  - curl http://localhost:4000/announcements/10000000-0000-4000-8000-000000000001
- Reports (list)
  - curl http://localhost:4000/reports
- Reports (create)
  - curl -X POST http://localhost:4000/reports -H "Content-Type: application/json" -d '{"type":"reckless","text":"Overspeeding near Stop 1"}'

## Mobile App Screens
- Home: connectivity badge and quick actions
- Announcements: list + details
- Routes: list routes and view stops for a selected route
- Reports: create a report and view recent reports

## Prerequisites
- Node.js 18+
- pnpm (preferred) or npm/yarn
- Expo CLI (via npx expo)
- Supabase project (URL + anon/service keys) — optional; demo mode works without this

## Environment Variables

Environment files are git-ignored by default (see .gitignore). Commit only example files (e.g., .env.example), never real secrets.

Mobile (Expo) — mobile/.env
- EXPO_PUBLIC_SUPABASE_URL=... — your Supabase project URL
- EXPO_PUBLIC_SUPABASE_ANON_KEY=... — your Supabase anon key
- EXPO_PUBLIC_SERVER_URL=http://<LAN-IP>:4000 — URL to the local API server for development
- MAPS_PROVIDER=maplibre | google — optional, choose the map provider

Server (Node.js) — server/.env
- SUPABASE_URL=...
- SUPABASE_SERVICE_KEY=...
- PORT=4000

Notes:
- Use your machine’s LAN IP (e.g., 192.168.x.x) for EXPO_PUBLIC_SERVER_URL when running on a physical device so it can reach your local API.
- EXPO_PUBLIC_ variables are embedded in the client bundle and are not secret. Never expose service keys in the mobile app.

## Quick Start
Server
- cd server
- Copy .env.example to .env and set SUPABASE_URL and SUPABASE_SERVICE_KEY if available (optional)
- pnpm install
- pnpm dev

Mobile
- cd mobile
- Copy .env.example to .env and set EXPO_PUBLIC_SERVER_URL to your server URL (e.g., http://192.168.x.x:4000)
- pnpm install
- npx expo start

If using a physical device
- Ensure the device and your dev machine are on the same network
- Use the LAN IP in EXPO_PUBLIC_SERVER_URL
- If you enable the API later, ensure your firewall allows inbound traffic on PORT

## Run
- Start the server first (pnpm dev in server/), then start the mobile app (npx expo start in mobile/).

## Troubleshooting
- Mobile shows Offline
  - Ensure server is running and reachable from device
  - Check EXPO_PUBLIC_SERVER_URL value (use LAN IP, not localhost, for real devices)
- 500 errors on API with Supabase configured
  - Verify SUPABASE_URL and SUPABASE_SERVICE_KEY are valid and have required database schema
  - Try demo mode by removing these env vars to confirm server path works

## Licensing and Compliance
- Ensure compliance with local transport data policies and privacy laws.
- OSM usage must comply with ODbL; Google APIs require appropriate billing and terms.

## Security
- Never commit service keys or production credentials.
- Review RLS policies before enabling write paths in production.

---
This README documents the complete, working features currently implemented, along with demo mode behavior and API usage examples.
