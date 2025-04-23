// import React, {useEffect, useState} from "react";
// import { useFocusEffect } from "@react-navigation/native";
// import { View, Text, TouchableOpacity, Alert, ScrollView, TextInput } from "react-native";
// import { StackNavigationProp } from "@react-navigation/stack";
// import { RouteProp } from "@react-navigation/native";
// import axios from "axios";
// import { environment } from "@/environment/environment";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { RootStackParamList } from "../types";
// import { goBack } from "expo-router/build/global-state/routing";
// import DropDownPicker from "react-native-dropdown-picker";

// type ReviewProps = {
//   navigation: StackNavigationProp<RootStackParamList, "ReviewCollectionRequests">;
//   route: RouteProp<RootStackParamList, "ReviewCollectionRequests">;
// };
// interface Crop {
//     id: number;
//     cropNameEnglish: string;
//   }
  
//   interface CropVariety {
//     id: number;
//     varietyEnglish: string;
//   }
// const ReviewCollectionRequests: React.FC<ReviewProps> = ({ route, navigation }) => {
//   const { cropsList: initialCropsList, address, scheduleDate, farmerId } = route.params;
//   const [cropsList, setCropsList] = useState<any[]>(initialCropsList || []);

//     const [crop, setCrop] = useState<string | null>(null);
//     const [variety, setVariety] = useState(null);
//     const [loadIn, setLoadIn] = useState("");
//  const [cropOptions, setCropOptions] = useState<
//     { label: string; value: string }[]
//   >([]);
//   const [varietyOptions, setVarietyOptions] = useState<
//     { label: string; value: string }[]
//   >([]);
//   const [showaddtolist, setShowAddtolist] = useState(false)
//     const [openCrop, setOpenCrop] = useState(false);
//     const [openVariety, setOpenVariety] = useState(false);
//     //const [cropOptions, setCropOptions] = useState([]);
//     const [loading, setLoading] = useState(true);

//   useFocusEffect(
//     React.useCallback(() => {
//       const fetchCropNames = async () => {
//         try {
//           const token = await AsyncStorage.getItem("token");
//           if (!token) {
//             console.error("No authentication token found");
//             return;
//           }

//           const headers = { Authorization: `Bearer ${token}` };
//           const response = await axios.get<Crop[]>(
//             `${environment.API_BASE_URL}api/unregisteredfarmercrop/get-crop-names`,
//             { headers }
//           );

//           // Remove duplicates based on cropNameEnglish
//           const uniqueCropNames = response.data.reduce<Crop[]>((acc, crop) => {
//             if (
//               !acc.some((item) => item.cropNameEnglish === crop.cropNameEnglish)
//             ) {
//               acc.push(crop);
//             }
//             return acc;
//           }, []);

//           setCropOptions(
//             uniqueCropNames.map((crop) => ({
//               label: crop.cropNameEnglish,
//               value: crop.id.toString(),
//             }))
//           );

//           console.log("Unique Crop Names:", uniqueCropNames);
//         } catch (error) {
//           console.error("Error fetching crop names:", error);
//         }
//       };

//       fetchCropNames();
//     }, [])
//   );

//   // Fetch Crop Varieties
//   useEffect(() => {
//     const fetchVarieties = async () => {
//       if (!crop) return;

//       try {
//         const token = await AsyncStorage.getItem("token");
//         if (!token) {
//           console.error("No authentication token found");
//           return;
//         }

//         const headers = { Authorization: `Bearer ${token}` };
//         const cropId = Number(crop);

//         console.log("Fetching varieties for crop ID:", cropId);
//         console.log("...", cropOptions);

//         // Important: Verify the correct API endpoint for varieties
//         const response = await axios.get<CropVariety[]>(
//           `${environment.API_BASE_URL}api/unregisteredfarmercrop/crops/varieties/collection/${cropId}`,
//           { headers }
//         );

//         console.log("Fetched Varieties:", response.data);

//         setVarietyOptions(
//           response.data.map((variety) => ({
//             label: variety.varietyEnglish,
//             value: variety.id.toString(),
//           }))
//         );
//       } catch (error) {
//         if (axios.isAxiosError(error)) {
//           console.error(
//             "Error fetching crop varieties:",
//             error.response?.data || error.message
//           );
//         } else {
//           console.error("Unexpected error fetching crop varieties:", error);
//         }
//       }
//     };

