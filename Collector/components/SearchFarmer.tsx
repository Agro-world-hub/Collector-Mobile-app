import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';

type SearchFarmerNavigationProp = StackNavigationProp<RootStackParamList, 'SearchFarmer'>;

interface SearchFarmerProps {
  navigation: SearchFarmerNavigationProp;
}

const SearchFarmer: React.FC<SearchFarmerProps> = ({ navigation }) => {
  const [nicNumber, setNicNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false); // State to track if search returned no results
  const [farmer, setFarmer] = useState<{ nic: string; name: string } | null>(null); // State to store farmer data

  // Function to handle search action and make a request to the backend
  const handleSearch = async () => {
    if (nicNumber.trim().length === 0) return; // Prevent search if the NIC is empty

    setIsSearching(true);
    setNoResults(false); // Reset no results state
    setFarmer(null); // Reset farmer data before search

    try {
      const response = await axios.get(`http://10.0.2.2:3001/api/auth/search`, {
        params: { nic: nicNumber },
      });
      console.log(nic);

      if (response.status === 200 && response.data) {
        setFarmer(response.data); // Set the farmer data if found
        setNoResults(false);
      } else {
        setNoResults(true); // Set no results if not found
      }
    } catch (error) {
      setNoResults(true); // Set no results on error
      Alert.alert('Error', 'There was an issue with the search request');
    } finally {
      setIsSearching(false); // Stop the search indicator
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header Section */}
      <View className="flex-row items-center justify-between p-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-center flex-1">Search</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* Search Form */}
      <View className="p-4">
        <Text className="text-center text-lg mb-4 mt-5">Enter Farmer's NIC number</Text>

        <View className="flex-row justify-center items-center border rounded-full mt-10 px-4 py-2 bg-gray-100">
          <TextInput
            value={nicNumber}
            onChangeText={setNicNumber}
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
        {!isSearching && nicNumber.length === 0 && (
          <View className="mt-10 items-center">
            <Image
              source={require('../assets/images/search.png')}
              className="h-[400px] w-[350px]  rounded-lg"
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
        {!isSearching && noResults && nicNumber.length > 0 && (
          <View className="mt-10 items-center">
            <Image
              source={require('../assets/images/notfound.png')}
              className="h-[400px] w-[350px] rounded-lg"
              resizeMode="contain"
            />
            <Text className="text-center text-lg mt-4">No registered farmer found</Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('RegisterFarmer' as any)}
              className="mt-6 bg-green-500 rounded-lg px-6 py-3"
            >
              <Text className="text-white text-lg">Register Farmer</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Farmer Details Display */}
        {!isSearching && farmer && (
          <View className="mt-10 items-center">
            <Text className="text-lg">NIC: {farmer.nic}</Text>
            <Text className="text-lg">Name: {farmer.name}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default SearchFarmer;
