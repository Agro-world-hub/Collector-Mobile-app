import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from './types';
import {environment} from "../environment/environment";
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from "react-i18next";

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type SearchPriceScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SearchPriceScreen'>;

interface SearchPriceScreenProps {
  navigation: SearchPriceScreenNavigationProp;
}

const SearchPriceScreen: React.FC<SearchPriceScreenProps> = ({ navigation }) => {
  const [cropOptions, setCropOptions] = useState<{ key: string; value: string }[]>([]);
  const [varietyOptions, setVarietyOptions] = useState<{ key: string; value: string }[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [selectedVariety, setSelectedVariety] = useState<string | null>(null);
  const [loadingCrops, setLoadingCrops] = useState(false);
  const [loadingVarieties, setLoadingVarieties] = useState(false);
  const { t } = useTranslation();

  // Function to fetch crop names
  const fetchCropNames = async () => {
    setLoadingCrops(true);
    try {
      const response = await api.get('api/unregisteredfarmercrop/get-crop-names');
      const formattedData = response.data.map((crop: any) => ({
        key: crop.id.toString(),
        value: crop.cropNameEnglish,
      }));
      setCropOptions(formattedData);
    } catch (error) {
      console.error('Failed to fetch crop names:', error);
    } finally {
      setLoadingCrops(false);
    }
  };

  // Function to fetch varieties based on the selected crop
  const fetchVarieties = async () => {
    if (!selectedCrop) return;

    setLoadingVarieties(true);
    try {
      const response = await api.get(`api/unregisteredfarmercrop/crops/varieties/${selectedCrop}`);
      const formattedData = response.data.map((variety: any) => ({
        key: variety.id.toString(),
        value: variety.varietyNameEnglish,
      }));
      setVarietyOptions(formattedData);
    } catch (error) {
      console.error('Failed to fetch varieties:', error);
    } finally {
      setLoadingVarieties(false);
    }
  };

  // Reload data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Reset the selected values and variety options
      setSelectedCrop(null);
      setSelectedVariety(null);
      setVarietyOptions([]);

      // Fetch crops again
      fetchCropNames();
    }, [])
  );

  // Fetch varieties when selectedCrop changes
  useEffect(() => {
    fetchVarieties();
  }, [selectedCrop]);

  return (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}>
    <ScrollView className="flex-1 bg-white "
    keyboardShouldPersistTaps="handled">
    <View className="flex-1 bg-white items-center px-6 pt-8">
      <Text className="text-xl font-semibold mb-4">{t("SearchPrice.SearchPrice")}</Text>
      <Image
        source={require('../assets/images/marketprice.webp')} // Replace with your image path
        className="w-64 h-40 mb-6 mt-8"
        resizeMode="contain"
      />

      {/* Crop Name Dropdown */}
      <View className="w-full mb-4">
        <Text className="text-base mb-2 text-center">{t("SearchPrice.Crop")}</Text>
        {loadingCrops ? (
          <ActivityIndicator size="small" color="#2AAD7A" />
        ) : (
          <SelectList
            setSelected={(val: any) => setSelectedCrop(val)}
            data={cropOptions}
            placeholder={t("SearchPrice.SelectCrop")}
            boxStyles={{
              backgroundColor: 'white',
              borderColor: '#CFCFCF',
            }}
            dropdownTextStyles={{
              color: '#000',
            }}
          />
        )}
      </View>

      {/* Variety Dropdown */}
      <View className="w-full mb-8">
        <Text className="text-base mb-2 text-center">{t("SearchPrice.Variety")}</Text>
        {loadingVarieties ? (
          <ActivityIndicator size="small" color="#2AAD7A" />
        ) : (
          <SelectList
            setSelected={(val: any) => setSelectedVariety(val)}
            data={varietyOptions}
            placeholder={t("SearchPrice.SelectVariety")}
            boxStyles={{
              backgroundColor: 'white',
              borderColor: '#CFCFCF',
            }}
            dropdownTextStyles={{
              color: '#000',
            }}
          />
        )}
      </View>

      {/* Search Button */}
      <TouchableOpacity
        className="bg-[#2AAD7A] w-full py-3 mb-4 rounded-[35px] items-center"
        onPress={() => {
          if (selectedCrop && selectedVariety) {
            const cropName = cropOptions.find(option => option.key === selectedCrop)?.value || '';
            const varietyName = varietyOptions.find(option => option.key === selectedVariety)?.value || '';

            navigation.navigate('PriceChart', {
              cropName: cropName,
              varietyId: selectedVariety,
              varietyName: varietyName,
            });
          }
        }}
      >
        <Text className="text-white font-semibold text-lg">{t("SearchPrice.Search")}</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SearchPriceScreen;
