import { View, Text, TouchableOpacity, Image, TextInput, Alert, Platform, ScrollView } from "react-native";
import React, { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { router } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";

export default function Profile() {
  const { logout, user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isLoading, setIsLoading] = useState(false);

  // Update local state when user data changes
  React.useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const saveChanges = async () => {
      setIsLoading(true);
      try {
        await updateUser({ name: name.trim(), email: email.trim() });
        Alert.alert("Success", "Profile updated successfully!");
      } catch (error: any) {
        console.error("Profile update error:", error);
        Alert.alert("Error", error.response?.data?.message || "Failed to update profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to save these changes?")) {
        await saveChanges();
      }
    } else {
      Alert.alert("Save Changes", "Are you sure you want to save these changes?", [
        { text: "Cancel", style: "cancel" },
        { text: "Save", onPress: saveChanges },
      ]);
    }
  };

  const handleLogout = async () => {
    const performLogout = async () => {
      try {
        await logout();
        Alert.alert("Success", "You have been logged out successfully!");
      } catch (error) {
        console.error("Logout error:", error);
        Alert.alert("Error", "Failed to log out. Please try again.");
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to log out?")) {
        await performLogout();
      }
    } else {
      Alert.alert("Logout", "Are you sure you want to log out?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: performLogout, style: "destructive" },
      ]);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#2563eb" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Profile Settings</Text>
        </View>
      </View>

      <View className="p-4">
        {/* Profile Image Section */}
        <View className="items-center mb-6">
          <View className="relative">
            <Image
              className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
              source={{
                uri: user?.profile_image 
                  ? (user.profile_image.startsWith('http') 
                      ? user.profile_image 
                      : `http://127.0.0.1:8000/storage/${user.profile_image}`)
                  : 'https://via.placeholder.com/150',
              }}
            />
            <View className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 border-2 border-white">
              <Feather name="camera" size={14} color="white" />
            </View>
          </View>
          <Text className="text-gray-600 text-sm mt-2">@{user?.name?.toLowerCase().replace(/\s/g, '') || 'username'}</Text>
        </View>

        {/* User Info Card */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">Account Information</Text>
          
          {/* Name Field */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2 ml-1">Full Name</Text>
            <View className="flex-row items-center gap-2 px-4 border border-gray-300 rounded-xl bg-gray-50">
              <Feather name="user" size={18} color="#9ca3af" />
              <TextInput
                value={name}
                onChangeText={setName}
                className="flex-1 h-12 text-gray-800"
                placeholder="Enter your name"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          {/* Email Field */}
          <View className="mb-2">
            <Text className="text-gray-700 font-medium mb-2 ml-1">Email Address</Text>
            <View className="flex-row items-center gap-2 px-4 border border-gray-300 rounded-xl bg-gray-50">
              <MaterialIcons name="email" size={18} color="#9ca3af" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                className="flex-1 h-12 text-gray-800"
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="gap-3">
          {/* Save Button */}
          <TouchableOpacity
            onPress={handleUpdate}
            disabled={isLoading}
            className={`h-12 rounded-xl bg-green-600 items-center justify-center flex-row gap-2 shadow-sm ${isLoading ? 'opacity-50' : ''}`}
          >
            {isLoading ? (
              <>
                <Feather name="loader" size={18} color="white" />
                <Text className="text-white font-semibold">Saving Changes...</Text>
              </>
            ) : (
              <>
                <Feather name="check-circle" size={18} color="white" />
                <Text className="text-white font-semibold">Save Changes</Text>
              </>
            )}
          </TouchableOpacity>

          {/* My Blogs Button */}
          <TouchableOpacity
            onPress={() => router.navigate("/blogs/user")}
            className="h-12 rounded-xl bg-blue-600 items-center justify-center flex-row gap-2 shadow-sm"
          >
            <Feather name="book-open" size={18} color="white" />
            <Text className="text-white font-semibold">My Blog Posts</Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            disabled={isLoading}
            className={`h-12 rounded-xl bg-red-500 items-center justify-center flex-row gap-2 shadow-sm ${isLoading ? 'opacity-50' : ''}`}
          >
            <Feather name="log-out" size={18} color="white" />
            <Text className="text-white font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Account Stats */}
        {/* <View className="flex-row justify-around mt-6 pt-4 border-t border-gray-200">
          <View className="items-center">
            <Feather name="file-text" size={20} color="#6b7280" />
            <Text className="text-gray-600 text-sm mt-1">Posts</Text>
            <Text className="font-bold text-gray-800">0</Text>
          </View>
          <View className="items-center">
            <Feather name="heart" size={20} color="#6b7280" />
            <Text className="text-gray-600 text-sm mt-1">Likes</Text>
            <Text className="font-bold text-gray-800">0</Text>
          </View>
          <View className="items-center">
            <Feather name="calendar" size={20} color="#6b7280" />
            <Text className="text-gray-600 text-sm mt-1">Joined</Text>
            <Text className="font-bold text-gray-800">2024</Text>
          </View>
        </View> */}

        {/* Version Info */}
        {/* <View className="items-center mt-6 mb-4">
          <Text className="text-xs text-gray-400">App Version 1.0.0</Text>
        </View> */}
      </View>
    </ScrollView>
  );
}