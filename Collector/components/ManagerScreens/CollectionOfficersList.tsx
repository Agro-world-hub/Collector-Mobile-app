import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import axios from 'axios';
import environment from "@/environment/environment";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

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
  collectionOfficerId: number;
}

const CollectionOfficersList: React.FC<CollectionOfficersListProps> = ({ navigation }) => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);


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
        setOfficers(response.data.data);
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
          collectionOfficerId: item.collectionOfficerId,
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
      <View className="bg-green-600 py-6 px-4 rounded-b-2xl relative">
      {/* Header Title */}
      <Text
        style={{ fontSize: 18 }}
        className="text-white text-center font-bold"
      >
        Collection Officers
      </Text>

      {/* Three-Dots Icon */}
      <TouchableOpacity
        className="absolute top-6 right-4"
        onPress={() => setShowMenu((prev) => !prev)}
      >
        <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Dropdown Menu */}
      {showMenu && (
        <View className="absolute top-14 right-4 bg-white shadow-lg rounded-lg">
          <TouchableOpacity
            className="px-4 py-2 bg-white rounded-lg shadow-lg"
            onPress={() => navigation.navigate('ClaimOfficer') // Replace with actual functionality
            }
          >
            <Text className="text-gray-700 font-semibold">Claim Officer</Text>
          </TouchableOpacity>
        </View>
      )}
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

      {/* Loader, Error Message, or List */}
      {loading ? (
        <ActivityIndicator size="large" color="#16A34A" className="flex-1 justify-center items-center" />
      ) : errorMessage ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg">{errorMessage}</Text>
        </View>
      ) : (
        <FlatList
          data={officers}
          keyExtractor={(item) => item.empId}
          renderItem={renderOfficer}
          contentContainerStyle={{
            paddingBottom: scale(80), // Add extra padding to avoid overlapping with the button
            paddingTop: scale(10),
          }}
          showsVerticalScrollIndicator={true}
        />
      )}

      {/* Floating Button */}
      <TouchableOpacity
        className="absolute bottom-5 right-5 bg-black w-14 h-14 rounded-full justify-center items-center shadow-lg"
        onPress={() => navigation.navigate('AddOfficerBasicDetails' as any)}
      >
        <Ionicons name="add" size={scale(24)} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default CollectionOfficersList;
