import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ManagerDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard do Gestor</Text>
      <Text style={styles.placeholder}>Aqui você verá os dados gerais da instituição.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  placeholder: {
    fontSize: 16,
    color: '#6b7280',
  },
}); 