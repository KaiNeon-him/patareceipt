import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { receipts } from '../services/api';

export default function AnalyticsScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await receipts.list();
      const data = res.data;
      const total = data.length;
      const totalAmount = data.reduce((sum, r) => sum + r.total_amount, 0);
      const viewed = data.filter((r) => r.status === 'VIEWED').length;
      const sent = data.filter((r) => r.status === 'SENT').length;
      setStats({ total, totalAmount, viewed, sent, recentReceipts: data.slice(0, 5) });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <View style={styles.container}><ActivityIndicator size="large" /></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Analytics</Text>
      </View>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Receipts</Text>
          <Text style={styles.statValue}>{stats.total}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Amount</Text>
          <Text style={styles.statValue}>KSh {stats.totalAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Viewed</Text>
          <Text style={styles.statValue}>{stats.viewed}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Sent</Text>
          <Text style={styles.statValue}>{stats.sent}</Text>
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {stats.recentReceipts.map((r) => (
          <View key={r.receipt_id} style={styles.activityRow}>
            <Text style={styles.activityId}>{r.receipt_id}</Text>
            <Text style={styles.activityClient}>{r.client_name}</Text>
            <Text style={styles.activityAmount}>$${r.total_amount.toFixed(2)}</Text>
            <Text style={styles.activityStatus}>{r.status}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f7' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  back: { padding: 8 },
  backText: { fontSize: 24, color: '#1a1a2e' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1a1a2e', flex: 1 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12 },
  statCard: { flex: 1, minWidth: 150, backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statLabel: { fontSize: 12, color: '#999', textTransform: 'uppercase', marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1a1a2e' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginHorizontal: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 12 },
  activityRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  activityId: { fontWeight: '600', color: '#1a1a2e', fontSize: 13 },
  activityClient: { color: '#666', fontSize: 13 },
  activityAmount: { fontWeight: '600', color: '#1a1a2e', fontSize: 13 },
  activityStatus: { fontSize: 11, color: '#4caf50', textTransform: 'uppercase' },
});