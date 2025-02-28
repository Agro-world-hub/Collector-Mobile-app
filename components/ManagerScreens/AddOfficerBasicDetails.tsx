// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   Alert,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import axios from 'axios';
// import { Ionicons } from '@expo/vector-icons';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from '../types';
// import { useNavigation } from '@react-navigation/native';
// import { OfficerBasicDetailsFormData } from '../types'; 
// import environment from '@/environment/environment';
// import countryCodes from './countryCodes.json';
// import AntDesign from 'react-native-vector-icons/AntDesign';

// type AddOfficerBasicDetailsNavigationProp = StackNavigationProp<
//   RootStackParamList,
//   'AddOfficerBasicDetails'
// >;

// const AddOfficerBasicDetails: React.FC = () => {
//   const navigation = useNavigation<AddOfficerBasicDetailsNavigationProp>();

//   const [type, setType] = useState<'Permanent' | 'Temporary'>('Permanent');
//   const [preferredLanguages, setPreferredLanguages] = useState({
//     Sinhala: false,
//     English: false,
//     Tamil: false,
//   });
//   const [jobRole, setJobRole] = useState<string>('Select Job Role');
//   const [phoneCode1, setPhoneCode1] = useState<string>('+94'); // Default Sri Lanka calling code
//   const [phoneCode2, setPhoneCode2] = useState<string>('+94'); // Default Sri Lanka calling code
//   const [phoneNumber1, setPhoneNumber1] = useState('');
//   const [phoneNumber2, setPhoneNumber2] = useState('');


//   const [formData, setFormData] = useState<OfficerBasicDetailsFormData>({
//     userId: '',
//     firstNameEnglish: '',
//     lastNameEnglish: '',
//     firstNameSinhala: '',
//     lastNameSinhala: '',
//     firstNameTamil: '',
//     lastNameTamil: '',
//     nicNumber: '',
//     email: '',
//   });

//   const toggleLanguage = (language: keyof typeof preferredLanguages) => {
//     setPreferredLanguages((prev) => ({
//       ...prev,
//       [language]: !prev[language],
//     }));
//   };
  

//   const fetchEmpId = async (role: string) => {
//     console.log('Fetching empId for role:', role);
//     try {
//       const response = await axios.get(
//         `${environment.API_BASE_URL}api/collection-manager/generate-empId/${role}`
//       );
//       if (response.data.status) {
//         setFormData((prev) => ({
//           ...prev,
//           userId: response.data.result.empId, // Automatically set empId
//         }));
//       }
//       console.log('EmpId:', response.data.result.empId);
//     } catch (error) {
//       console.error('Error fetching empId:', error);
//       Alert.alert('Error', 'Failed to fetch employee ID');
//     }
//   };

//   const handleJobRoleChange = (role: string) => {
//     setJobRole(role);
//     if (role !== 'Select Job Role') {
//       fetchEmpId(role); // Fetch empId based on the selected role
//     }
//   };

//   const handleNext = () => {
//     if (
//       !formData.userId ||
//       !formData.firstNameEnglish ||
//       !formData.lastNameEnglish ||
//       !phoneNumber1 || // Ensure phone number 1 is provided
//       !formData.nicNumber ||
//       !formData.email
//     ) {
//       Alert.alert('Error', 'Please fill in all required fields.');
//       return;
//     }
  
//     // Update formData with separate phone codes and numbers
//     const updatedFormData = {
//       ...formData,
//       phoneCode1: phoneCode1,
//       phoneNumber1: phoneNumber1,
//       phoneCode2: phoneCode2,
//       phoneNumber2: phoneNumber2,
//     };
  
//     console.log('Form Data:', updatedFormData, preferredLanguages, type, jobRole);
  
