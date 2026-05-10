import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import axios from "@/api/axios";
import * as ImagePicker from "expo-image-picker";

export default function EditBlogPost() {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<any>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/blogs/${id}`);
        if (response.data) {
          setTitle(response.data.title || "");
          setDescription(response.data.description || "");
          setCurrentImageUrl(response.data.image || null);
        } else {
          setStatus({ type: 'error', message: "Blog post not found" });
          setTimeout(() => router.navigate("/blogs/user"), 2000);
        }
      } catch (error: any) {
        console.error("Error fetching blog:", error);
        setStatus({ type: 'error', message: error.response?.data?.message || "Failed to load blog post" });
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission required", "Permission to access the media library is required.");
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleUpdate = async () => {
    const updateBlog = async () => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('_method', 'POST'); // Explicitly set method for clarity in Laravel

        if (image) {
          const fileType = image.uri.split('.').pop()?.toLowerCase() || 'jpg';
          
          if (Platform.OS === 'web') {
            const response = await fetch(image.uri);
            const blob = await response.blob();
            formData.append('image', blob, `blog_image.${fileType}`);
          } else {
            formData.append('image', {
              uri: image.uri,
              name: `blog_image.${fileType}`,
              type: `image/${fileType}`,
            } as any);
          }
        }

        await axios.post(`/blogs/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setStatus({ type: 'success', message: "Blog updated successfully!" });
        
        if (Platform.OS !== 'web') {
          Alert.alert("Success", "Blog updated successfully!", [
            { text: "OK", onPress: () => router.navigate("/blogs/user") },
          ]);
        } else {
          setTimeout(() => router.navigate("/blogs/user"), 2000);
        }
      } catch (error: any) {
        console.error("Update blog error:", error);
        setStatus({ type: 'error', message: error.response?.data?.message || "Failed to update blog. Please try again." });
        if (Platform.OS !== 'web') {
          Alert.alert("Error", error.response?.data?.message || "Failed to update blog. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to save these changes?")) {
        await updateBlog();
      }
    } else {
      Alert.alert("Save Changes", "Are you sure you want to save these changes?", [
        { text: "Cancel", style: "cancel" },
        { text: "Save", onPress: updateBlog },
      ]);
    }
  };

  const handleDelete = async () => {
    const deleteBlog = async () => {
      setIsLoading(true);
      try {
        await axios.delete(`/blogs/${id}`);
        setStatus({ type: 'success', message: "Blog deleted successfully!" });
        
        if (Platform.OS !== 'web') {
          Alert.alert("Success", "Blog deleted successfully!", [
            { text: "OK", onPress: () => router.navigate("/blogs/user") },
          ]);
        } else {
          setTimeout(() => router.navigate("/blogs/user"), 2000);
        }
      } catch (error: any) {
        console.error("Delete blog error:", error);
        setStatus({ type: 'error', message: error.response?.data?.message || "Failed to delete blog. Please try again." });
        if (Platform.OS !== 'web') {
          Alert.alert("Error", error.response?.data?.message || "Failed to delete blog. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to delete this blog post?")) {
        await deleteBlog();
      }
    } else {
      Alert.alert("Delete Blog Post", "Are you sure you want to delete this blog post?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: deleteBlog, style: "destructive" },
      ]);
    }
  };

  return (
    <View className="p-4 gap-4">
      <TouchableOpacity onPress={() => router.back()} className="mb-2">
        <Text className="text-blue-500 font-bold">← Back</Text>
      </TouchableOpacity>

      <Text className="text-2xl font-bold mb-2">Edit Blog Post</Text>

      {status && (
        <View className={`p-4 rounded-lg ${status.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
          <Text className={`${status.type === 'success' ? 'text-green-800' : 'text-red-800'} font-medium`}>
            {status.message}
          </Text>
        </View>
      )}

      <TextInput
        value={title}
        onChangeText={setTitle}
        className="h-12 px-4 border rounded"
        placeholder="Title"
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        className="h-12 px-4 border rounded"
        placeholder="Description"
        multiline
        numberOfLines={4}
      />
      
      <View>
        <Text className="font-bold mb-2">Blog Image</Text>
        {image ? (
          <Image
            className="h-40 w-full rounded mb-2"
            source={{ uri: image.uri }}
          />
        ) : currentImageUrl ? (
          <Image
            className="h-40 w-full rounded mb-2"
            source={{ uri: `http://127.0.0.1:8000/storage/${currentImageUrl}` }}
          />
        ) : null}
        
        <TouchableOpacity
          onPress={pickImage}
          className="h-12 bg-blue-500 items-center justify-center rounded"
        >
          <Text className="text-white font-bold">Change Image</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleUpdate}
        disabled={isLoading}
        className={`h-12 rounded-full bg-blue-600 items-center justify-center ${isLoading ? 'opacity-50' : ''}`}>
        <Text className="text-white font-bold">{isLoading ? 'Saving...' : 'Save Changes'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={handleDelete}
        disabled={isLoading}
        className={`h-12 rounded-full bg-red-600 items-center justify-center mt-2 ${isLoading ? 'opacity-50' : ''}`}>
        <Text className="text-white font-bold">Delete Blog</Text>
      </TouchableOpacity>
    </View>
  );
}
