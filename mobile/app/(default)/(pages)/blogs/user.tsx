import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, Platform } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import axios from "@/api/axios";
import { router, useFocusEffect } from "expo-router";

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
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View className="p-4">
      <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Text className="text-blue-500">Go Back</Text>
      </TouchableOpacity>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="mb-4 p-4 border rounded">
            <Image
              className="h-40 w-full mb-2"
              source={{ uri: `http://127.0.0.1:8000/storage/${item.image}` }}
            />
            <Text className="text-xl font-bold">{item.title}</Text>
            <Text>{item.description}</Text>
            <View className="flex-row gap-2 mt-2">
              <TouchableOpacity
                onPress={() => router.navigate(`/blogs/edit/${item.id}`)}
                className="flex-1 bg-blue-500 p-2 rounded"
              >
                <Text className="text-white text-center font-bold">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                className="flex-1 bg-red-500 p-2 rounded"
              >
                <Text className="text-white text-center font-bold">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
