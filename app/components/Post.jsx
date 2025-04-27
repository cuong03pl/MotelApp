import React from 'react';
import { FlatList, View } from 'react-native';
import PostItem from './PostItem';

const Post = ({ data }) => {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <PostItem item={item} />}
      keyExtractor={(item) => item.id.toString()}
      className="flex-1"
      contentContainerStyle="p-4"
      showsVerticalScrollIndicator={false}
    />
  );
};

export default Post;
