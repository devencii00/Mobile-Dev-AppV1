import { View, Text, Image, ScrollView, Pressable, Alert } from "react-native";
import { useAuth } from "@/contexts/auth-context";
import React, { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import axios from "@/api/axios";

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
    <ScrollView className="p-4">
      
      <View className="gap-4">
          <Pressable onPress={() => router.navigate("/home/create")} className="mt-2">
          <Text className="text-blue-500 text-center">Create a Blog Post</Text>
        </Pressable>

        {blogs.map((blog) => (
          <Pressable 
            onPress={() => router.navigate(`/blogs/${blog.id}`)} 
            key={blog.id}
            className="mb-6"
          >
            <View className="flex-row items-center mb-2">
              <Image
                className="h-10 w-10 rounded-full mr-2"
                source={{
                  uri: `http://127.0.0.1:8000/storage/${blog.user.profile_image}`,
                }}
              />
              <View>
                <Text className="font-bold">{blog.user.name}</Text>
                <Text className="text-sm text-gray-500">{formatDistanceToNow(blog.created_at)}</Text>
              </View>
            </View>
            <Image
              className="h-40 w-full"
              source={{
                uri: `http://127.0.0.1:8000/storage/${blog.image}`,
              }}
            />
            
            <Text className="text-lg font-bold">{blog.title}</Text>
            <Text className="text-lg ">{blog.description}</Text>
            
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );

}