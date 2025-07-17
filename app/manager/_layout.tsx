import { Stack } from 'expo-router';

export default function ManagerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="users" />
      <Stack.Screen name="institution" />
      <Stack.Screen name="ai-insights" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="settings" />
    </Stack>
  );
} 