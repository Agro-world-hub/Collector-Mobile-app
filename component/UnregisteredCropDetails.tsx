// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, ScrollView,Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RouteProp,useFocusEffect,useRoute } from '@react-navigation/native';
// import { RootStackParamList } from './types';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import { Picker } from '@react-native-picker/picker';
// import axios from 'axios';
// import * as ImagePicker from 'expo-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {environment }from '@/environment/environment';
// import {
//     widthPercentageToDP as wp,
//     heightPercentageToDP as hp,
//   } from "react-native-responsive-screen";
//   import { useTranslation } from "react-i18next";
  
//   import generateInvoiceNumber from "@/utils/generateInvoiceNumber";
// import CameraComponent from "@/utils/CameraComponent";

// const api = axios.create({
//   baseURL: environment.API_BASE_URL,
// });

// interface Crop {
//     id: string;
//     cropNameEnglish: string;
//     cropNameSinhala: string;
//     cropNameTamil: string;
// }

// // Define navigation and route props
// type UnregisteredCropDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'UnregisteredCropDetails'>;
// type UnregisteredCropDetailsRouteProp = RouteProp<RootStackParamList, 'UnregisteredCropDetails'>;

// interface UnregisteredCropDetailsProps {
//     navigation: UnregisteredCropDetailsNavigationProp;
//     route: UnregisteredCropDetailsRouteProp;
// }

// const UnregisteredCropDetails: React.FC<UnregisteredCropDetailsProps> = ({ navigation }) => {
//     const [cropCount, setCropCount] = useState(1);
//     const [cropNames, setCropNames] = useState<Crop[]>([]);
//     const [selectedCrop, setSelectedCrop] = useState<{ id: string; name: string } | null>(null);
//     const [varieties, setVarieties] = useState<{ id: string; variety: string }[]>([]);
//     const [selectedVariety, setSelectedVariety] = useState<string | null>(null);
//     const [unitPrices, setUnitPrices] = useState<{ [key: string]: number | null }>({ A: null, B: null, C: null });
//     const [quantities, setQuantities] = useState<{ [key: string]: number }>({ A: 0, B: 0, C: 0 });
//     const [total, setTotal] = useState<number>(0);
//     const [image, setImage] = useState<string | null>(null); // Store base64 image here
//     const [crops, setCrops] = useState<any[]>([]);
//     const [selectedVarietyName, setSelectedVarietyName] = useState<string | null>(null);
//     const [donebutton1visibale, setdonebutton1visibale] = useState(true);
//     const [donebutton2visibale, setdonebutton2visibale] = useState(false);
//     const [donebutton1disabale, setdonebutton1disabale] = useState(true);
//     const [donebutton2disabale, setdonebutton2disabale] = useState(false);
//     const [addbutton, setaddbutton] = useState(true);
//     const { t } = useTranslation();
//     const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
   
//     const route = useRoute<UnregisteredCropDetailsRouteProp>();
//     const { userId } = route.params;
//     console.log(userId)

//     useEffect(() => {
//         const fetchSelectedLanguage = async () => {
//           const lang = await AsyncStorage.getItem("@user_language");
//           setSelectedLanguage(lang || "en"); // Default to English
//         };
//         fetchSelectedLanguage();
//       }, []);

//     useFocusEffect(
//         React.useCallback(() => {
//             const fetchCropNames = async () => {
//                 try {
//                     const response = await axios.get(`${environment.API_BASE_URL}api/unregisteredfarmercrop/get-crop-names`);
                    
//                     console.log(response.data);
//                     const uniqueCropNames = response.data.reduce((acc: { cropNameEnglish: any; }[], crop: { cropNameEnglish: any; }) => {
//                         if (!acc.some((item: { cropNameEnglish: any; }) => item.cropNameEnglish === crop.cropNameEnglish)) {
//                             acc.push(crop); // Push unique crop names
//                         }
//                         return acc;
//                     }, []);
                    
//                     setCropNames(uniqueCropNames);
//                 } catch (error) {
//                     console.error('Error fetching crop names:', error);
//                 }
//             };
    
//             fetchCropNames();
//         }, []) // Empty dependency array to ensure the effect only depends on screen focus
//     );
    
//     const handleCropChange = async (crop: { id: string; cropNameEnglish: string }) => {
//         // Update the selected crop state
//         setSelectedCrop({ id: crop.id, name: crop.cropNameEnglish });
//         console.log(crop.cropNameEnglish);  // Log the selected crop name
    
//         // Reset other states
//         setSelectedVariety(null);
//         setUnitPrices({ A: null, B: null, C: null });
//         setQuantities({ A: 0, B: 0, C: 0 });
    
//         try {
//             // Use the crop ID to fetch varieties from the API
//             const varietiesResponse = await api.get(`api/unregisteredfarmercrop/crops/varieties/${crop.id}`);
//             console.log('Varieties response:', varietiesResponse.data);  // Log to verify the response structure
    
//             // Ensure the response is valid and has data
//             if (varietiesResponse.data && Array.isArray(varietiesResponse.data)) {
//                 // Update the varieties state with the response data
//                 setVarieties(varietiesResponse.data.map((variety: { id: string, varietyNameEnglish: string }) => ({
//                     id: variety.id,  // Use the actual variety ID
//                     variety: variety.varietyNameEnglish
//                 })));
//             } else {
//                 console.error('Varieties response is not an array or is empty.');
//             }
//             console.log(varietiesResponse.data)
//         } catch (error) {
//             console.error('Error fetching varieties:', error); // Log any errors
//         }
//     };
    

