import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Platform, BackHandler } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Make sure to install this if not already done

import { RootStackParamList } from './types';
import axios from 'axios';
import environment from '@/environment/environment';

type DashboardNavigationProps = StackNavigationProp<
  RootStackParamList,
  "Dashboard"
>;

interface DashboardProps {
  navigation: DashboardNavigationProps;
}

interface ProfileData {
  firstNameEnglish: string;
  lastNameEnglish:string
  companyName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const response = await axios.get(`${environment.API_BASE_URL}api/collection-officer/user-profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfile(response.data.data); // Assuming 'data.data' contains profile info
          console.log("Profile data:", response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const onBackPress = () => {
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }
  }, []);

  return (
    <ScrollView className="flex-1 bg-white p-4">
      {/* Profile Section */}
      <TouchableOpacity className="flex-row items-center mb-4 p-4" onPress={() => navigation.navigate("EngProfile")}>
        <Image
          source={require("../assets/images/mprofile.png")}
          className="w-16 h-16 rounded-full mr-4"
        />
        <View>
          {/* Displaying name and company name if the profile is available */}
          <Text className="text-lg font-bold">{profile?.firstNameEnglish  || "Loading..."} {profile?.lastNameEnglish  || "Loading..."}</Text>
          <Text className="text-gray-500">{profile?.companyName || "Loading..."}</Text>
        </View>
      </TouchableOpacity>


      {/* Daily Target Warning */}
      <View className="bg-white ml-[20px] w-[90%] rounded-[35px] mt-3 p-4 border-2 border-[#DF9301]">
        <Text className="text-center text-yellow-600 font-bold">🚀 Keep Going!</Text>
        <Text className="text-center text-gray-500">You haven't achieved your daily target today</Text>
      </View>

      {/* Target Progress */}
      <View className="flex-row items-center justify-between mb-4 p-2 mt-[15%]">
        <Text className="text-gray-700 font-bold text-lg">Your Target Progress</Text>
        <View className="relative">
          <CircularProgress
            size={100}
            width={8}
            fill={40}
            tintColor="#34D399"
            backgroundColor="#E5E7EB"
          />
          <View className="absolute items-center justify-center h-24 w-24">
            <Text className="text-2xl font-bold">40%</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row flex-wrap justify-between p-5 mt-[10%]">

        <TouchableOpacity className="bg-white p-4 rounded-lg w-[45%] h-28 mt-4 shadow-lg shadow-gray-500 relative" onPress={() => navigation.navigate("QRScanner"as any)}>
          <Image
            source={require("../assets/images/qrrr.png")}
            className="w-8 h-8 absolute top-2 right-2"
          />
          <Text className="text-gray-700 text-lg absolute bottom-2 left-2">Scan QR</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white p-4 rounded-lg w-[45%] h-28 mt-4 shadow-lg shadow-gray-500 relative mb-5" onPress={() => navigation.navigate("SearchFarmer"as any)}>
          <Image
            source={require("../assets/images/nic.png")}
            className="w-8 h-8 absolute top-2 right-2"
          />
          <Text className="text-gray-700 text-lg absolute bottom-2 left-2">Search By NIC</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Dashboard;
