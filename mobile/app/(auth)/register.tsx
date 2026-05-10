import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Pressable, Alert, Image, Platform } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Feather, MaterialIcons } from "@expo/vector-icons";

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [profile_image, setProfileImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  
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
      setProfileImage(result.assets[0]);
    }
  };

  // const handleRegistrations = async () => {
  //   const newErrors: any = {};
  //   if (!name) newErrors.name = ["Name is required"];
  //   if (!email) newErrors.email = ["Email is required"];
  //   if (!password) newErrors.password = ["Password is required"];
  //   if (password !== password_confirmation) newErrors.password_confirmation = ["Passwords do not match"];

  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     return;
  //   }

  //   setErrors({});

  //   try {
  //     await register({
  //       name,
  //       email,
  //       password,
  //       password_confirmation,
  //       profile_image
  //     });
  //   } catch (e) {
  //     Alert.alert("Registration Failed", "Something went wrong.");
  //   }
  // };

  const handleRegistration = async () => {
     const newErrors: any = {};
    if (!name) newErrors.name = ["Name is required"];
    if (!email) newErrors.email = ["Email is required"];
    if (!password) newErrors.password = ["Password is required"];
    if (password !== password_confirmation) newErrors.password_confirmation = ["Passwords do not match"];
    if (!profile_image) newErrors.profile_image = ["Profile image is required"];

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

   try {

    await register({
      name,
      email,
      password,
      password_confirmation,
      profile_image 
    });

    setIsSuccess(true);
    setTimeout(() => {
      router.navigate("/login");
    }, 2000);
  } catch (e: any) {
    if (e.response && e.response.status === 422) {
      setErrors(e.response.data.errors);
    } else {
      Alert.alert("Error", "Something went wrong.");
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <View className="flex-1 items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-200">
      <View className="bg-white shadow-lg p-6 w-full gap-5 rounded-2xl border border-gray-100">
        {/* Header with Icon */}
        <View className="items-center gap-2">
         
          <Text className="text-2xl font-bold text-gray-800">Register Account</Text>
          <Text className="text-sm text-gray-500">Create your account to get started</Text>
        </View>

        {isSuccess && (
          <View className="p-3 rounded-lg bg-green-50 border border-green-200 flex-row items-center gap-2">
            <Feather name="check-circle" size={20} color="#16a34a" />
            <Text className="text-sm text-green-700 font-medium">Account created successfully! Redirecting to login...</Text>
          </View>
        )}

        {/* Profile Image Upload */}
        <View className="items-center mb-2">
          <TouchableOpacity
            onPress={pickImage}
            className={`w-32 h-32 rounded-full bg-gray-100 justify-center items-center overflow-hidden border-2 border-dashed ${errors.profile_image ? 'border-red-500' : 'border-gray-300'}`}
          >
            {profile_image ? (
              <Image source={{ uri: profile_image.uri }} className="w-full h-full" />
            ) : (
              <View className="items-center gap-1">
                <Feather name="camera" size={32} color="#9ca3af" />
                <Text className="text-xs text-gray-400 text-center px-2">Upload Photo</Text>
              </View>
            )}
          </TouchableOpacity>
          {errors.profile_image && <Text className="text-red-500 text-sm mt-1">{errors.profile_image[0]}</Text>}
        </View>

        {/* Name Input */}
        <View className="gap-1">
          <View className="flex-row items-center gap-2 px-4 h-12 border border-gray-300 rounded-xl bg-gray-50 focus:border-blue-500">
            <Feather name="user" size={18} color="#9ca3af" />
            <TextInput 
              value={name} 
              onChangeText={setName} 
              className="flex-1 text-gray-800" 
              placeholder="Full Name"
              placeholderTextColor="#9ca3af"
            />
          </View>
          {errors.name && <Text className="text-red-500 text-sm ml-1">{errors.name[0]}</Text>}
        </View>

        {/* Email Input */}
        <View className="gap-1">
          <View className="flex-row items-center gap-2 px-4 h-12 border border-gray-300 rounded-xl bg-gray-50">
            <MaterialIcons name="email" size={18} color="#9ca3af" />
            <TextInput 
              value={email} 
              onChangeText={setEmail} 
              className="flex-1 text-gray-800" 
              placeholder="Email Address" 
              keyboardType="email-address" 
              autoCapitalize="none"
              placeholderTextColor="#9ca3af"
            />
          </View>
          {errors.email && <Text className="text-red-500 text-sm ml-1">{errors.email[0]}</Text>}
        </View>

        {/* Password Input */}
        <View className="gap-1">
          <View className="flex-row items-center gap-2 px-4 h-12 border border-gray-300 rounded-xl bg-gray-50">
            <Feather name="lock" size={18} color="#9ca3af" />
            <TextInput 
              value={password} 
              onChangeText={setPassword} 
              className="flex-1 text-gray-800" 
              placeholder="Password" 
              secureTextEntry 
              placeholderTextColor="#9ca3af"
            />
          </View>
          {errors.password && <Text className="text-red-500 text-sm ml-1">{errors.password[0]}</Text>}
        </View>

        {/* Confirm Password Input */}
        <View className="gap-1">
          <View className="flex-row items-center gap-2 px-4 h-12 border border-gray-300 rounded-xl bg-gray-50">
            <Feather name="shield" size={18} color="#9ca3af" />
            <TextInput 
              value={password_confirmation} 
              onChangeText={setPasswordConfirmation} 
              className="flex-1 text-gray-800" 
              placeholder="Confirm Password" 
              secureTextEntry 
              placeholderTextColor="#9ca3af"
            />
          </View>
          {errors.password_confirmation && <Text className="text-red-500 text-sm ml-1">{errors.password_confirmation[0]}</Text>}
        </View>

        {/* Register Button */}
        <TouchableOpacity 
          onPress={handleRegistration} 
          disabled={isLoading} 
          className={`h-12 rounded-xl bg-blue-600 items-center justify-center mt-2 flex-row gap-2 ${isLoading ? 'opacity-50' : ''}`}
        >
          {isLoading ? (
            <>
              <Feather name="loader" size={18} color="white" />
              <Text className="text-white font-semibold">Creating Account...</Text>
            </>
          ) : (
            <>
              <Feather name="check-circle" size={18} color="white" />
              <Text className="text-white font-semibold">Create Account</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <Pressable onPress={() => router.navigate("/login")} className="mt-1">
          <Text className="text-blue-600 text-center font-medium">
            Already have an account? <Text className="font-bold">Sign In</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}