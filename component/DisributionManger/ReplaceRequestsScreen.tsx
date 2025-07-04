import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { environment } from '@/environment/environment';

type ReplaceRequestsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ReplaceRequestsScreen"
>;

interface ReplaceRequestsProps {
  navigation: ReplaceRequestsNavigationProp;
  route: ReplaceRequestsRouteProp;
}

type ReplaceRequestsRouteProp = RouteProp<RootStackParamList, "ReplaceRequestsScreen">;

interface ReplaceRequestItem {
  id: string;
  orderId: string;
  orderPackageId: string;
  productDisplayName: string;
  createdAt: string;
  status: string;
  price: string;
  qty: string;
  productTypeName: string;
}

const ReplaceRequestsScreen: React.FC<ReplaceRequestsProps> = ({
  route,
  navigation,
}) => {
  const { t } = useTranslation();
  const [replaceRequests, setReplaceRequests] = useState<ReplaceRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReplaceRequests = useCallback(async () => {
    try {
      const authToken = await AsyncStorage.getItem("token");
      
      if (!authToken) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await axios.get(
        `${environment.API_BASE_URL}api/distribution-manager/get-replacerequest`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        // Map the API response data to our frontend format
        const mappedData = response.data.data.map((item: any) => ({
          id: item.id.toString(),
          orderId: item.orderId.toString(),
          orderPackageId: item.orderPackageId.toString(),
          productDisplayName: item.productDisplayName,
          createdAt: new Date(item.createdAt).toLocaleString(),
          status: item.status,
          price: item.price,
          qty: item.qty,
          productTypeName: item.productTypeName,
        }));
        
        setReplaceRequests(mappedData);
      }
    } catch (error) {
      console.error("Error fetching replace requests:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReplaceRequests();
  }, [fetchReplaceRequests]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchReplaceRequests();
  }, [fetchReplaceRequests]);

  const renderRequestItem = ({ item }: { item: ReplaceRequestItem }) => (
    <TouchableOpacity>
      <View className="flex-row items-center bg-[#ADADAD1A] p-3 px-4 mb-4 rounded-xl">
        <View className="flex-1">
          <Text className="font-bold text-base text-gray-900">
            {t("Order ID")} : {item.orderId}
          </Text>
          <Text className="text-gray-700 text-sm">
            {t("Item")} : {item.productDisplayName}
          </Text>
          <Text className="text-gray-500 text-sm">
            {t("Quantity")} : {item.qty}
          </Text>
          <Text className="text-gray-500 text-sm">
            {t("Price")} : {item.price}
          </Text>
          <Text className="text-gray-500 text-sm">
            {t("Category")} : {item.productTypeName}
          </Text>
          <Text className="text-gray-500 text-sm">
            {t("Requested Time")} : {item.createdAt}
          </Text>
          <Text className="text-gray-500 text-sm">
            {t("Status")} : {item.status}
          </Text>
        </View>
        <View className="p-2 rounded-full">
          <AntDesign name="right" size={20} color="#000" />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-white p-4"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="mb-6">
        <Text className="text-lg font-bold text-center">{t("Replace Requests")}</Text>
      </View>

      <View className="px-4">
        <Text className="text-base pb-4 text-[#21202B] font-semibold">
          {t("All")} ({replaceRequests.length})
        </Text>
        
        {replaceRequests.length === 0 ? (
          <Text className="text-center text-gray-500 py-10">
            {t("No replace requests found")}
          </Text>
        ) : (
          <FlatList 
            data={replaceRequests}
            keyExtractor={(item) => item.id}
            renderItem={renderRequestItem}
            scrollEnabled={false}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default ReplaceRequestsScreen;