//     const handleVarietyChange = async (varietyId: string) => {
//         setSelectedVariety(varietyId);  // Set the selected variety ID
    
//         // Find the selected variety name by the ID
//         const selectedVariety = varieties.find(variety => variety.id === varietyId);
//         if (selectedVariety) {
//             setSelectedVarietyName(selectedVariety.variety); // Store the name of the selected variety
//         }
    
//         try {
//             // Send the selected varietyId to fetch unit prices
//             const pricesResponse = await api.get(`api/unregisteredfarmercrop/unitPrices/${varietyId}`);
    
//             // Check if the response status is 404 (Not Found)
//             if (pricesResponse.status === 404) {
//                 Alert.alert('No Prices Available', 'Prices for the selected variety were not found.');
//                 setUnitPrices({});  // Clear any previously set prices
//                 return;  // Stop further execution
//             }
    
//             console.log(pricesResponse.data);  // Log the response to verify the data
    
//             // Check if there are no prices in the response body
//             if (pricesResponse.data && pricesResponse.data.length === 0) {
//                 // Show an alert if no prices are available
//                 Alert.alert('No Prices Available', 'No prices are available for the selected variety.');
//                 setUnitPrices({});  // Clear any previously set prices
//                 return;  // Do not proceed with setting prices or calculating the total
//             }
    
//             const prices = pricesResponse.data.reduce((acc: any, curr: any) => {
//                 acc[curr.grade] = curr.price;
//                 return acc;
//             }, {});
    
//             setUnitPrices(prices);
//             calculateTotal();  // Recalculate total after setting prices
//         } catch (error) {
//             console.error('Error fetching unit prices for selected variety:', error);
//             // You can handle other error cases here, for example:
//             Alert.alert(t("Error.error"), t("Error.no any prices found !"));
//         }
//     };
    
    
//     const handleQuantityChange = (grade: string, value: string) => {
//         const quantity = parseInt(value) || 0;
//         setQuantities(prev => ({ ...prev, [grade]: quantity }));
//         calculateTotal(); 
//     };
    
//         useEffect(() => {
//             calculateTotal();
//         }, [unitPrices, quantities]);

//         const calculateTotal = () => {
//             const totalPrice = Object.keys(unitPrices).reduce((acc, grade) => {
//                 const price = unitPrices[grade] || 0; // default to 0 if price is null
//                 const quantity = quantities[grade] || 0; // default to 0 if quantity is 0
//                 return acc + (price * quantity);
//             }, 0);
//             setTotal(totalPrice);
//             if(totalPrice!=0){
//             setdonebutton2disabale(true);
//             setdonebutton1disabale(false);
//             setaddbutton(false);
                
//         }    
//         };
        
//      const [resetCameraImage, setResetCameraImage] = useState(false);

//       const incrementCropCount = async() => {
//         setaddbutton(true);
//         setdonebutton2disabale(false)
//         console.log('Incrementing crop count');
//         setdonebutton1visibale(false);
//         setdonebutton2visibale(true);
//         if (!selectedCrop || !selectedVariety) {
//             alert("Please select both a crop and a variety before adding.");
//             return;
//         }
    
//         const newCrop = {
//             cropId: selectedCrop.id || '', 
//             varietyId: selectedVariety || '', 
//             gradeAprice: unitPrices.A || 0,  
//             gradeAquan: quantities.A || 0,   
//             gradeBprice: unitPrices.B || 0,
//             gradeBquan: quantities.B || 0,
//             gradeCprice: unitPrices.C || 0,
//             gradeCquan: quantities.C || 0,
//             image: image || null,
//         };
    
//         setCrops(prevCrops => {
//             console.log('Adding new crop:', newCrop);
//             return [...prevCrops, newCrop];
//         });
    
//         resetCropEntry();
        
//             // Toggle resetCameraImage to trigger the useEffect in CameraComponent
//         setResetCameraImage(prev => !prev);
//         setCropCount(prevCount => prevCount + 1);
//     };
    
    
//     const resetCropEntry = () => {
//         setSelectedCrop(null);
//         setSelectedVariety(null);
//         setUnitPrices({ A: null, B: null, C: null });
//         setQuantities({ A: 0, B: 0, C: 0 });
//         setImage(null);
//     };
    
//     // const handleImagePick = async () => {
//     //     const result = await ImagePicker.launchImageLibraryAsync({
//     //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//     //         allowsEditing: true,
//     //         aspect: [4, 3],
//     //         quality: 1,
//     //         base64: true,
//     //     });
    
//     //     if (!result.canceled) {
//     //         setImage(result);
//     //     }
//     // };
    
//     const handleImagePick = (base64Image: string | null) => {
//         setImage(base64Image); // Update image state with base64 string
//       };
    
//     const refreshCropForms = () => {
//         setSelectedCrop(null);
//         setSelectedVariety(null);
//         setUnitPrices({ A: null, B: null, C: null });
//         setQuantities({ A: 0, B: 0, C: 0 });
//         setTotal(0);
//         setImage(null);
//         setCrops([]);
//         setdonebutton1visibale(true);
//         setdonebutton2visibale(false);
//         setdonebutton1disabale(true);
//         setdonebutton2disabale(false);
//         setaddbutton(true);
//         setCropCount(1);
//         setResetCameraImage(prev => !prev);
//       };
    
//       const handleSubmit = async () => {
//         try {
//             if (crops.length === 0) {
//                 alert("Please add at least one crop to proceed.");
//                 return;
//             }
    
