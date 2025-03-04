// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from '../types';
// import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
// import axios from 'axios';
// import environment from '@/environment/environment';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import countryCodes from './countryCodes.json';
// import { Picker } from '@react-native-picker/picker';
// import { ActivityIndicator } from 'react-native';

// type AddOfficerAddressDetailsNavigationProp = StackNavigationProp<
//   RootStackParamList,
//   'AddOfficerAddressDetails'
// >;

// const AddOfficerAddressDetails: React.FC = () => {
//   const navigation = useNavigation<AddOfficerAddressDetailsNavigationProp>();
//   const route = useRoute<RouteProp<RootStackParamList, 'AddOfficerAddressDetails'>>();

//   // Rename the destructured `formData` from route.params to avoid conflict
//   const { formData: basicDetails, type, preferredLanguages, jobRole } = route.params;
//   console.log('Basic details:', basicDetails, type, preferredLanguages, jobRole);

//   // State for address details
//   const [formData, setFormData] = useState({
//     houseNumber: '',
//     streetName: '',
//     city: '',
//     country: '',
//     province: '',
//     district: '',
//     accountHolderName: '',
//     accountNumber: '',
//     confirmAccountNumber: '',
//     bankName: '',
//     branchName: '',

//   });
//   const [countries, setCountries] = useState<{ name: string; dial_code: string; code: string }[]>([]);
//   const [error, setError] = useState("");
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [loading, setLoading] = useState(false);

//   const handleValidation = (key: string, value: string) => {
//     setFormData((prevState) => {
//       const updatedFormData = { ...prevState, [key]: value };
//       const { accountNumber, confirmAccountNumber } = updatedFormData;

//       if (accountNumber && confirmAccountNumber && accountNumber !== confirmAccountNumber) {
//         setError("Account numbers do not match.");
//       } else {
//         setError(""); // Clear the error if they match
//       }

//       return updatedFormData;
//     });
//   };

//   useEffect(() => {
//     // Load country data from JSON
//     setCountries(countryCodes);
//   }, []);

//   const handleSubmit = async () => {
//     setErrors({}); // Clear previous errors

//     if (
//       !formData.houseNumber ||
//       !formData.streetName ||
//       !formData.city ||
//       !formData.country ||
//       !formData.accountHolderName ||
//       !formData.accountNumber ||
//       !formData.confirmAccountNumber ||
//       !formData.bankName

//     ) {
//       Alert.alert('Error', 'Please fill in all required fields.');
//       return;
//     }

//     if (formData.accountNumber !== formData.confirmAccountNumber) {
//       Alert.alert('Error', 'Account numbers do not match.');
//       return;
//     }

//     const combinedData = {
//       ...basicDetails,
//       ...formData,
//       jobRole,
//       empType: type,
//       languages: Object.keys(preferredLanguages)
//         .filter((lang) => preferredLanguages[lang as keyof typeof preferredLanguages])
//         .join(', '), // Convert preferred languages to a comma-separated string
//     };

//     try {
//       const token = await AsyncStorage.getItem('token'); // Replace with your actual token logic
//       const response = await axios.post(
//         `${environment.API_BASE_URL}api/collection-manager/collection-officer/add`,
//         combinedData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 201) {
//         Alert.alert('Success', 'Officer created successfully!');
//         navigation.navigate('CollectionOfficersList'); // Navigate back or to another page
//       }
//     } catch (error: any) {
//       console.error('Error submitting officer data:', error);

//       // Handle 400 errors (validation issues)
//       if (error.response && error.response.status === 400) {
//         const serverErrors = error.response.data.error; // Backend sends field-specific error messages
//         if (serverErrors) {
//           if (typeof serverErrors === 'string') {
//             // Display a general error
//             Alert.alert('Error', serverErrors);
//           } else {
//             // Display specific field errors as a combined alert message
//             const errorMessages = Object.values(serverErrors).join('\n');
//             Alert.alert('Validation Errors', errorMessages);
//           }
//         } else {
//           Alert.alert('Error', 'An error occurred while creating the officer.');
//         }
//       } else {
//         Alert.alert('Error', 'An error occurred while creating the officer.');
//       }
//     }
//   };

