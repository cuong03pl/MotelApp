import React from "react";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="[slug]"
        options={{
          headerShown: true,
          headerTitle: "Chi tiết tin tức",
          headerTintColor: "#000",
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
} 