//             // Retrieve the token from AsyncStorage
//             const token = await AsyncStorage.getItem('token');
    
//             // Generate invoice number
//             const invoiceNumber = await generateInvoiceNumber();
//             if (!invoiceNumber) {
//                 alert("Failed to generate invoice number.");
//                 return;
//             }
    
//             // Construct the payload including invoice number
//             const payload = {
//                 farmerId: userId, 
//                 invoiceNumber: invoiceNumber,  // Include generated invoice number
//                 crops: crops.map(crop => ({
//                     varietyId: crop.varietyId || '',
//                     gradeAprice: crop.gradeAprice || 0,
//                     gradeAquan: crop.gradeAquan || 0,
//                     gradeBprice: crop.gradeBprice || 0,
//                     gradeBquan: crop.gradeBquan || 0,
//                     gradeCprice: crop.gradeCprice || 0,
//                     gradeCquan: crop.gradeCquan || 0,
//                     image: crop.image || null,
//                 })),
//             };
    
//             console.log('Payload before sending:', payload);
    
//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             };
    
//             // Make the API call to submit crop data
//             const response = await axios.post(`${environment.API_BASE_URL}api/unregisteredfarmercrop/add-crops`, payload, config);
    
//             // Capture the registeredFarmerId from the response
//             const { registeredFarmerId } = response.data;
//             console.log('registeredFarmerId:', registeredFarmerId);
    
//             alert('All crop details submitted successfully!');
            
//             refreshCropForms();
    
//             // Navigate to the ReportPage, passing registeredFarmerId and userId
//             navigation.navigate('ReportPage' as any, { userId, registeredFarmerId });
//         } catch (error) {
//             console.error('Error submitting crop data:', error);
//             alert(t("Error.Failed to submit crop details. Please try again."));
//         }
//     };
    
//     // ============================ HANDLE SUBMIT 2 ============================
//     const handelsubmit2 = async () => {
//         try {
//             // Retrieve the token from AsyncStorage
//             const token = await AsyncStorage.getItem('token');
    
//             // Generate invoice number
//             const invoiceNumber = await generateInvoiceNumber();
//             if (!invoiceNumber) {
//                 alert("Failed to generate invoice number.");
//                 return;
//             }
    
//             // Construct the payload including invoice number
//             const payload = {
//                 farmerId: userId,
//                 invoiceNumber: invoiceNumber,  // Include generated invoice number
//                 crops: {
//                     varietyId: selectedVariety || '',
//                     gradeAprice: unitPrices.A || 0,
//                     gradeAquan: quantities.A || 0,
//                     gradeBprice: unitPrices.B || 0,
//                     gradeBquan: quantities.B || 0,
//                     gradeCprice: unitPrices.C || 0,
//                     gradeCquan: quantities.C || 0,
//                     image: image || null,
//                 },
//             };
    
//             console.log('Payload before sending:', payload);
    
//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             };
    
//             // Make the API call to submit crop data
//             const response = await axios.post(`${environment.API_BASE_URL}api/unregisteredfarmercrop/add-crops2`, payload, config);
    
//             // Capture the registeredFarmerId from the response
//             const { registeredFarmerId } = response.data;
//             console.log('registeredFarmerId:', registeredFarmerId);
    
//             alert('All crop details submitted successfully!');
            
//             refreshCropForms();
    
//             // Navigate to the ReportPage, passing registeredFarmerId and userId
//             navigation.navigate('ReportPage' as any, { userId, registeredFarmerId });
//         } catch (error) {
//             console.error('Error submitting crop data:', error);
//             alert(t("Error.Failed to submit crop details. Please try again."));
//         }
//     };
    

//     return (
//          <KeyboardAvoidingView 
//                     behavior={Platform.OS ==="ios" ? "padding" : "height"}
//                     enabled
//                     className="flex-1"
//                     >
//         <ScrollView className="flex-1 bg-gray-50 px-6 py-4" style={{ paddingHorizontal: wp(6), paddingVertical: hp(2) }}>
//             {/* <View className="flex-row items-center mt-1 mb-6">
//                 <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
//                     <AntDesign name="left" size={24} color="#000" />
//                 </TouchableOpacity>
//                 <Text className="text-center ml-[26%] text-lg font-semibold">Fill Details</Text>
//             </View> */}
//                  <View className="flex-row items-center  mb-6">
//                       <TouchableOpacity onPress={() => navigation.goBack()} className="">
//                         <AntDesign name="left" size={24} color="#000" />
//                       </TouchableOpacity>
//                       <Text className="flex-1 text-center text-xl font-bold text-black">{t("UnregisteredCropDetails.FillDetails")}</Text>
//                     </View>

//             <Text className="text-center text-md font-medium mt-2">{t("UnregisteredCropDetails.Crop")}{cropCount}</Text>
//             <View className="mb-6 border-b p-2 border-gray-200 pb-6">
//             <Text className="text-gray-600 mt-4">{t("UnregisteredCropDetails.CropName")}</Text>               
//               <View className="border border-gray-300 rounded-md mt-2 p-2">                 
                
