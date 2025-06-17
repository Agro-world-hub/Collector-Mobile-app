import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl, 
  TextInput, 
  Alert,
  Modal,
  Dimensions 
} from 'react-native';
import { RootStackParamList } from '../types';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { environment } from '@/environment/environment';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";
import { RouteProp } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

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

interface FamilyPackItem {
  id: string;
  name: string;
  weight: string;
  selected: boolean;
}

interface AdditionalItem {
  id: string;
  name: string;
  weight: string;
  selected: boolean;
}

type PendingOrderScreenNavigationProps = StackNavigationProp<RootStackParamList, 'PendingOrderScreen'>;
type PendingOrderScreenRouteProp = RouteProp<RootStackParamList, "PendingOrderScreen">;

interface PendingOrderScreenProps {
  navigation: PendingOrderScreenNavigationProps;
  route: PendingOrderScreenRouteProp;
}

const PendingOrderScreen: React.FC<PendingOrderScreenProps> = ({ navigation, route }) => {
  const { item, centerCode } = route.params;
  const { t } = useTranslation();
  
  const [orderData, setOrderData] = useState<OrderItem>(item as unknown as OrderItem);
  const [inputWeight, setInputWeight] = useState('');
  const [familyPackExpanded, setFamilyPackExpanded] = useState(false);
  const [additionalItemsExpanded, setAdditionalItemsExpanded] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sample data for family pack items
  const [familyPackItems, setFamilyPackItems] = useState<FamilyPackItem[]>([
    { id: '1', name: 'Apples', weight: '500g', selected: false },
    { id: '2', name: 'Beans', weight: '300g', selected: false },
    { id: '3', name: 'Carrot', weight: '1kg', selected: false },
    { id: '4', name: 'Eggplant', weight: '500g', selected: false },
    { id: '5', name: 'Leeks', weight: '500g', selected: false },
  ]);

  // Sample data for additional items
  const [additionalItems, setAdditionalItems] = useState<AdditionalItem[]>([
    { id: '1', name: 'Apples', weight: '500g', selected: false },
    { id: '2', name: 'Beans', weight: '300g', selected: false },
    { id: '3', name: 'Carrot', weight: '1kg', selected: false },
    { id: '4', name: 'Eggplant', weight: '500g', selected: false },
    { id: '5', name: 'Leeks', weight: '500g', selected: false },
  ]);

  const toggleFamilyPackItem = (id: string) => {
    setFamilyPackItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
    setHasUnsavedChanges(true);
  };

  const toggleAdditionalItem = (id: string) => {
    setAdditionalItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleBackPress = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedModal(true);
    } else {
      navigation.goBack();
    }
  };

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

  const handleSubmitPress = () => {
    setShowSubmitModal(true);
  };

  const handleSubmit = async () => {
    try {
      const selectedFamilyItems = familyPackItems.filter(item => item.selected);
      const selectedAdditionalItems = additionalItems.filter(item => item.selected);
      
      // Here you would typically send the data to your API
      console.log('Selected Family Pack Items:', selectedFamilyItems);
      console.log('Selected Additional Items:', selectedAdditionalItems);
      
      // Show success message
      Alert.alert(
        t("Success"),
        t("Order submitted successfully!"),
        [{ text: t("OK"), onPress: () => navigation.goBack() }]
      );
      
      setHasUnsavedChanges(false);
      setShowSubmitModal(false);
      
    } catch (error) {
      Alert.alert(t("Error"), t("Failed to submit order"));
      setShowSubmitModal(false);
    }
  };

  const renderCheckbox = (selected: boolean) => (
    <View className={`w-6 h-6 border-2 rounded ${selected ? 'bg-black border-black' : 'border-gray-300 bg-white'} items-center justify-center`}>
      {selected && <AntDesign name="check" size={14} color="white" />}
    </View>
  );

  const UnsavedChangesModal = () => (
    <Modal
      visible={showUnsavedModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowUnsavedModal(false)}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          <Text className="text-lg font-semibold text-center mb-2">
            {t("OpenedOrderScreen.You have unsubmitted changes!")}
          </Text>
          <Text className="text-gray-600 text-center mb-6">
           {t("OpenedOrderScreen.If you leave this page now, your changes will be lost.")}{'\n'}
            {t("OpenedOrderScreen.Do you want to continue without saving?")}
          </Text>
          
          <TouchableOpacity 
            className="bg-black py-3 rounded-full mb-3"
            onPress={() => setShowUnsavedModal(false)}
          >
            <Text className="text-white text-center font-medium">{t("OpenedOrderScreen.Stay on page")}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-gray-200 py-3 rounded-full"
            onPress={() => {
              setShowUnsavedModal(false);
              navigation.goBack();
            }}
          >
            <Text className="text-gray-700 text-center">{t("OpenedOrderScreen.Leave without Submitting")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const SubmitModal = () => (
    <Modal
      visible={showSubmitModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowSubmitModal(false)}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          <Text className="text-lg font-semibold text-center mb-2">
            {t("OpenedOrderScreen.You have unsubmitted changes!")}
          </Text>
          <Text className="text-gray-600 text-center mb-6">
           {t("OpenedOrderScreen.If you leave this page now, your changes will be lost.")}{'\n'}
            {t("OpenedOrderScreen.Do you want to continue without saving?")}
          </Text>
          
          <TouchableOpacity 
            className="bg-black py-3 rounded-full mb-3"
            onPress={() => {
              setShowSubmitModal(false);
              handleSubmit();
            }}
          >
            <Text className="text-white text-center font-medium">{t("OpenedOrderScreen.Stay on page")}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-gray-200 py-3 rounded-full"
            onPress={() => setShowSubmitModal(false)}
          >
            <Text className="text-gray-700 text-center">Leave without Submitting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white px-4 py-4 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={handleBackPress} className="mr-4">
          <AntDesign name="left" size={24} color="#333" />
        </TouchableOpacity>
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-800 text-lg font-medium">{t("OpenedOrderScreen.INV No")} {orderData.invoiceNo}</Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        
       <View className="mx-4 mt-4 mb-3 justify-center items-center">
          <View className="bg-[#FFB9B7] border border-[#FFB9B7] px-3 py-2 rounded-lg">
            <Text className="text-[#D16D6A] font-medium text-sm">{t("OpenedOrderScreen.Pending")}</Text>
          </View>
        </View>

        {/* Family Pack Section */}
        <View className="mx-4 mb-3">
          <TouchableOpacity 
            className="bg-[#FFF8F8] border border-[#D16D6A] px-4 py-3 rounded-lg flex-row justify-between items-center"
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
            <View className="bg-white border border-[#D16D6A] border-t-0 rounded-b-lg px-4 py-4">
              {familyPackItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className="flex-row justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                  onPress={() => toggleFamilyPackItem(item.id)}
                >
                  <View className="flex-1">
                    <Text className="text-gray-800 font-medium">{item.name}</Text>
                    <Text className="text-gray-500 text-sm">{item.weight}</Text>
                  </View>
                  {renderCheckbox(item.selected)}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Additional Items Section */}
        <View className="mx-4 mb-6">
          <TouchableOpacity 
            className="bg-[#FFF8F8] border border-[#D16D6A] px-4 py-3 rounded-lg flex-row justify-between items-center"
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
            <View className="bg-white border border-[#D16D6A] border-t-0 rounded-b-lg px-4 py-4">
              {additionalItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className="flex-row justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                  onPress={() => toggleAdditionalItem(item.id)}
                >
                  <View className="flex-1">
                    <Text className="text-gray-800 font-medium">{item.name}</Text>
                    <Text className="text-gray-500 text-sm">{item.weight}</Text>
                  </View>
                  {renderCheckbox(item.selected)}
                </TouchableOpacity>
              ))}
                 <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4">
        <TouchableOpacity 
          className="bg-black py-4 rounded-full flex-row items-center justify-center"
          onPress={handleSubmitPress}
        >
          <Text className="text-white font-medium text-base">{t("OpenedOrderScreen.Submit")}</Text>
        </TouchableOpacity>
      </View>
            </View>
          )}
        </View>

        {/* Bottom spacing for submit button */}
        <View className="h-20" />
      </ScrollView>

      {/* Fixed Submit Button */}
   

      {/* Unsaved Changes Modal */}
      <UnsavedChangesModal />
      
      {/* Submit Modal */}
      <SubmitModal />
    </View>
  );
};

export default PendingOrderScreen;