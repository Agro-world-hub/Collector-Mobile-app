import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import {environment} from '@/environment/environment';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { RootStackParamList } from '../types';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import QRCode from 'react-native-qrcode-svg';
import { useTranslation } from "react-i18next";
import { AntDesign } from '@expo/vector-icons';

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type TransactionReportNavigationProps = StackNavigationProp<RootStackParamList, 'TransactionReport'>;
type TransactionReportRouteProp = RouteProp<RootStackParamList, 'TransactionReport'>;

interface TransactionReportProps {
  navigation: TransactionReportNavigationProps;
}

interface PersonalAndBankDetails {
  userId: string | null;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  NICnumber: string | null;
  profileImage: string | null;
  qrCode: string | null;
  accNumber: string | null;
  accHolderName: string | null;
  bankName: string | null;
  branchName: string | null;
  companyNameEnglish: string | null; // Added company name field
  collectionCenterName: string | null; // Added collection center field
}

interface Crop {
  id: number;
  cropName: string;
  cropNameSinhala: string;
  cropNameTamil: string;
  variety: string;
  varietyNameSinhala: string;
  varietyNameTamil: string;
  grade: string;
  unitPrice: string;
  quantity: string;
  subTotal: string;
  invoiceNumber: string;
}

interface officerDetails {
  QRCode: string;
  empId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

const TransactionReport: React.FC<TransactionReportProps> = ({ navigation }) => {
  const [details, setDetails] = useState<PersonalAndBankDetails | null>(null);
  const [officerDetails, setOfficerDetails] = useState<officerDetails | null>(null);
  const route = useRoute<TransactionReportRouteProp>();
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
  const [qrValue, setQrValue] = useState<string>("");
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
   const [selectedLanguage, setSelectedLanguage] = useState("en");
    console.log(";;;;;;;;",selectedLanguage)

  const fetchSelectedLanguage = async () => {
    try {
      const lang = await AsyncStorage.getItem("@user_language");
      if (lang === "en" || lang === "si" || lang === "ta") {
        setSelectedLanguage(lang);
      } else {
        setSelectedLanguage("en"); // Default to English if not found or invalid
      }
    } catch (error) {
      console.error("Error fetching language preference:", error);
    }
  };

  useEffect(() => {
    fetchSelectedLanguage(); 
  }, []);

  const getTextStyle = (language: string) => {
    if (language === "si") {
      return {
        fontSize: 14, // Smaller text size for Sinhala
        lineHeight: 20, // Space between lines
      };
    }
   
  };

  const getCropName = (crop: Crop) => {
    if (!crop) return "Loading...";
  
    switch (selectedLanguage) {
      case "si":
        return `${crop.cropNameSinhala} `;
      case "ta":
        return `${crop.cropNameTamil} `;
      default:
        return `${crop.cropName} `;
    }
  };

  const getVarietyName = (crop: Crop) => {
    if (!crop) return "Loading...";
  
    switch (selectedLanguage) {
      case "si":
        return `${crop.varietyNameSinhala} `;
      case "ta":
        return `${crop.varietyNameTamil} `;
      default:
        return `${crop.variety} `;
    }
  };
  
  // Safe reduce with proper type handling
  const totalSum = (crops || []).reduce((sum: number, crop: Crop) => {
    const subTotal = typeof crop.subTotal === 'string' 
      ? parseFloat(crop.subTotal) 
      : crop.subTotal || 0;
    return sum + subTotal;
  }, 0);

  const formatNumberWithCommas = (value: number | string): string => {
    // Convert to number if it's a string
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    // Format with 2 decimal places and add commas for thousands
    return numValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Replace the current formatNumber function with this one
  const formatNumber = (value: number | string): string => {
    if (typeof value === 'string') {
      return formatNumberWithCommas(parseFloat(value));
    }
    return formatNumberWithCommas(value);
  };

  const fetchOfficerDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert(t("Error.error"), t("Error.No token found"));
        return;
      }

      const response = await api.get("api/collection-officer/user-profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.data;
      console.log(data);

      if (response.data.status === "success") {
        const officerDetails = {
          empId: data.empId,
          QRCode: data.QRcode,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber
        };

        setOfficerDetails(officerDetails);
        const qrData = JSON.stringify(officerDetails);
        setQrValue(qrData);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching officer details:", error);
      Alert.alert(t("Error.error"), t("Error.Failed to fetch details"));
    }
  };

  useEffect(() => {
    fetchOfficerDetails();
    fetchDetails();
  }, []);
  
  


  const fetchDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert(t("Error.error"), t("Error.No token found"));
        return;
      }
      
