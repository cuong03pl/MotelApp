import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { GetNewsById } from "../Services/ServiceAPI";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import RenderHtml from "react-native-render-html";

const { width } = Dimensions.get("window");

export default function NewsDetail() {
  const { slug } = useLocalSearchParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        const response = await GetNewsById(slug);
        setNews(response.data);
      } catch (err) {
        console.error("Error fetching news details:", err);
        setError("Không thể tải thông tin tin tức. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchNewsDetail();
    }
  }, [slug]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FCC434" />
        <Text className="mt-2 text-gray-500">Đang tải...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white p-4">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
      </SafeAreaView>
    );
  }

  if (!news) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white p-4">
        <Text className="text-gray-500 text-center">
          Không tìm thấy thông tin tin tức.
        </Text>
      </SafeAreaView>
    );
  }

  const source = {
    html: news.description || "<p>Không có nội dung.</p>",
  };

  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView 
        className="flex-1 p-4" 
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold mb-3">{news.title}</Text>
        
      

        {news.imageUrl && (
          <View className="mb-4">
            <Image
              source={{ uri: `https://motel.azurewebsites.net${news.imageUrl}` }}
              className="w-full h-52 rounded-lg"
              resizeMode="cover"
            />
          </View>
        )}

        <View className="mb-4">
          <Text className="text-base font-medium italic mb-2">
            {news.shortDescription}
          </Text>
        </View>

        <RenderHtml
          contentWidth={width - 32}
          source={source}
          tagsStyles={{
            p: { marginBottom: 16, lineHeight: 24, fontSize: 16 },
            h1: { fontSize: 24, fontWeight: 'bold', marginVertical: 16 },
            h2: { fontSize: 22, fontWeight: 'bold', marginVertical: 14 },
            h3: { fontSize: 20, fontWeight: 'bold', marginVertical: 12 },
            a: { color: '#2563EB', textDecorationLine: 'underline' },
            img: { borderRadius: 8, marginVertical: 16 },
            ul: { marginLeft: 16, marginBottom: 16 },
            ol: { marginLeft: 16, marginBottom: 16 },
            li: { marginBottom: 8, lineHeight: 24 },
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
} 