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
  Image,
  ActivityIndicator
} from 'react-native';
import { RootStackParamList } from '../types';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { environment } from '@/environment/environment';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";
import { RouteProp, useFocusEffect } from '@react-navigation/native';
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
  price: string;
  productType: number;
  productTypeName?: string; // Add this field
}

interface AdditionalItem {
  id: string;
  name: string;
  weight: string;
  selected: boolean;
  price:string
}

interface ReplaceProductData {
  selectedProduct: string;
  selectedProductPrice: string;
  productType: number;
  newProduct: string;
  quantity: string;
  price: string;
  productTypeName:string
}

interface PackageItem {
  id: number;
  productType: string;
  productId: number;
  qty: number;
  price: number;
  isPacked: number;
  productName: string;
  category: string;
  normalPrice: number;
  productTypeName:string;
}



interface BackendAdditionalItem {
  id: number;
  productId: number;
  qty: string;
  unit: string;
  price: string;
  discount: string;
  isPacked: number; // 0 = not packed, 1 = packed
  productName: string;
  category: string;
  normalPrice: string;
}

interface PackageData {
  id: number;
  packageId: number;
  packingStatus: string;
  createdAt: string;
  items: PackageItem[];
}

interface OrderInfo {
  orderId: number;
  isPackage: number;
  orderUserId: number;
  orderApp: string;
  buildingType: string;
  sheduleType: string;
  sheduleDate: string;
  sheduleTime: string;
  orderCreatedAt: string;
}


interface RetailItem {
  id: number;
  varietyId: string;
  displayName: string;
  category: string;
  normalPrice: number;
  discountedPrice: number;
  discount: number;
  promo: number;
  unitType: string;
  startValue: number;
  changeby: string;
  displayType: string;
  tags: string;
  createdAt: string;
  maxQuantity: number;
}


interface BackendOrderData {
  orderInfo: OrderInfo;
  additionalItems: BackendAdditionalItem[];
  packageData: PackageData;
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
const [packageName, setPackageName] = useState<string>('Family Pack');
const [packageId, setPackageId] = useState<number | null>(null);  

const [typeName, setTypeeName] = useState<string>('');
  //const [completedTime, setCompletedTime] = useState<string | null>(item.completedTime || null);

  // Sample data for family pack items
  const [familyPackItems, setFamilyPackItems] = useState<FamilyPackItem[]>([
  
  ]);
const [retailItems, setRetailItems] = useState<RetailItem[]>([]);
const [loadingRetailItems, setLoadingRetailItems] = useState(false);
  // Sample data for additional items
  const [additionalItems, setAdditionalItems] = useState<AdditionalItem[]>([
  
  ]);

  console.log("dcbkisai",status)

  console.log("ordreid",item.orderId)
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);
const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  
  // Fetch selected language
  const fetchSelectedLanguage = async () => {
    try {
      const lang = await AsyncStorage.getItem("@user_language");
      setSelectedLanguage(lang || "en");
    } catch (error) {
      console.error("Error fetching language preference:", error);
    }
  };





useEffect(() => {
  const loadOrderData = async () => {
    setLoading(true);
    const orderData = await fetchOrderData(item.orderId);

    if (orderData.packageData?.id) {
        setPackageId(orderData.packageData.id);
      }
    
    if (orderData) {
      // Map Family Pack Items from packageData if it exists
      const mappedFamilyPackItems: FamilyPackItem[] = orderData.packageData?.items?.map((item: any) => ({
        id: item.id,
        name: item.productName,
        weight: `${item.qty} Kg`,
        selected: item.isPacked === 1,
        price: item.price || item.normalPrice || "0",
        productType: item.productType ,// Make sure this is included and properly mapped
        productTypeName: item.productTypeName
      })) || [];

      // Map Additional Items from additionalItems if it exists
      const mappedAdditionalItems: AdditionalItem[] = orderData.additionalItems?.map((item: any) => ({
        id: item.id.toString(),
        name: item.productName,
        weight: `${item.qty}${item.unit}`,
        selected: item.isPacked === 1,
        price: item.price || item.normalPrice || "0"
      })) || [];

      console.log('Mapped Family Pack Items:', mappedFamilyPackItems);
      console.log('Mapped Additional Items:', mappedAdditionalItems);

      // Set package name from backend data
      if (orderData.packageData?.packageName) {
        setPackageName(orderData.packageData.packageName);
      }

      if (orderData.packageData?.items && orderData.packageData.items.length > 0) {
        const productTypeNames = orderData.packageData.items
          .map((item: any) => item.productTypeName)
          .filter((name: string) => name) // Remove null/undefined values
          .filter((name: string, index: number, array: string[]) => array.indexOf(name) === index); // Remove duplicates
        
        // Set the first product type name or join multiple names
        if (productTypeNames.length > 0) {
          setTypeeName(productTypeNames.join(', ')); // Join multiple types with comma
        }
      }

      setFamilyPackItems(mappedFamilyPackItems);
      setAdditionalItems(mappedAdditionalItems);
      
      // Set initial order status based on packed items
      const allFamilyPacked = mappedFamilyPackItems.length === 0 || mappedFamilyPackItems.every(item => item.selected);
      const allAdditionalPacked = mappedAdditionalItems.length === 0 || mappedAdditionalItems.every(item => item.selected);
      const someFamilyPacked = mappedFamilyPackItems.some(item => item.selected);
      const someAdditionalPacked = mappedAdditionalItems.some(item => item.selected);

      // Update status logic to handle empty arrays
      if (mappedFamilyPackItems.length === 0 && mappedAdditionalItems.length === 0) {
        setOrderStatus('Pending');
      } else if (allFamilyPacked && allAdditionalPacked) {
        setOrderStatus('Completed');
        setCompletedTime(new Date().toLocaleString());
      } else if (someFamilyPacked || someAdditionalPacked) {
        setOrderStatus('Opened');
      } else {
        setOrderStatus('Pending');
      }

      setError(null);
    } else {
      setError(t('Failed to load order data'));
    }
    
    setLoading(false);
  };

  loadOrderData();
}, [item.orderId, t]);

