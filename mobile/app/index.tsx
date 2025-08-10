import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || 'http://localhost:4000';

type ServerState = 'loading' | 'ok' | 'error';

type HealthResponse = {
  ok: boolean;
  service?: string;
};

const AnimatedPressable: React.FC<React.ComponentProps<typeof Pressable>> = ({ children, style, ...props }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const handleIn = () => {
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, friction: 6, tension: 200 }).start();
  };
  const handleOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6, tension: 200 }).start();
  };
  return (
    <Animated.View style={[{ transform: [{ scale }] }]}> 
      <Pressable onPressIn={handleIn} onPressOut={handleOut} android_ripple={{ color: '#E5E7EB' }} style={style} {...props}>
        {children}
      </Pressable>
    </Animated.View>
  );
};

const suggestions = ['Home', 'Work', 'SM North', 'Ayala', 'Cubao'];

export default function Index() {
  const [serverState, setServerState] = useState<ServerState>('loading');
  const [serverInfo, setServerInfo] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [planning, setPlanning] = useState<boolean>(false);

  useEffect(() => {
    const ctrl = new AbortController();
    setServerState('loading');
    fetch(`${SERVER_URL}/health`, { signal: ctrl.signal })
      .then((res) => res.json())
      .then((json: HealthResponse) => {
        if (json?.ok) {
          setServerState('ok');
          setServerInfo(json?.service || 'server');
        } else {
          setServerState('error');
          setServerInfo('Unexpected response');
        }
      })
      .catch((err) => {
        setServerState('error');
        setServerInfo(String(err));
      });
    return () => ctrl.abort();
  }, []);

  const { badgeBg, badgeText, badgeLabel } = useMemo(() => {
    switch (serverState) {
      case 'ok':
        return { badgeBg: '#DCFCE7', badgeText: '#166534', badgeLabel: `Connected (${serverInfo || 'OK'})` };
      case 'error':
        return { badgeBg: '#FEE2E2', badgeText: '#991B1B', badgeLabel: 'Offline' };
      default:
        return { badgeBg: '#FEF9C3', badgeText: '#92400E', badgeLabel: 'Connecting…' };
    }
  }, [serverState, serverInfo]);

  const onPlanTrip = () => {
    const dest = destination.trim();
    if (!dest) {
      Alert.alert('Destination required', 'Enter a destination to plan your trip.');
      return;
    }
    setPlanning(true);
    setTimeout(() => {
      setPlanning(false);
      Alert.alert('Plan Trip', `Planning route to: ${dest}`);
    }, 500);
  };

  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>Tara Na</Text>
          <Text style={styles.appTagline}>Unified Local Transport</Text>
          <View testID="server-badge" style={[styles.badge, { backgroundColor: badgeBg }]}> 
            {serverState === 'loading' && <ActivityIndicator size="small" color={badgeText} style={{ marginRight: 6 }} />}
            <Text style={[styles.badgeText, { color: badgeText }]}>{badgeLabel}</Text>
          </View>
          <Text style={styles.serverMeta}>Server: {SERVER_URL.replace(/^https?:\/\//, '')}</Text>
        </View>

        {/* Search / Plan card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Where are you going?</Text>
          <TextInput
            placeholder="Enter destination (e.g., SM Mall, Ayala, Cubao)"
            value={destination}
            onChangeText={setDestination}
            style={styles.input}
            returnKeyType="go"
            onSubmitEditing={onPlanTrip}
            clearButtonMode="while-editing"
          />
          <View style={styles.chipsRow}>
            {suggestions.map((s) => (
              <Pressable key={s} onPress={() => setDestination(s)} style={({ pressed }) => [styles.chip, pressed && { opacity: 0.9 }]} android_ripple={{ color: '#E5E7EB' }}>
                <Text style={styles.chipText}>{s}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={onPlanTrip}
            disabled={!destination.trim() || planning}
            style={({ pressed }) => [
              styles.primaryBtn,
              (!destination.trim() || planning) && styles.primaryBtnDisabled,
              pressed && styles.btnPressed,
            ]}
          >
            {planning ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Plan Trip</Text>
            )}
          </Pressable>
        </View>

        {/* Quick actions */}
        <View style={styles.quickActions}>
          <AnimatedPressable onPress={() => router.push('/announcements')} style={({ pressed }) => [styles.quickBtn, pressed && styles.btnPressed]}>
            <Text style={styles.quickBtnText}>📢 Announcements</Text>
          </AnimatedPressable>
          <AnimatedPressable onPress={() => router.push('/routes')} style={({ pressed }) => [styles.quickBtn, pressed && styles.btnPressed]}>
            <Text style={styles.quickBtnText}>🧭 Routes</Text>
          </AnimatedPressable>
          <AnimatedPressable onPress={() => router.push('/reports')} style={({ pressed }) => [styles.quickBtn, pressed && styles.btnPressed]}>
            <Text style={styles.quickBtnText}>🛡️ Reports</Text>
          </AnimatedPressable>
        </View>

        {/* Info section */}
        {serverState === 'error' && (
          <View style={[styles.card, { borderColor: '#FCA5A5' }]}> 
            <Text style={styles.errorTitle}>Cannot reach server</Text>
            <Text style={styles.errorText}>Check that your server is running and the EXPO_PUBLIC_SERVER_URL is correct.</Text>
            {serverInfo ? <Text style={styles.errorDetails}>{serverInfo}</Text> : null}
          </View>
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0B1220' },
  container: { flexGrow: 1, padding: 20, gap: 18 },
  header: { gap: 4, alignItems: 'flex-start' },
  appTitle: { fontSize: 34, fontWeight: '800', color: 'white', letterSpacing: 0.5 },
  appTagline: { color: '#93C5FD', fontSize: 12, fontWeight: '600' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 9999, borderWidth: 1, borderColor: '#E5E7EB' },
  badgeText: { fontSize: 12, fontWeight: '600' },
  serverMeta: { color: '#94A3B8', fontSize: 12 },

  card: { backgroundColor: 'white', borderRadius: 14, padding: 16, gap: 10, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, backgroundColor: '#F8FAFC' },

  primaryBtn: { backgroundColor: '#2563EB', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  primaryBtnText: { color: 'white', fontWeight: '800', fontSize: 16, letterSpacing: 0.2 },
  primaryBtnDisabled: { backgroundColor: '#93C5FD' },
  btnPressed: { opacity: 0.85 },

  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickBtn: { backgroundColor: 'white', borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 9999, paddingVertical: 10, paddingHorizontal: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  quickBtnText: { color: '#0F172A', fontWeight: '700' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: { backgroundColor: '#E5E7EB', borderRadius: 9999, paddingVertical: 6, paddingHorizontal: 12 },
  chipText: { color: '#0F172A', fontWeight: '600' },

  errorTitle: { fontSize: 16, fontWeight: '800', color: '#991B1B' },
  errorText: { color: '#7F1D1D' },
  errorDetails: { marginTop: 4, color: '#7F1D1D', fontSize: 12 },
});
