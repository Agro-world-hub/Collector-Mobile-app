import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { RootStackParamList } from './types';

type SearchPriceScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SearchPriceScreen'>;

interface SearchPriceScreenProps {
  navigation: SearchPriceScreenNavigationProp;
}

  const SearchPriceScreen: React.FC<SearchPriceScreenProps> = ({ navigation }) => {
  const cropOptions = [
    { key: '1', value: 'Crop 1' },
    { key: '2', value: 'Crop 2' },
  ];

  const varietyOptions = [
    { key: '1', value: 'Variety 1' },
    { key: '2', value: 'Variety 2' },
  ];

  return (
    <View className="flex-1 bg-white items-center px-6 pt-12">
      <Text className="text-xl font-semibold mb-4">Search Price</Text>
      <Image
        source={require('../assets/images/market-price-1.png')} // Replace with your image path
        className="w-64 h-40 mb-6 mt-8"
        resizeMode="contain"
      />
      <View className="w-full mb-4">
        <Text className="text-base mb-2">Crop Name</Text>
        <SelectList
          setSelected={(val:any) => console.log(val)}
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
      </View>
      <View className="w-full mb-8">
        <Text className="text-base mb-2">Variety</Text>
        <SelectList
          setSelected={(val:any) => console.log(val)}
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
      </View>
      <TouchableOpacity className="bg-[#2AAD7A] w-full py-3 rounded-[35px] items-center">
        <Text className="text-white font-semibold text-lg">Search</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchPriceScreen;
