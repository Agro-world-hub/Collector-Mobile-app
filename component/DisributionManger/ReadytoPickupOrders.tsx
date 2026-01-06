import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image
} from "react-native";
import { FontAwesome, FontAwesome5, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import LottieView from 'lottie-react-native';
import { useTranslation } from "react-i18next";

type CollectionOfficersListNavigationProps = StackNavigationProp<
  RootStackParamList,
  "ReadytoPickupOrders"
>;

interface CollectionOfficersListProps {
  navigation: CollectionOfficersListNavigationProps;
}

interface Order {
  id: string;
  phone: string;
  cashAmount: string;
  scheduled: string;
  readyTime: string;
  status: string;
}

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

interface EmptyStateProps {
  message: string;
  onClear: () => void;
}

const mockOrders: Order[] = [
    {
    id: "241205000020",
    phone: "+94 781212800, +94 711232800",
    cashAmount: "1,200.00",
    scheduled: "2025/01/02 (8:00AM - 2:00PM)",
    readyTime: "At 6:05AM on 2025/01/02",
    status: "Partly Paid",
  },
  {
    id: "241205000021",
    phone: "+94 781212800",
    cashAmount: "1,200.00",
    scheduled: "2025/01/02 (12:00PM - 8:00PM)",
    readyTime: "At 6:20AM on 2025/01/02",
    status: "Already Paid!",
  },
];

const ReadytoPickupOrders: React.FC<CollectionOfficersListProps> = ({
  navigation,
}) => {
  const [searchPhone, setSearchPhone] = useState("");
  const { t } = useTranslation();
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  const [searchState, setSearchState] = useState<"initial" | "results" | "no-orders" | "no-user" | "no-orders-at-all">("initial");

  useEffect(() => {
    if (mockOrders.length === 0) {
      setSearchState("no-orders-at-all");
      setFilteredOrders([]);
    } else {
      setSearchState("initial");
      setFilteredOrders(mockOrders);
    }
  }, []);

  const normalizePhone = (phone: string): string => {
    return phone
      .replace(/\s+/g, "")
      .replace(/-/g, "")
      .replace(/^\+94/g, "")
      .replace(/^94/g, "")
      .replace(/^0/, "");
  };

  const handleSearchChange = (text: string) => {
    setSearchPhone(text);

    if (text.trim()) {
      const normalizedSearch = normalizePhone(text);
      const results = mockOrders.filter((order) => {
        const phoneNumbers = order.phone.split(",").map((p) => normalizePhone(p.trim()));
        return phoneNumbers.some((phone) => phone.includes(normalizedSearch));
      });

      if (results.length > 0) {
        setFilteredOrders(results);
        setSearchState("results");
      } else {
        setFilteredOrders([]);
        setSearchState(mockOrders.length === 0 ? "no-orders-at-all" : "no-user");
      }
    } else {
      setFilteredOrders(mockOrders);
      setSearchState(mockOrders.length === 0 ? "no-orders-at-all" : "initial");
    }
  };

  const handleClearSearch = () => {
    setSearchPhone("");
    setFilteredOrders(mockOrders);
    setSearchState(mockOrders.length === 0 ? "no-orders-at-all" : "initial");
  };

  const handleOrderClick = (order: Order) => {
    navigation.navigate("ViewPickupOrders", { order });
  };

  const NoOrdersState = () => {
    return (
      <View className="flex-1 justify-center items-center mt-[-25%] px-4">
        <View className="items-center">
          <LottieView
            source={require('../../assets/lottie/NoComplaints.json')}
            autoPlay
            loop
            style={{ width: 150, height: 150 }}
          />
        </View>
        <Text className="text-[#828282] mb-2 text-center">
          - {t("ReadytoPickupOrders.No orders to be picked up")} -
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-3 relative mt-2">
        <TouchableOpacity
          className="absolute left-4 bg-[#F6F6F680] rounded-full p-2 z-50"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">
          {t("ReadytoPickupOrders.Ready to Pickup Orders")}
        </Text>
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center mx-4 mt-4 px-3 py-1 border border-[#C0C0C0] rounded-full">
        <TextInput
          className="flex-1 text-base text-black py-2"
          placeholder={t("ReadytoPickupOrders.Search by phone number")}
          value={searchPhone}
          onChangeText={handleSearchChange}
          keyboardType="phone-pad"
        />
        {searchPhone ? (
          <TouchableOpacity
            className="w-12 h-12 bg-[#C0C0C0] rounded-full items-center justify-center"
            onPress={handleClearSearch}
          >
            <FontAwesome name="close" size={16} color="black" />
          </TouchableOpacity>
        ) : (
          <View className="w-12 h-12 bg-[#C0C0C0] rounded-full items-center justify-center">
            <Ionicons name="search" size={20} color="black" />
          </View>
        )}
      </View>

      {mockOrders.length > 0 && !searchPhone && (
        <Text className="text-sm text-gray-600 mx-4 mt-3">
          {t("ReadytoPickupOrders.All")} ({filteredOrders.length})
        </Text>
      )}

      {/* Content Area */}
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        {searchState === "no-orders-at-all" && (
          <NoOrdersState />
        )}

        {(searchState === "initial" || searchState === "results") && mockOrders.length > 0 && (
          <View className="p-4">
            {filteredOrders.map((order, index) => (
              <OrderCard
                key={index}
                order={order}
                onPress={() => handleOrderClick(order)}
              />
            ))}
          </View>
        )}

        {searchState === "no-orders" && (
          <EmptyState
            message={t("ReadytoPickupOrders.No orders from this user for pickup")}
            onClear={handleClearSearch}
          />
        )}

        {searchState === "no-user" && (
          <EmptyState
            message={t("ReadytoPickupOrders.No registered customer using this phone number")}
            onClear={handleClearSearch}
          />
        )}

        {mockOrders.length > 0 && filteredOrders.length === 0 && searchPhone && searchState === "results" && (
          <EmptyState
            message={t("ReadytoPickupOrders.No orders matching your search")}
            onClear={handleClearSearch}
          />
        )}
      </ScrollView>
    </View>
  );
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-lg p-4 mb-3 border border-gray-200 shadow-sm"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      {/* Order ID */}
      <View className="flex-row mb-2">
        <Text className="text-sm font-semibold">{t("ReadytoPickupOrders.Order ID")} :</Text>
        <Text className="text-sm font-semibold ml-1">{order.id}</Text>
      </View>

      {/* Phone */}
      <View className="flex-row mb-2 items-center">
        <FontAwesome5 name="phone-alt" size={16} color="black" style={{ marginRight: 8 }} />
        <Text className="text-sm text-[#565559]">{t("ReadytoPickupOrders.Phone")} : </Text>
        <Text className="text-sm font-semibold ml-1">{order.phone}</Text>
      </View>

      {/* Cash/Status */}
      <View className="flex-row items-center mb-2">
        <FontAwesome5 name="coins" size={16} color="black" style={{ marginRight: 8 }} />
        <Text className="text-sm text-[#565559]">{t("ReadytoPickupOrders.Cash")} : Rs. </Text>
        <Text className="text-sm font-semibold ml-1">{order.cashAmount}</Text>
      </View>

      {/* Scheduled */}
      <View className="flex-row mb-2 items-center">
        <FontAwesome5 name="clock" size={16} color="black" style={{ marginRight: 8 }} />
        <Text className="text-sm text-[#565559]">{t("ReadytoPickupOrders.Scheduled")} : </Text>
        <Text className="text-sm font-semibold ml-1">{order.scheduled}</Text>
      </View>

      {/* Ready Time */}
      <View className="flex-row items-center">
        <FontAwesome6 name="clock-rotate-left" size={16} color="black" style={{ marginRight: 8 }} />
        <Text className="text-sm text-[#565559]">{t("ReadytoPickupOrders.Ready Time")} : </Text>
        <Text className="text-sm font-semibold ml-1">{order.readyTime}</Text>
      </View>
    </TouchableOpacity>
  );
};

const EmptyState: React.FC<EmptyStateProps> = ({ message, onClear }) => {
  const { t } = useTranslation();

  return (
    <View className="flex-1 justify-center items-center mt-20 px-4">
      {/* Icon Container */}
      <View className="relative">
        <Image
          source={require("../../assets/images/notfound.webp")}
          className="h-[200px] w-[200px] rounded-lg"
          resizeMode="contain"
        />
      </View>

      <Text className="text-base text-gray-600 text-center mb-8 mt-4">
        {message}
      </Text>

      <TouchableOpacity
        onPress={onClear}
        className="bg-black px-8 py-3 rounded-full w-full max-w-xs items-center"
      >
        <View className="flex-row items-center">
          <Ionicons name="close" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text className="text-white text-base font-semibold">
            {t("ReadytoPickupOrders.Clear Search")}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ReadytoPickupOrders;