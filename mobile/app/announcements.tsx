import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import api, { Announcement } from '../src/services/api';

export default function AnnouncementsScreen() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [severity, setSeverity] = useState<'all' | 'info' | 'warning' | 'critical'>('all');

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .announcements({ limit: 50 })
      .then((res) => setItems(res.data))
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (severity === 'all') return items;
    return items.filter((it) => it.severity === severity);
  }, [items, severity]);

  const renderBadge = (sev: Announcement['severity']) => {
    const { bg, fg } = severityColors(sev);
    return (
      <View style={[styles.badge, { backgroundColor: bg }]}>
        <Text style={[styles.badgeText, { color: fg }]}>{sev.toUpperCase()}</Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Announcement }) => (
    <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.95 }]}> 
      <View style={styles.cardHeader}>
        {renderBadge(item.severity)}
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      </View>
      <Text style={styles.meta}>{item.lgu} • {formatDate(item.effective_from)}</Text>
      {item.body ? <Text numberOfLines={3} style={styles.body}>{item.body}</Text> : null}
    </Pressable>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.center}> 
        <ActivityIndicator size="large" color="#60A5FA" />
        <Text style={{ color: '#CBD5E1', marginTop: 10 }}>Loading announcements…</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}> 
        <View style={[styles.errorCard]}> 
          <Text style={styles.errorTitle}>Failed to load</Text>
          <Text style={styles.errorBody}>{error}</Text>
          <Pressable onPress={load} style={({ pressed }) => [styles.retryBtn, pressed && { opacity: 0.9 }]}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header & Filters */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 10 }}>
        <Text style={styles.screenTitle}>Announcements</Text>
        <View style={styles.row}>
          {(['all', 'info', 'warning', 'critical'] as const).map((key) => (
            <Pressable
              key={key}
              onPress={() => setSeverity(key)}
              style={({ pressed }) => [
                styles.chip,
                severity === key && styles.chipActive,
                pressed && { opacity: 0.9 },
              ]}
            >
              <Text style={[styles.chipText, severity === key && styles.chipTextActive]}>
                {chipLabel(key)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(it) => it.id}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={{ paddingTop: 48, alignItems: 'center' }}>
            <Text style={{ color: '#94A3B8', fontSize: 16 }}>No announcements {severity !== 'all' ? `for ${severity}` : ''}.</Text>
          </View>
        }
        onRefresh={load}
        refreshing={loading}
      />
    </SafeAreaView>
  );
}

function chipLabel(v: 'all' | 'info' | 'warning' | 'critical') {
  switch (v) {
    case 'all':
      return 'All';
    case 'info':
      return 'Info';
    case 'warning':
      return 'Warning';
    case 'critical':
      return 'Critical';
  }
}

function severityColors(sev: Announcement['severity']): { bg: string; fg: string } {
  switch (sev) {
    case 'warning':
      return { bg: '#FEF3C7', fg: '#92400E' };
    case 'critical':
      return { bg: '#FEE2E2', fg: '#991B1B' };
    default:
      return { bg: '#DBEAFE', fg: '#1E40AF' };
  }
}

function formatDate(iso?: string) {
  if (!iso) return '';
  try {
    const dt = new Date(iso);
    return dt.toLocaleString();
  } catch {
    return String(iso);
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1220' },
  center: { flex: 1, backgroundColor: '#0B1220', alignItems: 'center', justifyContent: 'center' },

  screenTitle: { color: 'white', fontSize: 24, fontWeight: '800' },
  row: { flexDirection: 'row', gap: 8 },

  chip: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#0F172A',
  },
  chipActive: {
    borderColor: '#60A5FA',
    backgroundColor: '#0B1220',
  },
  chipText: { color: '#94A3B8', fontWeight: '600' },
  chipTextActive: { color: '#E2E8F0' },

  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  title: { fontSize: 16, fontWeight: '800', color: '#0F172A', flex: 1 },
  body: { marginTop: 6, color: '#334155' },
  meta: { marginTop: 4, color: '#64748B', fontSize: 12 },

  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999 },
  badgeText: { fontSize: 10, fontWeight: '800' },

  errorCard: { backgroundColor: 'white', borderRadius: 14, padding: 16, width: '85%' },
  errorTitle: { color: '#991B1B', fontWeight: '800', fontSize: 16 },
  errorBody: { color: '#7F1D1D', marginVertical: 8 },
  retryBtn: { backgroundColor: '#2563EB', borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  retryBtnText: { color: 'white', fontWeight: '800' },
});
