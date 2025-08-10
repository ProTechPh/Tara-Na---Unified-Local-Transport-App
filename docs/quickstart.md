# Quickstart

## Prereqs
- Node.js 18+
- pnpm (preferred) or npm/yarn
- Expo CLI (comes with `npx expo`)

## Server
- cd server
- pnpm install
- pnpm dev

Server will listen on http://localhost:4000 and expose /health.

## Mobile
- cd mobile
- pnpm install
- Set environment variable for server URL if running on device:
  - PowerShell: `$env:EXPO_PUBLIC_SERVER_URL = "http://<your-ip>:4000"`
  - Cmd: `set EXPO_PUBLIC_SERVER_URL=http://<your-ip>:4000`
- npx expo start

Open the app in Expo Go or an emulator. Home screen shows backend health status.
