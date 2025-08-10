import { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || 'http://localhost:4000';

export default function Index() {
  const [status, setStatus] = useState<string>('Loading...');

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`${SERVER_URL}/health`, { signal: ctrl.signal })
      .then(res => res.json())
      .then(json => setStatus(JSON.stringify(json)))
      .catch(err => setStatus(`Error: ${String(err)}`));
    return () => ctrl.abort();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>“Tara Na”</Text>
        <Text>Server: {SERVER_URL}</Text>
        <Text testID="server-status">{status}</Text>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
});
