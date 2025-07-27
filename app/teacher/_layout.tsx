import { Stack } from 'expo-router';

export default function TeacherLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="classes" />
      <Stack.Screen name="activities" />
      <Stack.Screen name="activity-detail" />
      <Stack.Screen name="create-activity" />
      <Stack.Screen name="submission-detail" />
      <Stack.Screen name="corrections" />
      <Stack.Screen name="ai-correction" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="report-view" />
      <Stack.Screen name="schedule" />
      <Stack.Screen name="feedback" />
    </Stack>
  );
} 