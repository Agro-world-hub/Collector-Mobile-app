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
  Dimensions ,
  Image
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
import CircularProgress from 'react-native-circular-progress-indicator';
import TimerContainer from '@/component/DistributionofficerScreens/TimerContainer '
import Timer from '@/component/DistributionofficerScreens/TimerContainer '




// Define the Order interface
interface OrderItem {
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

interface ReplaceProductData {
  selectedProduct: string;
  selectedProductPrice: string;
  productType: string;
  newProduct: string;
  quantity: string;
  price: string;
}

type PendingOrderScreenNavigationProps = StackNavigationProp<RootStackParamList, 'PendingOrderScreen'>;
type PendingOrderScreenRouteProp = RouteProp<RootStackParamList, "PendingOrderScreen">;

interface PendingOrderScreenProps {
  navigation: PendingOrderScreenNavigationProps;
  route: PendingOrderScreenRouteProp;
}


const { width, height } = Dimensions.get('window');
const loginImage = require("@/assets/images/squareMin.webp");

const PendingOrderScreen: React.FC<PendingOrderScreenProps> = ({ navigation, route }) => {
  const { item, centerCode ,status} = route.params;
  const { t } = useTranslation();
  
  const [orderData, setOrderData] = useState<OrderItem>(item as unknown as OrderItem);
  const [inputWeight, setInputWeight] = useState('');
  const [familyPackExpanded, setFamilyPackExpanded] = useState(false);
  const [additionalItemsExpanded, setAdditionalItemsExpanded] = useState(false);
  const [customSelectedExpanded, setCustomSelectedExpanded] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedItemForReplace, setSelectedItemForReplace] = useState<FamilyPackItem | null>(null);
  const [showWarning, setShowWarning] = useState(false);
 // const [orderStatus, setOrderStatus] = useState('Pending'); // Track dynamic status
  const [completedTime, setCompletedTime] = useState<string | null>(null); // Track completion time
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);
const [countdown, setCountdown] = useState(30);
const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout | null>(null);
const [orderStatus, setOrderStatus] = useState<'Pending' | 'Opened' | 'Completed' | 'In Progress'>(
  status || item.status || 'Pending'
);
const [showSuccessModal, setShowSuccessModal] = useState(false);
const [selectpackage, setSelectpackage] = useState(false);
const [selectopen, setSelectopen,] = useState(false);
  
  //const [completedTime, setCompletedTime] = useState<string | null>(item.completedTime || null);

  // Sample data for family pack items
  const [familyPackItems, setFamilyPackItems] = useState<FamilyPackItem[]>([
    { id: '1', name: 'Apples', weight: '0.5 kg', selected: false },
    { id: '2', name: 'Beans', weight: '0.3 kg', selected: false },
    { id: '3', name: 'Cabbage', weight: '0.5 kg', selected: false },
    { id: '4', name: 'Eggplant', weight: '0.5 kg', selected: false },
    { id: '5', name: 'Beans', weight: '0.3 kg', selected: false },
    { id: '6', name: 'Cabbage', weight: '0.5 kg', selected: false },
    { id: '7', name: 'Eggplant', weight: '0.5 kg', selected: false },
    { id: '8', name: 'Ash Plantain Blossom', weight: '0.5 kg', selected: false },
  ]);

  // Sample data for additional items
  const [additionalItems, setAdditionalItems] = useState<AdditionalItem[]>([
    { id: '1', name: 'Apples', weight: '500g', selected: false },
    { id: '2', name: 'Beans', weight: '300g', selected: false },
    { id: '3', name: 'Carrot', weight: '1kg', selected: false },
    { id: '4', name: 'Eggplant', weight: '500g', selected: false },
    { id: '5', name: 'Leeks', weight: '500g', selected: false },
  ]);

  console.log("dcbkisai",status)



