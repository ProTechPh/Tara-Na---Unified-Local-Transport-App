import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import api, { Route, Stop } from '../src/services/api';

export default function RoutesScreen() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selected, setSelected] = useState<Route | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .routes()
      .then((res) => setRoutes(res.data))
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setStops([]);
    api
      .stops(selected.id)
      .then((res) => setStops(res.data))
      .catch((err) => setError(String(err)));
  }, [selected?.id]);

  if (loading) return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>;
  if (error) return <SafeAreaView style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>Routes</Text>
      </View>
      <View style={styles.columns}>
        <View style={styles.leftCol}>
          <FlatList
            data={routes}
            keyExtractor={(r) => r.id}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            contentContainerStyle={{ padding: 12, paddingRight: 8 }}
            renderItem={({ item }) => (
              <Pressable onPress={() => setSelected(item)} style={({ pressed }) => [styles.routeCard, selected?.id === item.id && styles.routeCardActive, pressed && { opacity: 0.95 }]}>
                <Text style={styles.routeName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.routeMeta}>{item.type} • {item.lgu}</Text>
              </Pressable>
            )}
          />
        </View>
        <View style={styles.rightCol}>
          <View style={{ paddingHorizontal: 12, paddingTop: 12, paddingBottom: 4 }}>
            <Text style={styles.subTitle}>Stops {selected ? `— ${selected.name}` : ''}</Text>
          </View>
          <FlatList
            data={stops}
            keyExtractor={(s) => s.id}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            contentContainerStyle={{ padding: 12, paddingLeft: 8 }}
            renderItem={({ item }) => (
              <View style={styles.stopCard}>
                <Text style={styles.stopName}>{item.name}</Text>
                <Text style={styles.stopMeta}>{item.lat.toFixed(5)}, {item.lng.toFixed(5)}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 12, color: '#94A3B8' }}>Select a route</Text>}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1220' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerRow: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 6 },
  screenTitle: { color: 'white', fontSize: 24, fontWeight: '800' },
  subTitle: { color: 'white', fontSize: 16, fontWeight: '700' },

  columns: { flex: 1, flexDirection: 'row' },
  leftCol: { width: '50%' },
  rightCol: { width: '50%' },

  routeCard: { backgroundColor: 'white', padding: 12, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  routeCardActive: { borderWidth: 2, borderColor: '#2563EB' },
  routeName: { fontWeight: '800', fontSize: 14, color: '#0F172A' },
  routeMeta: { color: '#64748B', fontSize: 12, marginTop: 2 },

  stopCard: { backgroundColor: 'white', padding: 12, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  stopName: { fontWeight: '800' },
  stopMeta: { color: '#475569' },
});
