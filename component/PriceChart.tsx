import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, ScrollView } from "react-native";
import axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "./types"; 
import {environment} from "../environment/environment";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useTranslation } from "react-i18next";

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type PriceChartNavigationProp = StackNavigationProp<RootStackParamList, "PriceChart">;

interface PriceChartProps {
  navigation: PriceChartNavigationProp;
  route: any;
}

const PriceChart: React.FC<PriceChartProps> = ({ navigation, route }) => {
  const { varietyId, cropName, varietyName } = route.params;

  const [priceData, setPriceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editedPrices, setEditedPrices] = useState<any[]>([]);
  const [isEditable, setIsEditable] = useState(false);
  const [buttonText, setButtonText] = useState("Request Price Update");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  // Fetch prices
  const fetchPrices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`api/unregisteredfarmercrop/unitPrices/${varietyId}`);
      setPriceData(response.data);
      setEditedPrices(response.data);
    } catch (error) {
      setError("Failed to fetch prices");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPrices();
    }, [varietyId])
  );

  const handlePriceChange = (index: number, newPrice: string) => {
    const cleanedPrice = newPrice.replace(/[^0-9.]/g, '');
    const updatedPrices = [...editedPrices];
    updatedPrices[index].price = cleanedPrice;
    setEditedPrices(updatedPrices);
  };

  const handleButtonClick = async () => {
    if (isEditable) {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found.");
        }
  
        const requestData = editedPrices.map((priceItem) => ({
          varietyId,
          grade: priceItem.grade,
          requestPrice: priceItem.price,
        }));
  
        if (requestData.length === 0) {
          Alert.alert("No prices to update", "Please edit the prices before submitting.");
          return;
        }
  
        // Send the price update request
        const response = await api.post(
          "api/auth/marketpricerequest",
          { prices: requestData },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        // Handle success response
        if (response.status === 201) {
          Alert.alert("Success", "The price request was sent successfully!");
          await fetchPrices(); // Refetch prices after submitting
          setIsEditable(false);
          setButtonText("Request Price Update");
        }
      } catch (error) {
        // Check if error status is 400 and show the message to update prices
        if (axios.isAxiosError(error) && error.response && error.response.status === 400) {
          Alert.alert(
            t("Error.Error"),
            t("Error.You must change the prices before submitting. Please update the values.")
          );
        } else {
          console.error("Error submitting price request:", error);
          setError("Failed to submit price update.");
          Alert.alert(t("Error.Error"),
            t("Error.Failed to submit price update."));
        }
      }
    } else {
      setIsEditable(true);
      setButtonText("Submit Request");
    }
  };
  

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-[#2AAD7A] h-20 flex-row items-center" style={{ paddingHorizontal: wp(6), paddingVertical: hp(2) }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold text-center flex-1">{t("PriceChart.PriceChart")}</Text>
      </View>

      {/* Content */}
      <ScrollView className="flex-1" style={{ paddingHorizontal: wp(8), paddingVertical: hp(8) }}>
        <View className="mb-4">
          <Text className="text-gray-600 text-sm mb-1">{t("PriceChart.Crop")}</Text>
          <TextInput className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800" value={cropName} editable={false} />
        </View>

        <View className="mb-4">
          <Text className="text-gray-600 text-sm mb-1">{t("PriceChart.Variety")}</Text>
          <TextInput className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800" value={varietyName} editable={false} />
        </View>

        {loading && (
          <View className="items-center my-6">
            <ActivityIndicator size="large" color="#2AAD7A" />
          </View>
        )}

        {error && (
          <View className="bg-red-100 p-4 rounded-md mb-6">
            <Text className="text-red-600 text-center">{error}</Text>
          </View>
        )}

        {priceData.length > 0 && !loading && !error && (
          <View className="mb-6">
            <Text className="text-gray-600 text-sm mb-2">{t("PriceChart.UnitGrades")}</Text>
            <View className="border border-gray-300 rounded-lg p-4">
              {priceData.map((priceItem, index) => (
                <View key={index} className="flex-row items-center mb-3">
                  <Text className="w-32 text-gray-600">{`Grade ${priceItem.grade}`}</Text>
                  <TextInput
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-800"
                    value={editedPrices[index]?.price}
                    editable={isEditable}
                    onChangeText={(newPrice) => handlePriceChange(index, newPrice)}
                    keyboardType="numeric"
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity className="bg-[#2AAD7A] rounded-[45px] py-3 h-12 mt-4 w-3/4 mx-auto" onPress={handleButtonClick}>
          <Text className="text-center text-base text-white font-semibold">{buttonText}</Text>
        </TouchableOpacity>

        {isEditable && (
          <TouchableOpacity
            className="border border-gray-400  mt-4 py-3 h-12 rounded-full items-center w-3/4 mx-auto"
            onPress={() => {
              setIsEditable(false);
              setButtonText("Request Price Update");
              fetchPrices();
            }}
          >
            <Text className="text-gray-700 text-base font-semibold">{t("PriceChart.Go")}</Text>
          </TouchableOpacity>

         
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PriceChart;
