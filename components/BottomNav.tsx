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
import  socket  from '@/services/socket';
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
      { name: "ManagerDashboard", icon: homeIcon, focusedIcon: homeIcon },
      { name: "DailyTarget", icon: qrIcon, focusedIcon: qrIcon },
      
      { name: "CollectionOfficersList", icon: adminIcon, focusedIcon: adminIcon },
      { name: "SearchPriceScreen", icon: searchIcon, focusedIcon: searchIcon },
    ];
  }
  useEffect(() => {
    // Check the userRole and manually navigate if needed
    if (userRole === "Collection Center Manager" && currentTabName == "Dashboard") {
      navigation.navigate("ManagerDashboard");
    }
  }, [userRole, currentTabName, navigation]);


  // const [appState, setAppState] = useState(AppState.currentState);
  // interface UserData {
  //   token: string;
  // }
  
  // const [userData, setUserData] = useState<UserData | null>(null);
  // const checkUserStatus = async (status: number) => {
  //   try {
  //     const token = await AsyncStorage.getItem('token');
  //     if (token) {
  //       console.log('User authenticated:', { token });

  //       // Send user status update to the server
  //       try {
  //         const response = await axios.post(
  //           `${environment.API_BASE_URL}api/collection-officer/update-officer-status`,
  //           {
  //             status: status,  // Set status value to 0 (offline)
  //           },
  //           {
  //             headers: { Authorization: `Bearer ${token}` },
  //           }
  //         );
  //         console.log(response.data.message);
  //       } catch (error) {
  //         console.error('Error emitting event:', error);
  //       }
  //     } else {
  //       console.log('User not authenticated');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user data:', error);
  //   }
  // };

  // useEffect(() => {
  //   const appStateListener = AppState.addEventListener('change', (nextAppState) => {
  //     console.log('App state changed:', nextAppState);
  //     setAppState(nextAppState);

  //     if (nextAppState === 'active') {
  //       checkUserStatus(1);
  //     } else if (nextAppState === 'background') {
  //       // App went to the background: Set user as offline
  //       checkUserStatus(0);
  //     }
  //   });

  //   // Cleanup listener when component is unmounted
  //   return () => {
  //     appStateListener.remove();
  //   };
  // }, [userData]);

  // const [connectionStatus, setConnectionStatus] = useState('connected'); // track connection status

  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener((state) => {
  //     const previousStatus = connectionStatus;
  //     const currentStatus = state.isConnected ? 'connected' : 'disconnected';

  //     console.log('Connection status:', currentStatus);
  //     setConnectionStatus(currentStatus);

  //     // If status is changing to 'disconnected', perform an action
  //     if (previousStatus === 'connected' && currentStatus === 'disconnected') {
  //       checkUserStatus(0);
  //     }
  //   });

  //   // Cleanup on unmount
  //   return () => unsubscribe();
  // }, [connectionStatus]);
  
  
    // const [appState, setAppState] = useState(AppState.currentState); // Track app state
    // const [empId, setEmpId] = useState<string | null>(null); // Store empId

    
    // useEffect(() => {
    //   // Fetch empId from AsyncStorage when the component mounts
    //   const getEmpIdFromStorage = async () => {
    //     try {
    //       const storedEmpId = await AsyncStorage.getItem("empid");
    //       if (storedEmpId) {
    //         setEmpId(storedEmpId);
    //       } else {
    //         // Navigate to login screen if empId is not found
    //         console.log("empId not found, navigating to login.");
    //         navigation.navigate('Login' as never); // Navigate to Login screen
    //       }
    //     } catch (error) {
    //       console.error("Failed to fetch empId from AsyncStorage:", error);
    //       navigation.navigate('Login' as never); // Navigate to Login if there's an error fetching empId
    //     }
    //   };
    
    //   getEmpIdFromStorage();
    
    //   // Listen for app state changes
    //   const appStateListener = AppState.addEventListener("change", (nextAppState) => {
    //     if (nextAppState === "background" || nextAppState === "inactive") {
    //       // If the app goes to background or inactive, disconnect the socket
    //       if (empId && socket) {
    //         console.log(`App went to background or inactive, disconnecting socket for empId ${empId}`);
    //         socket.disconnect(); // This automatically handles the disconnect
    //       }
    //     }
    //     setAppState(nextAppState); // Update app state
    //   });
    
    //   // Cleanup appState listener when the component is unmounted
    //   return () => {
    //     appStateListener.remove();
    //   };
    // }, [empId, navigation]); // Only run this effect when empId changes
    
    // // Handle socket disconnection
    // useEffect(() => {
    //   if (socket) {
    //     socket.on("disconnect", () => {
    //       console.log("Socket disconnected");
    //       // Additional logic for handling disconnection can be added here
    //     });
        
    //     // Cleanup function for socket disconnection
    //     return () => {
    //       console.log("Cleaning up socket connection");
    //       socket.disconnect();
    //     };
    //   }
    // }, [socket]); // Only run when socket is available
    
    
    
    
// Setup socket listeners on component mount
useEffect(() => {
  setupSocketListeners();
  
  // Clean up on unmount
  return () => {
    cleanupSocketListeners();
  };
}, []);

const setupSocketListeners = () => {
  if (socket.listeners('connect').length === 0) {
    socket.on('connect', async () => {
      console.log('Socket connected with ID:', socket.id);
      // Re-emit login event on reconnection
      try {
        const storedEmpId = await AsyncStorage.getItem('empid');
        if (storedEmpId) {
          socket.emit('login', { empId: storedEmpId });
          console.log('Reconnected and sent login for empId:', storedEmpId);
        }
      } catch (error) {
        console.error('Error getting stored empId:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('loginSuccess', (data) => {
      console.log('Login success:', data);
    });

    socket.on('loginError', (error) => {
      console.error('Socket login error:', error);
    });

    socket.on('employeeOnline', (data) => {
      console.log('Employee online:', data.empId);
      // Update your UI to show employee is online
    });

    socket.on('employeeOffline', (data) => {
      console.log('Employee offline:', data.empId);
      // Update your UI to show employee is offline
    });

    // Set up AppState listener for background/foreground transitions
    AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        // App came to foreground
        if (!socket.connected) {
          socket.connect();
          try {
            const storedEmpId = await AsyncStorage.getItem('empid');
            if (storedEmpId) {
              socket.emit('login', { empId: storedEmpId });
              console.log('App active, sent login for empId:', storedEmpId);
            }
          } catch (error) {
            console.error('Error getting stored empId:', error);
          }
        }
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        // Option 1: Maintain connection in background (do nothing)
        
        // Option 2: Disconnect when app goes to background
        console.log('App went to background, disconnecting socket');
        socket.disconnect();
      }
    });
  }
};


const cleanupSocketListeners = () => {
  socket.off('connect');
  socket.off('disconnect');
  socket.off('loginSuccess');
  socket.off('loginError');
  socket.off('employeeOnline');
  socket.off('employeeOffline');
};

  if (isKeyboardVisible) return null;
  return (
    <View className='bg-white'>
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
    </View>
  );
};

export default BottomNav;
