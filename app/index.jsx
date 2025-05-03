import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Button, Image, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      // Check for different possible token keys
      const userToken = await AsyncStorage.getItem('userToken');
      const token = await AsyncStorage.getItem('token');
      
      console.log('Checking login status:');
      console.log('userToken:', userToken);
      console.log('token:', token);
      
      // If either token exists, consider user as logged in
      setIsLoggedIn(userToken !== null || token !== null);
      setLoading(false);
    } catch (error) {
      console.error('Error checking login status:', error);
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <View className="bg-primary h-full w-full items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
  
  return (
    <View className="bg-primary h-full w-full">
      {isLoggedIn ? (
        <Redirect href={"/home"} />
      ) : (
        <Redirect href={"/signin"} />
      )}
    </View>
  );
}
