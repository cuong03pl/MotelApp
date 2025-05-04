import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetUserById, UpdateUser } from "../Services/ServiceAPI";
import { jwtDecode } from "jwt-decode";

export default function EditProfile() {
  const [userData, setUserData] = useState(null);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setUserData(null);
        setLoading(false);
        router.replace("/signin");
        return null;
      }
      
      const user_data = jwtDecode(token);
      const response = await GetUserById(user_data.sub);
      
      if (response && response.data) {
        setUserData(response.data);
        setFullName(response.data.fullName || "");
        setPhoneNumber(response.data.phoneNumber || "");
        return response.data;
      } else {
        setUserData(null);
        return null;
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      setUserData(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!userData) return;
    
    setUpdating(true);
    try {
    
      const response = await UpdateUser(userData.id, {
        phoneNumber: phoneNumber,
        fullName: fullName,
      });
      console.log("response", response);
      if (response && response.status === 200) {
        Alert.alert(
          "Thành công",
          "Cập nhật thông tin thành công",
          [{ text: "OK", onPress: () => router.back() }]
        );
      } else {
        Alert.alert(
          "Lỗi",
          "Có lỗi xảy ra khi cập nhật thông tin",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      Alert.alert(
        "Lỗi",
        "Có lỗi xảy ra khi cập nhật thông tin",
        [{ text: "OK" }]
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-xl font-bold mb-4">Bạn chưa đăng nhập</Text>
        <TouchableOpacity 
          className="bg-black p-4 rounded-md w-full items-center"
          onPress={() => router.replace("/signin")}
        >
          <Text className="text-white font-bold">Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="bg-primary h-full w-full px-4">
      <StatusBar style="auto" />
      
      <View className="mt-10 mb-6 items-center">
        <TouchableOpacity onPress={() => router.back()} className="absolute left-0 top-0">
          <Text className="text-white text-lg">← Quay lại</Text>
        </TouchableOpacity>
        
        <View className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden mb-4 mt-8">
          {userData.avatar ? (
            <Image 
              source={{ uri: userData.avatar }} 
              className="w-full h-full" 
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-gray-300 justify-center items-center">
              <Text className="text-2xl font-bold text-gray-500">
                {userData.fullName?.charAt(0) || userData.email?.charAt(0) || "U"}
              </Text>
            </View>
          )}
        </View>
        
        <Text className="text-xl font-bold text-white">{userData.email}</Text>
      </View>
      
      <View className="bg-white rounded-lg p-5 mb-8">
        <Text className="font-bold text-lg mb-4">Thông tin cá nhân</Text>
        
        <View className="mb-4">
          <Text className="text-gray-600 mb-1">Họ và tên</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 font-medium"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Nhập họ và tên"
          />
        </View>
        
        <View className="mb-4">
          <Text className="text-gray-600 mb-1">Số điện thoại</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-3 font-medium"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
          />
        </View>
      </View>
      
      <TouchableOpacity 
        className="bg-[#fa6819] rounded-lg p-4 mb-8 items-center"
        onPress={handleUpdate}
        disabled={updating}
      >
        {updating ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="font-bold text-white">Cập nhật thông tin</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
} 