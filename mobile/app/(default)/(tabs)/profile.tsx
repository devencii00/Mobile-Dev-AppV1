import { View, Text, TouchableOpacity, Image, TextInput, Alert, Platform } from "react-native";
import React, { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { router } from "expo-router";

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
    <View className="p-4">
      <Text className="text-2xl font-bold text-center mb-6">Settings</Text>
      <Image
        className="h-40 w-40 rounded-full self-center mb-4 border-2 border-gray-200"
        source={{
          uri: user?.profile_image 
            ? (user.profile_image.startsWith('http') 
                ? user.profile_image 
                : `http://127.0.0.1:8000/storage/${user.profile_image}`)
            : 'https://via.placeholder.com/150',
        }}
      />
      <View className="mb-4">
        <Text className="font-bold mb-2">Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          className="h-12 px-4 border rounded"
        />
      </View>
      <View className="mb-4">
        <Text className="font-bold mb-2">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          className="h-12 px-4 border rounded"
        />
      </View>
      <TouchableOpacity
        onPress={handleUpdate}
        disabled={isLoading}
        className={`h-12 rounded-full bg-green-500 items-center justify-center mb-4 ${isLoading ? 'opacity-50' : ''}`}
      >
        <Text className="text-white font-bold">{isLoading ? 'Saving...' : 'Save Changes'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.navigate("/blogs/user")}
        className="h-12 rounded-full bg-blue-500 items-center justify-center mb-4"
      >
        <Text className="text-white font-bold">See blog posts</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleLogout}
        disabled={isLoading}
        className={`h-12 rounded-full bg-red-500 items-center justify-center ${isLoading ? 'opacity-50' : ''}`}
      >
        <Text className="text-white font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

