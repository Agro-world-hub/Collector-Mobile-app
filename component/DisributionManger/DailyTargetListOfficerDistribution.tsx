import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
} from "react-native";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { environment } from "@/environment/environment";
import { useTranslation } from "react-i18next";

type DailyTargetListOfficerDistributiontNavigationProps = StackNavigationProp<
  RootStackParamList,
  "DailyTargetListOfficerDistribution"
>;

interface DailyTargetListOfficerDistributionProps {
  navigation: DailyTargetListOfficerDistributiontNavigationProps;
  route: {
    params: {
      collectionOfficerId: number;
      officerId: string;
    };
  };
}

// Updated interface to match backend data structure
interface OrderData {
  distributedTargetId: number;
  distributedTargetItemId: number;
  orderId: number;
  processOrderId: number;
  invNo: string;
  amount: string;
  paymentMethod: string;
  isPaid: number;
  status: string;
  selectedStatus: string;
  sheduleDate: string;
  sheduleTime: string;
  sheduleType: string;
  buildingType: string;
  orderApp: string;
  isPackage: number;
  packageId: number | null;
  packageIsLock: number | null;
  packageItemStatus: string | null;
  additionalItemStatus: string | null;
  totalAdditionalItems: number;
  totalPackageItems: number;
  packedAdditionalItems: number;
  packedPackageItems: number;
  pendingAdditionalItems: number;
  pendingPackageItems: number;
  complete: number;
  completeTime: string | null;
  target: number;
  targetCreatedAt: string;
  orderCreatedAt: string;
  itemCreatedAt: string;
  reportStatus: string | null;
}

