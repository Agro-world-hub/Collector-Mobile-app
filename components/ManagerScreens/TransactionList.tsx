import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { scale } from 'react-native-size-matters';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../types';
import environment from '@/environment/environment';
import AntDesign from 'react-native-vector-icons/AntDesign';

type TransactionListNavigationProp = StackNavigationProp<RootStackParamList, 'TransactionList'>;
type TranscationListRouteProp = RouteProp<RootStackParamList, 'OfficerSummary'>;

interface TransactionListProps {
  navigation: TransactionListNavigationProp;
  route: TranscationListRouteProp;
  
}

interface Transaction {
  registeredFarmerId: number;
  userId: number;
  phoneNumber: string;
  address: string;
  bankAddress: string | null;
  accountNumber: string | null;
  accountHolderName: string | null;
  bankName: string | null;
  branchName: string | null;
  id: number;
  firstName: string;
  lastName: string;
  NICnumber: string;
  totalAmount: number;
}

const TransactionList: React.FC<TransactionListProps> = ({ route ,navigation}) => {
  const { officerId, collectionOfficerId,  phoneNumber1, phoneNumber2, officerName } = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchTransactions = async (date: string) => {
    try {
      const response = await fetch(
        `${environment.API_BASE_URL}api/collection-manager/transaction-list?collectionOfficerId=${collectionOfficerId}&date=${date}`
      );
      const data = await response.json();
      console.log('Transactions:', data);
  
      if (response.ok) {
        const formattedData = data.map((transaction: any) => ({
          id: transaction.registeredFarmerId ?? Math.random(), // Unique ID (fallback to random)
          registeredFarmerId: transaction.registeredFarmerId || 0,
          userId: transaction.userId || 0,
          firstName: transaction.firstName || '',
          lastName: transaction.lastName || '',
          phoneNumber: transaction.phoneNumber || '',
          address: transaction.address || '',
          NICnumber: transaction.NICnumber || '',
          totalAmount: parseFloat(transaction.totalAmount) || 0,
          bankAddress: transaction.bankAddress || null,
          accountNumber: transaction.accountNumber || null,
          accountHolderName: transaction.accountHolderName || null,
          bankName: transaction.bankName || null,
          branchName: transaction.branchName || null,
        }));
  
        setTransactions(formattedData);
        setFilteredTransactions(formattedData);
      } else {
        console.error('Error fetching transactions:', data.error);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = transactions.filter(
      (transaction: any) =>
        transaction.firstName?.toLowerCase().includes(query.toLowerCase()) ||
        transaction.lastName?.toLowerCase().includes(query.toLowerCase()) ||
        transaction.NICnumber?.includes(query)
    );
    setFilteredTransactions(filtered);
  };

  useEffect(() => {
    fetchTransactions(getCurrentDate());
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      fetchTransactions(formattedDate);
    }
  }, [selectedDate]);

  return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}>
    <SafeAreaView className="flex-1 bg-white">

      <View>

        {/* Header */}
        <View className="bg-[#2AAD7A] p-4 mt-[-18] rounded-b-[35px] shadow-md">
        <TouchableOpacity onPress={() =>         navigation.navigate('OfficerSummary'as any,{collectionOfficerId, officerId,phoneNumber1,phoneNumber2,officerName})} className='absolute left-4 mt-4'>
        <AntDesign name="left" size={22} color="white" />
              </TouchableOpacity>
          <Text className="text-white text-lg font-bold ml-[28%]">EMP ID: {officerId}</Text>
          <View className="flex-row items-center justify-between mt-2">
          <Text className="text-white text-lg ml-[20%]">
          Selected Date: {selectedDate ? selectedDate.toISOString().split('T')[0] : 'N/A'}
        </Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} className="mb-6">
              <Ionicons name="calendar-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-center bg-[#F7F7F7] px-4 py-2 rounded-full border border-[#444444] mt-[-18] mx-auto w-[90%] shadow-sm">
          <TextInput
            placeholder="Search By NIC Number, Name"
            placeholderTextColor="grey"
            className="flex-1 text-sm text-gray-800"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <Image
            source={require('../../assets/images/searchhh.webp')}
            className="w-8 h-8"
            resizeMode="contain"
          />
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setSelectedDate(date);
            }}
          />
        )}
      </View>

      <View className="px-4 mt-4">
        <Text className="text-lg font-semibold text-black mb-4">
          Transaction List (All {filteredTransactions.length})
        </Text>
      </View>
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center p-4 mb-3 rounded-[35px] bg-gray-100 shadow-sm"
            onPress={() => {
              navigation.navigate('FarmerReport'as any,  {
                registeredFarmerId: item.registeredFarmerId,
                userId: item.userId,
                firstName: item.firstName,
                lastName: item.lastName,
                phoneNumber: item.phoneNumber,
                address: item.address,
                NICnumber: item.NICnumber,
                totalAmount: item.totalAmount,
                bankAddress: item.bankAddress,
                accountNumber: item.accountNumber,
                accountHolderName: item.accountHolderName,
                bankName: item.bankName,
                branchName: item.branchName,
                selectedDate: selectedDate.toISOString().split('T')[0],
              });
            }}
          >
            <View className="w-14 h-14 rounded-full overflow-hidden justify-center items-center mr-4 shadow-md">
              <Image
                source={require('../../assets/images/ava.webp')}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1">
              <Text className="text-[18px] font-semibold text-gray-900">
                {item.firstName} {item.lastName}
              </Text>
              <Text className="text-sm text-gray-500">NIC: {item.NICnumber}</Text>
              <Text className="text-sm text-gray-500">
                Total: Rs.{item.totalAmount ? item.totalAmount.toLocaleString() : 'N/A'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={scale(20)} color="#9CA3AF" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="items-center mt-[50%]">
            <Text className="text-gray-500 text-lg">No transactions found for the selected date.</Text>
          </View>
        }
      />

    </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
export default TransactionList;