import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";

type ReplaceRequestsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ReplaceRequestsScreen"
>;

interface ReplaceRequestsProps {
  navigation: ReplaceRequestsNavigationProp;
  route: ReplaceRequestsRouteProp;
}

type ReplaceRequestsRouteProp = RouteProp<RootStackParamList, "ReplaceRequestsScreen">;

const ReplaceRequestsScreen : React.FC<ReplaceRequestsProps> = ({
  route,
  navigation,
}) => {
  const { t } = useTranslation();

  const replaceRequests = [
    {
      orderId: "24120500020",
      replacingItem: "Carrot",
      requestedTime: "2025/06/25 11:54 AM",
    },
    {
      orderId: "24120500021",
      replacingItem: "Carrot",
      requestedTime: "2025/06/25 11:50 AM",
    },
    {
      orderId: "24120500022",
      replacingItem: "Beans",
      requestedTime: "2025/06/25 11:40 AM",
    },
  ];

  const renderRequestItem = ({ item }: any) => (
    <View className="flex-row items-center bg-[#ADADAD1A] p-3 px-4 mb-4 rounded-xl ">
      <View className="flex-1">
        <Text className="font-bold text-base text-gray-900">
          {t("Order ID")} : {item.orderId}
        </Text>
        <Text className="text-gray-700 text-sm">
          {t("Replacing Item")} : {item.replacingItem}
        </Text>
        <Text className="text-gray-500 text-sm"  >
          {t("Requested Time")} : {item.requestedTime}
        </Text>
      </View>
      <TouchableOpacity className=" p-2 rounded-full  ">
        <AntDesign name="right" size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="mb-6">
        <Text className="text-lg font-bold text-center">{t("Replace Requests")}</Text>
      </View>

      <View className="px-4">
        <Text className="text-base pb-4 text-[#21202B] font-semibold">{t("ManagerTransactions.All")} (00)</Text>
              <FlatList 
        data={replaceRequests}
        keyExtractor={(item) => item.orderId}
        renderItem={renderRequestItem}
      />

      </View>
 

    </ScrollView>
  );
};

export default ReplaceRequestsScreen;
