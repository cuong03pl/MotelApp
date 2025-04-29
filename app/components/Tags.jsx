import React, { useEffect, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { GetLocations } from '../Services/ServiceAPI';
import { router, useLocalSearchParams } from 'expo-router';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const params = useLocalSearchParams();

  useEffect(() => {
    // Set selected slug from URL params if available
    if (params.provinceSlug) {
      setSelectedSlug(params.provinceSlug);
    }
  }, [params]);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const res = await GetLocations();
        setTags(res?.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchAPI();
  }, []);

  const handleTagPress = (item) => {
    if (selectedSlug === item.provinceSlug) {
      setSelectedSlug(null);
      const newParams = { ...router.params };
      delete newParams.provinceSlug;
      router.setParams(newParams);
      return;
    }
    setSelectedSlug(item.provinceSlug);
    router.setParams({ provinceSlug: item.provinceSlug });
  };

  return (
    <View className="border-t border-[#ccc] bg-white py-3">
      <FlatList
        data={tags}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.slug || item.provinceSlug}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleTagPress(item)}
            className={`px-4 py-2 mr-2 rounded-full ${
              selectedSlug === item.provinceSlug ? 'bg-red-600' : 'bg-gray-100'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedSlug === item.provinceSlug ? 'text-white' : 'text-gray-700'
              }`}
            >
              {item.province}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Tags;
