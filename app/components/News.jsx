import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { GetNews } from '../Services/ServiceAPI';
import { useNavigation } from '@react-navigation/native';

const News = () => {
  const [news, setNews] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAPI = async () => {
      await GetNews({
        params: {
          page: 1,
          pageSize: 5,
        },
      }).then((res) => {
        setNews(res.data);
      });
    };
    fetchAPI();
  }, []);

  return (
    <View className=" py-3 px-4">
        <Text className="text-[24px]">Tin tức</Text>
      <ScrollView>
        {news?.map((item, index) => (
          <TouchableOpacity
            key={item.slug || index}
            onPress={() => navigation.navigate('NewsDetail', { slug: item.slug })}
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
