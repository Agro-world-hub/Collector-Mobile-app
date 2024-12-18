import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import SantaSleigh from './santa';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Dynamic scaling function
const scale = (size: number) => (width / 375) * size; 

interface Officer {
  id: string;
  name: string;
}

type CollectionOfficersListNavigationProps = StackNavigationProp<RootStackParamList, 'CollectionOfficersList'>;

interface CollectionOfficersListProps {
  navigation: CollectionOfficersListNavigationProps;
}

const officersData: Officer[] = [
  { id: 'COO0127', name: 'Amal Perera' },
  { id: 'COO0134', name: 'Bhathiya Dias' },
  { id: 'COO0155', name: 'Dulaj Nawanajana' },
  { id: 'COO0147', name: 'Samitha Herath' },
  { id: 'COO0137', name: 'Umesh Kalhara' },
  { id: 'COO0167', name: 'Viraj Perera' },
];

const CollectionOfficersList: React.FC<CollectionOfficersListProps> = ({navigation}) => {
  const renderOfficer = ({ item }: { item: Officer }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 mb-3 rounded-[35px] bg-gray-100 shadow-sm mx-4 "
      onPress={() =>
        navigation.navigate('OfficerSummary' as any, {
          officerId: item.id,
          officerName: item.name,
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
        <Text className="text-[18px] font-semibold text-gray-900">{item.name}</Text>
        <Text className="text-sm text-gray-500">EMP ID : {item.id}</Text>
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
      <View className="px-4 mt-4 ">
      
        <Text
          style={{ fontSize: scale(16) }}
          className="font-bold text-gray-800 mb-2"
        >
          Officers List <Text className="text-gray-500">(All {officersData.length})</Text>
        </Text>
      </View>

      {/* FlatList */}
      <FlatList
        data={officersData}
        keyExtractor={(item) => item.id}
        renderItem={renderOfficer}
        contentContainerStyle={{
          paddingBottom: scale(20), 
          paddingTop: scale(10),
        }}
        showsVerticalScrollIndicator={true} 
      />
    </View>
  );
};

export default CollectionOfficersList;
