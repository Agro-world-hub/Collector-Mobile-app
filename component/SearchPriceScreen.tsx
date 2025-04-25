// import React, { useEffect, useState, useCallback } from 'react';
// import { View, Text, TouchableOpacity, Image, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
// import { SelectList } from 'react-native-dropdown-select-list';
// import axios from 'axios';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { useFocusEffect } from '@react-navigation/native';
// import { RootStackParamList } from './types';
// import {environment }from '@/environment/environment';
// import { ScrollView } from 'react-native-gesture-handler';
// import { useTranslation } from "react-i18next";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const api = axios.create({
//   baseURL: environment.API_BASE_URL,
// });

// type SearchPriceScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SearchPriceScreen'>;

// interface SearchPriceScreenProps {
//   navigation: SearchPriceScreenNavigationProp;
// }

// const SearchPriceScreen: React.FC<SearchPriceScreenProps> = ({ navigation }) => {
//   const [cropOptions, setCropOptions] = useState<{ key: string; value: string }[]>([]);
//   const [varietyOptions, setVarietyOptions] = useState<{ key: string; value: string }[]>([]);
//   const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
//   const [selectedVariety, setSelectedVariety] = useState<string | null>(null);
//   const [loadingCrops, setLoadingCrops] = useState(false);
//   const [loadingVarieties, setLoadingVarieties] = useState(false);
//   const { t } = useTranslation();
//   const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

//   const fetchSelectedLanguage = async () => {
//     try {
//       const lang = await AsyncStorage.getItem("@user_language"); // Get stored language
//       setSelectedLanguage(lang || "en"); // Default to English if not set
//     } catch (error) {
//       console.error("Error fetching language preference:", error);
//     }
//   };

//    // Fetch language on component mount
//    useEffect(() => {
//     const fetchData = async () => {
//       await fetchSelectedLanguage();
//     };
//     fetchData();
//   }, []);


//   // Function to fetch crop names
//   // const fetchCropNames = async () => {
//   //   setLoadingCrops(true);
//   //   try {
//   //     const response = await api.get('api/unregisteredfarmercrop/get-crop-names');
//   //     const formattedData = response.data.map((crop: any) => ({
//   //       key: crop.id.toString(),
//   //       value: crop.cropNameEnglish,
//   //     }));
//   //     setCropOptions(formattedData);
//   //     console.log(response.data)
//   //   } catch (error) {
//   //     console.error('Failed to fetch crop names:', error);
//   //   } finally {
//   //     setLoadingCrops(false);
//   //   }
//   // };

//   const fetchCropNames = async () => {
//     setLoadingCrops(true);
//     try {
//       const response = await api.get("api/unregisteredfarmercrop/get-crop-names");
      
//       const formattedData = response.data.map((crop: any) => {
//         let cropName;
//         switch (selectedLanguage) {
//           case "si":
//             cropName = crop.cropNameSinhala;
//             break;
//           case "ta":
//             cropName = crop.cropNameTamil;
//             break;
//           default:
//             cropName = crop.cropNameEnglish;
//         }
  
//         return {
//           key: crop.id.toString(),
//           value: cropName,
//         };
//       });
  
//       setCropOptions(formattedData);
//     } catch (error) {
//       console.error("Failed to fetch crop names:", error);
//     } finally {
//       setLoadingCrops(false);
//     }
//   };
  
//   // Fetch crops whenever the language changes
//   useEffect(() => {
//     if (selectedLanguage) {
//       fetchCropNames();
//     }
//   }, [selectedLanguage]);
  
 
  
  

//   // Function to fetch varieties based on the selected crop
//   // const fetchVarieties = async () => {
//   //   if (!selectedCrop) return;