useEffect(() => {
  const familySelectedCount = familyPackItems.filter(item => item.selected).length;
  const additionalSelectedCount = additionalItems.filter(item => item.selected).length;
  const familyTotalCount = familyPackItems.length;
  const additionalTotalCount = additionalItems.length;

  const allFamilySelected = familySelectedCount === familyTotalCount;
  const allAdditionalSelected = additionalSelectedCount === additionalTotalCount;

  // Update showWarning based on selection state
  setShowWarning(familySelectedCount > 0 || additionalSelectedCount > 0);

  // Only update if status wasn't passed via route.params
  if (!status) {
    if (allFamilySelected && allAdditionalSelected) {
      setOrderStatus('Completed');
      setCompletedTime(new Date().toLocaleString());
    } else if (familySelectedCount > 0 || additionalSelectedCount > 0) {
      setOrderStatus('Opened');
    } else {
      setOrderStatus('Pending');
    }
  }
}, [familyPackItems, additionalItems, status]);





useEffect(() => {
  navigation.setOptions({
    headerStyle: {
      backgroundColor: orderStatus === 'Completed' ? '#D4F7D4' :
                        orderStatus === 'Opened' ? '#FFF9C4' :
                        '#FFB9B7', // Default for Pending
    },
    headerTintColor: orderStatus === 'Completed' ? '#2E7D32' :
                      orderStatus === 'Opened' ? '#B8860B' :
                      '#D16D6A', // Default for Pending
  });
}, [orderStatus, navigation]);



  // Timer effect when all items are selected
useEffect(() => {
  const allSelected = areAllFamilyPackItemsSelected() && areAllAdditionalItemsSelected();
  
  if (allSelected && !showCompletionPrompt) {
  //  setShowCompletionPrompt(true);
    startCountdown();
  } else if (!allSelected && showCompletionPrompt) {
    setShowCompletionPrompt(false);
    resetCountdown();
  }
}, [familyPackItems, additionalItems]);

// Clean up interval on unmount
useEffect(() => {
  return () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
  };
}, [countdownInterval]);