//     fetchVarieties();
//   }, [crop]);

//   const handleSubmit = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (!token) {
//         Alert.alert("Error", "Please login again.");
//         return;
//       }

//       const headers = {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       };

//       // 1. Update farmer address
//       await axios.put(
//         `${environment.API_BASE_URL}api/unregisteredfarmercrop/user/update/${farmerId}`,
//         address,
//         { headers }
//       );

//       // 2. Submit collection requests
//       const requestBody = {
//         requests: cropsList.map((crop) => ({
//           farmerId,
//           crop: crop.crop,
//           variety: crop.variety,
//           loadIn: crop.loadIn,
//           scheduleDate,
//         })),
//       };

//       await axios.post(
//         `${environment.API_BASE_URL}api/unregisteredfarmercrop/submit-collection-request`,
//         requestBody,
//         { headers }
//       );

//       Alert.alert("Success", "Requests submitted successfully!");
//       navigation.goBack(); // or wherever you want to navigate after submission
//     } catch (err) {
//       console.error(err);
//       Alert.alert("Error", "Submission failed. Please try again.");
//     }
//   };

//   const handleAddMore = async () =>{
//      setShowAddtolist (true);
//   }

//   const handleAddtoList = async () => {
//     setShowAddtolist(false);
//      if (!crop || !variety || !loadIn) {
//           Alert.alert("Error", "Please fill all fields before adding.");
//           return;
//         }
    
//         const cropName = cropOptions.find((item) => item.value === crop)?.label || "";
//         const varietyName = varietyOptions.find((item) => item.value === variety)?.label || "";
        
//         const newCrop = { crop, variety, cropName, varietyName, loadIn };
    
//         // Use functional update to ensure correct state updates
//         setCropsList((prevList) => {
//           const updatedList = [...prevList, newCrop];
//           return updatedList;
//         });
//         console.log(",,", newCrop);
    
//         // Clear input fields after adding
//         setCrop("");
//         setVariety(null);
//         setLoadIn("");
//   }

//   return (
//     <ScrollView className="flex-1 bg-white p-6">
//       {/* <Text className="text-xl font-bold mb-4">Review Collection Requests</Text>

//       {cropsList.map((item, index) => (
//         <View key={index} className="border p-3 rounded-lg mb-2">
//           <Text>Crop ID: {item.crop}</Text>
//           <Text>Variety ID: {item.variety}</Text>
//           <Text>Load In: {item.loadIn} kg</Text>
//         </View>
//       ))}

//       <View className="mt-4 space-y-4">
//         <TouchableOpacity
//           className="bg-[#2AAD7A] rounded-full py-3"
//           onPress={handleSubmit}
//         >
//           <Text className="text-white text-center font-bold text-lg">Submit</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           className="bg-white border border-black rounded-full py-3"
//           onPress={() => navigation.goBack()}
//         >
//           <Text className="text-black text-center font-bold text-lg">
//             Add More Crops
//           </Text>
//         </TouchableOpacity>
//       </View> */}
//       <View className="bg-white p-4 rounded-md mt-4">
//   <Text className="text-lg font-semibold text-gray-700 mb-2">Added Requests</Text>
//   {cropsList.map((item, index) => (
//     <View
//       key={index}
//       className="flex-row items-center justify-between bg-gray-100 p-2 rounded-md mb-2"
//     >
//       <View className="flex-row space-x-2">
//         <Text className="border border-gray-300 px-2 py-1 rounded">{item.cropName}</Text>
//         <Text className="border border-gray-300 px-2 py-1 rounded">{item.varietyName}</Text>
//       </View>
//       {/* <TouchableOpacity onPress={() => handleDelete(index)}> */}
//       <TouchableOpacity >

//         <Text className="text-red-500 text-xl">🗑️</Text>
//       </TouchableOpacity>
//     </View>
//   ))}



// {showaddtolist ? (
// <View>


// <Text className="text-gray-700 mb-2">Crop</Text>

// <DropDownPicker
//   open={openCrop}
//   value={crop}
//   items={cropOptions}
//   setOpen={setOpenCrop}
//   setValue={setCrop}
//   placeholder="--Select Crop--"
//   dropDownContainerStyle={{
//     borderColor: "#CFCFCF",
//     borderWidth: 1,
//     backgroundColor: "#FFFFFF",
//     maxHeight: 200,
//     minHeight: 150,
//   }}
//   style={{ borderColor: "#CFCFCF", borderWidth: 1, marginBottom: 4 }}
//   textStyle={{ fontSize: 14 }}
//   zIndex={80000}
//   listMode="SCROLLVIEW"
//   loading={loading} // You can toggle this based on the fetch status
// />

