import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../types';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import environment from '@/environment/environment';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native'; // Import LottieView

type CenterTargetNavigationProps = StackNavigationProp<RootStackParamList, 'CenterTarget'>;

interface CenterTargetProps {
  navigation: CenterTargetNavigationProps;
}

interface TargetData {
  varietyName: string;
  grade: string;
  target: number;
  todo: number;
}

const CenterTarget: React.FC<CenterTargetProps> = ({ navigation }) => {
  const [todoData, setTodoData] = useState<TargetData[]>([]);
  const [completedData, setCompletedData] = useState<TargetData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedToggle, setSelectedToggle] = useState('ToDo'); 

  useEffect(() => {
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

        const allData = response.data.data;
        const todoItems = allData.filter((item: TargetData) => item.todo > 0);
        const completedItems = allData.filter((item: TargetData) => item.todo === 0);

        setTodoData(todoItems);
        setCompletedData(completedItems);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = 4000 - elapsedTime;
        setTimeout(() => setLoading(false), remainingTime > 0 ? remainingTime : 0);
      }
    };

    fetchTargets();
  }, []);

  const displayedData = selectedToggle === 'ToDo' ? todoData : completedData;

  return (
    <View className="flex-1 bg-black p-4">
      {/* Header */}
      <View className="bg-black px-4 py-3 flex-row justify-between items-center">
        <Text className="text-white text-lg font-bold ml-[35%]">Center Target</Text>
      </View>

      {/* Toggle Buttons */}
      <View className="flex-row justify-center items-center py-4 bg-black">
        <TouchableOpacity
          className={`px-4 py-2 rounded-full mx-2 flex-row items-center justify-center ${
            selectedToggle === 'ToDo' ? 'bg-[#2AAD7A]' : 'bg-white'
          }`}
          style={{ height: 40 }}
          onPress={() => setSelectedToggle('ToDo')}
        >
          <Text className={`font-bold mr-2 ${selectedToggle === 'ToDo' ? 'text-white' : 'text-black'}`}>
            To do
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
            className={`font-bold ${
              selectedToggle === 'Completed' ? 'text-white' : 'text-black'
            }`}
          >
            Completed
          </Text>
          <View className="bg-white rounded-full px-2 ml-2">
            <Text className="text-green-500 font-bold text-xs">{completedData.length}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Table Header */}
      <ScrollView horizontal className="border border-gray-300 bg-white">
        <View>
          <View className="flex-row bg-[#2AAD7A] h-[7%]">
            <Text className="w-16 p-2 font-bold text-center">No</Text>
            <Text className="w-40 p-2 font-bold text-center">Variety</Text>
            <Text className="w-32 p-2 font-bold text-center">Grade</Text>
            <Text className="w-32 p-2 font-bold text-center">Target (kg)</Text>
            <Text className="w-32 p-2 font-bold text-center">Todo (kg)</Text>
          </View>

          {/* Loading Screen with Lottie */}
          {loading ? (
            <View className="flex-1 justify-center items-center mr-[45%] ">
              <LottieView
                source={require('../../assets/lottie/collector.json')} // Ensure you have a valid JSON file
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
                  {item.varietyName}
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

export default CenterTarget;