//     const prefixedUserId =
//     jobRole === 'Collection Officer' ? `COO${formData.userId}` : formData.userId;
  
  
//     // Navigate to the next screen with the updated data
//     navigation.navigate('AddOfficerAddressDetails', {
//       formData: { ...updatedFormData, userId: prefixedUserId },
//       type,
//       preferredLanguages,
//       jobRole,
//     });
//   };
  
  
//   return (
//     <ScrollView className="flex-1 bg-white">
//       {/* Header */}
//       <View className="flex-row items-center px-4 py-4 bg-white shadow-sm">
//         <TouchableOpacity onPress={() => navigation.goBack()} className="pr-4">
//            <AntDesign name="left" size={24} color="#000502" />
//         </TouchableOpacity>
//         <Text className="text-lg font-bold ml-[25%]">Add Officer</Text>
//       </View>

//       {/* Profile Avatar */}
//       <View className="justify-center items-center my-4 relative">
//         {/* Profile Image */}
//         <Image
//           source={require('../../assets/images/user1.png')}
//           className="w-24 h-24 rounded-full"
//         />

//         {/* Edit Icon (Pen Icon) */}
//         <TouchableOpacity
//           className="absolute bottom-0 right-4 bg-[#3980C0] p-1 rounded-full mr-[35%] shadow-md"
//           style={{
//             elevation: 5, // For shadow effect
//           }}
//         >
//           <Ionicons name="pencil" size={18} color="white" />
//         </TouchableOpacity>
//       </View>


//       {/* Type Selector */}
//       <View className="px-8 flex-row items-center mb-4 ">
//         <Text className="font-semibold text-sm mr-4">Type:</Text>
//         <TouchableOpacity
//           className="flex-row items-center mr-6"
//           onPress={() => setType('Permanent')}
//         >
//           <Ionicons
//             name={type === 'Permanent' ? 'radio-button-on' : 'radio-button-off'}
//             size={20}
//             color="#0021F5"
//           />
//           <Text className="ml-2 text-gray-700">Permanent</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           className="flex-row items-center"
//           onPress={() => setType('Temporary')}
//         >
//           <Ionicons
//             name={type === 'Temporary' ? 'radio-button-on' : 'radio-button-off'}
//             size={20}
//             color="#0021F5"
//           />
//           <Text className="ml-2 text-gray-700">Temporary</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Preferred Languages */}
//       <View className="px-8 mb-4">
//         <Text className="font-semibold text-sm mb-2">Preferred Languages:</Text>
//         <View className="flex-row items-center">
//           {['Sinhala', 'English', 'Tamil'].map((lang) => (
//             <TouchableOpacity
//               key={lang}
//               className="flex-row items-center mr-6"
//               onPress={() => toggleLanguage(lang as keyof typeof preferredLanguages)}
//             >
//               <Ionicons
//                 name={
//                   preferredLanguages[lang as keyof typeof preferredLanguages]
//                     ? 'checkbox'
//                     : 'square-outline'
//                 }
//                 size={20}
//                 color="#0021F5"
//               />
//               <Text className="ml-2 text-gray-700">{lang}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* Input Fields */}
//       <View className="px-8">
//        {/* Job Role Dropdown */}
//        <View className="pb-2 mb-4">
//         <Text className="font-semibold text-sm mb-2">Job Role:</Text>
//         <View className="border border-gray-300 rounded-lg pb-3">
//           <Picker
//             selectedValue={jobRole}
//             onValueChange={(itemValue) => handleJobRoleChange(itemValue)}
//             style={{ height: 50, width: '100%' }}
//           >
//             <Picker.Item label="--Select Job Role--" value="Select Job Role" />
//             <Picker.Item label="Manager" value="Manager" />
//             <Picker.Item label="Supervisor" value="Supervisor" />
//             <Picker.Item label="Collection Officer" value="Collection Officer" />
//           </Picker>
//         </View>
//       </View>

   
//       {/* User ID Field */}
//       <View className="flex-row items-center border border-gray-300 rounded-lg mb-4 bg-gray-100">
//         {/* Prefix (30% width) */}
//         <View
//           className="bg-gray-300 justify-center items-center"
//           style={{
//             flex: 3,
//             height: 40, // Set the height to match the TextInput field
//           }}
//         >
//           <Text className="text-gray-700 text-center">
//             {jobRole === 'Collection Officer' ? 'COO' : ''}
//           </Text>
//         </View>

