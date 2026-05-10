import { View, Text, Image, ScrollView, Pressable, Alert } from "react-native";
import { useAuth } from "@/contexts/auth-context";
import React, { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import axios from "@/api/axios";
import { Feather, MaterialIcons } from "@expo/vector-icons";

interface User {
  id: number;
  name: string;
  email: string;
  profile_image: string;
}

type BlogProps = {
  id: number;
  title: string;
  image: string;
  description: string;
  created_at: string;
  user: User;
};

const formatDistanceToNow = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
};

export default function Home() {
  const [blogs, setBlogs] = useState<BlogProps[]>([]);

  const getBlogs = async () => {
    try {
      const response = await axios.get("/fetchBlogs");
      setBlogs(response.data);
    } catch (error) {
      console.log("Error fetching blogs:", error);
    }
  };

   useFocusEffect(
    useCallback(() => {
      getBlogs();
    }, [])
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200 shadow-sm">
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-bold text-gray-800">Blog Feed</Text>
          <Pressable 
            onPress={() => router.navigate("/home/create")} 
            className="bg-blue-600 px-4 py-2 rounded-full flex-row items-center gap-2"
          >
            <Feather name="plus" size={16} color="white" />
            <Text className="text-white font-semibold text-sm">Create Post</Text>
          </Pressable>
        </View>
      </View>
      
      <View className="p-4 gap-4">
        {blogs.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Feather name="edit-3" size={48} color="#9ca3af" />
            <Text className="text-gray-400 text-center mt-2">No blog posts yet</Text>
            <Text className="text-gray-400 text-sm">Be the first to create a post!</Text>
          </View>
        ) : (
          blogs.map((blog) => (
            <Pressable 
              onPress={() => router.navigate(`/blogs/${blog.id}`)} 
              key={blog.id}
              className="mb-4"
            >
              <View className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                {/* Blog Image */}
                <Image
                  className="h-48 w-full"
                  source={{
                    uri: `http://127.0.0.1:8000/storage/${blog.image}`,
                  }}
                />
                
                {/* User Info Section */}
                <View className="flex-row items-center p-3 border-b border-gray-100">
                  <Image
                    className="h-10 w-10 rounded-full mr-3"
                    source={{
                      uri: `http://127.0.0.1:8000/storage/${blog.user.profile_image}`,
                    }}
                  />
                  <View className="flex-1">
                    <Text className="font-bold text-gray-800">{blog.user.name}</Text>
                    <View className="flex-row items-center gap-1">
                      <Feather name="clock" size={12} color="#9ca3af" />
                      <Text className="text-xs text-gray-500">{formatDistanceToNow(blog.created_at)}</Text>
                    </View>
                  </View>
                  <Feather name="more-horizontal" size={18} color="#9ca3af" />
                </View>
                
                {/* Blog Content */}
                <View className="p-3 gap-1">
                  <Text className="text-lg font-bold text-gray-800">{blog.title}</Text>
                  <Text className="text-gray-600 leading-5" numberOfLines={3}>
                    {blog.description}
                  </Text>
                  
                  {/* Read More Link */}
                  <View className="flex-row items-center mt-2">
                    <Text className="text-blue-600 text-sm font-medium mr-1">Read more</Text>
                    <Feather name="arrow-right" size={14} color="#2563eb" />
                  </View>
                </View>
                
                {/* Interaction Buttons */}
                {/* <View className="flex-row justify-around p-3 border-t border-gray-100">
                  <Pressable className="flex-row items-center gap-2">
                    <Feather name="heart" size={20} color="#9ca3af" />
                    <Text className="text-gray-500">Like</Text>
                  </Pressable>
                  <Pressable className="flex-row items-center gap-2">
                    <Feather name="message-circle" size={20} color="#9ca3af" />
                    <Text className="text-gray-500">Comment</Text>
                  </Pressable>
                  <Pressable className="flex-row items-center gap-2">
                    <Feather name="share-2" size={20} color="#9ca3af" />
                    <Text className="text-gray-500">Share</Text>
                  </Pressable>
                </View> */}
              </View>
            </Pressable>
          ))
        )}
      </View>
    </ScrollView>
  );
}