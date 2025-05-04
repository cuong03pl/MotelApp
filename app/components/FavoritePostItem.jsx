import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { convertPrice } from '../utils/convertPrice';
import { getProvince } from '../utils/getProvince';
import { getLastDate } from '../utils/getLastDate';
import { Ionicons } from '@expo/vector-icons';
import { AddFavoritePost } from '../Services/ServiceAPI';

const FavoritePostItem = ({ item, onRemove }) => {
  const [loading, setLoading] = React.useState(false);

  const getFirstImage = (imageUrls) => {
    if (!imageUrls || imageUrls.length === 0) return 'https://via.placeholder.com/300x200';
    return `https://motel.azurewebsites.net${imageUrls[0]}`;
  };

  const navigateToDetail = () => {
    router.push(`/post/${item.slug}`);
  };

  const handleRemoveFavorite = async () => {
    Alert.alert(
      'Xóa khỏi yêu thích',
      'Bạn có chắc muốn xóa bài đăng này khỏi danh sách yêu thích?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              // Gọi API để xóa khỏi danh sách yêu thích
              await AddFavoritePost({
                params: {
                  userId: item.userId, // Giả sử item có chứa userId
                  postId: item.id
                }
              });
              // Gọi callback để cập nhật UI
              if (onRemove) {
                onRemove(item.id);
              }
            } catch (error) {
              console.error('Error removing favorite:', error);
              Alert.alert('Lỗi', 'Không thể xóa khỏi danh sách yêu thích. Vui lòng thử lại.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View className="pt-3 pb-3 border-t border-gray-200">
      <View className="flex-row">
        <View className="w-1/4">
          <TouchableOpacity onPress={navigateToDetail}>
            <Image 
              source={{ uri: getFirstImage(item.imageUrls) }}
              className="w-full h-24 rounded-lg"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
        <View className="w-3/4 ml-2 flex justify-between">
          <TouchableOpacity onPress={navigateToDetail}>
            <Text className="text-[14px] font-bold" numberOfLines={2}>
              {item.title}
            </Text>
            
            <View className="flex-row items-center gap-1 mt-1">
              <Text className="text-red-500 text-[16px] font-semibold">
                {convertPrice(item.price)}/tháng
              </Text>
              <Text className="text-gray-400">•</Text>
              <Text className="text-black font-bold text-[12px]">
                {item.area} m²
              </Text>
            </View>

            <Text className="text-gray-500 text-[12px] mt-1">
              {getProvince(item.location?.addressLine)} • {getLastDate(item.createAt)} ngày trước
            </Text>
          </TouchableOpacity>
          
          <View className="flex-row justify-end mt-2">
            {loading ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : (
              <TouchableOpacity 
                onPress={handleRemoveFavorite}
                className="flex-row items-center py-1 px-2 bg-gray-100 rounded-md"
              >
                <Ionicons name="heart-dislike-outline" size={16} color="red" />
                <Text className="ml-1 text-red-500 text-[12px]">Bỏ yêu thích</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default FavoritePostItem; 