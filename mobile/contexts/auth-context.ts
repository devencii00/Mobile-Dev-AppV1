import axios from "@/api/axios";
import { setToken } from "@/services/auth-storage";
import { router } from "expo-router";
import { Alert } from "react-native";
import { create } from "zustand";
import { ImagePickerAsset } from 'expo-image-picker';
interface User {
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
      console.log(error);
    }
  },

  login: async (data) => {
    try {
      const response = await axios.post("/login", data);
      await setToken(response.data.token);
      get().getUser();
    } catch (error) {
      console.log(error);
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
      
      const response = await fetch(data.profile_image.uri);
      const blob = await response.blob();
      const fileType = data.profile_image.uri.split('.').pop()?.toLowerCase() || 'jpg';
      
      formData.append('profile_image', blob, `profile.${fileType}`);
    }

    const response = await axios.post("/register", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    Alert.alert("Success", response.data.message);
    router.navigate("/login");
  } catch (error: any) {
   
    throw error;
  }
},

  logout: async () => {
    try {
      await axios.post("/logout");
      await setToken(null);
      set({ user: null });
    } catch (error) {
      console.log(error);
    }
  },
}));