// <Text className="text-gray-700 mb-2">Variety</Text>
// <DropDownPicker
//   open={openVariety}
//   value={variety}
//   items={varietyOptions}
//   setOpen={setOpenVariety}
//   setValue={setVariety}
//   placeholder="--Select Variety--"
//   style={{
//     borderColor: "#CFCFCF",
//     borderWidth: 1,
//     marginBottom: 4,
//   }}
// />

// {/* Load Input */}
// <Text className="text-gray-700 mb-2 mt-2">Load in kg (Approx)</Text>
// <TextInput
//   className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
//   value={loadIn}
//   onChangeText={setLoadIn}
//   keyboardType="numeric"
//   placeholder=" "
// />

//   <TouchableOpacity
//   onPress={handleAddtoList}
//   className="bg-[#2AAD7A] mt-6 py-3 rounded-full"
// >
//   <Text className="text-white text-center text-lg font-bold">Add to the List</Text>
// </TouchableOpacity>
// </View>
// ) : (
//     <View>


// <TouchableOpacity
// onPress={handleAddMore}
// className="bg-[#2AAD7A] mt-6 py-3 rounded-full"
// >
// <Text className="text-white text-center text-lg font-bold">Add more</Text>
// </TouchableOpacity>
//   <TouchableOpacity
//   onPress={handleSubmit}
//   className="mt-4 py-3 rounded-full border border-black"
// >
//   <Text className="text-black text-center text-lg font-bold">Submit</Text>
// </TouchableOpacity>
// </View>
//   )
// }




// </View>

//     </ScrollView>
//   );
// };

// export default ReviewCollectionRequests;


import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Alert, TextInput } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import axios from "axios";
import { environment } from "@/environment/environment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../types";
import DropDownPicker from "react-native-dropdown-picker";

type ReviewProps = {
  navigation: StackNavigationProp<RootStackParamList, "ReviewCollectionRequests">;
  route: RouteProp<RootStackParamList, "ReviewCollectionRequests">;
};

interface Crop {
  id: number;
  cropNameEnglish: string;
}

interface CropVariety {
  id: number;
  varietyEnglish: string;
}

