import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { useRouter } from 'expo-router';
import axios from 'axios';  // Axios for API calls
import AsyncStorage from '@react-native-async-storage/async-storage';

type DashboardNavigationPrps = StackNavigationProp<RootStackParamList, 'Dashboard'>;

interface DashboardProps {
  navigation: DashboardNavigationPrps;
}

const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
  const [selectedNav, setSelectedNav] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>('');  // State for first name
  const route = useRouter();

  useEffect(() => {
    console.log('Fetching user profile...'); // Log to confirm useEffect runs
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Token:', token);  // Log the token
        if (token) {
          const response = await axios.get('http://10.0.2.2:3001/api/collection-officer/user-profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('API Response:', response.data);  // Log the response
          const { user } = response.data;
          setFirstName(user.firstName);
        } else {
          console.log('Token is null.'); // Log if the token is null
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };

    fetchUserProfile();  // Call the function when the component mounts
  }, []);

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="bg-green-500 p-4 rounded-b-3xl w-full h-[100px] flex-row justify-between items-center">
        <Text className="text-white text-xl ml-5 font-bold">
          {`Hi, ${firstName}!`} {/* Display loading text or first name */}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('EngProfile')}>
          <Image
            source={require('@/assets/images/profile.png')}
            className="w-16 h-16 rounded-full"
          />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 30 }}>
        <View className="mt-10">
          <Text className="text-lg font-semibold">Market Price</Text>
          <View className="border-b border-gray-300 mt-2 mb-4" />

          <View className="relative rounded-xl overflow-hidden shadow-lg">
            <Image
              source={require('@/assets/images/dash.webp')}
              className="w-full h-40"
            />
            <View className="absolute inset-0 p-5 mt-5 flex justify-end items-end">
              <View className="bg-transparent bg-opacity-70 p-2 rounded-md">
                <Text className="text-white font-semibold text-sm">📅 July 2024</Text>
                <Text className="font-semibold text-white mt-1">Carrot 1kg Price changes</Text>
                <Text className="text-white font-semibold mt-2">Rs. 250</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View className="mt-20 space-y-4">
          <TouchableOpacity
            className={`bg-green-500 h-[100px] rounded-lg p-4 shadow-lg ${selectedNav === 'registered' ? 'scale-105' : ''}`}
            onPress={() => {
              setSelectedNav('registered');
              navigation.navigate('SearchFarmer');
            }}
          >
            <Text className="text-white text-center mt-2 text-xl font-semibold">
              Registered{'\n'}Farmer {/* Ensure this text is wrapped in Text */}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`bg-green-500 h-[100px] rounded-lg p-4 shadow-lg ${selectedNav === 'unregistered' ? 'scale-105' : ''}`}
            onPress={() => {
              setSelectedNav('unregistered');
              navigation.navigate('UnregisteredFarmerDetails' as any);
            }}
          >
            <Text className="text-white text-center mt-2 text-xl font-semibold">
              Unregistered{'\n'}Farmer {/* Ensure this text is wrapped in Text */}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="flex-row justify-around items-center py-4 border-t border-gray-300 h-16">
        <TouchableOpacity
          onPress={() => setSelectedNav('first')}
          style={{ transform: [{ scale: selectedNav === 'first' ? 1.5 : 1 }] }}
        >
          <Image
            source={require('@/assets/images/first-image.png')}
            style={{ width: 35, height: 35 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedNav('second')}
          style={{ transform: [{ scale: selectedNav === 'second' ? 1.5 : 1 }] }}
        >
          <Image
            source={require('@/assets/images/second-image.png')}
            style={{ width: 35, height: 35 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedNav('third')}
          style={{ transform: [{ scale: selectedNav === 'third' ? 1.5 : 1 }] }}
        >
          <Image
            source={require('@/assets/images/third-image.png')}
            style={{ width: 35, height: 35 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Dashboard;
