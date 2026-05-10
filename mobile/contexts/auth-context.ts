import axios from "@/api/axios";
import { setToken } from "@/services/auth-storage";
import { router } from "expo-router";
import { Alert, Platform } from "react-native";
import { create } from "zustand";
import { ImagePickerAsset } from 'expo-image-picker';
interface User {
  id: number;
  name: string;
  email: string;
  profile_image: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  getUser: () => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  register: (data:RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: { name: string; email: string }) => Promise<void>;
}

interface RegisterData{
  name:string;
  email:string;
  password:string;
  password_confirmation:string;
  profile_image: ImagePickerAsset | string | null; 
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,

  getUser: async () => {
    try {
      const { data } = await axios.get("/user");
      set({ user: data });
    } catch (error) {
      console.log("Get user error:", error);
      set({ user: null });
    }
  },

  login: async (data) => {
    try {
      const response = await axios.post("/login", data);
      await setToken(response.data.token);
      await get().getUser();
    } catch (error) {
      console.log("Login error:", error);
      throw error;
    }
  },

 register: async (data) => {
  try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('password_confirmation', data.password_confirmation);

    if (data.profile_image && typeof data.profile_image !== 'string') {
      const fileType = data.profile_image.uri.split('.').pop()?.toLowerCase() || 'jpg';
      
      if (Platform.OS === 'web') {
        const response = await fetch(data.profile_image.uri);
        const blob = await response.blob();
        formData.append('profile_image', blob, `profile.${fileType}`);
      } else {
        formData.append('profile_image', {
          uri: data.profile_image.uri,
          name: `profile.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }
    }

    const response = await axios.post("/register", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    Alert.alert("Success", response.data.message);
  } catch (error: any) {
    console.error("Register error:", error);
    throw error;
  }
  },

  updateUser: async (data) => {
    try {
      const response = await axios.put("/user", data);
      if (response.data.user) {
        set({ user: response.data.user });
      } else {
        await get().getUser();
      }
    } catch (error: any) {
      console.error("Update user error:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await axios.post("/logout");
    } catch (error) {
      console.log("Logout API error:", error);
    } finally {
      await setToken(null);
      set({ user: null });
      router.replace("/(auth)/login");
    }
  },
}));
