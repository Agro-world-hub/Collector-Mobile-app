import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import environment from '../environment/environment';

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
  const [selectedVariety, setSelectedVariety] = useState<string | null>(null); // Add this state
  const [loadingCrops, setLoadingCrops] = useState(false);
  const [loadingVarieties, setLoadingVarieties] = useState(false);

  // Fetch crop names
  useEffect(() => {
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
    fetchCropNames();
  }, []);

  // Fetch varieties based on selected crop
  useEffect(() => {
    if (!selectedCrop) return;

    const fetchVarieties = async () => {
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
    fetchVarieties();
  }, [selectedCrop]);

  return (
    <View className="flex-1 bg-white items-center px-6 pt-12">
      <Text className="text-xl font-semibold mb-4">Search Price</Text>
      <Image
        source={require('../assets/images/market-price-1.png')} // Replace with your image path
        className="w-64 h-40 mb-6 mt-8"
        resizeMode="contain"
      />

      {/* Crop Name Dropdown */}
      <View className="w-full mb-4">
        <Text className="text-base mb-2">Crop Name</Text>
        {loadingCrops ? (
          <ActivityIndicator size="small" color="#2AAD7A" />
        ) : (
          <SelectList
            setSelected={(val: any) => setSelectedCrop(val)}
            data={cropOptions}
            placeholder="Select Crop"
            boxStyles={{
              backgroundColor: '#F9F9F9',
              borderColor: '#E5E5E5',
            }}
            dropdownTextStyles={{
              color: '#000',
            }}
          />
        )}
      </View>

      {/* Variety Dropdown */}
      <View className="w-full mb-8">
        <Text className="text-base mb-2">Variety</Text>
        {loadingVarieties ? (
          <ActivityIndicator size="small" color="#2AAD7A" />
        ) : (
          <SelectList
            setSelected={(val: any) => setSelectedVariety(val)} // Set selected variety
            data={varietyOptions}
            placeholder="Select Variety"
            boxStyles={{
              backgroundColor: '#F9F9F9',
              borderColor: '#E5E5E5',
            }}
            dropdownTextStyles={{
              color: '#000',
            }}
          />
        )}
      </View>

      {/* Search Button */}
      <TouchableOpacity
        className="bg-[#2AAD7A] w-full py-3 rounded-[35px] items-center"
        onPress={() => {
          if (selectedCrop && selectedVariety) {
            // Find the selected crop's name based on the crop ID
            const cropName = cropOptions.find(option => option.key === selectedCrop)?.value || '';

            // Find the selected variety's name based on the variety ID
            const varietyName = varietyOptions.find(option => option.key === selectedVariety)?.value || '';

            // Now pass the varietyId and cropName to the 'PriceChart' screen
            navigation.navigate('PriceChart', {
              cropName: cropName,    // Send cropName
              varietyId: selectedVariety, // Send varietyId
              varietyName: varietyName,   // Send varietyName
            });
          }
        }}
      >
        <Text className="text-white font-semibold text-lg">Search</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchPriceScreen;
