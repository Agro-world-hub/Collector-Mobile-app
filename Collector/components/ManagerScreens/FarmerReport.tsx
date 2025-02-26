import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import environment from '../../environment/environment';
import { RootStackParamList } from '../types';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type FarmerReportNavigationProps = StackNavigationProp<RootStackParamList, 'FarmerReport'>;
type FarmerReportRouteProp = RouteProp<RootStackParamList, 'FarmerReport'>;

interface FarmerReportProps {
  navigation: FarmerReportNavigationProps;
}

interface PersonalAndBankDetails {
  userId: string | null;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  NICnumber: string | null;
  profileImage: string | null;
  qrCode: string | null;
  address: string | null;
  accNumber: string | null;
  accHolderName: string | null;
  bankName: string | null;
  branchName: string | null;
}

interface Crop {
  id: number;
  cropName: string;
  variety: string;
  unitPriceA: string;
  weightA: string;
  unitPriceB: string;
  weightB: string;
  unitPriceC: string;
  weightC: string;
  total: number;
  invoiceNumber: string;
}

const FarmerReport: React.FC<FarmerReportProps> = ({ navigation }) => {
  const [details, setDetails] = useState<PersonalAndBankDetails | null>(null);
  const route = useRoute<FarmerReportRouteProp>();
  const {
    registeredFarmerId,
    userId,
    firstName,
    lastName,
    phoneNumber,
    address,
    NICnumber,
    totalAmount,
    bankAddress,
    accountNumber,
    accountHolderName,
    bankName,
    branchName,
    selectedDate
  } = route.params;
  
  console.log('Farmer Report:', route.params);
  const [crops, setCrops] = useState<Crop[]>([]);

  const fetchCropDetails = async (userId: number, createdAt: string, farmerId: number) => {
    try {
      const response = await axios.get(
        `${environment.API_BASE_URL}api/collection-manager/transaction-details/${userId}/${selectedDate}/${registeredFarmerId}`
      );
  
      if (response.status === 200) {
        console.log('Crop Details:', response.data);
        return response.data;
      } else {
        console.error('Failed to fetch crop details:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error fetching crop details:', error);
      return [];
    }
  };
  
  useEffect(() => {
    const loadCropDetails = async () => {
      try {
        const data = await fetchCropDetails(userId, selectedDate, registeredFarmerId);
        setCrops(data); // Populate the `crops` state with fetched data
      } catch (error) {
        Alert.alert('Error', 'Failed to load crop details');
      }
    };
  
    loadCropDetails();
  }, [userId, selectedDate, registeredFarmerId]); // Dependencies trigger re-fetch when changed
  
  

  const generatePDF = async () => {
    try {
      const cropsTableRows = crops
        .map(
          (crop) => `
            <tr>
              <td>${crop.cropName}</td>
              <td>${crop.variety}</td>
              <td>${crop.unitPriceA}</td>
              <td>${crop.weightA}</td>
              <td>${crop.unitPriceB}</td>
              <td>${crop.weightB}</td>
              <td>${crop.unitPriceC}</td>
              <td>${crop.weightC}</td>
              <td>${crop.total}</td>
            </tr>
          `
        )
        .join('');
  
      const totalSum = crops.reduce((sum: number, crop: Crop) => sum + Number(crop.total), 0);
  
      const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1, h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Purchase Report</h1>
          <h2>Invoice Number: ${crops.length > 0 ? crops[0].invoiceNumber : 'N/A'}</h2>
          <h2>Date: ${selectedDate}</h2>
          
          <h3>Personal Details</h3>
          <table>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>NIC Number</th>
              <th>Phone Number</th>
              <th>Address</th>
            </tr>
            <tr>
              <td>${firstName}</td>
              <td>${lastName}</td>
              <td>${NICnumber}</td>
              <td>${phoneNumber}</td>
              <td>${address}</td>
            </tr>
          </table>
  
          <h3>Bank Details</h3>
          <table>
            <tr>
              <th>Account Number</th>
              <th>Account Holder's Name</th>
              <th>Bank Name</th>
              <th>Branch Name</th>
            </tr>
            <tr>
              <td>${accountNumber || 'N/A'}</td>
              <td>${accountHolderName || 'N/A'}</td>
              <td>${bankName || 'N/A'}</td>
              <td>${branchName || 'N/A'}</td>
            </tr>
          </table>
  
          <h3>Crop Details</h3>
          <table>
            <tr>
              <th>Crop Name</th>
              <th>Variety</th>
              <th>Unit Price A</th>
              <th>Weight A</th>
              <th>Unit Price B</th>
              <th>Weight B</th>
              <th>Unit Price C</th>
              <th>Weight C</th>
              <th>Total</th>
            </tr>
            ${cropsTableRows}
          </table>
  
          <div style="text-align: left; margin-top: 20px;">
            <strong>Full Total: Rs. ${totalSum.toFixed(2)}</strong>
          </div>
        </body>
      </html>
      `;
  
      const { uri } = await Print.printToFileAsync({ html });
      return uri;
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF');
      return '';
    }
  };
  
  
  const handleDownloadPDF = async () => {
     const uri = await generatePDF(); // Generate the PDF and get its URI
   
     if (uri) {
       // Get the current date in YYYY-MM-DD format
       const date = new Date().toISOString().slice(0, 10);
       const fileName = `PurchaseReport_${NICnumber}_${date}.pdf`;
   
       try {
         // Request permission to access media library
         const { status } = await MediaLibrary.requestPermissionsAsync();
   
         if (status === 'granted') {
           // Define a temporary path in the FileSystem's cache directory with the correct file name
           const tempUri = `${FileSystem.cacheDirectory}${fileName}`;
   
           // Copy the file to the new temporary path with the desired file name
           await FileSystem.copyAsync({
             from: uri, // Original URI
             to: tempUri, // New URI with the correct name
           });
   
           // Create an asset with the renamed file
           const asset = await MediaLibrary.createAssetAsync(tempUri);
   
           // Save to the Downloads album
           const album = await MediaLibrary.getAlbumAsync('Download');
           if (!album) {
             await MediaLibrary.createAlbumAsync('Download', asset, false);
           } else {
             await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
           }
   
           Alert.alert('Download Success', `${fileName} has been saved to your Downloads folder.`);
         } else {
           Alert.alert('Permission Denied', 'You need to grant permission to save the PDF.');
         }
       } catch (error) {
         console.error('Error saving PDF:', error);
         Alert.alert('Error', 'Failed to save PDF to Downloads folder.');
       }
     } else {
       Alert.alert('Error', 'PDF was not generated.');
     }
   };
   
   
  

  const handleSharePDF = async () => {
    const uri = await generatePDF();
    if (uri && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert('Error', 'Sharing is not available on this device');
    }
  };


  return (
    <ScrollView className="flex-1 bg-white p-4">
       <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/images/back.png')} // Path to your back icon
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-[25%]">Purchase Report</Text>
      </View>

      {/* Personal Details Section */}
   
      <View className="mb-4 p-4">
  {/* Selected Date and Invoice Number */}
  <View className="mb-2">
  <Text className="text-sm font-bold">INV NO:{crops.length > 0 ? crops[0].invoiceNumber : 'N/A'}</Text>
    <Text className="text-sm font-bold">Date: {selectedDate}</Text>
    
  </View>

  <Text className="font-bold text-sm mb-2">Personal Details</Text>
  <ScrollView horizontal className="border border-gray-300 rounded-lg">
    <View>
      {/* Table Header */}
      <View className="flex-row bg-gray-200">
        <Text className="w-32 p-2 font-bold border-r border-gray-300">First Name</Text>
        <Text className="w-32 p-2 font-bold border-r border-gray-300">Last Name</Text>
        <Text className="w-32 p-2 font-bold border-r border-gray-300">NIC Number</Text>
        <Text className="w-32 p-2 font-bold border-r border-gray-300">Phone Number</Text>
        <Text className="w-32 p-2 font-bold">Address</Text>
      </View>
      {/* Table Rows */}
      <View className="flex-row">
        <Text className="w-32 p-2 border-r border-gray-300">{firstName}</Text>
        <Text className="w-32 p-2 border-r border-gray-300">{lastName}</Text>
        <Text className="w-32 p-2 border-r border-gray-300">{NICnumber}</Text>
        <Text className="w-32 p-2 border-r border-gray-300">{phoneNumber}</Text>
        <Text className="w-32 p-2">{address}</Text>
      </View>
    </View>
  </ScrollView>
</View>


      {/* Bank Details Section */}

        <View className="mb-4 p-4">
          <Text className="font-bold text-sm mb-2">Bank Details</Text>
          <ScrollView horizontal className="border border-gray-300 rounded-lg">
            <View>
              {/* Table Header */}
              <View className="flex-row bg-gray-200">
                <Text className="w-32 p-2 font-bold border-r border-gray-300">Account Number</Text>
                <Text className="w-32 p-2 font-bold border-r border-gray-300">Account Holder's Name</Text>
                <Text className="w-32 p-2 font-bold border-r border-gray-300">Bank Name</Text>
                <Text className="w-32 p-2">Branch Name</Text>
              </View>
              {/* Table Rows */}
              <View className="flex-row">
              <Text className="w-32 p-2 border-r border-gray-300">{accountNumber || 'N/A'}</Text>
              <Text className="w-32 p-2 border-r border-gray-300">{accountHolderName || 'N/A'}</Text>
              <Text className="w-32 p-2 border-r border-gray-300">{bankName || 'N/A'}</Text>
              <Text className="w-32 p-2">{branchName || 'N/A'}</Text>
            
              </View>
            </View>
          </ScrollView>
        </View>


       {/* Crop Details Section */}
       {crops.length > 0 && (
    <View className="mb-4 p-4">
    <Text className="font-bold text-sm mb-2">Crop Details</Text>
    <ScrollView horizontal className="border border-gray-300 rounded-lg">
      <View>
        {/* Table Header */}
        <View className="flex-row bg-gray-200">
          <Text className="w-32 p-2 font-bold border-r border-gray-300">Crop Name</Text>
          <Text className="w-32 p-2 font-bold border-r border-gray-300">Variety</Text>
          <Text className="w-32 p-2 font-bold border-r border-gray-300">Unit Price A</Text>
          <Text className="w-32 p-2 font-bold border-r border-gray-300">Weight A</Text>
          <Text className="w-32 p-2 font-bold border-r border-gray-300">Unit Price B</Text>
          <Text className="w-32 p-2 font-bold border-r border-gray-300">Weight B</Text>
          <Text className="w-32 p-2 font-bold border-r border-gray-300">Unit Price C</Text>
          <Text className="w-32 p-2 font-bold border-r border-gray-300">Weight C</Text>
          <Text className="w-32 p-2">Total</Text>
        </View>
        {/* Table Rows */}
        {crops.map((crop) => (
          <View key={crop.id} className="flex-row">
            <Text className="w-32 p-2 border-b border-gray-300">{crop.cropName}</Text>
            <Text className="w-32 p-2 border-b border-gray-300">{crop.variety}</Text>
            <Text className="w-32 p-2 border-b border-gray-300">{crop.unitPriceA}</Text>
            <Text className="w-32 p-2 border-b border-gray-300">{crop.weightA}</Text>
            <Text className="w-32 p-2 border-b border-gray-300">{crop.unitPriceB}</Text>
            <Text className="w-32 p-2 border-b border-gray-300">{crop.weightB}</Text>
            <Text className="w-32 p-2 border-b border-gray-300">{crop.unitPriceC}</Text>
            <Text className="w-32 p-2 border-b border-gray-300">{crop.weightC}</Text>
            <Text className="w-32 p-2 border-b border-gray-300">{crop.total}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  </View>
)}

      {/* QR Code Section
      {details && details.qrCode && officer && officer.QRcode && (
      <View className="mb-4 flex-row items-center justify-start">
        <View className="mr-4">
          <Image source={{ uri: details.qrCode }} style={{ width: 150, height: 150 }} />
          <Text className="font-bold ml-5 text-sm mb-2">Farmer's QR Code</Text>
        </View>

        <View>
          <Image source={{ uri: officer.QRcode }} style={{ width: 150, height: 150 }} />
          <Text className="font-bold ml-5 text-sm mb-2">Officer's QR Code</Text>
        </View>
      </View>
    )} */}



      <View className="flex-row justify-around w-full mb-7">
        <TouchableOpacity className="bg-[#2AAD7A] p-4 h-[80px] w-[120px] rounded-lg items-center" onPress={handleDownloadPDF}>
          <Image
            source={require('../../assets/images/download.png')} // Path to download icon
            style={{ width: 24, height: 24 }}
          />
          <Text className="text-sm text-cyan-50">Download</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-[#2AAD7A] p-4 h-[80px] w-[120px] rounded-lg items-center" onPress={handleSharePDF}>
          <Image
            source={require('../../assets/images/Share.png')} // Path to share icon
            style={{ width: 24, height: 24 }}
          />
          <Text className="text-sm text-cyan-50">Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default FarmerReport;