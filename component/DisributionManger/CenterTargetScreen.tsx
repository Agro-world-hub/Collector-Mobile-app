import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { RootStackParamList } from '../types';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { environment } from '@/environment/environment';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";
import { RouteProp } from '@react-navigation/native';

type CenterTargetScreenNavigationProps = StackNavigationProp<RootStackParamList, 'CenterTargetScreen'>;
type CenterTargetScreenRouteProp = RouteProp<RootStackParamList, 'CenterTargetScreen'>;

interface CenterTargetScreenProps {
  navigation: CenterTargetScreenNavigationProps;
  route: CenterTargetScreenRouteProp; 
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
  selectedStatus: 'Pending' | 'Opened' | 'Completed'; // Changed from packageStatus to selectedStatus
  additionalItemStatus: 'Pending' | 'Opened' | 'Completed' | null;
  packageItemStatus: 'Pending' | 'Opened' | 'Completed' | null;
  totalAdditionalItems: number;
  packedAdditionalItems: number;
  pendingAdditionalItems: number;
  totalPackageItems: number | null;
  packedPackageItems: number | null;
  packageIsLock: number;
  pendingPackageItems: number | null;
  isPackage: number;
  orderId: string;
}

// Backend API response interface - Updated to match actual API response
interface ApiTargetData {
  distributedTargetId: string;
  companycenterId: string;
  userId: string;
  target: number;
  complete: number;
  targetCreatedAt: string;
  distributedTargetItemId: string;
  orderId: string;
  isComplete: boolean;
  completeTime: string | null;
  itemCreatedAt: string;
  processOrderId: string;
  invNo: string;
  transactionId: string;
  paymentMethod: string;
  isPaid: boolean;
  amount: number;
  status: string;
  orderCreatedAt: string;
  reportStatus: string;
  selectedStatus: 'Pending' | 'Opened' | 'Completed'; // This is what the API actually returns
  additionalItemStatus: 'Pending' | 'Opened' | 'Completed' | null;
  packageItemStatus: 'Pending' | 'Opened' | 'Completed' | null;
  totalAdditionalItems: number;
  packedAdditionalItems: number;
  pendingAdditionalItems: number;
  totalPackageItems: number | null;
  packedPackageItems: number | null;
  pendingPackageItems: number | null;
  isPackage: number;
  packageIsLock: number;
}

