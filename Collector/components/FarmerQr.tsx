import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, PermissionsAndroid, Platform } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import axios from 'axios';
import environment from '../environment';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type FarmerQrNavigationProp = StackNavigationProp<RootStackParamList, 'FarmerQr'>;

interface FarmerQrProps {
  navigation: FarmerQrNavigationProp;
}

type FarmerQrRouteProp = RouteProp<RootStackParamList, 'FarmerQr'>;

const FarmerQr: React.FC<FarmerQrProps> = ({ navigation }) => {
  const [farmerName, setFarmerName] = useState('');
  const [farmerNIC, setFarmerNIC] = useState('');
  const [farmerQRCode, setFarmerQRCode] = useState(''); // Base64 QR code image

  const route = useRoute<FarmerQrRouteProp>();
  const { userId } = route.params;

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const response = await api.get(`api/farmer/register-farmer/${userId}`);
        const { firstName, lastName, NICnumber, qrCode } = response.data;
        setFarmerName(`${firstName} ${lastName}`);
        setFarmerNIC(NICnumber);
        setFarmerQRCode(qrCode);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch farmer details');
      }
    };

    fetchFarmerData();
  }, [userId]);

  const downloadImage = async () => {
    const fileUri = FileSystem.documentDirectory + `farmer_qr_${userId}.png`;

    const { uri } = await FileSystem.downloadAsync(farmerQRCode, fileUri);
    Alert.alert('Download Success', `QR Code saved to gallery as ${uri}`);
  };

  const shareImage = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + `farmer_qr_${userId}.png`;

      // Download the image to the local file system
      await FileSystem.downloadAsync(farmerQRCode, fileUri);

      // Share the image without the message in the options
      await Sharing.shareAsync(fileUri, {
        dialogTitle: 'Share QR Code',
        UTI: '.png', // Specify the file type if necessary
      });

      Alert.alert('Success', 'QR Code shared successfully!');
    } catch (error) {
      console.log('Error =>', error);
      Alert.alert('Error', 'Failed to share the QR Code');
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-5">
      {/* Header with Back Icon */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/images/back.png')} // Path to your back icon
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
        <Text className="text-lg font-bold ml-3">Farmer Details</Text>
      </View>

      {/* Farmer Name and NIC */}
      <Text className="text-xl font-bold mb-2">{farmerName}</Text>
      <Text className="text-gray-500 mb-4">{farmerNIC}</Text>

      {/* QR Code */}
      {farmerQRCode ? (
        <Image
          source={{ uri: farmerQRCode }} // Display the Base64 QR code image
          style={{ width: 200, height: 200, borderWidth: 1, borderColor: '#00C853' }} // Adding border and dimensions
        />
      ) : (
        <Text className="text-red-500">QR Code not available</Text>
      )}

      {/* Buttons */}
      <TouchableOpacity className="bg-green-500 w-full mt-8 py-3 rounded-full items-center">
        <Text className="text-white text-lg">Collect</Text>
      </TouchableOpacity>

      <TouchableOpacity className="border border-gray-400 w-full mt-4 py-3 rounded-full items-center">
        <Text className="text-gray-700 text-lg">Complain</Text>
      </TouchableOpacity>

      {/* Download and Share buttons */}
      <View className="flex-row justify-around w-full mt-6">
        <TouchableOpacity className="bg-gray-200 p-4 rounded-lg items-center" onPress={downloadImage}>
          <Image
            source={require('../assets/images/download.png')} // Path to download icon
            style={{ width: 24, height: 24 }}
          />
          <Text className="text-sm">Download</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-gray-200 p-4 rounded-lg items-center" onPress={shareImage}>
          <Image
            source={require('../assets/images/Share.png')} // Path to share icon
            style={{ width: 24, height: 24 }}
          />
          <Text className="text-sm">Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FarmerQr;
