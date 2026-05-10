import {
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import axios from "@/api/axios";
import { router } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";

export default function Create() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<any>(null);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<any>({});

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

  const handleCreateBlog = async () => {
    setIsLoading(true);
    setErrors({});
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
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

      await axios.post("/create/blog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsSuccess(true);
      setTimeout(() => {
        router.navigate("/home");
      }, 2000);
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        Alert.alert("Error", "Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.navigate("/home")}>
            <Feather name="arrow-left" size={24} color="#2563eb" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Create New Post</Text>
        </View>
      </View>

      <View className="p-4 gap-4">
        {isSuccess && (
          <View className="p-4 rounded-xl bg-green-50 border border-green-200 flex-row items-center gap-2">
            <Feather name="check-circle" size={22} color="#16a34a" />
            <View className="flex-1">
              <Text className="font-semibold text-green-800">Success!</Text>
              <Text className="text-green-700 text-sm">Blog post created successfully! Redirecting...</Text>
            </View>
          </View>
        )}

        {/* Title Input */}
        <View className="gap-1">
          <Text className="text-gray-700 font-medium ml-1">Title</Text>
          <View className="flex-row items-center gap-2 px-4 border border-gray-300 rounded-xl bg-white">
            <Feather name="edit-2" size={18} color="#9ca3af" />
            <TextInput
              value={title}
              onChangeText={setTitle}
              className="flex-1 h-12 text-gray-800"
              placeholder="Enter blog title"
              placeholderTextColor="#9ca3af"
            />
          </View>
          {errors.title && (
            <View className="flex-row items-center gap-1 ml-1">
              <Feather name="alert-circle" size={14} color="#ef4444" />
              <Text className="text-red-500 text-sm">{errors.title[0]}</Text>
            </View>
          )}
        </View>

        {/* Description Input */}
        <View className="gap-1">
          <Text className="text-gray-700 font-medium ml-1">Description</Text>
          <View className="flex-row items-start gap-2 px-4 border border-gray-300 rounded-xl bg-white">
            <Feather name="file-text" size={18} color="#9ca3af" style={{ marginTop: 14 }} />
            <TextInput
              value={description}
              onChangeText={setDescription}
              className="flex-1 py-3 text-gray-800"
              placeholder="Enter blog description"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          {errors.description && (
            <View className="flex-row items-center gap-1 ml-1">
              <Feather name="alert-circle" size={14} color="#ef4444" />
              <Text className="text-red-500 text-sm">{errors.description[0]}</Text>
            </View>
          )}
        </View>

        {/* Image Picker */}
        <View className="gap-2">
          <Text className="text-gray-700 font-medium ml-1">Blog Image</Text>
          <TouchableOpacity
            onPress={pickImage}
            className="h-24 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 items-center justify-center"
          >
            <View className="items-center gap-2">
              <Feather name="image" size={32} color="#6b7280" />
              <Text className="text-gray-500 font-medium">Browse Image</Text>
              <Text className="text-xs text-gray-400">JPEG, PNG, JPG (Max 5MB)</Text>
            </View>
          </TouchableOpacity>
          {errors.image && (
            <View className="flex-row items-center gap-1 ml-1">
              <Feather name="alert-circle" size={14} color="#ef4444" />
              <Text className="text-red-500 text-sm">{errors.image[0]}</Text>
            </View>
          )}
        </View>

        {/* Image Preview */}
        {image && (
          <View className="gap-2">
            <Text className="text-gray-700 font-medium ml-1">Image Preview</Text>
            <View className="relative">
              <Image
                className="h-48 w-full rounded-xl"
                source={{ uri: image.uri }}
              />
              <TouchableOpacity
                onPress={() => setImage(null)}
                className="absolute top-2 right-2 bg-red-500 rounded-full p-2"
              >
                <Feather name="x" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleCreateBlog}
          disabled={isLoading}
          className={`h-12 rounded-xl bg-blue-600 items-center justify-center mt-4 flex-row gap-2 ${isLoading ? 'opacity-50' : ''}`}
        >
          {isLoading ? (
            <>
              <Feather name="loader" size={18} color="white" />
              <Text className="text-white font-semibold">Creating Blog...</Text>
            </>
          ) : (
            <>
              <Feather name="upload" size={18} color="white" />
              <Text className="text-white font-semibold">Create Blog</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          onPress={() => router.navigate("/home")}
          className="h-12 rounded-xl bg-gray-200 items-center justify-center flex-row gap-2"
        >
          <Feather name="x" size={18} color="#4b5563" />
          <Text className="text-gray-700 font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}