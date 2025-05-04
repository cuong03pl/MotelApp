import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetUserById } from "../../Services/ServiceAPI";
import { jwtDecode } from "jwt-decode";

export default function profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

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
        return null;
      }
      console.log("token", token);
      const user_data = jwtDecode(token);
      const response = await GetUserById(user_data.sub);
      console.log("response", response?.data);
      if (response && response.data) {
        setUserData(response.data);
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

  const logoutUser = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUserData(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        { 
          text: "Đăng xuất",
          onPress: async () => {
            await logoutUser();
            router.replace("/signin");
          }
        }
      ]
    );
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
    <View className="bg-primary h-full w-full pb-[140px] px-[16px]">
      <StatusBar style="auto" />
      
      <View className="mt-10 items-center">
        <View className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden mb-4">
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
        
        <Text className="text-xl font-bold text-white">{userData.fullName || "Người dùng"}</Text>
        <Text className="text-gray-500">{userData.email}</Text>
      </View>
      
      <View className="mt-8">
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="font-bold text-lg mb-4">Thông tin cá nhân</Text>
          
          <View className="mb-3">
            <Text className="text-gray-500 mb-1">Họ và tên</Text>
            <Text className="font-medium">{userData.fullName || "Chưa cập nhật"}</Text>
          </View>
          
          <View className="mb-3">
            <Text className="text-gray-500 mb-1">Email</Text>
            <Text className="font-medium">{userData.email}</Text>
          </View>
          
          <View className="mb-3">
            <Text className="text-gray-500 mb-1">Số điện thoại</Text>
            <Text className="font-medium">{userData.phoneNumber || "Chưa cập nhật"}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          className="bg-white rounded-lg p-4 mb-4"
          onPress={() => router.push("/post/user-posts")}
        >
          <Text className="font-bold">Bài đăng của tôi</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-white rounded-lg p-4 mb-4"
          onPress={() => router.push("/favorites")}
        >
          <Text className="font-bold">Bài đăng đã lưu</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-red-500 rounded-lg p-4 mb-4 items-center"
          onPress={handleLogout}
        >
          <Text className="font-bold text-white">Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
