import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';

const data = [
  { no: "01", variety: "Variety #1", grade: "A", target: 20, completed: 10 },
  { no: "02", variety: "Variety #1", grade: "B", target: 30, completed: 0 },
  { no: "03", variety: "Variety #1", grade: "C", target: 50, completed: 0 },
  { no: "04", variety: "Variety #2", grade: "A", target: 20, completed: 18 },
  { no: "05", variety: "Variety #3", grade: "A", target: 22, completed: 11 },
  { no: "06", variety: "Variety #4", grade: "B", target: 20, completed: 8 },
  { no: "07", variety: "Variety #5", grade: "A", target: 20, completed: 5 },
  { no: "08", variety: "Variety #6", grade: "A", target: 20, completed: 0 },
  { no: "09", variety: "Variety #7", grade: "A", target: 20, completed: 0 },
  { no: "10", variety: "Variety #8", grade: "A", target: 20, completed: 0 },
  { no: "11", variety: "Variety #9", grade: "A", target: 60, completed: 20 },
  { no: "12", variety: "Variety #10", grade: "A", target: 40, completed: 30 },
  { no: "13", variety: "Variety #11", grade: "A", target: 5, completed: 0.5 },
  { no: "14", variety: "Variety #12", grade: "A", target: 5, completed: 1 },
  { no: "15", variety: "Variety #13", grade: "A", target: 12, completed: 10 },
  { no: "16", variety: "Variety #14", grade: "B", target: 25, completed: 15 },
  { no: "17", variety: "Variety #15", grade: "A", target: 30, completed: 25 },
  { no: "18", variety: "Variety #16", grade: "C", target: 40, completed: 20 },
  { no: "19", variety: "Variety #17", grade: "B", target: 35, completed: 5 },
  { no: "20", variety: "Variety #18", grade: "A", target: 28, completed: 12 },
  { no: "21", variety: "Variety #19", grade: "A", target: 15, completed: 10 },
  { no: "22", variety: "Variety #20", grade: "C", target: 50, completed: 40 },
  { no: "23", variety: "Variety #21", grade: "A", target: 10, completed: 8 },
  { no: "24", variety: "Variety #22", grade: "B", target: 60, completed: 45 },
  { no: "25", variety: "Variety #23", grade: "A", target: 35, completed: 32 },
];

// Define type for DailyTargetList navigation props
type DailyTargetNavigationProps = StackNavigationProp<RootStackParamList, 'DailyTarget'>;

interface DailyTargetProps {
  navigation: DailyTargetNavigationProps;
}

// Daily Target List Screen
const DailyTarget: React.FC<DailyTargetProps> = ({ navigation }) => {
  const [selectedToggle, setSelectedToggle] = useState('ToDo'); // Track selected toggle

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
          className={`px-4 py-2 rounded-full mx-2 ${
            selectedToggle === 'ToDo' ? 'bg-[#2AAD7A]' : 'bg-white'
          }`}
          onPress={() => setSelectedToggle('ToDo')}
        >
          <Text className={`font-bold ${selectedToggle === 'ToDo' ? 'text-white' : 'text-black'}`}>
            To do
          </Text>
        </TouchableOpacity>

        {/* Completed Button */}
        <TouchableOpacity
          className={`px-4 py-2 rounded-full mx-2 flex-row items-center ${
            selectedToggle === 'Completed' ? 'bg-[#2AAD7A]' : 'bg-white'
          }`}
          onPress={() => setSelectedToggle('Completed')}
        >
          <Text
            className={`font-bold mr-2 ${selectedToggle === 'Completed' ? 'text-white' : 'text-black'}`}
          >
            Completed
          </Text>
          <View className="bg-white rounded-full px-2">
            <Text className="text-green-500 font-bold text-xs">11</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Table Header */}
      <View className="flex-row bg-green-500 py-2 px-2 rounded-t-lg">
        <Text className="flex-1 text-white text-center font-bold">No</Text>
        <Text className="flex-2 text-white text-center font-bold">Variety</Text>
        <Text className="flex-1 text-white text-center font-bold">Grade</Text>
        <Text className="flex-1 text-white text-center font-bold">Target (kg)</Text>
        <Text className="flex-1 text-white text-center font-bold">Completed (kg)</Text>
      </View>

      {/* Table Data */}
      <ScrollView className="bg-white rounded-b-lg">
        {data.map((item, index) => (
          <View
            key={index}
            className={`flex-row items-center py-2 px-2 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
          >
            <Text className="flex-1 text-center">{item.no}</Text>
            <Text className="flex-2 text-center">{item.variety}</Text>
            <Text className="flex-1 text-center">{item.grade}</Text>
            <Text className="flex-1 text-center">{item.target}</Text>
            <Text className="flex-1 text-center">{item.completed}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default DailyTarget;
