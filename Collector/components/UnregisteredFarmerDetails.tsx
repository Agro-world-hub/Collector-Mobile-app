import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
  StyleSheet,
  Animated,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types'; // Adjust the path according to your project structure
import CountryPicker, { CountryCode } from 'react-native-country-picker-modal';
import axios from 'axios';
import environment from '../environment';

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type UnregisteredFarmerDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'UnregisteredFarmerDetails'>;

interface UnregisteredFarmerDetailsProps {
  navigation: UnregisteredFarmerDetailsNavigationProp;
}

const UnregisteredFarmerDetails: React.FC<UnregisteredFarmerDetailsProps> = ({ navigation }) => {
  const [countryCode, setCountryCode] = useState<CountryCode>('US');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [NICnumber, setNICnumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [accNumber, setAccNumber] = useState('');
  const [accHolderName, setAccHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [loading, setLoading] = useState(false); // Loading state for the progress bar
  const [progress] = useState(new Animated.Value(0)); // Animated value for progress

  const handleNext = async () => {
    setLoading(true); // Start loading
    setIsModalVisible(true); // Show the modal

    // Start loading animation
    Animated.timing(progress, {
      toValue: 100, // Animate to 100%
      duration: 2000, // Duration of the loading bar animation
      useNativeDriver: false, // Set to false for width animation
    }).start();

    try {
      const response = await api.post(`api/farmer/register-farmer`, {
        firstName,
        lastName,
        NICnumber,
        phoneNumber,
        address,
        accNumber,
        accHolderName,
        bankName,
        branchName,
      });

      if (response.status === 201) {
        Alert.alert("Success", response.data.message);
        const userId = response.data.userId; // Capture userId
        const cropCount = response.data.cropCount || 0; // Ensure you have a cropCount value

        // Navigate to UnregisteredCropDetails with both userId and cropCount
        navigation.navigate('UnregisteredCropDetails', { userId, cropCount });
      }
    } catch (error: any) {
      console.error(error); // Log for debugging
      if (error.response) {
        Alert.alert("Error", error.response.data.error || "An error occurred");
      } else if (error.request) {
        Alert.alert("Error", "Failed to connect to the server");
      } else {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false); // End loading
      setTimeout(() => setIsModalVisible(false), 1000); // Close modal after a delay
    }
  };

  // Interpolating the animated value for width
  const loadingBarWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View className="flex-1 p-5 bg-white">
      {/* Header with Back Icon */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/images/back.png')} // Path to your PNG image
            style={{ width: 24, height: 24 }} // Adjust size if needed
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-3">Fill Farmer Personal Details</Text>
      </View>

      {/* Scrollable Form */}
      <ScrollView className="flex-1 p-3">
        {/* First Name */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">First Name</Text>
          <TextInput
            placeholder="First Name"
            className="border p-3 rounded"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

                       {/* Last Name */}
                       <View className="mb-4">
                    <Text className="text-gray-600 mb-2">Last Name</Text>
                    <TextInput 
                        placeholder="Last Name" 
                        className="border p-3 rounded" 
                        value={lastName}
                        onChangeText={setLastName}
                    />
                </View>

                {/* NIC Number */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">NIC Numbers</Text>
                    <TextInput 
                        placeholder="NIC Number" 
                        className="border p-3 rounded" 
                        value={NICnumber}
                        onChangeText={setNICnumber}
                    />
                </View>

                {/* Phone Number */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">Phone Number</Text>
                    <View className="flex-row items-center border p-3 rounded">
                        <CountryPicker 
                            countryCode={countryCode} 
                            withFilter 
                            withFlag 
                            onSelect={(country) => setCountryCode(country.cca2 as CountryCode)} 
                        />
                        <TextInput 
                            placeholder="Phone Number" 
                            keyboardType="phone-pad" 
                            value={phoneNumber} 
                            onChangeText={setPhoneNumber} 
                            className="flex-1" 
                        />
                    </View>
                </View>

                {/* Address */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">Address</Text>
                    <TextInput 
                        placeholder="Address" 
                        className="border p-3 rounded" 
                        value={address}
                        onChangeText={setAddress}
                    />
                </View>

                {/* Account Number */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">Account Number</Text>
                    <TextInput 
                        placeholder="Account Number" 
                        className="border p-3 rounded" 
                        value={accNumber}
                        onChangeText={setAccNumber}
                    />
                </View>

                {/* Account Holder's Name */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">Account Holder's Name</Text>
                    <TextInput 
                        placeholder="Account Holder's Name" 
                        className="border p-3 rounded" 
                        value={accHolderName}
                        onChangeText={setAccHolderName}
                    />
                </View>

                {/* Bank Name */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">Bank Name</Text>
                    <TextInput 
                        placeholder="Bank Name" 
                        className="border p-3 rounded" 
                        value={bankName}
                        onChangeText={setBankName}
                    />
                </View>

                {/* Branch Name */}
                <View className="mb-8">
                    <Text className="text-gray-600 mb-2">Branch Name</Text>
                    <TextInput 
                        placeholder="Branch Name" 
                        className="border p-3 rounded" 
                        value={branchName}
                        onChangeText={setBranchName}
                    />
                </View>
      </ScrollView>

        {/* Next Button */}
        <TouchableOpacity
          className="bg-green-500 p-3 rounded-full items-center mt-5"
          onPress={handleNext}
        >
          <Text className="text-white text-lg">Next</Text>
        </TouchableOpacity>

      {/* Success Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text className="text-xl font-bold mb-3">Loading...</Text>
            <Animated.View style={[styles.loadingBar, { width: loadingBarWidth }]}>
              <View style={styles.loadingBarInner} />
            </Animated.View>
            {loading && <Text>Processing...</Text>}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  loadingBar: {
    height: 20,
    borderRadius: 5,
    backgroundColor: 'lightgray',
    overflow: 'hidden',
    marginTop: 10,
    width: '100%', // Full width for the outer container
  },
  loadingBarInner: {
    height: '100%',
    backgroundColor: 'green', // Color of the loading bar
  },
});

export default UnregisteredFarmerDetails;