//               {/* <Picker
//                     selectedValue={selectedCrop?.id || null} // Use the crop's id for selection
//                     onValueChange={(itemValue: string | null) => {
//                         const crop = cropNames.find(c => c.id === itemValue); // Find the crop by id
//                         if (crop) handleCropChange({ id: crop.id, cropNameEnglish: crop.cropNameEnglish }); // Pass the correct object structure
//                     }}
//                     style={{ height: 50, width: '100%' }}
//                 >
//                     <Picker.Item label="Select Crop" value={null} />
//                     {cropNames.map((crop) => (
//                         <Picker.Item key={crop.id} label={crop.cropNameEnglish} value={crop.id} /> // Use id as the value
//                     ))}
//                 </Picker> */}
//                 <Picker
//   selectedValue={selectedCrop?.id || null} // Use the crop's id for selection
//   onValueChange={(itemValue: string | null) => {
//     const crop = cropNames.find(c => c.id === itemValue); // Find the crop by id
//     if (crop) handleCropChange({ id: crop.id, cropNameEnglish: crop.cropNameEnglish }); // Pass the correct object structure
//   }}
//   style={{ height: 50, width: '100%' }}
// >
//   <Picker.Item label={t("UnregisteredCropDetails.Select Crop")} value={null} />
//   {cropNames.map((crop) => (
//     <Picker.Item 
//       key={crop.id} 
//       label={
//         selectedLanguage === "si"
//           ? crop.cropNameSinhala
//           : selectedLanguage === "ta"
//           ? crop.cropNameTamil
//           : crop.cropNameEnglish
//       } 
//       value={crop.id} 
//     />
//   ))}
// </Picker>


//                 </View>

//                 <Text className="text-gray-600 mt-4">{t("UnregisteredCropDetails.Variety")}</Text>
//                 <View className="border border-gray-300 rounded-md mt-2 p-2">
//                 <Picker
//                     selectedValue={selectedVariety || null}
//                     onValueChange={(itemValue: any) => handleVarietyChange(itemValue)}
//                     style={{ height: 50, width: '100%' }}
//                     enabled={!!selectedCrop}  // Ensure Picker is only enabled after selecting a crop
//                 >
//                     <Picker.Item label="Select Variety" value={null} />
//                     {varieties.map((variety) => (
//                         <Picker.Item key={variety.id} label={variety.variety} value={variety.id} />
//                     ))}
//                 </Picker>


//                 </View>

//                 <Text className="text-gray-600 mt-4">{t("UnregisteredCropDetails.UnitGrades")}</Text>
//                 <View className="border border-gray-300 rounded-lg mt-2 p-4">
//                     {['A', 'B', 'C'].map((grade) => (
//                         <View key={grade} className="flex-row items-center mb-3">
//                             <Text className="w-8 text-gray-600">{grade}</Text>
//                             <TextInput
//                                 placeholder="Rs."
//                                 keyboardType="numeric"
//                                 className="flex-1 border border-gray-300 rounded-md p-2 mx-2 text-gray-600"
//                                 value={unitPrices[grade]?.toString() || ''}
//                                 editable={false}
//                             />
//                             <TextInput
//                                 placeholder="kg"
//                                 keyboardType="numeric"
//                                 className="flex-1 border border-gray-300 rounded-md p-2 text-gray-600"
//                                 value={quantities[grade].toString()}
//                                 onChangeText={value => handleQuantityChange(grade, value)}
//                             />
//                         </View>
//                     ))}
//                 </View>

//                 <View className='mt-[10%]'>
//                 {/* Camera component to capture image */}
//                 <CameraComponent onImagePicked={handleImagePick} resetImage={resetCameraImage}/> 

//                 {/* Display the base64 image after it is picked */}

//             </View>



//                 {/* Total and Buttons */}
//                 <Text className="text-gray-600 mt-4">{t("UnregisteredCropDetails.Total")}</Text>
//                 <View className="border border-gray-300 rounded-md mt-2 p-2">
//                     <TextInput 
//                         placeholder="--Auto Fill--" 
//                         editable={false} 
//                         value={total.toString()} 
//                         className="text-gray-600" 
//                     />
//                 </View>

//                 <TouchableOpacity onPress={incrementCropCount} disabled={addbutton==true} className={`bg-green-500 rounded-md p-4 mt-2 ${addbutton ? 'opacity-50' : ''}`}>
//                     <Text className="text-center text-white font-semibold">{t("UnregisteredCropDetails.Add")}</Text>
//                 </TouchableOpacity>
//                {donebutton1visibale && 
//                 <TouchableOpacity onPress={handelsubmit2} disabled={donebutton1disabale==true}  className={`border border-black rounded-md p-4 mt-4 ${donebutton1disabale ? 'opacity-50' : ''}`}>
//                     <Text className="text-center text-black font-semibold">{t("UnregisteredCropDetails.Done")}</Text>
//                 </TouchableOpacity>
//                 }
//                 {donebutton2visibale &&
//                 <TouchableOpacity onPress={handleSubmit} disabled={donebutton2disabale==true}  className={`border border-black rounded-md p-4 mt-4 ${donebutton2disabale ? 'opacity-50' : ''}`}>
//                    <Text className="text-center text-black font-semibold">{t("UnregisteredCropDetails.Done")}</Text>
//                 </TouchableOpacity>
//                 }  
//             </View>
//         </ScrollView>
//         </KeyboardAvoidingView>
//     );
// };

// export default UnregisteredCropDetails;

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView,Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp,useFocusEffect,useRoute } from '@react-navigation/native';
import { RootStackParamList } from './types';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {environment }from '../environment/environment';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  
  import generateInvoiceNumber from "@/utils/generateInvoiceNumber";
import CameraComponent from "@/utils/CameraComponent";
import { SelectList } from 'react-native-dropdown-select-list';
import { useTranslation } from "react-i18next";

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

