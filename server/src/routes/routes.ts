import { Router } from 'express';
import { z } from 'zod';

export const router = Router();

// Temporary in-memory stub until Supabase is wired
const ROUTES = [
  { id: 'r1', name: 'Jeepney Line A', type: 'jeepney', lgu: 'Quezon City' },
  { id: 'r2', name: 'Tricycle Zone 5', type: 'tricycle', lgu: 'Antipolo' },
  { id: 'r3', name: 'Bus EDSA Southbound', type: 'bus', lgu: 'Mandaluyong' },
];

const querySchema = z.object({
  lgu: z.string().optional(),
  type: z.enum(['jeepney', 'tricycle', 'bus']).optional(),
});

router.get('/', (req, res) => {
  const parse = querySchema.safeParse(req.query);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const { lgu, type } = parse.data;
  let list = ROUTES;
  if (lgu) list = list.filter(r => r.lgu.toLowerCase() === lgu.toLowerCase());
  if (type) list = list.filter(r => r.type === type);

  res.json({ data: list });
});

router.get('/:id/stops', (req, res) => {
  const { id } = req.params;
  const route = ROUTES.find(r => r.id === id);
  if (!route) return res.status(404).json({ error: 'Route not found' });
  // Minimal stub for stops
  const stops = [
    { id: 's1', route_id: id, name: 'Stop 1', lat: 14.5995, lng: 120.9842 },
    { id: 's2', route_id: id, name: 'Stop 2', lat: 14.6095, lng: 120.9942 },
  ];
  res.json({ data: stops });
});
