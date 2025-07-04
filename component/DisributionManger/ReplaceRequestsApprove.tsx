import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { environment } from '@/environment/environment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

type ReplaceRequestsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ReplaceRequestsApprove"
>;

interface ReplaceRequestsProps {
  navigation: ReplaceRequestsNavigationProp;
  route: ReplaceRequestsRouteProp;
}

type ReplaceRequestsRouteProp = RouteProp<RootStackParamList, "ReplaceRequestsApprove">;

interface RetailItem {
  id: string;
  displayName: string;
  normalPrice: number;
  discountedPrice?: number;
  unitType: string;
}

interface ReplaceRequestData {
  id: string;
  orderId: string;
  orderPackageId: string;
  productDisplayName: string;
  productTypeName: string;
  originalPrice: string;
  originalQty: string;
  status: string;
  createdAt: string;
  invNo: string;
  productType: string;
  productId: string;
  userId: string;
  packageId?: string;
  productNormalPrice?: string;
  productDiscountedPrice?: string;
    qty:string;
    price:string
}

interface ReplaceData {
  orderId: string;
  selectedProduct: string;
  productTypeName: string;
  newProduct: string;
  quantity: string;
  price: string;
  invNo:string;
  qty:string;
  
}

const ReplaceRequestsApprove: React.FC<ReplaceRequestsProps> = ({
  route,
  navigation,
}) => {
  const { t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingRetailItems, setLoadingRetailItems] = useState(false);
  const [retailItems, setRetailItems] = useState<RetailItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [ordreId , setOrdreId] = useState('')
  
  // Get passed data from navigation
  const replaceRequestData = route.params?.replaceRequestData as ReplaceRequestData;
  
  const [replaceData, setReplaceData] = useState<ReplaceData>({
    orderId: replaceRequestData?.orderId || replaceRequestData?.invNo || "N/A",
    selectedProduct: replaceRequestData?.productDisplayName || "N/A",
    productTypeName: replaceRequestData?.productTypeName || "N/A",
    newProduct: "",
    quantity: "",
    price: replaceRequestData?.price || "N/A",
    invNo:replaceRequestData?.invNo || "N/A",
    qty:replaceRequestData?.qty || "N/A"
  });



  // Load retail items when component mounts
  useEffect(() => {
    loadRetailItems();
    
  }, []);

   useEffect(() => {
   setOrdreId(replaceRequestData.orderId);
    
  }, []);

  console.log("////////////////////////////",ordreId)
 // In your React Native component
const loadRetailItems = async () => {
  try {
    setLoadingRetailItems(true);
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(
      `${environment.API_BASE_URL}api/distribution-manager/retail-items/${replaceRequestData.orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    if (response.data.success) {
      setRetailItems(response.data.data);
    }
  } catch (error) {
    console.error('Error loading retail items:', error);
  } finally {
    setLoadingRetailItems(false);
  }
};


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

  const handleApprove = async () => {
    if (!replaceData.newProduct || !replaceData.quantity) {
      Alert.alert('Error', 'Please select a product and enter quantity');
      return;
    }

    try {
      setSubmitting(true);
      const token = await AsyncStorage.getItem('token');
      
      const response = await axios.post(
        `${environment.API_BASE_URL}/api/replace-requests/approve`,
        {
          orderId: replaceData.orderId,
          newProduct: replaceData.newProduct,
          quantity: parseFloat(replaceData.quantity),
          price: parseFloat(replaceData.price.replace('Rs.', '')),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Replace request approved successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Error approving replace request:', error);
      Alert.alert('Error', 'Failed to approve replace request');
    } finally {
      setSubmitting(false);
    }
  };

  const isFormComplete = replaceData.newProduct && replaceData.quantity;

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
     <View className="bg-white px-4 py-4 flex-row items-center border-b border-gray-100">
             <TouchableOpacity  className="mr-4">
               <AntDesign name="left" size={24} color="#333" />
             </TouchableOpacity>
             <View className="flex-1 justify-center items-center">
               <Text className="text-gray-800 text-lg font-medium"> Order ID : {replaceData.invNo}</Text>
             </View>
           </View>

      <ScrollView className="flex-1 bg-white"
              style={{ paddingHorizontal: wp(6), paddingVertical: hp(2) }}
              keyboardShouldPersistTaps="handled">
        {/* Order Info */}
      

        {/* Defined Product Section */}
        <View className="px-5">
        <View className="border border-dashed border-[#FA0000] rounded-lg p-4 mb-6">
          <Text className="text-center text-gray-600 mb-3">Defined product</Text>
          <Text className="text-center font-medium  mb-2">
            {replaceData.selectedProduct} - {replaceData.qty} - {replaceData.price}
          </Text>
          <Text className="text-center text-gray-600 text-sm mb-1">
            Relevant Product Type :
          </Text>
          <Text className="text-center font-medium">
            {replaceData.productTypeName}
          </Text>
        </View>
        </View>

        {/* Replacing Product Details */}
        <View className="px-2 mt-2">
        <Text className="text-center text-black mb-4 font-medium">
          --Replacing Product Details--
        </Text>

        {/* Product Selection Dropdown */}
        <View className="mb-4">
          <TouchableOpacity
            className="border border-gray-300 rounded-full p-4 flex-row justify-between items-center bg-white"
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text className={replaceData.newProduct ? "text-black" : "text-gray-400"}>
              {replaceData.newProduct || "Select Product"}
            </Text>
            <AntDesign name={showDropdown ? "up" : "down"} size={16} color="#666" />
          </TouchableOpacity>

          {showDropdown && (
            <View className="border border-t-0 border-gray-300 rounded-b-lg bg-white max-h-40 mt-1">
              <ScrollView>
                {loadingRetailItems ? (
                  <View className="p-4 items-center">
                    <ActivityIndicator size="small" color="#000" />
                  </View>
                ) : retailItems.length > 0 ? (
                  retailItems.map((product) => (
                    <TouchableOpacity
                      key={product.id}
                      className="p-4 border-b border-gray-100"
                      onPress={() => handleProductSelect(product)}
                    >
                      <Text className="font-medium">{product.displayName}</Text>
                      <Text className="text-xs text-gray-500">
                        Rs.{(product.discountedPrice || product.normalPrice || 0).toFixed(2)} ({product.unitType})
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View className="p-4 items-center">
                    <Text className="text-gray-500">No products available</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Quantity Input */}
        <View className="mb-4">
          <TextInput
            className="border border-gray-300 rounded-full p-4 bg-white text-center"
            placeholder="Enter Quantity"
            value={replaceData.quantity}
            onChangeText={handleQuantityChange}
            keyboardType="numeric"
          />
        </View>

        {/* Price Display */}
        <View className="mb-8">
          <View className="border border-gray-300 rounded-full p-4 bg-gray-50">
            <Text className="text-black text-center">
              {replaceData.price}
            </Text>
          </View>
        </View>

        {/* Approve Button */}
        <TouchableOpacity
          className={`py-3 ml-3 mr-3 rounded-full ${isFormComplete ? 'bg-black' : 'bg-gray-300'}`}
          onPress={isFormComplete ? handleApprove : undefined}
          disabled={!isFormComplete || submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white text-center font-medium text-base">
              Approve
            </Text>
          )}
        </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ReplaceRequestsApprove;