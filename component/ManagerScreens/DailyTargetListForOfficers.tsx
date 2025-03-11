import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import {environment} from "../../environment/environment";
import { useTranslation } from "react-i18next";

type DailyTargetListForOfficerstNavigationProps = StackNavigationProp<RootStackParamList, 'DailyTargetListForOfficers'>;

interface DailyTargetListForOfficersProps {
  navigation: DailyTargetListForOfficerstNavigationProps;
  route: {
    params: {
      collectionOfficerId: number;
      officerId:string
    };
  };
}

interface TargetData {
  varietyId: any;
  centerTarget: any;
  varietyName: string;
  grade: string;
  target: number;
  todo: number;
}

const DailyTargetListForOfficers: React.FC<DailyTargetListForOfficersProps> = ({ navigation, route }) => {
  const [todoData, setTodoData] = useState<TargetData[]>([]);
  const [completedData, setCompletedData] = useState<TargetData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedToggle, setSelectedToggle] = useState('ToDo'); 
  const [refreshing, setRefreshing] = useState(false);
  const { collectionOfficerId, officerId } = route.params;
  const { t } = useTranslation();

  // ✅ Fetch Targets API (Runs every time the page is visited or refreshed)
  const fetchTargets = async () => {
    setLoading(true);
    const startTime = Date.now(); 
    try {
      const authToken = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${environment.API_BASE_URL}api/target/officer/${collectionOfficerId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const allData = response.data.data;
      console.log(allData);
      const todoItems = allData.filter((item: TargetData) => item.todo > 0);
      const completedItems = allData.filter((item: TargetData) => item.todo === 0);

      setTodoData(todoItems);
      setCompletedData(completedItems);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = 3000 - elapsedTime; 
      setTimeout(() => setLoading(false), remainingTime > 0 ? remainingTime : 0);
    }
  };

  // ✅ Refresh Data Every Time the Screen is Focused
  useFocusEffect(
    React.useCallback(() => {
      fetchTargets();
    }, [])
  );

  // ✅ Refreshing function for Pull-to-Refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTargets();  // Re-fetch task data on refresh
    setRefreshing(false); // Set refreshing to false once data is loaded
  }, [collectionOfficerId]);

  const displayedData = selectedToggle === 'ToDo' ? todoData : completedData;

  return (
    <View className="flex-1 bg-[#282828] ">
      {/* Header */}
      <View className="bg-[#282828] px-4 py-3 flex-row  justify-center  items-center">
         <TouchableOpacity onPress={() => navigation.goBack()} className='absolute left-4'>
        <AntDesign name="left" size={22} color="white" />
              </TouchableOpacity>
              <Text className="text-white text-lg font-bold">{officerId}</Text>

      </View>

      {/* Toggle Buttons */}
      <View className="flex-row justify-center items-center py-4 bg-[#282828]">
        {/* To Do Button */}
        <TouchableOpacity
          className={`px-4 py-2 rounded-full mx-2 flex-row items-center justify-center ${
            selectedToggle === 'ToDo' ? 'bg-[#2AAD7A]' : 'bg-white'
          }`}
          style={{ height: 40 }}
          onPress={() => setSelectedToggle('ToDo')}
        >
          <Text className={`font-bold mr-2 ${selectedToggle === 'ToDo' ? 'text-white' : 'text-black'}`}>
          {t("DailyTarget.Todo")}
          </Text>
          <View className="bg-white rounded-full px-2">
            <Text className="text-green-500 font-bold text-xs">{todoData.length}</Text>
          </View>
        </TouchableOpacity>

        {/* Completed Button */}
        <TouchableOpacity
          className={`px-4 py-2 rounded-full mx-2 flex-row items-center ${
            selectedToggle === 'Completed' ? 'bg-[#2AAD7A]' : 'bg-white'
          }`}
          style={{ height: 40 }}
          onPress={() => setSelectedToggle('Completed')}
        >
          <Text
            className={`font-bold ${selectedToggle === 'Completed' ? 'text-white' : 'text-black'}`}
          >
            {t("DailyTarget.Completed")}
          </Text>
          <View className="bg-white rounded-full px-2 ml-2">
            <Text className="text-green-500 font-bold text-xs">{completedData.length}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Scrollable Table */}
      <ScrollView
        horizontal
        className=" bg-white"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View>
          {/* Table Header */}
          <View className="flex-row bg-[#2AAD7A] h-[7%]">
                  <Text className="w-16 p-2  text-center text-white">{t("DailyTarget.No")}</Text>
                  <Text className="w-40 p-2  text-center text-white">{t("DailyTarget.Variety")}</Text>
                  <Text className="w-32 p-2  text-center text-white">{t("DailyTarget.Grade")}</Text>
                  <Text className="w-32 p-2  text-center text-white">{t("DailyTarget.Target")}</Text>
                  <Text className="w-32 p-2  text-center text-white">{t("DailyTarget.Todo()")}</Text>
                </View>

          {loading ? (
             <View className="flex-1 justify-center items-center mr-[45%]">
                  <LottieView
                    source={require('../../assets/lottie/collector.json')} // Ensure you have a valid JSON file
                    autoPlay
                    loop
                    style={{ width: 350, height: 350 }}
                  />
                </View>
          ) : (
            displayedData.map((item, index) => (
              <TouchableOpacity
                key={index}
                className={`flex-row ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                onPress={() => {
                  let qty = 0;
                  if (item.centerTarget) {
                    if (item.grade === 'A' && item.centerTarget.total_qtyA !== undefined) {
                      qty = parseFloat(item.centerTarget.total_qtyA);
                    } else if (item.grade === 'B' && item.centerTarget.total_qtyB !== undefined) {
                      qty = parseFloat(item.centerTarget.total_qtyB);
                    } else if (item.grade === 'C' && item.centerTarget.total_qtyC !== undefined) {
                      qty = parseFloat(item.centerTarget.total_qtyC);
                    }
                  }

                  navigation.navigate('EditTargetScreen' as any, {
                    varietyName: item.varietyName,
                    varietyId: item.varietyId,
                    grade: item.grade,
                    target: item.target,
                    todo: item.todo,
                    qty: qty,
                    collectionOfficerId, 
                  });
                }}
              >
                <View
                  key={index}
                  className={`flex-row ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                >
                  <Text className="w-16 p-2 border-r border-gray-300 text-center">
                    {selectedToggle === 'ToDo' ? index + 1 : <Ionicons name="flag" size={20} color="green" />}
                  </Text>
                  <Text className="w-40 p-2 border-r border-gray-300 text-center flex-wrap">
                    {item.varietyName}
                  </Text>
                  <Text className="w-32 p-2 border-r border-gray-300 text-center">{item.grade}</Text>
                  <Text className="w-32 p-2 border-r border-gray-300 text-center">{item.target.toFixed(2)}</Text>
                  <Text className="w-32 p-2 text-center">{item.todo.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default DailyTargetListForOfficers;
