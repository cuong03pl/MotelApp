import { Stack } from 'expo-router';

export default function FavoritesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
        animation: 'slide_from_right',
        navigationBarHidden: true, 
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "", 
          href: {
            pathname: "/favorites"
          },
        }}
      />
    </Stack>
  );
} 