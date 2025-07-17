import { Stack } from 'expo-router';

export default function TeacherLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="classes" />
      <Stack.Screen name="activities" />
      <Stack.Screen name="ai-correction" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="schedule" />
      <Stack.Screen name="feedback" />
    </Stack>
  );
} 