import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker'; // For dropdown
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import environment from '../environment';

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type ComplainPageNavigationProps = StackNavigationProp<RootStackParamList, 'ComplainPage'>;

interface ComplainPageProps {
  navigation: ComplainPageNavigationProps;
}

const ComplainPage: React.FC<ComplainPageProps> = () => {
  const navigation = useNavigation();
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [complainText, setComplainText] = useState('');

  const handleSubmit = () => {
    if (!selectedLanguage || !complainText) {
      Alert.alert('Error', 'Please select a language and add your complaint.');
      return;
    }
    // Handle form submission logic here
    Alert.alert('Submitted', 'Your complaint has been submitted successfully!');
  };

  return (
    <View className="flex-1 bg-white px-4">
      {/* Header with Back Button */}
      <View className="flex-row items-center justify-start p-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Image at the Top */}
      <View className="items-center mb-6">
        <Image
          source={require('../assets/images/complain.png')} // Replace with your image path
          style={{ width: 160, height: 160 }} // Adjusted for a more prominent image size
        />
      </View>

      {/* Form Container with Shadow */}
      <View className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-400">
        <Text className="text-center text-xl font-semibold text-black mb-4">
          Tell us the <Text className="text-red-600">problem</Text>
        </Text>

        {/* Dropdown for Language Selection */}
        <View className="border rounded-full bg-gray-100 mb-4 px-4">
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
            style={{ height: 50, width: '100%' }}
          >
            <Picker.Item label="Select Farmer’s Preferred Language" value="" />
            <Picker.Item label="English" value="english" />
            <Picker.Item label="Sinhala" value="sinhala" />
            <Picker.Item label="Tamil" value="tamil" />
          </Picker>
        </View>

        {/* Information Text */}
        <Text className="text-center text-gray-500 mb-6">
          We will get back to the farmer within 2 days after hearing from you.
        </Text>

        {/* Complaint Text Input */}
        <TextInput
          value={complainText}
          onChangeText={setComplainText}
          placeholder="Add the Complaint here..."
          multiline
          numberOfLines={8}
          className="bg-gray-100 h-[150px] rounded-lg p-4 text-black"
        />

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-green-500 rounded-full py-3 mt-6"
        >
          <Text className="text-center text-white text-lg">Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ComplainPage;
