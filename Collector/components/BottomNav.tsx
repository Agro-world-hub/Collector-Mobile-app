import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';

const homeIcon = require('../assets/images/homee.png');
const searchIcon = require('../assets/images/searchh.png');
const qrIcon = require('../assets/images/target.png');

const BottomNav = ({ navigation, activeTab }: { navigation: any; activeTab: string }) => {
  const tabs = [
    { name: 'QRScanner', icon: qrIcon, focusedIcon: qrIcon },  // You can replace these with focused images if you have them
    { name: 'Dashboard', icon: homeIcon, focusedIcon: homeIcon }, 
    { name: 'SearchFarmer', icon: searchIcon, focusedIcon: searchIcon },
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
                : 'items-center justify-center' 
            }`}
            style={{
              backgroundColor: isFocused ? '#34D399' : 'transparent',
              padding: isFocused ? 8 : 6,
              borderRadius: 50, 
              borderWidth: isFocused ? 2 : 0, 
              borderColor: '#1A1920', 
              shadowColor: isFocused ? '#000' : 'transparent', 
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: isFocused ? 5 : 0, 
            }}
          >
          
            <Image
              source={isFocused ? tab.focusedIcon : tab.icon}
              style={{ width: 24, height: 24, resizeMode: 'contain' }} 
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomNav;

// import React from 'react';
// import { View, TouchableOpacity, Image } from 'react-native';

// // Paths to your PNG icons (place them in the appropriate assets folder)
// const homeIcon = require('../assets/images/homee.png');
// const searchIcon = require('../assets/images/searchh.png');
// const qrIcon = require('../assets/images/target.png');

// const BottomNav = ({ navigation, activeTab }: { navigation: any; activeTab: string }) => {
//   const tabs = [
//     { name: 'QRScanner', icon: qrIcon, focusedIcon: qrIcon }, // You can replace these with focused images if you have them
//     { name: 'Dashboard', icon: homeIcon, focusedIcon: homeIcon },
//     { name: 'SearchFarmer', icon: searchIcon, focusedIcon: searchIcon },
//   ];

//   return (
//     <View className="flex-row justify-between items-center bg-[#21202B] py-4 px-6 rounded-t-3xl w-full">
//       {tabs.map((tab, index) => {
//         const isFocused = activeTab === tab.name;

//         return (
//           <TouchableOpacity
//             key={index}
//             onPress={() => navigation.navigate(tab.name)}
//             className="flex-1 items-center justify-center" // Keep the layout consistent
            // style={{
            //   // Focus styling, but no position shift
            //   backgroundColor: isFocused ? '#34D399' : 'transparent',
            //   padding: isFocused ? 8 : 6, // Add some padding when focused
            //   borderRadius: 50, // Maintain rounded corners
            //   borderWidth: isFocused ? 2 : 0, // Only add border when focused
            //   borderColor: '#1A1920', // Border color for focused state
            //   shadowColor: isFocused ? '#000' : 'transparent', // Shadow for focused state
            //   shadowOpacity: 0.2,
            //   shadowRadius: 4,
            //   elevation: isFocused ? 5 : 0, // Shadow effect when focused (for Android)
            // }}
//           >
//             <Image
//               source={isFocused ? tab.focusedIcon : tab.icon}
//               style={{
//                 width: 24, // Keep the width consistent
//                 height: 24, // Keep the height consistent
//                 resizeMode: 'contain', // Ensure images maintain aspect ratio
//               }}
//             />
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// };

// export default BottomNav;
