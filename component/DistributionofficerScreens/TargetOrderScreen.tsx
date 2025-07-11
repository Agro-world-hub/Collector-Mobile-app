import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { RootStackParamList } from '../types';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {environment }from '@/environment/environment';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native'; // Import LottieView
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";

type TargetOrderScreenNavigationProps = StackNavigationProp<RootStackParamList, 'TargetOrderScreen'>;

interface TargetOrderScreenProps {
  navigation: TargetOrderScreenNavigationProps;
}



interface TargetData {
  id: string;
  invoiceNo: string;
  varietyNameEnglish: string;
  varietyNameSinhala: string;
  varietyNameTamil: string;
  grade: string;
  target: number;
  complete: number;
  todo: number;
  status: 'Pending' | 'Opened' | 'Completed' | 'In Progress';
  createdAt: string;
  updatedAt: string;
  completedTime?: string | null;
}


const TargetOrderScreen: React.FC<TargetOrderScreenProps> = ({ navigation }) => {
  const [todoData, setTodoData] = useState<TargetData[]>([]);
  const [completedData, setCompletedData] = useState<TargetData[]>([]);
  const [centerCode, setcenterCode] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedToggle, setSelectedToggle] = useState('ToDo');
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const fetchSelectedLanguage = async () => {
    try {
      const lang = await AsyncStorage.getItem("@user_language");
      setSelectedLanguage(lang || "en");
    } catch (error) {
      console.error("Error fetching language preference:", error);
    }
  };

  const getGradePriority = (grade: string): number => {
    switch (grade) {
      case 'A': return 1;
      case 'B': return 2;
      case 'C': return 3;
      default: return 4;
    }
  };

  const getVarietyNameForSort = (item: TargetData) => {
    switch (selectedLanguage) {
      case "si":
        return item.varietyNameSinhala || '';
      case "ta":
        return item.varietyNameTamil || '';
      default:
        return item.varietyNameEnglish || '';
    }
  };

  const sortByVarietyAndGrade = (data: TargetData[]) => {
    return [...data].sort((a, b) => {
      const nameA = getVarietyNameForSort(a);
      const nameB = getVarietyNameForSort(b);
      const nameComparison = nameA.localeCompare(nameB);
      
      if (nameComparison === 0) {
        return getGradePriority(a.grade) - getGradePriority(b.grade);
      }
      
      return nameComparison;
    });
  };

  const fetchTargets = async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      // Hardcoded data to demonstrate all 4 statuses
      const hardcodedData = [
        {
          id: '1',
          invoiceNo: '241205000020',
          varietyNameEnglish: 'Tea Variety A',
          varietyNameSinhala: 'තේ වර්ගය A',
          varietyNameTamil: 'தேயிலை வகை A',
          grade: 'A',
          target: 100,
          complete: 0,
          todo: 100,
          status: 'Pending',
          createdAt: '2025-05-26T08:00:00Z',
          updatedAt: '2025-05-26T08:00:00Z',
          completedTime: null
        },
        {
          id: '2',
          invoiceNo: '241205000021',
          varietyNameEnglish: 'Tea Variety B',
          varietyNameSinhala: 'තේ වර්ගය B',
          varietyNameTamil: 'தேயிலை வகை B',
          grade: 'B',
          target: 150,
          complete: 0,
          todo: 150,
          status: 'Opened',
          createdAt: '2025-05-26T09:00:00Z',
          updatedAt: '2025-05-26T09:00:00Z',
          completedTime: null
        },
        {
          id: '3',
          invoiceNo: '241205000022',
          varietyNameEnglish: 'Tea Variety C',
          varietyNameSinhala: 'තේ වර්ගය C',
          varietyNameTamil: 'தேயிலை வகை C',
          grade: 'A',
          target: 200,
          complete: 75,
          todo: 125,
          status: 'Pending',
          createdAt: '2025-05-26T07:00:00Z',
          updatedAt: '2025-05-26T10:30:00Z',
          completedTime: null
        },
        {
          id: '4',
          invoiceNo: '241205000023',
          varietyNameEnglish: 'Tea Variety D',
          varietyNameSinhala: 'තේ වර්ගය D',
          varietyNameTamil: 'தேயிலை வகை D',
          grade: 'C',
          target: 120,
          complete: 120,
          todo: 0,
          status: 'Opened',
          createdAt: '2025-05-26T06:00:00Z',
          updatedAt: '2025-05-26T11:00:00Z',
          completedTime: '2025/05/26 11:00AM'
        },
        // Add more data for demonstration
        {
          id: '5',
          invoiceNo: '241205000024',
          varietyNameEnglish: 'Tea Variety E',
          varietyNameSinhala: 'තේ වර්ගය E',
          varietyNameTamil: 'தேயிலை வகை E',
          grade: 'B',
          target: 80,
          complete: 0,
          todo: 80,
          status: 'Completed',
          createdAt: '2025-05-26T12:00:00Z',
          updatedAt: '2025-05-26T12:00:00Z',
          completedTime: null
        }
      ];

      // Process the hardcoded data
      const allData = hardcodedData.map((item: any) => ({
        ...item,
        target: Number(item.target || 0),
        complete: Number(item.complete || 0),
        todo: Number(item.todo || 0),
      }));

      const todoItems = allData.filter((item: TargetData) => 
        ['Pending',  'Opened'].includes(item.status || '')
      );
      const completedItems = allData.filter((item: TargetData) => 
        item.status === 'Completed'
      );

      setTodoData(sortByVarietyAndGrade(todoItems));
      setCompletedData(sortByVarietyAndGrade(completedItems));
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(t("Error.Failed to fetch data."));
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = 2000 - elapsedTime;
      setTimeout(() => setLoading(false), remainingTime > 0 ? remainingTime : 0);
    }
  };

  // Navigation function for row clicks
  const handleRowPress = (item: TargetData) => {
   const navigationParams = {
    item: item,
    centerCode: centerCode || '', // Ensure centerCode is not null
    status: item.status,
    allData: selectedToggle === 'ToDo' ? todoData : completedData
  };

    // Navigate to different screens based on status
   switch (item.status) {
    case 'Pending':
      navigation.navigate('PendingOrderScreen', navigationParams);
      break;
    case 'Opened':
      navigation.navigate('PendingOrderScreen', navigationParams);
      break;
    case 'In Progress':
      navigation.navigate('PendingOrderScreen', navigationParams);
      break;
    case 'Completed':
      navigation.navigate('PendingOrderScreen', navigationParams);
      break;
    default:
      // Fallback navigation
      navigation.navigate('PendingOrderScreen', navigationParams);
      break;
  }
  };

  const formatCompletionTime = (dateString: string | null): string | null => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      
      return `${year}/${month}/${day} ${displayHours.toString().padStart(2, '0')}:${minutes}${ampm}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchSelectedLanguage();
      await fetchTargets();
      const centerCode = await AsyncStorage.getItem('centerCode');
      setcenterCode(centerCode);
    };
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTargets();
    setRefreshing(false);
  };

  const displayedData = selectedToggle === 'ToDo' ? todoData : completedData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': 
        return 'bg-[#FFB9B7] border border-[#FFB9B7] text-[#D16D6A]';
      case 'Opened': 
        return 'bg-[#F8FFA6] border border-[#F8FFA6] text-[#A8A100]';
      case 'In Progress': 
        return 'bg-blue-100 border border-blue-300 text-blue-700';
      // case 'Completed': 
      //   return 'bg-[#BBFFC6] border border-[#BBFFC6] text-[#308233]';
      default: 
        return 'bg-gray-100 border border-gray-300 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'Pending': t("Pending") || 'Pending',
      'Opened': t("Opened") || 'Opened', 
      'In Progress': t("InProgress") || 'In Progress',
      'Completed': t("Completed") || 'Completed'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  return (
    <View className="flex-1 bg-[#282828]">
      {/* Header */}
      <View className="bg-[#282828] px-4 py-6 flex-row justify-center items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="absolute left-4">
          <AntDesign name="left" size={22} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">{t("TargetOrderScreen.My Daily Target")}</Text>
      </View>

      {/* Toggle Buttons */}
      <View className="flex-row justify-center items-center py-4 bg-[#282828] px-4">
        <TouchableOpacity
          className={`flex-1 mx-2 py-3 rounded-full flex-row items-center justify-center ${
            selectedToggle === 'ToDo' ? 'bg-[#2AAD7A]' : 'bg-white'
          }`}
          onPress={() => setSelectedToggle('ToDo')}
        >
          <Text className={`font-bold mr-2 ${selectedToggle === 'ToDo' ? 'text-white' : 'text-black'}`}>
            {t("TargetOrderScreen.Todo")}
          </Text>
          <View className={`rounded-full px-2 py-1 ${selectedToggle === 'ToDo' ? 'bg-white' : 'bg-[#2AAD7A]'}`}>
            <Text className={`font-bold text-xs ${selectedToggle === 'ToDo' ? 'text-[#2AAD7A]' : 'text-white'}`}>
              {todoData.length.toString().padStart(2, '0')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 mx-2 py-3 rounded-full flex-row items-center justify-center ${
            selectedToggle === 'Completed' ? 'bg-[#2AAD7A]' : 'bg-white'
          }`}
          onPress={() => setSelectedToggle('Completed')}
        >
          <Text className={`font-bold mr-2 ${selectedToggle === 'Completed' ? 'text-white' : 'text-black'}`}>
            {t("TargetOrderScreen.Completed")}
          </Text>
          <View className={`rounded-full px-2 py-1 ${selectedToggle === 'Completed' ? 'bg-white' : 'bg-[#2AAD7A]'}`}>
            <Text className={`font-bold text-xs ${selectedToggle === 'Completed' ? 'text-[#2AAD7A]' : 'text-white'}`}>
              {completedData.length.toString().padStart(2, '0')}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 bg-white"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Table Header */}
        <View className="flex-row bg-[#2AAD7A] py-3">
          <Text className="flex-1 text-center text-white font-bold">{t("TargetOrderScreen.No")}</Text>
          <Text className="flex-[2] text-center text-white font-bold">{t("TargetOrderScreen.Invoice No")}</Text>
          <Text className="flex-[2] text-center text-white font-bold">
            {selectedToggle === 'ToDo' ? t("TargetOrderScreen.Status") : "Completed Time"}
          </Text>
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <LottieView
              source={require('../../assets/lottie/collector.json')}
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
          </View>
        ) : displayedData.length > 0 ? (
          displayedData.map((item, index) => (
            <TouchableOpacity
              key={index}
              className={`flex-row py-4 border-b border-gray-200 ${
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              }`}
              onPress={() => handleRowPress(item)}
              activeOpacity={0.7}
            >
              {/* Row Number */}
              <View className="flex-1 items-center justify-center relative">
                {selectedToggle === 'ToDo' ? (
                  <Text className="text-center font-medium">{(index + 1).toString().padStart(2, '0')}</Text>
                ) : (
                  <Ionicons name="flag" size={20} color="#2AAD7A" />
                )}
              </View>

              {/* Invoice Number */}
              <View className="flex-[2] items-center justify-center px-2">
                <Text className="text-center font-medium text-gray-800">
                  {item.invoiceNo || `INV${item.id || (index + 1).toString().padStart(6, '0')}`}
                </Text>
              </View>

              {/* Status or Completed Time */}
              <View className="flex-[2] items-center justify-center px-2">
                {selectedToggle === 'ToDo' ? (
                  <View className={`px-3 py-2 rounded-lg ${getStatusColor(item.status || 'Pending')}`}>
                    <Text className="text-xs font-medium text-center">
                      {getStatusText(item.status || 'Pending')}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-center text-gray-600 text-sm">
                    {item.completedTime || formatCompletionTime(item.updatedAt as any) || 'N/A'}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="flex-1 justify-center items-center py-20">
            <LottieView
              source={require('../../assets/lottie/NoComplaints.json')}
              autoPlay
              loop
              style={{ width: 150, height: 150 }}
            />
            <Text className="text-gray-500 mt-4 text-center">
              {selectedToggle === 'ToDo' 
                ? t("DailyTarget.NoTodoItems") || "No items to do"
                : t("DailyTarget.noCompletedTargets") || "No completed items"
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default TargetOrderScreen;