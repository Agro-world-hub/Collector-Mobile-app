// import React, { useEffect, useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Image, Alert } from "react-native";
// import axios from "axios";
// import { StackNavigationProp } from "@react-navigation/stack";
// import { RootStackParamList } from "./types"; 
// import environment from "@/environment";
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const api = axios.create({
//   baseURL: environment.API_BASE_URL,
// });

// type PriceChartNavigationProp = StackNavigationProp<RootStackParamList, "PriceChart">;

// interface PriceChartProps {
//   navigation: PriceChartNavigationProp;
//   route: any;
// }

// const PriceChart: React.FC<PriceChartProps> = ({ navigation, route }) => {
//   const { varietyId, cropName, varietyName } = route.params;

//   const [priceData, setPriceData] = useState<any[]>([]); 
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [editedPrices, setEditedPrices] = useState<any[]>([]); 
//   const [isEditable, setIsEditable] = useState(false); 
//   const [buttonText, setButtonText] = useState("Request Price Update");

//   // Move fetchPrices outside of useEffect
//   const fetchPrices = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get(`api/unregisteredfarmercrop/unitPrices/${varietyId}`);
//       setPriceData(response.data); 
//       setEditedPrices(response.data); 

//       // Store the fetched prices in AsyncStorage if not already stored
//       const storedPrices = await AsyncStorage.getItem(`originalPrices_${varietyId}`);
//       if (!storedPrices) {
//         await AsyncStorage.setItem(`originalPrices_${varietyId}`, JSON.stringify(response.data));
//       }
//     } catch (error) {
//       setError("Failed to fetch prices");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Call fetchPrices when component mounts
//     fetchPrices();
//   }, [varietyId]);

//   const handlePriceChange = (index: number, newPrice: string) => {
//     const cleanedPrice = newPrice.replace(/[^0-9.]/g, ''); // Remove non-numeric characters
    
//     let formattedPrice = cleanedPrice;
//     if (!cleanedPrice.includes('.')) {
//       formattedPrice = `${cleanedPrice}.00`; // Ensure 2 decimal places if missing
//     } else {
//       const [integerPart, decimalPart] = cleanedPrice.split('.');
//       formattedPrice = `${integerPart}.${decimalPart.length === 1 ? `${decimalPart}0` : decimalPart}`;
//     }
  
//     const updatedPrices = [...editedPrices];
//     updatedPrices[index].price = formattedPrice;
//     console.log('Updated Prices:', updatedPrices);   // Update the specific price
//     setEditedPrices(updatedPrices);  // Update state with the new price list
//   };
  
//   const handleButtonClick = async () => {
//     if (isEditable) {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         if (!token) {
//           throw new Error('No authentication token found.');
//         }
  
//         // Retrieve the original prices from AsyncStorage
//         const storedPrices = await AsyncStorage.getItem(`originalPrices_${varietyId}`);
//         if (!storedPrices) {
//           throw new Error('No original prices found.');
//         }
  
//         const originalPrices = JSON.parse(storedPrices);
  
//         // Prepare the request data with only changed prices
//         const requestData = editedPrices
//           .map((priceItem, index) => {
//             const originalPrice = originalPrices[index]?.price;
//             if (priceItem.price !== originalPrice) {
//               return {
//                 varietyId,
//                 grade: priceItem.grade,
//                 requestPrice: priceItem.price,
//               };
//             }
//             return null;
//           })
//           .filter((item) => item !== null); // Filter out unchanged prices
  
//         if (requestData.length === 0) {
//           Alert.alert('No changes detected', 'No prices were updated.');
//           return;
//         }
  
//         // Send the request to the API
//         const response = await api.post('api/auth/marketpricerequest', { prices: requestData }, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
  
//         Alert.alert('Success', 'The price request was sent successfully!');
  
//         // Refetch the prices after submitting
//         await fetchPrices();
  
//         // Optionally, update the stored prices in AsyncStorage after successful submission
//         await AsyncStorage.setItem(`originalPrices_${varietyId}`, JSON.stringify(editedPrices));
  
//         setIsEditable(false);
//         setButtonText("Request Price Update");
//       } catch (error) {
//         console.error("Error submitting price request:", error);
//         setError("Failed to submit price update.");
//         Alert.alert('Error', 'Failed to submit price update.');
//       }
//     } else {
//       setIsEditable(true);
//       setButtonText("Submit Request");
//     }
//   };
  
//   const handleBackButton = async () => {
//     // Reset form to non-editable state and refetch prices
//     setIsEditable(false);
//     setButtonText("Request Price Update");

//     // Refetch the prices after clicking the Go Back button
//     await fetchPrices();
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-gray-100">
//       {/* Header */}
//       <View className="bg-[#2AAD7A] h-20 flex-row items-center px-4">
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Image
//             source={require('../assets/images/back2.png')} 
//             style={{ width: 34, height: 24 }}
//           />
//         </TouchableOpacity>
//         <Text className="text-white text-lg font-bold text-center mr-[15%] flex-1">Price Chart</Text>
//       </View>

//       {/* Content */}
//       <View className="flex-1 p-8 bg-white">
//         {/* Crop Name */}
//         <View className="mb-4">
//           <Text className="text-gray-600 text-sm mb-1">Crop Name</Text>
//           <TextInput
//             placeholder="Capcicum"
//             className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800"
//             value={cropName}
//             editable={false}
//           />
//         </View>

//         {/* Variety */}
//         <View className="mb-4">
//           <Text className="text-gray-600 text-sm mb-1">Variety</Text>
//           <TextInput
//             placeholder="Muria"
//             className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800"
//             value={varietyName}
//             editable={false}
//           />
//         </View>

//         {/* Loading State */}
//         {loading && (
//           <View className="items-center my-6">
//             <ActivityIndicator size="large" color="#2AAD7A" />
//           </View>
//         )}

//         {/* Error State */}
//         {error && (
//           <View className="bg-red-100 p-4 rounded-md mb-6">
//             <Text className="text-red-600 text-center">{error}</Text>
//           </View>
//         )}

//         {/* Unit Prices Section */}
//         {priceData.length > 0 && !loading && !error && (
//           <View className="mb-6">
//             <Text className="text-gray-600 text-sm mb-2">Unit Prices according to Grades</Text>

//             <View className="border border-gray-300 rounded-lg p-4">
//               {priceData.map((priceItem, index) => (
//                 <View key={index} className="flex-row items-center mb-3">
//                   <Text className="w-32 text-gray-600">{`Grade ${priceItem.grade}`}</Text>
//                   <TextInput
//                     placeholder={`Rs.${priceItem.price}`}
//                     className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-800"
//                     value={editedPrices[index]?.price}
//                     editable={isEditable} 
//                     onChangeText={(newPrice) => handlePriceChange(index, newPrice)}
//                     keyboardType="numeric" 
//                   />
//                 </View>
//               ))}
//             </View>
//           </View>
//         )}

//         {/* Request/Submit Button */}
//         <TouchableOpacity
//           className="bg-[#2AAD7A] rounded-[45px] py-3 h-12 mt-6 w-3/4 mx-auto"
//           onPress={handleButtonClick}
//         >
//           <Text className="text-center text-base text-white font-semibold">
//             {buttonText}
//           </Text>
//         </TouchableOpacity>

//         {/* Conditional Back Button */}
//         {isEditable && (
//           <TouchableOpacity
//             className="border border-gray-400 w-[300px] mt-4 py-3 h-12 rounded-full items-center w-3/4 mx-auto"
//             onPress={handleBackButton}
//           >
//             <Text className="text-gray-700 text-base font-semibold">Go Back</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// export default PriceChart;
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, ScrollView } from "react-native";
import axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "./types"; 
import {environment }from '@/environment/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useTranslation } from "react-i18next";

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type PriceChartNavigationProp = StackNavigationProp<RootStackParamList, "PriceChart">;

interface PriceChartProps {
  navigation: PriceChartNavigationProp;
  route: any;
}

const PriceChart: React.FC<PriceChartProps> = ({ navigation, route }) => {
  const { varietyId, cropName, varietyName } = route.params;

  const [priceData, setPriceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editedPrices, setEditedPrices] = useState<any[]>([]);
  const [isEditable, setIsEditable] = useState(false);
  const { t } = useTranslation();
  const [buttonText, setButtonText] = useState(t("PriceChart.Request Price Update"));
  

  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
 

  // Fetch prices
  const fetchPrices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`api/unregisteredfarmercrop/unitPrices/${varietyId}`);
      setPriceData(response.data);
      setEditedPrices(response.data);
    } catch (error) {
      setError(t("Error.Failed to fetch prices"));
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPrices();
    }, [varietyId])
  );

  const handlePriceChange = (index: number, newPrice: string) => {
    const cleanedPrice = newPrice.replace(/[^0-9.]/g, '');
    const updatedPrices = [...editedPrices];
    updatedPrices[index].price = cleanedPrice;
    setEditedPrices(updatedPrices);
  };

  console.log("cropp",cropName)
  console.log("verity",varietyName)

  // Add this to reset the state when the component is focused