// Update helper functions to handle empty arrays
const hasFamilyPackSelections = () => {
  return familyPackItems.length > 0 && familyPackItems.some(item => item.selected);
};

const hasAdditionalItemSelections = () => {
  return additionalItems.length > 0 && additionalItems.some(item => item.selected);
};

const areAllFamilyPackItemsSelected = () => {
  return familyPackItems.length === 0 || familyPackItems.every(item => item.selected);
};

const areAllAdditionalItemsSelected = () => {
  return additionalItems.length === 0 || additionalItems.every(item => item.selected);
};

// Update the timer effect to handle empty arrays
useEffect(() => {
  const hasFamily = familyPackItems.length > 0;
  const hasAdditional = additionalItems.length > 0;
  
  let allSelected = false;
  
  if (hasFamily && hasAdditional) {
    allSelected = areAllFamilyPackItemsSelected() && areAllAdditionalItemsSelected();
  } else if (hasFamily && !hasAdditional) {
    allSelected = areAllFamilyPackItemsSelected();
  } else if (!hasFamily && hasAdditional) {
    allSelected = areAllAdditionalItemsSelected();
  }
  
  if (allSelected && !showCompletionPrompt) {
    startCountdown();
  } else if (!allSelected && showCompletionPrompt) {
    setShowCompletionPrompt(false);
    resetCountdown();
  }
}, [familyPackItems, additionalItems]);


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