const ReviewCollectionRequests: React.FC<ReviewProps> = ({ route, navigation }) => {
  const { cropsList: initialCropsList, address, scheduleDate, farmerId } = route.params;
  const [cropsList, setCropsList] = useState<any[]>(initialCropsList || []);
  const [crop, setCrop] = useState<string | null>(null);
  const [variety, setVariety] = useState<string | null>(null);
  const [loadIn, setLoadIn] = useState<string>("");
  const [cropOptions, setCropOptions] = useState<{ label: string; value: string }[]>([]);
  const [varietyOptions, setVarietyOptions] = useState<{ label: string; value: string }[]>([]);
  const [showAddtolist, setShowAddtolist] = useState(false);
  const [openCrop, setOpenCrop] = useState(false);
  const [openVariety, setOpenVariety] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchCropNames = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          if (!token) {
            console.error("No authentication token found");
            return;
          }

          const headers = { Authorization: `Bearer ${token}` };
          const response = await axios.get<Crop[]>(
            `${environment.API_BASE_URL}api/unregisteredfarmercrop/get-crop-names`,
            { headers }
          );

          const uniqueCropNames = response.data.reduce<Crop[]>((acc, crop) => {
            if (!acc.some((item) => item.cropNameEnglish === crop.cropNameEnglish)) {
              acc.push(crop);
            }
            return acc;
          }, []);

          setCropOptions(
            uniqueCropNames.map((crop) => ({
              label: crop.cropNameEnglish,
              value: crop.id.toString(),
            }))
          );
        } catch (error) {
          console.error("Error fetching crop names:", error);
        }
      };

      fetchCropNames();
    }, [])
  );

  useEffect(() => {
    const fetchVarieties = async () => {
      if (!crop) return;

      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        const cropId = Number(crop);

        const response = await axios.get<CropVariety[]>(
          `${environment.API_BASE_URL}api/unregisteredfarmercrop/crops/varieties/collection/${cropId}`,
          { headers }
        );

        setVarietyOptions(
          response.data.map((variety) => ({
            label: variety.varietyEnglish,
            value: variety.id.toString(),
          }))
        );
      } catch (error) {
        console.error("Error fetching crop varieties:", error);
      }
    };

    fetchVarieties();
  }, [crop]);

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Please login again.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      await axios.put(
        `${environment.API_BASE_URL}api/unregisteredfarmercrop/user/update/${farmerId}`,
        address,
        { headers }
      );

      const requestBody = {
        requests: cropsList.map((crop) => ({
          farmerId,
          crop: crop.crop,
          variety: crop.variety,
          loadIn: crop.loadIn,
          scheduleDate,
        })),
      };

      await axios.post(
        `${environment.API_BASE_URL}api/unregisteredfarmercrop/submit-collection-request`,
        requestBody,
        { headers }
      );

      Alert.alert("Success", "Requests submitted successfully!");
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Submission failed. Please try again.");
    }
  };

  const handleAddMore = async () => {
    setShowAddtolist(true);
  };

  const handleAddtoList = async () => {
    setShowAddtolist(false);

    if (!crop || !variety || !loadIn) {
      Alert.alert("Error", "Please fill all fields before adding.");
      return;
    }

    const cropName = cropOptions.find((item) => item.value === crop)?.label || "";
    const varietyName = varietyOptions.find((item) => item.value === variety)?.label || "";

    const newCrop = { crop, variety, cropName, varietyName, loadIn };

    setCropsList((prevList) => [...prevList, newCrop]);

    setCrop(null);
    setVariety(null);
    setLoadIn("");
  };

  return (
    <View className="flex-1 bg-white p-6">
      <View className="bg-white p-4 rounded-md mt-4">
        <Text className="text-lg font-semibold text-gray-700 mb-2">Added Requests</Text>
        {cropsList.map((item, index) => (
          <View key={index} className="flex-row items-center justify-between bg-gray-100 p-2 rounded-md mb-2">
            <Text className="border border-gray-300 px-2 py-1 rounded">{item.cropName}</Text>
            <Text className="border border-gray-300 px-2 py-1 rounded">{item.varietyName}</Text>
            <Text className="border border-gray-300 px-2 py-1 rounded">{item.loadIn} kg</Text>
          </View>
        ))}

        {showAddtolist ? (
          <View>
            <Text className="text-gray-700 mb-2">Crop</Text>
            <DropDownPicker
              open={openCrop}
              value={crop}
              items={cropOptions}
              setOpen={setOpenCrop}
              setValue={setCrop}
              placeholder="--Select Crop--"
              dropDownContainerStyle={{
                borderColor: "#CFCFCF",
                borderWidth: 1,
                backgroundColor: "#FFFFFF",
                maxHeight: 200,
                minHeight: 150,
              }}
              style={{ borderColor: "#CFCFCF", borderWidth: 1, marginBottom: 4 }}
              textStyle={{ fontSize: 14 }}
              zIndex={80000}
              listMode="SCROLLVIEW"
              loading={loading}
            />

            <Text className="text-gray-700 mb-2">Variety</Text>
            <DropDownPicker
              open={openVariety}
              value={variety}
              items={varietyOptions}
              setOpen={setOpenVariety}
              setValue={setVariety}
              placeholder="--Select Variety--"
              style={{
                borderColor: "#CFCFCF",
                borderWidth: 1,
                marginBottom: 4,
              }}
            />

            <Text className="text-gray-700 mb-2 mt-2">Load in kg (Approx)</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
              value={loadIn}
              onChangeText={setLoadIn}
              keyboardType="numeric"
              placeholder=" "
            />

            <TouchableOpacity
              onPress={handleAddtoList}
              className="bg-[#2AAD7A] mt-6 py-3 rounded-full"
            >
              <Text className="text-white text-center text-lg font-bold">Add to the List</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TouchableOpacity
              onPress={handleAddMore}
              className="bg-[#2AAD7A] mt-6 py-3 rounded-full"
            >
              <Text className="text-white text-center text-lg font-bold">Add more</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSubmit} className="mt-4 py-3 rounded-full border border-black">
              <Text className="text-black text-center text-lg font-bold">Submit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default ReviewCollectionRequests;