const startCountdown = () => {
  setCountdown(30);
  const interval = setInterval(() => {
    setCountdown(prev => {
      if (prev <= 1) {
        clearInterval(interval);
        handleCompleteOrder();
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  setCountdownInterval(interval);
};


  const resetCountdown = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      setCountdownInterval(null);
    }
    setCountdown(30);
  };

  // const handleCompleteOrder = () => {
  //   setOrderStatus('Completed');
  //   setCompletedTime(new Date().toLocaleString());
  //   setShowCompletionPrompt(false);
  //   resetCountdown();
  // };

  const handleCompleteOrder = () => {
  setOrderStatus('Completed');
  setCompletedTime(new Date().toLocaleString());
  setShowCompletionPrompt(false);
  setShowSuccessModal(true); // Show success modal
  resetCountdown();
};

  const handleBackToEdit = () => {
    setShowCompletionPrompt(false);
    resetCountdown();
  };
  // Replace product form data
  const [replaceData, setReplaceData] = useState<ReplaceProductData>({
    selectedProduct: '',
    selectedProductPrice: '',
    productType: '',
    newProduct: '',
    quantity: '',
    price: ''
  });

  const isFormComplete = replaceData.newProduct && 
                          replaceData.quantity && 
                          replaceData.price;

  // Sample product options for replacement
  const productOptions = [
    'Apples',
    'Beans', 
    'Cabbage',
    'Carrot',
    'Eggplant',
    'Leeks',
    'Onions',
    'Potatoes',
    'Tomatoes'
  ];

  // Get selected items for custom section
  const getSelectedItems = () => {
    const selectedFamily = familyPackItems.filter(item => item.selected);
    const selectedAdditional = additionalItems.filter(item => item.selected);
    return [...selectedFamily, ...selectedAdditional];
  };

  // Helper functions to check selection status
  const hasFamilyPackSelections = () => {
    return familyPackItems.some(item => item.selected);
  };

  const hasAdditionalItemSelections = () => {
    return additionalItems.some(item => item.selected);
  };

  // Check if all items in a section are selected
  const areAllFamilyPackItemsSelected = () => {
    return familyPackItems.every(item => item.selected);
  };

  const areAllAdditionalItemsSelected = () => {
    return additionalItems.every(item => item.selected);
  };

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

  const handleReplaceProduct = (item: FamilyPackItem) => {
    setSelectedItemForReplace(item);
    setReplaceData({
      selectedProduct: `${item.name} - ${item.weight} - Rs.400.00`,
      selectedProductPrice: 'Rs.400.00',
      productType: 'Up Country Vegetable',
      newProduct: '',
      quantity: '',
      price: ''
    });
    setShowReplaceModal(true);
    setShowDropdown(false);
  };

  const handleReplaceSubmit = () => {
    if (!replaceData.newProduct || !replaceData.quantity || !replaceData.price) {
      Alert.alert(t("Error"), "Please fill all required fields");
      return;
    }

    console.log('Replace request:', replaceData);
    
    setShowReplaceModal(false);
    setShowDropdown(false);
    
    navigation.navigate('TargetOrderScreen' as any, { 
      item: orderData, 
      centerCode,
      replaceRequestData: replaceData 
    });
    
    setReplaceData({
      selectedProduct: '',
      selectedProductPrice: '',
      productType: '',
      newProduct: '',
      quantity: '',
      price: ''
    });
  };

  const handleModalClose = () => {
    setShowReplaceModal(false);
    setShowDropdown(false);
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
  const allSelected = areAllFamilyPackItemsSelected() && areAllAdditionalItemsSelected();
  
  if (allSelected && !showCompletionPrompt) {
   setShowCompletionPrompt(true);
    startCountdown();
  } else if (!allSelected && showCompletionPrompt) {
    setShowCompletionPrompt(false);
    resetCountdown();
  }
}

  const handleSubmit = async () => {
    try {
      const selectedFamilyItems = familyPackItems.filter(item => item.selected);
      const selectedAdditionalItems = additionalItems.filter(item => item.selected);
      
      console.log('Selected Family Pack Items:', selectedFamilyItems);
      console.log('Selected Additional Items:', selectedAdditionalItems);
      
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



  const getStatusStyling = () => {
    switch (orderStatus) {
      case 'Completed':
        return {
          badge: 'bg-[#D4F7D4] border border-[#4CAF50]',
          text: 'text-[#2E7D32]',
          section: 'bg-[#D4F7D4] border border-[#4CAF50]'
        };
      case 'Opened':
        return {
          badge: 'bg-[#FFF9C4] border border-[#F9CC33]',
          text: 'text-[#B8860B]',
          section: 'bg-[#FFF9C4] border border-[#F9CC33]'
        };
      case 'In Progress':
        return {
          badge: 'bg-blue-100 border border-blue-300',
          text: 'text-blue-700',
          section: 'bg-blue-100 border border-blue-300'
        };
      default: // Pending
        return {
          badge: 'bg-[#FFB9B7] border border-[#FFB9B7]',
          text: 'text-[#D16D6A]',
          section: 'bg-[#FFF8F8] border border-[#D16D6A]'
        };
    }
  };



  const statusText = () => {
  switch (orderStatus) {
    case 'Completed': return t("Completed");
    case 'Opened': return t("Opened");
    case 'In Progress': return t("InProgress");
    default: return t("Pending");
  }
};

const statusStyles = getStatusStyling();

  const renderReplaceModal = () => {
    const isFormComplete = replaceData.newProduct && replaceData.quantity && replaceData.price;

    const handleProductSelect = (product: string) => {
      const defaultPrice = '400.00'; // Adjust as needed
      setReplaceData(prev => ({
        ...prev,
        newProduct: product,
        price: `Rs.${defaultPrice}`
      }));
      setShowDropdown(false);
    };

    const handleQuantityChange = (text: string) => {
      if (/^\d*\.?\d*$/.test(text)) {
        setReplaceData(prev => ({
          ...prev,
          quantity: text,
          price: text ? `Rs.${(parseFloat(text) * 400).toFixed(2)}` : `Rs.400.00`
        }));
      }
    };

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showReplaceModal}
        onRequestClose={handleModalClose}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg mx-6 p-6 w-80">
            <View className="justify-between items-center mb-4">
              <Text className="text-lg font-semibold">Replace Product</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="border border-red-300 rounded-lg p-3 mb-4 justify-center items-center">
                <Text className="text-sm text-[#7B7B7B] mb-1">Selected product:</Text>
                <Text className="font-medium  mb-2">
                  {replaceData.selectedProduct}
                </Text>
                <Text className="text-sm text-[#7B7B7B] mb-1">Product Type:</Text>
                <Text className="font-medium ">
                  {replaceData.productType}
                </Text>
              </View>

              <Text className="text-center text-black mb-4">--New Product Details--</Text>

              {/* Product Selection */}
              <View className="mb-4">
               
                <TouchableOpacity
                  className="border border-black rounded-full p-3 flex-row justify-between items-center bg-white"
                  onPress={() => setShowDropdown(!showDropdown)}
                >
                  <Text className={replaceData.newProduct ? "text-black" : "text-gray-400"}>
                    {replaceData.newProduct || "--Select New Product--"}
                  </Text>
                  <AntDesign name={showDropdown ? "up" : "down"} size={16} color="#666" />
                </TouchableOpacity>

                {showDropdown && (
                  <View className="border border-t-0 border-gray-300 rounded-b-lg bg-white max-h-32">
                    <ScrollView>
                      {productOptions.map((product, index) => (
                        <TouchableOpacity
                          key={index}
                          className="p-3 border-b border-gray-100"
                          onPress={() => handleProductSelect(product)}
                        >
                          <Text>{product}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Quantity Input */}
              <View className="mb-4">
                
                <TextInput
                  className="border border-black rounded-full p-3 bg-white"
                  placeholder="Enter Quantity in kg"
                  value={replaceData.quantity}
                  onChangeText={handleQuantityChange}
                  keyboardType="numeric"
                />
              </View>

              {/* Price Display (read-only) */}
              <View className="mb-6">
               
                <View className="border border-black rounded-full p-3 bg-gray-100">
                  <Text className="text-black">
                    {replaceData.price}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="space-y-3">
                <TouchableOpacity
                  className={`py-3 rounded-full px-3 ${isFormComplete ? 'bg-[#FA0000]' : 'bg-[#FA0000]/50'}`}
                  onPress={isFormComplete ? handleReplaceSubmit : undefined}
                  disabled={!isFormComplete}
                >
                  <Text className="text-white text-center font-medium">
                    Send Replace Request
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-[#D9D9D9] py-3 rounded-full px-3"
                  onPress={handleModalClose}
                >
                  <Text className="text-[#686868] text-center font-medium">Go Back</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const SuccessModal = () => (
  <Modal
    visible={showSuccessModal}
    transparent={true}
    animationType="fade"
    onRequestClose={() => setShowSuccessModal(false)}
  >
    <View className="flex-1 bg-black/50 justify-center items-center px-6">
      <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <View className="items-center mb-4">
          {/* <LottieView 
            source={require('@/assets/animations/success-animation.json')}
            autoPlay
            loop={false}
            style={{ width: 100, height: 100 }}
          /> */}
        </View>
        <Text className="text-xl font-bold text-center mb-2">
          Completed Successfully!
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          The order has been marked as completed.
        </Text>
        
        <TouchableOpacity 
          className="bg-black py-3 rounded-full"
          onPress={() => {
            setShowSuccessModal(false);
            navigation.goBack(); // Or navigate to another screen if needed
          }}
        >
          <Text className="text-white text-center font-medium">OK</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
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



  {/* Completion Prompt Modal */}
<Modal
  visible={showCompletionPrompt}
  transparent={true}
  animationType="fade"
  onRequestClose={handleBackToEdit}
>
  <View className="flex-1 bg-black/50 justify-center items-center px-6">
    <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
      {/* Title */}
      <Text className="text-xl font-bold text-center mb-2">
        Finish up!
      </Text>
      
      {/* Description text */}
      <Text className="text-gray-600 text-center mb-2">
        Marking as completed in {countdown} seconds.
      </Text>
      <Text className="text-gray-500 text-sm text-center mb-6">
        Tap 'Go Back' to edit.
      </Text>
      
      {/* Countdown timer - styled as 00:30 format */}
      <View className="flex-row justify-center mb-6">
        <Text className="text-3xl font-bold text-gray-800">
          00:{countdown.toString().padStart(2, '0')}
        </Text>
      </View>
      
      {/* Primary action button - green */}
      <TouchableOpacity 
        className="bg-[#4CAF50] py-4 rounded-full mb-3"
        onPress={handleCompleteOrder}
      >
        <Text className="text-white text-center font-bold text-base">
          Mark as Completed
        </Text>
      </TouchableOpacity>
      
      {/* Secondary action button - light gray */}
      <TouchableOpacity 
        className="bg-gray-200 py-4 rounded-full"
        onPress={handleBackToEdit}
      >
        <Text className="text-gray-700 text-center font-medium text-base">
          Back to Edit
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

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

     // Replace your ScrollView section with this fixed version:

<ScrollView 
  className="flex-1" 
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} // Add padding bottom for fixed button
>
  
  {/* Dynamic Status Badge with Timer */}
  <View className="mx-4 mt-4 mb-3 justify-center items-center">
    <View className={`px-3 py-2 rounded-lg ${
      areAllFamilyPackItemsSelected() && areAllAdditionalItemsSelected()
        ? 'bg-[#D4F7D4] border border-[#4CAF50]' // Completed - Green
        : hasFamilyPackSelections() && hasAdditionalItemSelections()
          ? 'bg-[#FFF9C4] border border-[#F9CC33]' // Opened - Yellow
          : 'bg-[#FFB9B7] border border-[#FFB9B7]' // Pending - Red
    }`}>
      <Text className={`font-medium text-sm ${
        areAllFamilyPackItemsSelected() && areAllAdditionalItemsSelected()
          ? 'text-[#2E7D32]' // Completed - Dark green text
          : hasFamilyPackSelections() && hasAdditionalItemSelections()
            ? 'text-[#B8860B]' // Opened - Gold text
            : 'text-[#D16D6A]' // Pending - Red text
      }`}>
        {areAllFamilyPackItemsSelected() && areAllAdditionalItemsSelected() 
          ? 'Completed' 
          : hasFamilyPackSelections() && hasAdditionalItemSelections()
            ? 'Opened'
            : status}
      </Text>
    </View>
  </View>

  {/* Family Pack Section */}
  <View className="mx-4 mb-3">
    <TouchableOpacity 
      className={`px-4 py-3 rounded-lg flex-row justify-between items-center ${
        areAllFamilyPackItemsSelected() 
          ? 'bg-[#D4F7D4] border border-[#4CAF50]'
          : hasFamilyPackSelections() 
            ? 'bg-[#FFF9C4] border border-[#F9CC33]'
            : 'bg-[#FFF8F8] border border-[#D16D6A]'
      }`}
      onPress={() => setFamilyPackExpanded(!familyPackExpanded)}
    >
      <Text className="text-[#000000] font-medium">
        Family Pack for 2 {areAllFamilyPackItemsSelected() && orderStatus === 'Completed' }
      </Text>
      <AntDesign 
        name={familyPackExpanded ? "up" : "down"} 
        size={16} 
        color="#000000" 
      />
    </TouchableOpacity>
    
    {familyPackExpanded && (
      <View className={`bg-white border border-t-0 rounded-b-lg px-4 py-4 ${
        areAllFamilyPackItemsSelected() 
          ? statusStyles.section.replace('bg-[#D4F7D4]', '').replace('bg-[#FFF9C4]', '').replace('bg-[#FFF8F8]', '') + ' border-[#4CAF50]'
          : hasFamilyPackSelections() 
            ? 'border-[#F9CC33]'
            : 'border-[#D16D6A]'
      }`}>
        {familyPackItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="flex-row justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
            onPress={() => toggleFamilyPackItem(item.id)}
          >
            <View className="flex-row">
              <TouchableOpacity 
                className="w-8 h-8 items-center justify-center mr-3"
                onPress={() => handleReplaceProduct(item)}
              >
                <Image source={loginImage} style={{ width: 20, height: 20 }}/>
              </TouchableOpacity>
              <View>
                <Text className={`font-medium ${item.selected && orderStatus === 'Completed' ? 'text-black' : 'text-black'}`}>
                  {item.name}
                </Text>
                <Text className="text-gray-500 text-sm">{item.weight}</Text>
              </View>
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
      className={`px-4 py-3 rounded-lg flex-row justify-between items-center ${
        areAllAdditionalItemsSelected() 
          ? 'bg-[#D4F7D4] border border-[#4CAF50]'
          : hasAdditionalItemSelections() 
            ? 'bg-[#FFF9C4] border border-[#F9CC33]'
            : 'bg-[#FFF8F8] border border-[#D16D6A]'
      }`}
      onPress={() => setAdditionalItemsExpanded(!additionalItemsExpanded)}
    >
      <Text className="text-[#000000] font-medium">
        Custom Selected Items {areAllAdditionalItemsSelected() && orderStatus === 'Completed' }
      </Text>
      <AntDesign 
        name={additionalItemsExpanded ? "up" : "down"} 
        size={16} 
        color="#000000" 
      />
    </TouchableOpacity>
    
    {additionalItemsExpanded && (
      <View className={`bg-white border border-t-0 rounded-b-lg px-4 py-4 ${
        areAllAdditionalItemsSelected() 
          ? statusStyles.section.replace('bg-[#D4F7D4]', '').replace('bg-[#FFF9C4]', '').replace('bg-[#FFF8F8]', '') + ' border-[#4CAF50]'
          : hasAdditionalItemSelections() 
            ? 'border-[#F9CC33]'
            : 'border-[#D16D6A]'
      }`}>
        {additionalItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="flex-row justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
            onPress={() => toggleAdditionalItem(item.id)}
          >
            <View className="flex-1">
              <Text className={`font-medium ${item.selected && orderStatus === 'Completed' ? 'text-black' : 'text-black'}`}>
                {item.name}
              </Text>
              <Text className="text-gray-500 text-sm">{item.weight}</Text>
            </View>
            {renderCheckbox(item.selected)}
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>

  {/* Warning Message - moved inside ScrollView */}
  {showWarning && orderStatus !== 'Completed' && (
    <View className="mx-4 mb-4 bg-white px-4 py-2">
      <Text 
        className="text-sm text-center italic"
        style={{
          color: orderStatus === 'Opened'
            ? '#FA0000' // Red for "Select all remaining items"
            : areAllFamilyPackItemsSelected() && areAllAdditionalItemsSelected()
              ? '#308233' // Green for "All checked. Order will move to 'Completed'"
              : '#FA0000' // Red for "Unchecked items remain"
        }}
      >
        {orderStatus === 'Opened'
          ? "Select all remaining items to complete the order."
          : areAllFamilyPackItemsSelected() && areAllAdditionalItemsSelected()
            ? <>All checked. Order will move to <Text style={{ fontWeight: 'bold' }}>'Completed'</Text> on save.</>
            : <>Unchecked items remain. Saving now keeps the order in <Text style={{ fontWeight: 'bold' }}>'Opened'</Text> Status.</>
        }
      </Text>
    </View>
  )}
</ScrollView>
   

      {/* Fixed Submit Button */}
      <View className="absolute bottom-0 left-2 right-2 bg-white px-4 py-4">
        <TouchableOpacity 
          className={'py-3 rounded-full px-3 bg-black'}
          disabled={!showWarning}
          onPress={handleSubmitPress}
        >
          <View className='justify-center items-center'>
            <Text className="text-white font-medium text-base justify-center items-center">
              Save
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <UnsavedChangesModal />
      <SubmitModal />
<SuccessModal /> 
      {renderReplaceModal()}

  <Modal
        visible={showCompletionPrompt}
        transparent={true}
        animationType="fade"
        onRequestClose={handleBackToEdit}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <Text className="text-xl font-bold text-center mb-2">
              Finish up!
            </Text>
            <Text className="text-gray-600 text-center mb-2">
              Marking as completed soon.
            </Text>
            <Text className="text-gray-500 text-sm text-center mb-6">
              Tap 'Go Back' to edit.
            </Text>

            {/* Timer Component */}
            <View className="justify-center items-center mb-6">
                <Timer
                size={150}
                fontSize={24}
                minutes={0.5} // 30 seconds
                fillColor="#000000"
                bgColor="#FFFFFF"
                backgroundColor="#E5E7EB"
                showMs={false}
                onComplete={handleCompleteOrder}
             //   completeMsg="Done!"
                running={showCompletionPrompt}
                strokeWidth={6}
              />
            </View>

            <TouchableOpacity
              className="bg-[#000000] py-4 rounded-full mb-3"
              onPress={handleCompleteOrder}
            >
              <Text className="text-white text-center font-bold text-base">
                Mark as Completed
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-200 py-4 rounded-full"
              onPress={handleBackToEdit}
            >
              <Text className="text-gray-700 text-center font-medium text-base">
                Back to Edit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PendingOrderScreen;