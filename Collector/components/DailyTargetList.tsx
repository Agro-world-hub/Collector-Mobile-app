import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { RootStackParamList } from './types';

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
];

// Define type for DailyTargetList navigation props
type DailyTargetListNavigationProps = StackNavigationProp<RootStackParamList, 'DailyTargetList'>;

interface DailyTargetListProps {
  navigation: DailyTargetListNavigationProps;
}

// Daily Target List Screen
const DailyTargetList: React.FC<DailyTargetListProps> = ({ navigation }) => {
    return( 
    
    <View className="flex-1 bg-black p-4">
    {/* Header */}
    <View className="bg-black items-center mb-4">
      <Text className="text-xl font-bold text-white">Daily Target</Text>
    </View>

    {/* Toggle Buttons */}
    <View className="flex-row bg-black justify-between items-center mb-4">
  {/* To-do Button */}
  <View className="flex-1 pr-2">
    <TouchableOpacity className="bg-green-500 px-4 py-2 rounded-full">
      <Text className="text-white font-bold text-center">To do</Text>
    </TouchableOpacity>
  </View>

  {/* Completed Button */}
  <View className="flex-1 pl-2">
    <TouchableOpacity className="bg-gray-300 px-4 py-2 rounded-full">
      <Text className="text-black font-bold text-center">Completed</Text>
    </TouchableOpacity>
  </View>
</View>


    {/* Table Header */}
    <View className="flex-row bg-green-500 py-2 px-2 rounded-t-lg">
      <Text className="flex-1 text-white text-center font-bold">No</Text>
      <Text className="flex-2 text-white text-center font-bold">Variety</Text>
      <Text className="flex-1 text-white text-center font-bold">Grade</Text>
      <Text className="flex-1 text-white text-center font-bold">Target (kg)</Text>
      <Text className="flex-1 text-white text-center font-bold">Completed (kg)</Text>
    </View>

 
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
}

export default DailyTargetList;