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
import NetInfo from "@react-native-community/netinfo";
import i18n from "@/i18n/i18n";

// Use proper naming for ViewPickupOrders
type ViewPickupOrdersNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ViewPickupOrders"
>;

interface ViewPickupOrdersProps {
  navigation: ViewPickupOrdersNavigationProp;
  route: RouteProp<RootStackParamList, "ViewPickupOrders">;
}

// Define the Order interface here if not imported from types
interface Order {
  id: string;
  phone: string;
  cashAmount: string;
  scheduled: string;
  readyTime: string;
  status: string;
}

const ViewPickupOrders: React.FC<ViewPickupOrdersProps> = ({
  route,
  navigation,
}) => {
  const { order } = route.params; // Access the order from route params

  return (
    <View className="flex-1 bg-white">
      <Text>Order ID: {order.id}</Text>
      <Text>Phone: {order.phone}</Text>
      <Text>Cash Amount: {order.cashAmount}</Text>
      <Text>Scheduled: {order.scheduled}</Text>
      <Text>Ready Time: {order.readyTime}</Text>
      <Text>Status: {order.status}</Text>
    </View>
  );
};

export default ViewPickupOrders;