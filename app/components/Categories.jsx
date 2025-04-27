import React, { useEffect, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import { GetCategories } from '../Services/ServiceAPI';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(null);

  useEffect(() => {
    const fetchAPI = async () => {
      await GetCategories().then((res) => {
        setCategories(res.data);
      });
    };
    fetchAPI();
  }, []);

  return (
    <View className="border-t border-[#ccc] bg-white py-3">
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.slug}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedSlug(item.slug)}
            className={`px-4 py-2 mr-2 rounded-full ${
              selectedSlug === item.slug ? 'bg-red-600' : 'bg-gray-100'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedSlug === item.slug ? 'text-white' : 'text-gray-700'
              }`}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Categories;
