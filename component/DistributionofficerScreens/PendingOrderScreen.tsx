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
import NetInfo from "@react-native-community/netinfo";




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
  packageQty: number;
  productTypeName: string;
  packageId: number; // Add package reference
  packageName: string; // Add package name reference
  originalItemId: number; // Keep original item ID for API calls
}

// Add interface for package groups if you want to group items by package
interface PackageGroup {
  packageId: number;
  packageName: string;
  items: FamilyPackItem[];
  allSelected: boolean;
  someSelected: boolean;
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
  packageQty: number; 
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
const RedIcon = require("@/assets/images/squareMin.webp");
const disable = require("@/assets/images/squaresolidRed.png");

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
  const [packageExpansions, setPackageExpansions] = useState<{ [key: number]: boolean }>({});
  const [showWarning, setShowWarning] = useState(false);
 // const [orderStatus, setOrderStatus] = useState('Pending'); // Track dynamic status
  const [completedTime, setCompletedTime] = useState<string | null>(null); // Track completion time
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);
const [countdown, setCountdown] = useState(30);
const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout | null>(null);
const [orderStatus, setOrderStatus] = useState<'Pending' | 'Opened' | 'Completed' | 'In Progress'>(
  status || item.status || 'Pending'
);

const [selectpackage, setSelectpackage] = useState(false);
const [isUserInitiatedCompletion, setIsUserInitiatedCompletion] = useState(false);
const [isReplacementPriceHigher, setIsReplacementPriceHigher] = useState(false);
const [selectopen, setSelectopen,] = useState(false);
const [packageName, setPackageName] = useState<string>('Family Pack');
const [packageId, setPackageId] = useState<number | null>(null);  
 const [isCompletingOrder, setIsCompletingOrder] = useState(false);
 const [hasCompletedOrder, setHasCompletedOrder] = useState(false);
 const [orderCompletionState, setOrderCompletionState] = useState<'idle' | 'completing' | 'completed'>('idle');


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
const [jobRole, setJobRole] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [successModalShown, setSuccessModalShown] = useState(false);
const [showSuccessModal, setShowSuccessModal] = useState(false);

// Add this useEffect to handle the 2-second loading delay
useEffect(() => {
  const loadingTimer = setTimeout(() => {
    setIsLoading(false);
  }, 2000);

  return () => clearTimeout(loadingTimer);
}, []);


const fetchUserProfile = async () => {
  setIsLoading(true);
  setError(null);
  
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await axios.get(
      `${environment.API_BASE_URL}api/distribution-manager/user-profile`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Safely extract jobRole with fallback to null
    const role = response.data?.data?.jobRole || null;
    setJobRole(role);
    
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    setError("Failed to load profile data");
  } finally {
    setIsLoading(false);
  }
};

// Usage example:
useEffect(() => {
  fetchUserProfile();
}, []);

console.log("Current job role:", jobRole);


  
  // Fetch selected language
  const fetchSelectedLanguage = async () => {
    try {
      const lang = await AsyncStorage.getItem("@user_language");
      setSelectedLanguage(lang || "en");
    } catch (error) {
      console.error("Error fetching language preference:", error);
    }
  };


const fetchOrderData = async (orderId: string) => {
  try {
    // Get auth token from AsyncStorage
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
    //  Alert.alert(t("Error"), "Authentication token not found");
    Alert.alert(t("Error.error"), t("Error.User not authenticated."));
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
     //   Alert.alert(t("Error"), "Session expired. Please login again.");
      Alert.alert(t("Error.Error"), t("Error.Session expired") );
        // Navigate to login screen or handle logout
        return null;
      } else if (error.response?.status === 404) {
       // Alert.alert(t("Error"), "Order not found");
       Alert.alert(t("Error.Error"), t("Error.somethingWentWrong") );
        return null;
      }
    }
    
   // Alert.alert(t("Error"), "Failed to fetch order data");
   Alert.alert(t("Error.Error"), t("Error.somethingWentWrong") );
    return null;
  }
};


// Add these debug console logs in your fetchOrderData function to see what's happening

