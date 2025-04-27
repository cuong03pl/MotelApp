import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Button, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function App() {
 

  
  return (
    <View className="bg-primary h-full w-full">
     
      <Redirect href={"/home"} />
      {/* <Redirect href={"/signin"} /> */}
    </View>
  );
}
