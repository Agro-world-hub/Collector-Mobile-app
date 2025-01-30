import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RootStackParamList } from '../types';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import environment from '@/environment/environment';
import { Ionicons } from '@expo/vector-icons';

type DailyTargetNavigationProps = StackNavigationProp<RootStackParamList, 'DailyTarget'>;

interface DailyTargetProps {
  navigation: DailyTargetNavigationProps;
}

interface TargetData {
  varietyId: number;
  centerTarget: any;
  varietyName: string;
  grade: string;
  target: number;
  todo: number;
  qty: number; 
}

const DailyTarget: React.FC<DailyTargetProps> = ({ navigation }) => {
  const [todoData, setTodoData] = useState<TargetData[]>([]);
  const [completedData, setCompletedData] = useState<TargetData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedToggle, setSelectedToggle] = useState('ToDo'); // Track selected toggle

  useEffect(() => {
    const fetchTargets = async () => {
      setLoading(true);
      const startTime = Date.now(); // Capture the start time for the spinner
      try {
        const authToken = await AsyncStorage.getItem('token');
        const response = await axios.get(`${environment.API_BASE_URL}api/target/officer`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const allData = response.data.data;
        console.log('--------all data----------',allData);
        const todoItems = allData.filter((item: TargetData) => item.todo > 0); // Move tasks with todo > 0 to ToDo
        const completedItems = allData.filter((item: TargetData) => item.todo === 0); // Tasks with todo === 0 go to Completed
        
        
        
        setTodoData(todoItems);
        setCompletedData(completedItems);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = 3000 - elapsedTime; // Ensure at least 3 seconds loading time
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
        <Text className="text-white text-lg font-bold ml-[35%]">Daily Target</Text>
      </View>

      {/* Toggle Buttons */}
      <View className="flex-row justify-center items-center py-4 bg-black">
        {/* To Do Button */}
        <TouchableOpacity
          className={`px-4 py-2 rounded-full mx-2 flex-row items-center justify-center ${
            selectedToggle === 'ToDo' ? 'bg-[#2AAD7A]' : 'bg-white'
          }`}
          style={{ height: 40 }} // Ensure consistent height
          onPress={() => setSelectedToggle('ToDo')}
        >
          <Text className={`font-bold mr-2 ${selectedToggle === 'ToDo' ? 'text-white' : 'text-black'}`}>
            To do
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
          style={{ height: 40 }} // Ensure consistent height
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

      <ScrollView horizontal className="border border-gray-300 bg-white">
  <View>
    {/* Table Header */}
    <View className="flex-row bg-[#2AAD7A] h-[7%]">
      <Text className="w-16 p-2 font-bold text-center text-white">No</Text>
      <Text className="w-40 p-2 font-bold text-center text-white">Variety</Text>
      <Text className="w-32 p-2 font-bold text-center text-white">Grade</Text>
      <Text className="w-32 p-2 font-bold text-center text-white">Target (kg)</Text>
      <Text className="w-32 p-2 font-bold text-center text-white">Todo (kg)</Text>
    </View>
    {/* Table Data */}
    {loading ? (
      <View className="flex-1 justify-center items-center py-10">
        <ActivityIndicator size="large" color="#2AAD7A" />
      </View>
    ) : (
      displayedData.map((item, index) => (
<TouchableOpacity
  key={index}
  className={`flex-row ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
  onPress={() => {
    let qty = 0;

    // ✅ Extract qty from centerTarget based on the grade
    if (item.centerTarget) {
      if (item.grade === 'A' && item.centerTarget.total_qtyA !== undefined) {
        qty = parseFloat(item.centerTarget.total_qtyA);
      } else if (item.grade === 'B' && item.centerTarget.total_qtyB !== undefined) {
        qty = parseFloat(item.centerTarget.total_qtyB);
      } else if (item.grade === 'C' && item.centerTarget.total_qtyC !== undefined) {
        qty = parseFloat(item.centerTarget.total_qtyC);
      }
    }

    // ✅ Pass qty value to navigation
    navigation.navigate('EditTargetManager' as any, {
      varietyName: item.varietyName,
      varietyId: item.varietyId,
      grade: item.grade,
      target: item.target,
      todo: item.todo,
      qty: qty, // ✅ Ensure qty is passed correctly
    });
  }}
>
        <View
          key={index}
          className={`flex-row ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
        >
          <Text
            className="w-16 p-2 border-r border-gray-300 text-center"
          >
            {selectedToggle === 'ToDo' ? index + 1 : <Ionicons name="flag" size={20} color="green" />}
          </Text>
          <Text
            className="w-40 p-2 border-r border-gray-300 text-center flex-wrap"
            numberOfLines={2}
          >
            {item.varietyName}
          </Text>
          <Text
            className="w-32 p-2 border-r border-gray-300 text-center"
          >
            {item.grade}
          </Text>
          <Text
            className="w-32 p-2 border-r border-gray-300 text-center"
          >
            {item.target.toFixed(2)}
          </Text>
          <Text
            className="w-32 p-2 text-center"
          >
            {item.todo.toFixed(2)}
          </Text>
          
        </View>
        </TouchableOpacity>
      ))
    )}
  </View>
</ScrollView>

    </View>
  );
};

export default DailyTarget;
