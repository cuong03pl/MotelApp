import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { GetApprovedPosts, GetCategories } from "../../Services/ServiceAPI";
import { useLocalSearchParams, useRouter } from "expo-router";
import Post from "../../components/Post";
import { Ionicons } from '@expo/vector-icons';
import Categories from "../../components/Categories";
import News from "../../components/News";
import { Picker } from '@react-native-picker/picker';

const priceRanges = [
  { label: "Tất cả", min: 0, max: 100000000 },
  { label: "Dưới 1 triệu", min: 0, max: 1 },
  { label: "1 - 2 triệu", min: 1, max: 2 },
  { label: "2 - 3 triệu", min: 2, max: 3 },
  { label: "3 - 5 triệu", min: 3, max: 5 },
  { label: "5 - 7 triệu", min: 5, max: 7 },
  { label: "7 - 10 triệu", min: 7, max: 10 },
  { label: "10 - 15 triệu", min: 10, max: 15 },
  { label: "Trên 15 triệu", min: 15, max: 100000000 },
];

const areaFilters = [
  { label: "Tất cả", min: 0, max: 100000000 },
  { label: "Dưới 20m²", min: 0, max: 20 },
  { label: "Từ 20m² - 30m²", min: 20, max: 30 },
  { label: "Từ 30m² - 50m²", min: 30, max: 50 },
  { label: "Từ 50m² - 70m²", min: 50, max: 70 },
  { label: "Từ 70m² - 90m²", min: 70, max: 90 },
  { label: "Trên 90m²", min: 90, max: 100000000 },
];

// Tách thành component riêng để tránh re-render không cần thiết
const FilterOptions = React.memo(({ 
  filters, 
  setFilters, 
  categories, 
  selectedCategory,
  handleCategorySelect,
  resetFilters 
}) => {
  return (
    <View className="bg-white p-4 border-b border-gray-200">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold">Bộ lọc</Text>
        <TouchableOpacity onPress={resetFilters}>
          <Text className="text-blue-500">Đặt lại</Text>
        </TouchableOpacity>
      </View>

      {/* Giá cả */}
      <Text className="font-medium mb-2">Khoảng giá</Text>
      <View className="bg-gray-100 rounded-lg mb-4">
        <Picker
          selectedValue={filters.priceRange}
          onValueChange={(value) => setFilters(prev => ({...prev, priceRange: value}))}
          style={{height: 50}}
        >
          {priceRanges.map((range, index) => (
            <Picker.Item key={index} label={range.label} value={index} />
          ))}
        </Picker>
      </View>

      {/* Diện tích */}
      <Text className="font-medium mb-2">Diện tích</Text>
      <View className="bg-gray-100 rounded-lg mb-4">
        <Picker
          selectedValue={filters.areaRange}
          onValueChange={(value) => setFilters(prev => ({...prev, areaRange: value}))}
          style={{height: 50}}
        >
          {areaFilters.map((range, index) => (
            <Picker.Item key={index} label={range.label} value={index} />
          ))}
        </Picker>
      </View>

      {/* Loại */}
      <Text className="font-medium mb-2">Loại nhà trọ</Text>
      <View className="bg-gray-100 rounded-lg mb-4">
        <Picker
          selectedValue={selectedCategory}
          onValueChange={handleCategorySelect}
          style={{height: 50}}
        >
          <Picker.Item label="Tất cả" value={null} />
          {categories.map(cat => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
          ))}
        </Picker>
      </View>
    </View>
  );
});

export default function home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: 0,
    areaRange: 0
  });
  const searchParams = useLocalSearchParams();
  const router = useRouter();

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await GetCategories();
        if (res?.data) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        let params = {
          page: currentPage,
          pageSize: 20, 
          minPrice: priceRanges[filters.priceRange].min,
          maxPrice: priceRanges[filters.priceRange].max,
          minArea: areaFilters[filters.areaRange].min,
          maxArea: areaFilters[filters.areaRange].max,
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
  }, [searchParams, currentPage, selectedCategory, filters]);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      priceRange: 0,
      areaRange: 0
    });
    setSelectedCategory(null);
  }, []);

  const handleCategorySelect = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
  }, []);

  const renderFilterOptions = useMemo(() => {
    if (!showFilters) return null;
    
    return (
      <FilterOptions 
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        selectedCategory={selectedCategory}
        handleCategorySelect={handleCategorySelect}
        resetFilters={resetFilters}
      />
    );
  }, [showFilters, filters, categories, selectedCategory, handleCategorySelect, resetFilters]);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar style="auto" />
      
      {/* Header */}
      <View className="bg-white px-4 py-3">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-xl font-bold">Trang chủ</Text>
          <TouchableOpacity onPress={toggleFilters}>
            <Ionicons name="filter" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-lg p-2 mb-2">
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Tìm kiếm nhà trọ..."
            className="flex-1 ml-2"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Filter Options */}
      {renderFilterOptions}

      {/* Categories */}
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
