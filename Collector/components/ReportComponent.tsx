import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// import { generatePdf } from './generatePdf';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';

import environment from '../environment';

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type ReportPageNavigationPrps = StackNavigationProp<RootStackParamList, 'ReportPage'>;

interface ReportPageProps {
  navigation: ReportPageNavigationPrps;
}


interface PersonalAndBankDetails {
  firstName: string;
  lastName: string;
  nicNumber: string;
  phoneNumber: string;
  address: string;
  accountNumber: string;
  accountHolder: string;
  bankName: string;
  branchName: string;
}

const ReportPage:React.FC<ReportPageProps> = ({ navigation }) => {
  const [details, setDetails] = useState<PersonalAndBankDetails | null>(null);
  const [farmerQrCode, setFarmerQrCode] = useState<string | null>(null);
  const [officerQrCode, setOfficerQrCode] = useState<string | null>(null);

  useEffect(() => {
    fetchDetails();
    fetchQrCodes();
  }, []);

  const fetchDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No token found');
        return;
      }

      const response = await axios.get(`api/personal-bank-details`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDetails(response.data);
    } catch (error) {
      console.error('Error fetching details:', error);
      Alert.alert('Error', 'Failed to load details');
    }
  };

  const fetchQrCodes = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No token found');
        return;
      }

      const [farmerQrResponse] = await Promise.all([
        api.get(`/api/farmer-qr`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'json',
        }),
        // api.get(`${environment.API_BASE_URL}/api/officer-qr`, {
        //   headers: { Authorization: `Bearer ${token}` },
        //   responseType: 'blob',
        // }),
      ]);

      setFarmerQrCode(URL.createObjectURL(farmerQrResponse.data));
    //   setOfficerQrCode(URL.createObjectURL(officerQrResponse.data));
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      Alert.alert('Error', 'Failed to load QR codes');
    }
  };

  const handleDownload = () => {
    if (details) {
    //   generatePdf(details, farmerQrCode, officerQrCode);
    } else {
      Alert.alert('Error', 'Details are missing for generating PDF');
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <View className="flex-row justify-between mb-4">
        <Text className="text-xl font-bold">Purchase Report</Text>
      </View>

      {/* Personal Details Table */}
      {details && (
        <View className="mb-6">
          <Text className="font-bold text-lg mb-2">Personal Details</Text>
          <View className="border border-gray-300 p-4 rounded-lg">
            <View className="flex-row justify-between border-b border-gray-300 py-2">
              <Text className="font-semibold">First Name:</Text>
              <Text>{details.firstName}</Text>
            </View>
            <View className="flex-row justify-between border-b border-gray-300 py-2">
              <Text className="font-semibold">Last Name:</Text>
              <Text>{details.lastName}</Text>
            </View>
            <View className="flex-row justify-between border-b border-gray-300 py-2">
              <Text className="font-semibold">NIC Number:</Text>
              <Text>{details.nicNumber}</Text>
            </View>
            <View className="flex-row justify-between border-b border-gray-300 py-2">
              <Text className="font-semibold">Phone Number:</Text>
              <Text>{details.phoneNumber}</Text>
            </View>
            <View className="flex-row justify-between py-2">
              <Text className="font-semibold">Address:</Text>
              <Text>{details.address}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Bank Details Table */}
      {details && (
        <View className="mb-6">
          <Text className="font-bold text-lg mb-2">Bank Details</Text>
          <View className="border border-gray-300 p-4 rounded-lg">
            <View className="flex-row justify-between border-b border-gray-300 py-2">
              <Text className="font-semibold">Account Number:</Text>
              <Text>{details.accountNumber}</Text>
            </View>
            <View className="flex-row justify-between border-b border-gray-300 py-2">
              <Text className="font-semibold">Account Holder's Name:</Text>
              <Text>{details.accountHolder}</Text>
            </View>
            <View className="flex-row justify-between border-b border-gray-300 py-2">
              <Text className="font-semibold">Bank Name:</Text>
              <Text>{details.bankName}</Text>
            </View>
            <View className="flex-row justify-between py-2">
              <Text className="font-semibold">Branch Name:</Text>
              <Text>{details.branchName}</Text>
            </View>
          </View>
        </View>
      )}

      {/* QR Codes */}
      <View className="flex-row justify-evenly mt-4">
        <View className="items-center">
          {farmerQrCode && (
            <Image source={{ uri: farmerQrCode }} className="w-24 h-24" />
          )}
          <Text className="mt-2">Farmer's QR Code</Text>
        </View>
        <View className="items-center">
          {officerQrCode && (
            <Image source={{ uri: officerQrCode }} className="w-24 h-24" />
          )}
          <Text className="mt-2">Officer's QR Code</Text>
        </View>
      </View>

      {/* Download Button */}
      <TouchableOpacity onPress={handleDownload} className="bg-green-500 mt-6 py-3 rounded-lg">
        <Text className="text-center text-white font-semibold">Download</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ReportPage;
