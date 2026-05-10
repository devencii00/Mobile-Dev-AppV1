import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "@/api/axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@/contexts/auth-context";

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
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!post) {
    return <Text>Blog post not found.</Text>;
  }

  return (
    <View className="p-4">
      <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Text className="text-blue-500">Go Back</Text>
      </TouchableOpacity>
      {user?.id === post.user.id && (
        <TouchableOpacity onPress={() => router.navigate(`/blogs/edit/${id}`)} className="mb-4">
          <Text className="text-green-500">Edit Post</Text>
        </TouchableOpacity>
      )}
      <View className="flex-row items-center mb-2">
        <Image
          className="h-10 w-10 rounded-full mr-2"
          source={{
            uri: `http://127.0.0.1:8000/storage/${post.user.profile_image}`,
        }}
      />
      <View>
        <Text className="font-bold">{post.user.name}</Text>
        <Text className="text-sm text-gray-500">{post.user.email}</Text>
      </View>
    </View>
    <Image
      className="h-40 w-full mb-4"
      source={{
        uri: `http://127.0.0.1:8000/storage/${post.image}`,
      }}
    />
      <Text className="text-2xl font-bold mb-2">{post.title}</Text>
      <Text>{post.description}</Text>
    </View>
  );
}
