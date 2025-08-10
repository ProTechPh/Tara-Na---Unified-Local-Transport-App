# "Tara Na" Setup Guide

## Prerequisites
- Node.js 18+
- pnpm (preferred) or npm/yarn
- Expo CLI (comes with `npx expo`)
- Supabase account and project

## Supabase Setup Complete ✅

Your Supabase project has been configured with:
- ✅ Database schema (tables, indexes, RLS policies)
- ✅ Sample data (3 routes, 2 stops)
- ✅ TypeScript types generated
- ✅ Environment configuration

### Database Tables Created:
- `profiles` - User profiles and roles
- `operators` - Transport operators
- `vehicles` - Vehicle registry
- `routes` - Transport routes
- `stops` - Route stops with coordinates
- `trips` - Active vehicle trips
- `positions` - Real-time vehicle positions
- `reports` - Safety reports from users
- `announcements` - LGU announcements
- `subscriptions` - Operator subscriptions

## Environment Configuration

### Server Environment
1. Copy `server/.env.example` to `server/.env`
2. Get your Supabase service key from: https://app.supabase.com/project/getpsdhrznghajbtslif/settings/api
3. Update `SUPABASE_SERVICE_KEY` in `server/.env`

### Mobile Environment
1. Copy `mobile/.env.example` to `mobile/.env`
2. The anon key is already configured
3. For device testing, update `EXPO_PUBLIC_SERVER_URL` to your machine's IP

## Running the Project

### 1. Start the Server
```bash
cd server
pnpm install
pnpm dev
```
Server will be available at: http://localhost:4000

Test endpoints:
- GET /health - Server health check
- GET /routes - List all routes
- GET /routes/:id/stops - Get stops for a route

### 2. Start the Mobile App
```bash
cd mobile
pnpm install
npx expo start
```

Open in Expo Go or simulator. The app will ping the server health endpoint.

## Next Steps

### Connect Server to Supabase
Update `server/src/routes/routes.ts` to use Supabase instead of in-memory data:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../supabase/types/database.types';

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Replace ROUTES array with:
router.get('/', async (req, res) => {
  const parse = querySchema.safeParse(req.query);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const { lgu, type } = parse.data;
  let query = supabase.from('routes').select('*');
  
  if (lgu) query = query.eq('lgu', lgu);
  if (type) query = query.eq('type', type);
  
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  
  res.json({ data });
});
```

### Add Map to Mobile App
Install map dependencies:
```bash
cd mobile
pnpm add react-native-maps @react-native-community/geolocation
```

### Enable Realtime
Subscribe to position updates in your mobile app:
```typescript
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

// Subscribe to position updates
supabase
  .channel('positions')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'positions' },
    (payload) => {
      console.log('New position:', payload.new);
      // Update map markers
    }
  )
  .subscribe();
```

## Project URLs
- Supabase Dashboard: https://app.supabase.com/project/getpsdhrznghajbtslif
- API URL: https://getpsdhrznghajbtslif.supabase.co
- Local Server: http://localhost:4000

## Troubleshooting

### Server Issues
- Check `.env` file exists and has correct Supabase credentials
- Verify port 4000 is available
- Check server logs for database connection errors

### Mobile Issues
- For device testing, use your machine's LAN IP instead of localhost
- Ensure Expo Go is updated
- Check network connectivity between device and server

### Database Issues
- Verify RLS policies allow your operations
- Check Supabase logs in the dashboard
- Ensure your API keys are correct and not expired

## Security Notes
- Never commit `.env` files to version control
- The anon key is safe for client-side use (RLS protects data)
- Service key should only be used server-side
- Review and tighten RLS policies before production