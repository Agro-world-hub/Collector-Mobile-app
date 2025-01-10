import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import environment from '../environment/environment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type SearchFarmerNavigationProp = StackNavigationProp<RootStackParamList, 'SearchFarmer'>;

interface SearchFarmerProps {
  navigation: SearchFarmerNavigationProp;
}

const SearchFarmer: React.FC<SearchFarmerProps> = ({ navigation }) => {
  const [NICnumber, setNICnumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [farmers, setFarmers] = useState<
    { NICnumber: string; firstName: string; lastName: string; phoneNumber: string; userId: string }[]
  >([]);

  // Fetch all farmers' data when the component mounts
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await api.get(`api/auth/getall`);
        if (response.status === 200 && response.data) {
          const mappedFarmers = response.data.map((farmer: any) => ({
            NICnumber: farmer.NICnumber,
            firstName: farmer.firstName,
            lastName: farmer.lastName,
            phoneNumber: farmer.phoneNumber,
            userId: farmer.id,
          }));
          setFarmers(mappedFarmers);
          console.log('Farmers:', mappedFarmers);
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('Failed to fetch farmers:', error.response?.data || error.message);
          Alert.alert('Error', error.response?.data?.message || 'Failed to fetch farmers data.');
        } else {
          console.error('An unexpected error occurred:', error);
          Alert.alert('Error', 'An unexpected error occurred.');
        }
      }
    };

    fetchFarmers();
  }, []);

  // Function to handle the search action
  const handleSearch = () => {
    if (NICnumber.trim().length === 0) return;

    setIsSearching(true);
    setNoResults(false);

    const foundFarmer = farmers.find(f => f.NICnumber === NICnumber.trim());

    setIsSearching(false);

    if (foundFarmer) {
      navigation.navigate('FarmerQr' as any, { NICnumber: foundFarmer.NICnumber, userId: foundFarmer.userId });
    } else {
      setNoResults(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <View className="flex-1 bg-white" style={{ paddingHorizontal: wp(6), paddingVertical: hp(2) }}>
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="">
            <AntDesign name="left" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-xl font-bold text-black">Search</Text>
        </View>

        {/* Search Form */}
        <View className="p-4">
          <Text className="text-center text-lg mb-4 mt-5">Enter Farmer's NIC number</Text>

          <View className="flex-row justify-center items-center border rounded-full mt-10 px-4 py-2 bg-gray-100">
            <TextInput
              value={NICnumber}
              onChangeText={setNICnumber}
              placeholder="Enter NIC number"
              className="flex-1 text-center"
            />
            <TouchableOpacity className="ml-2" onPress={handleSearch}>
              <FontAwesome name="search" size={24} color="green" />
            </TouchableOpacity>
          </View>

          {/* Display search image when no NIC is entered */}
          {!isSearching && NICnumber.length === 0 && (
            <View className="mt-10 items-center">
              <Image
                source={require('../assets/images/search.png')}
                className="h-[400px] w-[350px] rounded-lg"
                resizeMode="contain"
              />
            </View>
          )}

          {/* Searching status */}
          {isSearching && (
            <View className="mt-10 items-center">
              <Text className="text-center text-lg">Searching...</Text>
            </View>
          )}

          {/* No Results Found */}
          {!isSearching && noResults && NICnumber.length > 0 && (
            <View className="mt-10 items-center">
              <Image
                source={require('../assets/images/notfound.png')}
                className="h-[350px] w-[350px] rounded-lg"
                resizeMode="contain"
              />
              <Text className="text-center text-lg mt-4">No registered farmer found</Text>

              <TouchableOpacity
                onPress={() => navigation.navigate('UnregisteredFarmerDetails' as any)}
                className="mt-6 bg-green-500 rounded-lg px-6 py-3"
              >
                <Text className="text-white text-lg">Register Farmer</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default SearchFarmer;
