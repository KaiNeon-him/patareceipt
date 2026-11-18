import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { receipts } from '../services/api';

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [receiptsList, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    try {
      const res = await receipts.list();
      setReceipts(res.data);
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
        <View>
          <Text style={styles.greeting}>Hello, {user?.businessName || 'there'}!</Text>
          <Text style={styles.subtitle}>Your receipts</Text>
        </View>
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Analytics')}>
            <Text style={styles.menuText}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Templates')}>
            <Text style={styles.menuText}>Templates</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logout} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateReceipt')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      <FlatList
        data={receiptsList}
        keyExtractor={(item) => item.receipt_id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('ReceiptDetail', { id: item.receipt_id })}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemId}>{item.receipt_id}</Text>
              <Text style={styles.itemClient}>{item.client_name}</Text>
            </View>
            <View style={styles.itemRight}>
              <Text style={styles.itemAmount}>KSh {item.total_amount.toFixed(2)}</Text>
              <Text style={styles.itemStatus}>{item.status}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No receipts yet. Create your first receipt.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  greeting: { fontSize: 20, fontWeight: 'bold', color: '#1a1a2e' },
  subtitle: { fontSize: 14, color: '#666' },
  menu: { flexDirection: 'row', gap: 8 },
  menuItem: { padding: 8 },
  menuText: { color: '#1a1a2e', fontSize: 13, fontWeight: '600' },
  logout: { padding: 8 },
  logoutText: { color: '#e53935', fontSize: 14, fontWeight: '600' },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, backgroundColor: '#1a1a2e', borderRadius: 28, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },
  fabText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 8, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  itemInfo: { flex: 1 },
  itemId: { fontWeight: '600', color: '#1a1a2e', fontSize: 14 },
  itemClient: { color: '#666', fontSize: 12 },
  itemRight: { alignItems: 'flex-end' },
  itemAmount: { fontWeight: 'bold', color: '#1a1a2e', fontSize: 16 },
  itemStatus: { fontSize: 11, color: '#4caf50', textTransform: 'uppercase' },
  empty: { color: '#999', textAlign: 'center', marginTop: 40, fontSize: 14 },
});