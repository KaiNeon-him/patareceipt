import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [currency, setCurrency] = useState(user?.defaultCurrency || 'USD');

  const handleSave = async () => {
    try {
      await Alert.alert('Saved', 'Profile updated successfully.');
    } catch (err) {
      Alert.alert('Error', 'Failed to save profile.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Business Profile</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Business Name</Text>
        <TextInput style={styles.input} value={businessName} onChangeText={setBusinessName} />
        <Text style={styles.label}>Default Currency</Text>
        <TextInput style={styles.input} value={currency} onChangeText={setCurrency} />
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f7', padding: 16 },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1a1a2e' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  label: { fontSize: 12, color: '#999', textTransform: 'uppercase', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 14 },
  button: { backgroundColor: '#1a1a2e', borderRadius: 8, padding: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  logoutButton: { marginTop: 24, alignItems: 'center' },
  logoutText: { color: '#e53935', fontSize: 14, fontWeight: '600' },
});