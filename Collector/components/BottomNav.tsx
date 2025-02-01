// import React from 'react';
// import { View, TouchableOpacity, Image } from 'react-native';

// const homeIcon = require('../assets/images/homee.png');
// const searchIcon = require('../assets/images/searchh.png');
// const qrIcon = require('../assets/images/target.png');

// const BottomNav = ({ navigation, activeTab }: { navigation: any; activeTab: string }) => {
//   const tabs = [
//     { name: 'QRScanner', icon: qrIcon, focusedIcon: qrIcon },  // You can replace these with focused images if you have them
//     { name: 'Dashboard', icon: homeIcon, focusedIcon: homeIcon }, 
//     { name: 'SearchPriceScreen', icon: searchIcon, focusedIcon: searchIcon },
//   ];

//   return (
//     <View className="flex-row justify-between items-center bg-[#21202B] py-4 px-6 rounded-t-3xl w-full">
//       {tabs.map((tab, index) => {
//         const isFocused = activeTab === tab.name;

//         return (
//           <TouchableOpacity
//             key={index}
//             onPress={() => navigation.navigate(tab.name)}
            // className={`${
            //   isFocused
            //     ? 'bg-green-500 p-4 rounded-full -mt-6 border-4 border-[#1A1920] shadow-md' 
            //     : 'items-center justify-center' 
            // }`}
            // style={{
            //   backgroundColor: isFocused ? '#34D399' : 'transparent',
            //   padding: isFocused ? 8 : 6,
            //   borderRadius: 50, 
            //   borderWidth: isFocused ? 2 : 0, 
            //   borderColor: '#1A1920', 
            //   shadowColor: isFocused ? '#000' : 'transparent', 
            //   shadowOpacity: 0.2,
            //   shadowRadius: 4,
            //   elevation: isFocused ? 5 : 0, 
            // }}
//           >
          
//             <Image
//               source={isFocused ? tab.focusedIcon : tab.icon}
//               style={{ width: 24, height: 24, resizeMode: 'contain' }} 
//             />
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// };

// export default BottomNav;

import React, {useState, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import { View, TouchableOpacity, Image,  Animated, Keyboard  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import environment from '@/environment/environment';
import { AppState } from 'react-native';

const homeIcon = require('../assets/images/homee.png');
const searchIcon = require('../assets/images/searchh.png');
const qrIcon = require('../assets/images/target.png');
const adminIcon = require('../assets/images/People.png');

const BottomNav = ({ navigation, state }: { navigation: any; state: any }) => {
  let tabs = [
    { name: 'DailyTargetList', icon: qrIcon, focusedIcon: qrIcon },
    { name: 'Dashboard', icon: homeIcon, focusedIcon: homeIcon },
    { name: 'SearchPriceScreen', icon: searchIcon, focusedIcon: searchIcon },
  ];
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem('jobRole');
        setUserRole(role);
        console.log('User role:', role);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);
  
  
  useEffect(() => {
    const checkClaimStatus = async () => {
      try {
        // const userId = await AsyncStorage.getItem('userId');
        // if (!userId) {
        //   console.error('User ID is missing from AsyncStorage');
        //   navigation.navigate('Login');
        //   return;
        // }

        const response = await axios.get(`${environment.API_BASE_URL}api/collection-officer/get-claim-status`, {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
          },
        });

        if (response.data.claimStatus === 0) {
          navigation.navigate('NoCollectionCenterScreen');
        }
      } catch (error) {
        console.error('Error checking claim status:', error);
        navigation.navigate('Login');
      }
    };

    checkClaimStatus();
  }, [navigation]);

  // Get the name of the currently focused tab from the state
  let currentTabName = state.routes[state.index]?.name;
  console.log('Current tab:', currentTabName);
  if (currentTabName === 'PriceChart') {
    currentTabName = 'SearchPriceScreen';
  }
  
  // if (userRole === 'Collection Center Manager') {
  //   tabs.push({
  //     name: 'AdminPanel',
  //     icon: adminIcon,
  //     focusedIcon: adminIcon,
  //   });
  // }

  if (userRole === "Collection Center Manager") {
    tabs = [
      { name: "Dashboard", icon: homeIcon, focusedIcon: homeIcon },
      { name: "DailyTarget", icon: qrIcon, focusedIcon: qrIcon },
      { name: "SearchPriceScreen", icon: searchIcon, focusedIcon: searchIcon },
      { name: "CollectionOfficersList", icon: adminIcon, focusedIcon: adminIcon },
    ];
  }


  const [appState, setAppState] = useState(AppState.currentState);
  interface UserData {
    token: string;
  }
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const checkUserStatus = async (status: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        console.log('User authenticated:', { token });

        // Send user status update to the server
        try {
          const response = await axios.post(
            `${environment.API_BASE_URL}api/collection-officer/update-officer-status`,
            {
              status: status,  // Set status value to 0 (offline)
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log(response.data.message);
        } catch (error) {
          console.error('Error emitting event:', error);
        }
      } else {
        console.log('User not authenticated');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', (nextAppState) => {
      console.log('App state changed:', nextAppState);
      setAppState(nextAppState);

      if (nextAppState === 'active') {
        checkUserStatus(1);
      } else if (nextAppState === 'background') {
        // App went to the background: Set user as offline
        checkUserStatus(0);
      }
    });

    // Cleanup listener when component is unmounted
    return () => {
      appStateListener.remove();
    };
  }, [userData]);

  const [connectionStatus, setConnectionStatus] = useState('connected'); // track connection status

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const previousStatus = connectionStatus;
      const currentStatus = state.isConnected ? 'connected' : 'disconnected';

      console.log('Connection status:', currentStatus);
      setConnectionStatus(currentStatus);

      // If status is changing to 'disconnected', perform an action
      if (previousStatus === 'connected' && currentStatus === 'disconnected') {
        checkUserStatus(0);
      }
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, [connectionStatus]);
  


  if (isKeyboardVisible) return null;
  return (
    <View className="flex-row  justify-between items-center bg-[#21202B] py-3 px-6 rounded-t-3xl w-full">
      {tabs.map((tab, index) => {
        // Check if the current tab is focused
        const isFocused = currentTabName === tab.name;
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
