import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useRouter } from 'expo-router';

type SinDashboardNavigationPrps = StackNavigationProp<RootStackParamList, 'SinDashboard'>;

interface SinDashboardProps {
  navigation: SinDashboardNavigationPrps;
}

const SinDashboard: React.FC<SinDashboardProps> = ({ navigation }) => {
  const [selectedNav, setSelectedNav] = useState<string | null>(null);
  const route = useRouter();

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="bg-green-500 p-4 rounded-b-3xl w-full h-[100px] flex-row justify-between items-center">
        <Text className="text-white text-xl ml-5 font-bold">සුබ දවසක්, නිමේශ්!</Text>
        <TouchableOpacity onPress={()=>navigation.navigate('SinProfile')}>
        <Image
          source={require('@/assets/images/profile.webp')}
          className="w-16 h-16 rounded-full"
        
        />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 30 }}>
        <View className="mt-10">
          <Text className="text-lg font-semibold">වෙළඳපොල මිල</Text>
          <View className="border-b border-gray-300 mt-2 mb-4"></View>

          <View className="relative rounded-xl overflow-hidden shadow-lg">
            <Image
              source={require('@/assets/images/dash.webp')}
              className="w-full h-40"
            />
            <View className="absolute inset-0 p-5 mt-5 flex justify-end items-end">
              <View className="bg-transparent bg-opacity-70 p-2 rounded-md">
                <Text className="text-white font-semibold text-sm">📅 ජූලි 2024</Text>
                <Text className="font-semibold text-white mt-1"> කැරට් කිලෝවක මිල වෙනස් වේ</Text>
                <Text className="text-white font-semibold mt-2">Rs. 250</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View className="mt-20 space-y-4">
          <TouchableOpacity
            className={`bg-green-500 h-[100px] rounded-lg p-4 shadow-lg ${selectedNav === 'registered' ? 'scale-105' : ''}`}
            onPress={() => setSelectedNav('registered')}
          >
            <Text className="text-white text-center mt-2 text-xl font-semibold" onPress={() => navigation.navigate('SinRegisteredfarmer')} >
            ලියාපදංචි වූ {'\n'}ගොවීන්
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`bg-green-500 h-[100px] rounded-lg p-4 shadow-lg ${selectedNav === 'unregistered' ? 'scale-105' : ''}`}
            onPress={() => setSelectedNav('unregistered')}
          >
            <Text className="text-white text-center mt-2 text-xl font-semibold" onPress={()=>navigation.navigate('SinUnregisteredFarmerDetails')}>
            ලියාපදංචි නොවූ {'\n'}ගොවීන්
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="flex-row justify-around items-center py-4 border-t border-gray-300 h-16">
        <TouchableOpacity
          onPress={() => setSelectedNav('first')}
          style={{ transform: [{ scale: selectedNav === 'first' ? 1.5 : 1 }] }}
        >
          <Image
            source={require('@/assets/images/first-image.webp')}
            style={{ width: 35, height: 35 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedNav('second')}
          style={{ transform: [{ scale: selectedNav === 'second' ? 1.5 : 1 }] }}
        >
          <Image
            source={require('@/assets/images/second-image.webp')}
            style={{ width: 35, height: 35 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedNav('third')}
          style={{ transform: [{ scale: selectedNav === 'third' ? 1.5 : 1 }] }}
        >
          <Image
            source={require('@/assets/images/third-image.webp')}
            style={{ width: 35, height: 35 }}
            resizeMode="contain"
           
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SinDashboard;
