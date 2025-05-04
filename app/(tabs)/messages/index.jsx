import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Alert
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetConversations, GetUserById } from "../../Services/ServiceAPI";
import { StatusBar } from "expo-status-bar";
import { jwtDecode } from "jwt-decode";
import { Ionicons } from "@expo/vector-icons";

export default function MessagesScreen() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUserAndConversations();
  }, []);
  
  // Thêm polling để tự động cập nhật cuộc trò chuyện
  useEffect(() => {
    if (userId) {
      const interval = setInterval(() => {
        fetchConversations(userId, false); // không hiển thị loading khi auto-refresh
      }, 30000); // Cập nhật mỗi 30 giây
      
      return () => clearInterval(interval);
    }
  }, [userId]);

  useEffect(() => {
    if (conversations.length > 0) {
      const filtered = conversations.filter(conversation => 
        conversation.partner?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations]);

  const loadUserAndConversations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get user ID from token
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/signin");
        return;
      }
      
      const decoded = jwtDecode(token);
      const currentUserId = decoded.sub || decoded.userId;
      setUserId(currentUserId);
      
      // Load conversations
      await fetchConversations(currentUserId, true);
    } catch (error) {
      console.error("Error loading user data and conversations:", error);
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async (userId, showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    
    try {
      const response = await GetConversations(userId);
      
      if (response && response.data) {
        // Process conversations to add partner information
        const conversationsWithPartners = await Promise.all(
          response.data.map(async (conversation) => {
            // Determine if the partner is sender or receiver
            const partnerId = 
              conversation.senderId === userId 
                ? conversation.receiverId 
                : conversation.senderId;
            
            
            // Get partner user data
            try {
              const userResponse = await GetUserById(partnerId);
              const lastMessageContent = conversation.lastMessage || "Bắt đầu cuộc trò chuyện...";
              
              return {
                ...conversation,
                partner: userResponse.data,
                lastActive: conversation.updatedAt || conversation.createdAt,
                lastMessage: lastMessageContent
              };
            } catch (error) {
              console.error("Error fetching partner data:", error);
              return {
                ...conversation,
                partner: { fullName: "Unknown User", id: partnerId },
                lastActive: conversation.updatedAt || conversation.createdAt,
                lastMessage: conversation.lastMessage || "Bắt đầu cuộc trò chuyện..."
              };
            }
          })
        );
        
        
        // Sort by last message date
        const sortedConversations = conversationsWithPartners.sort((a, b) => 
          new Date(b.lastActive) - new Date(a.lastActive)
        );
        
        setConversations(sortedConversations);
        setFilteredConversations(sortedConversations);
        setError(null);
      } else {
        console.error("Invalid response format:", response);
        setError("Dữ liệu không hợp lệ. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setError("Không thể tải tin nhắn. Vui lòng thử lại sau.");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    
    if (userId) {
      await fetchConversations(userId, false);
    } else {
      // If no userId, try to reload user data
      await loadUserAndConversations();
    }
    
    setRefreshing(false);
  };

  const getLastMessageTime = (timestamp) => {
    if (!timestamp) return "";
    
    const messageDate = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - messageDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today: Show time
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Yesterday
      return "Hôm qua";
    } else if (diffDays < 7) {
      // Within a week
      const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      return days[messageDate.getDay()];
    } else {
      // More than a week
      return `${messageDate.getDate()}/${messageDate.getMonth() + 1}`;
    }
  };

  const navigateToChat = (conversation) => {
    if (!conversation.id || !conversation.partner?.id) {
      Alert.alert("Lỗi", "Không thể mở cuộc trò chuyện này. Vui lòng thử lại sau.");
      return;
    }
    
    router.push({
      pathname: "/chat/[id]",
      params: { 
        id: conversation.id,
        partnerId: conversation.partner.id,
        partnerName: conversation.partner.fullName || "Người dùng"
      }
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="bg-white pt-12 pb-4 px-4 border-b border-gray-200">
        <Text className="text-2xl font-bold">Tin nhắn</Text>
        
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-full mt-4 px-4 py-2">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Tìm kiếm cuộc trò chuyện"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="gray" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Error Message */}
      {error && (
        <View className="bg-red-100 p-3 mx-4 mt-2 rounded-md">
          <Text className="text-red-700">{error}</Text>
          <TouchableOpacity 
            className="bg-red-500 py-1 px-3 rounded mt-2 self-end"
            onPress={handleRefresh}
          >
            <Text className="text-white">Thử lại</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Conversations List */}
      {!error && filteredConversations.length === 0 ? (
        <View className="flex-1 justify-center items-center p-4">
          <Ionicons name="chatbubble-ellipses-outline" size={70} color="#CCCCCC" />
          <Text className="text-lg text-gray-400 mt-4 text-center">
            {searchQuery 
              ? "Không tìm thấy cuộc trò chuyện nào"
              : "Bạn chưa có cuộc trò chuyện nào"}
          </Text>
          {!searchQuery && (
            <Text className="text-gray-400 mt-1 text-center">
              Bắt đầu trò chuyện từ các bài đăng trong ứng dụng
            </Text>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              className="p-4 border-b border-gray-200 flex-row items-center"
              onPress={() => navigateToChat(item)}
            >
              {/* User Avatar */}
              <View className="w-14 h-14 rounded-full overflow-hidden bg-gray-200">
                {item.partner?.avatar ? (
                  <Image 
                    source={{ uri: item.partner.avatar }} 
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-full justify-center items-center">
                    <Text className="text-2xl font-bold text-gray-400">
                      {item.partner?.fullName?.charAt(0) || "?"}
                    </Text>
                  </View>
                )}
              </View>
              
              {/* Message Preview */}
              <View className="flex-1 ml-3">
                <View className="flex-row justify-between items-center">
                  <Text className="font-bold text-base" numberOfLines={1}>
                    {item.partner?.fullName || "Người dùng"}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    {getLastMessageTime(item.lastActive)}
                  </Text>
                </View>
                
                <Text className="text-gray-600 mt-1" numberOfLines={1}>
                  {item.lastMessageContent || "Bắt đầu cuộc trò chuyện..."}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              colors={["#000"]}
            />
          }
        />
      )}
    </View>
  );
} 