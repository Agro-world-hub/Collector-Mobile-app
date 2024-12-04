import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';

// Paths to your PNG icons (place them in the appropriate assets folder)
const homeIcon = require('../assets/images/homee.png');
const searchIcon = require('../assets/images/searchh.png');
const qrIcon = require('../assets/images/target.png');

const BottomNav = ({ navigation, activeTab }: { navigation: any; activeTab: string }) => {
  const tabs = [
    { name: 'QRScanner', icon: qrIcon, focusedIcon: qrIcon },  // You can replace these with focused images if you have them
    { name: 'Dashboard', icon: homeIcon, focusedIcon: homeIcon }, 
    { name: 'SearchPriceScreen', icon: searchIcon, focusedIcon: searchIcon },
  ];

  return (
    <View className="flex-row justify-between items-center bg-[#21202B] py-4 px-6 rounded-t-3xl w-full">
      {tabs.map((tab, index) => {
        const isFocused = activeTab === tab.name;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(tab.name)}
            className={`${
              isFocused
                ? 'bg-green-500 p-4 rounded-full -mt-6 border-4 border-[#1A1920] shadow-md' 
                : 'flex-1 flex items-center justify-center' 
            }`}
          >
          
            <Image
              source={isFocused ? tab.focusedIcon : tab.icon}
              style={{ width: 24, height: 24, resizeMode: 'contain' }} // Adjust size and resizeMode as needed
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNav;
