import { View, Text, Image } from 'react-native';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types'; // Adjust the import path as needed

type SplashNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

interface SplashProps {
  navigation: SplashNavigationProp;
}

const phone = require('../assets/images/phone.png');

const Splash: React.FC<SplashProps> = ({ navigation }) => {
  useEffect(() => {
    const checkTokenAndNavigate = async () => {
      try {
        // Check for token in AsyncStorage
        const token = await AsyncStorage.getItem('token');
        
        // If token exists, check job role
        if (token) {
          const jobRole = await AsyncStorage.getItem('jobRole');
          
          if (jobRole === "Collection Officer") {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main', params: { screen: 'Dashboard' } }]
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main', params: { screen: 'ManagerDashboard' } }]
            });
          }
        } else {
          // If no token, wait for 5 seconds and go to language screen
          setTimeout(() => {
            navigation.navigate('Lanuage');
          }, 5000);
        }
      } catch (error) {
        console.error('Error checking token or job role:', error);
        // Fallback to language screen if there's an error
        setTimeout(() => {
          navigation.navigate('Lanuage');
        }, 5000);
      }
    };

    checkTokenAndNavigate();
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