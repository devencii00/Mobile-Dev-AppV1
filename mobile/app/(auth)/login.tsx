import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Pressable } from "react-native";
import { router } from "expo-router";


export default function Login() {



  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{ email?: string[]; password?: string[] }>({});
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    login({ email, password });
    const newErrors: { email?: string[]; password?: string[]; } = {};




    if (!email) {
      newErrors.email = ["Email is required"];``
    }



    if (!password) {
      newErrors.password = ["Password is required"];
    }




    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    login({ email, password });
  };



  return (
    <View className="flex-1 items-center justify-center p-4  ">
      <View className="bg-white shadow-md p-4 w-full gap-4 rounded" >  {message && (
        <Text className="p-4 bg-green-500 rounded-xl text-white">
          {message}
        </Text>
      )}
        <Text className="text-xl font-bold text-center">Login to your account</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          className="h-12 px-4 border"
          placeholder="Enter your email"
        />   {errors.email && <Text className="text-red-500 text-sm mt-1">{errors.email[0]}</Text>}
        <TextInput
          value={password}
          onChangeText={setPassword}
          className="h-12 px-4 border"
          placeholder="Enter your password"
          secureTextEntry
        /> {errors.password && <Text className="text-red-500 text-sm mt-1">{errors.password[0]}</Text>}
        <TouchableOpacity
          onPress={handleLogin}
          className="h-12 rounded-full bg-blue-500 items-center justify-center"
        >
          <Text className="text-white font-bold">Login</Text>

        </TouchableOpacity>

        <Pressable onPress={() =>
          router.navigate({
            pathname: "/register",
          })
        }>
          <Text style={{ color: 'blue' }}>
            Register your account
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
