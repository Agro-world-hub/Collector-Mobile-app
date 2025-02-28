import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, BackHandler, Alert, ScrollView, RefreshControl } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import environment from '@/environment/environment';
import { useFocusEffect } from 'expo-router';
import { RootStackParamList } from '../types';


type ManagerDashboardNavigationProps = StackNavigationProp<
  RootStackParamList,
  "ManagerDashboard"
>;

interface ManagerDashboardProps {
  navigation: ManagerDashboardNavigationProps;
}

interface ProfileData {
  firstNameEnglish: string;
  lastNameEnglish: string;
  companyName: string;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ navigation }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [empId, setEmpId] = useState<string | null>(null);
  const [targetPercentage, setTargetPercentage] = useState<number | null>(null); // State to hold progress
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const response = await axios.get(`${environment.API_BASE_URL}api/collection-officer/user-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data.data);
        setEmpId(response.data.data.empId);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const fetchTargetPercentage = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "User not authenticated.");
        return;
      }
      const response = await axios.get(`${environment.API_BASE_URL}api/target/officer-task-summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('response for percentage target',response.data)
      if (response.data.success) {
        const percentage = parseInt(response.data.completionPercentage.replace("%", ""), 10);
        setTargetPercentage(percentage);
      } else {
        setTargetPercentage(0);
      }
    } catch (error) {
      console.error("Failed to fetch target percentage:", error);
      setTargetPercentage(0);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchTargetPercentage();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserProfile();
    await fetchTargetPercentage();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true;
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  return (
    <ScrollView
      className="flex-1 bg-white p-3"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Profile Section */}
      <TouchableOpacity className="flex-row items-center mb-4 p-4" onPress={() => navigation.navigate("EngProfile")}>
        <Image
          source={require("../../assets/images/mprofile.png")}
          className="w-16 h-16 rounded-full mr-4"
        />
        <View>
          <Text className="text-lg font-bold">{profile?.firstNameEnglish || "Loading..."} {profile?.lastNameEnglish || "Loading..."}</Text>
          <Text className="text-gray-500">{profile?.companyName || "Loading..."}</Text>
        </View>
      </TouchableOpacity>

       {/* Conditional Rendering for Daily Target */}
          {targetPercentage !== null && targetPercentage < 100 ? (
              <View className="bg-white ml-[20px] w-[90%] rounded-[35px] mt-3 p-4 border-[1px] border-[#DF9301]">
                <Text className="text-center text-yellow-600 font-bold">🚀 Keep Going!</Text>
                <Text className="text-center text-gray-500">You haven't achieved your daily target today</Text>
              </View>
            ) : (
              <View className="bg-white ml-[20px] w-[90%] rounded-[35px] mt-3 p-4 border-[1px] border-[#2AAD7A]">
                <View className="flex-row justify-center items-center mb-2">
                  <Image 
                    source={require("../../assets/images/hand.png")} 
                    className="w-8 h-8 mr-2"
                  />
                  <Text className="text-center text-[#2AAD7A] font-bold">Completed!</Text>
                </View>
                <Text className="text-center text-gray-500">You have achieved your daily target today</Text>
              </View>
      
            )}

      {/* Target Progress */}
      <View className="flex-row items-center justify-between mb-[-5%] p-7 mt-[4%]">
        <Text className="text-gray-700 font-bold text-lg">Your Target Progress</Text>
        <View className="relative">
          <CircularProgress
            size={100}
            width={8}
            fill={targetPercentage !== null ? targetPercentage : 0} // Dynamically set progress
            tintColor="#34D399"
            backgroundColor="#E5E7EB"
          />
          <View className="absolute items-center justify-center h-24 w-24">
            <Text className="text-2xl font-bold">{targetPercentage !== null ? `${targetPercentage}%` : "0%"}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row flex-wrap justify-between p-5 mt-[5%] mb-[8%]">
        <TouchableOpacity className="bg-white p-4 rounded-lg w-[45%] h-28 shadow-lg shadow-gray-500 relative" onPress={() => navigation.navigate("CenterTarget" as any)}>
          <Image
            source={require("../../assets/images/ct.png")}
            className="w-8 h-8 absolute top-2 right-2"
          />
          <Text className="text-gray-700 text-lg absolute bottom-2 left-2">Center Target</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white p-4 rounded-lg w-[45%] h-28 shadow-lg shadow-gray-500 relative" onPress={() => navigation.navigate("ManagerTransactions" as any, { empId })}>
          <Image
            source={require("../../assets/images/mycollect.png")}
            className="w-8 h-8 absolute top-2 right-2"
          />
          <Text className="text-gray-700 text-lg absolute bottom-2 left-2">My Collection</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white p-4 rounded-lg w-[45%] h-28 mt-4 shadow-lg shadow-gray-500 relative" onPress={() => navigation.navigate("QRScanner" as any)}>
          <Image
            source={require("../../assets/images/qrrr.png")}
            className="w-8 h-8 absolute top-2 right-2"
          />
          <Text className="text-gray-700 text-lg absolute bottom-2 left-2">Scan QR</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-white p-4 rounded-lg w-[45%] h-28 mt-4 shadow-lg shadow-gray-500 relative mb-5" onPress={() => navigation.navigate("SearchFarmer" as any)}>
          <Image
            source={require("../../assets/images/nic.png")}
            className="w-8 h-8 absolute top-2 right-2"
          />
          <Text className="text-gray-700 text-lg absolute bottom-2 left-2">Search By NIC</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ManagerDashboard;