useEffect(() => {
  const loadOrderData = async () => {
    setLoading(true);
    const orderData = await fetchOrderData(item.orderId);
    
    if (orderData) {
      console.log('=== DEBUG ORDER DATA ===');
      console.log('Full Order Data:', JSON.stringify(orderData, null, 2));
      
      // Debug each package
      if (orderData.packageData && Array.isArray(orderData.packageData)) {
        orderData.packageData.forEach((packageInfo: any, packageIndex: number) => {
          console.log(`=== PACKAGE ${packageIndex + 1} DEBUG ===`);
          console.log('Package Info:', JSON.stringify(packageInfo, null, 2));
          
          if (packageInfo.items && Array.isArray(packageInfo.items)) {
            packageInfo.items.forEach((item: any, itemIndex: number) => {
              console.log(`Item ${itemIndex + 1}:`, {
                productName: item.productName,
                isPacked: item.isPacked,
                isPackedType: typeof item.isPacked,
                isPackedValue: item.isPacked === 1,
                isPackedStrictEqual: item.isPacked === "1"
              });
            });
          }
        });
      }
      
      // Debug additional items
      if (orderData.additionalItems && Array.isArray(orderData.additionalItems)) {
        console.log('=== ADDITIONAL ITEMS DEBUG ===');
        orderData.additionalItems.forEach((item: any, itemIndex: number) => {
          console.log(`Additional Item ${itemIndex + 1}:`, {
            productName: item.productName,
            isPacked: item.isPacked,
            isPackedType: typeof item.isPacked,
            isPackedValue: item.isPacked === 1,
            isPackedStrictEqual: item.isPacked === "1"
          });
        });
      }
      
      // Continue with your existing mapping logic...
      // But update the selected mapping to handle both number and string
      
      let allFamilyPackItems: FamilyPackItem[] = [];
      let packageNames: string[] = [];
      let typeNames: string[] = [];
      
     if (orderData.packageData && Array.isArray(orderData.packageData)) {
      orderData.packageData.forEach((packageInfo: any, packageIndex: number) => {
        // Get package quantity
        const packageQty = packageInfo.packageQty || 1;
        
     
        if (packageInfo.packageName) {
  // Display package name with quantity if > 1
  const displayName = packageQty > 1 
    ? `${packageInfo.packageName} (x${packageQty})`
    : packageInfo.packageName;
  packageNames.push(displayName);
}
        
        if (packageIndex === 0 && packageInfo.id) {
          setPackageId(packageInfo.id);
        }
        
        if (packageInfo.items && Array.isArray(packageInfo.items)) {
          const packageItems: FamilyPackItem[] = packageInfo.items.map((item: any) => {
            const isPackedValue = item.isPacked === 1 || item.isPacked === "1" || item.isPacked === true;
            
            return {
              id: `${packageInfo.id}_${item.id}`,
              name: item.productName,
              weight: `${item.qty} `,
              selected: isPackedValue,
              price: item.price || item.normalPrice || "0",
              productType: item.productType,
              productTypeName: item.productTypeName,
              packageId: packageInfo.id,
              packageName: packageInfo.packageName,
              packageQty: packageQty, // Add package quantity
              originalItemId: item.id
            };
          });
          
          allFamilyPackItems = [...allFamilyPackItems, ...packageItems];
          
          const packageTypeNames = packageInfo.items
            .map((item: any) => item.productTypeName)
            .filter((name: string) => name && !typeNames.includes(name));
          typeNames = [...typeNames, ...packageTypeNames];
        }
      });
    }
      
      // Fix: Handle additional items isPacked the same way
      const mappedAdditionalItems: AdditionalItem[] = orderData.additionalItems?.map((item: any) => {
        const isPackedValue = item.isPacked === 1 || item.isPacked === "1" || item.isPacked === true;
        
        console.log(`Mapping additional ${item.productName}:`, {
          originalIsPacked: item.isPacked,
          mappedSelected: isPackedValue
        });
        
        return {
          id: item.id.toString(),
          name: item.productName,
          weight: `${item.qty}`,
          selected: isPackedValue, // Updated logic
          price: item.price || item.normalPrice || "0"
        };
      }) || [];

      console.log('=== FINAL MAPPED DATA ===');
      console.log('Family Pack Items:', allFamilyPackItems.map(item => ({
        name: item.name,
        selected: item.selected,
        packageName: item.packageName
      })));
      console.log('Additional Items:', mappedAdditionalItems.map(item => ({
        name: item.name,
        selected: item.selected
      })));

      // Rest of your existing code...
      if (packageNames.length > 0) {
        setPackageName(packageNames.join(' + '));
      }

      if (typeNames.length > 0) {
        setTypeeName(typeNames.join(', '));
      }

      setFamilyPackItems(allFamilyPackItems);
      setAdditionalItems(mappedAdditionalItems);
      
      // Update status logic...
      const allFamilyPacked = allFamilyPackItems.length === 0 || allFamilyPackItems.every(item => item.selected);
      const allAdditionalPacked = mappedAdditionalItems.length === 0 || mappedAdditionalItems.every(item => item.selected);
      const someFamilyPacked = allFamilyPackItems.some(item => item.selected);
      const someAdditionalPacked = mappedAdditionalItems.some(item => item.selected);

      if (allFamilyPackItems.length === 0 && mappedAdditionalItems.length === 0) {
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
  fetchSelectedLanguage();
}, [item.orderId, t]);

// Also add debug logs to your toggle functions to see if they're working:

useEffect(() => {
  if (orderStatus === 'Completed') {
    // Disable all editing capabilities
    setHasUnsavedChanges(false);
    setShowCompletionPrompt(false);
    resetCountdown();
  }
}, [orderStatus]);

// Update the toggle functions to prevent interaction when completed
const toggleFamilyPackItem = (id: string) => {
  if (orderStatus === 'Completed') return; // Prevent editing completed orders
  
  console.log('=== TOGGLE FAMILY PACK ITEM ===');
  console.log('Toggling item ID:', id);
  
  setFamilyPackItems(prev => {
    const updated = prev.map(item => {
      if (item.id === id) {
        console.log(`Toggling ${item.name} from ${item.selected} to ${!item.selected}`);
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    
    console.log('Updated family pack items:', updated.map(item => ({
      name: item.name,
      selected: item.selected,
      id: item.id
    })));
    
    return updated;
  });
  setHasUnsavedChanges(true);
};

const toggleAdditionalItem = (id: string) => {
  if (orderStatus === 'Completed') return; // Prevent editing completed orders
  
  console.log('=== TOGGLE ADDITIONAL ITEM ===');
  console.log('Toggling additional item ID:', id);
  
  setAdditionalItems(prev => {
    const updated = prev.map(item => {
      if (item.id === id) {
        console.log(`Toggling ${item.name} from ${item.selected} to ${!item.selected}`);
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    
    console.log('Updated additional items:', updated.map(item => ({
      name: item.name,
      selected: item.selected,
      id: item.id
    })));
    
    return updated;
  });
  setHasUnsavedChanges(true);
};

// Update the timer effect to not trigger for completed orders
// useEffect(() => {
//   // BULLETPROOF: Only check items, don't trigger multiple times
//   if (orderCompletionState !== 'idle' || orderStatus === 'Completed') return;
  
//   const hasFamily = familyPackItems.length > 0;
//   const hasAdditional = additionalItems.length > 0;
  
//   let allSelected = false;
  
//   if (hasFamily && hasAdditional) {
//     allSelected = areAllFamilyPackItemsSelected() && areAllAdditionalItemsSelected();
//   } else if (hasFamily && !hasAdditional) {
//     allSelected = areAllFamilyPackItemsSelected();
//   } else if (!hasFamily && hasAdditional) {
//     allSelected = areAllAdditionalItemsSelected();
//   }
  
//   if (allSelected && !showCompletionPrompt && !countdownInterval) {
//     console.log('All items selected - starting countdown');
//     startCountdown();
//   } else if (!allSelected && showCompletionPrompt) {
//     console.log('Not all items selected - stopping countdown');
//     setShowCompletionPrompt(false);
//     resetCountdown();
//   }
// }, [familyPackItems, additionalItems, orderStatus]);


// Replace the problematic useEffect with this:
useEffect(() => {
  // Only check completion status, don't trigger modal automatically

  if (orderCompletionState !== 'idle' || orderStatus === 'Completed' || isUserInitiatedCompletion) return;
  
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
  
  // ONLY update status, don't show completion prompt automatically
  if (allSelected) {
    // Just update the visual status, don't trigger the modal
    console.log('All items selected - updating status only');
  }
}, [familyPackItems, additionalItems, orderStatus]);

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




useEffect(() => {
  navigation.setOptions({
    headerStyle: {
      backgroundColor: orderStatus === 'Completed' ? '#D4F7D4' :
                        orderStatus === 'Opened' ? '#FDFF99' :
                        '#FFCDCD', // Default for Pending
    },
    headerTintColor: orderStatus === 'Completed' ? '#2E7D32' :
                      orderStatus === 'Opened' ? '#A8A100' :
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



const handleCompleteOrder = async () => {
    // BULLETPROOF: Single state check prevents all multiple calls
    if (orderCompletionState !== 'idle') {
        console.log('handleCompleteOrder blocked - state is:', orderCompletionState);
        return;
    }
    
    console.log('Starting order completion...');
    setOrderCompletionState('completing');

      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
    return; 
  }
    
    try {
        // Update UI state
        setOrderStatus('Completed');
        setCompletedTime(new Date().toLocaleString());
        setShowCompletionPrompt(false);
        resetCountdown();

        // Prepare API data
        const flatPackageItems = familyPackItems.map(item => ({
            id: item.originalItemId,
            isPacked: 1
        }));

        const selectedAdditionalItems = additionalItems.map(item => ({
            id: parseInt(item.id),
            isPacked: 1
        }));

        const updateData = {
            orderId: item.orderId,
            packageItems: flatPackageItems,
            additionalItems: selectedAdditionalItems,
            status: 'Completed',
            isComplete: 1
        };

        // API call
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
            // Update UI
            setFamilyPackItems(prev => prev.map(item => ({ ...item, selected: true })));
            setAdditionalItems(prev => prev.map(item => ({ ...item, selected: true })));
            setHasUnsavedChanges(false);
            
            // Call distributed target API
            try {
                await axios.put(
                    `${environment.API_BASE_URL}api/distribution/update-distributed-target/${item.orderId}`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                console.log('Distributed target updated successfully');
            } catch (distributedTargetError) {
                console.error('Error updating distributed target:', distributedTargetError);
            }
            
            // BULLETPROOF: Set completion state and show modal
            setOrderCompletionState('completed');
            setShowSuccessModal(true);
            console.log('Order completed successfully - modal should show');
            
        } else {
            throw new Error(response.data.message || 'Failed to complete order');
        }
        
    } catch (error) {
        console.error('Error completing order:', error);
        
        // Reset state on error
        setOrderCompletionState('idle');
        setOrderStatus('Opened');
        setCompletedTime(null);
        
        Alert.alert(
            t("Error.Error"), 
             t("Error.Failed to complete order"), 
            [
                {
                    text: t("Error.Ok"),
                    onPress: () => {
                        setShowCompletionPrompt(true);
                        startCountdown();
                    }
                }
            ]
        );
    }
};

const startCountdown = () => {
    // BULLETPROOF: Don't start if already completing/completed
    if (orderCompletionState !== 'idle') {
        console.log('Countdown blocked - completion state is:', orderCompletionState);
        return;
    }
    
    console.log('Starting countdown...');
    setCountdown(30);
    setShowCompletionPrompt(true);
    
    const interval = setInterval(() => {
        setCountdown(prev => {
            if (prev <= 1) {
                clearInterval(interval);
                setCountdownInterval(null);
                // BULLETPROOF: Only call if still in idle state
                if (orderCompletionState === 'idle') {
                    handleCompleteOrder();
                }
                return 0;
            }
            return prev - 1;
        });
    }, 1000);
    setCountdownInterval(interval);
};



  // const handleBackToEdit = () => {
  //   setShowCompletionPrompt(false);
  //   resetCountdown();
  // };
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

  


const togglePackageExpansion = (packageId: number) => {
  // Allow expansion for all order statuses - user should control visibility
  setPackageExpansions(prev => ({
    ...prev,
    [packageId]: !prev[packageId]
  }));
};

// Helper function to check if a package is expanded
const isPackageExpanded = (packageId: number) => {
  return packageExpansions[packageId] || false;
};




const getPackageGroups = () => {
  const groups: { [key: number]: FamilyPackItem[] } = {};
  
  familyPackItems.forEach(item => {
    if (!groups[item.packageId]) {
      groups[item.packageId] = [];
    }
    groups[item.packageId].push(item);
  });
  
  return Object.entries(groups).map(([packageId, items]) => {
    const packageQty = items[0]?.packageQty || 1;
    const basePackageName = items[0]?.packageName || `Package ${packageId}`;
    
    return {
      packageId: parseInt(packageId),
      packageName: basePackageName,
      packageQty: packageQty,
      items,
      allSelected: items.every(item => item.selected),
      someSelected: items.some(item => item.selected)
    };
  });
};


// const handleReplaceProduct = (item: FamilyPackItem) => {
//    if (orderStatus === 'Completed') {
//     Alert.alert( t("Error.Info"),  t("Error.Cannot replace products in completed orders"));
//     return;
//   }
  
//   // Rest of your existing handleReplaceProduct code...
//   if (!item) {
//     console.log("No item provided to handleReplaceProduct");
//     return;
//   }

//   // Add a small delay to ensure data is fully loaded
//   setTimeout(() => {
//     console.log("Original item data:", {
//       name: item.name,
//       price: item.price,
//       weight: item.weight,
//       productType: item.productType,
//       id: item.id
//     });

//     // Validate required data before proceeding
//     if (!item.price || item.price === undefined) {
//       console.log("Price is undefined, attempting to fetch latest data");
//       Alert.alert(
//         t("Error.Error"),
//         t("Error.Product price information is not available"),
//         [{ text: t("Error.Ok") }]
//       );
//       return;
//     }

//     if (!item.productType || item.productType === undefined) {
//       console.log("ProductType is undefined, using default");
//       // You might want to set a default or fetch the latest data
//     }

//     const weightKg = parseFloat(item.weight) || 0;
//     const itemPrice = parseFloat(item.price) || 0;
    
   
//     const totalPrice = itemPrice.toFixed();
    
//     // If you need unit price per kg, calculate it from total price
//     const unitPricePerKg = weightKg > 0 ? (itemPrice / weightKg) : '0.00';

//     console.log("Price calculation:", {
//       itemPrice,
//       weightKg,
//       totalPrice,
//       unitPricePerKg,
//       originalPrice: item.price,
//       productType: item.productType
//     });

//     // Only proceed if we have valid data
//     if (itemPrice > 0 && weightKg > 0) {
//       setReplaceData({
//         selectedProduct: `${item.name} - ${item.weight}Kg - Rs.${totalPrice}`,
//         selectedProductPrice: totalPrice,
//         productType: item.productType || 0, 
//         newProduct: '',
//         quantity: '',
//         price: `Rs.${totalPrice}`, 
//         productTypeName: item.productTypeName || ''
//       });

//       setSelectedItemForReplace(item);
//       setShowReplaceModal(true);
//     } else {
//       Alert.alert(
//         t("Error.Error"),
//         t("Error.Invalid product data"),
//         [{ text: t("Error.Ok") }]
//       );
//     }
//   }, 100); // Small delay to ensure state is updated
// };

const handleReplaceProduct = (item: FamilyPackItem) => {
  if (orderStatus === 'Completed') {
    Alert.alert(t("Error.Info"), t("Error.Cannot replace products in completed orders"));
    return;
  }

  setTimeout(() => {
    const weightKg = parseFloat(item.weight) || 0;
    const itemPrice = parseFloat(item.price) || 0;
    const totalPrice = itemPrice.toFixed();
    
    // Extract numeric price for comparison
    const numericPrice = itemPrice;

    setReplaceData({
      selectedProduct: `${item.name} - ${item.weight}Kg - Rs.${totalPrice}`,
      selectedProductPrice: numericPrice.toString(), // Store as string for comparison
      productType: item.productType || 0,
      newProduct: '',
      quantity: '',
      price: `Rs.${totalPrice}`,
      productTypeName: item.productTypeName || ''
    });

    // Reset price comparison state
    setIsReplacementPriceHigher(false);
    setSelectedItemForReplace(item);
    setShowReplaceModal(true);
  }, 100);
};

const handleReplaceSubmit = async () => {
  if (!replaceData.newProduct || !replaceData.quantity || !replaceData.price) {
    Alert.alert(t("Error.Error"),t("Error.Please fill all required fields"));
    return;
  }

  if (!packageId) {
    Alert.alert(t("Error.Error"),t("Error.Package ID not found"));
    return;
  }

  if (!selectedItemForReplace) {
    Alert.alert(t("Error.Error"),t("Error.No item selected for replacement"));
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

    // FIXED PRICE PARSING - Extract numeric price correctly
    const priceValue = (() => {
      console.log('=== PRICE PARSING DEBUG ===');
      console.log('Original replaceData.price:', replaceData.price);
      console.log('Type of replaceData.price:', typeof replaceData.price);
      
      if (!replaceData.price) return 0;
      
      // Convert to string and extract all digits and decimal points
      const priceString = replaceData.price.toString();
      console.log('Price as string:', priceString);
      
      // Use regex to match numbers (including decimals)
      const match = priceString.match(/\d+\.?\d*/);
      console.log('Regex match result:', match);
      
      if (!match) return 0;
      
      const numericValue = match[0];
      console.log('Extracted numeric value:', numericValue);
      
      const parsed = parseFloat(numericValue);
      console.log('Parsed float value:', parsed);
      console.log('==============================');
      
      return isNaN(parsed) ? 0 : parsed;
    })();

    // Alternative simpler method (use this if the above works correctly)
    // const priceValue = parseFloat(replaceData.price.toString().replace(/[^0-9.]/g, '')) || 0;

    console.log('Final priceValue that will be sent:', priceValue);

    // Prepare the replacement request data
    const replacementRequest = {
      orderPackageId: packageId,
      replaceId: selectedItemForReplace.originalItemId,
      originalItemId: selectedItemForReplace.originalItemId,
      productType: selectedItemForReplace.productType,
      productId: selectedRetailItem.id,
      qty: replaceData.quantity,
      price: priceValue, // Should be correct now (98 for "Rs.98", 2000 for "Rs.2000")
      status: "Pending"
    };

    console.log('Replacement request data:', replacementRequest);

    // Get token and add validation
    const token = await AsyncStorage.getItem('token');
    if (!token) {
     // Alert.alert(t("Error"), "Authentication token not found. Please login again.");
     Alert.alert(t("Error.error"), t("Error.User not authenticated."));
      return;
    }

      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
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
        t("Error.Success"),
         t("Error.Replacement request submitted successfully"),
        [{ 
          text: t("Error.Ok"), 
          onPress: () => {
            // Reset state before navigation
            setShowReplaceModal(false);
            setShowDropdown(false);
            setSelectedItemForReplace(null);
            setReplaceData({
              selectedProduct: '',
              selectedProductPrice: '',
              productType: 0,
              newProduct: '',
              quantity: '',
              price: '',
              productTypeName: '',
            });

            setTimeout(() => {
              navigation.goBack();
            }, 100);
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
        // Alert.alert(
        //   t("Permission Denied"),
        //   errorMessage + " Please contact your administrator."
        // );
       Alert.alert(t("Error.Error"), t("Error.somethingWentWrong") ) 
      } else if (error.response?.status === 401) {
        Alert.alert(
         t("Error.Authentication Error"),
           t("Error.Your session has expired")
        );
      } else if (error.response?.status === 400) {
        console.log('400 Error Response:', error.response?.data);
        Alert.alert(
           t("Error.Invalid Request"),
           t("Error.Please check your input data and try again")
        );
      } else if (error.response?.status === 500) {
        // Alert.alert(
        //   t("Server Error"),
        //   t("Internal server error. Please try again later.")
        // );
        Alert.alert(t("Error.Error"), t("Error.somethingWentWrong") )
      } else {
        Alert.alert(
          t("Error.Error"),
          t("Error.Failed to submit replacement request")
        );
      }
    } else {
      // Alert.alert(
      //   t("Error"), 
      //   t("An unexpected error occurred. Please try again.")
      // );
      Alert.alert(t("Error.Error"), t("Error.somethingWentWrong") )
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



const handleSubmit = async () => {

    const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
    return; 
  }
  try {
    // **FIX: Create flat array of package items instead of grouped**
    const flatPackageItems = familyPackItems.map(item => ({
      id: item.originalItemId, // Use original item ID for API
      isPacked: item.selected ? 1 : 0
    }));

    // Prepare additional items update data (this was already correct)
    const selectedAdditionalItems = additionalItems.map(item => ({
      id: parseInt(item.id),
      isPacked: item.selected ? 1 : 0
    }));

    // Determine the new status
    const allFamilyPacked = familyPackItems.length === 0 || 
      familyPackItems.every(item => item.selected);
    const allAdditionalPacked = additionalItems.length === 0 || 
      additionalItems.every(item => item.selected);
    const newStatus = allFamilyPacked && allAdditionalPacked ? 'Completed' : 'Opened';

    const updateData = {
      orderId: item.orderId,
      packageItems: flatPackageItems, // **FIXED: Now sending flat array**
      additionalItems: selectedAdditionalItems,
      status: newStatus,
      isComplete: newStatus === 'Completed' ? 1 : 0
    };

    console.log('Submitting order update with flat package items:', updateData);
    
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
        
        // Call distributed target API for completed order
        try {
          console.log('Calling distributed target API for completed order...');
          
          const distributedTargetResponse = await axios.put(
            `${environment.API_BASE_URL}api/distribution/update-distributed-target/${item.orderId}`,
            {},
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
        }
      }
      
      Alert.alert(
         t("Error.Success"),
        t("Error.Order updated successfully"),
        [{ text: t("Error.Ok"), onPress: () => navigation.goBack() }]
      );
    } else {
      throw new Error(response.data.message || 'Failed to update order');
    }
    
    setHasUnsavedChanges(false);
    setShowSubmitModal(false);
    
  } catch (error) {
    console.error('Error updating order:', error);
  //  Alert.alert(t("Error"), t("Failed to update order"));
  Alert.alert(t("Error.Error"), t("Error.somethingWentWrong") )
    setShowSubmitModal(false);
  }
};


// const handleSubmitPress = () => {
//   const hasFamily = familyPackItems.length > 0;
//   const hasAdditional = additionalItems.length > 0;
  
//   let allSelected = false;
  
//   if (hasFamily && hasAdditional) {
//     allSelected = areAllFamilyPackItemsSelected() && areAllAdditionalItemsSelected();
//   } else if (hasFamily && !hasAdditional) {
//     allSelected = areAllFamilyPackItemsSelected();
//   } else if (!hasFamily && hasAdditional) {
//     allSelected = areAllAdditionalItemsSelected();
//   }
  
//   if (allSelected) {
//     // If all items are selected, show completion prompt
//     if (!showCompletionPrompt) {
//       setShowCompletionPrompt(true);
//       startCountdown();
//     }
//   } else {
//     // If not all items are selected, submit immediately
//     handleSubmit();
//   }
// }

// const handleSubmitPress = () => {
//   const hasFamily = familyPackItems.length > 0;
//   const hasAdditional = additionalItems.length > 0;
  
//   let allSelected = false;
  
//   if (hasFamily && hasAdditional) {
//     allSelected = areAllFamilyPackItemsSelected() && areAllAdditionalItemsSelected();
//   } else if (hasFamily && !hasAdditional) {
//     allSelected = areAllFamilyPackItemsSelected();
//   } else if (!hasFamily && hasAdditional) {
//     allSelected = areAllAdditionalItemsSelected();
//   }
  
//   if (allSelected) {
//     // If user clicks Save AND all items are selected, show completion prompt
//     console.log('User clicked Save with all items selected - showing completion prompt');
//     setShowCompletionPrompt(true);
//     startCountdown();
//   } else {
//     // If not all items are selected, submit immediately
//     console.log('Not all items selected - submitting immediately');
//     handleSubmit();
//   }
// }



// Update handleSubmitPress
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
    // Mark as user-initiated and show completion prompt
    setIsUserInitiatedCompletion(true);
    setShowCompletionPrompt(true);
    startCountdown();
  } else {
    // Regular submission
    handleSubmit();
  }
}

// Update the useEffect to respect user initiation
// useEffect(() => {
//   if (orderCompletionState !== 'idle' || orderStatus === 'Completed' || isUserInitiatedCompletion) return;
  
//   // ... rest of the logic for automatic status update only
// }, [familyPackItems, additionalItems, orderStatus, isUserInitiatedCompletion]);

// Reset the flag when modal closes
const handleBackToEdit = () => {
  setShowCompletionPrompt(false);
  setIsUserInitiatedCompletion(false); // Reset the flag
  resetCountdown();
};

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
  <View className={`w-6 h-6 border-2 rounded ${selected ? 'bg-black border-black' : 'border-gray-300 bg-white'} items-center justify-center ${orderStatus === 'Completed' ? 'opacity-50' : ''}`}>
    {selected && <AntDesign name="check" size={14} color="white" />}
  </View>
);

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
      //Alert.alert(t("Error"), "Authentication token not found");
       Alert.alert(t("Error.error"), t("Error.User not authenticated."));
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
   // Alert.alert(t("Error"), "Failed to fetch retail items");
     Alert.alert(t("Error.Error"), t("Error.somethingWentWrong") )
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

  // const handleProductSelect = (product: RetailItem) => {
  //   setReplaceData(prev => ({
  //     ...prev,
  //     newProduct: product.displayName,
  //     price: `Rs.${(product.discountedPrice || product.normalPrice || 0).toFixed(2)}`
  //   }));
  //   setShowDropdown(false);
  // };

  const handleProductSelect = (product: RetailItem) => {
  const selectedProductPrice = parseFloat(replaceData.selectedProductPrice) || 0;
  const newProductPrice = product.discountedPrice || product.normalPrice || 0;
  
  setReplaceData(prev => ({
    ...prev,
    newProduct: product.displayName,
    price: `Rs.${newProductPrice.toFixed(2)}`
  }));
  
  // Check if replacement price is higher
  setIsReplacementPriceHigher(newProductPrice > selectedProductPrice);
  setShowDropdown(false);
};

const handleQuantityChange = (text: string) => {
  if (/^\d*\.?\d*$/.test(text)) {
    const selectedProduct = retailItems.find(item => 
      item.displayName === replaceData.newProduct
    );
    const price = selectedProduct ? (selectedProduct.discountedPrice || selectedProduct.normalPrice || 0) : 0;
    const totalPrice = text ? (parseFloat(text) * price) : price;
    const selectedProductPrice = parseFloat(replaceData.selectedProductPrice) || 0;
    
    setReplaceData(prev => ({
      ...prev,
      quantity: text,
      price: text ? `Rs.${totalPrice.toFixed(2)}` : `Rs.${price.toFixed(2)}`
    }));
    
    // Check if replacement price is higher
    setIsReplacementPriceHigher(totalPrice > selectedProductPrice);
  }
};

  // const handleQuantityChange = (text: string) => {
  //   if (/^\d*\.?\d*$/.test(text)) {
  //     const selectedProduct = retailItems.find(item => 
  //       item.displayName === replaceData.newProduct
  //     );
  //     const price = selectedProduct ? (selectedProduct.discountedPrice || selectedProduct.normalPrice || 0) : 0;
  //     setReplaceData(prev => ({
  //       ...prev,
  //       quantity: text,
  //       price: text ? `Rs.${(parseFloat(text) * price).toFixed(2)}` : `Rs.${price.toFixed(2)}`
  //     }));
  //   }
  // };

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
                            {t("PendingOrderScreen.Rs")}.{(product.discountedPrice || product.normalPrice || 0).toFixed(2)} 
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
  className={`py-3 rounded-full px-3 ${
    isFormComplete && !isReplacementPriceHigher 
      ? 'bg-[#FA0000]' 
      : 'bg-[#FA0000]/50'
  }`}
  onPress={isFormComplete && !isReplacementPriceHigher ? handleReplaceSubmit : undefined}
  disabled={!isFormComplete || isReplacementPriceHigher}
>
  <Text className="text-white text-center font-medium">
    {jobRole === "Distribution Center Manager" 
      ? t("PendingOrderScreen.Update")
      : t("PendingOrderScreen.Send Replace Request")}
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

const getDynamicStatus = (): 'Pending' | 'Opened' | 'Completed' => {
  const hasFamily = familyPackItems.length > 0;
  const hasAdditional = additionalItems.length > 0;
  
  let allSelected = false;
  let someSelected = false;
  
  if (hasFamily && hasAdditional) {
    const familyAllSelected = areAllFamilyPackItemsSelected();
    const familyHasSelections = hasFamilyPackSelections();
    const additionalAllSelected = areAllAdditionalItemsSelected();
    const additionalHasSelections = hasAdditionalItemSelections();
    
    allSelected = familyAllSelected && additionalAllSelected;
    
    // Check if one is completed and other is pending (no selections)
    const oneCompletedOnePending = 
      (familyAllSelected && !additionalHasSelections) || 
      (additionalAllSelected && !familyHasSelections);
    
    if (oneCompletedOnePending) {
      return 'Pending'; // Return Pending when one is completed and other has no selections
    }
    
    someSelected = familyHasSelections || additionalHasSelections;
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
      <View className={`px-3 py-2 rounded-full ${styling.badge}`}>
        <Text className={`font-medium text-sm ${styling.text}`}>
          {statusText}
        </Text>
      </View>
    </View>
  );
};

  const SuccessModal = () => (
    <Modal
        visible={showSuccessModal && orderCompletionState === 'completed'}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
            console.log('Modal closing...');
            setShowSuccessModal(false);
           // setOrderCompletionState('idle'); // Reset for next time
            navigation.goBack();
        }}
    >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
            <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
                <View className="items-center mb-4">
                    {/* Success icon can go here */}
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
                        console.log('OK button pressed - closing modal');
                        setShowSuccessModal(false);
                        setOrderCompletionState('idle'); // Reset for next time
                        setTimeout(() => {
                            navigation.goBack();
                        }, 100);
                    }}
                >
                    <Text className="text-white text-center font-medium">
                        {t("PendingOrderScreen.OK")}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);

useEffect(() => {
    return () => {
        console.log('Component unmounting - cleaning up');
        setShowSuccessModal(false);
        setShowCompletionPrompt(false);
        setOrderCompletionState('idle');
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
    };
}, []);

// 8. UPDATE resetCountdown function:
const resetCountdown = () => {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        setCountdownInterval(null);
    }
    setCountdown(30);
    setShowCompletionPrompt(false);
};





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
         You have unsubmitted changes
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
        <Text className="text-gray-800 text-lg font-medium">
          {t("OpenedOrderScreen.INV No")} {orderData.invoiceNo}
        </Text>
        {/* {orderStatus === 'Completed' && completedTime && (
          <Text className="text-sm text-gray-500 mt-1">
            {t("Completed at")}: {completedTime}
          </Text>
        )} */}
      </View>
    </View>

    {/* Loading State */}
    {isLoading ? (
      <View className="flex-1 justify-center items-center py-20">
        <LottieView
          source={require('../../assets/lottie/newLottie.json')}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View>
    ) : (
      <>
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: orderStatus === 'Completed' ? 20 : 100 }}
        >
          
          {/* Dynamic Status Badge */}
          <View className="mx-4 mt-4 mb-3 justify-center items-center">
            <DynamicStatusBadge />
          </View>


   {familyPackItems.length > 0 && (
  <View className="mx-4 mb-3">
    {getPackageGroups().map((packageGroup, index) => (
      <View key={packageGroup.packageId} className={index > 0 ? "mt-3" : ""}>
        <TouchableOpacity 
          className={`px-4 py-3 rounded-lg flex-row justify-between items-center ${
            packageGroup.allSelected || orderStatus === 'Completed'
              ? 'bg-[#D4F7D4] border border-[#4CAF50]'
              : packageGroup.someSelected 
                ? 'bg-[#FFF9C4] border border-[#F9CC33]'
                : 'bg-[#FFF8F8] border border-[#D16D6A]'
          } ${orderStatus === 'Completed' ? 'opacity-100' : ''}`}
          onPress={() => togglePackageExpansion(packageGroup.packageId)}
        >
          <View className="flex-row items-center">
            <Text className="text-[#000000] font-medium">
              {packageGroup.packageName}
            </Text>
            {packageGroup.packageQty > 1 && (
              <Text className="text-black font-bold ml-1">
                (x{packageGroup.packageQty})
              </Text>
            )}
            {orderStatus === 'Completed' && packageGroup.allSelected && (
              <Text className="text-[#000000] font-medium ml-1">✓</Text>
            )}
          </View>
          <AntDesign 
            name={isPackageExpanded(packageGroup.packageId) ? "up" : "down"} 
            size={16} 
            color="#000000" 
          />
        </TouchableOpacity>
        
        {/* Expanded content remains the same */}
        {isPackageExpanded(packageGroup.packageId) && (
          <View className={`bg-white border border-t-0 rounded-b-lg px-4 py-4 ${
            packageGroup.allSelected || orderStatus === 'Completed'
              ? 'border-[#4CAF50]'
              : packageGroup.someSelected 
                ? 'border-[#F9CC33]'
                : 'border-[#D16D6A]'
          }`}>
                      {packageGroup.items.map((item) => (
                        <View
                          key={item.id}
                          className="flex-row justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                        >
                          <View className="flex-row items-center flex-1">
                            {/* Don't show replace button for completed orders */}
                            {/* {orderStatus !== 'Completed' && (
            <TouchableOpacity
              className="w-8 h-8 items-center justify-center mr-3"
              onPress={() => handleReplaceProduct(item)}
            >
              {item.selected ? (
                <Image source={disable} style={{ width: 20, height: 20 }}/>
              ) : (
                <Image source={RedIcon} style={{ width: 20, height: 20 }}/>
              )}
            </TouchableOpacity>
          )} */}
          {orderStatus !== 'Completed' && (
  <View className="w-8 h-8 items-center justify-center mr-3">
    {item.selected ? (
      // Show disabled image (not clickable)
      <Image source={disable} style={{ width: 20, height: 20, opacity: 0.5 }}/>
    ) : (
      // Show clickable red icon
      <TouchableOpacity onPress={() => handleReplaceProduct(item)}>
        <Image source={RedIcon} style={{ width: 20, height: 20 }}/>
      </TouchableOpacity>
    )}
  </View>
)}
                            <View className="flex-1">
                              <Text className={`font-medium text-black ${
                                orderStatus === 'Completed' && item.selected 
                                  ? 'text-black' 
                                  : orderStatus === 'Completed' 
                                    ? 'text-black' 
                                    : 'text-black'
                              }`}>
                                {item.name}
                              </Text>
                              <Text className="text-gray-500 text-sm">{item.weight}Kg</Text>
                            </View>
                          </View>
                          
                          {/* Show different indicators for completed vs active orders */}
                          {orderStatus === 'Completed' ? (
                            <View className="w-6 h-6 items-center justify-center">
                              {item.selected ? (
                                <AntDesign name="checkcircle" size={20} color="black" />
                              ) : (
                                <AntDesign name="closecircle" size={20} color="#F44336" />
                              )}
                            </View>
                          ) : (
                            <TouchableOpacity onPress={() => toggleFamilyPackItem(item.id)}>
                              {renderCheckbox(item.selected)}
                            </TouchableOpacity>
                          )}
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Additional Items Section - User controls expansion for all order statuses */}
          {additionalItems.length > 0 && (
            <View className="mx-4 mb-6">
              <TouchableOpacity 
                className={`px-4 py-3 rounded-lg flex-row justify-between items-center ${
                  orderStatus === 'Completed'
                    ? 'bg-[#D4F7D4] border border-[#4CAF50]'
                    : areAllAdditionalItemsSelected()
                      ? 'bg-[#D4F7D4] border border-[#4CAF50]'
                      : hasAdditionalItemSelections() 
                        ? 'bg-[#FFF9C4] border border-[#F9CC33]'
                        : 'bg-[#FFF8F8] border border-[#D16D6A]'
                }`}
                onPress={() => setAdditionalItemsExpanded(!additionalItemsExpanded)}
              >
                <Text className="text-[#000000] font-medium">
                  {t("PendingOrderScreen.Custom Selected Items")}
                  {orderStatus === 'Completed' && areAllAdditionalItemsSelected() && ' ✓'}
                </Text>
                <AntDesign 
                  name={additionalItemsExpanded ? "up" : "down"} 
                  size={16} 
                  color="#000000" 
                />
              </TouchableOpacity>
              
              {additionalItemsExpanded && (
                <View className={`bg-white border border-t-0 rounded-b-lg px-4 py-4 ${
                  orderStatus === 'Completed'
                    ? 'border-[#4CAF50]'
                    : areAllAdditionalItemsSelected()
                      ? 'border-[#4CAF50]'
                      : hasAdditionalItemSelections() 
                        ? 'border-[#F9CC33]'
                        : 'border-[#D16D6A]'
                }`}>
                  {additionalItems.map((item) => (
                    <View
                      key={item.id}
                      className="flex-row justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <View className="flex-1">
                        <Text className={`font-medium ${
                          orderStatus === 'Completed' && item.selected 
                            ? 'text-black' 
                            : orderStatus === 'Completed' 
                              ? 'text-gray-600 line-through' 
                              : 'text-black'
                        }`}>
                          {item.name}
                        </Text>
                        <Text className="text-gray-500 text-sm">{item.weight}Kg</Text>
                      </View>
                      
                      {/* Show completion status for completed orders */}
                      {orderStatus === 'Completed' ? (
                        <View className="w-6 h-6 items-center justify-center">
                          {item.selected ? (
                            <AntDesign name="checkcircle" size={20} color="black" />
                          ) : (
                            <AntDesign name="closecircle" size={20} color="#F44336" />
                          )}
                        </View>
                      ) : (
                        <TouchableOpacity onPress={() => toggleAdditionalItem(item.id)}>
                          {renderCheckbox(item.selected)}
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Warning Message - Only show for non-completed orders */}
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
                      ? '#FA0000'
                      : allSelected
                        ? '#308233'
                        : '#FA0000';
                  })()
                }}
              >
                {orderStatus === 'Opened'
                  ? ""
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

          {/* Completed Order Summary - Show completion details */}
          {/* {orderStatus === 'Completed' && (
            <View className="mx-4 mb-4 bg-green-50 px-4 py-3 rounded-lg border border-green-200">
              <Text className="text-green-800 text-center font-medium mb-2">
                {t("This order has been completed")}
              </Text>
              {completedTime && (
                <Text className="text-green-600 text-center text-sm">
                  {t("Completed at")}: {completedTime}
                </Text>
              )}
              
      
              <View className="mt-3 pt-3 border-t border-green-200">
                <Text className="text-green-700 text-sm text-center">
                  {t("Selected Items")}: {
                    [...familyPackItems, ...additionalItems].filter(item => item.selected).length
                  } / {familyPackItems.length + additionalItems.length}
                </Text>
              </View>
            </View>
          )} */}
        </ScrollView>

          <UnsavedChangesModal />
        <SubmitModal />
        <SuccessModal /> 

        {/* Fixed Submit Button - Hide for completed orders */}
        {orderStatus !== 'Completed' && (
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
        )}

        {/* Modals - Only show for non-completed orders */}
        {orderStatus !== 'Completed' && (
          <>
            <UnsavedChangesModal />
            <SubmitModal />
            <SuccessModal /> 
            {renderReplaceModal()}

            {/* Completion Prompt Modal */}
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
          </>
        )}
      </>
    )}
  </View>
);
};

export default PendingOrderScreen;