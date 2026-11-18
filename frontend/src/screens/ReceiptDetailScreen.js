import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator, Linking, Share } from 'react-native';
import { receipts } from '../services/api';

export default function ReceiptDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReceipt();
  }, [id]);

  const loadReceipt = async () => {
    try {
      const res = await receipts.get(id);
      setReceipt(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  if (!receipt) return null;

  const sharePdf = async () => {
    try {
      const res = await receipts.pdf(id);
      const blob = new Blob([res.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        await Share.share({ url, title: `Receipt ${receipt.receipt_id}` });
        Linking.openURL(url);
      } catch (err) {
      console.error(err);
      }
    };

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Receipt {receipt.receipt_id}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Client</Text>
          <Text style={styles.value}>{receipt.client_name}</Text>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{receipt.client_phone}</Text>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.status}>{receipt.status}</Text>
          <Text style={styles.label}>Total</Text>
          <Text style={styles.total}>KSh {receipt.total_amount.toFixed(2)}</Text>
        <Text style={styles.label}>Items</Text>
          {receipt.items?.map((item) => (
            <View key={item.item_id} style={styles.itemRow}>
              <Text style={styles.itemDesc}>{item.description}</Text>
              <Text style={styles.itemAmt}>{item.quantity} × KSh {item.price.toFixed(2)} = KSh {(item.quantity * item.price).toFixed(2)}</Text>
            </View>
          ))}
          {receipt.terms_and_notes && (
            <>
              <Text style={styles.label}>Terms & Notes</Text>
            <Text style={styles.notes}>{receipt.terms_and_notes}</Text>
          </>
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={sharePdf}>
          <Text style={styles.actionText}>Share PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Verify', { receiptId: receipt.receipt_id })}>
          <Text style={styles.actionText}>Verify Receipt</Text>
        </TouchableOpacity>
        {receipt.status === 'SENT' && (
          <TouchableOpacity style={styles.actionButton} onPress={() => receipts.markViewed(id)}>
            <Text style={styles.actionText}>Mark as Viewed</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f7', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  back: { padding: 8 },
  backText: { fontSize: 24, color: '#1a1a2e' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1a1a2e', flex: 1 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, marginBottom: 16 },
  label: { fontSize: 12, color: '#999', textTransform: 'uppercase', marginBottom: 4 },
  value: { fontSize: 16, color: '#1a1a2e', marginBottom: 12 },
  status: { fontSize: 14, fontWeight: '600', color: '#4caf50', marginBottom: 12 },
  total: { fontSize: 20, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 12 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  itemDesc: { fontSize: 14, color: '#333' },
  itemAmt: { fontSize: 14, color: '#666' },
  notes: { fontSize: 14, color: '#333', fontStyle: 'italic' },
  actions: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, backgroundColor: '#1a1a2e', borderRadius: 8, padding: 14, alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});