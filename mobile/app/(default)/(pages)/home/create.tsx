import {
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  Image,
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

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required.",
      );
      return;
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
    try {
      axios.post(
        "/create/blog",
        { title, image: image?.file, description },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="p-4 gap-4">
      <TextInput
        value={title}
        onChangeText={setTitle}
        className="h-12 px-4 border"
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        className="h-12 px-4 border"
      />
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
        className="h-12 rounded-full bg-blue-500 items-center justify-center"
      >
        <Text className="text-white font-bold">Create Blog</Text>
      </TouchableOpacity>
        <Pressable onPress={() => router.navigate("/home")} className="mt-2">
                <Text className="text-blue-500 text-center">Back to home</Text>
              </Pressable>
    </View>
  );
}
