import { View, Text, Image, ScrollView, Pressable, Alert } from "react-native";
import { useAuth } from "@/contexts/auth-context";
import React, { useCallback, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import axios from "@/api/axios";

type BlogProps = {
  id: number;
  title: string;
  image: string;
  description: string;
};

export default function Home() {
  const [blogs, setBlogs] = useState<BlogProps[]>([]);

  const getBlogs = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/fetchBlogs");
      setBlogs(response.data);
    } catch (error) {
      console.log("Error fetching blogs:", error);
    }
  };

   useFocusEffect(
    useCallback(() => {
      getBlogs();
    }, [])
  );


  return (
    <ScrollView className="p-4">
      
      <View className="gap-4">
          <Pressable onPress={() => router.navigate("/(default)/(pages)/home/create")} className="mt-2">
          <Text className="text-blue-500 text-center">Create a Blog Post</Text>
        </Pressable>

        {blogs.map((blog) => (
          
          <View key={blog.id} className="mb-6">
            <Image
              className="h-40 w-full"
              source={{
                uri: `http://127.0.0.1:8000/storage/${blog.image}`,
              }}
            />
            
            <Text className="text-lg font-bold">{blog.title}</Text>
            <Text className="text-lg ">{blog.description}</Text>
            
          </View>
        ))}
      </View>
    </ScrollView>
  );
}





// import { View, Text, Image, ScrollView, Pressable, Alert } from "react-native";
// import { useAuth } from "@/contexts/auth-context";
// import React, { useCallback, useState } from "react";
// import { router, useFocusEffect } from "expo-router";
// import axios from "@/api/axios";

// type BlogProps = {
//   id: number;
//   title: string;
//   image: string;
//   description: string;
// };

// export default function Home() {
//   const [blogs, setBlogs] = useState<BlogProps[]>([]);

//   const getBlogs = async () => {
//     try {
//       const response = await axios.get("http://127.0.0.1:8000/api/fetchBlogs");
//       setBlogs(response.data);
//     } catch (error) {
//       console.log("Error fetching blogs:", error);
//     }
//   };

//    useFocusEffect(
//     useCallback(() => {
//       getBlogs();
//     }, [])
//   );


//   return (
//  <ScrollView
//   showsVerticalScrollIndicator={false}
//   showsHorizontalScrollIndicator={false}
//   className="p-4"
// >
//   <Pressable 
//     onPress={() => router.navigate("/(default)/(pages)/home/create")} 
//     className="my-4"
//   >
//     <Text className="text-blue-500 text-center">Create a Blog Post</Text>
//   </Pressable>

//   {blogs.map((blog) => (
//     <Pressable 
//       onPress={() => router.navigate(`/blogs/${blog.id}`)} 
//       key={blog.id}
//       className="mb-6"
//     >
//       <Image 
//         source={{ uri: `http://127.0.0.1:8000/storage/${blog.image}` }} 
//         style={{ height: 250 }} 
//         className="w-full "
//       />
      
//       <Text className="text-xl font-bold text-black-600 mt-2">
//         {blog.title}
//       </Text>
      
//       <Text className="text-gray-700">
//         {blog.description}
//       </Text>
//     </Pressable>
//   ))}
// </ScrollView>

//   );
// }

