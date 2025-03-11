import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { SelectList } from "react-native-dropdown-select-list";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {environment} from "../../environment/environment";
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from "react-i18next";

// Define the navigation prop type
type RecieveTargetScreenNavigationProps = StackNavigationProp<RootStackParamList, 'RecieveTargetScreen'>;

interface RecieveTargetScreenProps {
  navigation: RecieveTargetScreenNavigationProps;
  route: {
    params: {
      varietyName: string;
      grade: string;
      target: string;
      todo: string;
      qty: string;
      varietyId: string;
    };
  };
}

const RecieveTargetScreen: React.FC<RecieveTargetScreenProps> = ({ navigation, route }) => {
  const [assignee, setAssignee] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [officers, setOfficers] = useState<{ key: string; value: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchingTarget, setFetchingTarget] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [maxAmount, setMaxAmount] = useState<number>(0);
  const { t } = useTranslation();

  const { varietyName, grade, target, qty, varietyId } = route.params;

  console.log("Initial Max Amount:", maxAmount);

  // ✅ Fetch officers dynamically
  const fetchOfficers = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${environment.API_BASE_URL}api/collection-manager/collection-officers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Officers:", response.data.data);

      if (response.data.status === 'success') {
        const formattedOfficers = response.data.data.map((officer: any) => ({
          key: officer.collectionOfficerId.toString(),
          value: officer.fullName,
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

  // ✅ Fetch Daily Target when officer is selected
  const fetchDailyTarget = async (officerId: string) => {
    if (officerId === '0') return; // Ignore if no officer selected
  
    try {
      setFetchingTarget(true);
      setErrorMessage(null);
  
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${environment.API_BASE_URL}api/target/get-daily-todo-byvariety/${officerId}/${varietyId}/${grade}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("Daily Target Response:", response.data);
  
      if (response.data.status === 'success' && response.data.data.length > 0) {
        const { target, complete } = response.data.data[0];
        const calculatedTodo = parseFloat(target) - parseFloat(complete);
  
        setMaxAmount(calculatedTodo > 0 ? calculatedTodo : 0); // Ensure todo is not negative
        setAmount(calculatedTodo.toString()); // Set default value
      } else {
        setErrorMessage('No target data found for selected officer.');
  
        // ✅ Auto-refresh fields after 3 seconds
        setTimeout(() => {
          setErrorMessage(null);
          setMaxAmount(0);
          setAmount('');
          setAssignee('');
        }, 3000);
      }
    } catch (error: any) {
      setErrorMessage('Failed to fetch daily target.');
  
      // ✅ Auto-refresh fields after 3 seconds
      setTimeout(() => {
        setErrorMessage(null);
        setMaxAmount(0);
        setAmount('');
        setAssignee('');
      }, 3000);
    } finally {
      setFetchingTarget(false);
    }
  };
  useEffect(() => {
    fetchOfficers();
  }, []);

  const handleAmountChange = (text: string) => {
    setAmount(text);
    const numericValue = parseFloat(text);
    if (numericValue > maxAmount) {
      setError(`You have exceeded the maximum amount.`);
    } else {
      setError('');
    }
  };
  
  
  const receiveTarget = async () => {
    if (!assignee || assignee === '0') {
      Alert.alert("Error", "Please select an officer.");
      return;
    }
  
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount.");
      return;
    }
  
    if (numericAmount > maxAmount) {
      Alert.alert("Error", `You cannot receive more than ${maxAmount}kg.`);
      return;
    }
  
    try {
      setFetchingTarget(true);
  
      const token = await AsyncStorage.getItem('token');
      const response = await axios.put(
        `${environment.API_BASE_URL}api/target/manager/recieve-target`,
        {
          fromOfficerId: assignee,  // The officer transferring the target
          varietyId: varietyId, 
          grade,
          amount: numericAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        Alert.alert("Success", "Target received successfully.");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to receive target.");
      }
    } catch (error: any) {
      console.error("Receive Target Error:", error);
      Alert.alert("Error", "An error occurred while receiving the target.");
    } finally {
      setFetchingTarget(false);
    }
  };
  

  return (
    <ScrollView className='flex-1 bg-white'>
    <View className="flex-1 bg-white">
      {/* ✅ Fixed Header */}
      <View className="flex-row items-center bg-[#2AAD7A] p-6 rounded-b-lg">
      {/* <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity> */}
       <TouchableOpacity onPress={() => {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'Main',
                params: {
                  screen: 'EditTargetManager',
                  params: { varietyId, varietyName, grade, target, todo: route.params.todo, qty }
                }
              }
            ],
          });
        }}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold ml-[30%]">{varietyName}</Text>
      </View>

      <View className="bg-white rounded-lg p-4">
        <View className='p-5'>
          <Text className="text-gray-700 mb-2">{t("PassTargetBetweenOfficers.Short Stock Assignee")}</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#2AAD7A" />
          ) : errorMessage ? (
            <Text className="text-red-500">{errorMessage}</Text>
          ) : (
            <View className="border border-gray-300 rounded-lg mb-4">
              <SelectList
                setSelected={(value: string) => {
                  setAssignee(value);
                  fetchDailyTarget(value); // Fetch daily target when an officer is selected
                }}
                data={officers}
                save="key"
                defaultOption={{ key: '0', value: '--Select an officer--' }}
              />
            </View>
          )}

          <View className="border-b border-gray-300 my-4" />

          <Text className="text-gray text-sm mb-2 text-center mt-4">{t("PassTargetBetweenOfficers.maximum amount receive")}</Text>
          {fetchingTarget ? (
            <ActivityIndicator size="small" color="#2AAD7A" />
          ) : (
            <Text className="text-xl font-bold text-center text-black mb-4">{maxAmount}{t("PassTargetBetweenOfficers.kg")}</Text>
          )}
        </View>

        <View className='p-5'>
          <Text className="text-gray-700 mb-2">{t("PassTargetBetweenOfficers.Amount")}</Text>
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
        onPress={receiveTarget}
        disabled={loading || fetchingTarget}
      >
        {fetchingTarget ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text className="text-white text-center font-medium">{t("PassTargetBetweenOfficers.Save")}</Text>
        )}
      </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
  );
};

export default RecieveTargetScreen;
