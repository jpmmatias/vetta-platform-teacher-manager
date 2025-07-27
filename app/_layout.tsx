import { Stack, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import * as React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { AppProvider, useApp } from '../components/AppContext';

const customTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#3b82f6',
    background: '#f9fafb',
    surface: '#fff',
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level0: '#fff',
      level1: '#fff',
      level2: '#fff',
      level3: '#fff',
      level4: '#fff',
      level5: '#fff',
    },
    outline: '#e5e7eb',
    onSurface: '#111827',
    onBackground: '#111827',
    secondary: '#6b7280',
  },
  roundness: 8,
};

function AppLayout() {
  const { userType, sidebarOpen, setSidebarOpen, isAuthenticated } = useApp();

  // Se não estiver autenticado, renderizar apenas o Slot para as telas de auth
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <Slot />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>
        <Header 
          userType={userType} 
          onMenuClick={() => setSidebarOpen(true)}
        />
        <Stack>
          <Stack.Screen 
            name="index" 
            options={{ 
              title: 'Vetta',
              headerShown: false 
            }} 
          />
          <Stack.Screen 
            name="teacher" 
            options={{ 
              headerShown: false 
            }} 
          />
          <Stack.Screen 
            name="manager" 
            options={{ 
              headerShown: false 
            }} 
          />
        </Stack>
      </View>
      
      {sidebarOpen && (
        <Sidebar 
          userType={userType} 
          onClose={() => setSidebarOpen(false)}
          visible={sidebarOpen}
        />
      )}
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <PaperProvider theme={customTheme}>
      <AppProvider>
        <AppLayout />
      </AppProvider>
      <StatusBar style="dark" backgroundColor="#f9fafb" />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  main: {
    flex: 1,
  },
}); 