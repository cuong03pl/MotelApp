import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { GetNews } from '../Services/ServiceAPI';
import { router } from 'expo-router';

const News = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const res = await GetNews({
          params: {
            page: 1,
            pageSize: 5,
          },
        });
        setNews(res.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchAPI();
  }, []);

  return (
    <View className="py-3 px-4">
      <Text className="text-[24px]">Tin tức</Text>
      <ScrollView>
        {news?.map((item, index) => (
          <TouchableOpacity
            key={item.slug || index}
            onPress={() => router.push(`/news/${item.slug}`)}
            className="py-3 border-b border-gray-200 flex-row items-start"
          >
            <Text className="text-base text-gray-800 leading-6">• {item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default News;
