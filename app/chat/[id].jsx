import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { GetMessages, SendMessage, GetUserById } from '../Services/ServiceAPI';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef();
  const pollingInterval = useRef(null);
  
  const { id, partnerId, partnerName, partnerAvatar } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchCurrentUser();
    fetchMessages();

    // Setup polling for new messages
    pollingInterval.current = setInterval(() => {
      fetchMessages(false);
    }, 5000); // Poll every 5 seconds

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [id]);

  const fetchCurrentUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.replace('/signin');
        return;
      }
      
      const decoded = jwtDecode(token);
      const userId = decoded.sub;
      
      // Get full user data
      const userResponse = await GetUserById(userId);
      setUser(userResponse.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchMessages = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    
    try {
      const response = await GetMessages(id);
      if (response && response.data) {
        // Sort messages by creation time
        const sortedMessages = response.data.sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );
        
        setMessages(sortedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Don't show error alerts on every polling attempt
      if (showLoading) {
        // Check if there are any messages already loaded
        if (messages.length === 0) {
          // Only show the alert if we have no messages at all
          Alert.alert(
            'Lỗi kết nối',
            'Không thể tải tin nhắn. Vui lòng thử lại sau.',
            [
              { text: 'Thử lại', onPress: () => fetchMessages(true) },
              { text: 'Quay lại', onPress: () => router.back() }
            ]
          );
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    
    setIsSending(true);
    
    // Store the message content before clearing the input
    const messageContent = newMessage.trim();
    
    // Optimistically add message to UI
    const tempId = Date.now().toString();
    const optimisticMessage = {
      id: tempId,
      conversationId: id,
      senderId: user.id,
      message: messageContent,
      createdAt: new Date().toISOString(),
      _isOptimistic: true
    };
    
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
    
    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({animated: true});
    }, 100);
    
    // Track retries
    let retries = 0;
    const maxRetries = 2;
    
    const attemptSend = async () => {
        console.log("Sending message with content:", messageContent
            , "to conversationId:", id
            , "with senderId:", user.id
        );
        
      try {
        await SendMessage({
          conversationId: id,
          message: messageContent,
          senderId: user.id
        });
        
        // Remove the optimistic message and fetch updated messages
        fetchMessages(false);
      } catch (error) {
        console.error(`Error sending message (attempt ${retries + 1}):`, error);
        console.log("Error details:", error.response?.data || "No detailed error info");
        
        if (retries < maxRetries) {
          // Retry sending the message
          retries++;
          setTimeout(attemptSend, 1000 * retries); // Exponential backoff
        } else {
          // After max retries, show error and provide retry option
          setMessages(prev => prev.filter(msg => msg.id !== tempId));
          
          Alert.alert(
            'Lỗi gửi tin nhắn',
            'Không thể gửi tin nhắn của bạn. Bạn muốn thử lại?',
            [
              {
                text: 'Thử lại',
                onPress: () => {
                  // Re-add the optimistic message
                  setMessages(prev => [...prev, {
                    ...optimisticMessage,
                    id: Date.now().toString() // New tempId
                  }]);
                  // Reset retry counter and try again
                  retries = 0;
                  attemptSend();
                }
              },
              {
                text: 'Huỷ',
                style: 'cancel'
              }
            ]
          );
        }
      }
    };
    
    // Start the attempt
    attemptSend();
    setIsSending(false);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatMessageTime = (timestamp) => {
    console.log("timestamp", timestamp);
    
    if (!timestamp) return "";

    try {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
      return "";
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#4b7bec" />
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
        
        <View className="flex-row items-center ml-4 flex-1">
          <View className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            {partnerAvatar ? (
              <Image 
                source={{ uri: partnerAvatar }} 
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full justify-center items-center">
                <Text className="text-xl font-bold text-gray-400">
                  {partnerName?.charAt(0)}
                </Text>
              </View>
            )}
          </View>
          <Text className="text-lg font-bold ml-3 flex-1" numberOfLines={1}>
            {partnerName || 'Người dùng'}
          </Text>
        </View>
      </View>
      
      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{padding: 16}}
          inverted={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({animated: false})}
          onLayout={() => flatListRef.current?.scrollToEnd({animated: false})}
          renderItem={({ item }) => (
            <View 
              className={`flex-row my-1 ${item.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              {item.senderId !== user?.id && (
                <View className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2">
                  {partnerAvatar ? (
                    <Image 
                      source={{ uri: partnerAvatar }} 
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-full justify-center items-center">
                      <Text className="text-sm font-bold text-gray-400">
                        {partnerName?.charAt(0) || '?'}
                      </Text>
                    </View>
                  )}
                </View>
              )}
              
              <View 
                className={`max-w-[80%] p-3 rounded-lg ${
                  item.senderId === user?.id 
                    ? 'bg-blue-500 rounded-tr-none' 
                    : 'bg-gray-200 rounded-tl-none'
                } ${item._isOptimistic ? 'opacity-70' : ''}`}
              >
                <Text 
                  className={`${item.senderId === user?.id ? 'text-white' : 'text-black'}`}
                >
                  {item.content}
                </Text>
                <Text 
                  className={`text-xs mt-1 ${
                    item.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {formatMessageTime(item.timestamp)}
                  {item._isOptimistic && ' • Đang gửi...'}
                </Text>
              </View>
            </View>
          )}
        />
        
        {/* Message Input */}
        <View className="flex-row items-center px-4 py-2 border-t border-gray-200 bg-white">
          <TextInput
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 bg-gray-100"
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity 
            className={`ml-2 p-2 rounded-full ${
              newMessage.trim() ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onPress={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen; 