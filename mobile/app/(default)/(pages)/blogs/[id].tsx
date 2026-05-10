import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "@/api/axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/contexts/auth-context";
import { Feather, MaterialIcons } from "@expo/vector-icons";

interface User {
  id: number;
  name: string;
  email: string;
  profile_image: string;
}

interface BlogPost {
  id: number;
  title: string;
  image: string;
  description: string;
  user: User;
}

export default function BlogPostDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const { data } = await axios.get(`/blogs/${id}`);
          setPost(data);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPost();
    }
  }, [id]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-500 mt-2">Loading post...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-4">
        <Feather name="file-text" size={64} color="#9ca3af" />
        <Text className="text-gray-500 text-lg mt-4">Blog post not found.</Text>
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="mt-6 bg-blue-600 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header with Actions */}
      <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row justify-between items-center">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="flex-row items-center gap-1"
        >
          <Feather name="arrow-left" size={24} color="#2563eb" />
          <Text className="text-blue-600 font-medium">Back</Text>
        </TouchableOpacity>
        
        <Text className="text-lg font-bold text-gray-800">Blog Post</Text>
        
        {user?.id === post.user.id && (
          <TouchableOpacity 
            onPress={() => router.navigate(`/blogs/edit/${id}`)} 
            className="bg-green-50 px-3 py-2 rounded-full flex-row items-center gap-1"
          >
            <Feather name="edit-2" size={16} color="#16a34a" />
            <Text className="text-green-600 font-medium">Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Blog Content */}
      <View className="p-4">
        {/* Blog Image */}
        <View className="bg-white rounded-xl overflow-hidden shadow-sm mb-4">
          <Image
            className="h-64 w-full"
            source={{
              uri: `http://127.0.0.1:8000/storage/${post.image}`,
            }}
          />
        </View>

        {/* Author Info Card */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-4 flex-row items-center">
          <Image
            className="h-14 w-14 rounded-full mr-3"
            source={{
              uri: `http://127.0.0.1:8000/storage/${post.user.profile_image}`,
            }}
          />
          <View className="flex-1">
            <Text className="font-bold text-gray-800 text-lg">{post.user.name}</Text>
            <View className="flex-row items-center gap-1 mt-1">
              <MaterialIcons name="email" size={14} color="#9ca3af" />
              <Text className="text-sm text-gray-500">{post.user.email}</Text>
            </View>
          </View>
          <View className="bg-blue-50 px-3 py-1 rounded-full">
            <Text className="text-blue-600 text-xs font-medium">Author</Text>
          </View>
        </View>

        {/* Blog Title */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
          <Text className="text-2xl font-bold text-gray-800 mb-2">{post.title}</Text>
          
          {/* Divider */}
          <View className="h-px bg-gray-200 my-3" />
          
          {/* Blog Description */}
          <Text className="text-gray-700 leading-6 text-base">
            {post.description}
          </Text>
        </View>

        {/* Interaction Section */}
        {/* <View className="bg-white rounded-xl p-4 shadow-sm flex-row justify-around">
          <TouchableOpacity className="flex-row items-center gap-2">
            <Feather name="heart" size={22} color="#9ca3af" />
            <Text className="text-gray-600">Like</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center gap-2">
            <Feather name="message-circle" size={22} color="#9ca3af" />
            <Text className="text-gray-600">Comment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center gap-2">
            <Feather name="share-2" size={22} color="#9ca3af" />
            <Text className="text-gray-600">Share</Text>
          </TouchableOpacity>
        </View> */}

        {/* Footer Note */}
        {/* <View className="mt-6 mb-4 items-center">
          <Text className="text-xs text-gray-400">© 2024 Blog App • All rights reserved</Text>
        </View> */}
      </View>
    </ScrollView>
  );
}