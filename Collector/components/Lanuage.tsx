import React from 'react';
import { View, Text, Image, TouchableOpacity,  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
const lg = require('../assets/images/lang1.png');
import { RootStackParamList } from './types';

type LanuageScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Lanuage'>;

interface LanuageProps {
  navigation: LanuageScreenNavigationProp;
}

const Lanuage: React.FC<LanuageProps> = ({ navigation }) => {
  

  return (
    <View className="flex-1 bg-white items-center">
      <Image className="mt-20 w-full h-30" source={lg} resizeMode="contain" />
      <Text className="text-3xl pt-5 font-semibold">Language</Text>
      <Text className="text-lg pt-5 font-extralight">மொழியைத் தேர்ந்தெடுக்கவும்</Text>
      <Text className="text-lg pt-1 mb-0 font-extralight">කරුණාකර භාෂාව තෝරන්න</Text>

      {/* TouchableOpacity Buttons */}
      <View className="flex-1 justify-center w-64 px-4 mt-0 pt-0">
        <TouchableOpacity className="bg-[#2AAD7A] p-4 rounded-3xl mb-6" onPress={() => navigation.navigate('Login')}>
          <Text className="text-white text-lg text-center">ENGLISH</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#2AAD7A] p-4 rounded-3xl mb-6 "  onPress={() => navigation.navigate('SinChangePassword')}>
          <Text className="text-white text-2xl text-center">සිංහල</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#2AAD7A] p-4 rounded-3xl mb-12"  onPress={()=>navigation.navigate('TamChangePassword')}>
          <Text className="text-white text-2xl text-center ">தமிழ்</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Lanuage;
