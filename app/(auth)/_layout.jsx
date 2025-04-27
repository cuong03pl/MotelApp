import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="signin"
        options={{
          headerStyle: {
            backgroundColor: "#000000",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: "#ffffff",
          },
          headerTitle: "Đăng nhập",
          headerTintColor: "#ffffff",
        }}
      ></Stack.Screen>
      <Stack.Screen
        name="signup"
        options={{
          headerStyle: {
            backgroundColor: "#000000",
          },
          headerTitleAlign: "center",
          headerTitleStyle: {
            color: "#ffffff",
          },
          headerTitle: "Đăng kí",
          headerTintColor: "#ffffff",
        }}
      ></Stack.Screen>
    </Stack>
  );
}
