import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="(auth)"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="post"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="news"
        options={{ headerShown: false }}
      ></Stack.Screen>
    </Stack>
  );
}
