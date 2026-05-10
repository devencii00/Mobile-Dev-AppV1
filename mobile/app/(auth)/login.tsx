import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";

export default function Login() {

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string[]; password?: string[] }>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const newErrors: { email?: string[]; password?: string[] } = {};

    if (!email) {
      newErrors.email = ["Email is required"];
    }

    if (!password) {
      newErrors.password = ["Password is required"];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setErrorMessage("");
    setIsLoading(true);
    try {
      await login({ email, password });
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response && error.response.status === 422) {
        // Handle validation errors from server
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else {
          setErrorMessage(error.response.data.message || "Invalid credentials");
        }
      } else {
        setErrorMessage("Invalid email or password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-200">
      <View className="bg-white shadow-lg p-6 w-full gap-5 rounded-2xl border border-gray-100">
        
        {message && (
          <View className="p-3 rounded-lg bg-green-50 border border-green-200 flex-row items-center gap-2">
            <Feather name="check-circle" size={20} color="#16a34a" />
            <Text className="text-sm text-green-700 font-medium flex-1">
              {message}
            </Text>
          </View>
        )}

        {errorMessage && (
          <View className="p-3 rounded-lg bg-red-50 border border-red-200 flex-row items-center gap-2">
            <Feather name="alert-circle" size={20} color="#dc2626" />
            <Text className="text-sm text-red-700 font-medium flex-1">
              {errorMessage}
            </Text>
          </View>
        )}
        
        {/* Header Section */}
        <View className="items-center gap-2">
          
          <Text className="text-2xl font-bold text-gray-800">Welcome Back</Text>
          <Text className="text-sm text-gray-500 text-center">Sign in to continue to your account</Text>
        </View>

        {/* Email Input */}
        <View className="gap-1">
          <View className="flex-row items-center gap-2 px-4 h-12 border border-gray-300 rounded-xl bg-gray-50 focus:border-blue-500">
            <MaterialIcons name="email" size={18} color="#9ca3af" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              className="flex-1 text-gray-800"
              placeholder="Enter your email"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
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
              placeholder="Enter your password"
              placeholderTextColor="#9ca3af"
              secureTextEntry
            />
          </View>
          {errors.password && <Text className="text-red-500 text-sm ml-1">{errors.password[0]}</Text>}
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          className={`h-12 rounded-xl bg-blue-600 items-center justify-center mt-2 flex-row gap-2 ${isLoading ? 'opacity-50' : ''}`}>
          {isLoading ? (
            <>
              <Feather name="loader" size={18} color="white" />
              <Text className="text-white font-semibold">Logging in...</Text>
            </>
          ) : (
            <>
              <Feather name="log-in" size={18} color="white" />
              <Text className="text-white font-semibold">Login</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Register Link */}
        <Pressable 
          onPress={() => router.navigate({ pathname: "/register" })}
          className="mt-1"
        >
          <Text className="text-blue-600 text-center font-medium">
            Don't have an account? <Text className="font-bold">Sign Up</Text>
          </Text>
        </Pressable>

        {/* Forgot Password Hint */}
        <View className="items-center mt-1">
          <Text className="text-xs text-gray-400">
         
          </Text>
        </View>
      </View>
    </View>
  );
}