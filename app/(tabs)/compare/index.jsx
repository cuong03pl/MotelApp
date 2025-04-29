import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { GetPostById, GetApprovedPosts } from "../../Services/ServiceAPI";
import { convertPrice } from "../../utils/convertPrice";
import { getProvince } from "../../utils/getProvince";

export default function compare() {
  const [comparedItems, setComparedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('compare'); 
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);

  useEffect(() => {
    const loadComparedItems = async () => {
      try {
        setLoading(true);
        const storedIds = await AsyncStorage.getItem("comparedItems");
        
        if (storedIds) {
          const ids = JSON.parse(storedIds);
          
          // Fetch details for each ID
          const itemsPromises = ids.map(async (slug) => {
            try {
              const response = await GetPostById(slug);
              return response.data;
            } catch (error) {
              console.error(`Error fetching item ${slug}:`, error);
              return null;
            }
          });
          
          const items = await Promise.all(itemsPromises);
          setComparedItems(items.filter(item => item !== null));
        }
      } catch (error) {
        console.error("Error loading comparison items:", error);
      } finally {
        setLoading(false);
      }
    };

    loadComparedItems();
  }, []);

  useEffect(() => {
    if (activeTab === 'select') {
      fetchAvailableRooms();
    }
  }, [activeTab]);

  const fetchAvailableRooms = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        pageSize: 1000
      };
      const res = await GetApprovedPosts(params);
      console.log(res?.data?.data);
      
      setAvailableRooms(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching available rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    try {
      const storedIds = await AsyncStorage.getItem("comparedItems");
      if (storedIds) {
        const ids = JSON.parse(storedIds);
        const newIds = ids.filter(item => item !== id);
        await AsyncStorage.setItem("comparedItems", JSON.stringify(newIds));
        
        // Update state
        setComparedItems(prev => prev.filter(item => item.slug !== id));
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const clearAll = async () => {
    try {
      await AsyncStorage.removeItem("comparedItems");
      setComparedItems([]);
    } catch (error) {
      console.error("Error clearing items:", error);
    }
  };

  const navigateToDetail = (slug) => {
    router.push(`/post/${slug}`);
  };

  const getFirstImage = (imageUrls) => {
    if (!imageUrls || imageUrls.length === 0) return 'https://via.placeholder.com/300x200';
    return `https://motel.azurewebsites.net${imageUrls[0]}`;
  };

  const renderFeatureRow = (label, getValueFunc) => {
    return (
      <View className="flex-row py-3 border-b border-gray-200">
        <View className="w-1/4 px-2">
          <Text className="font-bold">{label}</Text>
        </View>
        {comparedItems.map((item, index) => (
          <View key={index} className="flex-1 px-2">
            <Text>{getValueFunc(item)}</Text>
          </View>
        ))}
      </View>
    );
  };

  const toggleRoomSelection = (item) => {
    if (selectedRooms.some(room => room.id === item.id)) {
      // Remove the room
      setSelectedRooms(selectedRooms.filter(room => room.id !== item.id));
    } else {
      // Add the room, but limit to 2 selections
      if (selectedRooms.length < 2) {
        setSelectedRooms([...selectedRooms, item]);
      } else {
        Alert.alert("Thông báo", "Bạn chỉ có thể chọn tối đa 2 phòng để so sánh.");
      }
    }
  };

  const isRoomSelected = (item) => {
    return selectedRooms.some(room => room.id === item.id);
  };

  const confirmSelection = async () => {
    try {
      if (selectedRooms.length !== 2) {
        Alert.alert("Thông báo", "Vui lòng chọn đúng 2 phòng để so sánh.");
        return;
      }

      // Save to AsyncStorage and update state
      const slugs = selectedRooms.map(room => room.slug);
      await AsyncStorage.setItem("comparedItems", JSON.stringify(slugs));
      setComparedItems(selectedRooms);
      setActiveTab('compare');
    } catch (error) {
      console.error("Error saving selected rooms:", error);
    }
  };

  const renderRoomItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => toggleRoomSelection(item)}
      className={`mb-3 border rounded-lg overflow-hidden ${isRoomSelected(item) ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}
    >
      <View className="flex-row p-2">
        <View className="w-1/4">
          <Image 
            source={{ uri: getFirstImage(item.imageUrls) }}
            className="w-full h-24 rounded-lg"
            resizeMode="cover"
          />
        </View>
        <View className="w-3/4 ml-2">
          <Text className="font-bold" numberOfLines={2}>{item.title}</Text>
          <Text className="text-red-500 mt-1 font-semibold">{convertPrice(item.price)}/tháng</Text>
          <Text className="text-gray-600 text-sm">{item.area} m² • {getProvince(item.location?.addressLine)}</Text>
          
          {isRoomSelected(item) && (
            <View className="absolute top-0 right-0">
              <AntDesign name="checkcircle" size={20} color="#FCC434" />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar style="auto" />
      
      {/* Header */}
      <View className="bg-white px-4 py-3">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-xl font-bold">So sánh nhà trọ</Text>
          {activeTab === 'compare' && comparedItems.length > 0 && (
            <TouchableOpacity 
              onPress={() => Alert.alert(
                "Xác nhận",
                "Bạn có chắc muốn xóa tất cả các mục so sánh?",
                [
                  { text: "Hủy", style: "cancel" },
                  { text: "Xóa", onPress: clearAll, style: "destructive" }
                ]
              )}
            >
              <Text className="text-red-500">Xóa tất cả</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tab buttons */}
        <View className="flex-row border-b border-gray-200">
          <TouchableOpacity 
            className={`py-2 flex-1 items-center ${activeTab === 'compare' ? 'border-b-2 border-yellow-500' : ''}`}
            onPress={() => setActiveTab('compare')}
          >
            <Text className={activeTab === 'compare' ? 'font-bold text-yellow-600' : 'text-gray-600'}>So sánh</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`py-2 flex-1 items-center ${activeTab === 'select' ? 'border-b-2 border-yellow-500' : ''}`}
            onPress={() => setActiveTab('select')}
          >
            <Text className={activeTab === 'select' ? 'font-bold text-yellow-600' : 'text-gray-600'}>Chọn phòng</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text>Đang tải...</Text>
        </View>
      ) : activeTab === 'select' ? (
        <View className="flex-1">
          <View className="bg-white p-4 mb-2">
            <Text className="text-base font-bold mb-2">Chọn 2 phòng để so sánh</Text>
            <Text className="text-gray-600 text-sm">Đã chọn: {selectedRooms.length}/2 phòng</Text>
          </View>
          <FlatList
            data={availableRooms}
            renderItem={renderRoomItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ padding: 10 }}
          />
          {selectedRooms.length > 0 && (
            <TouchableOpacity
              className="absolute bottom-4 right-4 left-4 bg-blue-500 p-4 rounded-lg items-center"
              onPress={confirmSelection}
            >
              <Text className="text-white font-bold">So sánh {selectedRooms.length} phòng</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : comparedItems.length === 0 ? (
        <View className="flex-1 justify-center items-center px-4">
          <MaterialIcons name="compare-arrows" size={64} color="#cccccc" />
          <Text className="text-lg text-center mt-4 text-gray-500">
            Chưa có mục nào để so sánh. Hãy chọn phòng để so sánh.
          </Text>
          <TouchableOpacity 
            className="mt-6 bg-blue-500 px-6 py-3 rounded-lg" 
            onPress={() => setActiveTab('select')}
          >
            <Text className="text-white font-bold">Chọn phòng</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView>
          {/* Item titles */}
          <View className="flex-row bg-gray-100 py-3 border-b border-gray-200">
            <View className="w-1/4 px-2">
            </View>
            {comparedItems.map((item, index) => (
              <View key={index} className="flex-1 px-2">
                <View className="items-center">
                  <TouchableOpacity
                    onPress={() => removeItem(item.slug)}
                    className="absolute right-0 top-0 z-10"
                  >
                    <AntDesign name="closecircle" size={20} color="red" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigateToDetail(item.slug)}>
                    <Image 
                      source={{ uri: getFirstImage(item.imageUrls) }}
                      className="w-24 h-24 rounded-lg mb-2"
                      resizeMode="cover"
                    />
                    <Text className="text-xs text-center font-bold" numberOfLines={2}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Features comparison */}
          {renderFeatureRow("Giá thuê", item => convertPrice(item.price) + "/tháng")}
          {renderFeatureRow("Diện tích", item => `${item.area} m²`)}
          {renderFeatureRow("Địa chỉ", item => item.location?.addressLine || "Không có")}
          
          {/* Tiện ích */}
          <View className="flex-row py-3 border-b border-gray-200">
            <View className="w-1/4 px-2">
              <Text className="font-bold">Tiện ích</Text>
            </View>
            {comparedItems.map((item, index) => (
              <View key={index} className="flex-1 px-2">
                <View className="space-y-2">
                  <View className="flex-row items-center">
                    <Ionicons 
                      name={item.amenities?.["Đầy đủ nội thất"] ? "checkmark-circle" : "close-circle"} 
                      size={20} 
                      color={item.amenities?.["Đầy đủ nội thất"] ? "#10B981" : "#9CA3AF"} 
                    />
                    <Text className="ml-2">Đầy đủ nội thất</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons 
                      name={item.amenities?.["Có máy lạnh"] ? "checkmark-circle" : "close-circle"} 
                      size={20} 
                      color={item.amenities?.["Có máy lạnh"] ? "#10B981" : "#9CA3AF"} 
                    />
                    <Text className="ml-2">Máy lạnh</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons 
                      name={item.amenities?.["Có thang máy"] ? "checkmark-circle" : "close-circle"} 
                      size={20} 
                      color={item.amenities?.["Có thang máy"] ? "#10B981" : "#9CA3AF"} 
                    />
                    <Text className="ml-2">Thang máy</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons 
                      name={item.amenities?.["Có bảo vệ 24/24"] ? "checkmark-circle" : "close-circle"} 
                      size={20} 
                      color={item.amenities?.["Có bảo vệ 24/24"] ? "#10B981" : "#9CA3AF"} 
                    />
                    <Text className="ml-2">Bảo vệ 24/24</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons 
                      name={item.amenities?.["Có gác"] ? "checkmark-circle" : "close-circle"} 
                      size={20} 
                      color={item.amenities?.["Có gác"] ? "#10B981" : "#9CA3AF"} 
                    />
                    <Text className="ml-2">Có gác</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons 
                      name={item.amenities?.["Có máy giặt"] ? "checkmark-circle" : "close-circle"} 
                      size={20} 
                      color={item.amenities?.["Có máy giặt"] ? "#10B981" : "#9CA3AF"} 
                    />
                    <Text className="ml-2">Máy giặt</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons 
                      name={item.amenities?.["Không chung chủ"] ? "checkmark-circle" : "close-circle"} 
                      size={20} 
                      color={item.amenities?.["Không chung chủ"] ? "#10B981" : "#9CA3AF"} 
                    />
                    <Text className="ml-2">Không chung chủ</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons 
                      name={item.amenities?.["Có hầm để xe"] ? "checkmark-circle" : "close-circle"} 
                      size={20} 
                      color={item.amenities?.["Có hầm để xe"] ? "#10B981" : "#9CA3AF"} 
                    />
                    <Text className="ml-2">Hầm để xe</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          
          <View className="h-20"></View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
