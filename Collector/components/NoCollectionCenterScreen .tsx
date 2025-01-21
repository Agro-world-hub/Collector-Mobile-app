import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { View, Text, Image, BackHandler } from 'react-native';
import { RootStackParamList } from './types';
import environment from '@/environment/environment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NoCollectionCenterScreenNavigationProps = StackNavigationProp<RootStackParamList, 'NoCollectionCenterScreen'>;

interface NoCollectionCenterScreenProps {
  navigation: NoCollectionCenterScreenNavigationProps;
}

const NoCollectionCenterScreen: React.FC<NoCollectionCenterScreenProps> = ({ navigation }) => {
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Login');
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <View className="flex-1 bg-white justify-center items-center">
      {/* Error Text */}
      <View className="items-center mb-[25%]">
        <Text className="text-lg font-semibold  text-black-300">Error Found!</Text>
        <Text className="text-2xl font-bold text-black mt-2">
          No Collection Center
        </Text>
      </View>

      {/* Illustration */}
      <View className="w-full flex items-center justify-center">
        <Image
          source={require('../assets/images/noUser.png')}
          className="w-80 h-80"
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default NoCollectionCenterScreen;