//   //   setLoadingVarieties(true);
//   //   try {
//   //     const response = await api.get(`api/unregisteredfarmercrop/crops/varieties/${selectedCrop}`);
//   //     const formattedData = response.data.map((variety: any) => ({
//   //       key: variety.id.toString(),
//   //       value: variety.varietyNameEnglish,
//   //     }));
//   //     setVarietyOptions(formattedData);
//   //   } catch (error) {
//   //     console.error('Failed to fetch varieties:', error);
//   //   } finally {
//   //     setLoadingVarieties(false);
//   //   }
//   // };

//   const fetchVarieties = async () => {
//     if (!selectedCrop) return;
  
//     setLoadingVarieties(true);
//     try {
//       const response = await api.get(`api/unregisteredfarmercrop/crops/varieties/${selectedCrop}`);
  
//       const formattedData = response.data.map((variety: any) => {
//         let varietyName;
//         switch (selectedLanguage) {
//           case "si":
//             varietyName = variety.varietyNameSinhala;
//             break;
//           case "ta":
//             varietyName = variety.varietyNameTamil;
//             break;
//           default:
//             varietyName = variety.varietyNameEnglish;
//         }
  
//         return {
//           key: variety.id.toString(),
//           value: varietyName,
//         };
//       });
  
//       setVarietyOptions(formattedData);
//     } catch (error) {
//       console.error("Failed to fetch varieties:", error);
//     } finally {
//       setLoadingVarieties(false);
//     }
//   };
  
//   // Re-fetch varieties when selected language or crop changes
//   useEffect(() => {
//     if (selectedCrop && selectedLanguage) {
//       fetchVarieties();
//     }
//   }, [selectedCrop, selectedLanguage]);
  

//   // Reload data when the screen comes into focus
//   useFocusEffect(
//     useCallback(() => {
//       // Reset the selected values and variety options
//       setSelectedCrop(null);
//       setSelectedVariety(null);
//       setVarietyOptions([]);

//       // Fetch crops again
//       fetchCropNames();
//     }, [])
//   );

//   // Fetch varieties when selectedCrop changes
//   useEffect(() => {
//     fetchVarieties();
//   }, [selectedCrop]);
  

//   return (
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           style={{ flex: 1 }}>
//     <ScrollView className="flex-1 bg-white "
//     keyboardShouldPersistTaps="handled">
//     <View className="flex-1 bg-white items-center px-6 pt-8">
//       <Text className="text-xl font-semibold mb-4">{t("SearchPrice.SearchPrice")}</Text>
//       <Image
//         source={require('../assets/images/marketprice.webp')} // Replace with your image path
//         className="w-64 h-40 mb-6 mt-8"
//         resizeMode="contain"
//       />

//       {/* Crop Name Dropdown */}
//       <View className="w-full mb-4">
//         <Text className="text-base mb-2 text-center">{t("SearchPrice.Crop")}</Text>
//         {loadingCrops ? (
//           <ActivityIndicator size="small" color="#2AAD7A" />
//         ) : (
//           <SelectList
//             setSelected={(val: any) => setSelectedCrop(val)}
//             data={cropOptions}
//             placeholder={t("SearchPrice.SelectCrop")}
//             boxStyles={{
//               backgroundColor: 'white',
//               borderColor: '#CFCFCF',
//             }}
//             dropdownTextStyles={{
//               color: '#000',
//             }}
//           />
//         )}
//       </View>

//       {/* Variety Dropdown */}
//       <View className="w-full mb-8">
//         <Text className="text-base mb-2 text-center">{t("SearchPrice.Variety")}</Text>
//         {loadingVarieties ? (
//           <ActivityIndicator size="small" color="#2AAD7A" />
//         ) : (
//           <SelectList
//             setSelected={(val: any) => setSelectedVariety(val)}
//             data={varietyOptions}
//             placeholder={t("SearchPrice.SelectVariety")}
//             boxStyles={{
//               backgroundColor: 'white',
//               borderColor: '#CFCFCF',
//             }}
//             dropdownTextStyles={{
//               color: '#000',
//             }}
//           />
//         )}
//       </View>

//       {/* Search Button */}
//       <TouchableOpacity
//         className="bg-[#2AAD7A] w-full py-3 mb-4 rounded-[35px] items-center"
//         onPress={() => {
//           if (selectedCrop && selectedVariety) {
//             const cropName = cropOptions.find(option => option.key === selectedCrop)?.value || '';
//             const varietyName = varietyOptions.find(option => option.key === selectedVariety)?.value || '';

//             navigation.navigate('PriceChart', {
//               cropName: cropName,
//               varietyId: selectedVariety,
//               varietyName: varietyName,
//             });
//           }
//         }}
//       >
//         <Text className="text-white font-semibold text-lg">{t("SearchPrice.Search")}</Text>
//       </TouchableOpacity>
//     </View>
//     </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// export default SearchPriceScreen;
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, KeyboardAvoidingView, Platform, Alert, RefreshControl } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from './types';
import {environment} from '../environment/environment';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";
import DropDownPicker from "react-native-dropdown-picker";

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type CropOption = {
  label: string;
  value: string;
  cropName: string;
};

type SearchPriceScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SearchPriceScreen'>;

interface SearchPriceScreenProps {
  navigation: SearchPriceScreenNavigationProp;
}

// const SearchPriceScreen: React.FC<SearchPriceScreenProps> = ({ navigation }) => {
//   //const [cropOptions, setCropOptions] = useState<{ key: string; value: string }[]>([]);
//   const [cropOptions, setCropOptions] = useState<CropOption[]>([]);

//   const [varietyOptions, setVarietyOptions] = useState<{ key: string; value: string }[]>([]);
//   const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
//   const [selectedVariety, setSelectedVariety] = useState<string | null>(null);
//   const [loadingCrops, setLoadingCrops] = useState(false);
//   const [loadingVarieties, setLoadingVarieties] = useState(false);
//   const [open, setOpen] = useState(false);  // ✅ correct
//   const [vopen, setVopen] = useState(false);  // ✅ correct

//   const { t, i18n } = useTranslation();
//   const [selectedLanguage, setSelectedLanguage] = useState("en");
// console.log(";;;;;;;;",selectedLanguage)
//   useEffect(() => {
//     const fetchLanguage = async () => {
//       try {
//         const lang = await AsyncStorage.getItem("@user_language"); // Get stored language
//         setSelectedLanguage(lang || "en"); // Default to English if not set
//       } catch (error) {
//         console.error("Error fetching language preference:", error);
//       }
//     };
//     fetchLanguage();
//   }, []);

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       // Reset dropdown states
//       setSelectedCrop(null);
//       setSelectedVariety(null);
//       setVarietyOptions([]);
//       setOpen(false);
//       setVopen(false);
//       fetchCropNames();
//     });
  
//     // Return the cleanup function
//     return unsubscribe;
//   }, [navigation]);
  
//   const fetchCropNames = async () => {
//     setLoadingCrops(true);
//     try {
//       const token = await AsyncStorage.getItem("token"); // Retrieve token (if using AsyncStorage)
  
//       const response = await api.get('api/unregisteredfarmercrop/get-crop-names', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log('Raw Crop Names Response:', response.data);
  
//       // const formattedData = response.data.map((crop: any) => {
//       //           let cropName;
//       //           switch (selectedLanguage) {
//       //             case "si":
//       //               cropName = crop.cropNameSinhala;
//       //               break;
//       //             case "ta":
//       //               cropName = crop.cropNameTamil;
//       //               break;
//       //             default:
//       //               cropName = crop.cropNameEnglish;
//       //           }
          
//       //           return {
//       //             key: crop.id.toString(),
//       //             value: cropName,
//       //           };
//       //         });
//       const formattedData = response.data.map((crop: any) => {
//         let cropName;
//         switch (selectedLanguage) {
//           case "si":
//             cropName = crop.cropNameSinhala;
//             break;
//           case "ta":
//             cropName = crop.cropNameTamil;
//             break;
//           default:
//             cropName = crop.cropNameEnglish;
//         }
      
