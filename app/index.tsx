import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import TeacherDashboard from '../components/TeacherDashboard';
import ManagerDashboard from '../components/ManagerDashboard';
import { useApp } from '../components/AppContext';
import { router } from 'expo-router';

export default function App() {
  const { userType, isAuthenticated } = useApp();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated]);

  // Se não estiver autenticado, não renderizar nada
  if (!isAuthenticated) {
    return null;
  }

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