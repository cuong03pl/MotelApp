import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { Ionicons } from '@expo/vector-icons';
import { GetUserFavorite, GetUserById } from '../Services/ServiceAPI';
import FavoritePostItem from '../components/FavoritePostItem';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    try {
      setError(null);
      
      // Kiểm tra token và lấy thông tin user
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        router.push('/signin');
        return;
      }

      const user_data = jwtDecode(token);
      const userResponse = await GetUserById(user_data.sub);
      setUser(userResponse.data);

      // Lấy danh sách bài đăng yêu thích
      const favoriteResponse = await GetUserFavorite(user_data.sub);
      console.log("Favorite posts count:", favoriteResponse.data?.length || 0);
      // Thêm userId vào mỗi item để sử dụng khi gọi API xóa yêu thích
      const favoritesWithUserId = favoriteResponse.data.map(item => ({
        ...item,
        userId: userResponse.data.id
      }));
      setFavorites(favoritesWithUserId);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Không thể tải danh sách yêu thích');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFavorites();
  };

  const handleRemoveFavorite = (postId) => {
    // Cập nhật UI ngay sau khi xóa thành công
    setFavorites(prevFavorites => prevFavorites.filter(item => item.id !== postId));
  };

  const renderEmpty = () => (
    <View className="flex-1 justify-center items-center py-20">
      <Ionicons name="heart-outline" size={80} color="#ccc" />
      <Text className="text-lg text-gray-500 mt-4">Bạn chưa có bài đăng yêu thích nào</Text>
      <TouchableOpacity 
        className="mt-4 bg-blue-500 py-3 px-6 rounded-lg"
        onPress={() => router.push('/')}
      >
        <Text className="text-white font-bold">Tìm kiếm phòng trọ</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2">Đang tải danh sách yêu thích...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="auto" />
      
      {/* Header */}
      <View className="flex-row items-center border-b border-gray-200 px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-4 flex-1">Bài đăng yêu thích</Text>
      </View>

      {/* Content */}
      {error ? (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500 mb-4">{error}</Text>
          <TouchableOpacity 
            className="bg-blue-500 py-2 px-4 rounded-lg"
            onPress={fetchFavorites}
          >
            <Text className="text-white">Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <FavoritePostItem item={item} onRemove={handleRemoveFavorite} />
          )}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={{ padding: 16, flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
} 