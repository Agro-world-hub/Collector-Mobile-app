import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { SelectList } from "react-native-dropdown-select-list";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import environment from '@/environment/environment';

type PassTargetScreenNavigationProps = StackNavigationProp<RootStackParamList, 'PassTargetScreen'>;

interface PassTargetScreenProps {
  navigation: PassTargetScreenNavigationProps;
}

const PassTargetScreen: React.FC<PassTargetScreenProps> = ({ navigation }) => {
  const [assignee, setAssignee] = useState('');
  const [amount, setAmount] = useState('50');
  const [error, setError] = useState('');
  const [officers, setOfficers] = useState<{ key: string; value: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const maxAmount = 50;

  // Fetch officers from API
  const fetchOfficers = async () => {
    try {
      setLoading(true);
      setErrorMessage(null); // Reset error message before fetching

      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${environment.API_BASE_URL}api/collection-manager/collection-officers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'success') {
        // ✅ Map API response to match the SelectList format
        const formattedOfficers = response.data.data.map((officer: any) => ({
          key: officer.id.toString(),
          value: officer.name, // Assuming the API returns officer names in `name`
        }));
        setOfficers([{ key: '0', value: '--Select an officer--' }, ...formattedOfficers]);
      } else {
        setErrorMessage('Failed to fetch officers.');
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setErrorMessage('No officers available.');
      } else {
        setErrorMessage('An error occurred while fetching officers.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Reload the officers list every time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchOfficers();
    }, [])
  );

  const handleAmountChange = (text: string) => {
    setAmount(text);
    const numericValue = parseFloat(text);
    if (numericValue > maxAmount) {
      setError(`You have exceeded the maximum amount.`);
    } else {
      setError('');
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center bg-[#2AAD7A] p-6 rounded-b-lg">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold ml-[30%]">Variety #1</Text>
      </View>

      <View className="bg-white rounded-lg p-4">
        <Text className="text-gray text-sm mb-2 text-center mt-5">The maximum amount you can pass:</Text>
        <Text className="text-xl font-bold text-center text-black mb-4">50kg</Text>

        <View className="border-b border-gray-300 my-4" />

        <View className="p-5">
          <Text className="text-gray-700 mb-2 mt-[20%]">Short Stock Assignee</Text>

          {/* ✅ Show loading while fetching officers */}
          {loading ? (
            <ActivityIndicator size="large" color="#2AAD7A" />
          ) : errorMessage ? (
            <Text className="text-red-500">{errorMessage}</Text>
          ) : (
            <View className="border border-gray-300 rounded-lg mb-4">
              <SelectList
                setSelected={(value: string) => setAssignee(value)}
                data={officers} // ✅ Use fetched officers
                save="value"
                defaultOption={{ key: '0', value: '--Select an officer--' }}
              />
            </View>
          )}

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
          onPress={() => {
            if (!error && assignee !== '--Select an officer--') {
              console.log(`Assignee: ${assignee}, Amount: ${amount}`);
              // Perform action (e.g., save target)
            }
          }}
        >
          <Text className="text-white text-center font-medium">Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PassTargetScreen;