const CenterTargetScreen: React.FC<CenterTargetScreenProps> = ({ navigation ,route}) => {
  const { centerId } = route.params;
  const [todoData, setTodoData] = useState<TargetData[]>([]);
  const [completedData, setCompletedData] = useState<TargetData[]>([]);
  const [centerCode, setcenterCode] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedToggle, setSelectedToggle] = useState('ToDo');
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  console.log("------centerId--------",centerId)

  const fetchSelectedLanguage = async () => {
    try {
      const lang = await AsyncStorage.getItem("@user_language");
      setSelectedLanguage(lang || "en");
    } catch (error) {
      console.error("Error fetching language preference:", error);
    }
  };

  // Helper function to get status color (language independent)
  const getStatusColor = (status: string) => {
    // Convert to lowercase and handle different language variations
    const normalizedStatus = status?.toLowerCase();
    
    // English
    if (normalizedStatus === 'completed') {
      return 'bg-[#B7FFB9] border border-[#B7FFB9] text-[#6AD16D]';
    }
    if (normalizedStatus === 'opened') {
      return 'bg-[#F8FFA6] border border-[#F8FFA6] text-[#A8A100]';
    }
    if (normalizedStatus === 'pending') {
      return 'bg-[#FFB9B7] border border-[#FFB9B7] text-[#D16D6A]';
    }
    
    // Sinhala translations
    if (normalizedStatus === 'සම්පූර්ණ' || normalizedStatus === 'සම්පූර්ණයි') {
      return 'bg-[#B7FFB9] border border-[#B7FFB9] text-[#6AD16D]';
    }
    if (normalizedStatus === 'විවෘත' || normalizedStatus === 'විවෘතයි') {
      return 'bg-[#F8FFA6] border border-[#F8FFA6] text-[#A8A100]';
    }
    if (normalizedStatus === 'අපේක්ෂිත' || normalizedStatus === 'පොරොත්තුවේ') {
      return 'bg-[#FFB9B7] border border-[#FFB9B7] text-[#D16D6A]';
    }
    
    // Tamil translations
    if (normalizedStatus === 'முடிக்கப்பட்டது' || normalizedStatus === 'நிறைவு') {
      return 'bg-[#B7FFB9] border border-[#B7FFB9] text-[#6AD16D]';
    }
    if (normalizedStatus === 'திறக்கப்பட்டது' || normalizedStatus === 'திறந்த') {
      return 'bg-[#F8FFA6] border border-[#F8FFA6] text-[#A8A100]';
    }
    if (normalizedStatus === 'நிலுவையில்' || normalizedStatus === 'காத்திருக்கும்') {
      return 'bg-[#FFB9B7] border border-[#FFB9B7] text-[#D16D6A]';
    }
    
    return 'bg-gray-100 border border-gray-300 text-gray-700';
  };

  // Helper function to get translated status text
  const getStatusText = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    
    // Return translated status based on current language
    switch (normalizedStatus) {
      case 'completed':
      case 'සම්පූර්ණ':
      case 'සම්පූර්ණයි':
      case 'முடிக்கப்பட்டது':
      case 'நிறைவு':
        return t("Status.Completed");
      case 'opened':
      case 'විවෘත':
      case 'විවෘතයි':
      case 'திறக்கப்பட்டது':
      case 'திறந்த':
        return t("Status.Opened");
      case 'pending':
      case 'අපේක්ෂිත':
      case 'පොරොත්තුවේ':
      case 'நிலுவையில்':
      case 'காத்திருக்கும்':
        return t("Status.Pending");
      default:
        return t("Status.Unknown");
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

  // Updated function to map API data to frontend format using selectedStatus
  const mapApiDataToTargetData = (apiData: ApiTargetData[]): TargetData[] => {
    return apiData.map((item, index) => ({
      id: item.distributedTargetItemId || `${item.distributedTargetId}_${index}`,
      invoiceNo: item.invNo,
      varietyNameEnglish: `Order ${item.invNo}`,
      varietyNameSinhala: `ඇණවුම ${item.invNo}`,
      varietyNameTamil: `ஆர்டர் ${item.invNo}`,
      grade: 'A',
      target: item.target,
      complete: item.complete,
      todo: item.target - item.complete,
      // Use selectedStatus as the primary status
      status: mapSelectedStatusToStatus(item.selectedStatus, item.isComplete),
      createdAt: item.targetCreatedAt,
      updatedAt: item.itemCreatedAt,
      completedTime: item.completeTime,
      selectedStatus: item.selectedStatus, // Use selectedStatus from API
      additionalItemStatus: item.additionalItemStatus,
      packageItemStatus: item.packageItemStatus,
      totalAdditionalItems: item.totalAdditionalItems || 0,
      packedAdditionalItems: item.packedAdditionalItems || 0,
      pendingAdditionalItems: item.pendingAdditionalItems || 0,
      totalPackageItems: item.totalPackageItems,
      packageIsLock: item.packageIsLock,
      packedPackageItems: item.packedPackageItems,
      pendingPackageItems: item.pendingPackageItems,
      isPackage: item.isPackage,
      orderId: item.orderId
    }));
  };

  // Map selectedStatus to display status
  const mapSelectedStatusToStatus = (
    selectedStatus: 'Pending' | 'Opened' | 'Completed', 
    isComplete: boolean
  ): 'Pending' | 'Opened' | 'Completed' | 'In Progress' => {
    if (isComplete) {
      return 'Completed';
    }
    
    switch (selectedStatus) {
      case 'Pending':
        return 'Pending';
      case 'Opened':
        return 'Opened';
      case 'Completed':
        return 'Completed';
      default:
        return 'Pending';
    }
  };

  const fetchTargets = useCallback(async () => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem("token");
      
      if (!authToken) {
        throw new Error("Authentication token not found. Please login again.");
      }

      console.log("Making request to:", `${environment.API_BASE_URL}api/distribution-manager/get-dcenter-target`);
      console.log("Auth token exists:", !!authToken);

      const response = await axios.get(
        `${environment.API_BASE_URL}api/distribution-manager/get-dcenter-target`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      if (response.data.success) {
        const apiData = response.data.data;
        
        // Map API data to frontend format
        const mappedData = mapApiDataToTargetData(apiData);
        
        console.log("Mapped data:", mappedData);
        
        // Filter based on selectedStatus instead of packageStatus
        const todoItems = mappedData.filter((item: TargetData) => 
          ['Pending', 'Opened'].includes(item.selectedStatus) 
        );
        
        const completedItems = mappedData.filter(
          (item: TargetData) => item.selectedStatus === 'Completed' 
        );

        console.log("Todo Items:", todoItems);
        console.log("Completed Items:", completedItems);

        setTodoData(sortByVarietyAndGrade(todoItems));
        setCompletedData(sortByVarietyAndGrade(completedItems));
        setError(null);
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      let errorMessage = t("Error.Failed to fetch data.");
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        errorMessage = "Bad request - please check your authentication";
      } else if (err.response?.status === 401) {
        errorMessage = "Unauthorized - please login again";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      setTodoData([]);
      setCompletedData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedLanguage, t]);

  // Updated navigation function with lock check
  const handleRowPress = (item: TargetData) => {
    // Check if package is locked
    if (item.packageIsLock === 1) {
      Alert.alert(
        t("Alert.Locked Package") || "Locked Package",
        t("Alert.This package is locked and cannot be accessed") || "This package is locked and cannot be accessed.",
        [{ text: t("Alert.OK") || "OK" }]
      );
      return;
    }

    const navigationParams = {
      item: item,
      centerCode: centerCode || '',
      status: item.selectedStatus,
      orderId: item.orderId,
      invoiceNo: item.invoiceNo,
      allData: selectedToggle === 'ToDo' ? todoData : completedData
    };

    // Navigate based on selectedStatus
    switch (item.selectedStatus) {
      case 'Pending':
      case 'Opened':
      case 'Completed':
        navigation.navigate('PendingOrderScreen', navigationParams);
        break;
      default:
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
      const centerCode = await AsyncStorage.getItem('centerCode');
      setcenterCode(centerCode);
      await fetchTargets();
    };
    fetchData();
  }, [fetchTargets]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTargets();
  };

  const displayedData = selectedToggle === 'ToDo' ? todoData : completedData;

  // Function to get detailed status display for debugging/info
  const getDetailedStatusDisplay = (item: TargetData) => {
    if (item.isPackage === 0) {
      // Only additional items
      return `Additional: ${item.additionalItemStatus || 'N/A'}`;
    } else {
      // Both additional and package items
      return `Add: ${item.additionalItemStatus || 'N/A'} | Pkg: ${item.packageItemStatus || 'N/A'}`;
    }
  };
  

   return (
    <View className="flex-1 bg-[#282828]">
      {/* Header */}
      <View className="bg-[#282828] px-4 py-6 flex-row justify-center items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="absolute left-4">
          <AntDesign name="left" size={22} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">{t("CenterTarget.CenterTarget")}</Text>
      </View>

      {/* Toggle Buttons */}
      <View className="flex-row justify-center items-center py-4 bg-[#282828] px-4">
        <TouchableOpacity
          className={`flex-1 mx-2 py-3 rounded-full flex-row items-center justify-center ${
            selectedToggle === 'ToDo' ? 'bg-[#980775]' : 'bg-white'
          }`}
          onPress={() => setSelectedToggle('ToDo')}
        >
          <Text className={`font-bold mr-2 ${selectedToggle === 'ToDo' ? 'text-white' : 'text-black'}`}>
            {t("TargetOrderScreen.Todo")}
          </Text>
          <View className={`rounded-full px-2 py-1 ${selectedToggle === 'ToDo' ? 'bg-white' : 'bg-[white]'}`}>
            <Text className={`font-bold text-xs ${selectedToggle === 'ToDo' ? 'text-[black]' : 'text-white'}`}>
              {todoData.length.toString().padStart(2, '0')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 mx-2 py-3 rounded-full flex-row items-center justify-center ${
            selectedToggle === 'Completed' ? 'bg-[#980775]' : 'bg-white'
          }`}
          onPress={() => setSelectedToggle('Completed')}
        >
          <Text className={`font-bold mr-2 ${selectedToggle === 'Completed' ? 'text-white' : 'text-black'}`}>
            {t("TargetOrderScreen.Completed")}
          </Text>
          <View className={`rounded-full px-2 py-1 ${selectedToggle === 'Completed' ? 'bg-white' : 'bg-[white]'}`}>
            <Text className={`font-bold text-xs ${selectedToggle === 'Completed' ? 'text-[black]' : 'text-white'}`}>
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
        <View className="flex-row bg-[#980775] py-3">
          <Text className="flex-1 text-center text-white font-bold">{t("TargetOrderScreen.No")}</Text>
          <Text className="flex-[2] text-center text-white font-bold">{t("TargetOrderScreen.Invoice No")}</Text>
          <Text className="flex-[2] text-center text-white font-bold">
            {selectedToggle === 'ToDo' ? t("TargetOrderScreen.Status") : "Completed Time"}
          </Text>
        </View>

        {/* Error Message */}
        {error && (
          <View className="bg-red-100 border border-red-400 px-4 py-3 mx-4 mt-4 rounded">
            <Text className="text-red-700 text-center">{error}</Text>
            <TouchableOpacity 
              onPress={() => fetchTargets()} 
              className="mt-2 bg-red-500 px-4 py-2 rounded"
            >
              <Text className="text-white text-center">{t("TargetOrderScreen.Retry")}</Text>
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <LottieView
              source={require('../../assets/lottie/newLottie.json')}
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
          </View>
        ) : displayedData.length > 0 ? (
          displayedData.map((item, index) => (
            <TouchableOpacity
              key={item.id || index}
              className={`flex-row py-4 border-b border-gray-200 ${
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              }`}
              onPress={() => handleRowPress(item)}
            >
              {/* Row Number */}
              <View className="flex-1 items-center justify-center relative">
                {selectedToggle === 'ToDo' ? (
                  <Text className="text-center font-medium">{(index + 1).toString().padStart(2, '0')}</Text>
                ) : (
                  <Ionicons name="flag" size={20} color="#980775" />
                )}
              </View>

              {/* Invoice Number */}
              <View className="flex-[2] items-center justify-center px-2">
                <Text className="text-center font-medium text-gray-800">
                  {item.invoiceNo || `INV${item.id || (index + 1).toString().padStart(6, '0')}`}
                </Text>
                {/* Red dot indicator for locked packages */}
                {item.packageIsLock === 1 && (
                  <View className="absolute right-1 top-1 w-3 h-3 bg-red-500 rounded-full"></View>
                )}
              </View>

              {/* Status or Completed Time */}
              <View className="flex-[2] items-center justify-center px-2">
                {selectedToggle === 'ToDo' ? (
                  <View className={`px-3 py-2 rounded-full ${getStatusColor(item.selectedStatus)}`}>
                    <Text className="text-xs font-medium text-center">
                      {getStatusText(item.selectedStatus)}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-center text-gray-600 text-sm">
                    {item.completedTime ? formatCompletionTime(item.completedTime) : 'N/A'}
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

export default CenterTargetScreen;