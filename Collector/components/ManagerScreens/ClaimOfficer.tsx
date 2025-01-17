import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  // Picker,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useNavigation } from '@react-navigation/native';

type ClaimOfficerNavigationProp = StackNavigationProp<RootStackParamList, 'ClaimOfficer'>;

const ClaimOfficer: React.FC = () => {
  const navigation = useNavigation<ClaimOfficerNavigationProp>();

  const [jobRole, setJobRole] = useState('Collection Officer');
  const [empID, setEmpID] = useState('');
  const [officerFound, setOfficerFound] = useState(false);
  const [officerDetails, setOfficerDetails] = useState({
    name: 'Gaya Perera',
    role: 'Collection Officer',
    empCode: 'CCO01485',
    company: 'Agro World Pvt Ltd',
  });

  const handleSearch = () => {
    if (empID === '0120') {
      setOfficerFound(true);
    } else {
      setOfficerFound(false);
    }
  };

  const handleClaimOfficer = () => {
    Alert.alert('Success', 'You have claimed this officer.');
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white shadow-sm">
        <TouchableOpacity
          className="pr-4"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold ml-[25%]">Claim Officers</Text>
      </View>

      {/* Form */}
      <View className="px-8 mt-7">
        <Text className="font-semibold text-gray-800 mb-2 text-center">
          Job Role
        </Text>
        <View className="border border-gray-300 rounded-lg pb-3">
          <Picker
            selectedValue={jobRole}
            onValueChange={(itemValue) => setJobRole(itemValue)}
            style={{ height: 40, width: '100%' }}
          >
            <Picker.Item label="Collection Officer" value="Collection Officer" />
            <Picker.Item label="Supervisor" value="Supervisor" />
          </Picker>
        </View>

        {/* EMP ID Input */}
        <Text className="font-semibold text-gray-800 mt-6 mb-2 text-center">
          EMP ID
        </Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg mb-4">
          <View className="bg-gray-200 px-4 py-2 rounded-l-lg">
            <Text className="text-gray-600 font-bold">COO</Text>
          </View>
          <TextInput
            placeholder="0122"
            value={empID}
            onChangeText={setEmpID}
            className="flex-1 px-4 py-2 text-gray-700"
          />
        </View>
      
        {/* Search Button */}
        <TouchableOpacity
          className={`py-3  py-3 rounded-[35px] items-center mt-7 ${
            empID ? 'bg-[#2AAD7A]' : 'bg-gray-300'
          }`}
          disabled={!empID}
          onPress={handleSearch}
        >
          <Text className="text-white text-center font-semibold">Search</Text>
        </TouchableOpacity>
      </View>

      {/* No Officer Found */}
      {!officerFound && empID && (
        <View className="flex items-center justify-center mt-24">
          <Image
            source={require('../../assets/images/dd.png')} // Replace with your PNG file path
            className="w-28 h-28" // Adjust width and height as needed
            resizeMode="contain" // Ensures the image scales proportionally
          />
          <Text className="text-gray-500 mt-2">
            - No Disclaimed officer was found -
          </Text>
        </View>
      )}

      {/* Officer Found */}
      {officerFound && (
        <View className="px-4 mt-16 items-center">
          {/* Officer Avatar */}
          <Image
            source={require('../../assets/images/profile.png')}
            className="w-20 h-20 rounded-full mb-4"
          />
          {/* Officer Details */}
          <Text className="text-lg font-bold text-gray-800">
            {officerDetails.name}
          </Text>
          <Text className="text-sm text-gray-500">
            {officerDetails.role} - {officerDetails.empCode}
          </Text>
          <Text className="text-sm text-gray-500">{officerDetails.company}</Text>

          {/* Claim Officer Button */}
          <TouchableOpacity
            className="mt-6 bg-[#2AAD7A] w-[250px] py-3 px-8 rounded-[35px]"
            onPress={handleClaimOfficer}
          >
            <Text className="text-white font-semibold text-center">
              Claim Officer
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default ClaimOfficer;