//   return (
//     <ScrollView className="flex-1 bg-white">
//       {/* Header */}
//       <View className="flex-row items-center px-4 py-4 bg-white shadow-sm">
//         <TouchableOpacity onPress={() => navigation.goBack()} className="pr-4">
//           <AntDesign name="left" size={24} color="#000502" />
//         </TouchableOpacity>
//         <Text className="text-lg font-bold ml-[25%]">Add Officer</Text>
//       </View>

//       {/* Address Details */}
//       <View className="px-8 mt-4">
//         <TextInput
//           placeholder="--House / Plot Number--"
//           value={formData.houseNumber}
//           onChangeText={(text) => setFormData({ ...formData, houseNumber: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//         />
//         <TextInput
//           placeholder="--Street Name--"
//           value={formData.streetName}
//           onChangeText={(text) => setFormData({ ...formData, streetName: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//         />
//         <TextInput
//           placeholder="--City--"
//           value={formData.city}
//           onChangeText={(text) => setFormData({ ...formData, city: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//         />
//         <View className="border border-gray-300 rounded-lg mb-4 ">
//           <Picker
//             selectedValue={formData.country}
//             onValueChange={(value) => setFormData({ ...formData, country: value })}
//             className="text-gray-700 px-2 py-0"
//           >
//             <Picker.Item label="--Country--" value="" />
//             {countries.map((country) => (
//               <Picker.Item key={country.code} label={country.name} value={country.code} />
//             ))}
//           </Picker>
//         </View>

//         <TextInput
//           placeholder="--Province--"
//           value={formData.province}
//           onChangeText={(text) => setFormData({ ...formData, province: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//         />
//         <TextInput
//           placeholder="--District--"
//           value={formData.district}
//           onChangeText={(text) => setFormData({ ...formData, district: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//         />
//       </View>

//       {/* Bank Details */}
//       <View className="px-8 mt-4">
//         <TextInput
//           placeholder="--Account Holder's Name--"
//           value={formData.accountHolderName}
//           onChangeText={(text) => setFormData({ ...formData, accountHolderName: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//         />
//     <View>
//   <TextInput
//     placeholder="--Account Number--"
//     keyboardType="numeric"
//     value={formData.accountNumber}
//     onChangeText={(text) => handleValidation("accountNumber", text)}
//     className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//   />
//   <TextInput
//     placeholder="--Confirm Account Number--"
//     keyboardType="numeric"
//     value={formData.confirmAccountNumber}
//     onChangeText={(text) => handleValidation("confirmAccountNumber", text)}
//     className={`border ${error ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 mb-4 text-gray-700`}
//   />
//   {error ? <Text className="text-red-500 text-sm mb-4">{error}</Text> : null}
// </View>
//         <TextInput
//           placeholder="--Bank Name--"
//           value={formData.bankName}
//           onChangeText={(text) => setFormData({ ...formData, bankName: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//         />
//         <TextInput
//           placeholder="--Branch Name--"
//           value={formData.branchName}
//           onChangeText={(text) => setFormData({ ...formData, branchName: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2"
//         />
//       </View>

//       {/* Buttons */}
//       <View className="flex-row justify-center space-x-4 px-4 mt-8 mb-4">
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           className="bg-gray-300 px-8 py-3 rounded-full"
//         >
//           <Text className="text-gray-800 text-center">Go Back</Text>
//         </TouchableOpacity>
//         {/* <TouchableOpacity
//           onPress={handleSubmit}
//           className="bg-green-600 px-8 py-3 rounded-full"
//         >
//           <Text className="text-white text-center">Submit</Text>
//         </TouchableOpacity> */}
//         <TouchableOpacity
//           className={`bg-green-600 px-8 py-3 rounded-full ${
//             loading ? "bg-gray-400 opacity-50" : "bg-[#2AAD7A]"
//           }`}
//           onPress={() => {
//             if (!loading) {
//               setLoading(true); // Disable the button on click
//               handleSubmit(); // Your action function
//             }
//           }}
//           disabled={loading} // Disable button during the operation
//         >
//           {loading ? (
//             <ActivityIndicator color="white" size="small" />
//           ) : (
//             <Text className="text-white text-center">
//               Submit
//             </Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// export default AddOfficerAddressDetails;

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from '../types';
// import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
// import axios from 'axios';
// import environment from '@/environment/environment';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import countryCodes from './countryCodes.json';
// import { Picker } from '@react-native-picker/picker';
// import { ActivityIndicator } from 'react-native';
// import { KeyboardAvoidingView } from 'react-native';
// import { Platform } from 'react-native';

