import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Share, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GetPostById, GetReviewsByPost, CreateComment } from '../Services/ServiceAPI';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { convertPrice } from '../utils/convertPrice';
import { getLastDate } from '../utils/getLastDate';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PostDetail() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(null);
  const { slug } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        const response = await GetPostById(slug);
        setPost(response.data);
        console.log(response.data);
        // Fetch comments
        const commentsResponse = await GetReviewsByPost(slug);
        setComments(commentsResponse.data);
        console.log(commentsResponse);
        // Get current user
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const userResponse = await GetUserByToken(token);
          setUser(userResponse.data);
        }
      } catch (error) {
        console.error('Error fetching post details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPostDetail();
    }
  }, [slug]);

  const handleShare = async () => {
    // Share implementation
  };

  const handleCall = () => {
    if (post?.user?.phoneNumber) {
      Linking.openURL(`tel:${post.user.phoneNumber}`);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !user) return;

    try {
      const commentData = {
        postId: post.id,
        content: newComment.trim(),
        rating: 5 // Default rating, can be modified if needed
      };

      await CreateComment(commentData);
      
      // Refresh comments
      const commentsResponse = await GetReviewsByPost(slug);
      setComments(commentsResponse.data);
      
      // Clear input
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  if (!post) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text>Không tìm thấy bài đăng</Text>
        <TouchableOpacity 
          className="mt-4 bg-blue-500 py-2 px-4 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white">Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/400x300';
    return `https://motel.azurewebsites.net${imageUrl}`;
  };


  const getFacilities = () => {
    if (post.amenities && post.amenities.length > 0) {
      return post.amenities;
    }
    if (post.facilities && post.facilities.length > 0) {
      return post.facilities;
    }
    return [];
  };


  const hasAmenity = (amenityName) => {
    const facilities = getFacilities();
    return facilities.some(item => 
      item.name.toLowerCase().includes(amenityName.toLowerCase()) || 
      amenityName.toLowerCase().includes(item.name.toLowerCase())
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="auto" />
      
      {/* Header */}
      <View className="flex-row items-center border-b border-gray-200 px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-4 flex-1">Chi tiết bài đăng</Text>
        <TouchableOpacity onPress={handleShare} className="ml-2">
          <Ionicons name="share-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Main Image */}
        <View className="w-full h-64 bg-gray-200">
          <Image 
            source={{ uri: getImageUrl(post.imageUrls?.[0]) }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Image Gallery */}
        {post.imageUrls && post.imageUrls.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2">
            {post.imageUrls.slice(1).map((image, index) => (
              <Image 
                key={index}
                source={{ uri: getImageUrl(image) }}
                className="w-20 h-20 rounded-md mr-2"
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}

        {/* Post Details */}
        <View className="p-4">
          <Text className="text-2xl font-bold">{post.title}</Text>
          
          <View className="flex-row items-center mt-2">
            <Text className="text-red-500 text-xl font-bold">
              {convertPrice(post.price)}/tháng
            </Text>
            <Text className="text-gray-400 mx-2">•</Text>
            <Text className="text-black font-bold">
              {post.area} m²
            </Text>
          </View>

          <View className="flex-row items-center mt-2">
            <Ionicons name="location-outline" size={18} color="gray" />
            <Text className="text-gray-600 ml-1">
            {post?.location?.addressLine}, {post?.location?.ward},{" "}
            {post?.location?.district}, {post?.location?.province}
            </Text>
          </View>

          <View className="flex-row items-center mt-1">
            <Ionicons name="time-outline" size={18} color="gray" />
            <Text className="text-gray-600 ml-1">
              Đăng {getLastDate(post.createAt)} ngày trước
            </Text>
          </View>

          

          {/* Description */}
          <View className="mt-4">
            <Text className="text-lg font-bold mb-2">Mô tả</Text>
            <Text className="text-gray-700 leading-6">{post.description}</Text>
          </View>

          {/* Facilities - New UI */}
          <View className="mt-4">
            <Text className="text-xl font-bold mb-4">Đặc điểm nổi bật</Text>
            <View className="flex-row flex-wrap">
              <View className="w-1/2 mb-3">
                <View className="flex-row items-center">
                  <View className={`w-5 h-5 border border-gray-400 rounded mr-2 ${hasAmenity('nội thất') ? 'bg-blue-500 border-blue-500' : ''}`}>
                    {hasAmenity('nội thất') && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                  <Text className="text-base">Đầy đủ nội thất</Text>
                </View>
              </View>
              <View className="w-1/2 mb-3">
                <View className="flex-row items-center">
                  <View className={`w-5 h-5 border border-gray-400 rounded mr-2 ${hasAmenity('gác') ? 'bg-blue-500 border-blue-500' : ''}`}>
                    {hasAmenity('gác') && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                  <Text className="text-base">Có gác</Text>
                </View>
              </View>
              <View className="w-1/2 mb-3">
                <View className="flex-row items-center">
                  <View className={`w-5 h-5 border border-gray-400 rounded mr-2 ${hasAmenity('máy lạnh') ? 'bg-blue-500 border-blue-500' : ''}`}>
                    {hasAmenity('máy lạnh') && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                  <Text className="text-base">Có máy lạnh</Text>
                </View>
              </View>
              <View className="w-1/2 mb-3">
                <View className="flex-row items-center">
                  <View className={`w-5 h-5 border border-gray-400 rounded mr-2 ${hasAmenity('máy giặt') ? 'bg-blue-500 border-blue-500' : ''}`}>
                    {hasAmenity('máy giặt') && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                  <Text className="text-base">Có máy giặt</Text>
                </View>
              </View>
              <View className="w-1/2 mb-3">
                <View className="flex-row items-center">
                  <View className={`w-5 h-5 border border-gray-400 rounded mr-2 ${hasAmenity('thang máy') ? 'bg-blue-500 border-blue-500' : ''}`}>
                    {hasAmenity('thang máy') && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                  <Text className="text-base">Có thang máy</Text>
                </View>
              </View>
              <View className="w-1/2 mb-3">
                <View className="flex-row items-center">
                  <View className={`w-5 h-5 border border-gray-400 rounded mr-2 ${hasAmenity('chung chủ') || hasAmenity('không chung chủ') ? 'bg-blue-500 border-blue-500' : ''}`}>
                    {(hasAmenity('chung chủ') || hasAmenity('không chung chủ')) && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                  <Text className="text-base">Không chung chủ</Text>
                </View>
              </View>
              <View className="w-1/2 mb-3">
                <View className="flex-row items-center">
                  <View className={`w-5 h-5 border border-gray-400 rounded mr-2 ${hasAmenity('bảo vệ') ? 'bg-blue-500 border-blue-500' : ''}`}>
                    {hasAmenity('bảo vệ') && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                  <Text className="text-base">Có bảo vệ 24/24</Text>
                </View>
              </View>
              <View className="w-1/2 mb-3">
                <View className="flex-row items-center">
                  <View className={`w-5 h-5 border border-gray-400 rounded mr-2 ${hasAmenity('hầm xe') || hasAmenity('để xe') ? 'bg-blue-500 border-blue-500' : ''}`}>
                    {(hasAmenity('hầm xe') || hasAmenity('để xe')) && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                  <Text className="text-base">Có hầm để xe</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Landlord */}
          <View className="mt-6 bg-gray-50 p-4 rounded-lg">
            <Text className="text-lg font-bold mb-2">Thông tin chủ trọ</Text>
            <View className="flex-row items-center">
              <Image 
                source={{ uri: post.user?.avatar}}
                className="w-12 h-12 rounded-full bg-gray-300"
              />
              <View className="ml-3">
                <Text className="font-bold">{post.user?.fullName}</Text>
                <Text className="text-gray-600">{post.user?.phoneNumber}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Comments Section */}
        <View className="mt-6 p-4 border-t border-gray-200">
          <Text className="text-xl font-bold mb-4">Bình luận</Text>
          
          {/* Comment Input */}
          {user ? (
            <View className="flex-row items-center mb-4">
              <Image 
                source={{ uri: user.avatar  }}
                className="w-10 h-10 rounded-full"
              />
              <View className="flex-1 ml-3">
                <TextInput
                  className="border border-gray-300 rounded-full px-4 py-2"
                  placeholder="Viết bình luận..."
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                />
              </View>
              <TouchableOpacity 
                className="ml-2 bg-blue-500 p-2 rounded-full"
                onPress={handleCommentSubmit}
              >
                <Ionicons name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              className="bg-blue-500 py-2 px-4 rounded-lg mb-4"
              onPress={() => router.push('/signin')}
            >
              <Text className="text-white text-center">Đăng nhập để bình luận</Text>
            </TouchableOpacity>
          )}

          {comments.map((comment, index) => (
            <View key={index} className="mb-4">
              <View className="flex-row items-start">
                <Image 
                  source={{ uri: comment.user?.avatar || 'https://via.placeholder.com/40' }}
                  className="w-10 h-10 rounded-full"
                />
                <View className="ml-3 flex-1">
                  <View className="bg-gray-100 rounded-lg p-3">
                    <Text className="font-bold">{comment.user?.fullName}</Text>
                    <Text className="text-gray-700 mt-1">{comment.comment}</Text>
                  </View>
                  <Text className="text-gray-500 text-xs mt-1">
                    {getLastDate(comment.createAt)} ngày trước
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Call Button */}
      <View className="px-4 py-3 border-t border-gray-200">
        <TouchableOpacity 
          className="bg-green-500 py-3 rounded-lg flex-row justify-center items-center"
          onPress={handleCall}
        >
          <Ionicons name="call" size={20} color="white" />
          <Text className="text-white font-bold ml-2">Gọi ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 