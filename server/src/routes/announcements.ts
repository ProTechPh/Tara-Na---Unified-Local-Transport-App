import { Router } from 'express';
import { z } from 'zod';
import { supabaseAdmin, isSupabaseConfigured } from '../lib/supabase';

export const router = Router();

const demoAnnouncements = [
  { id: '10000000-0000-4000-8000-000000000001', lgu: 'Quezon City', title: 'Road closure on Friday', body: 'Main Ave closed for parade 9am-2pm', severity: 'info', effective_from: new Date().toISOString() },
  { id: '10000000-0000-4000-8000-000000000002', lgu: 'Mandaluyong', title: 'Fare adjustment', body: 'Bus fare +2 PHP starting next week', severity: 'warning', effective_from: new Date().toISOString() },
] as const;

const listQuery = z.object({
  lgu: z.string().optional(),
  limit: z.coerce.number().min(1).max(200).default(50).optional(),
});

router.get('/', async (req, res) => {
  const parsed = listQuery.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { lgu, limit } = parsed.data;

  if (!isSupabaseConfigured) {
    let data = [...demoAnnouncements];
    if (lgu) data = data.filter((a) => a.lgu === lgu);
    if (limit) data = data.slice(0, limit);
    return res.json({ data });
  }

  let query = supabaseAdmin
    .from('announcements')
    .select('*')
    .order('effective_from', { ascending: false });
  if (lgu) query = query.eq('lgu', lgu);
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ data });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!isSupabaseConfigured) {
    const data = demoAnnouncements.find((a) => a.id === id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    return res.json({ data });
  }

  const { data, error } = await supabaseAdmin
    .from('announcements')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Not found' });
  return res.json({ data });
});
