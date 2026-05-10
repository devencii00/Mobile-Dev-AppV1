import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Pressable, Alert, Image, Platform } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

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
    <View className="flex-1 items-center justify-center p-4 bg-gray-100">
      <View className="bg-white shadow-md p-6 w-full gap-4 rounded-xl">
        <Text className="text-xl font-bold text-center">Register Account</Text>

        {isSuccess && (
          <View className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
            <Text className="font-medium">Account created successfully!</Text>
          </View>
        )}

     
        <View className="items-center mb-2">
          <TouchableOpacity
            onPress={pickImage}
            className="w-40 h-40  bg-blue-600 justify-center items-center overflow-hidden"
          >
            {profile_image ? (
              <Image source={{ uri: profile_image.uri }} className="w-full h-full" />
            ) : (
              <Text className="text-xs text-center text-white">Upload Profile Picture</Text>
            )}
          </TouchableOpacity>
        </View>



        <TextInput value={name} onChangeText={setName} className="h-12 px-4 border rounded" placeholder="Full Name" />
        {errors.name && <Text className="text-red-500 text-sm">{errors.name[0]}</Text>}

        <TextInput value={email} onChangeText={setEmail} className="h-12 px-4 border rounded" placeholder="Email Address" keyboardType="email-address" autoCapitalize="none" />
        {errors.email && <Text className="text-red-500 text-sm">{errors.email[0]}</Text>}

        <TextInput value={password} onChangeText={setPassword} className="h-12 px-4 border rounded" placeholder="Password" secureTextEntry />
        {errors.password && <Text className="text-red-500 text-sm">{errors.password[0]}</Text>}

        <TextInput value={password_confirmation} onChangeText={setPasswordConfirmation} className="h-12 px-4 border rounded" placeholder="Confirm Password" secureTextEntry />
        {errors.password_confirmation && <Text className="text-red-500 text-sm">{errors.password_confirmation[0]}</Text>}

        <TouchableOpacity onPress={handleRegistration} disabled={isLoading} className={`h-12 rounded-full bg-blue-600 items-center justify-center mt-2 ${isLoading ? 'opacity-50' : ''}`}>
          <Text className="text-white font-bold">{isLoading ? 'Creating Account...' : 'Create Account'}</Text>
        </TouchableOpacity>

        <Pressable onPress={() => router.navigate("/login")} className="mt-2">
          <Text className="text-blue-500 text-center">Back to Login</Text>
        </Pressable>
      </View>
    </View>
  );
}
