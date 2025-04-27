import { View, Text, FlatList, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { GetApprovedPosts } from "../../Services/ServiceAPI";
import { useLocalSearchParams, useRouter } from "expo-router";
import Post from "../../components/Post";
import { Ionicons } from '@expo/vector-icons';
import Categories from "../../components/Categories";
import News from "../../components/News";

export default function home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const searchParams = useLocalSearchParams();
  const router = useRouter();

 

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        let params = {
          page: currentPage,
          pageSize: 20, 
          minPrice: searchParams.minPrice || null,
          maxPrice: searchParams.maxPrice || null,
          minArea: searchParams.minArea || null,
          maxArea: searchParams.maxArea || null,
          categoryId: selectedCategory || searchParams.categoryId || null,
          provinceSlug: searchParams.provinceSlug || null,
          districtSlug: searchParams.districtSlug || null,
        };
        const res = await GetApprovedPosts(params);

        setTotalPage(res?.data?.totalPages);
        setPosts(res?.data?.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchAPI();
  }, [searchParams, currentPage, selectedCategory]);

  

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar style="auto" />
      
      {/* Header */}
      <View className="bg-white px-4 py-3">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-xl font-bold">Trang chủ</Text>
        </View>
      </View>
      <Categories />
      {/* Posts List */}
        <View className="flex-1 px-2">
          <Post data={posts} />
        <News />
        </View>
      {/* Filter Button */}
      <TouchableOpacity
        className="absolute bottom-4 right-4 bg-blue-500 p-4 rounded-full"
        onPress={() => router.push('/filter')}
      >
        <Ionicons name="options-outline" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
