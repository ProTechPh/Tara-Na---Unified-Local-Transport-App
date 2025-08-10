import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Pressable, Alert } from 'react-native';
import api, { Report } from '../src/services/api';

export default function ReportsScreen() {
  const [items, setItems] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState('reckless');
  const [text, setText] = useState('');

  const load = () => {
    setLoading(true);
    api
      .reports({ limit: 50 })
      .then((res) => setItems(res.data))
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    try {
      const res = await api.createReport({ type, text: text || undefined });
      Alert.alert('Report submitted', `ID: ${res.data.id}`);
      setText('');
      load();
    } catch (e: any) {
      Alert.alert('Failed to submit', String(e?.message || e));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 16, gap: 12 }}>
        <Text style={styles.heading}>Create Report</Text>
        <View style={styles.formCard}>
          <TextInput value={type} onChangeText={setType} placeholder="Type (e.g., reckless, fare)" style={styles.input} placeholderTextColor="#94A3B8" />
          <TextInput value={text} onChangeText={setText} placeholder="Details (optional)" style={styles.input} placeholderTextColor="#94A3B8" />
          <Pressable onPress={submit} style={({ pressed }) => [styles.btn, pressed && { opacity: 0.9 }]}>
            <Text style={styles.btnText}>Submit Report</Text>
          </Pressable>
        </View>
      </View>
      {loading ? (
        <View style={styles.center}><ActivityIndicator color="#60A5FA" /></View>
      ) : error ? (
        <View style={styles.center}><Text style={{ color: 'red' }}>{error}</Text></View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.title}>{item.type.toUpperCase()}</Text>
                <Text style={[styles.badge, { backgroundColor: '#DBEAFE', color: '#1E40AF' }]}>Report</Text>
              </View>
              {item.text ? <Text style={styles.body}>{item.text}</Text> : null}
              <Text style={styles.meta}>{new Date(item.ts || '').toLocaleString()}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 32, color: '#94A3B8' }}>No reports</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1220' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heading: { color: 'white', fontWeight: '800', fontSize: 18 },
  formCard: { backgroundColor: '#0F172A', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#1F2937' },
  input: { backgroundColor: '#111827', padding: 12, borderRadius: 10, color: '#E5E7EB', borderWidth: 1, borderColor: '#1F2937', marginBottom: 10 },
  btn: { backgroundColor: '#2563EB', padding: 12, borderRadius: 12, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '800' },
  card: { backgroundColor: 'white', borderRadius: 14, padding: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  title: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  body: { marginTop: 6, color: '#334155' },
  meta: { marginTop: 4, color: '#64748B', fontSize: 12 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 9999, overflow: 'hidden' },
});
