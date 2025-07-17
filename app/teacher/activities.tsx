import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TeacherActivities() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Atividades</Text>
      <Text style={styles.placeholder}>Aqui você verá suas atividades criadas.</Text>
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