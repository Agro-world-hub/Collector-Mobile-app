import React, { useState } from 'react';
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

type AddOfficerAddressDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddOfficerAddressDetails'
>;

const AddOfficerAddressDetails: React.FC = () => {
  const navigation = useNavigation<AddOfficerAddressDetailsNavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'AddOfficerAddressDetails'>>();

  // Rename the destructured `formData` from route.params to avoid conflict
  const { formData: basicDetails, type, preferredLanguages, jobRole } = route.params;

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

  const handleSubmit = async () => {
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
        navigation.goBack(); // Navigate back or to another page
      } else {
        Alert.alert('Error', 'Failed to create officer');
      }
    } catch (error) {
      console.error('Error submitting officer data:', error);
      Alert.alert('Error', 'An error occurred while creating the officer.');
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white shadow-sm">
        <TouchableOpacity onPress={() => navigation.goBack()} className="pr-4">
          <Ionicons name="arrow-back" size={24} color="#000" />
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
        <TextInput
          placeholder="--Country--"
          value={formData.country}
          onChangeText={(text) => setFormData({ ...formData, country: text })}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
        />
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
        <TextInput
          placeholder="--Account Number--"
          value={formData.accountNumber}
          onChangeText={(text) => setFormData({ ...formData, accountNumber: text })}
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
        />
        <TextInput
          placeholder="--Confirm Account Number--"
          value={formData.confirmAccountNumber}
          onChangeText={(text) =>
            setFormData({ ...formData, confirmAccountNumber: text })
          }
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
        />
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
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-green-600 px-8 py-3 rounded-full"
        >
          <Text className="text-white text-center">Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddOfficerAddressDetails;
