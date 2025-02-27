import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useRouter } from 'expo-router';

type TamDashboardNavigationPrps = StackNavigationProp<RootStackParamList, 'TamDashboard'>;

interface TamDashboardProps {
  navigation: TamDashboardNavigationPrps;
}

const TamDashboard: React.FC<TamDashboardProps> = ({ navigation }) => {
  const [selectedNav, setSelectedNav] = useState<string | null>(null);
  const route = useRouter();

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="bg-green-500 p-4 rounded-b-3xl w-full h-[100px] flex-row justify-between items-center">
        <Text className="text-white text-xl ml-5 font-bold">வணக்கம், நிமேஷ்!</Text>
        <TouchableOpacity onPress={()=>navigation.navigate('TamProfile')}>
        <Image
          source={require('@/assets/images/profile.png')}
          className="w-16 h-16 rounded-full"
        
        />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 30 }}>
        <View className="mt-10">
          <Text className="text-lg font-semibold">சந்தை விலை</Text>
          <View className="border-b border-gray-300 mt-2 mb-4"></View>

          <View className="relative rounded-xl overflow-hidden shadow-lg">
            <Image
              source={require('@/assets/images/dash.webp')}
              className="w-full h-40"
            />
            <View className="absolute inset-0 p-5 mt-5 flex justify-end items-end">
              <View className="bg-transparent bg-opacity-70 p-2 rounded-md">
                <Text className="text-white font-semibold text-sm">📅 ஜூலை 2024</Text>
                <Text className="font-semibold text-white mt-1">கேரட் 1கி விலை மாற்றங்கள்</Text>
                <Text className="text-white font-semibold mt-2">ரூ. 250</Text>
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
            <Text className="text-white text-center mt-2 text-xl font-semibold" onPress={() => navigation.navigate('TamRegisteredfarmer')} >
              பதிவு செய்யப்பட்ட{'\n'}வேளாண்மாளர்
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`bg-green-500 h-[100px] rounded-lg p-4 shadow-lg ${selectedNav === 'unregistered' ? 'scale-105' : ''}`}
            onPress={() => setSelectedNav('unregistered')}
          >
            <Text className="text-white text-center mt-2 text-xl font-semibold" onPress={()=>navigation.navigate('TamUnregisteredFarmerDetails')}>
              பதிவு செய்யப்படாத{'\n'}வேளாண்மாளர்
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
            source={require('@/assets/images/first-image.png')}
            style={{ width: 35, height: 35 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedNav('second')}
          style={{ transform: [{ scale: selectedNav === 'second' ? 1.5 : 1 }] }}
        >
          <Image
            source={require('@/assets/images/second-image.png')}
            style={{ width: 35, height: 35 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedNav('third')}
          style={{ transform: [{ scale: selectedNav === 'third' ? 1.5 : 1 }] }}
        >
          <Image
            source={require('@/assets/images/third-image.png')}
            style={{ width: 35, height: 35 }}
            resizeMode="contain"
           
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TamDashboard;