//         return {
//           label: cropName,         // shown in dropdown
//           value: crop.id.toString(), // selected value
//           cropName: cropName,      // extra, can be used later
//         };
//       });
      
//       setCropOptions(formattedData);
     
          
//               setCropOptions(formattedData);
//               console.log("crop",formattedData)
//               console.log("language",selectedLanguage)
//             } catch (error) {
//               console.error("Failed to fetch crop names:", error);
//             } finally {
//               setLoadingCrops(false);
//             }
//           };
          
//           // Fetch crops whenever the language changes
//           useEffect(() => {
//             if (selectedLanguage) {
//               fetchCropNames();
//             }
//           }, [selectedLanguage]);
  
//   // Function to fetch varieties based on the selected crop
//   const fetchVarieties = async () => {
//     if (!selectedCrop) return;
  
//     setLoadingVarieties(true);
//     try {
//       const token = await AsyncStorage.getItem("token"); // Retrieve token
//       const response = await api.get(`api/unregisteredfarmercrop/crops/varieties/${selectedCrop}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
  
//       // Log the full response to inspect the structure
//       console.log("Raw Varieties Response:", response.data);
  
//       const formattedData = response.data.map((variety: any) => {
//         let varietyName;
//         switch (selectedLanguage) {
//           case "si":
//             varietyName = variety.varietySinhala; // Sinhala name if available
//             break;
//           case "ta":
//             varietyName = variety.varietyTamil; // Tamil name if available
//             break;
//           default:
//             varietyName = variety.varietyEnglish; // Default to English if no translation is found
//         }
      
//         return {
//           key: variety.id.toString(), // Keep id as key
//           value: varietyName, // Assign the correct variety name based on the selected language
//         };
//       });
      
  
//       // Log the formatted data to ensure it's processed correctly
//       console.log("Formatted Varieties:", formattedData);
  
//       setVarietyOptions(formattedData);
//     } catch (error) {
//       console.error("Failed to fetch varieties:", error);
//     } finally {
//       setLoadingVarieties(false);
//     }
//   };
  
//   // Reload data when the screen comes into focus
//   useFocusEffect(
//     useCallback(() => {
//       setSelectedCrop(null);
//       setSelectedVariety(null);
//       setVarietyOptions([]);
//       fetchCropNames();
//     }, [])
//   );

//   // Fetch varieties when selectedCrop changes
//   useEffect(() => {
//     fetchVarieties();
//   }, [selectedCrop]);


//   return (
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           style={{ flex: 1 }}>
//     <ScrollView className="flex-1 bg-white "
//     keyboardShouldPersistTaps="handled">
//     <View className="flex-1 bg-white items-center px-6 pt-8">
//     <Text className="text-xl font-semibold mb-4">{t("SearchPrice.SearchPrice")}</Text>
//       <Image
//          source={require('../assets/images/marketprice.webp')} // Replace with your image path
//         className="w-64 h-40 mb-6 mt-8"
//         resizeMode="contain"
//       />

//       {/* Crop Name Dropdown */}
//       <View className="w-full mb-4">
//          <Text className="text-base mb-2 text-center">{t("SearchPrice.Crop")}</Text>
//         {/* {loadingCrops ? (
//           <ActivityIndicator size="small" color="#2AAD7A" />
//         ) : (
//           <SelectList
//             setSelected={(val: any) => setSelectedCrop(val)}
//             data={cropOptions}
//             placeholder={t("SearchPrice.SelectCrop")}
//             boxStyles={{
//               backgroundColor: 'white',
//               borderColor: '#CFCFCF',
//             }}
//             dropdownTextStyles={{
//               color: '#000',
//             }}
//           />
//         )} */}
        
