import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {environment }from '@/environment/environment';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { RootStackParamList } from './types';
import { useTranslation } from "react-i18next";

type DailyTargetListNavigationProps = StackNavigationProp<RootStackParamList, 'DailyTargetList'>;

interface DailyTargetListProps {
  navigation: DailyTargetListNavigationProps;
}

interface TargetData {
  varietyNameEnglish: string;
  grade: string;
  target: number;
  todo: number;
  varietyNameSinhala:string;
  varietyNameTamil:string
}

const DailyTargetList: React.FC<DailyTargetListProps> = ({ navigation }) => {
  const [todoData, setTodoData] = useState<TargetData[]>([]);
  const [completedData, setCompletedData] = useState<TargetData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false); // State for refresh control
  const [error, setError] = useState<string | null>(null);
  const [selectedToggle, setSelectedToggle] = useState('ToDo');
   const { t } = useTranslation();
   const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
 

   const fetchSelectedLanguage = async () => {
     try {
       const lang = await AsyncStorage.getItem("@user_language"); // Get stored language
       setSelectedLanguage(lang || "en"); // Default to English if not set
     } catch (error) {
       console.error("Error fetching language preference:", error);
     }
   };


  // Function to fetch targets
  const fetchTargets = useCallback(async () => {
    setLoading(true);
    try {
      const authToken = await AsyncStorage.getItem('token');
      const response = await axios.get(`${environment.API_BASE_URL}api/target/officer`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const allData = response.data.data;
      const todoItems = allData.filter((item: TargetData) => item.todo > 0);
      const completedItems = allData.filter((item: TargetData) => item.todo === 0);
      console.log(allData)

      setTodoData(todoItems);
      setCompletedData(completedItems);
      setError(null);
    } catch (err) {
      setError(t("Error.Failed to fetch data."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchTargets();
  }, [fetchTargets]);

  // Function for refreshing the list
  const onRefresh = () => {
    setRefreshing(true);
    fetchTargets();
  };

  const displayedData = selectedToggle === 'ToDo' ? todoData : completedData;
   useEffect(() => {
            const fetchData = async () => {
              await fetchSelectedLanguage(); 
       
            };
            fetchData();
          }, []);
    
          const getvarietyName = (TargetData: TargetData) => {
            switch (selectedLanguage) {
              case "si":
                return TargetData.varietyNameSinhala;
              case "ta":
                return TargetData.varietyNameTamil;
              default:
                return TargetData.varietyNameEnglish;
            }
          };

  return (
    <View className="flex-1 bg-[#282828]  w-full">
      {/* Header */}
      <View className="bg-[#282828] px-4 py-3 flex-row justify-between items-center w-full">
        <Text className="text-white text-lg font-bold ml-[35%]">{t("DailyTarget.DailyTarget")}</Text>
      </View>

      {/* Toggle Buttons */}
      <View className="flex-row justify-center items-center py-4 bg-[#282828] ">
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
            <Text className="text-black font-bold text-xs">{todoData.length}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className={`px-4 py-2 rounded-full mx-2 flex-row items-center ${
            selectedToggle === 'Completed' ? 'bg-[#2AAD7A]' : 'bg-white'
          }`}
          style={{ height: 40 }}
          onPress={() => setSelectedToggle('Completed')}
        >
          <Text className={`font-bold ${selectedToggle === 'Completed' ? 'text-white' : 'text-black'}`}>
          {t("DailyTarget.Completed")}
          </Text>
          <View className="bg-white rounded-full px-2 ml-2">
            <Text className="text-black font-bold text-xs">{completedData.length}</Text>
          </View>
        </TouchableOpacity>
      </View>

   
      {/* Table Header and Data */}
      <ScrollView
        horizontal
        className=" bg-white w-full"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="w-full bg-whitw ">
          {/* Table Header */}
          <View className="flex-row bg-[#2AAD7A] h-[7%]">
            <Text className="w-16 p-2  text-center text-white">{t("DailyTarget.No")}</Text>
            <Text className="w-40 p-2  text-center text-white">{t("DailyTarget.Variety")}</Text>
            <Text className="w-32 p-2  text-center text-white">{t("DailyTarget.Grade")}</Text>
            <Text className="w-32 p-2  text-center text-white">{t("DailyTarget.Target")}</Text>
            <Text className="w-32 p-2  text-center text-white">{t("DailyTarget.Todo()")}</Text>
          </View>

          {/* Table Data */}
          {loading ? (
            <View className="flex-1 justify-center items-center mr-[45%]">
              <LottieView
                source={require('../assets/lottie/collector.json')}
                autoPlay
                loop
                style={{ width: 350, height: 350 }}
              />
            </View>
          ) : (
            displayedData.map((item, index) => (
              <View
                key={index}
                className={`flex-row ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
              >
                <Text className="w-16 p-2 border-r border-gray-300 text-center">
                  {selectedToggle === 'ToDo' ? index + 1 : <Ionicons name="flag" size={20} color="green" />}
                </Text>
                <Text
                  className="w-40 p-2 border-r border-gray-300 text-center flex-wrap"
                  numberOfLines={2}
                >
                  {getvarietyName(item)}
                </Text>
                <Text className="w-32 p-2 border-r border-gray-300 text-center">{item.grade}</Text>
                <Text className="w-32 p-2 border-r border-gray-300 text-center">
                  {item.target.toFixed(2)}
                </Text>
                <Text className="w-32 p-2 text-center">{item.todo.toFixed(2)}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>

   
  );
};

export default DailyTargetList;
