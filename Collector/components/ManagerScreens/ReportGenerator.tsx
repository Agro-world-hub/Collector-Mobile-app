import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type ReportGeneratorNavigationProp = StackNavigationProp<RootStackParamList, 'ReportGenerator'>;

interface ReportGeneratorProps {
  navigation: ReportGeneratorNavigationProp;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ navigation }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleGenerate = () => setReportGenerated(true);

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
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white rounded-b-[25px] px-4 pt-12 pb-6 items-center shadow-md">
        <TouchableOpacity onPress={() => navigation.goBack()} className="absolute top-6 left-4">
          <AntDesign name="left" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800">COO0127</Text>
      </View>

      {/* Form Section */}
      <View className="px-6 mt-8">
        {/* Start Date */}
        <View className="mb-6">
          <Text className="text-sm text-gray-700 mb-2">Start Date :</Text>
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
              onChange={(event, date) => handleDateChange(event, date, 'start')}
            />
          )}
        </View>

        {/* End Date */}
        <View className="mb-6">
          <Text className="text-sm text-gray-700 mb-2">End Date :</Text>
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
              onChange={(event, date) => handleDateChange(event, date, 'end')}
            />
          )}
        </View>

        {/* Buttons */}
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={handleReset} className="border border-gray-300 px-6 py-3 rounded-lg">
            <Text className="text-gray-700">Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGenerate} className="bg-green-600 px-6 py-3 rounded-lg">
            <Text className="text-white font-semibold">Generate</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Conditional UI Section */}
      {reportGenerated ? (
        <View className="items-center justify-center flex-1">
          <View className="w-24 h-24 bg-orange-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="document-text-outline" size={50} color="#F59E0B" />
          </View>
          <Text className="text-lg font-semibold text-gray-800">ID NO : COO0127M012</Text>
          <Text className="text-sm text-gray-500 italic mb-6">- Report has been generated -</Text>

          {/* Download and Share Buttons */}
          <View className="flex-row space-x-8">
            <TouchableOpacity className="bg-gray-200 p-5 rounded-lg items-center">
              <Ionicons name="download" size={24} color="#6B7280" />
              <Text className="text-sm text-gray-600 mt-1">Download</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-200 p-5 rounded-lg items-center">
              <Ionicons name="share-social" size={24} color="#6B7280" />
              <Text className="text-sm text-gray-600 mt-1">Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="items-center justify-center flex-1">
          <Image source={require('../../assets/images/empty.png')} className="w-20 h-20 mb-4" resizeMode="contain" />
          <Text className="text-gray-500 italic">- You have to set Time Duration first -</Text>
        </View>
      )}
    </View>
  );
};

export default ReportGenerator;
