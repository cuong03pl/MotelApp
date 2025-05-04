import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Login, GetUserByToken } from "../Services/ServiceAPI";
import { getTokenData } from "../utils/jwt";

export default function signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    checkExistingToken();
  }, []);

  const checkExistingToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        // Verify if token is valid before redirecting
        const userData = await GetUserByToken(token);
        if (userData && userData.data) {
          router.replace("/home");
        }
      }
    } catch (error) {
      console.error("Error checking existing token:", error);
      // If there's an error, we'll just continue with the login screen
    }
  };

  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu");
      return;
    }

    setLoading(true);

    try {
      // Call the real login API
      const response = await Login({
        email: email.trim(),
        password: password.trim()
      });
      
      
      // Kiểm tra cấu trúc response trước khi truy cập properties
      if (response && response.data) {
        const token = response.data.token || response.data;
        
        // Kiểm tra token có tồn tại không
        if (!token) {
          Alert.alert("Lỗi", "Không tìm thấy token đăng nhập, vui lòng thử lại sau");
          setLoading(false);
          return;
        }
        
        // Save token to AsyncStorage
        await AsyncStorage.setItem("token", token);
        
        // Get user data from token
        const userData = getTokenData(token);
        if (userData) {
          // You can save additional user data if needed
          await AsyncStorage.setItem("userData", JSON.stringify(userData));
        }
        
        // Redirect to home screen
        router.replace("/home");
      } else {
        Alert.alert("Lỗi", "Đăng nhập thất bại, vui lòng kiểm tra lại thông tin");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      let errorMessage = "Đăng nhập thất bại, vui lòng thử lại";
      
      // Handle specific error messages from API if available
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert("Lỗi", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-5 justify-center">
      <Text className="text-2xl font-bold mb-5 text-center">Đăng nhập</Text>
      
      <TextInput
        className="border border-gray-300 rounded-md p-3 mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        className="border border-gray-300 rounded-md p-3 mb-4"
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity 
        className="bg-black p-4 rounded-md items-center mb-4"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold">Đăng nhập</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text className="text-blue-600 text-center">
          Chưa có tài khoản? Đăng ký ngay
        </Text>
      </TouchableOpacity>
    </View>
  );
}
