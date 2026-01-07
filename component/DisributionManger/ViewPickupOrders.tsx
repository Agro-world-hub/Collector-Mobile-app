import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  StatusBar,
  Image,
  BackHandler
} from "react-native";
import { FontAwesome5, FontAwesome6, Foundation, Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../types";

type ViewPickupOrdersNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ViewPickupOrders"
>;

interface ViewPickupOrdersProps {
  navigation: ViewPickupOrdersNavigationProp;
  route: RouteProp<RootStackParamList, "ViewPickupOrders">;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  cashAmount?: string;
  isPaid: boolean;
  scheduled: string;
  readyTime: string;
  timeSlot: string;
  status: string;
}

const ViewPickupOrders: React.FC<ViewPickupOrdersProps> = ({
  route,
  navigation,
}) => {
  const { order } = route.params;
  const [isProcessing, setIsProcessing] = useState(false);

  // Split phone numbers by comma and trim whitespace
  const phoneNumbers = order.phone.split(",").map(phone => phone.trim());

  const makePhoneCall = (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert("Error", "Phone call is not supported on this device");
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const handleScanOrder = () => {
    // Navigate to QR scanner with the expected order ID
    navigation.navigate("qrcode", { 
      expectedOrderId: order.id,
      fromScreen: "ViewPickupOrders"
    });
  };

  const handleAcceptOrder = () => {
    Alert.alert(
      "Accept Order",
      "Do you want to accept this order?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Accept",
          onPress: () => {
            Alert.alert("Success", "Order accepted successfully!");
            navigation.goBack();
          },
        },
      ],
      { cancelable: false }
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("ReadytoPickupOrders")
        return true; 
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View className="px-4 py-3 mt-2">
        <View className="flex-row items-center justify-center relative">
          <TouchableOpacity
            className="absolute left-0 bg-[#F6F6F680] rounded-full p-2 z-50"
            onPress={() => navigation.navigate("ReadytoPickupOrders")}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-800">
            Order Details
          </Text>
        </View>
        
        {/* Ready Time Badge */}
        <View className="flex-row items-center justify-center ">
          <View className=" px-3 py-1.5 rounded-full flex-row items-center">
            <Text className=" font-semibold text-[#565559] mr-2">
              Ready
            </Text>
            <Text className=" font-semibold text-[#000000]">
              {order.readyTime}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4">
          {/* Customer Info */}
          <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <View className="items-center mb-4">
              <Image
                source={require("../../assets/images/New/ProfileCustomer.webp")}
                className="h-[100px] w-[100px] rounded-lg"
                resizeMode="contain"
              />
              <Text className="text-lg font-bold text-gray-800 mt-2">
                {order.customerName}
              </Text>
            </View>

            {/* Payment Status */}
            <View className="bg-[#F7F7F7] rounded-xl p-4 items-center mb-4">
              <View className="mb-2">
                {order.status === "Already Paid!" ? (
                  <MaterialIcons name="check-circle" size={28} color="#980775" />
                ) : (
                  <FontAwesome5 name="coins" size={28} color="#980775" />
                )}
              </View>
              {order.status === "Already Paid!" ? (
                <Text className=" font-bold text-[#980775]">
                  Already Paid!
                </Text>
              ) : (
                <Text className=" font-bold text-[#980775]">
                  Rs.{order.cashAmount}
                </Text>
              )}
            </View>

            {/* Time Slot */}
            <View className="bg-[#F7F7F7] rounded-xl p-4 items-center">
              <Octicons name="clock-fill" size={28} color="black" />
              <Text className="text-sm font-semibold text-gray-800 mt-2">
                {order.timeSlot}
              </Text>
            </View>
          </View>

          {/* Phone Call Buttons - Dynamic based on number of phone numbers */}
          <View className={`px-4 ${phoneNumbers.length === 1 ? 'mb-[68px]' : 'mb-4'}`}>
            {phoneNumbers.map((phoneNumber, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => makePhoneCall(phoneNumber)}
                className={`flex-row items-center justify-between bg-white border-2 border-[#980775] rounded-full py-1 px-6 ${
                  index < phoneNumbers.length - 1 ? 'mb-3' : ''
                }`}
                activeOpacity={0.7}
              >
                <Text className="text-base font-semibold text-black">
                  {phoneNumbers.length === 1 
                    ? "Make Phone Call" 
                    : `Make Phone Call - ${index + 1}`}
                </Text>
                <View className="bg-[#980775] rounded-full py-2 px-3">
                  <Foundation name="telephone" size={18} color="#fff" />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Scan Order Button */}
          <TouchableOpacity
            onPress={handleScanOrder}
            className="bg-[#980775] rounded-full py-3 px-7 mx-4 mb-20 shadow-md"
            activeOpacity={0.8}
            disabled={isProcessing}
          >
            <View className="flex-row items-center justify-center">
              <FontAwesome6 name="qrcode" size={24} color="white" />
              <Text className="text-white text-base font-bold ml-3">
                Scan Order
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ViewPickupOrders;