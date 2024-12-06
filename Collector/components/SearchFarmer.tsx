import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import environment from '../environment/environment';
import BottomNav from './BottomNav';

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
  const [farmers, setFarmers] = useState<{ NICnumber: string; firstName: string; lastName: string; phoneNumber: string; userId: string }[]>([]);

  // Fetch all farmers' data when the component mounts
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await api.get(`api/auth/getall`);
        if (response.status === 200 && response.data) {
          // Map id as userId to match the SQL structure
          const mappedFarmers = response.data.map((farmer: any) => ({
            NICnumber: farmer.NICnumber,
            firstName: farmer.firstName,
            lastName: farmer.lastName,
            phoneNumber: farmer.phoneNumber,
            userId: farmer.id, // Map `id` to `userId`
          }));
          setFarmers(mappedFarmers);
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
    if (NICnumber.trim().length === 0) return; // Prevent search if the NIC is empty

    setIsSearching(true);
    setNoResults(false); // Reset no results state

    // Search for the farmer by NIC number in the fetched farmers data
    const foundFarmer = farmers.find(f => f.NICnumber === NICnumber.trim());

    setIsSearching(false); // Stop the search indicator after the search is complete

    if (foundFarmer) {
      // Redirect to the FarmerQR page with both NICnumber and userId
      navigation.navigate('FarmerQr' as any, { NICnumber: foundFarmer.NICnumber, userId: foundFarmer.userId });
    } else {
      setNoResults(true); // Set no results if not found
    }
  };

  return (
    <>
    <View className="flex-1 p-3 bg-white">

      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/images/back.png')} // Path to your back icon
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-center flex-1">Search</Text>

        <View style={{ width: 24 }} />
       
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
            <Text>
              <FontAwesome name="search" size={24} color="green" />
            </Text>
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
    <View className="flex-1 justify-end w-full">
        <BottomNav navigation={navigation} activeTab={'SearchFarmer'} />
    </View>
    </>
    
  );
};

export default SearchFarmer;
