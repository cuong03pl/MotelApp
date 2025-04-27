import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { convertPrice } from '../utils/convertPrice';
import { getProvince } from '../utils/getProvince';
import { getLastDate } from '../utils/getLastDate';

const PostItem = ({ item }) => {
  const getFirstImage = (imageUrls) => {
    if (!imageUrls || imageUrls.length === 0) return 'https://via.placeholder.com/300x200';
    return `https://motel.azurewebsites.net${imageUrls[0]}`;
  };

  const navigateToDetail = () => {
    router.push(`/post/${item.slug}`);
  };

  return (
    <TouchableOpacity onPress={navigateToDetail} activeOpacity={0.7}>
      <View className="pt-3 pb-3 border-t border-gray-200">
        <View className="flex-row">
          <View className="w-1/4">
            <Image 
              source={{ uri: getFirstImage(item.imageUrls) }}
              className="w-full h-24 rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="w-3/4 ml-2 flex justify-between">
            <View>
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
                {getProvince(item.location?.addressLine)} • {getLastDate(item.createAt)} ngày trước • Tin ưu tiên
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PostItem;
