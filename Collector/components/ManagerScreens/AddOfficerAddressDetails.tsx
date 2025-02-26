import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import environment from '@/environment/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import countryCodes from './countryCodes.json';
import { Picker } from '@react-native-picker/picker';
import { ActivityIndicator } from 'react-native';

type AddOfficerAddressDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddOfficerAddressDetails'
>;

const AddOfficerAddressDetails: React.FC = () => {
  const navigation = useNavigation<AddOfficerAddressDetailsNavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'AddOfficerAddressDetails'>>();

  // Rename the destructured `formData` from route.params to avoid conflict
  const { formData: basicDetails, type, preferredLanguages, jobRole } = route.params;
  console.log('Basic details:', basicDetails, type, preferredLanguages, jobRole);

  // State for address details
  const [formData, setFormData] = useState({
    houseNumber: '',
    streetName: '',
    city: '',
    country: '',
    province: '',
    district: '',
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    bankName: '',
    branchName: '',

  });
  const [countries, setCountries] = useState<{ name: string; dial_code: string; code: string }[]>([]);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const handleValidation = (key: string, value: string) => {
    setFormData((prevState) => {
      const updatedFormData = { ...prevState, [key]: value };
      const { accountNumber, confirmAccountNumber } = updatedFormData;
  
      if (accountNumber && confirmAccountNumber && accountNumber !== confirmAccountNumber) {
        setError("Account numbers do not match.");
      } else {
        setError(""); // Clear the error if they match
      }
  
      return updatedFormData;
    });
  };
  
  
  useEffect(() => {
    // Load country data from JSON
    setCountries(countryCodes);
  }, []);
  
  const handleSubmit = async () => {
    setErrors({}); // Clear previous errors
  
    if (
      !formData.houseNumber ||
      !formData.streetName ||
      !formData.city ||
      !formData.country ||
      !formData.accountHolderName ||
      !formData.accountNumber ||
      !formData.confirmAccountNumber ||
      !formData.bankName 
   
    ) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
  
    if (formData.accountNumber !== formData.confirmAccountNumber) {
      Alert.alert('Error', 'Account numbers do not match.');
      return;
    }
  
    const combinedData = {
      ...basicDetails,
      ...formData,
      jobRole,
      empType: type,
      languages: Object.keys(preferredLanguages)
        .filter((lang) => preferredLanguages[lang as keyof typeof preferredLanguages])
        .join(', '), // Convert preferred languages to a comma-separated string
    };
  
    try {
      const token = await AsyncStorage.getItem('token'); // Replace with your actual token logic
      const response = await axios.post(
        `${environment.API_BASE_URL}api/collection-manager/collection-officer/add`,
        combinedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 201) {
        Alert.alert('Success', 'Officer created successfully!');
        navigation.navigate('CollectionOfficersList'); // Navigate back or to another page
      }
    } catch (error: any) {
      console.error('Error submitting officer data:', error);
  
      // Handle 400 errors (validation issues)
      if (error.response && error.response.status === 400) {
        const serverErrors = error.response.data.error; // Backend sends field-specific error messages
        if (serverErrors) {
          if (typeof serverErrors === 'string') {
            // Display a general error
            Alert.alert('Error', serverErrors);
          } else {
            // Display specific field errors as a combined alert message
            const errorMessages = Object.values(serverErrors).join('\n');
            Alert.alert('Validation Errors', errorMessages);
          }
        } else {
          Alert.alert('Error', 'An error occurred while creating the officer.');
        }
      } else {
        Alert.alert('Error', 'An error occurred while creating the officer.');
      }
    }
  };
  

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white shadow-sm">
        <TouchableOpacity onPress={() => navigation.goBack()} className="pr-4">
          <AntDesign name="left" size={24} color="#000502" />
        </TouchableOpacity>
        <Text className="text-lg font-bold ml-[25%]">Add Officer</Text>
      </View>

      {/* Address Details */}
      <View className="px-8 mt-4">
        <TextInput
          placeholder="--House / Plot Number--"
          value={formData.houseNumber}
          onChangeText={(text) => setFormData({ ...formData, houseNumber: text })}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
        />
        <TextInput
          placeholder="--Street Name--"
          value={formData.streetName}
          onChangeText={(text) => setFormData({ ...formData, streetName: text })}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
        />
        <TextInput
          placeholder="--City--"
          value={formData.city}
          onChangeText={(text) => setFormData({ ...formData, city: text })}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
        />
        <View className="border border-gray-300 rounded-lg mb-4 ">
          <Picker
            selectedValue={formData.country}
            onValueChange={(value) => setFormData({ ...formData, country: value })}
            className="text-gray-700 px-2 py-0"
          >
            <Picker.Item label="--Country--" value="" />
            {countries.map((country) => (
              <Picker.Item key={country.code} label={country.name} value={country.code} />
            ))}
          </Picker>
        </View>

    
        <TextInput
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
        />
      </View>

      {/* Bank Details */}
      <View className="px-8 mt-4">
        <TextInput
          placeholder="--Account Holder's Name--"
          value={formData.accountHolderName}
          onChangeText={(text) => setFormData({ ...formData, accountHolderName: text })}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
        />
    <View>
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
    onChangeText={(text) => handleValidation("confirmAccountNumber", text)}
    className={`border ${error ? "border-red-500" : "border-gray-300"} rounded-lg px-3 py-2 mb-4 text-gray-700`}
  />
  {error ? <Text className="text-red-500 text-sm mb-4">{error}</Text> : null}
</View>
        <TextInput
          placeholder="--Bank Name--"
          value={formData.bankName}
          onChangeText={(text) => setFormData({ ...formData, bankName: text })}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
        />
        <TextInput
          placeholder="--Branch Name--"
          value={formData.branchName}
          onChangeText={(text) => setFormData({ ...formData, branchName: text })}
          className="border border-gray-300 rounded-lg px-3 py-2"
        />
      </View>

      {/* Buttons */}
      <View className="flex-row justify-center space-x-4 px-4 mt-8 mb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-gray-300 px-8 py-3 rounded-full"
        >
          <Text className="text-gray-800 text-center">Go Back</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={handleSubmit}
          className="bg-green-600 px-8 py-3 rounded-full"
        >
          <Text className="text-white text-center">Submit</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          className={`bg-green-600 px-8 py-3 rounded-full ${
            loading ? "bg-gray-400 opacity-50" : "bg-[#2AAD7A]"
          }`}
          onPress={() => {
            if (!loading) {
              setLoading(true); // Disable the button on click
              handleSubmit(); // Your action function
            }
          }}
          disabled={loading} // Disable button during the operation
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text className="text-white text-center">
              Submit
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddOfficerAddressDetails;
