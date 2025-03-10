import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { handleGeneratePDF } from './ReportPDFGenerator';
import * as Sharing from 'expo-sharing';
import { RouteProp } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import {  Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from "react-i18next";



type ReportGeneratorNavigationProp = StackNavigationProp<RootStackParamList, 'ReportGenerator'>;

type ReportGeneratorRouteProp = RouteProp<RootStackParamList, 'ReportGenerator'>;

interface ReportGeneratorProps {
  navigation: ReportGeneratorNavigationProp;
  route: ReportGeneratorRouteProp;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ navigation,route }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [generatedReportId, setGeneratedReportId] = useState<string | null>(null);
  const { t } = useTranslation();
  
  const { officerId,collectionOfficerId } = route.params;
  console.log(officerId);
  
  const getTodayInColombo = () => {
    const now = new Date();
    const colomboOffset = 330; // Colombo is UTC+5:30
    const utcOffset = now.getTimezoneOffset();
    const colomboTime = new Date(now.getTime() + (colomboOffset - utcOffset) * 60 * 1000);
    colomboTime.setHours(0, 0, 0, 0); // Normalize to midnight
    return colomboTime;
  };
  

  const handleGenerate = async () => {
    if (!startDate || !endDate) {
      Alert.alert('Error', 'Please select both start and end dates.');
      return;
    }
  
    
    
    
    if (endDate < startDate) {
      Alert.alert('Error', 'End date cannot be earlier than the start date.');
      return;
    }
    
    // Proceed with PDF generation
    const fileUri = await handleGeneratePDF(formatDate(startDate), formatDate(endDate), officerId, collectionOfficerId);
    if (fileUri) {
      const reportIdMatch = fileUri.match(/report_(.+)\.pdf/);
      const reportId = reportIdMatch ? reportIdMatch[1] : null;
  
      setGeneratedReportId(reportId); // Store the report ID to display in the UI
      setReportGenerated(true);
      Alert.alert('Success', 'PDF Generated Successfully!');
    } else {
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };
  

  
  const handleDownload = async () => {
    if (!startDate || !endDate) {
      Alert.alert('Error', 'Please select both start and end dates.');
      return;
    }
  
    try {
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'You need to grant storage permissions to save the file.');
        return;
      }
  
      // Generate the PDF
      const fileUri = await handleGeneratePDF(
        formatDate(startDate),
        formatDate(endDate),
        officerId,
        collectionOfficerId
      );
  
      if (!fileUri) {
        Alert.alert('Error', 'Failed to generate PDF.');
        return;
      }
  
      // Define the new file name
      const date = new Date().toISOString().slice(0, 10); // Get the current date (YYYY-MM-DD)
      const fileName = `Report_${officerId}_${date}.pdf`; // Example file name
      const tempUri = `${FileSystem.cacheDirectory}${fileName}`;
  
      // Copy the file to a new path with the desired name
      await FileSystem.copyAsync({
        from: fileUri, // Original URI
        to: tempUri, // New URI with the desired file name
      });
  
      if (Platform.OS === 'android') {
        // Save to Media Library (Downloads folder)
        const asset = await MediaLibrary.createAssetAsync(tempUri);
        const album = await MediaLibrary.getAlbumAsync('Download');
  
        if (!album) {
          await MediaLibrary.createAlbumAsync('Download', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
  
        Alert.alert('Success', `File saved as ${fileName} in the Downloads folder.`);
      } else {
        // For iOS, inform the user about the app's document directory
        Alert.alert('Success', `File saved to app's directory: ${tempUri}`);
      }
    } catch (error) {
      console.error('Failed to save file:', error);
      Alert.alert('Error', 'An error occurred while saving the file.');
    }
  };
  
  
  const handleShare = async () => {
    if (!startDate || !endDate) {
      Alert.alert('Error', 'Please select both start and end dates.');
      return;
    }
  
    const fileUri = await handleGeneratePDF(formatDate(startDate), formatDate(endDate), officerId,collectionOfficerId);
    if (fileUri && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(fileUri, { mimeType: 'application/pdf' });
    } else {
      Alert.alert('Error', 'Sharing is not available on this device.');
    }
  };

  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setReportGenerated(false);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Select Date';
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined, type: string) => {
    if (event.type === 'set') { // User confirmed
      if (type === 'start') {
        setStartDate(selectedDate || startDate);
        setShowStartPicker(false);
      } else {
        setEndDate(selectedDate || endDate);
        setShowEndPicker(false);
      }
    } else {
      // User cancelled
      if (type === 'start') setShowStartPicker(false);
      else setShowEndPicker(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
   
      {/* Header */}
      <View className="bg-white rounded-b-[25px] px-4 pt-12 pb-6 items-center shadow-md">
        <TouchableOpacity onPress={() => navigation.goBack()} className="absolute top-6 left-4">
          <AntDesign name="left" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">{officerId}</Text>
      </View>

      {/* Form Section */}
      <View className="px-6 mt-8">
        {/* Start Date */}
        <View className="mb-6">
          <Text className="text-sm text-gray-700 mb-2">{t("ReportGenerator.Start Date")}</Text>
          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            className="border border-gray-300 rounded-lg px-4 py-3"
          >
            <Text className="text-gray-500">{formatDate(startDate)}</Text>
          </TouchableOpacity>
          {showStartPicker && (
           <DateTimePicker
           value={startDate || new Date()}
           mode="date"
           display="default"
           maximumDate={getTodayInColombo()} // Disallow future dates
           onChange={(event, date) => handleDateChange(event, date, 'start')}
         />
          )}
        </View>

        {/* End Date */}
        <View className="mb-6">
          <Text className="text-sm text-gray-700 mb-2">{t("ReportGenerator.End Date")}</Text>
          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            className="border border-gray-300 rounded-lg px-4 py-3"
          >
            <Text className="text-gray-500">{formatDate(endDate)}</Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            maximumDate={getTodayInColombo()} // Disallow future dates 
            minimumDate={startDate} // End date must not be earlier than the start date
            onChange={(event, date) => handleDateChange(event, date, 'end')}
          />
          )}
        </View>

        {/* Buttons */}
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={handleReset} className="border border-gray-300 px-6 py-3 rounded-lg">
            <Text className="text-gray-700">{t("ReportGenerator.Reset")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGenerate} className="bg-green-600 px-6 py-3 rounded-lg">
            <Text className="text-white font-semibold">{t("ReportGenerator.Generate")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Conditional UI Section */}
      {reportGenerated ? (
        <View className="items-center justify-center flex-1">
          <View className="w-24 h-24 bg-orange-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="document-text-outline" size={50} color="#F59E0B" />
          </View>
          <Text className="text-lg font-semibold text-gray-800">{t("ReportGenerator.IDNO")} {generatedReportId}</Text>
          <Text className="text-sm text-gray-500 italic mb-6">{t("ReportGenerator.Report has been generated")}</Text>

          {/* Download and Share Buttons */}
          <View className="flex-row space-x-8">
            <TouchableOpacity
              onPress={handleDownload}
              className="bg-[#A4A4A4] rounded-lg items-center justify-center"
              style={{ width: 100, height: 80 }} // Explicit width and height
            >
              <Ionicons name="download" size={24} color="white" />
              <Text className="text-sm text-white mt-1">{t("ReportGenerator.Download")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              className="bg-[#A4A4A4] rounded-lg items-center justify-center"
              style={{ width: 100, height: 80 }} // Explicit width and height
            >
              <Ionicons name="share-social" size={24} color="white" />
              <Text className="text-sm text-white mt-1">{t("ReportGenerator.Share")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="items-center justify-center flex-1">
          <Image source={require('../../assets/images/empty.webp')} className="w-20 h-20 mb-4" resizeMode="contain" />
          <Text className="text-gray-500 italic">{t("ReportGenerator.Time Duration first")}</Text>
        </View>
      )}

    </ScrollView>
  );
};

export default ReportGenerator;
