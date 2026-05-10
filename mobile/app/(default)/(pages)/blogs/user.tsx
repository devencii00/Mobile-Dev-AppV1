import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, Platform } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import axios from "@/api/axios";
import { router, useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";

interface BlogPost {
  id: number;
  title: string;
  description: string;
  image: string;
}

export default function UserBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/user/blogs");
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const handleDelete = async (id: number) => {
    const deleteBlog = async () => {
      try {
        await axios.delete(`/blogs/${id}`);
        Alert.alert("Success", "Blog deleted successfully");
        fetchPosts(); // Refresh list
      } catch (error: any) {
        console.error("Delete error:", error);
        Alert.alert("Error", "Failed to delete blog post");
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to delete this blog post?")) {
        await deleteBlog();
      }
    } else {
      Alert.alert(
        "Delete Blog",
        "Are you sure you want to delete this blog post?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: deleteBlog,
          },
        ]
      );
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-500 mt-2">Loading your posts...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#2563eb" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800">My Blog Posts</Text>
            <Text className="text-sm text-gray-500">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</Text>
          </View>
          <TouchableOpacity 
            onPress={fetchPosts}
            className="bg-blue-50 px-3 py-2 rounded-full"
          >
            <Feather name="refresh-cw" size={18} color="#2563eb" />
          </TouchableOpacity>
        </View>
      </View>

      {posts.length === 0 ? (
        <View className="flex-1 items-center justify-center p-4">
          <Feather name="file-text" size={64} color="#9ca3af" />
          <Text className="text-gray-400 text-lg mt-4">No blog posts yet</Text>
          <Text className="text-gray-400 text-sm text-center mt-2">
            Create your first blog post to get started!
          </Text>
          <TouchableOpacity
            onPress={() => router.navigate("/home/create")}
            className="mt-6 bg-blue-600 px-6 py-3 rounded-xl flex-row items-center gap-2"
          >
            <Feather name="plus" size={18} color="white" />
            <Text className="text-white font-semibold">Create New Post</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          contentContainerClassName="p-4"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-gray-100">
              {/* Blog Image */}
              <Image
                className="h-48 w-full"
                source={{ uri: `http://127.0.0.1:8000/storage/${item.image}` }}
              />
              
              {/* Blog Content */}
              <View className="p-4">
                <Text className="text-xl font-bold text-gray-800 mb-2">{item.title}</Text>
                <Text className="text-gray-600 leading-5" numberOfLines={3}>
                  {item.description}
                </Text>
                
                {/* Action Buttons */}
                <View className="flex-row gap-3 mt-4">
                  <TouchableOpacity
                    onPress={() => router.navigate(`/blogs/edit/${item.id}`)}
                    className="flex-1 bg-blue-600 py-3 rounded-xl flex-row items-center justify-center gap-2"
                  >
                    <Feather name="edit-2" size={18} color="white" />
                    <Text className="text-white font-semibold">Edit</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    className="flex-1 bg-red-500 py-3 rounded-xl flex-row items-center justify-center gap-2"
                  >
                    <Feather name="trash-2" size={18} color="white" />
                    <Text className="text-white font-semibold">Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          ListFooterComponent={
            <View className="items-center py-4">
              <Text className="text-xs text-gray-400">End of posts</Text>
            </View>
          }
        />
      )}
    </View>
  );
}