      console.log('Fetching details for userId:', userId, 'and registeredFarmerId:', registeredFarmerId);
      
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      
      // Make requests separately to identify which one is failing
      try {
        const detailsResponse = await api.get(`api/farmer/report-user-details/${userId}`, {
          headers
        });
        console.log('Details response successful:', detailsResponse.data);
        
        // Process details response...
        const data = detailsResponse.data;
        setDetails({
          userId: data.userId ?? "",
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          phoneNumber: data.phoneNumber ?? "",
          NICnumber: data.NICnumber ?? "",
          profileImage: data.profileImage ?? "",
          qrCode: data.qrCode ?? "",
          accNumber: data.accNumber ?? "",
          accHolderName: data.accHolderName ?? "",
          bankName: data.bankName ?? "",
          branchName: data.branchName ?? "",
          companyNameEnglish: data.companyNameEnglish ?? "company name",
          collectionCenterName: data.centerName ?? "Collection Center",
        });
      } catch (detailsError) {
        console.error('Error fetching user details:', detailsError);
        if (axios.isAxiosError(detailsError)) {
          console.log('Details error response:', detailsError.response?.data);
        } else {
          console.log('Details error:', detailsError);
        }
      }
      
      try {
        const cropsResponse = await api.get(`api/collection-manager/transaction-details/${userId}/${selectedDate}/${registeredFarmerId}`, {
          headers
        });
        console.log('Crops response successful:', cropsResponse.data);
        
        // Process crops response...
        const cropsData = cropsResponse.data?.data || cropsResponse.data || [];
        console.log('Crops data:', cropsData);
        setCrops(Array.isArray(cropsData) ? cropsData : []);
      } catch (cropsError) {
        console.error('Error fetching crops:', cropsError);
        if (axios.isAxiosError(cropsError)) {
          console.log('Crops error response:', cropsError.response?.data);
        } else {
          console.log('Crops error response:', cropsError);
        }
        setCrops([]);
      }
      
    } catch (error) {
      console.error('Error in fetchDetails:', error);
      Alert.alert(t("Error.error"), t("Error.Failed to load details"));
      setCrops([]);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!details || !officerDetails) {
      Alert.alert(t("Error.error"), t("Error.Details are missing for generating PDF"));
      return '';
    }
  
    const totalSum = crops.reduce((sum: number, crop: Crop) => {
      return sum + Number(crop.subTotal);
    }, 0);

  
    const html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            font-size: 10px; /* Base font size for body text */
            background-color: white;
            max-width: 800px;
            margin: 0 auto;
            padding: 30px;
            box-sizing: border-box;
            border-radius: 20px;
            overflow: hidden;
          }
          h1 {
            text-align: center;
            font-size: 22px; /* Increased main title size */
            margin-bottom: 15px;
            font-weight: bold;
          }
          .header-line {
            border-top: 1px solid #000;
            margin: 5px 0 15px 0;
          }
          .header-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
          }
          .header-item {
            margin-bottom: 5px;
            font-size: 11px; /* Slightly larger for header items */
          }
          .section-title {
            font-weight: bold;
            margin-bottom: 5px;
            font-size: 14px; /* Larger for section titles */
          }
          .supplier-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
          }
          .supplier-section div div:not(.section-title) {
            font-size: 10px; /* Regular size for supplier details */
          }
          .received-by-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
          }
          .received-by-section div div:not(.section-title) {
            font-size: 10px; /* Regular size for receiver details */
          }
          .table-title {
            font-weight: bold;
            margin: 15px 0 5px 0;
            text-align: center;
            background-color: #D6E6F4;
            padding: 8px;
            border: 1px solid #000;
            font-size: 16px; /* Larger font for table title */
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            background-color: white;
          }
          th {
            background-color:rgb(255, 255, 255);
            text-align: center;
            padding: 8px;
            border: 1px solid #000;
            font-weight: bold;
            font-size: 12px; /* Larger for table headers */
          }
          td {
            padding: 8px;
            text-align: center;
            border: 1px solid #000;
            background-color: white;
            font-size: 10px; /* Normal size for table data */
          }
          .total-row {
            display: flex;
            justify-content: flex-end;
            margin: 10px 0;
          }
          .total-box {
            display: flex;
            background-color: white;
            border: 1px solid #000;
          }
          .total-label {
            padding: 8px;
            font-weight: bold;
            border-right: 1px solid #000;
            background-color: #D6E6F4;
            font-size: 13px; /* Larger for total label */
          }
          .total-value {
            padding: 8px;
            min-width: 150px;
            text-align: center;
            font-weight: bold;
            font-size: 13px; /* Larger for total value */
          }
          .note {
            font-size: 11px; /* Smaller for the note text */
            margin: 15px 0;
            font-style: italic;
            text-align: justify;
          }
          .qr-section {
            display: flex;
            justify-content: space-around;
            margin-top: 20px;
          }
          .qr-container {
            text-align: center;
          }
          .qr-code {
            width: 100px;
            height: 100px;
            display: block;
            margin: 0 auto;
          }
          .qr-label {
            margin-top: 5px;
            font-weight: bold;
            font-size: 11px; /* Slightly larger for QR labels */
          }
          .button-container {
            display: flex;
            justify-content: center;
            margin-top: 20px;
            gap: 20px;
          }
          .button {
            width: 40px;
            height: 40px;
            background-color: black;
            border-radius: 5px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 8px;
            text-align: center;
          }
          .button-icon {
            font-size: 14px;
            margin-bottom: 3px;
          }
        </style>
      </head>
      <body>
        <h1>${t("NewReport.Goods Received Note")}</h1>
        <div class="header-line"></div>
        
        <div class="header-row">
          <div class="header-item">
            <strong>${t("NewReport.GRN No")}</strong> ${crops.length > 0 ? crops[0].invoiceNumber : 'N/A'}
          </div>
          <div class="header-item">
            <strong>${t("NewReport.Date")}</strong> ${selectedDate}
          </div>
        </div>
        
        <div class="supplier-section">
          <div>
            <div class="section-title">${t("NewReport.Supplier Details")}</div>
            <div>${t("NewReport.Name")} ${details.firstName} ${details.lastName}</div>
          </div>
          <div>
            <div>&nbsp;</div>
            <div>${details.phoneNumber}</div>
          </div>
        </div>
        
        <div class="received-by-section">
          <div>
            <div class="section-title">${t("NewReport.Received By")}</div>
            <div>${t("NewReport.Company Name")} ${details.companyNameEnglish || ''}</div>
          </div>
          <div>
            <div>&nbsp;</div>
            <div>${t("NewReport.Centre")} ${details.collectionCenterName || 'Collection Center'}</div>
          </div>
        </div>
        
        <div class="table-title">${t("NewReport.Received Items")}</div>
        <table>
          <thead>
            <tr>
             <th>${t("NewReport.Crop Name")}</th>
              <th>${t("NewReport.Variety")}</th>
              <th>${t("NewReport.Grade")}</th>
              <th>${t("NewReport.Unit Price(Rs.)")}</th>
              <th>${t("NewReport.Quantity(kg)")}</th>
              <th>${t("NewReport.Sub Total(Rs.)")}</th>
            </tr>
          </thead>
          <tbody>
            ${crops.map(crop => `
              <tr>
               <td>${getCropName(crop)}</td>
                <td>${getVarietyName(crop)}</td>
                <td>${crop.grade || '-'}</td>
                <td>${formatNumberWithCommas(parseFloat(crop.unitPrice))}</td>
                <td>${formatNumberWithCommas(parseFloat(crop.quantity))}</td>
                <td>${formatNumberWithCommas(parseFloat(crop.subTotal))}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total-row">
          <div class="total-box">
            <div class="total-label">${t("NewReport.Full Total (Rs.) Rs.")}</div>
            <div class="total-value">Rs.${formatNumberWithCommas(totalSum)}</div>
          </div>
        </div>
        
        <div class="note">
          <strong>${t("NewReport.Note")}</strong> ${t("NewReport.GRNnote")}
        </div>
      </body>
    </html>
    `;
    try {
      const { uri } = await Print.printToFileAsync({ html });
      console.log('PDF generated at:', uri);
      return uri;
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert(t("Error.error"), t("Error.PDF was not generated."));
      return '';
    }
  };

  const handleDownloadPDF = async () => {
    const uri = await generatePDF();
  
    if (uri) {
      const date = new Date().toISOString().slice(0, 10);
      const fileName = `GRN_${crops.length > 0 ? crops[0].invoiceNumber : 'N/A'}_${date}.pdf`;
  
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
  
        if (status === 'granted') {
          const tempUri = `${FileSystem.cacheDirectory}${fileName}`;
          await FileSystem.copyAsync({
            from: uri,
            to: tempUri,
          });
  
          const asset = await MediaLibrary.createAssetAsync(tempUri);
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
        Alert.alert(t("Error.error"), t("Error.Failed to save PDF to Downloads folder."));
      }
    } else {
      Alert.alert(t("Error.error"), t("Error.PDF was not generated."));
    }
  };
  
  const handleSharePDF = async () => {
    const uri = await generatePDF();
    if (uri && (await Sharing.isAvailableAsync())) {
      // Create a descriptive filename by renaming the file before sharing
      const fileName = `PurchaseReport_${crops.length > 0 ? crops[0].invoiceNumber : 'N/A'}_${selectedDate}.pdf`;
      
      // Create a new file with the desired name
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const newUri = `${FileSystem.cacheDirectory}${fileName}`;
      
      try {
        // Copy the file to a new location with the desired name
        await FileSystem.copyAsync({
          from: uri,
          to: newUri
        });
        
        // Share the renamed file
        await Sharing.shareAsync(newUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Purchase Report',
          UTI: 'com.adobe.pdf'
        });
      } catch (error) {
        console.error('Error sharing PDF with custom name:', error);
        // Fallback to sharing with original uri if renaming fails
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Purchase Report',
          UTI: 'com.adobe.pdf'
        });
      }
    } else {
      Alert.alert(t("Error.error"), t("Error.Sharing is not available on this device"));
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => navigation.navigate("Main" as any)}>
          <AntDesign name="left" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-center w-full">{t("NewReport.Goods Received Note")}</Text>
      </View>

      {/* GRN Header */}
      <View className="mb-4">
        <Text className="text-sm font-bold">{t("NewReport.GRN No")}: {crops.length > 0 ? crops[0].invoiceNumber : 'N/A'}</Text>
        <Text className="text-sm">{t("NewReport.Date")} {selectedDate}</Text>
      </View>

      {/* Supplier Details */}
      <View className="mb-4">
        <Text className="font-bold text-sm mb-1">{t("NewReport.Supplier Details")}</Text>
        <View className="border border-gray-300 rounded-lg p-2">
          <Text><Text className="font-bold">{t("NewReport.Name")}</Text> {details?.firstName} {details?.lastName}</Text>
          <Text><Text className="font-bold">{t("NewReport.Phone")}</Text> {details?.phoneNumber}</Text>
        </View>
      </View>

      {/* Received By */}
      <View className="mb-4">
        <Text className="font-bold text-sm mb-1">{t("NewReport.Received By")}</Text>
        <View className="border border-gray-300 rounded-lg p-2">
          <Text><Text className="font-bold">{t("NewReport.Company Name")}</Text> {details?.companyNameEnglish || ''}</Text>
          <Text><Text className="font-bold">{t("NewReport.Centre")}</Text> {details?.collectionCenterName || 'Collection Center'}</Text>
        </View>
      </View>

      {/* Divider */}
      <View className="border-t border-gray-400 my-2"></View>

      {/* Received Items */}
      <View className="mb-4">
        <Text className="font-bold text-sm mb-2">{t("NewReport.Received Items")}</Text>
       <ScrollView horizontal className="border border-gray-300 rounded-lg">
  <View>
    {/* Table Header */}
    <View className="flex-row bg-gray-200">
      <Text className="w-24 p-2 font-bold border-r border-gray-300">{t("NewReport.Crop Name")}</Text>
      <Text className="w-24 p-2 font-bold border-r border-gray-300">{t("NewReport.Variety")}</Text>
      <Text className="w-20 p-2 font-bold border-r border-gray-300">{t("NewReport.Grade")}</Text>
      <Text className="w-24 p-2 font-bold border-r border-gray-300">{t("NewReport.Unit Price(Rs.)")}</Text>
      <Text className="w-24 p-2 font-bold border-r border-gray-300">{t("NewReport.Quantity(kg)")}</Text>
      <Text className="w-24 p-2 font-bold">{t("NewReport.Sub Total(Rs.)")}</Text>
    </View>
    
    {/* Table Rows */}
    {crops.map((crop, index) => (
      <View key={`${crop.id}-${index}`} className="flex-row">
       <Text className="w-24 p-2 border-b border-gray-300"> {getCropName(crop)}</Text>
               <Text className="w-24 p-2 border-b border-gray-300">{getVarietyName(crop)}</Text>
        <Text className="w-20 p-2 border-b border-gray-300">{crop.grade || '-'}</Text>
        <Text className="w-24 p-2 border-b border-gray-300 text-right">
          {formatNumber(crop.unitPrice)}
        </Text>
        <Text className="w-24 p-2 border-b border-gray-300 text-right">
          {formatNumber(crop.quantity)}
        </Text>
        <Text className="w-24 p-2 border-b border-gray-300 text-right">
          {formatNumberWithCommas(totalSum)}
        </Text>
      </View>
    ))}
  </View>
