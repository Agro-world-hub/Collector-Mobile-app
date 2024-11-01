import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import environment from '../environment';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { RootStackParamList } from './types';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type ReportPageNavigationProps = StackNavigationProp<RootStackParamList, 'ReportPage'>;
type ReportPageRouteProp = RouteProp<RootStackParamList, 'ReportPage'>;

interface ReportPageProps {
  navigation: ReportPageNavigationProps;
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
}


const ReportPage: React.FC<ReportPageProps> = ({ navigation }) => {
  const [details, setDetails] = useState<PersonalAndBankDetails | null>(null);
  const route = useRoute<ReportPageRouteProp>();
  const { userId } = route.params || {};
  const [crops, setCrops] = useState<Crop[]>([]);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No token found');
        return;
      }

      const [detailsResponse, cropsResponse] = await Promise.all([
        api.get(`api/farmer/report-user-details/${userId}`),
        api.get(`api/unregisteredfarmercrop/user-crops/today/${userId}`)
      ]);

      const data = detailsResponse.data;
      setDetails({
        userId: data.userId ?? "",
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        phoneNumber: data.phoneNumber ?? "",
        NICnumber: data.NICnumber ?? "",
        profileImage: data.profileImage ?? "",
        qrCode: data.qrCode ?? "",
        address: data.address ?? "",
        accNumber: data.accNumber ?? "",
        accHolderName: data.accHolderName ?? "",
        bankName: data.bankName ?? "",
        branchName: data.branchName ?? "",
      });

      setCrops(cropsResponse.data);

    } catch (error) {
      console.error('Error fetching details:', error);
      Alert.alert('Error', 'Failed to load details');
    }
  };

  const generatePDF = async () => {
    if (!details) {
      Alert.alert('Error', 'Details are missing for generating PDF');
      return '';
    }
  
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
  
    // Calculate total price from the crops array, ensuring total is treated as a number
    const totalSum = crops.reduce((sum: number, crop: Crop) => {
      return sum + Number(crop.total); // Ensure total is a number
    }, 0);
  
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; margin: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .qr-section { display: flex; flex-direction: column; align-items: flex-start; margin-top: 20px; }
            .qr-code { margin-bottom: 10px; }
            .total-row { font-weight: bold; margin-top: 10px; }
          </style>
        </head>
        <body>
          <h1>Purchase Report</h1>
          
          <h2>Personal Details</h2>
          <table>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>NIC Number</th>
              <th>Phone Number</th>
              <th>Address</th>
            </tr>
            <tr>
              <td>${details.firstName}</td>
              <td>${details.lastName}</td>
              <td>${details.NICnumber}</td>
              <td>${details.phoneNumber}</td>
              <td>${details.address}</td>
            </tr>
          </table>
    
          <h2>Bank Details</h2>
          <table>
            <tr>
              <th>Account Number</th>
              <th>Account Holder's Name</th>
              <th>Bank Name</th>
              <th>Branch Name</th>
            </tr>
            <tr>
              <td>${details.accNumber}</td>
              <td>${details.accHolderName}</td>
              <td>${details.bankName}</td>
              <td>${details.branchName}</td>
            </tr>
          </table>
          
          <h2>Crop Details</h2>
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
    
          <div class="total-row">
            <strong>Total Price:</strong> ${totalSum.toFixed(2)}
          </div>
    
          <div class="qr-section">
            <img src="${details.qrCode}" alt="QR Code" width="200" height="200" class="qr-code" />
            <h2>Farmer's QR Code</h2>
          </div>
        </body>
      </html>
    `;
    
    try {
      const { uri } = await Print.printToFileAsync({ html });
      return uri;
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF');
      return '';
    }
  };
  
  
  const handleDownloadPDF = async () => {
    const uri = await generatePDF();
  
    if (uri) {
      // Get the current date in YYYY-MM-DD format
      const date = new Date().toISOString().slice(0, 10);
      
      // Define the path for the PDF in the Downloads folder
      const downloadUri = `${FileSystem.documentDirectory}PurchaseReport_${date}.pdf`;
  
      // Request permission to access media library (for saving in external storage)
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status === 'granted') {
        try {
          // Move the generated PDF to the Downloads folder
          const fileUri = `${FileSystem.documentDirectory}PurchaseReport_${date}.pdf`;
          await FileSystem.moveAsync({
            from: uri,  // The original PDF URI generated
            to: downloadUri, // The new file name with the desired path
          });
  
          Alert.alert('Download Success', `PDF has been downloaded as PurchaseReport_${date}.pdf to your Downloads folder`);
        } catch (error) {
          console.error('Error downloading PDF:', error);
          Alert.alert('Error', 'Failed to download PDF');
        }
      } else {
        Alert.alert('Permission Denied', 'You need to grant permission to save the PDF.');
      }
    } else {
      Alert.alert('Error', 'PDF was not generated');
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
            source={require('../assets/images/back.png')} // Path to your back icon
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-[25%]">Purchase Report</Text>
      </View>

      {/* Personal Details Section */}
      {details && (
        <View className="mb-4">
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
                <Text className="w-32 p-2 border-r border-gray-300">{details.firstName}</Text>
                <Text className="w-32 p-2 border-r border-gray-300">{details.lastName}</Text>
                <Text className="w-32 p-2 border-r border-gray-300">{details.NICnumber}</Text>
                <Text className="w-32 p-2 border-r border-gray-300">{details.phoneNumber}</Text>
                <Text className="w-32 p-2">{details.address}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Bank Details Section */}
      {details && (
        <View className="mb-4">
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
                <Text className="w-32 p-2 border-r border-gray-300">{details.accNumber}</Text>
                <Text className="w-32 p-2 border-r border-gray-300">{details.accHolderName}</Text>
                <Text className="w-32 p-2 border-r border-gray-300">{details.bankName}</Text>
                <Text className="w-32 p-2">{details.branchName}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      )}

       {/* Crop Details Section */}
       {crops.length > 0 && (
  <View className="mb-4">
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

      {/* QR Code Section */}
      {details && details.qrCode && (
        <View className="mb-4">
          
          <Image source={{ uri: details.qrCode }} style={{ width: 150, height: 150 }} />
          <Text className="font-bold ml-5  text-sm mb-2">farmers Qr Code</Text>
        </View>
      )}


      <View className="flex-row justify-around w-full mb-7">
        <TouchableOpacity className="bg-[#2AAD7A] p-4 h-[80px] w-[120px] rounded-lg items-center" onPress={handleDownloadPDF}>
          <Image
            source={require('../assets/images/download.png')} // Path to download icon
            style={{ width: 24, height: 24 }}
          />
          <Text className="text-sm text-cyan-50">Download</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-[#2AAD7A] p-4 h-[80px] w-[120px] rounded-lg items-center" onPress={handleSharePDF}>
          <Image
            source={require('../assets/images/Share.png')} // Path to share icon
            style={{ width: 24, height: 24 }}
          />
          <Text className="text-sm text-cyan-50">Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ReportPage;
