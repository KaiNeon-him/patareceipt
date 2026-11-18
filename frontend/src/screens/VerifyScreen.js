import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator, ScrollView } from 'react-native';
import { receipts } from '../services/api';

export default function VerifyScreen({ navigation }) {
  const [receiptId, setReceiptId] = useState('');
  [, setError] = useState('');
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await receipts.get(receiptId);
      setVerification(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Receipt not found');
      setVerification(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Verify Receipt</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.label}>Receipt ID</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. PR-8842A"
            value={receiptId}
            onChangeText={setReceiptId}
            autoCapitalize="characters"
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify'}</Text>
          </TouchableOpacity>
        </View>
        {verification && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Receipt Verified ✓</Text>
            <Text style={styles.muted}>Tamper-proof record confirmed by PataReceipt</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Receipt ID</Text>
              <Text style={styles.detailValue}>{verification.receipt_id}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Client</Text>
              <Text style={styles.detailValue}>{verification.client_name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total</Text>
              <Text style={styles.detailValue}>KSh {verification.total_amount.toFixed(2)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={styles.status}>{verification.status}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Items</Text>
              <Text style={styles.detailValue}>{verification.items?.length || 0}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f7' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  back: { padding: 8 },
  backText: { fontSize: 24, color: '#1a1a2e' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1a1a2e', flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, marginBottom: 16 },
  label: { fontSize: 12, color: '#999', textTransform: 'uppercase', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 14 },
  error: { color: '#e53935', fontSize: 12, marginBottom: 12 },
  button: { backgroundColor: '#1a1a2e', borderRadius: 8, padding: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  resultCard: { backgroundColor: '#e8f5e9', borderRadius: 12, padding: 16, marginBottom: 16 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', color: '#2e7d32', marginBottom: 8 },
  muted: { fontSize: 13, color: '#666', marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  detailLabel: { fontSize: 13, color: '#666' },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#1a1a2e' },
  status: { fontSize: 13, fontWeight: '600', color: '#4caf50' },
});