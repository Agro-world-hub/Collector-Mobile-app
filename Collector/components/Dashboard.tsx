import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import environment from '../environment/environment';
import BottomNav from './BottomNav';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import DashboardSkeleton from '../components/Skeleton/DashboardSkeleton';

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type DashboardNavigationPrps = StackNavigationProp<RootStackParamList, 'Dashboard'>;

interface DashboardProps {
  navigation: DashboardNavigationPrps;
}

const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
  const [firstName, setFirstName] = useState<string>(''); 
  const [lastName, setLastName] = useState<string>('');  
  const [loading, setLoading] = useState<boolean>(true); // Loading state for skeleton screen
  const route = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await api.get(`api/collection-officer/user-profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const { user } = response.data;
          setFirstName(user.firstNameEnglish);
          setLastName(user.lastNameEnglish);
          
          // Wait for 2 seconds after data is fetched before rendering the real content
          setTimeout(() => {
            setLoading(false); // Data is fetched, set loading to false after delay
          }, 2000);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setLoading(false); // If error occurs, stop loading
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <View className="flex-1 bg-white">
      {/* Show skeleton screen if still loading */}
      {loading ? (
        <DashboardSkeleton /> 
      ) : (
        <>
          {/* Combined Section for Header and Daily Target */}
          <View className="bg-green-500 rounded-b-3xl p-5">
            {/* Profile Image and Name on the Same Line */}
            <View className="flex-row items-center justify-left">
              <TouchableOpacity onPress={() => navigation.navigate('EngProfile')} className="flex-row items-center">
                <Image
                  source={require('@/assets/images/profile.png')}
                  className="w-20 h-20 rounded-full"
                />
                <Text className="text-white text-xl ml-6 font-bold">{firstName} {lastName}</Text>
              </TouchableOpacity>
            </View>

            {/* Daily Target Section */}
            <View className="bg-white  ml-[20px]  w-[90%] rounded-[35px] mt-3 p-4">
              <Text className="text-center text-yellow-600 font-bold">🚀 Keep Going!</Text>
              <Text className="text-center text-gray-500">You haven't achieved your daily target today</Text>
            </View>

            {/* Total Weight and Total Farmers Sections */}
            <ScrollView contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 20 }}>
              {/* Total Weight Section */}
              <View className=" w-full bg-green-500 rounded-xl p-4">
                <Text className="text-center font-semibold text-lg text-white">Total weight</Text>
                <View className="border-b border-gray-300 my-2" />
                <View className="flex-row justify-between bg-green-400 p-5 rounded-[35px] w-full">
                  <View className="items-center">
                    <Text className="text-white text-xl font-bold">20</Text>
                    <Text className="text-white">Collection</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-white text-xl font-bold">10</Text>
                    <Text className="text-white">Yet to Achieve</Text>
                  </View>
                </View>
              </View>

              {/* Total Farmers Section */}
              <View className="mt-1 w-full bg-green-500 rounded-xl p-4">
                <Text className="text-center font-semibold text-lg text-white">Total farmers</Text>
                <View className="border-b border-gray-300 my-2 " />
                <View className="flex-row justify-between bg-green-400 p-5  rounded-[35px] w-full">
                  <View className="items-center ">
                    <Text className="text-white text-xl font-bold">30</Text>
                    <Text className="text-white">Collection</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-white text-xl font-bold">2</Text>
                    <Text className="text-white">Yet to Achieve</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Buttons Section with White Background */}
          <View className="bg-white p-10 rounded-t-3xl shadow-lg ">
            <View className="flex-row justify-between ">
              <TouchableOpacity
                className="bg-green-500 w-[120px] h-24 rounded-xl flex items-center justify-center shadow-lg"
                onPress={() => navigation.navigate('QRScanner' as any)}
              >
                <Image
                  source={require('@/assets/images/scan-qr.png')}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
                <Text className="text-white mt-2 font-semibold">Scan QR</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-green-500 w-[120px] h-24  rounded-xl flex items-center justify-center shadow-lg"
                onPress={() => navigation.navigate('SearchFarmer' as any)}
              >
                <Image
                  source={require('@/assets/images/search-icon.png')}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
                <Text className="text-white mt-2 font-semibold">Search</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* <View className="flex-1 justify-end w-full">
            <BottomNav navigation={navigation} activeTab={'Dashboard'} />
          </View> */}
        </>
      )}
    </View>
  );
};

export default Dashboard;
