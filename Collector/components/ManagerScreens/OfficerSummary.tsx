import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { CircularProgress } from 'react-native-circular-progress';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import AntDesign from 'react-native-vector-icons/AntDesign';

type OfficerSummaryNavigationProp = StackNavigationProp<
  RootStackParamList,
  'OfficerSummary'
>;

type OfficerSummaryRouteProp = RouteProp<RootStackParamList, 'OfficerSummary'>;

interface OfficerSummaryProps {
  navigation: OfficerSummaryNavigationProp;
  route: OfficerSummaryRouteProp;
}

const OfficerSummary: React.FC<OfficerSummaryProps> = ({ route, navigation }) => {
  const { officerId, officerName, phoneNumber1, phoneNumber2,collectionOfficerId } = route.params;
  console.log(route.params);

  const handleDial = (phoneNumber: string) => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl).catch((err) => console.error('Failed to open dial pad:', err));
  };

  return (
    <View className="flex-1 bg-white ">
      {/* Header */}
      <View className="relative">
        {/* Header Section */}
        <View className="bg-white rounded-b-[25px] px-4 pt-12 pb-6 items-center shadow-lg z-10">
          {/* Back Icon */}
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="absolute top-6 left-4"
          >
            <AntDesign name="left" size={24} color="#000" />
          </TouchableOpacity>

          {/* Profile Image with Green Border */}
          <View className="w-28 h-28 border-[6px] border-[#2AAD7A] rounded-full items-center justify-center">
            <Image
              source={require('../../assets/images/mprofile.png')}
              className="w-24 h-24 rounded-full"
            />
          </View>
          {/* Name and EMP ID */}
          <Text className="mt-4 text-lg font-bold text-black">{officerName}</Text>
          <Text className="text-sm text-gray-500">EMP ID : {officerId}</Text>
        </View>

        {/* Action Buttons Section */}
        <View className="bg-[#2AAD7A] rounded-b-[45px] px-8 py-4 -mt-6 flex-row justify-around shadow-md z-0">
          {/* Phone Number 1 */}
          {phoneNumber1 ? (
            <TouchableOpacity className="items-center mt-5" onPress={() => handleDial(phoneNumber1)}>
              <View className="w-12 h-12 bg-[#FFFFFF66] rounded-full items-center justify-center shadow-md">
                <Ionicons name="call" size={24} color="white" />
              </View>
              <Text className="text-white mt-2 text-xs">Num 1</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity disabled={true} className="items-center mt-5">
              <View className="w-12 h-12 bg-[#FFFFFF66] rounded-full items-center justify-center shadow-md">
                <MaterialIcons name="error-outline" size={24} color="white" />
              </View>
              <Text className="text-white mt-2 text-xs">Num 1</Text>
            </TouchableOpacity>
          )}

          {/* Phone Number 2 */}
          {phoneNumber2 ? (
            <TouchableOpacity className="items-center mt-5" onPress={() => handleDial(phoneNumber2)}>
              <View className="w-12 h-12 bg-[#FFFFFF66] rounded-full items-center justify-center shadow-md">
                <Ionicons name="call" size={24} color="white" />
              </View>
              <Text className="text-white mt-2 text-xs">Num 2</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity disabled={true} className="items-center mt-5">
              <View className="w-12 h-12 bg-[#FFFFFF66] rounded-full items-center justify-center shadow-md">
                <MaterialIcons name="error-outline" size={24} color="white" />
              </View>
              <Text className="text-white mt-2 text-xs">Num 2</Text>
            </TouchableOpacity>
          )}

          {/* Report Button */}
          <TouchableOpacity className="items-center mt-5" onPress={() => navigation.navigate('ReportGenerator' as any,{ officerId,collectionOfficerId })}>
            <View className="w-12 h-12 bg-[#FFFFFF66] rounded-full items-center justify-center shadow-md">
              <MaterialIcons name="description" size={24} color="white" />
            </View>
            <Text className="text-white mt-2 text-xs">Report</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Section */}
      <View className="mt-6 px-6">
        <Text className="text-gray-800 font-bold mb-4 text-lg">Today ▶</Text>

        {/* Vertical Progress Indicators */}
        <View className="items-center">
          {/* Total Weight */}
          <View className="items-center mb-8">
            <CircularProgress
              size={100}
              width={10}
              fill={40}
              tintColor="#16A34A"
              backgroundColor="#E5E7EB"
            />
            <Text className="text-center mt-2 text-lg font-bold">40%</Text>
            <Text className="text-sm text-gray-500 mt-1">Total Weight</Text>
          </View>

          {/* Total Farmers */}
          <View className="items-center">
            <CircularProgress
              size={100}
              width={10}
              fill={40}
              tintColor="#FACC15"
              backgroundColor="#E5E7EB"
            />
            <Text className="text-center mt-2 text-lg font-bold">40%</Text>
            <Text className="text-sm text-gray-500 mt-1">Total Farmers</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OfficerSummary;
