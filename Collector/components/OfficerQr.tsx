import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import axios from 'axios';
import environment from '../environment';

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type OfficerQrNavigationProps = StackNavigationProp<RootStackParamList, 'OfficerQr'>;

interface OfficerQrProps {
  navigation: OfficerQrNavigationProps;
}

const OfficerQr: React.FC<OfficerQrProps> = ({ navigation }) => {
  const qrCodeRef = useRef<any>(null);
  const [qrValue, setQrValue] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const companyName = "Your Company Name";

  const fetchRegistrationDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No token found');
        return;
      }

      const response = await api.get('api/collection-officer/user-profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      console.log(data);
      if (data.status === 'success') {
        const registrationDetails = data.user;
        const qrData = JSON.stringify(registrationDetails);
        setQrValue(qrData); 
        setFirstName(registrationDetails.firstNameEnglish || '');
        setLastName(registrationDetails.lastNameEnglish || '');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error fetching registration details:', error);
      Alert.alert('Error', 'Failed to fetch details');
    }
  };

  useEffect(() => {
    fetchRegistrationDetails();
  }, []);

  const downloadQRCode = async () => {
    if (!qrCodeRef.current) return;

    try {
      const uri = await captureRef(qrCodeRef.current, {
        format: 'png',
        quality: 1.0,
      });

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Gallery access is required to save QR Code.');
        return;
      }

      const fileName = `QRCode_${Date.now()}.png`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      await MediaLibrary.saveToLibraryAsync(fileUri);

      Alert.alert('Success', 'QR Code saved to gallery');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save QR Code');
    }
  };

  const shareQRCode = async () => {
    if (!qrCodeRef.current) return;

    try {
      const uri = await captureRef(qrCodeRef.current, {
        format: 'png',
        quality: 1.0,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share QR Code',
        });
      } else {
        Alert.alert('Sharing Unavailable', 'Sharing is not available on this device.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to share QR Code');
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="relative w-full h-16  flex-row items-center justify-between px-4">
        <TouchableOpacity onPress={() => navigation.navigate('EngProfile')}>
          <AntDesign name="left" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">QR Code</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* QR Code Display */}
      <View className="items-center  my-6">
        <View ref={qrCodeRef} className="bg-white p-4 mt-[90px] rounded-xl border-2 border-[#2AAD7A]">
          {qrValue ? (
            <QRCode value={qrValue} size={200} />
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
      </View>

      {/* Profile Info */}
      <View className="flex-row items-center justify-center mb-4 px-4">
        <Image
          source={require('../assets/images/profile.png')}
          className="w-20 h-20 rounded-full border-2 border-gray-300 mr-4"
        />
        <View>
          <Text className="text-lg font-semibold">{`${firstName} ${lastName}`}</Text>
          <Text className="text-gray-600">{companyName}</Text>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row justify-evenly mt-[50px] mb-4">
        <TouchableOpacity
          className="bg-[#2AAD7A] w-24 h-20 rounded-lg items-center justify-center flex-col mx-2"
          onPress={downloadQRCode}
        >
          <MaterialIcons name="download" size={24} color="white" />
          <Text className="text-white text-xs mt-1">Download</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-[#2AAD7A] w-24 h-20 rounded-lg items-center justify-center flex-col mx-2"
          onPress={shareQRCode}
        >
          <MaterialIcons name="share" size={24} color="white" />
          <Text className="text-white text-xs mt-1">Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OfficerQr;
