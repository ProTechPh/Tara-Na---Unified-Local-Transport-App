import { Router } from 'express';
import { z } from 'zod';
import { supabaseAdmin, isSupabaseConfigured } from '../lib/supabase';

export const router = Router();

const demoRoutes = [
  { id: '00000000-0000-4000-8000-000000000001', name: 'Jeepney Line A', type: 'jeepney', lgu: 'Quezon City', polyline: null },
  { id: '00000000-0000-4000-8000-000000000002', name: 'Tricycle Zone 5', type: 'tricycle', lgu: 'Antipolo', polyline: null },
  { id: '00000000-0000-4000-8000-000000000003', name: 'Bus EDSA Southbound', type: 'bus', lgu: 'Mandaluyong', polyline: null },
] as const;

const demoStops = [
  { id: '00000000-0000-4000-8000-000000000101', route_id: '00000000-0000-4000-8000-000000000001', name: 'Stop 1', lat: 14.5995, lng: 120.9842 },
  { id: '00000000-0000-4000-8000-000000000102', route_id: '00000000-0000-4000-8000-000000000001', name: 'Stop 2', lat: 14.6095, lng: 120.9942 },
] as const;

const querySchema = z.object({
  lgu: z.string().optional(),
  type: z.enum(['jeepney', 'tricycle', 'bus']).optional(),
});

router.get('/', async (req, res) => {
  const parse = querySchema.safeParse(req.query);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const { lgu, type } = parse.data;

  if (!isSupabaseConfigured) {
    let data = [...demoRoutes];
    if (lgu) data = data.filter((r) => r.lgu === lgu);
    if (type) data = data.filter((r) => r.type === type);
    return res.json({ data });
  }

  let query = supabaseAdmin.from('routes').select('*').order('name');
  if (lgu) query = query.eq('lgu', lgu);
  if (type) query = query.eq('type', type);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});

router.get('/:id/stops', async (req, res) => {
  const { id } = req.params;

  if (!isSupabaseConfigured) {
    const exists = demoRoutes.find((r) => r.id === id);
    if (!exists) return res.status(404).json({ error: 'Route not found' });
    const data = demoStops
      .filter((s) => s.route_id === id)
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));
    return res.json({ data });
  }

  const { data: route, error: routeErr } = await supabaseAdmin
    .from('routes')
    .select('id')
    .eq('id', id)
    .maybeSingle();
  if (routeErr) return res.status(500).json({ error: routeErr.message });
  if (!route) return res.status(404).json({ error: 'Route not found' });

  const { data, error } = await supabaseAdmin
    .from('stops')
    .select('*')
    .eq('route_id', id)
    .order('name');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
});
