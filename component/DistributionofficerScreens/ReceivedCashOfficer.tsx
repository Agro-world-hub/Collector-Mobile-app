import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Modal,
  Platform,
} from "react-native";
import { AntDesign, Entypo, FontAwesome5, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { environment } from "@/environment/environment";
import LottieView from "lottie-react-native";
import i18n from "@/i18n/i18n";
import DateTimePicker from "@react-native-community/datetimepicker";


type ReplaceRequestsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ReceivedCashOfficer"
>;

interface ReplaceRequestsProps {
  navigation: ReplaceRequestsNavigationProp;
  route: ReplaceRequestsRouteProp;
}

type ReplaceRequestsRouteProp = RouteProp<RootStackParamList, "ReceivedCashOfficer">;

interface Transaction {
  id: string;
  orderId: string;
  cash: number;
  receivedTime: string;
  date: string;
}

const ReceivedCashOfficer: React.FC<ReplaceRequestsProps> = ({
  route,
  navigation,
}) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(new Date("2025-01-02"));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [allTransactions] = useState<Transaction[]>([
    {
      id: "1",
      orderId: "241205000020",
      cash: 1200.0,
      receivedTime: "2025/01/02 11:54 AM",
      date: "2025-01-02",
    },
    {
      id: "2",
      orderId: "241205000020",
      cash: 1200.0,
      receivedTime: "2025/01/02 11:54 AM",
      date: "2025-01-02",
    },
    {
      id: "3",
      orderId: "241205000020",
      cash: 1200.0,
      receivedTime: "2025/01/02 11:54 AM",
      date: "2025-01-02",
    },
    {
      id: "4",
      orderId: "241205000021",
      cash: 800.0,
      receivedTime: "2025/01/03 10:30 AM",
      date: "2025-01-03",
    },
    {
      id: "5",
      orderId: "241205000022",
      cash: 1500.0,
      receivedTime: "2025/01/03 02:15 PM",
      date: "2025-01-03",
    },
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Calculate total cash
  const totalCash = transactions.reduce((sum, t) => sum + t.cash, 0);

  // Calculate selected total cash
  const selectedTotalCash = transactions
    .filter(t => selectedTransactions.has(t.id))
    .reduce((sum, t) => sum + t.cash, 0);

  // Format date
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  // Format date for comparison
  const formatDateForComparison = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Filter transactions by selected date
  const filterTransactionsByDate = () => {
    const selectedDateStr = formatDateForComparison(selectedDate);
    const filtered = allTransactions.filter(
      (transaction) => transaction.date === selectedDateStr
    );
    setTransactions(filtered);
    // Clear selections when date changes
    setSelectedTransactions(new Set());
  };

  // Effect to filter transactions when date changes
  useEffect(() => {
    filterTransactionsByDate();
  }, [selectedDate]);

  // Handle date change
  const onDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    
    if (date) {
      setSelectedDate(date);
    }
  };

  // Show calendar
  const handleCalendarPress = () => {
    setShowDatePicker(true);
  };

  // Close calendar (iOS)
  const handleCalendarClose = () => {
    setShowDatePicker(false);
  };

  // Refresh handler (simulated)
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Toggle transaction selection
  const toggleTransactionSelection = (id: string) => {
    const newSelected = new Set(selectedTransactions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTransactions(newSelected);
  };

  // Select all transactions
  const handleSelectAll = () => {
    const allIds = new Set(transactions.map(t => t.id));
    setSelectedTransactions(allIds);
  };

  // Deselect all transactions
  const handleDeselectAll = () => {
    setSelectedTransactions(new Set());
  };

  // Handle hand over
  // Handle hand over
const handleHandOver = () => {
  console.log("Hand over selected transactions:", Array.from(selectedTransactions));
  
  // Get the selected transactions data
  const selectedTransactionsData = transactions
    .filter(t => selectedTransactions.has(t.id))
    .map(t => ({
      id: t.id,
      orderId: t.orderId,
      cash: t.cash
    }));
  
  // Pass the selected transactions data to QR code screen
  navigation.navigate("ReceivedCashQrCode", {
    selectedTransactions: selectedTransactionsData,
    fromScreen: "ReceivedCashOfficer"
  });
};

  // Check if all transactions are selected
  const allSelected = transactions.length > 0 && selectedTransactions.size === transactions.length;

  // Render transaction item
  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isSelected = selectedTransactions.has(item.id);
    
    return (
      <TouchableOpacity 
        onPress={() => toggleTransactionSelection(item.id)}
        activeOpacity={0.7}
      >
        <View className={`bg-[#ADADAD1A] mx-4 mb-3 p-4 rounded-xl border ${isSelected ? 'border-[#738FAE]' : 'border-[#738FAE]'} shadow-sm`}>
          <View className="flex-row items-start">
            {/* Checkbox */}
            <TouchableOpacity 
              onPress={() => toggleTransactionSelection(item.id)}
              className="mr-3 mt-0.5"
            >
              <View className={`w-5 h-5 rounded border ${isSelected ? 'bg-black border-black' : 'bg-white border-black'} items-center justify-center`}>
                {isSelected && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
              </View>
            </TouchableOpacity>

            {/* Transaction Details */}
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-900 mb-1">
                {t("ReceivedCash.Order ID")} : {item.orderId}
              </Text>
              <View className="flex-row">
                <Text className="text-sm text-[#848484] mb-1">
                  {t("ReceivedCash.Cash")} : 
                </Text>
                <Text className="text-sm text-black font-medium"> Rs.{item.cash.toFixed(2)}</Text>
              </View>
              <Text className="text-xs text-[#848484]">
                {t("ReceivedCash.Received Time")} : {item.receivedTime}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Empty state
  const EmptyState = () => (
    <View className="flex-1 items-center justify-center py-20">
      <View className=" items-center justify-center mb-4">
         <LottieView
                   source={require('../../assets/lottie/NoComplaints.json')}
                   autoPlay
                   loop
                   style={{ width: 150, height: 150 }}
                 />
      </View>
      <Text className="text-[#828282] text-base italic">
        - {t("ReceivedCash.No cash was received recently")} -
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white px-4 py-4 flex-row items-center ">
        <TouchableOpacity
          className="absolute left-4 bg-[#F6F6F680] rounded-full p-2 z-50"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <View className="flex-1 items-center justofy-center ml-2">
          <Text className="text-lg font-semibold text-gray-900">
            {t("ReceivedCash.Received Cash ")}
          </Text>
        
        </View>
       
      </View>

      {/* Filter Tabs and Select All */}
      <View className="bg-white px-4 py-3 flex-row items-center justify-between">
        <Text className="text-sm font-medium text-gray-900">
          {t("ReceivedCash.All")} ({transactions.length})
        </Text>
        
      
      </View>

      {/* Total Card */}
      <View className="px-4 py-4">
        <View 
          style={{
            borderStyle: 'dashed',
            borderWidth: 2,
            borderColor: '#980775',
            borderRadius: 12,
            backgroundColor: 'white',
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginHorizontal: 40,
          }}
        >
          <View className="flex-row items-center justify-center">
            <Text className=" font-medium text-black">
              {t("ReceivedCash.Full Total")} :   {" "}
            </Text>
            <Text className="text-xl font-bold text-[#980775]">
              Rs.{totalCash.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

        {transactions.length > 0 && (
          <View className="p-6">
          <TouchableOpacity 
            onPress={allSelected ? handleDeselectAll : handleSelectAll}
            className="flex-row items-center"
          >
            <View className={`w-4 h-4 rounded  ${allSelected ? '' : ' border bg-white border-black'} items-center justify-center mr-2`}>
              {allSelected && (
                <Entypo name="squared-minus" size={18} color="red" />
              )}
            </View>
            <Text className={`text-sm underline ${allSelected ? 'text-[#000000]' : 'text-[#000000]'} font-medium`}>
              {allSelected ? t("ReceivedCash.Deselect All") : t("ReceivedCash.Select All")}
            </Text>
          </TouchableOpacity>
          </View>
        )}

      {/* Transactions List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#EF4444" />
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: selectedTransactions.size > 0 ? 100 : 20 }}
          ListEmptyComponent={EmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#EF4444"
              colors={["#EF4444"]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Hand Over Button - Only show when items are selected */}
      {selectedTransactions.size > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-white px-5 py-4">
          <TouchableOpacity
            onPress={handleHandOver}
            className="bg-[#980775] rounded-full py-3 flex-row items-center justify-center"
            activeOpacity={0.8}
          >
 <FontAwesome6 name="hand-holding-hand" size={18} color="white" 
              
                />
            <Text className="text-white text-base font-semibold ml-4">
              {t("ReceivedCash.Hand Over")}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Date Picker */}
      {showDatePicker && (
        <>
          {Platform.OS === "ios" ? (
            <Modal
              transparent={true}
              animationType="slide"
              visible={showDatePicker}
              onRequestClose={handleCalendarClose}
            >
              <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-3xl">
                  <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
                    <TouchableOpacity onPress={handleCalendarClose}>
                      <Text className="text-red-600 text-base font-medium">
                        {t("Hand Over.Cancel")}
                      </Text>
                    </TouchableOpacity>
                    <Text className="text-base font-semibold text-gray-900">
                      {t("Hand Over.Select Date")}
                    </Text>
                    <TouchableOpacity onPress={handleCalendarClose}>
                      <Text className="text-blue-600 text-base font-medium">
                        {t("Hand Over.Done")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="spinner"
                    onChange={onDateChange}
                    maximumDate={new Date()}
                    textColor="#000"
                  />
                </View>
              </View>
            </Modal>
          ) : (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
        </>
      )}
    </View>
  );
};

export default ReceivedCashOfficer;