//         {/* User ID (remaining 70% width) */}
//         <View style={{ flex: 7 }}>
//           <TextInput
//             placeholder="--User ID--"
//             value={formData.userId}
//             editable={false} // Make this field read-only
//             className="px-3 py-2 text-gray-700 bg-gray-100"
//             style={{
//               height: 40, // Ensure the height matches the grey part
//             }}
//           />
//         </View>
//       </View>

//         <TextInput
//           placeholder="--First Name in English--"
//           value={formData.firstNameEnglish}
//           onChangeText={(text) => setFormData({ ...formData, firstNameEnglish: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//         />
//         <TextInput
//           placeholder="--Last Name in English--"
//           value={formData.lastNameEnglish}
//           onChangeText={(text) => setFormData({ ...formData, lastNameEnglish: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//         />
//         <TextInput
//           placeholder="--First Name in Sinhala--"
//           value={formData.firstNameSinhala}
//           onChangeText={(text) => setFormData({ ...formData, firstNameSinhala: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//         />
//         <TextInput
//           placeholder="--Last Name in Sinhala--"
//           value={formData.lastNameSinhala}
//           onChangeText={(text) => setFormData({ ...formData, lastNameSinhala: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//         />
//         <TextInput
//           placeholder="--First Name in Tamil--"
//           value={formData.firstNameTamil}
//           onChangeText={(text) => setFormData({ ...formData, firstNameTamil: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//         />
//         <TextInput
//           placeholder="--Last Name in Tamil--"
//           value={formData.lastNameTamil}
//           onChangeText={(text) => setFormData({ ...formData, lastNameTamil: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//         />


//            {/* Phone Number 1 */}
// <View className="mb-4">
//   {/* Phone Number 1 */}
//   <View className="flex-row items-center border border-gray-300 rounded-lg">
//     <View style={{ flex: 4, alignItems: 'center' }}>
//       <Picker
//         selectedValue={phoneCode1}
//         onValueChange={(itemValue) => setPhoneCode1(itemValue)}
//         style={{
//           width: '100%',
//         }}
//       >
//         {countryCodes.map((country) => (
//           <Picker.Item
//             key={country.code}
//             label={`${country.code} (${country.dial_code})`}
//             value={country.dial_code}
//           />
//         ))}
//       </Picker>
//     </View>
//     <View style={{ flex: 7 }}>
//       <TextInput
//         placeholder="--Phone Number 1--"
//         keyboardType="phone-pad"
//         value={phoneNumber1}
//         onChangeText={setPhoneNumber1}
//         className="px-3 py-2 text-gray-700"
//       />
//     </View>
//   </View>
// </View>

// {/* Phone Number 2 */}
// <View className="mb-4">
//   <View className="flex-row items-center border border-gray-300 rounded-lg">
//     <View style={{ flex: 4, alignItems: 'center' }}>
//       <Picker
//         selectedValue={phoneCode2}
//         onValueChange={(itemValue) => setPhoneCode2(itemValue)}
//         style={{
//           width: '100%',
//         }}
//       >
//         {countryCodes.map((country) => (
//           <Picker.Item
//             key={country.code}
//             label={`${country.code} (${country.dial_code})`}
//             value={country.dial_code}
//           />
//         ))}
//       </Picker>
//     </View>
//     <View style={{ flex: 7 }}>
//       <TextInput
//         placeholder="--Phone Number 2--"
//         keyboardType="phone-pad"
//         value={phoneNumber2}
//         onChangeText={setPhoneNumber2}
//         className="px-3 py-2 text-gray-700"
//       />
//     </View>
//   </View>
// </View>

     

