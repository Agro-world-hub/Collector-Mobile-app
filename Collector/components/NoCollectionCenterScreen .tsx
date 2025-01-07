import React from 'react';
import { View, Text, Image } from 'react-native';

const NoCollectionCenterScreen = () => {
  return (
    <View className="flex-1 bg-black justify-center items-center">
      {/* Error Text */}
      <View className="items-center mb-4">
        <Text className="text-lg font-bold text-gray-300">Error Found!</Text>
        <Text className="text-2xl font-semibold text-white mt-2">
          No Collection Center
        </Text>
      </View>

      {/* Illustration */}
      <View className="w-full flex items-center justify-center">
        <Image
          source={{
            uri: require('../assets/images/noUser.png'), 
          }}
          className="w-80 h-80"
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default NoCollectionCenterScreen;
