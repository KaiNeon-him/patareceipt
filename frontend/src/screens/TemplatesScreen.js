import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, FlatList } from 'react-native';

export default function TemplatesScreen({ navigation }) {
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Standard', color: '#1a1a2e', isDefault: true },
    { id: 2, name: 'Modern', color: '#2563eb', isDefault: false },
    { id: 3, name: 'Minimal', color: '#6b7280', isDefault: false },
  ]);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#1a1a2e');

  const addTemplate = () => {
    if (!newName.trim()) return;
    setTemplates([...templates, { id: Date.now(), name: newName, color: newColor, isDefault: false }]);
    setNewName('');
  };

  const setDefault = (id) => {
    setTemplates(templates.map((t) => ({ ...t, isDefault: t.id === id })));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Templates</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Template Name</Text>
        <TextInput style={styles.input} value={newName} onChangeText={setNewName} placeholder="e.g. Professional" />
        <Text style={styles.label}>Primary Color</Text>
        <TextInput style={styles.input} value={newColor} onChangeText={setNewColor} placeholder="#1a1a2e" />
        <TouchableOpacity style={styles.button} onPress={addTemplate}>
          <Text style={styles.buttonText}>Add Template</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={templates}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.templateRow}>
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
            <Text style={styles.templateName}>{item.name}</Text>
            {item.isDefault && <Text style={styles.defaultBadge}>Default</Text>}
            <TouchableOpacity style={styles.setDefault} onPress={() => setDefault(item.id)}>
              <Text style={styles.setDefaultText}>{item.isDefault ? 'Default' : 'Set Default'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f7' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  back: { padding: 8 },
  backText: { fontSize: 24, color: '#1a1a2e' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1a1a2e', flex: 1 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, margin: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  label: { fontSize: 12, color: '#999', textTransform: 'uppercase', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 14 },
  button: { backgroundColor: '#1a1a2e', borderRadius: 8, padding: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  templateRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 8, borderRadius: 12 },
  colorDot: { width: 20, height: 20, borderRadius: 10, marginRight: 12 },
  templateName: { fontSize: 14, color: '#1a1a2e', fontWeight: '600', flex: 1 },
  defaultBadge: { fontSize: 11, color: '#4caf50', fontWeight: '600', textTransform: 'uppercase', marginRight: 12 },
  setDefault: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#1a1a2e', borderRadius: 6 },
  setDefaultText: { color: '#1a1a2e', fontSize: 12, fontWeight: '600' },
});