useFocusEffect(
  useCallback(() => {
    // Reset button states
    setIsEditable(false);
    setButtonText(t("PriceChart.Request Price Update"));
    
    // Fetch prices (your existing code)
    fetchPrices();
  }, [varietyId])
);

  // const handleButtonClick = async () => {
  //   if (isEditable) {
  //     try {
  //       const token = await AsyncStorage.getItem("token");
  //       if (!token) {
  //         throw new Error("No authentication token found.");
  //       }
  
  //       const requestData = editedPrices.map((priceItem) => ({
  //         varietyId,
  //         grade: priceItem.grade,
  //         requestPrice: priceItem.price,
  //       }));
  
  //       if (requestData.length === 0) {
  //         Alert.alert(t("Error.error"),t("Error.No prices to update"));
  //         return;
  //       }
  
  //       // Send the price update request
  //       const response = await api.post(
  //         "api/auth/marketpricerequest",
  //         { prices: requestData },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  
  //       // Handle success response
  //       if (response.status === 201) {
  //         Alert.alert(t("Error.Success"), t("Error.The price request was sent successfully"));
  //         await fetchPrices(); // Refetch prices after submitting
  //         setIsEditable(false);
  //         setButtonText(t("PriceChart.Request Price Update") );
  //       }
  //     } catch (error) {
  //       // Check if error status is 400 and show the message to update prices
  //       if (axios.isAxiosError(error) && error.response && error.response.status === 400) {
  //         Alert.alert(
  //           t("Error.error"),
  //           t("Error.You must change the prices before submitting. Please update the values.")
  //         );
  //         console.log("Error:", error.response.data.message);
  //       } else {
  //         console.error("Error submitting price request:", error);
  //         setError("Failed to submit price update.");
  //         Alert.alert(t("Error.error"),
  //           t("Error.Failed to submit price update."));
  //       }
  //     }
  //   } else {
  //     setIsEditable(true);
  //     setButtonText(t("PriceChart.Submit Request"));
  //   }
  // };

  const handleButtonClick = async () => {
    if (isEditable) {
      // Check if any price fields are empty
      const hasEmptyPrices = editedPrices.some(item => !item.price || item.price.trim() === '' || item.price === '0');
      
      if (hasEmptyPrices) {
        Alert.alert(
          t("Error.error"),
          t("Error.Please enter prices for all grades before submitting")
        );
        return;
      }
      
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found.");
        }
  
        const requestData = editedPrices.map((priceItem) => ({
          varietyId,
          grade: priceItem.grade,
          requestPrice: priceItem.price,
        }));
  
        if (requestData.length === 0) {
          Alert.alert(t("Error.error"), t("Error.No prices to update"));
          return;
        }
  
        // Send the price update request
        const response = await api.post(
          "api/auth/marketpricerequest",
          { prices: requestData },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        // Handle success response
        if (response.status === 201) {
          Alert.alert(t("Error.Success"), t("Error.The price request was sent successfully"));
          await fetchPrices(); // Refetch prices after submitting
          setIsEditable(false);
          setButtonText(t("PriceChart.Request Price Update"));
        }
      } catch (error) {
        // Check if error status is 400 and show the message to update prices
        if (axios.isAxiosError(error) && error.response && error.response.status === 400) {
          Alert.alert(
            t("Error.error"),
            t("Error.You must change the prices before submitting. Please update the values.")
          );
          console.log("Error:", error.response.data.message);
        } else {
          console.error("Error submitting price request:", error);
          setError("Failed to submit price update.");
          Alert.alert(t("Error.error"),
            t("Error.Failed to submit price update."));
        }
      }
    } else {
      setIsEditable(true);
      setButtonText(t("PriceChart.Submit Request"));
    }
  };

  const getTextStyle = (language: string) => {
    if (language === "si") {
      return {
        fontSize: 14, // Smaller text size for Sinhala
        lineHeight: 20, // Space between lines
      };
    }
   
  };
  

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-[#2AAD7A] h-20 flex-row items-center" style={{ paddingHorizontal: wp(6), paddingVertical: hp(2) }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold text-center flex-1">{t("PriceChart.PriceChart")}</Text>
      </View>

      {/* Content */}
      <ScrollView className="flex-1" style={{ paddingHorizontal: wp(8), paddingVertical: hp(2) }}>
        <View className="mb-4">
          <Text className="text-gray-600 text-sm mb-1">{t("PriceChart.Crop")}</Text>
          <TextInput className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800" value={cropName} editable={false} />
        </View>

        <View className="mb-4">
          <Text className="text-gray-600 text-sm mb-1">{t("PriceChart.Variety")}</Text>
          <TextInput className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800" value={varietyName} editable={false} />
        </View>

        {loading && (
          <View className="items-center my-6">
            <ActivityIndicator size="large" color="#2AAD7A" />
          </View>
        )}

        {error && (
          <View className="bg-red-100 p-4 rounded-md mb-6">
            <Text className="text-red-600 text-center">{error}</Text>
          </View>
        )}

        {priceData.length > 0 && !loading && !error && (
          <View className="mb-6">
            <Text className="text-gray-600 text-sm mb-2">{t("PriceChart.UnitGrades")}</Text>
            <View className="border border-gray-300 rounded-lg p-4">
              {priceData.map((priceItem, index) => (
                <View key={index} className="flex-row items-center mb-3">
                  {/* <Text className="w-32 text-gray-600">{`Grade ${priceItem.grade}`}</Text> */}
                  <Text className="w-32 text-gray-600">{`${t("PriceChart.Grade")} ${priceItem.grade}`}</Text>
                  <TextInput
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-800"
                    value={editedPrices[index]?.price}
                    editable={isEditable}
                    onChangeText={(newPrice) => handlePriceChange(index, newPrice)}
                    keyboardType="numeric"
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* <TouchableOpacity className="bg-[#2AAD7A] rounded-[45px] py-3 h-12 mt-4 w-3/4 mx-auto" onPress={handleButtonClick}>
          <Text style={[{ fontSize: 16 }, getTextStyle(selectedLanguage)]} className="text-center text-base text-white font-semibold">{buttonText}</Text>
        </TouchableOpacity> */}

        {/* {isEditable && (
          <TouchableOpacity
            className="border border-gray-400  mt-4 py-3 h-12 rounded-full items-center w-3/4 mx-auto"
            onPress={() => {
              setIsEditable(false);
              setButtonText(t("PriceChart.Request Price Update"));
              fetchPrices();
            }}
          >
            <Text className="text-gray-700 text-base font-semibold">{t("PriceChart.Go")}</Text>
          </TouchableOpacity>

         
          
        )} */}
        {/* {isEditable && (
  <TouchableOpacity
    className="border border-gray-400  mt-4 py-3 h-12 rounded-full items-center w-3/4 mx-auto"
    onPress={() => {
      setIsEditable(false);
      setButtonText(t("PriceChart.Request Price Update"));
      fetchPrices();
    }}
  >
    <Text className="text-gray-700 text-base font-semibold">{t("PriceChart.Go")}</Text>
  </TouchableOpacity>
)} */}

<TouchableOpacity className="bg-[#2AAD7A] rounded-[45px] py-3 h-12 mt-4 w-3/4 mx-auto" onPress={handleButtonClick}>
          <Text style={[{ fontSize: 16 }, getTextStyle(selectedLanguage)]} className="text-center text-base text-white font-semibold">{buttonText}</Text>
        </TouchableOpacity>

        {/* Secondary Button - Changes based on state */}
        <TouchableOpacity 
          className="border border-gray-400 mt-4 py-3 h-12 rounded-full items-center w-3/4 mx-auto" 
          onPress={() => {
            if (isEditable) {
              // If in edit mode, this acts as "Cancel"
              setIsEditable(false);
              setButtonText(t("PriceChart.Request Price Update"));
              fetchPrices();
            } else {
              // If not in edit mode, this acts as "Go Back"
              navigation.goBack();
            }
          }}
        >
          <Text style={[{ fontSize: 16 }, getTextStyle(selectedLanguage)]} className="text-center text-base text-[#606060] font-semibold">
            {isEditable ? t("PriceChart.Cancel") : t("PriceChart.Go")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PriceChart;
