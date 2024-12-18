import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import axios from 'axios';
import environment from "@/environment/environment";
import AsyncStorage from '@react-native-async-storage/async-storage';
// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Dynamic scaling function
const scale = (size: number) => (width / 375) * size;

type CollectionOfficersListNavigationProps = StackNavigationProp<RootStackParamList, 'CollectionOfficersList'>;

interface CollectionOfficersListProps {
  navigation: CollectionOfficersListNavigationProps;
}

interface Officer {
  empId: string;
  fullName: string;
  phoneNumber1: string;
  phoneNumber2: string;
}

const CollectionOfficersList: React.FC<CollectionOfficersListProps> = ({ navigation }) => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOfficers = async () => {
    try {
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
        setOfficers(response.data.data);
      } else {
        console.error('Failed to fetch officers:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching officers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  const renderOfficer = ({ item }: { item: Officer }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 mb-3 rounded-[35px] bg-gray-100 shadow-sm mx-4"
      onPress={() =>
        navigation.navigate('OfficerSummary' as any, {
          officerId: item.empId,
          officerName: item.fullName,
          phoneNumber1: item.phoneNumber1,
          phoneNumber2: item.phoneNumber2,
        })
      }
    >
      {/* Officer Avatar */}
      <View className="w-14 h-14 rounded-full overflow-hidden justify-center items-center mr-4 shadow-md">
        <Image
          source={require('../../assets/images/profile.png')}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Officer Details */}
      <View className="flex-1">
        <Text className="text-[18px] font-semibold text-gray-900">{item.fullName}</Text>
        <Text className="text-sm text-gray-500">EMP ID : {item.empId}</Text>
      </View>

      {/* Arrow Icon */}
      <Ionicons name="chevron-forward" size={scale(20)} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-green-600 py-6 px-4 rounded-b-2xl">
        <Text
          style={{ fontSize: scale(18) }}
          className="text-white text-center font-bold"
        >
          Collection Officers
        </Text>
      </View>

      {/* Officers List Header */}
      <View className="px-4 mt-4">
        <Text
          style={{ fontSize: scale(16) }}
          className="font-bold text-gray-800 mb-2"
        >
          Officers List <Text className="text-gray-500">(All {officers.length})</Text>
        </Text>
      </View>

      {/* FlatList or Loader */}
      {loading ? (
        <ActivityIndicator size="large" color="#16A34A" className="flex-1 justify-center items-center" />
      ) : (
        <FlatList
          data={officers}
          keyExtractor={(item) => item.empId}
          renderItem={renderOfficer}
          contentContainerStyle={{
            paddingBottom: scale(20),
            paddingTop: scale(10),
          }}
          showsVerticalScrollIndicator={true}
        />
      )}
    </View>
  );
};

export default CollectionOfficersList;