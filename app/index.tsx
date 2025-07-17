import React from 'react';
import { View, StyleSheet } from 'react-native';
import TeacherDashboard from '../components/TeacherDashboard';
import ManagerDashboard from '../components/ManagerDashboard';
import { useApp } from '../components/AppContext';

export default function App() {
  const { userType } = useApp();

  return (
    <View style={styles.container}>
      {userType === 'teacher' ? <TeacherDashboard /> : <ManagerDashboard />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
}); 