const handleCompleteOrder = async () => {
  try {
    // First update the local state
    setOrderStatus('Completed');
    setCompletedTime(new Date().toLocaleString());
    setShowCompletionPrompt(false);
    resetCountdown();

    // Prepare the data for backend update
    const selectedFamilyItems = familyPackItems.map(item => ({
      id: parseInt(item.id),
      isPacked: 1 // Mark all as packed when completing
    }));

    const selectedAdditionalItems = additionalItems.map(item => ({
      id: parseInt(item.id),
      isPacked: 1 // Mark all as packed when completing
    }));

    const updateData = {
      orderId: item.orderId,
      packageItems: selectedFamilyItems,
      additionalItems: selectedAdditionalItems,
      status: 'Completed'
    };

    console.log('Completing order with data:', updateData);
    
    // Make API call to update the order in backend
    const token = await AsyncStorage.getItem('token');
    const response = await axios.put(
      `${environment.API_BASE_URL}api/distribution/update-order/${item.orderId}`,
      updateData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
      // Update all items to selected state in UI
      setFamilyPackItems(prev => 
        prev.map(item => ({ ...item, selected: true }))
      );
      setAdditionalItems(prev => 
        prev.map(item => ({ ...item, selected: true }))
      );
      
      // Clear unsaved changes flag
      setHasUnsavedChanges(false);
      
      // **NEW: Call the distributed target API for completed order**
      try {
        console.log('Calling distributed target API for completed order...');
        
        const distributedTargetResponse = await axios.put(
          `${environment.API_BASE_URL}api/distribution/update-distributed-target/${item.orderId}`,
          {}, // Empty body as the API likely uses the orderId from the URL
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (distributedTargetResponse.data.success) {
          console.log('Distributed target updated successfully');
        } else {
          console.warn('Distributed target update failed:', distributedTargetResponse.data.message);
        }
      } catch (distributedTargetError) {
        console.error('Error updating distributed target:', distributedTargetError);
        // Don't block the success flow, but log the error
      }
      
      // Show success modal
      setShowSuccessModal(true);
      
      console.log('Order completed successfully');
    } else {
      throw new Error(response.data.message || 'Failed to complete order');
    }
    
  } catch (error) {
    console.error('Error completing order:', error);
    
    // Revert local state if API call failed
    setOrderStatus('Opened'); // Revert to previous state
    setCompletedTime(null);
    
    Alert.alert(
      t("Error"), 
      t("Failed to complete order. Please try again."),
      [
        {
          text: t("OK"),
          onPress: () => {
            // Restart the timer if user wants to try again
            setShowCompletionPrompt(true);
            startCountdown();
          }
        }
      ]
    );
  }
};
  const handleBackToEdit = () => {
    setShowCompletionPrompt(false);
    resetCountdown();
  };
  // Replace product form data
  const [replaceData, setReplaceData] = useState<ReplaceProductData>({
    selectedProduct: '',
    selectedProductPrice: '',
    productType: 0,
    newProduct: '',
    quantity: '',
    price: '',
    productTypeName: '',
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
  if (!item) {
    console.log("No item provided to handleReplaceProduct");
    return;
  }

  // Add a small delay to ensure data is fully loaded
  setTimeout(() => {
    console.log("Original item data:", {
      name: item.name,
      price: item.price,
      weight: item.weight,
      productType: item.productType,
      id: item.id
    });

    // Validate required data before proceeding
    if (!item.price || item.price === undefined) {
      console.log("Price is undefined, attempting to fetch latest data");
      Alert.alert(
        t("Error"),
        "Product price information is not available. Please try again.",
        [{ text: t("OK") }]
      );
      return;
    }

    if (!item.productType || item.productType === undefined) {
      console.log("ProductType is undefined, using default");
      // You might want to set a default or fetch the latest data
    }

    const weightKg = parseFloat(item.weight.split(' ')[0]) || 0;
    const itemPrice = parseFloat(item.price) || 0;
    
    // Fix: Use the item.price directly as totalPrice instead of calculating
    // item.price appears to already be the total price for the given weight
    const totalPrice = itemPrice.toFixed(2);
    
    // If you need unit price per kg, calculate it from total price
    const unitPricePerKg = weightKg > 0 ? (itemPrice / weightKg).toFixed(2) : '0.00';

    console.log("Price calculation:", {
      itemPrice,
      weightKg,
      totalPrice,
      unitPricePerKg,
      originalPrice: item.price,
      productType: item.productType
    });

    // Only proceed if we have valid data
    if (itemPrice > 0 && weightKg > 0) {
      setReplaceData({
        selectedProduct: `${item.name} - ${item.weight} - Rs.${totalPrice}`,
        selectedProductPrice: totalPrice,
        productType: item.productType || 0, // Use 0 as default if undefined
        newProduct: '',
        quantity: '',
        price: `Rs.${totalPrice}`, // Use the actual item price
        productTypeName: item.productTypeName || ''
      });

      setSelectedItemForReplace(item);
      setShowReplaceModal(true);
    } else {
      Alert.alert(
        t("Error"),
        "Invalid product data. Please refresh and try again.",
        [{ text: t("OK") }]
      );
    }
  }, 100); // Small delay to ensure state is updated
};

const handleReplaceSubmit = async () => {
  if (!replaceData.newProduct || !replaceData.quantity || !replaceData.price) {
    Alert.alert(t("Error"), "Please fill all required fields");
    return;
  }

  if (!packageId) {
    Alert.alert(t("Error"), "Package ID not found");
    return;
  }

  if (!selectedItemForReplace) {
    Alert.alert(t("Error"), "No item selected for replacement");
    return;
  }

  try {
    // Find the selected retail item to get its ID
    const selectedRetailItem = retailItems.find(item => 
      item.displayName === replaceData.newProduct
    );

    if (!selectedRetailItem) {
      throw new Error("Selected product not found");
    }

    // Extract numeric price (remove "Rs." if present)
    const priceValue = parseFloat(replaceData.price.replace(/[^\d.]/g, '')) || 0;

    // Prepare the replacement request data
    const replacementRequest = {
      orderPackageId: packageId,
      replaceId: parseInt(selectedItemForReplace.id),
      originalItemId: parseInt(selectedItemForReplace.id),
      productType: selectedItemForReplace.productType,
      productId: selectedRetailItem.id,
      qty: replaceData.quantity,
      price: priceValue *1000, // Remove the *1000 multiplication temporarily
      status: "Pending"
    };

    console.log('Replacement request data:', replacementRequest);

    // Get token and add validation
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert(t("Error"), "Authentication token not found. Please login again.");
      return;
    }

    // Make API call to create replacement request
    const response = await axios.post(
      `${environment.API_BASE_URL}api/distribution/replace-order-package`,
      replacementRequest,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
      Alert.alert(
        t("Success"),
        t("Replacement request submitted successfully!"),
        [{ 
          text: t("OK"), 
          onPress: () => {
            // Close modal and reset state
            setShowReplaceModal(false);
            setShowDropdown(false);
            setSelectedItemForReplace(null);
            
            // Reset replace data
            setReplaceData({
              selectedProduct: '',
              selectedProductPrice: '',
              productType: 0,
              newProduct: '',
              quantity: '',
              price: '',
              productTypeName: '',
            });
            
            // Navigate to TargetOrderScreen
            navigation.navigate('TargetOrderScreen');
          }
        }]
      );
    } else {
      throw new Error(response.data.message || 'Failed to submit replacement request');
    }
  } catch (error) {
    console.error('Error submitting replacement request:', error);
    
    // Enhanced error handling for different HTTP status codes
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        console.log('403 Error Details:', error.response?.data);
        const errorMessage = error.response?.data?.message || "You don't have permission to create replacement requests.";
        Alert.alert(
          t("Permission Denied"),
          errorMessage + " Please contact your administrator."
        );
      } else if (error.response?.status === 401) {
        Alert.alert(
          t("Authentication Error"),
          t("Your session has expired. Please login again.")
        );
      } else if (error.response?.status === 400) {
        // Log the response for debugging
        console.log('400 Error Response:', error.response?.data);
        Alert.alert(
          t("Invalid Request"),
          t("Please check your input data and try again.")
        );
      } else if (error.response?.status === 500) {
        Alert.alert(
          t("Server Error"),
          t("Internal server error. Please try again later.")
        );
      } else {
        Alert.alert(
          t("Error"),
          t("Failed to submit replacement request. Please try again.")
        );
      }
    } else {
      Alert.alert(
        t("Error"), 
        t("An unexpected error occurred. Please try again.")
      );
    }
  }
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




