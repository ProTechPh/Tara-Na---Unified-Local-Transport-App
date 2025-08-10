const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || 'http://localhost:4000';

export type Route = { id: string; name: string; type: 'jeepney' | 'tricycle' | 'bus'; lgu: string };
export type Stop = { id: string; route_id: string; name: string; lat: number; lng: number };
export type Announcement = { id: string; lgu: string; title: string; body?: string; severity: 'info'|'warning'|'critical'; effective_from?: string; effective_to?: string };
export type Report = { id: string; type: string; text?: string; route_id?: string | null; trip_id?: string | null; location?: { lat: number; lng: number } | null; ts?: string };

export const api = {
  async health() {
    const r = await fetch(`${SERVER_URL}/health`);
    return r.json();
  },
  async routes(params?: { lgu?: string; type?: Route['type'] }): Promise<{ data: Route[] }> {
    const url = new URL(`${SERVER_URL}/routes`);
    if (params?.lgu) url.searchParams.set('lgu', params.lgu);
    if (params?.type) url.searchParams.set('type', params.type);
    const r = await fetch(url.toString());
    if (!r.ok) throw new Error(`Failed to fetch routes: ${r.status}`);
    return r.json();
  },
  async stops(routeId: string): Promise<{ data: Stop[] }> {
    const r = await fetch(`${SERVER_URL}/routes/${routeId}/stops`);
    if (!r.ok) throw new Error(`Failed to fetch stops: ${r.status}`);
    return r.json();
  },
  async announcements(params?: { lgu?: string; limit?: number }): Promise<{ data: Announcement[] }> {
    const url = new URL(`${SERVER_URL}/announcements`);
    if (params?.lgu) url.searchParams.set('lgu', params.lgu);
    if (params?.limit) url.searchParams.set('limit', String(params.limit));
    const r = await fetch(url.toString());
    if (!r.ok) throw new Error(`Failed to fetch announcements: ${r.status}`);
    return r.json();
  },
  async announcement(id: string): Promise<{ data: Announcement }> {
    const r = await fetch(`${SERVER_URL}/announcements/${id}`);
    if (!r.ok) throw new Error(`Failed to fetch announcement: ${r.status}`);
    return r.json();
  },
  async reports(params?: { limit?: number; route_id?: string; trip_id?: string }): Promise<{ data: Report[] }> {
    const url = new URL(`${SERVER_URL}/reports`);
    if (params?.limit) url.searchParams.set('limit', String(params.limit));
    if (params?.route_id) url.searchParams.set('route_id', params.route_id);
    if (params?.trip_id) url.searchParams.set('trip_id', params.trip_id);
    const r = await fetch(url.toString());
    if (!r.ok) throw new Error(`Failed to fetch reports: ${r.status}`);
    return r.json();
  },
  async createReport(body: { type: string; text?: string; route_id?: string; trip_id?: string; location?: { lat: number; lng: number } }): Promise<{ data: Report }> {
    const r = await fetch(`${SERVER_URL}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(`Failed to create report: ${r.status}`);
    return r.json();
  },
};
export default api;
