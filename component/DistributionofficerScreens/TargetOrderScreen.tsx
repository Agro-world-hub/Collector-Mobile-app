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
  sheduleDate: string;
  sheduleTime: string;
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
  selectedStatus: 'Pending' | 'Opened' | 'Completed';
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
  sheduleDate: string;
  sheduleTime: string;
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

  // Function to format schedule time (remove "Within" text)
  const formatScheduleTime = (timeString: string): string => {
    if (!timeString) return '';
    
    // Remove "Within" text and trim whitespace
    return timeString.replace(/^Within\s*/i, '').trim();
  };

  // Function to format schedule date (month and date only)
  const formatScheduleDate = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${month}/${day}`;
    } catch (error) {
      console.error('Error formatting schedule date:', error);
      return '';
    }
  };

  // Function to check if schedule date is today
  const isScheduleDateToday = (dateString: string): boolean => {
    if (!dateString) return false;
    
    try {
      const scheduleDate = new Date(dateString);
      const today = new Date();
      
      return scheduleDate.getFullYear() === today.getFullYear() &&
             scheduleDate.getMonth() === today.getMonth() &&
             scheduleDate.getDate() === today.getDate();
    } catch (error) {
      console.error('Error checking if date is today:', error);
      return false;
    }
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
      selectedStatus: item.selectedStatus,
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
      orderId: item.orderId,
      sheduleDate: item.sheduleDate,
      sheduleTime: item.sheduleTime
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

      console.log("Making request to:", `${environment.API_BASE_URL}api/distribution/officer-target`);
      console.log("Auth token exists:", !!authToken);

      const response = await axios.get(
        `${environment.API_BASE_URL}api/distribution/officer-target`,
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

  // Updated to use selectedStatus for styling
  const getStatusColor = (selectedStatus: 'Pending' | 'Opened' | 'Completed') => {
    switch (selectedStatus) {
      case 'Pending': 
        return 'bg-[#FF070733] border border-[#FF070733] text-[#FF0700]';
      case 'Opened': 
        return 'bg-[#FDFF99] border border-[#FDFF99] text-[#A8A100]';
      case 'Completed': 
        return 'bg-[#B7FFB9] border border-[#B7FFB9] text-[#6AD16D]';
      default: 
        return 'bg-gray-100 border border-gray-300 text-gray-700';
    }
  };

  // const getStatusText = (selectedStatus: 'Pending' | 'Opened' | 'Completed') => {
  //   const statusMap = {
  //     'Pending': t("Pending") || 'Pending',
  //     'Opened': t("Opened") || 'Opened', 
  //     'Completed': t("Completed") || 'Completed'
  //   };
  //   return statusMap[selectedStatus] || selectedStatus;
  // };

  const getStatusText = (selectedStatus: 'Pending' | 'Opened' | 'Completed') => {
  switch (selectedStatus) {
    case 'Pending':
      return selectedLanguage === 'si' ? 'අපේක්ෂාවෙන්' : 
             selectedLanguage === 'ta' ? 'நிலுவையில்' : 
             t("Status.Pending") || 'Pending';
    case 'Opened':
      return selectedLanguage === 'si' ? 'විවෘත කර ඇත' : 
             selectedLanguage === 'ta' ? 'திறக்கப்பட்டது' : 
             t("Status.Opened") || 'Opened';
    case 'Completed':
      return selectedLanguage === 'si' ? 'සම්පූර්ණයි' : 
             selectedLanguage === 'ta' ? 'நிறைவானது' : 
             t("Status.Completed") || 'Completed';
    default:
      return selectedStatus;
  }
};

const getStatusBackgroundColor = (selectedStatus: 'Pending' | 'Opened' | 'Completed') => {
  switch (selectedStatus) {
    case 'Pending': 
      return '#FF070733'; // Light red background
    case 'Opened': 
      return '#FDFF99'; // Light yellow background
    case 'Completed': 
      return '#B7FFB9'; // Light green background
    default: 
      return '#F3F4F6'; // Gray background
  }
};

const getStatusTextColor = (selectedStatus: 'Pending' | 'Opened' | 'Completed') => {
  switch (selectedStatus) {
    case 'Pending': 
      return '#FF0700'; // Red text
    case 'Opened': 
      return '#A8A100'; // Dark yellow text
    case 'Completed': 
      return '#6AD16D'; // Green text
    default: 
      return '#374151'; // Gray text
  }
};

const getStatusBorderColor = (selectedStatus: 'Pending' | 'Opened' | 'Completed') => {
  switch (selectedStatus) {
    case 'Pending': 
      return '#FF070733'; // Light red border
    case 'Opened': 
      return '#F8FFA6'; // Light yellow border
    case 'Completed': 
      return '#B7FFB9'; // Light green border
    default: 
      return '#D1D5DB'; // Gray border
  }
};

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
        <Text className="text-white text-lg font-bold">{t("TargetOrderScreen.My Daily Target")}</Text>
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
            <Text className={`font-bold text-xs ${selectedToggle === 'ToDo' ? 'text-[#000000]' : 'text-white'}`}>
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
            <Text className={`font-bold text-xs ${selectedToggle === 'Completed' ? 'text-[#000000]' : 'text-white'}`}>
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
          
          {selectedToggle === 'ToDo' ? (
            <>
              <Text className="flex-[2] text-center text-white font-bold ">{t("TargetOrderScreen.Date")}</Text>
          
              <Text className="flex-[2] text-center text-white font-bold ">{t("TargetOrderScreen.Status")}</Text>
            </>
          ) : (
            <Text className="flex-[2] text-center text-white font-bold">{t("TargetOrderScreen.Completed Time")}</Text>
          )}
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

              {selectedToggle === 'ToDo' ? (
                <>
                  {/* Date */}
                  <View className="flex-[2] items-center justify-center px-2">
                    <Text className={`text-center font-medium text-xs ${
                      isScheduleDateToday(item.sheduleDate) ? 'text-red-600' : 'text-gray-800'
                    }`}>
                      {formatScheduleDate(item.sheduleDate)}  {formatScheduleTime(item.sheduleTime) || 'N/A'}
                    </Text>
                  </View>

                  {/* Time */}
                  

                  {/* Status */}
                {/* Status */}
<View className="flex-[2] items-center justify-center px-2">
  <View 
    style={{
      backgroundColor: getStatusBackgroundColor(item.selectedStatus),
      borderColor: getStatusBorderColor(item.selectedStatus),
      borderWidth: 1,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
    }}
  >
    <Text 
      style={{
        color: getStatusTextColor(item.selectedStatus),
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center'
      }}
    >
      {getStatusText(item.selectedStatus)}
    </Text>
  </View>
</View>
                </>
              ) : (
                /* Completed Time */
                <View className="flex-[2] items-center justify-center px-2">
                  <Text className="text-center text-gray-600 text-sm">
                    {item.completedTime ? formatCompletionTime(item.completedTime) : 'N/A'}
                  </Text>
                </View>
              )}
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