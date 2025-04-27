import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  MaterialIcons,
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
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="cinemas"
        options={{
          headerShown: false,
          title: "Cinemas",
          tabBarIcon: ({ color, size }) => (
            <Feather name="film" size={size} color={color} />
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="ticket/index"
        options={{
          headerShown: false,
          title: "Ticket",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="ticket" color={color} size={size} />
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="movie/index"
        options={{
          headerShown: false,

          title: "Movie",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="camerao" size={size} color={color} />
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="profile/index"
        options={{
          headerShown: false,

          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="profile" size={size} color={color} />
          ),
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}