//           {/* <SelectList
//             setSelected={(val: any) => setSelectedCrop(val)}
//             data={cropOptions}
//             placeholder={t("SearchPrice.SelectCrop")}
//             boxStyles={{
//               backgroundColor: 'white',
//               borderColor: '#CFCFCF',
//             }}
//             dropdownTextStyles={{
//               color: '#000',
//             }}
//           /> */}
          
          
//           <DropDownPicker
//   open={open}
//   value={selectedCrop}
//   items={cropOptions}
//   setOpen={setOpen}
//   setValue={setSelectedCrop}
//   setItems={setCropOptions}
//   placeholder={t("SearchPrice.SelectCrop")}
//   style={{
//     backgroundColor: 'white',
//     borderColor: '#CFCFCF',
//   }}
//   textStyle={{
//     color: '#000',
//   }}
//   dropDownContainerStyle={{
//     borderColor: '#CFCFCF',
//   }}
//   listMode="SCROLLVIEW"
//   scrollViewProps={{
//     nestedScrollEnabled: true,
//   }}
// />




          
//       </View>

//       {/* Variety Dropdown */}
//       <View className="w-full mb-8">
//             <Text className="text-base mb-2 text-center">{t("SearchPrice.Variety")}</Text>
//             {loadingVarieties ? (
//               <ActivityIndicator size="small" color="#2AAD7A" />
//             ) : (
//               <SelectList
//                 setSelected={(val: any) => setSelectedVariety(val)}
//                 data={varietyOptions}
//                 placeholder={t("SearchPrice.SelectVariety")}
//                 boxStyles={{
//                   backgroundColor: 'white',
//                   borderColor: '#CFCFCF',
//                 }}
//                 dropdownTextStyles={{
//                   color: '#000',
//                 }}
//               />
//             //   <DropDownPicker
//             //   open={vopen}
//             //   value={selectedVariety}
//             //   items={varietyOptions}
//             //   setOpen={setVopen}
//             //   setValue={setSelectedVariety}
//             //   setItems={setVarietyOptions}
//             //   placeholder={t("SearchPrice.SelectVariety")}
//             //   style={{
//             //     backgroundColor: 'white',
//             //     borderColor: '#CFCFCF',
//             //   }}
//             //   textStyle={{
//             //     color: '#000',
//             //   }}
//             //   dropDownContainerStyle={{
//             //     borderColor: '#CFCFCF',
//             //   }}
//             //   listMode="SCROLLVIEW"         
//             //   scrollViewProps={{             
//             //     nestedScrollEnabled: true,
//             //   }}
//             // />

              
//             )}
//           </View>

//       {/* Search Button */}
//       {/* <TouchableOpacity
//         className="bg-[#2AAD7A] w-full py-3 mb-4 rounded-[35px] items-center"
//         onPress={() => {
//           if (selectedCrop && selectedVariety) {
//             const cropName = cropOptions.find(option => option.value === selectedCrop)?.label || '';
//             const varietyName = varietyOptions.find(option => option.key === selectedVariety)?.value || '';

//             navigation.navigate('PriceChart', {

              
//               cropName: cropName,
//               varietyId: selectedVariety,
//               varietyName: varietyName,
//             });
//             console.log("cropnameee",selectedCrop)
//           }
//         }}
//       > */}
//       <TouchableOpacity
//   className="bg-[#2AAD7A] w-full py-3 mb-4 rounded-[35px] items-center"
//   onPress={() => {
//     if (selectedCrop && selectedVariety) {
//       const cropName = cropOptions.find(option => option.value === selectedCrop)?.label || '';
//       const varietyName = varietyOptions.find(option => option.key === selectedVariety)?.value || '';
      
//       navigation.navigate('PriceChart', {
//         cropName: cropName,
//         varietyId: selectedVariety,
//         varietyName: varietyName,
//       });
//       console.log("cropnameee", selectedCrop);
//     } else {
//       // Show alert if crop or variety is not selected
//       Alert.alert(
//         t("SearchPrice.Selection Required"),
//         t("SearchPrice.Please select both Crop and Variety to continue"),
//         [{ text: t("SearchPrice.OK") }]
//       );
//     }
//   }}
// >
 
