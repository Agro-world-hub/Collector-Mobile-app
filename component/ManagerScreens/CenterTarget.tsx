import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { RootStackParamList } from '../types';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {environment }from '@/environment/environment';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native'; // Import LottieView
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from "react-i18next";

type CenterTargetNavigationProps = StackNavigationProp<RootStackParamList, 'CenterTarget'>;

interface CenterTargetProps {
  navigation: CenterTargetNavigationProps;
}

interface TargetData {
  complete: number;
  varietyNameEnglish: string;
  grade: string;
  target: number;
  todo: number;
  varietyNameSinhala:string;
  varietyNameTamil:string
}

const CenterTarget: React.FC<CenterTargetProps> = ({ navigation }) => {
  const [todoData, setTodoData] = useState<TargetData[]>([]);
  const [completedData, setCompletedData] = useState<TargetData[]>([]);
  const [centerCode, setcenterCode] = useState<string | null>("");
  console.log("Center Code", centerCode);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedToggle, setSelectedToggle] = useState('ToDo');
  const [refreshing, setRefreshing] = useState(false);
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


  // Sort function that first sorts by variety name, then by grade (A, B, C)
 // Get priority number for grade sorting
const getGradePriority = (grade: string): number => {
  switch (grade) {
    case 'A': return 1;
    case 'B': return 2;
    case 'C': return 3;
    default: return 4; // Any other grades come after A, B, C
  }
};

// Helper function to get the variety name based on selected language
const getVarietyNameForSort = (item: TargetData) => {
  switch (selectedLanguage) {
    case "si":
      return item.varietyNameSinhala || '';
    case "ta":
      return item.varietyNameTamil || '';
    default:
      return item.varietyNameEnglish || '';
  }
};

// Sort function that first sorts by variety name, then by grade (A, B, C)
const sortByVarietyAndGrade = (data: TargetData[]) => {
  return [...data].sort((a, b) => {
    // First sort by variety name
    const nameA = getVarietyNameForSort(a);
    const nameB = getVarietyNameForSort(b);
    
    const nameComparison = nameA.localeCompare(nameB);
    
    // If variety names are the same, sort by grade (A, B, C)
    if (nameComparison === 0) {
      return getGradePriority(a.grade) - getGradePriority(b.grade);
    }
    
    return nameComparison; // Return the name comparison if names are different
  });
};

   const fetchTargets = async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
        const authToken = await AsyncStorage.getItem('token');
        const response = await axios.get(`${environment.API_BASE_URL}api/target/get-center-target`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        // Safely process the data
        const allData = response.data.data.map((item: any) => ({
            ...item,
            // Ensure numeric values with fallback to 0
            target: Number(item.target || 0),
            complete: Number(item.complete || 0),
            todo: Number(item.todo || 0)
        }));

        console.log('Processed data:', allData);

        const todoItems = allData.filter((item: TargetData) => item.todo > 0);
        const completedItems = allData.filter((item: TargetData) => item.complete >= item.target); 

        setTodoData(sortByVarietyAndGrade(todoItems));
        setCompletedData(sortByVarietyAndGrade(completedItems));
        setError(null);
    } catch (err) {
        console.error('Fetch error:', err);
        setError(t("Error.Failed to fetch data."));
    } finally {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = 4000 - elapsedTime;
        setTimeout(() => setLoading(false), remainingTime > 0 ? remainingTime : 0);
    }
};

  useEffect(() => {
    const fetchData = async () => {
      await fetchTargets();
      const centerCode = await AsyncStorage.getItem('centerCode');
      setcenterCode(centerCode);
    };
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTargets(); // Trigger data fetch on refresh
    setRefreshing(false); // Reset refreshing state after fetching
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
          <View className="flex-1 bg-[#282828] ">
            {/* Header */}
            <View className="bg-[#282828] px-4 py-3 flex-row justify-center items-center">
              <TouchableOpacity onPress={() => navigation.goBack()} className="absolute top-6 left-4">
                <AntDesign name="left" size={22} color="white" />
              </TouchableOpacity>
              {/* <Text className="text-white text-lg font-bold ml-[35%] mt-[3%]">{t("CenterTarget.CenterTarget")}</Text> */}
              <Text className="text-white text-lg font-bold mt-[3%]">
                {centerCode}
              </Text>
            </View>
      
            {/* Toggle Buttons */}
            <View className="flex-row justify-center items-center py-4 bg-[#282828]">
              <TouchableOpacity
                className={`px-4 py-2 rounded-full mx-2 flex-row items-center justify-center ${
                  selectedToggle === 'ToDo' ? 'bg-[#2AAD7A]' : 'bg-white'
                }`}
                style={{ height: 40 }}
                onPress={() => setSelectedToggle('ToDo')}
              >
                <Text className={`font-bold mr-2 ${selectedToggle === 'ToDo' ? 'text-white' : 'text-black'}`}>
                  {t("CenterTarget.Todo")}
                </Text>
                <View className="bg-white rounded-full px-2">
                  <Text className="text-green-500 font-bold text-xs">{todoData.length}</Text>
                </View>
              </TouchableOpacity>
      
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
                  {t("CenterTarget.Completed")} 
                </Text>
                <View className="bg-white rounded-full px-2 ml-2">
                  <Text className="text-green-500 font-bold text-xs">{completedData.length}</Text>
                </View>
              </TouchableOpacity>
            </View>
      
            {/* Table Header */}
            <ScrollView
              horizontal
              className=" bg-white"
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
              <View>
                <View className="flex-row bg-[#2AAD7A] h-[7%]">
                  <Text className="w-16 p-2  text-center text-white"> {t("CenterTarget.No")} </Text>
                  <Text className="w-40 p-2  text-center text-white"> {t("CenterTarget.Variety")} </Text>
                  <Text className="w-32 p-2  text-center text-white"> {t("CenterTarget.Grade")}</Text>
                  <Text className="w-32 p-2  text-center text-white"> {t("CenterTarget.Target")}</Text>
                  <Text className="w-32 p-2 text-center text-white">
                    {selectedToggle === 'ToDo' ? t("DailyTarget.Todo") : t("DailyTarget.Completed")}
                  </Text>
                </View>
      
                {loading ? (
                  <View className="flex-1 justify-center items-center mr-[40%] ">
                    <LottieView
                      source={require('../../assets/lottie/collector.json')}
                      autoPlay
                      loop
                      style={{ width: 350, height: 350 }}
                    />
                  </View>
                ) : displayedData.length > 0 ? (
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
                      <Text className="w-32 p-2 text-center">
                        {selectedToggle === 'Completed' ? item.complete.toFixed(2) : item.todo.toFixed(2)}
                      </Text>
                    </View>
                  ))
                ) : (
                  <View className="flex-1 justify-center items-center mr-[35%]">
                    <LottieView
                      source={require('../../assets/lottie/NoComplaints.json')} 
                      autoPlay
                      loop
                      style={{ width: 150, height: 150 }}
                    />
                    <Text className="text-gray-500 mt-4">
                      {selectedToggle === 'ToDo' 
                        ? t("DailyTarget.NoTodoItems") || "No items to do"
                        : t("DailyTarget.noCompletedTargets") || "No completed items"
                      }
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        );
};

export default CenterTarget;