//         <TextInput
//           placeholder="--NIC Number--"
//           value={formData.nicNumber}
//           onChangeText={(text) => setFormData({ ...formData, nicNumber: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
//         />
//         <TextInput
//           placeholder="--Email Address--"
//           value={formData.email}
//           onChangeText={(text) => setFormData({ ...formData, email: text })}
//           className="border border-gray-300 rounded-lg px-3 py-2"
//         />
//       </View>

//       {/* Buttons */}
//       <View className="flex-row justify-center space-x-4 px-4 mt-8 mb-4">
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           className="bg-gray-300 px-8 py-3 rounded-full"
//         >
//           <Text className="text-gray-800 text-center">Cancel</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={handleNext}
//           className="bg-[#2AAD7A] px-8 py-3 rounded-full"
//         >
//           <Text className="text-white text-center">Next</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// export default AddOfficerBasicDetails;
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useNavigation } from '@react-navigation/native';
import { OfficerBasicDetailsFormData } from '../types'; 
import environment from '@/environment/environment';
import countryCodes from './countryCodes.json';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import { SelectList } from 'react-native-dropdown-select-list';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SelectList } from "react-native-dropdown-select-list";

type AddOfficerBasicDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddOfficerBasicDetails'
>;

const AddOfficerBasicDetails: React.FC = () => {
  const navigation = useNavigation<AddOfficerBasicDetailsNavigationProp>();

  const [type, setType] = useState<'Permanent' | 'Temporary'>('Permanent');
  const [preferredLanguages, setPreferredLanguages] = useState({
    Sinhala: false,
    English: false,
    Tamil: false,
  });
  const [jobRole, setJobRole] = useState<string>('Select Job Role');
  const [phoneCode1, setPhoneCode1] = useState<string>('+94'); // Default Sri Lanka calling code
  const [phoneCode2, setPhoneCode2] = useState<string>('+94'); // Default Sri Lanka calling code
  const [phoneNumber1, setPhoneNumber1] = useState('');
  const [phoneNumber2, setPhoneNumber2] = useState('');
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);


  const [formData, setFormData] = useState<OfficerBasicDetailsFormData>({
    userId: '',
    firstNameEnglish: '',
    lastNameEnglish: '',
    firstNameSinhala: '',
    lastNameSinhala: '',
    firstNameTamil: '',
    lastNameTamil: '',
    nicNumber: '',
    email: '',
    profileImage: '',
    jobRole: '',
  });

  const toggleLanguage = (language: keyof typeof preferredLanguages) => {
    setPreferredLanguages((prev) => ({
      ...prev,
      [language]: !prev[language],
    }));
  };
  

  const fetchEmpId = async (role: string) => {
    console.log('Fetching empId for role:', role);
    try {
      const response = await axios.get(
        `${environment.API_BASE_URL}api/collection-manager/generate-empId/${role}`
      );
      if (response.data.status) {
        setFormData((prev) => ({
          ...prev,
          userId: response.data.result.empId, // Automatically set empId
        }));
      }
      console.log('EmpId:', response.data.result.empId);
    } catch (error) {
      console.error('Error fetching empId:', error);
      Alert.alert('Error', 'Failed to fetch employee ID');
    }
  };

  const handleJobRoleChange = (role: string) => {
    setJobRole(role);
    if (role !== 'Select Job Role') {
      fetchEmpId(role); // Fetch empId based on the selected role
    }
  };

  const handleImagePick = async () => {
    // Request for camera roll permission if not granted
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'You need to grant camera roll permissions to select an image');
      return;
    }

    // Pick the image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true, // Ensure base64 data is returned
    });

    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        if (result.assets[0].base64) {
          setSelectedImage(result.assets[0].base64); // Set base64 image data
        }
      }
    }
  };

  const clearFormData = async () => {
    try {
      await AsyncStorage.removeItem('AddOfficerFormData');
    } catch (error) {
      console.error("Error clearing form data:", error);
    }
  };
  
  

  // const handleNext = () => {
  //   if (
  //     !formData.userId ||
  //     !formData.firstNameEnglish ||
  //     !formData.lastNameEnglish ||
  //     !phoneNumber1 || // Ensure phone number 1 is provided
  //     !formData.nicNumber ||
  //     !formData.email
  //   ) {
  //     Alert.alert('Error', 'Please fill in all required fields.');
  //     return;
  //   }

  //   // Update formData with separate phone codes and numbers
  //   const updatedFormData = {
  //     ...formData,
  //     phoneCode1: phoneCode1,
  //     phoneNumber1: phoneNumber1,
  //     phoneCode2: phoneCode2,
  //     phoneNumber2: phoneNumber2,
  //   };

  //   // Add the base64 image to formData
  //   updatedFormData.profileImage = selectedImage || '';

  //   console.log('Form Data:', updatedFormData, preferredLanguages, type, jobRole);

  //   const prefixedUserId =
  //     jobRole === 'Collection Officer' ? `COO${formData.userId}` : formData.userId;

  //   // Navigate to the next screen with the updated data
  //   navigation.navigate('AddOfficerAddressDetails', {
  //     formData: { ...updatedFormData, userId: prefixedUserId },
  //     type,
  //     preferredLanguages,
  //     jobRole,
  //   });
  // };
  
  const handleNext = () => {
    if (
      !formData.userId ||
      !formData.firstNameEnglish ||
      !formData.lastNameEnglish ||
      !phoneNumber1 || // Ensure phone number 1 is provided
      !formData.nicNumber ||
      !formData.email
    ) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
  
    // Update formData with separate phone codes and numbers
    const updatedFormData = {
      ...formData,
      phoneCode1: phoneCode1,
      phoneNumber1: phoneNumber1,
      phoneCode2: phoneCode2,
      phoneNumber2: phoneNumber2,
    };
  
    // Set the profileImage to an empty string if no image was picked
    updatedFormData.profileImage = selectedImage || '';
  
    console.log('Form Data:', updatedFormData, preferredLanguages, type, jobRole);
  
    const prefixedUserId =
      jobRole === 'Collection Officer' ? `COO${formData.userId}` : formData.userId;
  
    // Navigate to the next screen with the updated data
    navigation.navigate('AddOfficerAddressDetails', {
      formData: { ...updatedFormData, userId: prefixedUserId },
      type,
      preferredLanguages,
      jobRole,
    });
  };
  
  const [error1, setError1] = useState('');
  const [error2, setError2] = useState('');
  
  
  // Validation function for phone numbers
  const validatePhoneNumber = (input: string) => /^[0-9]{9}$/.test(input)

  // Handle phone number 1 change
  const handlePhoneNumber1Change = (input: string) => {
    setPhoneNumber1(input);
    if (!validatePhoneNumber(input)) {
      setError1('Phone number 1 must be 9 digits.');
    } else {
      setError1('');
    }
  };

  // Handle phone number 2 change
  const handlePhoneNumber2Change = (input: string) => {
    setPhoneNumber2(input);
    if (!validatePhoneNumber(input)) {
      setError2('Phone number 2 must be 9 digits.');
    } else {
      setError2('');
    }
  };
  
  const jobRoles = [
    { key: "1", value: "Select Job Role" },
    { key: "2", value: "Collection Officer" },
    // Add more roles as necessary
  ];
  
  return (
      <KeyboardAvoidingView 
        behavior={Platform.OS ==="ios" ? "padding" : "height"}
        enabled
        className="flex-1"
        >
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white shadow-sm">
        {/* <TouchableOpacity onPress={() => navigation.goBack()} className="pr-4">
           <AntDesign name="left" size={24} color="#000502" />
        </TouchableOpacity> */}
       <TouchableOpacity
  onPress={async () => {
    try {
      await AsyncStorage.removeItem('officerFormData'); // Clear stored data
      navigation.goBack();
    } catch (error) {
      console.error("Error clearing form data:", error);
    }
  }}
  className="pr-4"
>
  <AntDesign name="left" size={24} color="#000502" />
</TouchableOpacity>


        <Text className="text-lg font-bold ml-[25%]">Add Officer</Text>
      </View>

      {/* Profile Avatar */}
      <View className="justify-center items-center my-4 relative">
      {/* Profile Image */}
      <Image
        source={selectedImage ? { uri: `data:image/png;base64,${selectedImage}` } : require('../../assets/images/user1.png')}
        className="w-24 h-24 rounded-full"
      />

      {/* Edit Icon (Pen Icon) */}
      <TouchableOpacity
        onPress={handleImagePick} // Handle the image picking
        className="absolute bottom-0 right-4 bg-[#3980C0] p-1 rounded-full mr-[35%] shadow-md"
        style={{
          elevation: 5, // For shadow effect
        }}
      >
        <Ionicons name="pencil" size={18} color="white" />
      </TouchableOpacity>
    </View>



      {/* Type Selector */}
      <View className="px-8 flex-row items-center mb-4 ">
        <Text className="font-semibold text-sm mr-4">Type:</Text>
        <TouchableOpacity
          className="flex-row items-center mr-6"
          onPress={() => setType('Permanent')}
        >
          <Ionicons
            name={type === 'Permanent' ? 'radio-button-on' : 'radio-button-off'}
            size={20}
            color="#0021F5"
          />
          <Text className="ml-2 text-gray-700">Permanent</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => setType('Temporary')}
        >
          <Ionicons
            name={type === 'Temporary' ? 'radio-button-on' : 'radio-button-off'}
            size={20}
            color="#0021F5"
          />
          <Text className="ml-2 text-gray-700">Temporary</Text>
        </TouchableOpacity>
      </View>

      {/* Preferred Languages */}
      <View className="px-8 mb-4">
        <Text className="font-semibold text-sm mb-2">Preferred Languages:</Text>
        <View className="flex-row items-center">
          {['Sinhala', 'English', 'Tamil'].map((lang) => (
            <TouchableOpacity
              key={lang}
              className="flex-row items-center mr-6"
              onPress={() => toggleLanguage(lang as keyof typeof preferredLanguages)}
            >
              <Ionicons
                name={
                  preferredLanguages[lang as keyof typeof preferredLanguages]
                    ? 'checkbox'
                    : 'square-outline'
                }
                size={20}
                color="#0021F5"
              />
              <Text className="ml-2 text-gray-700">{lang}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Input Fields */}
      <View className="px-8">
       {/* Job Role Dropdown */}
       <View className="pb-2 mb-4">
          <Text className="font-semibold text-sm mb-2">Job Role:</Text>
          <View className="border border-gray-300 rounded-lg pb-3">
            <SelectList
              setSelected={handleJobRoleChange}
              data={jobRoles}
              save="value"
              defaultOption={{
                key: "1",
                value: formData.jobRole || "Select Job Role",
              }}
              boxStyles={{
                height: 40,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                paddingLeft: 10,
              }}
              dropdownStyles={{ backgroundColor: "white", borderRadius: 5 }}
            />
          </View>
        </View>

   
      {/* User ID Field */}
      <View className="flex-row items-center border border-gray-300 rounded-lg mb-4 bg-gray-100">
        {/* Prefix (30% width) */}
        <View
          className="bg-gray-300 justify-center items-center"
          style={{
            flex: 3,
            height: 40, // Set the height to match the TextInput field
          }}
        >
          <Text className="text-gray-700 text-center">
            {jobRole === 'Collection Officer' ? 'COO' : ''}
          </Text>
        </View>

        {/* User ID (remaining 70% width) */}
        <View style={{ flex: 7 }}>
          <TextInput
            placeholder="--User ID--"
            value={formData.userId}
            editable={false} // Make this field read-only
            className="px-3 py-2 text-gray-700 bg-gray-100"
            style={{
              height: 40, // Ensure the height matches the grey part
            }}
          />
        </View>
      </View>

        <TextInput
          placeholder="--First Name in English--"
          value={formData.firstNameEnglish}
          onChangeText={(text) => setFormData({ ...formData, firstNameEnglish: text })}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
        />
        <TextInput
          placeholder="--Last Name in English--"
          value={formData.lastNameEnglish}
          onChangeText={(text) => setFormData({ ...formData, lastNameEnglish: text })}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
        />
        <TextInput
          placeholder="--First Name in Sinhala--"
          value={formData.firstNameSinhala}
          onChangeText={(text) => setFormData({ ...formData, firstNameSinhala: text })}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
        />
        <TextInput
          placeholder="--Last Name in Sinhala--"
          value={formData.lastNameSinhala}
          onChangeText={(text) => setFormData({ ...formData, lastNameSinhala: text })}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
        />
        <TextInput
          placeholder="--First Name in Tamil--"
          value={formData.firstNameTamil}
          onChangeText={(text) => setFormData({ ...formData, firstNameTamil: text })}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
        />
        <TextInput
          placeholder="--Last Name in Tamil--"
          value={formData.lastNameTamil}
          onChangeText={(text) => setFormData({ ...formData, lastNameTamil: text })}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
        />


           {/* Phone Number 1 */}
           <View className="mb-4">
        <View className="flex-row items-center border border-gray-300 rounded-lg">
          <View style={{ flex: 4, alignItems: 'center' }}>
            <Picker
              selectedValue={phoneCode1}
              onValueChange={(itemValue) => setPhoneCode1(itemValue)}
              style={{ width: '100%' }}
            >
              {countryCodes.map((country) => (
                <Picker.Item
                  key={country.code}
                  label={`${country.code} (${country.dial_code})`}
                  value={country.dial_code}
                />
              ))}
            </Picker>
          </View>
          <View style={{ flex: 7 }}>
            <TextInput
              placeholder="--Phone Number 1--"
              keyboardType="phone-pad"
              value={phoneNumber1}
              onChangeText={handlePhoneNumber1Change}
              className="px-3 py-2 text-gray-700"
            />
           
          </View>
        </View>
        {error1 ? <Text style={{ color: 'red' }}>{error1}</Text> : null}
      </View>

      {/* Phone Number 2 */}
      <View className="mb-4">
        <View className="flex-row items-center border border-gray-300 rounded-lg">
          <View style={{ flex: 4, alignItems: 'center' }}>
            <Picker
              selectedValue={phoneCode2}
              onValueChange={(itemValue) => setPhoneCode2(itemValue)}
              style={{ width: '100%' }}
            >
              {countryCodes.map((country) => (
                <Picker.Item
                  key={country.code}
                  label={`${country.code} (${country.dial_code})`}
                  value={country.dial_code}
                />
              ))}
            </Picker>
          </View>
          <View style={{ flex: 7 }}>
            <TextInput
              placeholder="--Phone Number 2--"
              keyboardType="phone-pad"
              value={phoneNumber2}
              onChangeText={handlePhoneNumber2Change}
              className="px-3 py-2 text-gray-700"
            />
           
          </View>
          
        </View>
        {error2 ? <Text style={{ color: 'red' }}>{error2}</Text> : null}
      </View>

     

        <TextInput
          placeholder="--NIC Number--"
          value={formData.nicNumber}
          onChangeText={(text) => setFormData({ ...formData, nicNumber: text })}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
        />
        <TextInput
          placeholder="--Email Address--"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          className="border border-gray-300 rounded-lg px-3 py-2"
        />
      </View>

      {/* Buttons */}
      <View className="flex-row justify-center space-x-4 px-4 mt-8 mb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-gray-300 px-8 py-3 rounded-full"
        >
          <Text className="text-gray-800 text-center">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          className="bg-[#2AAD7A] px-8 py-3 rounded-full"
        >
          <Text className="text-white text-center">Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddOfficerBasicDetails;