// type AddOfficerAddressDetailsNavigationProp = StackNavigationProp<
//   RootStackParamList,
//   'AddOfficerAddressDetails'
// >;

// const AddOfficerAddressDetails: React.FC = () => {
//   const navigation = useNavigation<AddOfficerAddressDetailsNavigationProp>();
//   const route = useRoute<RouteProp<RootStackParamList, 'AddOfficerAddressDetails'>>();

//   // Rename the destructured `formData` from route.params to avoid conflict
//   const { formData: basicDetails, type, preferredLanguages, jobRole } = route.params;
//   console.log('Basic details:', basicDetails, type, preferredLanguages, jobRole);

//   // State for address details
//   const [formData, setFormData] = useState({
//     houseNumber: '',
//     streetName: '',
//     city: '',
//     country: '',
//     province: '',
//     district: '',
//     accountHolderName: '',
//     accountNumber: '',
//     confirmAccountNumber: '',
//     bankName: '',
//     branchName: '',
//     profileImage: '', // Add a profile image field

//   });
//   const [countries, setCountries] = useState<{ name: string; dial_code: string; code: string }[]>([]);
//   const [error, setError] = useState("");
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [loading, setLoading] = useState(false);

//   const handleValidation = (key: string, value: string) => {
//     setFormData((prevState) => {
//       const updatedFormData = { ...prevState, [key]: value };
//       const { accountNumber, confirmAccountNumber } = updatedFormData;

//       if (accountNumber && confirmAccountNumber && accountNumber !== confirmAccountNumber) {
//         setError("Account numbers do not match.");
//       } else {
//         setError(""); // Clear the error if they match
//       }

//       return updatedFormData;
//     });
//   };

//   useEffect(() => {
//     // Load country data from JSON
//     setCountries(countryCodes);
//   }, []);

//   const handleSubmit = async () => {
//     setErrors({}); // Clear previous errors

//     if (
//       !formData.houseNumber ||
//       !formData.streetName ||
//       !formData.city ||
//       !formData.country ||
//       !formData.accountHolderName ||
//       !formData.accountNumber ||
//       !formData.confirmAccountNumber ||
//       !formData.bankName
//     ) {
//       Alert.alert('Error', 'Please fill in all required fields.');
//       return;
//     }

//     if (formData.accountNumber !== formData.confirmAccountNumber) {
//       Alert.alert('Error', 'Account numbers do not match.');
//       return;
//     }

//     const combinedData = {
//       ...basicDetails,
//       ...formData,
//       jobRole,
//       empType: type,
//       languages: Object.keys(preferredLanguages)
//         .filter((lang) => preferredLanguages[lang as keyof typeof preferredLanguages])
//         .join(', '), // Convert preferred languages to a comma-separated string
//       profileImage: formData.profileImage, // Add the profile image from the form data
//     };

//     try {
//       const token = await AsyncStorage.getItem('token'); // Replace with your actual token logic
//       const response = await axios.post(
//         `${environment.API_BASE_URL}api/collection-manager/collection-officer/add`,
//         combinedData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json', // Ensure it's sending JSON
//           },
//         }
//       );

//       if (response.status === 201) {
//         Alert.alert('Success', 'Officer created successfully!');
//         navigation.navigate('CollectionOfficersList'); // Navigate back or to another page
//       }
//     } catch (error: any) {
//       console.error('Error submitting officer data:', error);

//       // Handle 400 errors (validation issues)
//       if (error.response && error.response.status === 400) {
//         const serverErrors = error.response.data.error; // Backend sends field-specific error messages
//         if (serverErrors) {
//           if (typeof serverErrors === 'string') {
//             // Display a general error
//             Alert.alert('Error', serverErrors);
//           } else {
//             // Display specific field errors as a combined alert message
//             const errorMessages = Object.values(serverErrors).join('\n');
//             Alert.alert('Validation Errors', errorMessages);
//           }
//         } else {
//           Alert.alert('Error', 'An error occurred while creating the officer.');
//         }
//       } else {
//         Alert.alert('Error', 'An error occurred while creating the officer.');
//       }
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//             behavior={Platform.OS ==="ios" ? "padding" : "height"}
//             enabled
//             className="flex-1"
//             >
//     <ScrollView className="flex-1 bg-white">
//       {/* Header */}
//       <View className="flex-row items-center px-4 py-4 bg-white shadow-sm">
//         <TouchableOpacity onPress={() => navigation.goBack()} className="pr-4">
//           <AntDesign name="left" size={24} color="#000502" />
//         </TouchableOpacity>
//         <Text className="text-lg font-bold ml-[25%]">Add Officer</Text>
//       </View>

