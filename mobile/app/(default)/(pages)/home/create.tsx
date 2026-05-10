import {
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import axios from "@/api/axios";
import { router } from "expo-router";

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
    <View className="p-4 gap-4">
      {isSuccess && (
        <View className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
          <Text className="font-medium">Blog post created successfully!</Text>
        </View>
      )}
      <TextInput
        value={title}
        onChangeText={setTitle}
        className="h-12 px-4 border"
        placeholder="Title"
      />
      {errors.title && <Text className="text-red-500 text-sm">{errors.title[0]}</Text>}
      <TextInput
        value={description}
        onChangeText={setDescription}
        className="h-12 px-4 border"
        placeholder="Description"
      />
      {errors.description && <Text className="text-red-500 text-sm">{errors.description[0]}</Text>}
      <View>
        <TouchableOpacity
          onPress={pickImage}
          className="h-12 bg-blue-500 items-center justify-center"
        >
          <Text className="text-white">Browse Image</Text>
        </TouchableOpacity>
      </View>
      {image && (
        <Image
          className="h-40"
          source={{
            uri: image.uri,
          }}
        />
      )}
      <TouchableOpacity
        onPress={handleCreateBlog}
        disabled={isLoading}
        className={`h-12 rounded-full bg-blue-500 items-center justify-center ${isLoading ? 'opacity-50' : ''}`}>
        <Text className="text-white font-bold">{isLoading ? 'Creating Blog...' : 'Create Blog'}</Text>
      </TouchableOpacity>
        <Pressable onPress={() => router.navigate("/home")} className="mt-2">
                <Text className="text-blue-500 text-center">Back to home</Text>
              </Pressable>
    </View>
  );
}
