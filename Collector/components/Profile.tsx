import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import environment from '../environment';

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type ProfileNavigationProps = StackNavigationProp<RootStackParamList, 'Profile'>;

interface ProfileProps {
  navigation: ProfileNavigationProps;
}

const Profile: React.FC<ProfileProps> = ({ navigation }) => {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    regcode: '',
    jobRole: '',
    nicNumber: '',
    address: '',
    phoneNumber: '',
  });
  const [newPhoneNumber, setNewPhoneNumber] = useState<string>(profileData.phoneNumber);
  const [showUpdateButton, setShowUpdateButton] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePhoneNumberChange = (text: string) => {
    // Remove non-numeric characters
    const numericText = text.replace(/\D/g, '');

    // Update state with the new phone number
    setNewPhoneNumber(numericText);

    // Check if the number exceeds 11 digits
    if (numericText.length > 11) {
        setErrorMessage('Phone number cannot exceed 11 digits.');
        setShowUpdateButton(false); // Hide update button if error
    } else {
        setErrorMessage('');
        setShowUpdateButton(numericText.length > 0 && numericText !== profileData.phoneNumber); // Show update button if number is changed
    }
};

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
            Alert.alert('Error', 'No token found');
            return;
        }

        const response = await api.get('api/collection-officer/profile-details', {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        console.log(data);
        
        // Assuming phoneNumber is stored as '+94786995656' in the database
        const formattedPhoneNumber = data.phoneNumber.startsWith('+') 
            ? data.phoneNumber.substring(1) // Strip the '+' sign only
            : data.phoneNumber; // Keep it as is if not prefixed

        setProfileData({
            firstName: data.firstName,
            lastName: data.lastName,
            companyName: data.companyName,
            regcode: data.regcode,
            jobRole: data.jobRole,
            nicNumber: data.nicNumber,
            address: data.address,
            phoneNumber: formattedPhoneNumber, // This will be stored with '94'
        });
        setNewPhoneNumber(formattedPhoneNumber); // Same here
    } catch (error) {
        console.error('Error fetching profile data:', error);
        Alert.alert('Error', 'Failed to load profile data');
    }
};


  const handleUpdatePhoneNumber = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No token found');
        return;
      }

      await api.put(
        'api/collection-officer/update-phone',
        { phoneNumber: newPhoneNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfileData((prevData) => ({ ...prevData, phoneNumber: newPhoneNumber }));
      setShowUpdateButton(false);
      Alert.alert('Success', 'Phone number updated successfully');
    } catch (error) {
      console.error('Error updating phone number:', error);
      Alert.alert('Error', 'Failed to update phone number');
    }
  };
  

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}>
        {/* Header */}
        <View className="flex-row items-center mt-4 mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <AntDesign name="left" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-xl font-bold text-black">My Profile</Text>
        </View>

        {/* Profile Image */}
        <View className="items-center mb-6">
          <Image
            source={require('../assets/images/profile.png')}
            className="w-28 h-28 rounded-full"
          />
        </View>

        {/* Profile Fields */}
        <View className="space-y-4 p-5">
          {/* First Name */}
          <View>
            <Text className="text-gray-500">First Name</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={profileData.firstName}
              editable={false}
            />
          </View>

          {/* Last Name */}
          <View>
            <Text className="text-gray-500">Last Name</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={profileData.lastName}
              editable={false}
            />
          </View>

          {/* Company Name */}
          <View>
            <Text className="text-gray-500">Company Name</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={profileData.companyName}
              editable={false}
            />
          </View>

          {/* Branch Code */}
          <View>
            <Text className="text-gray-500">Branch Code</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={profileData.regcode}
              editable={false}
            />
          </View>

          {/* Job Role */}
          <View>
            <Text className="text-gray-500">Job Role</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={profileData.jobRole}
              editable={false}
            />
          </View>

          {/* NIC Number */}
          <View>
            <Text className="text-gray-500">NIC Number</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={profileData.nicNumber}
              editable={false}
            />
          </View>

          {/* Phone Number */}
          <View>
            <Text className="text-gray-500">Phone Number</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={newPhoneNumber}
              placeholder='94786995656'
              keyboardType='numeric'
              onChangeText={handlePhoneNumberChange}
            />
            {errorMessage && (
              <Text className="text-red-500">{errorMessage}</Text> // Error message
            )}
          </View>

          {/* Address */}
          <View>
            <Text className="text-gray-500">Address</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={profileData.address}
              editable={false}
            />
          </View>

          {/* Update Button */}
          {showUpdateButton && (
            <TouchableOpacity
              onPress={handleUpdatePhoneNumber}
              className="bg-[#2AAD7A] py-2 rounded-[30px] mt-4"
            >
              <Text className="text-center text-white font-semibold">Update</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
