import { View, Text, Button,Image } from 'react-native';
import React, { useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types'; // Adjust the import path as needed

type SplashNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

interface SplashProps {
  navigation: SplashNavigationProp;
}

const phone = require('../assets/images/phone.png');

const Splash: React.FC<SplashProps> = ({ navigation }) => {
  useEffect(() => {
    // Timer to navigate after 5 seconds
    const timer = setTimeout(() => {
      navigation.navigate('Lanuage'); // Correct route name
    }, 5000);

    // Cleanup function to clear the timer
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View className='bg-[#2AAD7A] w-full flex-1'>
     <View className='flex-1'>
      <Image source={phone} className='mt-[50%]' /> 
      </View> 
      <View className='items-center pb-[10%]'>
      <Text className='text-white text-2xl'>Powered By AgroWorld</Text>
      </View>
    </View>
  );
}

export default Splash;
