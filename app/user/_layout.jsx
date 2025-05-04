import { Stack } from "expo-router";
import { View } from "react-native";

export default function UserLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="edit-profile"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
} 