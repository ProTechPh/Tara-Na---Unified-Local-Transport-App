import { Router } from 'express';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { supabaseAdmin, isSupabaseConfigured } from '../lib/supabase';

export const router = Router();

const demoReports: any[] = [
  { id: '20000000-0000-4000-8000-000000000001', type: 'reckless', text: 'Speeding near Stop 1', route_id: '00000000-0000-4000-8000-000000000001', trip_id: null, location: { lat: 14.60, lng: 120.98 }, ts: new Date().toISOString() },
];

const listQuery = z.object({
  limit: z.coerce.number().min(1).max(200).default(50).optional(),
  route_id: z.string().uuid().optional(),
  trip_id: z.string().uuid().optional(),
});

const createBody = z.object({
  type: z.string().min(1),
  text: z.string().optional(),
  route_id: z.string().uuid().optional(),
  trip_id: z.string().uuid().optional(),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
});

// List reports
router.get('/', async (req, res) => {
  const parsed = listQuery.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { limit, route_id, trip_id } = parsed.data;

  if (!isSupabaseConfigured) {
    let data = [...demoReports].sort((a, b) => (b.ts || '').localeCompare(a.ts || ''));
    if (route_id) data = data.filter((r) => r.route_id === route_id);
    if (trip_id) data = data.filter((r) => r.trip_id === trip_id);
    if (limit) data = data.slice(0, limit);
    return res.json({ data });
  }

  let query = supabaseAdmin
    .from('reports')
    .select('*')
    .order('ts', { ascending: false });

  if (limit) query = query.limit(limit);
  if (route_id) query = query.eq('route_id', route_id);
  if (trip_id) query = query.eq('trip_id', trip_id);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ data });
});

// Create a report
router.post('/', async (req, res) => {
  const parsed = createBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const payload = parsed.data;

  if (!isSupabaseConfigured) {
    const row = {
      id: randomUUID(),
      type: payload.type,
      text: payload.text ?? null,
      route_id: payload.route_id ?? null,
      trip_id: payload.trip_id ?? null,
      location: payload.location ?? null,
      ts: new Date().toISOString(),
    } as any;
    demoReports.unshift(row);
    return res.status(201).json({ data: row });
  }

  const insertRow = {
    type: payload.type,
    text: payload.text ?? null,
    route_id: payload.route_id ?? null,
    trip_id: payload.trip_id ?? null,
    location: payload.location ?? null,
  };

  const { data, error } = await supabaseAdmin
    .from('reports')
    .insert(insertRow)
    .select('*')
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json({ data });
});