const DailyTargetListOfficerDistribution: React.FC<DailyTargetListOfficerDistributionProps> = ({
  navigation,
  route,
}) => {
  const [todoData, setTodoData] = useState<OrderData[]>([]);
  const [completedData, setCompletedData] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedToggle, setSelectedToggle] = useState("ToDo");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [invNo, setInvoNo] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { collectionOfficerId, officerId } = route.params;
  const { t } = useTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  const fetchSelectedLanguage = async () => {
    try {
      const lang = await AsyncStorage.getItem("@user_language");
      setSelectedLanguage(lang || "en");
    } catch (error) {
      console.error("Error fetching language preference:", error);
    }
  };

  // Helper function to format date
  const formatScheduleDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Helper function to format time
  const formatScheduleTime = (timeString: string) => {
    return timeString || 'N/A';
  };

  // Helper function to check if schedule date is today
  const isScheduleDateToday = (dateString: string) => {
    if (!dateString) return false;
    const scheduleDate = new Date(dateString);
    const today = new Date();
    return scheduleDate.toDateString() === today.toDateString();
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-[#BBFFC6] border-[#BBFFC6] text-[#6AD16D]';
      case 'opened':
        return 'bg-[#F8FFA6] border-[#F8FFA6] text-[#A8A100]';
      case 'pending':
        return 'bg-[#FFB9B7] border-[#FFB9B7] text-[#D16D6A]';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  // Helper function to get status text
  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'Completed';
      case 'opened':
        return 'Opened';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  // Helper function to format completion time
  const formatCompletionTime = (timeString: string) => {
    if (!timeString) return 'N/A';
    const date = new Date(timeString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to check if item can be selected (only pending orders)
  const canSelectItem = (item: OrderData) => {
    return item.selectedStatus?.toLowerCase() === 'pending' && selectedToggle === 'ToDo';
  };

  // Helper function to handle item selection
  const handleItemSelect = (item: OrderData) => {
    if (!canSelectItem(item)) return;

    const newSelectedItems = new Set(selectedItems);
    if (newSelectedItems.has(item.distributedTargetItemId)) {
      newSelectedItems.delete(item.distributedTargetItemId);
    } else {
      newSelectedItems.add(item.distributedTargetItemId);
    }
    setSelectedItems(newSelectedItems);

    // Auto-enable selection mode when first item is selected
    if (newSelectedItems.size > 0) {
      setIsSelectionMode(true);
    } else {
      setIsSelectionMode(false);
    }
  };

  // Helper function to handle row press
  // const handleRowPress = (item: OrderData) => {
  //   if (isSelectionMode) {
  //     // If in selection mode, toggle selection
  //     handleItemSelect(item);
  //   } else if (canSelectItem(item)) {
  //     // If not in selection mode and item can be selected, navigate directly
  //     console.log("Single item navigation:", item);
  //     navigation.navigate('PassTarget' as any, { 
  //       officerId: officerId,
  //       selectedItems: [item.distributedTargetItemId],
  //       collectionOfficerId: collectionOfficerId,
  //       invNo: item.invNo || invNo
  //     });
  //   }
  //   // No action for opened or completed items when not in selection mode
  // };

  // Helper function to select all pending items
  const selectAllPendingItems = () => {
    const pendingItems = todoData.filter(item => canSelectItem(item));
    const allPendingIds = new Set(pendingItems.map(item => item.distributedTargetItemId));
    setSelectedItems(allPendingIds);
    setIsSelectionMode(true);
  };

  // Helper function to toggle select all pending items
  const toggleSelectAllPending = () => {
    const pendingItems = todoData.filter(item => canSelectItem(item));
    const allPendingIds = pendingItems.map(item => item.distributedTargetItemId);
    
    // Check if all pending items are already selected
    const allSelected = allPendingIds.every(id => selectedItems.has(id));
    
    if (allSelected && selectedItems.size > 0) {
      // Deselect all
      setSelectedItems(new Set());
      setIsSelectionMode(false);
    } else {
      // Select all pending items
      setSelectedItems(new Set(allPendingIds));
      setIsSelectionMode(true);
    }
  };

  // Helper function to handle long press for selection
  const handleLongPress = (item: OrderData) => {
    if (canSelectItem(item)) {
      console.log("Long press detected, entering selection mode");
      setIsSelectionMode(true);
      setSelectedItems(new Set([item.distributedTargetItemId]));
    }
  };

  // Helper function to clear selection
  const clearSelection = () => {
    setSelectedItems(new Set());
    setIsSelectionMode(false);
  };

  // Show confirmation modal when pass button is clicked
  const handlePassButtonPress = () => {
    if (selectedItems.size === 0) {
      Alert.alert("No Selection", "Please select at least one pending item.");
      return;
    }
    setShowConfirmModal(true);
  };

  // Handle confirmation modal pass button
  // In DailyTargetListOfficerDistribution component, replace the handleConfirmPass function:

const handleConfirmPass = () => {
  setShowConfirmModal(false);
  
  const selectedItemsArray = Array.from(selectedItems);
  console.log("Multiple items navigation:", selectedItemsArray);
  
  // Get all selected items with their invoice numbers
  const selectedItemsWithInvoices = todoData.filter(item => 
    selectedItems.has(item.distributedTargetItemId)
  );
  
  // Create an array of invoice numbers for the selected items
  const invoiceNumbers = selectedItemsWithInvoices.map(item => item.invNo);
  const processOrderId = selectedItemsWithInvoices.map(item => item.processOrderId)
  
  navigation.navigate('PassTarget' as any, {
    officerId: officerId,
    selectedItems: selectedItemsArray,
    collectionOfficerId: collectionOfficerId,
    invoiceNumbers: invoiceNumbers, // Pass array of invoice numbers
    processOrderId:processOrderId
    // Remove the single invNo property as it's now replaced with invoiceNumbers array
  });
  
  // Clear selection after navigation
  clearSelection();
};

// Also update the handleRowPress function for single item navigation:
const handleRowPress = (item: OrderData) => {
  if (isSelectionMode) {
    // If in selection mode, toggle selection
    handleItemSelect(item);
  } else if (canSelectItem(item)) {
    // If not in selection mode and item can be selected, navigate directly
    console.log("Single item navigation:", item);
    navigation.navigate('PassTarget' as any, { 
      officerId: officerId,
      selectedItems: [item.distributedTargetItemId],
      collectionOfficerId: collectionOfficerId,
      invoiceNumbers: [item.invNo] // Pass as array for consistency
    });
  }
  // No action for opened or completed items when not in selection mode
};

  // Handle confirmation modal cancel button
  const handleCancelPass = () => {
    setShowConfirmModal(false);
  };

  // Updated: Helper function to handle selected items action (now shows confirmation)
  const handleSelectedItemsAction = () => {
    handlePassButtonPress();
  };

  // Fetch Targets API
  const fetchTargets = async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const authToken = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${environment.API_BASE_URL}api/distribution-manager/distribution-officer/${collectionOfficerId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const allData = response.data.data;
      console.log("Fetched data:", allData);
      
      // Filter data based on status and completion
      const todoItems = allData.filter((item: OrderData) => 
        item.selectedStatus !== 'Completed' && item.complete === 0
      );
      const completedItems = allData.filter((item: OrderData) => 
        item.selectedStatus === 'Completed' || item.complete === 1
      );
      
      console.log("Todo items:", todoItems);
      console.log("Completed items:", completedItems);

      setTodoData(todoItems);
      setCompletedData(completedItems);
      
      // Set invoice number from first item
      if (allData && allData.length > 0) {
        setInvoNo(allData[0].invNo || '');
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching targets:", err);
      setError(t("Error.Failed to fetch data."));
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = 3000 - elapsedTime;
      setTimeout(
        () => setLoading(false),
        remainingTime > 0 ? remainingTime : 0
      );
    }
  };

  // Refresh Data Every Time the Screen is Focused
  useFocusEffect(
    React.useCallback(() => {
      fetchTargets();
      // Clear selection when screen focuses
      clearSelection();
    }, [collectionOfficerId])
  );

  // Refreshing function for Pull-to-Refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTargets();
    clearSelection();
    setRefreshing(false);
  }, [collectionOfficerId]);

  // Handle toggle change
  const handleToggleChange = (toggle: string) => {
    setSelectedToggle(toggle);
    clearSelection(); // Clear selection when switching tabs
  };

  const displayedData = selectedToggle === "ToDo" ? todoData : completedData;
  const pendingItemsCount = todoData.filter(item => canSelectItem(item)).length;

  useEffect(() => {
    const fetchData = async () => {
      await fetchSelectedLanguage();
    };
    fetchData();
  }, []);

  return (
    <View className="flex-1 bg-[#282828]">
      {/* Header */}
      <View className="bg-[#282828] px-4 py-6 flex-row justify-center items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="absolute left-4">
          <AntDesign name="left" size={22} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">{officerId}</Text>
        
        {/* Selection Mode Actions */}
        {isSelectionMode && (
          <View className="absolute right-4 flex-row">
            <TouchableOpacity
              onPress={clearSelection}
              className="mr-3 p-2"
            >
              <MaterialIcons name="clear" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSelectedItemsAction}
              className="p-2"
            >
              <MaterialIcons name="check" size={22} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelPass}
      >
        <View className="flex-1 justify-center items-center bg-[#000000BF] ">
          <View className="bg-white mx-6 rounded-lg p-6 shadow-lg">
            {/* Warning Icon */}
            <View className="items-center mb-4">
              <View className="w-10 h-10 bg-[#F6F7F9] rounded-lg items-center justify-center">
                <MaterialIcons name="warning" size={24} color="#808080" />
              </View>
            </View>
            
            {/* Message */}
            <Text className="text-center text-gray-800 text-base mb-6 leading-5">
              Are you sure you want to pass this target to some other officer?
            </Text>
            
            {/* Buttons */}
            <View className="flex-row justify-center space-x-4">
              <TouchableOpacity
                onPress={handleCancelPass}
                className="flex-1 mr-2 py-3 px-6 bg-[#F6F7F9] border border-[#95A1AC] rounded-lg"
              >
                <Text className="text-center text-gray-700 font-medium">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleConfirmPass}
                className="flex-1 ml-2 py-3 px-6 bg-[#2AAD7A] border border-[#319576] rounded-lg"
              >
                <Text className="text-center text-white font-medium">Pass</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Toggle Buttons */}
      <View className="flex-row justify-center items-center py-4 bg-[#282828] px-4">
        <TouchableOpacity
          className={`flex-1 mx-2 py-3 rounded-full flex-row items-center justify-center ${
            selectedToggle === 'ToDo' ? 'bg-[#2AAD7A]' : 'bg-white'
          }`}
          onPress={() => handleToggleChange('ToDo')}
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
          onPress={() => handleToggleChange('Completed')}
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
          {selectedToggle === 'ToDo' && (
            <TouchableOpacity 
              className="w-12 items-center justify-center"
              onPress={toggleSelectAllPending}
              disabled={pendingItemsCount === 0}
            >
              <MaterialIcons 
                name={
                  pendingItemsCount > 0 && todoData.filter(item => canSelectItem(item)).every(item => selectedItems.has(item.distributedTargetItemId)) && selectedItems.size > 0
                    ? "check-box" 
                    : "check-box-outline-blank"
                } 
                size={20} 
                color="white" 
              />
            </TouchableOpacity>
          )}
          <Text className="flex-1 text-center text-white font-bold">{t("TargetOrderScreen.No")}</Text>
          <Text className="flex-[2] text-center text-white font-bold">{t("TargetOrderScreen.Invoice No")}</Text>
          
          {selectedToggle === 'ToDo' ? (
            <Text className="flex-[2] text-center text-white font-bold">{t("TargetOrderScreen.Status")}</Text>
          ) : (
            <Text className="flex-[2] text-center text-white font-bold">Completed Time</Text>
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
              <Text className="text-white text-center">Retry</Text>
            </TouchableOpacity>
          </View>
        )}

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
            <View
              key={`${item.distributedTargetItemId}-${index}`}
              className={`flex-row py-4 border-b border-gray-200 ${
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              } ${
                selectedItems.has(item.distributedTargetItemId) ? 'bg-blue-50' : ''
              }`}
           
            >
              {/* Checkbox for ToDo items */}
              {selectedToggle === 'ToDo' && (
                <View className="w-12 items-center justify-center">
                  {canSelectItem(item) ? (
                    <TouchableOpacity
                      onPress={() => handleItemSelect(item)}
                      className="p-2"
                    >
                      <MaterialIcons 
                        name={selectedItems.has(item.distributedTargetItemId) ? "check-box" : "check-box-outline-blank"} 
                        size={20} 
                        color={selectedItems.has(item.distributedTargetItemId) ? "#2AAD7A" : "#666"} 
                      />
                    </TouchableOpacity>
                  ) : (
                    <View className="w-6 h-6 bg-gray-200 rounded opacity-50" />
                  )}
                </View>
              )}

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
                  {item.invNo || `INV${item.processOrderId.toString().padStart(6, '0')}`}
                </Text>
                {/* Red dot indicator for locked packages */}
                {item.packageIsLock === 1 && (
                  <View className="absolute right-1 top-1 w-3 h-3 bg-red-500 rounded-full"></View>
                )}
              </View>

              {selectedToggle === 'ToDo' ? (
                /* Status */
                <View className="flex-[2] items-center justify-center px-2">
                  <View className={`px-3 py-2 rounded-lg border ${getStatusColor(item.selectedStatus)}`}>
                    <Text className="text-xs font-medium text-center text-gray-800">
                      {getStatusText(item.selectedStatus)}
                    </Text>
                  </View>
                </View>
              ) : (
                /* Completed Time */
                <View className="flex-[2] items-center justify-center px-2">
                  <Text className="text-center text-gray-600 text-sm">
                    {item.completeTime ? formatCompletionTime(item.completeTime) : 'N/A'}
                  </Text>
                </View>
              )}
            </View>
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

export default DailyTargetListOfficerDistribution;