import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';

const NavBar: React.FC = () => {
  const [selectedNav, setSelectedNav] = useState<string | null>(null);

  return (
    <View className="flex-row justify-around items-center py-4 border-t border-gray-300 h-16">
      <TouchableOpacity
        onPress={() => setSelectedNav('first')}
        style={{ transform: [{ scale: selectedNav === 'first' ? 1.5 : 1 }] }}
      >
        <Image
          source={require('../assets/images/first-image.png')}
          style={{ width: 35, height: 35 }}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setSelectedNav('second')}
        style={{ transform: [{ scale: selectedNav === 'second' ? 1.5 : 1 }] }}
      >
        <Image
          source={require('../assets/images/second-image.png')}
          style={{ width: 35, height: 35 }}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setSelectedNav('third')}
        style={{ transform: [{ scale: selectedNav === 'third' ? 1.5 : 1 }] }}
      >
        <Image
          source={require('../assets/images/third-image.png')}
          style={{ width: 35, height: 35 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default NavBar;
