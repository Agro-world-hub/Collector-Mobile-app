import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, TextInput, Alert } from 'react-native';
import { RootStackParamList } from '../types';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {environment }from '@/environment/environment';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";
import { RouteProp } from '@react-navigation/native';

// Define the Order interface
interface OrderItem {
  invoiceNo: string;
  varietyNameEnglish: string;
  grade: string;
  target: number;
  complete: number;
  todo: number;
  status: string;
  completedTime?: string | null;
}

type PendingOrderScreenNavigationProps = StackNavigationProp<RootStackParamList, 'CompletedOrderScreen'>;
type PendingOrderScreenRouteProp = RouteProp<
  RootStackParamList,
  "CompletedOrderScreen"
>;

interface PendingOrderScreenProps {
  navigation: PendingOrderScreenNavigationProps;
  route: PendingOrderScreenRouteProp;
}

const CompletedOrderScreen: React.FC<PendingOrderScreenProps> = ({ navigation, route }) => {
  const { item, centerCode } = route.params;
  const { t } = useTranslation();
  
  const [orderData, setOrderData] = useState<OrderItem>(item as unknown as OrderItem);
  const [inputWeight, setInputWeight] = useState('');
  const [familyPackExpanded, setFamilyPackExpanded] = useState(false);
  const [additionalItemsExpanded, setAdditionalItemsExpanded] = useState(false);

  const handleProcessOrder = () => {
    if (!inputWeight || parseFloat(inputWeight) <= 0) {
      Alert.alert(t("Error"), t("Please enter a valid weight"));
      return;
    }

    const weight = parseFloat(inputWeight);
    const newComplete = orderData.complete + weight;
    const newTodo = Math.max(0, orderData.target - newComplete);
    const newStatus = newComplete >= orderData.target ? 'Completed' : 'In Progress';

    const updatedItem: OrderItem = {
      ...orderData,
      complete: newComplete,
      todo: newTodo,
      status: newStatus,
      completedTime: newStatus === 'Completed' ? new Date().toLocaleString() : null
    };

    if (newStatus === 'Completed') {
      navigation.navigate('CompletedOrderScreen' as any, { 
        item: updatedItem, 
        centerCode 
      });
    } else {
      navigation.navigate('InProgressOrderScreen' as any, { 
        item: updatedItem, 
        centerCode 
      });
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white px-4 py-4 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <AntDesign name="left" size={24} color="#333" />
        </TouchableOpacity>
        <View className="flex-1 justify-center items-center">
  <Text className="text-gray-800 text-lg font-medium">{t("OpenedOrderScreen.INV No")} {orderData.invoiceNo}</Text>
</View>
      
          
      
      </View>
        <View className="mx-4 mt-4 mb-3 justify-center items-center">
                <View className="bg-[#BBFFC6] border border-[#BBFFC6] px-3 py-2 rounded-lg">
                  <Text className="text-[#308233] font-medium text-sm">{t("OpenedOrderScreen.Completed")}</Text>
                </View>
              </View>

      <ScrollView className="flex-1">
        {/* Status Badge */}
      

        {/* Family Pack Section */}
        <View className="mx-4 mb-3">
          <TouchableOpacity 
            className="bg-[#DCFFE2] border border-[#308233] px-4 py-3 rounded-lg flex-row justify-between items-center"
            onPress={() => setFamilyPackExpanded(!familyPackExpanded)}
          >
            <Text className="text-[#000000] font-medium">Family Pack for 2</Text>
            <AntDesign 
              name={familyPackExpanded ? "up" : "down"} 
              size={16} 
              color="#000000" 
            />
          </TouchableOpacity>
          
          {familyPackExpanded && (
            <View className="bg-white border border-[#308233] rounded-b-lg px-4 py-4 -mt-1">
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">{t("Variety")}:</Text>
                  <Text className="font-medium text-gray-800">{orderData.varietyNameEnglish}</Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">{t("Grade")}:</Text>
                  <Text className="font-medium text-gray-800">{orderData.grade}</Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">{t("Target")}:</Text>
                  <Text className="font-medium text-gray-800">{orderData.target} kg</Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">{t("Completed")}:</Text>
                  <Text className="font-medium text-gray-800">{orderData.complete} kg</Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">{t("Remaining")}:</Text>
                  <Text className="font-medium text-red-600">{orderData.todo} kg</Text>
                </View>
              </View>

              {/* Weight Input */}
              <View className="mt-4">
                <Text className="text-gray-700 font-medium mb-2">{t("Enter Weight (kg)")}</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-3 text-base"
                  placeholder={t("Enter weight...")}
                  value={inputWeight}
                  onChangeText={setInputWeight}
                  keyboardType="numeric"
                />
              </View>

              {/* Add Weight Button */}
              <TouchableOpacity 
                className="bg-[#DCFFE2] py-3 rounded-lg flex-row items-center justify-center mt-4"
                onPress={handleProcessOrder}
              >
                <MaterialIcons name="add" size={20} color="white" />
                <Text className="text-white font-medium text-base ml-2">{t("Add Weight")}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Additional Items Section */}
        <View className="mx-4 mb-6">
          <TouchableOpacity 
            className="bg-[#DCFFE2] border border-[#308233] px-4 py-3 rounded-lg flex-row justify-between items-center"
            onPress={() => setAdditionalItemsExpanded(!additionalItemsExpanded)}
          >
            <Text className="text-[#000000] font-medium">{t("OpenedOrderScreen.Additional Items")}</Text>
            <AntDesign 
              name={additionalItemsExpanded ? "up" : "down"} 
              size={16} 
              color="#000000" 
            />
          </TouchableOpacity>
          
          {additionalItemsExpanded && (
            <View className="bg-white border border-[#308233] rounded-b-lg px-4 py-4 -mt-1">
              <Text className="text-gray-500 text-center py-8">
                {t("No additional items")}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default CompletedOrderScreen;