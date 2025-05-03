import React from 'react';
import { Stack } from 'expo-router';

export default function ChatLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="new" />
      <Stack.Screen name="[id]" options={{
        // Hide the header or set a title if you want
        headerShown: false,
      }} />
    </Stack>
  );
} 