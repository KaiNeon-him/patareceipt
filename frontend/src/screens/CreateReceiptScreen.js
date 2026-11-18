import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, FlatList, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { receipts } from '../services/api';

export default function CreateReceiptScreen({ navigation }) {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [terms, setTerms] = useState('');
  const [items, setItems] = useState([{ id: 1, description: '', quantity: 1, price: '' }]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const addItem = () => setItems([...items, { id: Date.now(), description: '', quantity: 1, price: '' }]);
  const removeItem = (id) => setItems(items.filter((i) => i.id !== id));
  const total = items.reduce((sum, i) => sum + (parseInt(i.quantity) || 0) * (parseFloat(i.price) || 0), 0);

  const handleSubmit = async () => {
    setError('');
    const validItems = items.filter((i) => i.description.trim() && i.price);
    if (validItems.length === 0) {
      setError('Add at least one item');
      return;
    }
    setSubmitting(true);
    try {
      await receipts.create({
        clientName,
        clientPhone,
        items: validItems.map((i) => ({ description: i.description, quantity: parseInt(i.quantity), price: parseFloat(i.price) })),
        termsAndNotes: terms,
      });
      navigation.navigate('Dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create receipt');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>New Receipt</Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <TextInput style={styles.input} placeholder="Item description" value={item.description} onChangeText={(t) => { const n = [...items]; n.find((x) => x.id === item.id).description = t; setItems(n); }} />
            <View style={styles.qtyPrice}>
              <TextInput style={styles.inputSmall} placeholder="Qty" value={String(item.quantity)} onChangeText={(t) => { const n = [...items]; n.find((x) => x.id === item.id).quantity = t; setItems(n); }} keyboardType="numeric" />
              <TextInput style={styles.inputSmall} placeholder="Price" value={String(item.price)} onChangeText={(t) => { const n = [...items]; n.find((x) => x.id === item.id).price = t; setItems(n); }} keyboardType="numeric" />
            </View>
            {items.length > 1 && <TouchableOpacity style={styles.remove} onPress={() => removeItem(item.id)}><Text style={styles.removeText}>×</Text></TouchableOpacity>}
          </View>
        )}
      />
      <TouchableOpacity style={styles.addItem} onPress={addItem}>
        <Text style={styles.addItemText}>+ Add another item</Text>
      </TouchableOpacity>
      <TextInput style={styles.input} placeholder="Terms & notes (optional)" value={terms} onChangeText={setTerms} multiline numberOfLines={3} />
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? 'Creating...' : 'Generate & Share'}</Text>
      </TouchableOpacity>
      <Text style={styles.total}>Total: KSh {total.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f7', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  back: { padding: 8 },
  backText: { fontSize: 24, color: '#1a1a2e' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1a1a2e', flex: 1 },
  itemRow: { flexDirection: 'row', gap: 8, marginBottom: 12, backgroundColor: '#fff', padding: 12, borderRadius: 8 },
  input: { flex: 2, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 14 },
  inputSmall: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 14 },
  qtyPrice: { flex: 1, flexDirection: 'row', gap: 8 },
  remove: { padding: 8, justifyContent: 'center' },
  removeText: { color: '#e53935', fontSize: 20 },
  addItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  addItemText: { color: '#1a1a2e', fontSize: 14, fontWeight: '600' },
  error: { color: '#e53935', fontSize: 12, marginBottom: 12 },
  button: { backgroundColor: '#1a1a2e', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  total: { marginTop: 16, fontSize: 16, fontWeight: 'bold', color: '#1a1a2e', textAlign: 'right' },
});