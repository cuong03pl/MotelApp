import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FCC434",
        tabBarInactiveTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopColor: "#ccc",
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Trang chủ",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="compare"
        options={{
          headerShown: false,
          title: "So sánh",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="compare" size={size} color={color} />
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="profile/index"
        options={{
          headerShown: false,
          title: "Cá nhân",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" size={size} color={color} />
          ),
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}