//         <Text className="text-white font-semibold text-lg">{t("SearchPrice.Search")}</Text>
//       </TouchableOpacity>
//     </View>
//     </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// export default SearchPriceScreen;

const SearchPriceScreen: React.FC<SearchPriceScreenProps> = ({ navigation }) => {
  const [cropOptions, setCropOptions] = useState<CropOption[]>([]);
  const [varietyOptions, setVarietyOptions] = useState<{label: string; value: string}[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [selectedVariety, setSelectedVariety] = useState<string | null>(null);
  const [loadingCrops, setLoadingCrops] = useState(false);
  const [loadingVarieties, setLoadingVarieties] = useState(false);
  const [open, setOpen] = useState(false);
  const [vopen, setVopen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  
  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const lang = await AsyncStorage.getItem("@user_language");
        setSelectedLanguage(lang || "en");
      } catch (error) {
        console.error("Error fetching language preference:", error);
      }
    };
    fetchLanguage();
  }, []);

  const resetForm = useCallback(() => {
    setSelectedCrop(null);
    setSelectedVariety(null);
    setVarietyOptions([]);
    setOpen(false);
    setVopen(false);
    fetchCropNames();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    resetForm();
    // After refreshing is done, set refreshing to false
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [resetForm]);

  // Use both navigation listener and useFocusEffect for complete reset
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', resetForm);
    return unsubscribe;
  }, [navigation, resetForm]);
  
  // Also use useFocusEffect to ensure reset happens when screen gains focus
  useFocusEffect(
    useCallback(() => {
      resetForm();
      return () => {}; // Cleanup function
    }, [resetForm])
  );
  useEffect(() => {
    if (selectedLanguage) {
      fetchCropNames();
    }
  }, [selectedLanguage]);
  
  const fetchCropNames = async () => {
    setLoadingCrops(true);
    try {
      const token = await AsyncStorage.getItem("token");
  
      const response = await api.get('api/unregisteredfarmercrop/get-crop-names', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const fetchLanguage = async () => {
        try {
          const lang = await AsyncStorage.getItem("@user_language");
          setSelectedLanguage(lang || "en");
        } catch (error) {
          console.error("Error fetching language preference:", error);
        }
      };
      fetchLanguage();
  
      const formattedData = response.data.map((crop: any) => {
        console.log("kkk",selectedLanguage)
        let cropName;
        switch (selectedLanguage) {
          case "si":
            cropName = crop.cropNameSinhala;
            break;
          case "ta":
            cropName = crop.cropNameTamil;
            break;
          default:
            cropName = crop.cropNameEnglish;
        }
      
        return {
          label: cropName,
          value: crop.id.toString(),
          cropName: cropName,
        };
      });
      
      setCropOptions(formattedData);
    } catch (error) {
      console.error("Failed to fetch crop names:", error);
    } finally {
      setLoadingCrops(false);
    }
  };
          

  
  const fetchVarieties = async () => {
    if (!selectedCrop) {
      setVarietyOptions([]);
      setSelectedVariety(null);
      return;
    }
  
    setLoadingVarieties(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await api.get(`api/unregisteredfarmercrop/crops/varieties/${selectedCrop}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const formattedData = response.data.map((variety: any) => {
        let varietyName;
        switch (selectedLanguage) {
          case "si":
            varietyName = variety.varietySinhala;
            break;
          case "ta":
            varietyName = variety.varietyTamil;
            break;
          default:
            varietyName = variety.varietyEnglish;
        }
      
        return {
          label: varietyName,
          value: variety.id.toString(),
        };
      });
      
      setVarietyOptions(formattedData);
    } catch (error) {
      console.error("Failed to fetch varieties:", error);
    } finally {
      setLoadingVarieties(false);
    }
  };

  // Fetch varieties when selectedCrop changes
  useEffect(() => {
    fetchVarieties();
  }, [selectedCrop]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}>
      <ScrollView 
        className="flex-1 bg-white"
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2AAD7A"]}
            tintColor="#2AAD7A"
          />
        }
      >
        <View className="flex-1 bg-white items-center px-6 pt-8">
          <Text className="text-xl font-semibold mb-4">{t("SearchPrice.SearchPrice")}</Text>
          <Image
            source={require('../assets/images/marketprice.webp')}
            className="w-64 h-40 mb-6 mt-8"
            resizeMode="contain"
          />

          {/* Crop Name Dropdown */}
          <View className="w-full mb-4" style={{ zIndex: 3000 }}>
            <Text className="text-base mb-2 text-center">{t("SearchPrice.Crop")}</Text>
            {loadingCrops ? (
              <ActivityIndicator size="small" color="#2AAD7A" />
            ) : (
              <DropDownPicker
                open={open}
                value={selectedCrop}
                items={cropOptions}
                setOpen={setOpen}
                setValue={(value) => {
                  setSelectedCrop(value);
                  if (!value) {
                    setSelectedVariety(null);
                  }
                }}
                setItems={setCropOptions}
                placeholder={t("SearchPrice.SelectCrop")}
                style={{
                  backgroundColor: 'white',
                  borderColor: '#CFCFCF',
                }}
                textStyle={{
                  color: '#000',
                }}
                dropDownContainerStyle={{
                  borderColor: '#CFCFCF',
                  maxHeight: 200,
                }}
                listMode="SCROLLVIEW"
                scrollViewProps={{
                  nestedScrollEnabled: true,
                }}
                zIndex={3000}
                zIndexInverse={1000}
              />
            )}
          </View>

          {/* Variety Dropdown */}
          <View className="w-full mb-8" style={{ zIndex: 1000 }}>
            <Text className="text-base mb-2 text-center">{t("SearchPrice.Variety")}</Text>
            {loadingVarieties ? (
              <ActivityIndicator size="small" color="#2AAD7A" />
            ) : (
              <DropDownPicker
                open={vopen}
                value={selectedVariety}
                items={varietyOptions}
                setOpen={setVopen}
                setValue={setSelectedVariety}
                setItems={setVarietyOptions}
                placeholder={t("SearchPrice.SelectVariety")}
                style={{
                  backgroundColor: 'white',
                  borderColor: '#CFCFCF',
                }}
                textStyle={{
                  color: '#000',
                }}
                dropDownContainerStyle={{
                  borderColor: '#CFCFCF',
                  maxHeight: 200,
                }}
                listMode="SCROLLVIEW"         
                scrollViewProps={{             
                  nestedScrollEnabled: true,
                }}
                disabled={!selectedCrop}
                zIndex={1000}
                zIndexInverse={3000}
              />
            )}
          </View>

          {/* Search Button */}
          <TouchableOpacity
            className="bg-[#2AAD7A] w-full py-3 mb-4 rounded-[35px] items-center"
            onPress={() => {
              if (selectedCrop && selectedVariety) {
                const cropName = cropOptions.find(option => option.value === selectedCrop)?.label || '';
                const varietyName = varietyOptions.find(option => option.value === selectedVariety)?.label || '';
                
                navigation.navigate('PriceChart', {
                  cropName: cropName,
                  varietyId: selectedVariety,
                  varietyName: varietyName,
                });
              } else {
                Alert.alert(
                  t("SearchPrice.Selection Required"),
                  t("SearchPrice.Please select both Crop and Variety to continue"),
                  [{ text: t("SearchPrice.OK") }]
                );
              }
            }}
          >
            <Text className="text-white font-semibold text-lg">{t("SearchPrice.Search")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SearchPriceScreen;