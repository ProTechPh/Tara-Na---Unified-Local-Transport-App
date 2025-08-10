import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_SERVICE_KEY);

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  // eslint-disable-next-line no-console
  console.warn('[supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_KEY. Falling back to demo in-memory data.');
}

export const supabaseAdmin = createClient(
  SUPABASE_URL || 'http://localhost:54321',
  SUPABASE_SERVICE_KEY || 'local-dev-key',
  {
    auth: { persistSession: false },
    db: { schema: 'public' },
  }
);
