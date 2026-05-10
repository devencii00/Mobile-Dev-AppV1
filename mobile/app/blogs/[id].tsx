// import {View,Text,TextInput,Alert,TouchableOpacity,Image,} from "react-native";

// import * as ImagePicker from "expo-image-picker";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocalSearchParams } from "expo-router";
// import { useRouter } from 'expo-router';

// type BlogProps = {
//   id: number;
//   title: string;
//   image: string;
//   description: string;
// };

// export default function Student() {
//   const [title, setTitle] = useState("");
//     const [image, setImage] = useState<any>(null);
//     const [description, setDescription] = useState("");
  
//     const pickImage = async () => {
//       const permissionResult =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();
  
//       if (!permissionResult.granted) {
//         Alert.alert(
//           "Permission required",
//           "Permission to access the media library is required.",
//         );
//         return;
//       }
  
//       let result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ["images"],
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });
  
//       if (!result.canceled) {
//         setImage(result.assets[0]);
//       }
//     };

    

//     const handleSubmit = async () => {
//         try {
//             const response = await axios.post(
//                 `http://192.168.0.85:8000/api/students/edit/${id}`,
//                 { first_name, last_name, course, year_level, profile_image: profile_image?.file },
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );
//             setMessage(response.data.message);
//         } catch (error: any) {
//             setErrors(error.response.data.errors);
//         }
//     };

//       const handleDelete = async () => {
//         try {
//             const response = await axios.post(
//                 `http://192.168.0.85:8000/api/students/destroy/${id}`,
//                 { first_name, last_name, course, year_level, profile_image: profile_image?.file },
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );
//             setMessage(response.data.message);
//         } catch (error: any) {
//             setErrors(error.response.data.errors);
//         }
//     };
// const handleBackPress = () => {
//     router.back(); 
//   };
//     return (
//         <View>
//             {message && (
//                 <Text className="h-12 bg-green-500 text-white">{message}</Text>
//             )}
//             <View>
//                 <Text>First Name</Text>
//                 <TextInput
//                     value={first_name}
//                     onChangeText={setfirst_Name}
//                     className="outline-none border h-12 px-4 focus:border-blue-500"
//                 />
//                 {errors.name && <Text className="text-red-500">{errors.first_name[0]}</Text>}
//             </View>
//              <View>
//                 <Text>Last Name</Text>
//                 <TextInput
//                     value={last_name}
//                     onChangeText={setlast_Name}
//                     className="outline-none border h-12 px-4 focus:border-blue-500"
//                 />
//                 {errors.last_name && <Text className="text-red-500">{errors.last_name[0]}</Text>}
//             </View>
//             <View>
//                 <Text>Course</Text>
//                 <TextInput
//                     value={course}
//                     onChangeText={setCourse}
//                     className="outline-none border h-12 px-4 focus:border-blue-500"
//                 />
//                 {errors.course && (
//                     <Text className="text-red-500">{errors.course[0]}</Text>
//                 )}
//             </View>
//             <View>
//                 <Text>Year Level</Text>
//                 <TextInput
//                     value={year_level}
//                     onChangeText={setYear_level}
//                     className="outline-none border h-12 px-4 focus:border-blue-500"
//                 />
//                 {errors.year_level && (
//                     <Text className="text-red-500">{errors.year_level[0]}</Text>
//                 )}
//             </View>
//             <TouchableOpacity
//                 onPress={pickImage}
//                 className="h-12 bg-blue-500 justify-center items-center"
//             >
//                 <Text className="text-white">Browse Image</Text>
//             </TouchableOpacity>
//             {errors.profile_image && <Text className="text-red-500">{errors.profile_image[0]}</Text>}
//             {profile_image?.uri ? (
//                 <Image
//                     className="h-40"
//                     source={{
//                         uri: profile_image.uri,
//                     }}
//                 />
//             ) : (
//                 <Image
//                     className="h-40"
//                     source={{
//                         uri: `http://192.168.0.85:8000/storage/${student?.profile_image}`,
//                     }}
//                 />
//             )}
//             <TouchableOpacity
//                 onPress={handleSubmit}
//                 className="h-12 bg-green-500 justify-center items-center mb-6"
//             >
//                 <Text className="text-white mb-4">Submit</Text>
//             </TouchableOpacity>
 
//               <TouchableOpacity
//                 onPress={handleDelete}
//                 className="h-12 bg-red-500 justify-center items-center"
//             >
//                 <Text className="text-white">Delete Student</Text>
//             </TouchableOpacity>
//              <TouchableOpacity onPress={handleBackPress} className="h-8 mt-12 bg-yellow-500 justify-center items-center mb-6">
//         <Text>Back To Home</Text>
//       </TouchableOpacity>
//         </View>
//     );

    
// }