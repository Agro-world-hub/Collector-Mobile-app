import React from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SelectList } from "react-native-dropdown-select-list";

// Define the navigation prop type
type RecieveTargetScreenNavigationProps = StackNavigationProp<RootStackParamList, 'RecieveTargetScreen'>;

interface RecieveTargetScreenProps {
  navigation: RecieveTargetScreenNavigationProps;
}

const RecieveTargetScreen: React.FC<RecieveTargetScreenProps> = ({ navigation }) => {
  const [assignee, setAssignee] = useState('Pasan Ranshika');
  const [amount, setAmount] = useState('50');
  const [error, setError] = useState('');

  const maxAmount = 50;

  const handleAmountChange = (text: string) => {
    setAmount(text);
    const numericValue = parseFloat(text);
    if (numericValue > maxAmount) {
      setError(`You have exceeded maximum amount`);
    } else {
      setError('');
    }
  };

  const assigneeOptions = [
    { key: '1', value: '--Select an officer--' },
    { key: '2', value: 'pasan Rashmika' },
  ];

  return (
    <View className="flex-1 bg-white ">
       <View className="flex-row items-center bg-[#2AAD7A] p-6 rounded-b-lg">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold ml-[30%]">Variety #1</Text>
      </View>

      <View className="bg-white rounded-lg  p-4">
        <View className='p-5'>
          <Text className="text-gray-700 mb-2">Short Stock Assignee</Text>
          <View className="border border-gray-300 rounded-lg mb-4">
            <SelectList
              setSelected={(value: string) => setAssignee(value)}
              data={assigneeOptions}
              save="value"
              defaultOption={{ key: '1', value: '--Select an officer--' }}
            />
          </View>
          
          <View className="border-b border-gray-300 my-4" />

          <Text className="text-gray text-sm  mb-2 text-center mt-4">The maximum amount you can receive :</Text>
          <Text className="text-xl font-bold text-center text-black mb-4">50kg</Text>
        </View>

        

        <View className='p-5'>
          <Text className="text-gray-700 mb-2">Amount (kg)</Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-2 text-gray-800"
            keyboardType="numeric"
            value={amount}
            onChangeText={handleAmountChange}
          />
          {error ? <Text className="text-red-500 mt-2">{error}</Text> : null}
        </View>
      </View>

      <View className="mt-6 items-center">
        <TouchableOpacity
          className="bg-[#2AAD7A] rounded-full w-64 py-3"
          
        >
          <Text className="text-white text-center font-medium">Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecieveTargetScreen;