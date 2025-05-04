import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Register, Login } from "../Services/ServiceAPI";
import { getTokenData } from "../utils/jwt";

export default function signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // Form validation
    if (fullName.trim() === "" || email.trim() === "" || password.trim() === "" || phoneNumber.trim() === "") {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);

    try {
      // Register user
      const registerResponse = await Register({
        fullName: fullName.trim(),
        email: email.trim(),
        password: password.trim(),
        phoneNumber: phoneNumber.trim()
      });


      if (registerResponse && registerResponse.data) {
        // Auto login after successful registration
        const loginResponse = await Login({
          email: email.trim(),
          password: password.trim()
        });

        if (loginResponse && loginResponse.data) {
          const token = loginResponse.data.token || loginResponse.data;
          
          // Save token to AsyncStorage
          await AsyncStorage.setItem("token", token);
          
          // Get user data from token
          const userData = getTokenData(token);
          if (userData) {
            await AsyncStorage.setItem("userData", JSON.stringify(userData));
          }
          
          Alert.alert("Thành công", "Đăng ký tài khoản thành công", [
            { text: "OK", onPress: () => router.replace("/home") }
          ]);
        } else {
          // If auto-login fails, just redirect to login page
          Alert.alert("Thành công", "Đăng ký thành công, vui lòng đăng nhập", [
            { text: "OK", onPress: () => router.replace("/signin") }
          ]);
        }
      } else {
        Alert.alert("Lỗi", "Đăng ký thất bại, vui lòng thử lại sau");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      let errorMessage = "Đăng ký thất bại, vui lòng thử lại";
      
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 p-5 justify-center">
        <Text className="text-2xl font-bold mb-5 text-center">Đăng ký tài khoản</Text>
        
        <TextInput
          className="border border-gray-300 rounded-md p-3 mb-4"
          placeholder="Họ và tên"
          value={fullName}
          onChangeText={setFullName}
        />
        
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
          placeholder="Số điện thoại"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        
        <TextInput
          className="border border-gray-300 rounded-md p-3 mb-4"
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TextInput
          className="border border-gray-300 rounded-md p-3 mb-4"
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        
        <TouchableOpacity 
          className="bg-black p-4 rounded-md items-center mb-4"
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold">Đăng ký</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push("/signin")}>
          <Text className="text-blue-600 text-center">
            Đã có tài khoản? Đăng nhập ngay
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
