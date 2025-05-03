import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { CreateConversation, SendMessage, GetUserById, GetConversations } from '../Services/ServiceAPI';

const NewChatScreen = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingExisting, setIsCheckingExisting] = useState(true);
  
  const { receiverId, receiverName, receiverAvatar, postId, postTitle } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert(
          'Cần đăng nhập', 
          'Vui lòng đăng nhập để tiếp tục', 
          [{ text: 'OK', onPress: () => router.replace('/signin') }]
        );
        return;
      }
      
      const decoded = jwtDecode(token);
      const userId = decoded.sub;
      
      // Get full user data
      const userResponse = await GetUserById(userId);
      setCurrentUser(userResponse.data);
      
      // Check for existing conversation
      checkExistingConversation(userResponse.data.id);
    } catch (error) {
      console.error('Error fetching current user:', error);
      setIsCheckingExisting(false);
    }
  };
  
  const checkExistingConversation = async (userId) => {
    try {
      // Get all conversations for the current user
      const conversationsResponse = await GetConversations(userId);
      
      if (conversationsResponse && conversationsResponse.data) {
        // Look for a conversation with the receiver
        const existingConversation = conversationsResponse.data.find(
          conversation => 
            (conversation.senderId === userId && conversation.receiverId === receiverId) ||
            (conversation.senderId === receiverId && conversation.receiverId === userId)
        );
        
        if (existingConversation) {
          console.log("Found existing conversation:", existingConversation.id);
          // Navigate to the existing conversation
          navigateToConversation(existingConversation.id);
          return;
        }
      }
      
      // No existing conversation found, ready for creating a new one
      setIsCheckingExisting(false);
    } catch (error) {
      console.error("Error checking existing conversations:", error);
      setIsCheckingExisting(false);
    }
  };

  const handleStartChat = async () => {
    if (!message.trim() || !currentUser) return;
    
    setLoading(true);
    
    // Store message content
    const messageContent = message.trim();
    
    try {
      // Create new conversation
      const response = await CreateConversation({
        senderId: currentUser.id,
        receiverId: receiverId
      });
      
      if (response && response.data) {
        const conversationId = response.data.id;
        
        // Track send message attempts
        let sendAttempts = 0;
        const maxAttempts = 3;
        
        const attemptSendMessage = async () => {
          try {
            // Try to send the first message
            await SendMessage({
              conversationId: conversationId,
              message: messageContent,
              senderId: currentUser.id
            });
            
            // Message sent successfully, navigate to conversation
            navigateToConversation(conversationId);
          } catch (error) {
            console.error(`Error sending first message (attempt ${sendAttempts + 1}):`, error);
            console.log("Error details:", error.response?.data || "No detailed error info");
            
            if (sendAttempts < maxAttempts) {
              // Retry sending
              sendAttempts++;
              await new Promise(resolve => setTimeout(resolve, 1000));
              attemptSendMessage();
            } else {
              // After max retries, still navigate to conversation
              // The user can try sending the message again there
              Alert.alert(
                'Lưu ý',
                'Cuộc trò chuyện đã được tạo nhưng tin nhắn đầu tiên không thể gửi. Bạn có thể thử gửi lại.',
                [{ text: 'OK' }]
              );
              navigateToConversation(conversationId);
            }
          }
        };
        
        // Start the send message attempt
        attemptSendMessage();
      } else {
        Alert.alert('Lỗi', 'Không thể tạo cuộc trò chuyện. Vui lòng thử lại sau.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      Alert.alert(
        'Lỗi kết nối',
        'Không thể tạo cuộc trò chuyện. Vui lòng thử lại sau.',
        [
          { 
            text: 'Thử lại', 
            onPress: () => handleStartChat() 
          },
          { 
            text: 'Huỷ', 
            style: 'cancel',
            onPress: () => setLoading(false)
          }
        ]
      );
    }
  };
  
  const navigateToConversation = (conversationId) => {
    router.replace({
      pathname: '/chat/[id]',
      params: {
        id: conversationId,
        partnerId: receiverId,
        partnerName: receiverName,
        partnerAvatar: receiverAvatar
      }
    });
  };

  if (isCheckingExisting) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#4b7bec" />
        <Text className="mt-4 text-gray-500">Đang kiểm tra cuộc trò chuyện...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Header */}
      <View className="flex-row items-center border-b border-gray-200 px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold ml-4">Tin nhắn mới</Text>
      </View>
      
      {/* Recipient Info */}
      <View className="p-4 border-b border-gray-200">
        <Text className="text-lg font-bold mb-2">Gửi đến:</Text>
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
            {receiverAvatar ? (
              <Image 
                source={{ uri: receiverAvatar }} 
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full justify-center items-center">
                <Text className="text-2xl font-bold text-gray-400">
                  {receiverName?.charAt(0) || '?'}
                </Text>
              </View>
            )}
          </View>
          <View className="ml-3">
            <Text className="font-bold text-lg">{receiverName || 'Người dùng'}</Text>
            {postTitle && (
              <Text className="text-gray-500">Về: {postTitle}</Text>
            )}
          </View>
        </View>
      </View>
      
      {/* Message Input */}
      <View className="p-4 flex-1">
        <Text className="text-lg font-bold mb-2">Tin nhắn:</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 h-32"
          placeholder="Nhập tin nhắn của bạn..."
          value={message}
          onChangeText={setMessage}
          multiline
          textAlignVertical="top"
        />
        
        <TouchableOpacity 
          className={`mt-4 py-3 rounded-lg flex-row justify-center items-center ${
            message.trim() ? 'bg-blue-500' : 'bg-gray-300'
          }`}
          onPress={handleStartChat}
          disabled={!message.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="send" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Gửi tin nhắn</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NewChatScreen; 