</ScrollView>
      </View>

      {/* Divider */}
      <View className="border-t border-gray-400 my-2"></View>

      {/* Total */}
      <View className="mb-4 items-end">
        <Text className="font-bold">{t("NewReport.Full Total (Rs.) Rs.")}{totalSum.toFixed(2)}</Text>
      </View>

      {/* Divider */}
      <View className="border-t border-gray-400 my-2"></View>

      {/* Note */}
      <View className="mb-4">
        <Text className="text-xs">
          <Text className="font-bold">{t("NewReport.Note")}</Text> {t("NewReport.GRNnote")}
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-around w-full mb-7">
        <TouchableOpacity className="bg-black p-4 h-[80px] w-[120px] rounded-lg justify-center items-center" onPress={handleDownloadPDF}>
          <Image
            source={require('../../assets/images/download.webp')}
            style={{ width: 24, height: 24 }}
          />
          <Text className="text-sm text-cyan-50">{t("NewReport.Download")}</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-black p-4 h-[80px] w-[120px] rounded-lg justify-center items-center" onPress={handleSharePDF}>
          <Image
            source={require('../../assets/images/Share.webp')}
            style={{ width: 24, height: 24 }}
          />
          <Text className="text-sm text-cyan-50">{t("NewReport.Share")}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default TransactionReport;