const handleSubmit = async () => {
  try {
    // Prepare package items update data
    const selectedFamilyItems = familyPackItems
      .filter(item => item.selected)
      .map(item => ({
        id: parseInt(item.id),
        isPacked: 1 // Mark as packed
      }));

    // Prepare additional items update data
    const selectedAdditionalItems = additionalItems
      .filter(item => item.selected)
      .map(item => ({
        id: parseInt(item.id),
        isPacked: 1 // Mark as packed
      }));

    // Determine the new status
    const allFamilyPacked = familyPackItems.length === 0 || 
      familyPackItems.every(item => item.selected);
    const allAdditionalPacked = additionalItems.length === 0 || 
      additionalItems.every(item => item.selected);
    const newStatus = allFamilyPacked && allAdditionalPacked ? 'Completed' : 'Opened';

    const updateData = {
      orderId: item.orderId,
      packageItems: selectedFamilyItems,
      additionalItems: selectedAdditionalItems,
      status: newStatus
    };

    console.log('Submitting order update:', updateData);
    
    // Get auth token
    const token = await AsyncStorage.getItem('token');
    
    // Make API call to update the order
    const response = await axios.put(
      `${environment.API_BASE_URL}api/distribution/update-order/${item.orderId}`,
      updateData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
      // Update local state
      setOrderStatus(newStatus);
      if (newStatus === 'Completed') {
        setCompletedTime(new Date().toLocaleString());
      }
      
      // **NEW: Call the distributed target API when all items are selected**
      if (newStatus === 'Completed') {
        try {
          console.log('Calling distributed target API for completed order...');
          
          const distributedTargetResponse = await axios.put(
            `${environment.API_BASE_URL}api/distribution/update-distributed-target/${item.orderId}`,
            {}, // Empty body as the API likely uses the orderId from the URL
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (distributedTargetResponse.data.success) {
            console.log('Distributed target updated successfully');
          } else {
            console.warn('Distributed target update failed:', distributedTargetResponse.data.message);
            // Don't throw error here as the main order update was successful
          }
        } catch (distributedTargetError) {
          console.error('Error updating distributed target:', distributedTargetError);
          // Don't throw error here as the main order update was successful
          // You might want to show a warning to the user but not block the success flow
        }
      }
      
      Alert.alert(
        t("Success"),
        t("Order updated successfully!"),
        [{ text: t("OK"), onPress: () => navigation.goBack() }]
      );
    } else {
      throw new Error(response.data.message || 'Failed to update order');
    }
    
    setHasUnsavedChanges(false);
    setShowSubmitModal(false);
    
  } catch (error) {
    console.error('Error updating order:', error);
    Alert.alert(t("Error"), t("Failed to update order"));
    setShowSubmitModal(false);
  }
};



const handleSubmitPress = () => {
  const hasFamily = familyPackItems.length > 0;
  const hasAdditional = additionalItems.length > 0;
  
  let allSelected = false;
  
  if (hasFamily && hasAdditional) {
    allSelected = areAllFamilyPackItemsSelected() && areAllAdditionalItemsSelected();
  } else if (hasFamily && !hasAdditional) {
    allSelected = areAllFamilyPackItemsSelected();
  } else if (!hasFamily && hasAdditional) {
    allSelected = areAllAdditionalItemsSelected();
  }
  
  if (allSelected) {
    // If all items are selected, show completion prompt
    if (!showCompletionPrompt) {
      setShowCompletionPrompt(true);
      startCountdown();
    }
  } else {
    // If not all items are selected, submit immediately
    handleSubmit();
  }
}

useEffect(() => {
  const hasFamily = familyPackItems.length > 0;
  const hasAdditional = additionalItems.length > 0;
  
  let hasSelections = false;
  
  if (hasFamily && hasAdditional) {
    hasSelections = hasFamilyPackSelections() || hasAdditionalItemSelections();
  } else if (hasFamily && !hasAdditional) {
    hasSelections = hasFamilyPackSelections();
  } else if (!hasFamily && hasAdditional) {
    hasSelections = hasAdditionalItemSelections();
  }
  
  setShowWarning(hasSelections);
}, [familyPackItems, additionalItems]);
 

  const renderCheckbox = (selected: boolean) => (
    <View className={`w-6 h-6 border-2 rounded ${selected ? 'bg-black border-black' : 'border-gray-300 bg-white'} items-center justify-center`}>
      {selected && <AntDesign name="check" size={14} color="white" />}
    </View>
  );



  // const getStatusStyling = () => {
  //   switch (orderStatus) {
  //     case 'Completed':
  //       return {
  //         badge: 'bg-[#D4F7D4] border border-[#4CAF50]',
  //         text: 'text-[#2E7D32]',
  //         section: 'bg-[#D4F7D4] border border-[#4CAF50]'
  //       };
  //     case 'Opened':
  //       return {
  //         badge: 'bg-[#FFF9C4] border border-[#F9CC33]',
  //         text: 'text-[#B8860B]',
  //         section: 'bg-[#FFF9C4] border border-[#F9CC33]'
  //       };
  //     case 'In Progress':
  //       return {
  //         badge: 'bg-blue-100 border border-blue-300',
  //         text: 'text-blue-700',
  //         section: 'bg-blue-100 border border-blue-300'
  //       };
  //     default: // Pending
  //       return {
  //         badge: 'bg-[#FFB9B7] border border-[#FFB9B7]',
  //         text: 'text-[#D16D6A]',
  //         section: 'bg-[#FFF8F8] border border-[#D16D6A]'
  //       };
  //   }
  // };

const fetchOrderData = async (orderId: string) => {
  try {
    // Get auth token from AsyncStorage
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      Alert.alert(t("Error"), "Authentication token not found");
      return null;
    }

    const response = await axios.get(
      `${environment.API_BASE_URL}api/distribution/order-data/${orderId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("datakbj===================",response.data)

    if (response.data && response.data.success) {
      return response.data.data; // Assuming the API returns { success: true, data: orderData }
    } else {
      throw new Error(response.data.message || 'Failed to fetch order data');
    }
  } catch (error) {
    console.error('Error fetching order data:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        Alert.alert(t("Error"), "Session expired. Please login again.");
        // Navigate to login screen or handle logout
        return null;
      } else if (error.response?.status === 404) {
        Alert.alert(t("Error"), "Order not found");
        return null;
      }
    }
    
    Alert.alert(t("Error"), "Failed to fetch order data");
    return null;
  }
};

useEffect(() => {
  const loadOrderData = async () => {
    setLoading(true);
    try {
      const orderData = await fetchOrderData(item.orderId);
      
      if (orderData && orderData.packageData) {
        console.log("Raw order data:", orderData);
        
        // Map backend data to frontend state with proper validation
        const mappedFamilyPackItems: FamilyPackItem[] = orderData.packageData.items.map((backendItem: any) => {
          console.log("Mapping backend item:", backendItem);
          
          return {
            id: backendItem.id?.toString() || '',
            name: backendItem.productName || backendItem.name || 'Unknown Product',
            weight: backendItem.qty ? `${backendItem.qty} Kg` : `${backendItem.weight || '0'} Kg`,
            selected: backendItem.isPacked === 1,
            // Ensure price and productType are properly mapped
            price: backendItem.price || backendItem.unitPrice || backendItem.pricePerKg || '0',
            productType: backendItem.productType || backendItem.product_type || 0,
            productTypeName: backendItem.productTypeName || backendItem.product_type_name 
          };
        }) || [];

        console.log("Mapped family pack items:", mappedFamilyPackItems);
        
        setFamilyPackItems(mappedFamilyPackItems);
        
        // Set package ID for replacement requests
        if (orderData.packageData.id) {
          setPackageId(orderData.packageData.id);
        }
        
        setError(null);
      } else {
        console.log("No package data found in order data");
        setError(t('No package data found'));
      }
    } catch (error) {
      console.error("Error in loadOrderData:", error);
      setError(t('Failed to load order data'));
    } finally {
      setLoading(false);
    }
  };

  if (item.orderId) {
    loadOrderData();
  }
}, [item.orderId, t]); // Dependencies: rerun if orderId or translation function changes


  const statusText = () => {
  switch (orderStatus) {
    case 'Completed': return t("Completed");
    case 'Opened': return t("Opened");
    case 'In Progress': return t("InProgress");
    default: return t("Pending");
  }
};

//const statusStyles = getStatusStyling();



// Update the fetchRetailItems function
const fetchRetailItems = async () => {
  try {
    setLoadingRetailItems(true);
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      Alert.alert(t("Error"), "Authentication token not found");
      return;
    }

    const response = await axios.get(
      `${environment.API_BASE_URL}api/distribution/all-retail-items/${item.orderId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && Array.isArray(response.data)) {
      // Convert string prices to numbers and filter if needed
      const processedItems = response.data.map(item => ({
        ...item,
        normalPrice: parseFloat(item.normalPrice) || 0,
        discountedPrice: parseFloat(item.discountedPrice) || 0
      }));
      setRetailItems(processedItems);
    } else {
      console.error('Invalid retail items response:', response.data);
      setRetailItems([]);
    }
  } catch (error) {
    console.error('Error fetching retail items:', error);
    Alert.alert(t("Error"), "Failed to fetch retail items");
    setRetailItems([]);
  } finally {
    setLoadingRetailItems(false);
  }
};

// Call this when the replace modal opens
useEffect(() => {
  if (showReplaceModal) {
    fetchRetailItems();
  }
}, [showReplaceModal]);

// Update the renderReplaceModal function
const renderReplaceModal = () => {
  const isFormComplete = replaceData.newProduct && 
                         replaceData.quantity && 
                         replaceData.price;

  const handleProductSelect = (product: RetailItem) => {
    setReplaceData(prev => ({
      ...prev,
      newProduct: product.displayName,
      price: `Rs.${(product.discountedPrice || product.normalPrice || 0).toFixed(2)}`
    }));
    setShowDropdown(false);
  };

  const handleQuantityChange = (text: string) => {
    if (/^\d*\.?\d*$/.test(text)) {
      const selectedProduct = retailItems.find(item => 
        item.displayName === replaceData.newProduct
      );
      const price = selectedProduct ? (selectedProduct.discountedPrice || selectedProduct.normalPrice || 0) : 0;
      setReplaceData(prev => ({
        ...prev,
        quantity: text,
        price: text ? `Rs.${(parseFloat(text) * price).toFixed(2)}` : `Rs.${price.toFixed(2)}`
      }));
    }
  };

  // Get product type name for display
  const getProductTypeName = (productType: string) => {
    // You can create a mapping object for better display names
    const productTypeMap: { [key: string]: string } = {
      '1': 'Up Country Vegetable',
      '2': 'Low Country Vegetable',
      '3': 'Fruits',
      '4': 'Rice & Grains',
      '5': 'Spices',
      '6': 'Dairy Products',
      '7': 'Retail Items',
      // Add more mappings as needed
    };
    
    return productTypeMap[productType] || `Product Type ${productType}`;
  };

//   const getDynamicStatus = (): 'Pending' | 'Opened' | 'Completed' => {
//   const hasFamily = familyPackItems.length > 0;
//   const hasAdditional = additionalItems.length > 0;
  
//   let allSelected = false;
//   let someSelected = false;
  
//   if (hasFamily && hasAdditional) {
//     allSelected = areAllFamilyPackItemsSelected() && areAllAdditionalItemsSelected();
//     someSelected = hasFamilyPackSelections() || hasAdditionalItemSelections();
//   } else if (hasFamily && !hasAdditional) {
//     allSelected = areAllFamilyPackItemsSelected();
//     someSelected = hasFamilyPackSelections();
//   } else if (!hasFamily && hasAdditional) {
//     allSelected = areAllAdditionalItemsSelected();
//     someSelected = hasAdditionalItemSelections();
//   }
  
//   return allSelected ? 'Completed' : someSelected ? 'Opened' : 'Pending';
// };

// // Updated getStatusText function with proper translations
// const getStatusText = (status: 'Pending' | 'Opened' | 'Completed') => {
//   switch (status) {
//     case 'Pending':
//       return selectedLanguage === 'si' ? 'අපේක්ෂාවෙන්' : 
//              selectedLanguage === 'ta' ? 'நிலுவையில்' : 
//              t("Status.Pending") || 'Pending';
//     case 'Opened':
//       return selectedLanguage === 'si' ? 'විවෘත කර ඇත' : 
//              selectedLanguage === 'ta' ? 'திறக்கப்பட்டது' : 
//              t("Status.Opened") || 'Opened';
//     case 'Completed':
//       return selectedLanguage === 'si' ? 'සම්පූර්ණයි' : 
//              selectedLanguage === 'ta' ? 'நிறைவானது' : 
//              t("Status.Completed") || 'Completed';
//     default:
//       return status;
//   }
// };

// // Get styling based on status
// const getStatusStyling = (status: 'Pending' | 'Opened' | 'Completed') => {
//   switch (status) {
//     case 'Completed':
//       return {
//         badge: 'bg-[#D4F7D4] border border-[#4CAF50]',
//         text: 'text-[#2E7D32]'
//       };
//     case 'Opened':
//       return {
//         badge: 'bg-[#FFF9C4] border border-[#F9CC33]',
//         text: 'text-[#B8860B]'
//       };
//     default: // Pending
//       return {
//         badge: 'bg-[#FFB9B7] border border-[#FFB9B7]',
//         text: 'text-[#D16D6A]'
//       };
//   }
// };



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
            <Text className="text-lg font-semibold">{t("PendingOrderScreen.Replace Product")}</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="border border-red-300 rounded-lg p-3 mb-4 justify-center items-center">
              <Text className="text-sm text-[#7B7B7B] mb-1">{t("PendingOrderScreen.Selected product")}</Text>
              <Text className="font-medium mb-2">
                {replaceData.selectedProduct}
              </Text>
              <Text className="text-sm text-[#7B7B7B] mb-1">{t("PendingOrderScreen.Product Type")}</Text>
              <Text className="font-medium">
              {replaceData.productTypeName }
            </Text>
            </View>

            <Text className="text-center text-black mb-4">-- {t("PendingOrderScreen.New Product Details")}--</Text>

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
                    {loadingRetailItems ? (
                      <View className="p-3 items-center">
                        <ActivityIndicator size="small" color="#000" />
                      </View>
                    ) : retailItems.length > 0 ? (
                      retailItems.map((product) => (
                        <TouchableOpacity
                          key={product.id}
                          className="p-3 border-b border-gray-100"
                          onPress={() => handleProductSelect(product)}
                        >
                          <Text className="font-medium">{product.displayName}</Text>
                          <Text className="text-xs text-gray-500">
                            {t("PendingOrderScreen.Rs")}.{(product.discountedPrice || product.normalPrice || 0).toFixed(2)} ({product.unitType})
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <View className="p-3 items-center">
                        <Text className="text-gray-500">{t("PendingOrderScreen.No products available")}</Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Quantity Input */}
            <View className="mb-4">
              <TextInput
                className="border border-black rounded-full p-3 bg-white"
                placeholder="Enter Quantity"
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
                  {t("PendingOrderScreen.Send Replace Request")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-[#D9D9D9] py-3 rounded-full px-3"
                onPress={handleModalClose}
              >
                <Text className="text-[#686868] text-center font-medium"> {t("PendingOrderScreen.Go Back")}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

  const getDynamicStatus = (): 'Pending' | 'Opened' | 'Completed' => {
  const hasFamily = familyPackItems.length > 0;
  const hasAdditional = additionalItems.length > 0;
  
  let allSelected = false;
  let someSelected = false;
  
  if (hasFamily && hasAdditional) {
    allSelected = areAllFamilyPackItemsSelected() && areAllAdditionalItemsSelected();
    someSelected = hasFamilyPackSelections() || hasAdditionalItemSelections();
  } else if (hasFamily && !hasAdditional) {
    allSelected = areAllFamilyPackItemsSelected();
    someSelected = hasFamilyPackSelections();
  } else if (!hasFamily && hasAdditional) {
    allSelected = areAllAdditionalItemsSelected();
    someSelected = hasAdditionalItemSelections();
  }
  
  return allSelected ? 'Completed' : someSelected ? 'Opened' : 'Pending';
};

// Updated getStatusText function with proper translations
const getStatusText = (status: 'Pending' | 'Opened' | 'Completed') => {
  switch (status) {
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
      return status;
  }
};

// Get styling based on status
const getStatusStyling = (status: 'Pending' | 'Opened' | 'Completed') => {
  switch (status) {
    case 'Completed':
      return {
        badge: 'bg-[#D4F7D4] border border-[#4CAF50]',
        text: 'text-[#2E7D32]'
      };
    case 'Opened':
      return {
        badge: 'bg-[#FFF9C4] border border-[#F9CC33]',
        text: 'text-[#B8860B]'
      };
    default: // Pending
      return {
        badge: 'bg-[#FFB9B7] border border-[#FFB9B7]',
        text: 'text-[#D16D6A]'
      };
  }
};

const DynamicStatusBadge = () => {
  const dynamicStatus = getDynamicStatus();
  const styling = getStatusStyling(dynamicStatus);
  const statusText = getStatusText(dynamicStatus);
  
  return (
    <View className="mx-4 mt-4 mb-3 justify-center items-center">
      <View className={`px-3 py-2 rounded-lg ${styling.badge}`}>
        <Text className={`font-medium text-sm ${styling.text}`}>
          {statusText}
        </Text>
      </View>
    </View>
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
         {t("PendingOrderScreen.Completed Successfully")}
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          {t("PendingOrderScreen.TheOrder")}
        </Text>
        
        <TouchableOpacity 
          className="bg-black py-3 rounded-full"
          onPress={() => {
            setShowSuccessModal(false);
            navigation.goBack(); // Or navigate to another screen if needed
          }}
        >
          <Text className="text-white text-center font-medium">{t("PendingOrderScreen.OK")}</Text>
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
            {t("PendingOrderScreen.You have unsubmitted changes")}
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
            {t("PendingOrderScreen.You have unsubmitted changes")}
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
            <Text className="text-gray-700 text-center"> {t("PendingOrderScreen.Leave without Submitting")}</Text>
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
        {t("PendingOrderScreen.FinishUp")}
      </Text>
      
      {/* Description text */}
      <Text className="text-gray-600 text-center mb-2">
          {t("PendingOrderScreen.Marking as completed in")}{countdown}   {t("PendingOrderScreen.seconds")}
      </Text>
      <Text className="text-gray-500 text-sm text-center mb-6">
        {t("PendingOrderScreen.TapGoback")}
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
          {t("PendingOrderScreen.Mark as Completed")}
        </Text>
      </TouchableOpacity>
      
      {/* Secondary action button - light gray */}
      <TouchableOpacity 
        className="bg-gray-200 py-4 rounded-full"
        onPress={handleBackToEdit}
      >
        <Text className="text-gray-700 text-center font-medium text-base">
          {t("PendingOrderScreen.Back to Edit")}
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



<ScrollView 
  className="flex-1" 
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
>
  
  {/* Dynamic Status Badge */}
  <View className="mx-4 mt-4 mb-3 justify-center items-center">
    {/* <View className={`px-3 py-2 rounded-lg ${
      (() => {
        const hasFamily = familyPackItems.length > 0;
        const hasAdditional = additionalItems.length > 0;
        
        let allSelected = false;
        let someSelected = false;
        
        if (hasFamily && hasAdditional) {
          allSelected = areAllFamilyPackItemsSelected() && areAllAdditionalItemsSelected();
          someSelected = hasFamilyPackSelections() || hasAdditionalItemSelections();
        } else if (hasFamily && !hasAdditional) {
          allSelected = areAllFamilyPackItemsSelected();
          someSelected = hasFamilyPackSelections();
        } else if (!hasFamily && hasAdditional) {
          allSelected = areAllAdditionalItemsSelected();
          someSelected = hasAdditionalItemSelections();
        }
        
        return allSelected
          ? 'bg-[#D4F7D4] border border-[#4CAF50]' // Completed - Green
          : someSelected
            ? 'bg-[#FFF9C4] border border-[#F9CC33]' // Opened - Yellow
            : 'bg-[#FFB9B7] border border-[#FFB9B7]'; // Pending - Red
      })()
    }`}>
      <Text className={`font-medium text-sm ${
        (() => {
          const hasFamily = familyPackItems.length > 0;
          const hasAdditional = additionalItems.length > 0;
          
          let allSelected = false;
          let someSelected = false;
          
          if (hasFamily && hasAdditional) {
            allSelected = areAllFamilyPackItemsSelected() && areAllAdditionalItemsSelected();
            someSelected = hasFamilyPackSelections() || hasAdditionalItemSelections();
          } else if (hasFamily && !hasAdditional) {
            allSelected = areAllFamilyPackItemsSelected();
            someSelected = hasFamilyPackSelections();
          } else if (!hasFamily && hasAdditional) {
            allSelected = areAllAdditionalItemsSelected();
            someSelected = hasAdditionalItemSelections();
          }
          
          return allSelected
            ? 'text-[#2E7D32]' // Completed - Dark green text
            : someSelected
              ? 'text-[#B8860B]' // Opened - Gold text
              : 'text-[#D16D6A]'; // Pending - Red text
        })()
      }`}>
        {(() => {
          const hasFamily = familyPackItems.length > 0;
          const hasAdditional = additionalItems.length > 0;
          
          let allSelected = false;
          let someSelected = false;
          
          if (hasFamily && hasAdditional) {
            allSelected = areAllFamilyPackItemsSelected() && areAllAdditionalItemsSelected();
            someSelected = hasFamilyPackSelections() || hasAdditionalItemSelections();
          } else if (hasFamily && !hasAdditional) {
            allSelected = areAllFamilyPackItemsSelected();
            someSelected = hasFamilyPackSelections();
          } else if (!hasFamily && hasAdditional) {
            allSelected = areAllAdditionalItemsSelected();
            someSelected = hasAdditionalItemSelections();
          }
          
          return allSelected 
            ? 'Completed' 
            : someSelected
              ? 'Opened'
              : status;
        })()}
      </Text>
    </View> */}
    <DynamicStatusBadge />
  </View>

  {/* Family Pack Section - Only show if familyPackItems has data */}
  {familyPackItems.length > 0 && (
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
          {packageName} {areAllFamilyPackItemsSelected() && orderStatus === 'Completed' ? '✓' : ''}
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
            ? 'border-[#4CAF50]'
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
                  <Text className="text-gray-500 text-sm">{item.weight} </Text>
                </View>
              </View>
              {renderCheckbox(item.selected)}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )}

  {/* Additional Items Section - Only show if additionalItems has data */}
  {additionalItems.length > 0 && (
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
         {t("PendingOrderScreen.Custom Selected Items")}  {areAllAdditionalItemsSelected() && orderStatus === 'Completed' ? '✓' : ''}
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
            ? 'border-[#4CAF50]'
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
  )}

  {/* Warning Message - moved inside ScrollView */}
  {showWarning && orderStatus !== 'Completed' && (
    <View className="mx-4 mb-4 bg-white px-4 py-2">
      <Text 
        className="text-sm text-center italic"
        style={{
          color: (() => {
            const hasFamily = familyPackItems.length > 0;
            const hasAdditional = additionalItems.length > 0;
            
            let allSelected = false;
            
            if (hasFamily && hasAdditional) {
              allSelected = areAllFamilyPackItemsSelected() && areAllAdditionalItemsSelected();
            } else if (hasFamily && !hasAdditional) {
              allSelected = areAllFamilyPackItemsSelected();
            } else if (!hasFamily && hasAdditional) {
              allSelected = areAllAdditionalItemsSelected();
            }
            
            return orderStatus === 'Opened'
              ? '#FA0000' // Red for "Select all remaining items"
              : allSelected
                ? '#308233' // Green for "All checked. Order will move to 'Completed'"
                : '#FA0000'; // Red for "Unchecked items remain"
          })()
        }}
      >
        {orderStatus === 'Opened'
          ? "Select all remaining items to complete the order."
          : (() => {
              const hasFamily = familyPackItems.length > 0;
              const hasAdditional = additionalItems.length > 0;
              
              let allSelected = false;
              
              if (hasFamily && hasAdditional) {
                allSelected = areAllFamilyPackItemsSelected() && areAllAdditionalItemsSelected();
              } else if (hasFamily && !hasAdditional) {
                allSelected = areAllFamilyPackItemsSelected();
              } else if (!hasFamily && hasAdditional) {
                allSelected = areAllAdditionalItemsSelected();
              }
              
              return allSelected
                ? <>  {t("PendingOrderScreen.All checked")} <Text style={{ fontWeight: 'bold' }}> {t("PendingOrderScreen.Completed")} </Text> {t("PendingOrderScreen.onsave")}</>
                : <> {t("PendingOrderScreen.Unchecked items")} <Text style={{ fontWeight: 'bold' }}>{t("PendingOrderScreen.Opened")}</Text> {t("PendingOrderScreen.Status")}</>;
            })()
        }
      </Text>
    </View>
  )}
</ScrollView>
   

      {/* Fixed Submit Button */}
      {/* Fixed Submit Button */}
<View className="absolute bottom-0 left-2 right-2 bg-white px-4 py-4">
  <TouchableOpacity 
    className={`py-3 rounded-full px-3 ${showWarning ? 'bg-black' : 'bg-gray-400'}`}
    onPress={handleSubmitPress}
    disabled={!showWarning}
  >
    <View className='justify-center items-center'>
      <Text className="text-white font-medium text-base">
        {t("PendingOrderScreen.Save")}
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
             {t("PendingOrderScreen.FinishUp")}
            </Text>
            <Text className="text-gray-600 text-center mb-2">
              {t("PendingOrderScreen.MarkingAs")}
            </Text>
            <Text className="text-gray-500 text-sm text-center mb-6">
              {t("PendingOrderScreen.TapGoback")}
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
               {t("PendingOrderScreen.Mark as Completed")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-200 py-4 rounded-full"
              onPress={handleBackToEdit}
            >
              <Text className="text-gray-700 text-center font-medium text-base">
               {t("PendingOrderScreen.Back to Edit")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PendingOrderScreen;