interface Crop {
    id: string;
    cropNameEnglish: string;
    cropNameSinhala: string;
    cropNameTamil: string;
}

// Define navigation and route props
type UnregisteredCropDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'UnregisteredCropDetails'>;
type UnregisteredCropDetailsRouteProp = RouteProp<RootStackParamList, 'UnregisteredCropDetails'>;

interface UnregisteredCropDetailsProps {
    navigation: UnregisteredCropDetailsNavigationProp;
    route: UnregisteredCropDetailsRouteProp;
}

const UnregisteredCropDetails: React.FC<UnregisteredCropDetailsProps> = ({ navigation }) => {
    const [cropCount, setCropCount] = useState(1);
    const [cropNames, setCropNames] = useState<Crop[]>([]);
    const [selectedCrop, setSelectedCrop] = useState<{ id: string; name: string } | null>(null);
    const [varieties, setVarieties] = useState<{ id: string; variety: string }[]>([]);
    const [selectedVariety, setSelectedVariety] = useState<string | null>(null);
    const [unitPrices, setUnitPrices] = useState<{ [key: string]: number | null }>({ A: null, B: null, C: null });
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({ A: 0, B: 0, C: 0 });
    const [total, setTotal] = useState<number>(0);
    const [image, setImage] = useState<string | null>(null); // Store base64 image here
    const [crops, setCrops] = useState<any[]>([]);
    const [selectedVarietyName, setSelectedVarietyName] = useState<string | null>(null);
    const [donebutton1visibale, setdonebutton1visibale] = useState(true);
    const [donebutton2visibale, setdonebutton2visibale] = useState(false);
    const [donebutton1disabale, setdonebutton1disabale] = useState(true);
    const [donebutton2disabale, setdonebutton2disabale] = useState(false);
    const [addbutton, setaddbutton] = useState(true);
    const { t } = useTranslation();
 
   
    const route = useRoute<UnregisteredCropDetailsRouteProp>();
    const { userId } = route.params;
    console.log(userId)

    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const fetchSelectedLanguage = async () => {
    try {
      const lang = await AsyncStorage.getItem("@user_language"); // Get stored language
      setSelectedLanguage(lang || "en"); // Default to English if not set
    } catch (error) {
      console.error("Error fetching language preference:", error);
    }
  };

     useEffect(() => {
    const fetchData = async () => {
      await fetchSelectedLanguage();
    };
    fetchData();
  }, []);
    
    useFocusEffect(
        React.useCallback(() => {
            const fetchCropNames = async () => {
                try {
                    // Get auth token from storage
                    const token = await AsyncStorage.getItem("token"); // Adjust this to your token storage method
                    
                    // Add token to request headers
                    const headers = {
                        'Authorization': `Bearer ${token}`
                    };
                    
                    const response = await axios.get(
                        `${environment.API_BASE_URL}api/unregisteredfarmercrop/get-crop-names`, 
                        { headers }
                    );
                    
                    console.log(response.data);
                    const uniqueCropNames = response.data.reduce((acc: { cropNameEnglish: any; }[], crop: { cropNameEnglish: any; }) => {
                        if (!acc.some((item: { cropNameEnglish: any; }) => item.cropNameEnglish === crop.cropNameEnglish)) {
                            acc.push(crop); // Push unique crop names
                        }
                        return acc;
                    }, []);
                    
                    setCropNames(uniqueCropNames);
                } catch (error) {
                    console.error('Error fetching crop names:', error);
                }
            };
    
            fetchCropNames();
        }, []) // Empty dependency array to ensure the effect only depends on screen focus
    );
    
    // Modify the handleCropChange function to store all language versions
const handleCropChange = async (crop: { id: string; cropNameEnglish: string; cropNameSinhala: string; cropNameTamil: string }) => {
    // Set selected crop with all language names
    setSelectedCrop({ 
        id: crop.id, 
        name: selectedLanguage === 'en' ? crop.cropNameEnglish : 
              selectedLanguage === 'si' ? crop.cropNameSinhala : crop.cropNameTamil 
    });
    
    console.log(`Selected crop in ${selectedLanguage}: ${selectedCrop?.name}`);

    setSelectedVariety(null);
    setUnitPrices({ A: null, B: null, C: null });
    setQuantities({ A: 0, B: 0, C: 0 });

    try {
        const token = await AsyncStorage.getItem("token"); 

        const headers = {
            'Authorization': `Bearer ${token}`
        };

        const varietiesResponse = await api.get(
            `api/unregisteredfarmercrop/crops/varieties/${crop.id}`,
            { headers }
        );

        console.log('Varieties response:', varietiesResponse.data);

        if (varietiesResponse.data && Array.isArray(varietiesResponse.data)) {
            setVarieties(varietiesResponse.data.map((variety: { 
                id: string, 
                varietyEnglish: string,
                varietySinhala: string,
                varietyTamil: string 
            }) => ({
                id: variety.id,
                variety: selectedLanguage === 'en' ? variety.varietyEnglish : 
                        selectedLanguage === 'si' ? variety.varietySinhala : variety.varietyTamil
            })));
        } else {
            console.error('Varieties response is not an array or is empty.');
        }
    } catch (error) {
        console.error('Error fetching varieties:', error);
    }
};
    
    

    const handleVarietyChange = async (varietyId: string) => {
        setSelectedVariety(varietyId);  // Set the selected variety ID
    
        // Find the selected variety name by the ID
        const selectedVariety = varieties.find(variety => variety.id === varietyId);
        if (selectedVariety) {
            setSelectedVarietyName(selectedVariety.variety); // Store the name of the selected variety
        }
    
        try {
            // Send the selected varietyId to fetch unit prices
            const pricesResponse = await api.get(`api/unregisteredfarmercrop/unitPrices/${varietyId}`);
    
            // Check if the response status is 404 (Not Found)
            if (pricesResponse.status === 404) {
                Alert.alert(t("Error.No Prices Available"), t("Error.Prices for the selected variety were not found."));
                setUnitPrices({});  // Clear any previously set prices
                return;  // Stop further execution
            }
    
            console.log(pricesResponse.data);  // Log the response to verify the data
    
            // Check if there are no prices in the response body
            if (pricesResponse.data && pricesResponse.data.length === 0) {
                // Show an alert if no prices are available
                Alert.alert(t("Error.No Prices Available"), t("Error.No prices are available for the selected variety."));
                setUnitPrices({});  // Clear any previously set prices
                return;  // Do not proceed with setting prices or calculating the total
            }
    
            const prices = pricesResponse.data.reduce((acc: any, curr: any) => {
                acc[curr.grade] = curr.price;
                return acc;
            }, {});
    
            setUnitPrices(prices);
            calculateTotal();  // Recalculate total after setting prices
        } catch (error) {
            console.error('Error fetching unit prices for selected variety:', error);
            // You can handle other error cases here, for example:
            Alert.alert(t("Error.error"), t("Error.no any prices found"));
        }
    };
    
    
    const handleQuantityChange = (grade: string, value: string) => {
        const quantity = parseInt(value) || 0;
        setQuantities(prev => ({ ...prev, [grade]: quantity }));
        calculateTotal(); 
    };
    
        useEffect(() => {
            calculateTotal();
        }, [unitPrices, quantities]);

        const calculateTotal = () => {
            const totalPrice = Object.keys(unitPrices).reduce((acc, grade) => {
                const price = unitPrices[grade] || 0; // default to 0 if price is null
                const quantity = quantities[grade] || 0; // default to 0 if quantity is 0
                return acc + (price * quantity);
            }, 0);
            setTotal(totalPrice);
            if(totalPrice!=0){
            setdonebutton2disabale(true);
            setdonebutton1disabale(false);
            setaddbutton(false);
                
        }    
        };
        
     const [resetCameraImage, setResetCameraImage] = useState(false);

      const incrementCropCount = async() => {
        setaddbutton(true);
        setdonebutton2disabale(false)
        console.log('Incrementing crop count');
        setdonebutton1visibale(false);
        setdonebutton2visibale(true);
        if (!selectedCrop || !selectedVariety) {
            alert("Please select both a crop and a variety before adding.");
            return;
        }
    
        const newCrop = {
            cropId: selectedCrop.id || '', 
            varietyId: selectedVariety || '', 
            gradeAprice: unitPrices.A || 0,  
            gradeAquan: quantities.A || 0,   
            gradeBprice: unitPrices.B || 0,
            gradeBquan: quantities.B || 0,
            gradeCprice: unitPrices.C || 0,
            gradeCquan: quantities.C || 0,
            image: image || null,
        };
    
        setCrops(prevCrops => {
            console.log('Adding new crop:', newCrop);
            return [...prevCrops, newCrop];
        });
    
        resetCropEntry();
        
            // Toggle resetCameraImage to trigger the useEffect in CameraComponent
        setResetCameraImage(prev => !prev);
        setCropCount(prevCount => prevCount + 1);
    };
    
    
    const resetCropEntry = () => {
        setSelectedCrop(null);
        setSelectedVariety(null);
        setUnitPrices({ A: null, B: null, C: null });
        setQuantities({ A: 0, B: 0, C: 0 });
        setImage(null);
    };
    
    // const handleImagePick = async () => {
    //     const result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //         allowsEditing: true,
    //         aspect: [4, 3],
    //         quality: 1,
    //         base64: true,
    //     });
    
    //     if (!result.canceled) {
    //         setImage(result);
    //     }
    // };
    
    const handleImagePick = (base64Image: string | null) => {
        setImage(base64Image); // Update image state with base64 string
      };
    
    const refreshCropForms = () => {
        setSelectedCrop(null);
        setSelectedVariety(null);
        setUnitPrices({ A: null, B: null, C: null });
        setQuantities({ A: 0, B: 0, C: 0 });
        setTotal(0);
        setImage(null);
        setCrops([]);
        setdonebutton1visibale(true);
        setdonebutton2visibale(false);
        setdonebutton1disabale(true);
        setdonebutton2disabale(false);
        setaddbutton(true);
        setCropCount(1);
        setResetCameraImage(prev => !prev);
      };
    
      const handleSubmit = async () => {
        try {
            if (crops.length === 0) {
                alert("Please add at least one crop to proceed.");
                return;
            }
    
            // Retrieve the token from AsyncStorage
            const token = await AsyncStorage.getItem('token');
    
            // Generate invoice number
            const invoiceNumber = await generateInvoiceNumber();
            if (!invoiceNumber) {
                alert("Failed to generate invoice number.");
                return;
            }
    
            // Construct the payload including invoice number
            const payload = {
                farmerId: userId, 
                invoiceNumber: invoiceNumber,  // Include generated invoice number
                crops: crops.map(crop => ({
                    varietyId: crop.varietyId || '',
                    gradeAprice: crop.gradeAprice || 0,
                    gradeAquan: crop.gradeAquan || 0,
                    gradeBprice: crop.gradeBprice || 0,
                    gradeBquan: crop.gradeBquan || 0,
                    gradeCprice: crop.gradeCprice || 0,
                    gradeCquan: crop.gradeCquan || 0,
                    image: crop.image || null,
                })),
            };
    
            console.log('Payload before sending:', payload);
    
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
    
            // Make the API call to submit crop data
            const response = await axios.post(`${environment.API_BASE_URL}api/unregisteredfarmercrop/add-crops`, payload, config);
    
            // Capture the registeredFarmerId from the response
            const { registeredFarmerId } = response.data;
            console.log('registeredFarmerId:', registeredFarmerId);
    
            alert('All crop details submitted successfully!');
            
            refreshCropForms();
    
            // Navigate to the ReportPage, passing registeredFarmerId and userId
            navigation.navigate('ReportPage' as any, { userId, registeredFarmerId });
        } catch (error) {
            console.error('Error submitting crop data:', error);
            alert('Failed to submit crop details. Please try again.');
        }
    };
    
    // ============================ HANDLE SUBMIT 2 ============================
    const handelsubmit2 = async () => {
        try {
            // Retrieve the token from AsyncStorage
            const token = await AsyncStorage.getItem('token');
    
            // Generate invoice number
            const invoiceNumber = await generateInvoiceNumber();
            if (!invoiceNumber) {
                alert("Failed to generate invoice number.");
                return;
            }
    
            // Construct the payload including invoice number
            const payload = {
                farmerId: userId,
                invoiceNumber: invoiceNumber,  // Include generated invoice number
                crops: {
                    varietyId: selectedVariety || '',
                    gradeAprice: unitPrices.A || 0,
                    gradeAquan: quantities.A || 0,
                    gradeBprice: unitPrices.B || 0,
                    gradeBquan: quantities.B || 0,
                    gradeCprice: unitPrices.C || 0,
                    gradeCquan: quantities.C || 0,
                    image: image || null,
                },
            };
    
            console.log('Payload before sending:', payload);
    
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
    
            // Make the API call to submit crop data
            const response = await axios.post(`${environment.API_BASE_URL}api/unregisteredfarmercrop/add-crops2`, payload, config);
    
            // Capture the registeredFarmerId from the response
            const { registeredFarmerId } = response.data;
            console.log('registeredFarmerId:', registeredFarmerId);
    
            alert(t("Error.All crop details submitted successfully!"));
            
            refreshCropForms();
    
            // Navigate to the ReportPage, passing registeredFarmerId and userId
            navigation.navigate('ReportPage' as any, { userId, registeredFarmerId });
        } catch (error) {
            console.error('Error submitting crop data:', error);
            alert(t("Error.Failed to submit crop details. Please try again."));
        }
    };
    

    return (
         <KeyboardAvoidingView 
                    behavior={Platform.OS ==="ios" ? "padding" : "height"}
                    enabled
                    className="flex-1"
                    >
        <ScrollView className="flex-1 bg-gray-50 px-6 py-4" style={{ paddingHorizontal: wp(6), paddingVertical: hp(2) }}>
            {/* <View className="flex-row items-center mt-1 mb-6">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                    <AntDesign name="left" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-center ml-[26%] text-lg font-semibold">Fill Details</Text>
            </View> */}
                 <View className="flex-row items-center  mb-6">
                      <TouchableOpacity onPress={() => navigation.goBack()} className="">
                        <AntDesign name="left" size={24} color="#000" />
                      </TouchableOpacity>
                      <Text className="flex-1 text-center text-xl font-bold text-black">{t("UnregisteredCropDetails.FillDetails")}</Text>
                    </View>

            <Text className="text-center text-md font-medium mt-2">{t("UnregisteredCropDetails.Crop")} {cropCount}</Text>
            <View className="mb-6 border-b p-2 border-gray-200 pb-6">
            <Text className="text-gray-600 mt-4">{t("UnregisteredCropDetails.CropName")}</Text>               
              <View className="border border-gray-300 rounded-md mt-2 p-2">                 
                
              {/* <Picker
                    selectedValue={selectedCrop?.id || null} // Use the crop's id for selection
                    onValueChange={(itemValue: string | null) => {
                        const crop = cropNames.find(c => c.id === itemValue); // Find the crop by id
                        if (crop) handleCropChange({ id: crop.id, cropNameEnglish: crop.cropNameEnglish }); // Pass the correct object structure
                    }}
                    style={{ height: 50, width: '100%' }}
                >
                    <Picker.Item label="Select Crop" value={null} />
                    {cropNames.map((crop) => (
                        <Picker.Item key={crop.id} label={crop.cropNameEnglish} value={crop.id} /> // Use id as the value
                    ))}
                </Picker> */}
                {/* <SelectList
  setSelected={(itemValue: string) => {
    const crop = cropNames.find(c => c.id === itemValue); // Find the crop by id
    if (crop) handleCropChange({ id: crop.id, cropNameEnglish: crop.cropNameEnglish });
  }}
  boxStyles={{ height: 50, width: '100%',    borderColor: "white",paddingLeft: 14,paddingRight: 8,}}
  data={cropNames.map(crop => ({ key: crop.id, value: crop.cropNameEnglish }))}
  defaultOption={{ key: selectedCrop?.id, value: selectedCrop?.name }}
/>  */}
<SelectList
                setSelected={(val: string) => {
                    const selectedCropObj = cropNames.find(crop => 
                        selectedLanguage === 'en' ? crop.cropNameEnglish === val :
                        selectedLanguage === 'si' ? crop.cropNameSinhala === val : crop.cropNameTamil === val
                    );
                    if (selectedCropObj) {
                        handleCropChange(selectedCropObj);
                    }
                }}
                boxStyles={{ height: 50, width: '100%',  borderColor: 'white',paddingLeft: 14,paddingRight: 8,}}
                data={cropNames.map(crop => ({
                    key: crop.id,
                    value: selectedLanguage === 'en' ? crop.cropNameEnglish : 
                           selectedLanguage === 'si' ? crop.cropNameSinhala : crop.cropNameTamil
                }))}
                save="value"
                placeholder={t("UnregisteredCropDetails.Select Crop")}
                searchPlaceholder={t('search')}
            />

                </View>

                <Text className="text-gray-600 mt-4">{t("UnregisteredCropDetails.Variety")}</Text>
                <View className="border border-gray-300 rounded-md mt-2 p-2">
                {/* <Picker
                    selectedValue={selectedVariety || null}
                    onValueChange={(itemValue: any) => handleVarietyChange(itemValue)}
                    style={{ height: 50, width: '100%' }}
                    enabled={!!selectedCrop}  // Ensure Picker is only enabled after selecting a crop
                >
                    <Picker.Item label="Select Variety" value={null} />
                    {varieties.map((variety) => (
                        <Picker.Item key={variety.id} label={variety.variety} value={variety.id} />
                    ))}
                </Picker> */}
                 {/* <SelectList
  setSelected={(itemValue: string) => handleVarietyChange(itemValue)}
  data={varieties.map(variety => ({ key: variety.id, value: variety.variety }))}
  defaultOption={{ key: selectedVariety, value: varieties.find(v => v.id === selectedVariety)?.variety }}
  placeholder='Select Variety'
  boxStyles={{ height: 50, width: '100%',    borderColor: "white",paddingLeft: 14,paddingRight: 8,}}
  // Disable if no crop selected
/>  */}
<SelectList
  setSelected={(itemValue: string) => selectedCrop ? handleVarietyChange(itemValue) : null}
  data={[
    { key: '', value: t("UnregisteredCropDetails.Select Variety")},
    ...varieties.map(variety => ({ 
      key: variety.id, 
      value: variety.variety 
    }))
  ]}
  save="key"
  defaultOption={selectedVariety ? { 
    key: selectedVariety, 
    value: varieties.find(v => v.id === selectedVariety)?.variety || 'Select Variety'
  } : undefined}
  placeholder={t("UnregisteredCropDetails.Select Variety")}
  boxStyles={{ height: 50, width: '100%',  borderColor: 'white',paddingLeft: 14,paddingRight: 8,}}
/>


                </View>

                <Text className="text-gray-600 mt-4">{t("UnregisteredCropDetails.UnitGrades")}</Text>
                <View className="border border-gray-300 rounded-lg mt-2 p-4">
                    {['A', 'B', 'C'].map((grade) => (
                        <View key={grade} className="flex-row items-center mb-3">
                            <Text className="w-8 text-gray-600">{grade}</Text>
                            <TextInput
                                placeholder="Rs."
                                keyboardType="numeric"
                                className="flex-1 border border-gray-300 rounded-md p-2 mx-2 text-gray-600"
                                value={unitPrices[grade]?.toString() || ''}
                                editable={false}
                            />
                            <TextInput
                                placeholder="kg"
                                keyboardType="numeric"
                                className="flex-1 border border-gray-300 rounded-md p-2 text-gray-600"
                                value={quantities[grade].toString()}
                                onChangeText={value => handleQuantityChange(grade, value)}
                            />
                        </View>
                    ))}
                </View>

                <View className='mt-[10%]'>
                {/* Camera component to capture image */}
                <CameraComponent onImagePicked={handleImagePick} resetImage={resetCameraImage}/> 

                {/* Display the base64 image after it is picked */}

            </View>



                {/* Total and Buttons */}
                <Text className="text-gray-600 mt-4">{t("UnregisteredCropDetails.Total")}</Text>
                <View className="border border-gray-300 rounded-md mt-2 p-2">
                    <TextInput 
                        placeholder="--Auto Fill--" 
                        editable={false} 
                        value={total.toString()} 
                        className="text-gray-600" 
                    />
                </View>

                <TouchableOpacity onPress={incrementCropCount} disabled={addbutton==true} className={`bg-green-500 rounded-md p-4 mt-2 ${addbutton ? 'opacity-50' : ''}`}>
                    <Text className="text-center text-white font-semibold">{t("UnregisteredCropDetails.Total")}</Text>
                </TouchableOpacity>
               {donebutton1visibale && 
                <TouchableOpacity onPress={handelsubmit2} disabled={donebutton1disabale==true}  className={`border border-black rounded-md p-4 mt-4 ${donebutton1disabale ? 'opacity-50' : ''}`}>
                    <Text className="text-center text-black font-semibold">{t("UnregisteredCropDetails.Done")}</Text>
                </TouchableOpacity>
                }
                {donebutton2visibale &&
                <TouchableOpacity onPress={handleSubmit} disabled={donebutton2disabale==true}  className={`border border-black rounded-md p-4 mt-4 ${donebutton2disabale ? 'opacity-50' : ''}`}>
                   <Text className="text-center text-black font-semibold">{t("UnregisteredCropDetails.Done")}</Text>
                </TouchableOpacity>
                }  
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default UnregisteredCropDetails;