//       {/* Address Details */}
//       <View className="px-8 mt-4">
//         <TextInput
//           placeholder="--House / Plot Number--"
//           value={formData.houseNumber}
//           onChangeText={(text) => setFormData({ ...formData, houseNumber: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//         />
//         <TextInput
//           placeholder="--Street Name--"
//           value={formData.streetName}
//           onChangeText={(text) => setFormData({ ...formData, streetName: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//         />
//         <TextInput
//           placeholder="--City--"
//           value={formData.city}
//           onChangeText={(text) => setFormData({ ...formData, city: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//         />
//         <View className="border border-gray-300 rounded-lg mb-4 ">
//           <Picker
//             selectedValue={formData.country}
//             onValueChange={(value) => setFormData({ ...formData, country: value })}
//             className="text-gray-700 px-2 py-0"
//           >
//             <Picker.Item label="--Country--" value="" />
//             {countries.map((country) => (
//               <Picker.Item key={country.code} label={country.name} value={country.code} />
//             ))}
//           </Picker>
//         </View>

//         <TextInput
//           placeholder="--Province--"
//           value={formData.province}
//           onChangeText={(text) => setFormData({ ...formData, province: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//         />
//         <TextInput
//           placeholder="--District--"
//           value={formData.district}
//           onChangeText={(text) => setFormData({ ...formData, district: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//         />
//       </View>

//       {/* Bank Details */}
//       <View className="px-8 mt-4">
//         <TextInput
//           placeholder="--Account Holder's Name--"
//           value={formData.accountHolderName}
//           onChangeText={(text) => setFormData({ ...formData, accountHolderName: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//         />
//     <View>
//   <TextInput
//     placeholder="--Account Number--"
//     keyboardType="numeric"
//     value={formData.accountNumber}
//     onChangeText={(text) => handleValidation("accountNumber", text)}
//     className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//   />
//   <TextInput
//     placeholder="--Confirm Account Number--"
//     keyboardType="numeric"
//     value={formData.confirmAccountNumber}
//     onChangeText={(text) => handleValidation("confirmAccountNumber", text)}
//     className={`border ${error ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 mb-4 text-gray-700`}
//   />
//   {error ? <Text className="text-red-500 text-sm mb-4">{error}</Text> : null}
// </View>
//         <TextInput
//           placeholder="--Bank Name--"
//           value={formData.bankName}
//           onChangeText={(text) => setFormData({ ...formData, bankName: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//         />
//         <TextInput
//           placeholder="--Branch Name--"
//           value={formData.branchName}
//           onChangeText={(text) => setFormData({ ...formData, branchName: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2"
//         />
//       </View>

//       {/* Buttons */}
//       <View className="flex-row justify-center space-x-4 px-4 mt-8 mb-4">
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           className="bg-gray-300 px-8 py-3 rounded-full"
//         >
//           <Text className="text-gray-800 text-center">Go Back</Text>
//         </TouchableOpacity>
//         {/* <TouchableOpacity
//           onPress={handleSubmit}
//           className="bg-green-600 px-8 py-3 rounded-full"
//         >
//           <Text className="text-white text-center">Submit</Text>
//         </TouchableOpacity> */}
//           <TouchableOpacity
//           className={`bg-green-600 px-8 py-3 rounded-full ${
//             loading ? "bg-gray-400 opacity-50" : "bg-[#2AAD7A]"
//           }`}
//           onPress={() => {
//             if (!loading) {
//               setLoading(true); // Disable the button on click
//               handleSubmit(); // Your action function
//             }
//           }}
//           disabled={loading} // Disable button during the operation
//         >
//           {loading ? (
//             <ActivityIndicator color="white" size="small" />
//           ) : (
//             <Text className="text-white text-center">
//               Submit
//             </Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// export default AddOfficerAddressDetails;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import environment from "@/environment/environment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from "react-native-vector-icons/AntDesign";
import countryCodes from "./countryCodes.json";
import { SelectList } from "react-native-dropdown-select-list";
import { ActivityIndicator } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";
import bankNames from "../../assets/jsons/banks.json";

type AddOfficerAddressDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddOfficerAddressDetails"
>;

const AddOfficerAddressDetails: React.FC = () => {
  const navigation = useNavigation<AddOfficerAddressDetailsNavigationProp>();
  const route =
    useRoute<RouteProp<RootStackParamList, "AddOfficerAddressDetails">>();

  // Rename the destructured `formData` from route.params to avoid conflict
  const {
    formData: basicDetails,
    type,
    preferredLanguages,
    jobRole,
  } = route.params;
  console.log(
    "Basic details:",
    basicDetails,
    type,
    preferredLanguages,
    jobRole
  );
  const [filteredBranches, setFilteredBranches] = useState<any[]>([]);
  const [bankName, setBankName] = useState<string>("");
  const [branchName, setBranchName] = useState<string>("");

  const [formData, setFormData] = useState({
    houseNumber: "",
    streetName: "",
    city: "",
    country: "Sri Lanka", // Always set to Sri Lanka
    province: "",
    district: "",
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    bankName: "",
    branchName: "",
    profileImage: "",
  });

  console.log(formData);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countries, setCountries] = useState<
    { name: string; dial_code: string; code: string }[]
  >([]);

  // Function to save data to AsyncStorage whenever a field changes
  const saveDataToStorage = async (updatedData: any) => {
    try {
      await AsyncStorage.setItem(
        "officerFormData",
        JSON.stringify(updatedData)
      );
    } catch (error) {
      console.error("Error saving form data:", error);
    }
  };

  // Handle input changes and save to AsyncStorage
  const handleInputChange = (key: string, value: string) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [key]: value };
      saveDataToStorage(updatedData); // Save every time data changes
      return updatedData;
    });
  };

  // Validation for matching account numbers
  const handleValidation = (key: string, value: string) => {
    setFormData((prevState) => {
      const updatedFormData = { ...prevState, [key]: value };
      const { accountNumber, confirmAccountNumber } = updatedFormData;

      if (
        accountNumber &&
        confirmAccountNumber &&
        accountNumber !== confirmAccountNumber
      ) {
        setError("Account numbers do not match.");
      } else {
        setError(""); // Clear error if they match
      }

      saveDataToStorage(updatedFormData); // Ensure data is saved after validation
      return updatedFormData;
    });
  };

  // Load saved data when the component mounts
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("officerFormData");
        if (storedData) {
          setFormData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Error loading form data:", error);
      }
    };

    loadStoredData();
  }, []);

  // Load country data from JSON
  useEffect(() => {
    setCountries(countryCodes); // Assuming countryCodes is preloaded
  }, []);

  // Clear AsyncStorage after successful submission
  const handleSubmit = async () => {
    if (
      !formData.houseNumber ||
      !formData.streetName ||
      !formData.city ||
      !formData.accountHolderName ||
      !formData.accountNumber ||
      !formData.confirmAccountNumber ||
      !formData.bankName
    ) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (formData.accountNumber !== formData.confirmAccountNumber) {
      Alert.alert("Error", "Account numbers do not match.");
      return;
    }

    // Ensure 'Sri Lanka' is set as the country before submitting
    const combinedData = {
      ...basicDetails,
      ...formData,
      jobRole,
      empType: type,
      languages: Object.keys(preferredLanguages)
        .filter(
          (lang) => preferredLanguages[lang as keyof typeof preferredLanguages]
        )
        .join(", "), // Convert preferred languages to a comma-separated string
      profileImage: basicDetails.profileImage || "", // Include the base64 image in the payload
    };

    console.log("Combined data for passing to backend:", combinedData);

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        `${environment.API_BASE_URL}api/collection-manager/collection-officer/add`,
        combinedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Officer created successfully!");
        await AsyncStorage.removeItem("officerFormData"); // Clear saved form data after successful submission
        navigation.navigate("Main", { screen: "CollectionOfficersList" });
      }
    } catch (error) {
      console.error("Error submitting officer data:", error);

      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 400
      ) {
        const serverErrors = error.response.data.error;
        if (serverErrors) {
          if (typeof serverErrors === "string") {
            Alert.alert("Error", serverErrors);
          } else {
            const errorMessages = Object.values(serverErrors).join("\n");
            Alert.alert("Validation Errors", errorMessages);
          }
        } else {
          Alert.alert("Error", "An error occurred while creating the officer.");
        }
      } else {
        Alert.alert("Error", "An error occurred while creating the officer.");
      }
    }
  };

  const jsonData = {
    provinces: [
      {
        name: "Western",
        districts: ["Colombo", "Gampaha", "Kalutara"],
      },
      {
        name: "Central",
        districts: ["Kandy", "Matale", "Nuwara Eliya"],
      },
      {
        name: "Southern",
        districts: ["Galle", "Matara", "Hambantota"],
      },
      {
        name: "Eastern",
        districts: ["Ampara", "Batticaloa", "Trincomalee"],
      },
      {
        name: "Northern",
        districts: ["Jaffna", "Kilinochchi", "Mannar"],
      },
      {
        name: "North Western",
        districts: ["Kurunegala", "Puttalam"],
      },
      {
        name: "North Central",
        districts: ["Anuradhapura", "Polonnaruwa"],
      },
      {
        name: "Uva",
        districts: ["Badulla", "Moneragala"],
      },
      {
        name: "Sabaragamuwa",
        districts: ["Ratnapura", "Kegalle"],
      },
    ],
  };

  const [districts, setDistricts] = useState<string[]>([]);

  // Handle province change
  const handleProvinceChange = (province: string) => {
    setFormData({ ...formData, province, district: "" }); // Clear the district when province changes
    const selectedProvince = jsonData.provinces.find(
      (p) => p.name === province
    );
    if (selectedProvince) {
      setDistricts(selectedProvince.districts);
    }
  };

  useEffect(() => {
    if (bankName) {
      const selectedBank = bankNames.find((bank) => bank.name === bankName);
      if (selectedBank) {
        try {
          const data = require("../../assets/jsons/branches.json");
          const filteredBranches = data[selectedBank.ID] || [];

          const sortedBranches = filteredBranches.sort(
            (a: { name: string }, b: { name: any }) =>
              a.name.localeCompare(b.name)
          );

          setFilteredBranches(sortedBranches);
        } catch (error) {
          console.error("Error loading branches", error);
        } finally {
          setLoading(false);
        }
      } else {
        setFilteredBranches([]);
      }
    } else {
      setFilteredBranches([]);
    }
  }, [bankName]);

  const handleBankSelection = (selectedBank: string) => {
    setBankName(selectedBank);
    setFormData((prevData) => {
      const updatedData = { ...prevData, bankName: selectedBank }; // Update the form data with new bankName
      saveDataToStorage(updatedData); // Save every time bank name changes
      return updatedData;
    });
  };

  const handleBranchSelection = (selectedBranch: string) => {
    setBranchName(selectedBranch);
    setFormData((prevData) => {
      const updatedData = { ...prevData, branchName: selectedBranch }; // Update the form data with new branchName
      saveDataToStorage(updatedData); // Save every time branch name changes
      return updatedData;
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-white"
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-4 bg-white shadow-sm">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="pr-4"
          >
            <AntDesign name="left" size={24} color="#000502" />
          </TouchableOpacity>
          <Text className="text-lg font-bold ml-[25%]">Add Officer</Text>
        </View>

        {/* Address Details */}
        <View className="px-8 mt-4">
          <TextInput
            placeholder="--House / Plot Number--"
            value={formData.houseNumber}
            onChangeText={(text) =>
              setFormData({ ...formData, houseNumber: text })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          />
          <TextInput
            placeholder="--Street Name--"
            value={formData.streetName}
            onChangeText={(text) =>
              setFormData({ ...formData, streetName: text })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          />
          <TextInput
            placeholder="--City--"
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          />
          <TextInput
            placeholder="--Country--"
            value="Sri Lanka" // Always set to Sri Lanka
            editable={false} // Make the input non-editable
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          />

          {/* <TextInput
          placeholder="--Province--"
          value={formData.province}
          onChangeText={(text) => setFormData({ ...formData, province: text })}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
        />
        <TextInput
          placeholder="--District--"
          value={formData.district}
          onChangeText={(text) => setFormData({ ...formData, district: text })}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
        /> */}

          <View style={{ marginBottom: 10 }}>
            {/* <Text style={{ fontSize: 18, marginBottom: 5 }}>Select Province</Text> */}
            <SelectList
              setSelected={(province: any) => handleProvinceChange(province)}
              data={jsonData.provinces.map((province) => ({
                key: province.name,
                value: province.name,
              }))}
              defaultOption={{
                key: formData.province,
                value: formData.province,
              }}
              boxStyles={{
                borderColor: "#cccccc",
                borderWidth: 1,
                borderRadius: 5,
                padding: 10,
                paddingLeft: 15,
                paddingRight: 15,
              }}
              dropdownStyles={{
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "#cccccc",
              }}
              search={true}
              placeholder="Select Province"
            />
          </View>

          {/* District Dropdown */}
          {formData.province && (
            <View style={{ marginBottom: 2 }}>
              {/* <Text style={{ fontSize: 18, marginBottom: 5 }}>Select District</Text> */}
              <SelectList
                setSelected={(district: any) =>
                  setFormData({ ...formData, district })
                }
                data={districts.map((district) => ({
                  key: district,
                  value: district,
                }))}
                defaultOption={{
                  key: formData.district,
                  value: formData.district,
                }}
                boxStyles={{
                  borderColor: "#cccccc",
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 10,
                  paddingLeft: 15,
                  paddingRight: 15,
                }}
                dropdownStyles={{
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: "#cccccc",
                }}
                search={true}
                placeholder="Select District"
              />
            </View>
          )}
        </View>

        {/* Bank Details */}
        <View className="px-8 mt-4">
          <TextInput
            placeholder="--Account Holder's Name--"
            value={formData.accountHolderName}
            onChangeText={(text) =>
              handleInputChange("accountHolderName", text)
            }
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          />
          <TextInput
            placeholder="--Account Number--"
            keyboardType="numeric"
            value={formData.accountNumber}
            onChangeText={(text) => handleValidation("accountNumber", text)}
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          />
          <TextInput
            placeholder="--Confirm Account Number--"
            keyboardType="numeric"
            value={formData.confirmAccountNumber}
            onChangeText={(text) =>
              handleValidation("confirmAccountNumber", text)
            }
            className={`border ${error ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 mb-4 text-gray-700`}
          />
          {error && <Text className="text-red-500 text-sm mb-4">{error}</Text>}

          {/* <TextInput
            placeholder="--Bank Name--"
            value={formData.bankName}
            onChangeText={(text) => handleInputChange('bankName', text)}
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          /> 

          <TextInput
            placeholder="--Branch Name--"
            value={formData.branchName}
            onChangeText={(text) => handleInputChange('branchName', text)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          />  */}
          <View className="">
            <View className="mb-4">
              <SelectList
                setSelected={handleBankSelection} // Handle bank selection
                data={bankNames.map((bank) => ({
                  key: bank.name, // Bank name as key
                  value: bank.name, // Display name in dropdown
                }))}
                defaultOption={{
                  key: formData.bankName,
                  value: formData.bankName,
                }}
                placeholder="--Bank Name--"
                boxStyles={{
                  borderColor: "#cccccc",
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 10,
                  paddingLeft: 15,
                  paddingRight: 15,
                }}
                dropdownStyles={{
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: "#cccccc",
                }}
                search={true}
              />
            </View>
            <View>
              {filteredBranches.length > 0 && (
                <SelectList
                  setSelected={handleBranchSelection} // Handle branch selection
                  data={filteredBranches.map((branch) => ({
                    key: branch.name, // Branch name as key
                    value: branch.name, // Display branch name in dropdown
                  }))}
                  defaultOption={{
                    key: formData.branchName,
                    value: formData.branchName,
                  }}
                  placeholder="--Branch Name--"
                  boxStyles={{
                    borderColor: "#cccccc",
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 10,
                    paddingLeft: 15,
                    paddingRight: 15,
                  }}
                  dropdownStyles={{
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: "#cccccc",
                  }}
                  search={true}
                />
              )}
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View className="flex-row justify-center space-x-4 px-4 mt-8 mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-gray-300 px-8 py-3 rounded-full"
          >
            <Text className="text-gray-800 text-center">Go Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-green-600 px-8 py-3 rounded-full"
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-white text-center">Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddOfficerAddressDetails;
