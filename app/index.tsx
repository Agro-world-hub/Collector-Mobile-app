// import React,{ useEffect } from 'react'
// import { View, Text } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Splash from '@/components/Splash';
// import Login from '@/components/Login';
// import ChangePassword from '@/components/ChangePassword';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import Registeredfarmer from '@/components/Registeredfarmer';
// import Ufarmercropdetails from '@/components/Ufarmercropdetails';
// import Dashboard from '@/components/Dashboard';
// import QRScanner from '@/components/QRScanner';
// import FormScreen from '@/components/FormScreen';
// import EngProfile from '@/components/EngProfile';
// import UnregisteredFarmerDetails from '@/components/UnregisteredFarmerDetails';
// import UnregisteredCropDetails from '@/components/UnregisteredCropDetails';
// import SinChangePassword from '@/components/Sinhala/SinChangePassword';
// import SinLogin from '@/components/Sinhala/SinLogin';
// import Lanuage from '@/components/Lanuage';
// import SinDashboard from '@/components/Sinhala/SinDashboard';
// import SinUfarmercropdetails from '@/components/Sinhala/SinUfarmercropdetails';
// import SinUnregisteredFarmerDetails from '@/components/Sinhala/SinUnregisteredFarmerDetails';
// import SinRegisteredfarmer from '@/components/Sinhala/SinRegisteredfarmer';
// import SinUnregisteredCropDetails from '@/components/Sinhala/SinUnregisteredCropDetails';
// import TamChangePassword from '@/components/Tamil/TamChangePassword';
// import TamLogin from '@/components/Tamil/TamLogin';
// import TamDashboard from '@/components/Tamil/TamDashboard';
// import TamRegisteredfarmer from '@/components/Tamil/TamRegisteredFarmer';
// import TamUfarmercropdetails from '@/components/Tamil/TamUfarmercropdetails';
// import TamUnregisteredFarmerDetails from '@/components/Tamil/TamUnregisteredFarmerDetails';
// import TamUnregisteredCropDetails from '@/components/Tamil/TamUnregisteredCropdetails';
// import SinProfile from '@/components/Sinhala/SinProfile';
// import TamProfile from '@/components/Tamil/TamProfile';
// import SearchFarmer from '@/components/SearchFarmer';
// import FarmerQr from '@/components/FarmerQr';
// import ComplainPage from '@/components/ComplainPage';
// import OfficerQr from '@/components/OfficerQr';
// import Profile from '@/components/Profile';
// import * as ScreenCapture from 'expo-screen-capture';
// import ReportPage from '@/components/ReportPage';
// import SearchPriceScreen from '@/components/SearchPriceScreen';
// import PriceChart from '@/components/PriceChart';
// import { LanguageProvider } from '@/context/LanguageContext';

// const Stack = createNativeStackNavigator(); // Create Stack navigator instance
// const index = () => {

//     // Prevent screenshots and screen recording
//     // ScreenCapture.usePreventScreenCapture()

//   return (
//     <LanguageProvider>
//     <GestureHandlerRootView style={{ flex: 1 }}>
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Splash" component={Splash} />
//       <Stack.Screen name="Login" component={Login} />
//       <Stack.Screen name="ChangePassword" component={ChangePassword as any}/>
//       <Stack.Screen name="Registeredfarmer" component={Registeredfarmer}/>
//       <Stack.Screen name="Ufarmercropdetails" component={Ufarmercropdetails}/>
//       <Stack.Screen name="Dashboard" component={Dashboard} />
//       <Stack.Screen name="QRScanner" component={QRScanner} />
//       <Stack.Screen name="FormScreen" component={FormScreen} />
//       <Stack.Screen name="EngProfile" component={EngProfile} />
//       <Stack.Screen name="UnregisteredFarmerDetails" component={UnregisteredFarmerDetails} />
//       <Stack.Screen name="UnregisteredCropDetails" component={UnregisteredCropDetails as any} />
//       <Stack.Screen name="SinChangePassword" component={SinChangePassword} />
//       <Stack.Screen name="SinLogin" component={SinLogin} />
//       <Stack.Screen name="Lanuage" component={Lanuage} />
//       <Stack.Screen name="SinDashboard" component={SinDashboard} />
//       <Stack.Screen name="SinUfarmercropdetails" component={SinUfarmercropdetails} />
//       <Stack.Screen name="SinUnregisteredFarmerDetails" component={SinUnregisteredFarmerDetails} />
//       <Stack.Screen name="SinRegisteredfarmer" component={SinRegisteredfarmer} />
//       <Stack.Screen name="SinUnregisteredCropDetails" component={SinUnregisteredCropDetails as any} />
//       <Stack.Screen name="TamChangePassword" component={TamChangePassword} />
//       <Stack.Screen name="TamLogin" component={TamLogin} />
//       <Stack.Screen name="TamDashboard" component={TamDashboard} />
//       <Stack.Screen name="TamRegisteredfarmer" component={TamRegisteredfarmer} />
//       <Stack.Screen name="TamUfarmercropdetails" component={TamUfarmercropdetails} />
//       <Stack.Screen name="TamUnregisteredFarmerDetails" component={TamUnregisteredFarmerDetails} />
//       <Stack.Screen name="TamUnregisteredCropDetails" component={TamUnregisteredCropDetails as any} />
//       <Stack.Screen name="SinProfile" component={SinProfile} />
//       <Stack.Screen name="TamProfile" component={TamProfile} />
//       <Stack.Screen name="SearchFarmer" component={SearchFarmer} />
//       <Stack.Screen name="FarmerQr" component={FarmerQr} />
//       <Stack.Screen name="OfficerQr" component={OfficerQr} />
//       <Stack.Screen name="ComplainPage" component={ComplainPage} />
//       <Stack.Screen name="Profile" component={Profile} />
//       <Stack.Screen name="ReportPage" component={ReportPage} />
//       <Stack.Screen name="SearchPriceScreen" component={SearchPriceScreen} />
//       <Stack.Screen name="PriceChart" component={PriceChart as any}/>

//     </Stack.Navigator>
//    </GestureHandlerRootView>
//     </LanguageProvider>
//   )
// }

// export default index

import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Dimensions , StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeWindStyleSheet } from "nativewind";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Splash from "@/components/Splash";
import Login from "@/components/Login";
import ChangePassword from "@/components/ChangePassword";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Registeredfarmer from "@/components/Registeredfarmer";
import Ufarmercropdetails from "@/components/Ufarmercropdetails";
import Dashboard from "@/components/Dashboard";
import QRScanner from "@/components/QRScanner";
import FormScreen from "@/components/FormScreen";
import EngProfile from "@/components/EngProfile";
import UnregisteredFarmerDetails from "@/components/UnregisteredFarmerDetails";
import UnregisteredCropDetails from "@/components/UnregisteredCropDetails";
import SinChangePassword from "@/components/Sinhala/SinChangePassword";
import SinLogin from "@/components/Sinhala/SinLogin";
import Lanuage from "@/components/Lanuage";
import SinDashboard from "@/components/Sinhala/SinDashboard";
import SinUfarmercropdetails from "@/components/Sinhala/SinUfarmercropdetails";
import SinUnregisteredFarmerDetails from "@/components/Sinhala/SinUnregisteredFarmerDetails";
import SinRegisteredfarmer from "@/components/Sinhala/SinRegisteredfarmer";
import SinUnregisteredCropDetails from "@/components/Sinhala/SinUnregisteredCropDetails";
import TamChangePassword from "@/components/Tamil/TamChangePassword";
import TamLogin from "@/components/Tamil/TamLogin";
import TamDashboard from "@/components/Tamil/TamDashboard";
import TamRegisteredfarmer from "@/components/Tamil/TamRegisteredFarmer";
import TamUfarmercropdetails from "@/components/Tamil/TamUfarmercropdetails";
import TamUnregisteredFarmerDetails from "@/components/Tamil/TamUnregisteredFarmerDetails";
import TamUnregisteredCropDetails from "@/components/Tamil/TamUnregisteredCropdetails";
import SinProfile from "@/components/Sinhala/SinProfile";
import TamProfile from "@/components/Tamil/TamProfile";
import SearchFarmer from "@/components/SearchFarmer";
import FarmerQr from "@/components/FarmerQr";
import ComplainPage from "@/components/ComplainPage";
import OfficerQr from "@/components/OfficerQr";
import Profile from "@/components/Profile";
import * as ScreenCapture from "expo-screen-capture";
import ReportPage from "@/components/ReportPage";
import SearchPriceScreen from "@/components/SearchPriceScreen";
import PriceChart from "@/components/PriceChart";
import { LanguageProvider } from "@/context/LanguageContext";

import Ionicons from "react-native-vector-icons/Ionicons";
import BottomNav from "@/components/BottomNav";
import CollectionOfficersList from "@/components/ManagerScreens/CollectionOfficersList";
import OfficerSummary from "@/components/ManagerScreens/OfficerSummary";
import ReportGenerator from "@/components/ManagerScreens/ReportGenerator";
import ComplainHistory from "@/components/ComplainHistory";
import DailyTargetList from "@/components/DailyTargetList";
import AddOfficerBasicDetails from "@/components/ManagerScreens/AddOfficerBasicDetails";
import AddOfficerAddressDetails from "@/components/ManagerScreens/AddOfficerAddressDetails";
import ClaimOfficer from "@/components/ManagerScreens/ClaimOfficer";
import TransactionList from "@/components/ManagerScreens/TransactionList";
import FarmerReport from "@/components/ManagerScreens/FarmerReport";
import SetTargetScreen from "@/components/ManagerScreens/SetTargetScreen";
import DailyTarget from "@/components/ManagerScreens/DailyTarget";
import TargetValidPeriod from "@/components/ManagerScreens/TargetValidPeriod";
import NoCollectionCenterScreen from "@/components/NoCollectionCenterScreen ";
import environment from "@/environment/environment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import EditTargetScreen from "@/components/ManagerScreens/EditTargetScreen";
import PassTargetScreen from "@/components/ManagerScreens/PassTargetScreen";
import RecieveTargetScreen from "@/components/ManagerScreens/RecieveTargetScreen";
import DailyTargetListForOfficers from "@/components/ManagerScreens/DailyTargetListForOfficers";
import EditTargetManager from "@/components/ManagerScreens/EditTargetManager";
import RecieveTargetBetweenOfficers from "@/components/ManagerScreens/RecieveTargetBetweenOfficers";
import PassTargetBetweenOfficers from "@/components/ManagerScreens/PassTargetBetweenOfficers";
import OTPE from "@/components/Otpverification";
import io from "socket.io-client";
import { AppState } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import * as Network from "expo-network";
import ManagerDashboard from "@/components/ManagerScreens/ManagerDashboard";
import CenterTarget from "@/components/ManagerScreens/CenterTarget";
import ManagerTransactions from "@/components/ManagerScreens/ManagerTransactions";
// import socket from "@/services/socket";
NativeWindStyleSheet.setOutput({
  default: "native",
});

(Text as any).defaultProps = {
  ...(Text as any).defaultProps,
  allowFontScaling: false,
};

(TextInput as any).defaultProps = {
  ...(TextInput as any).defaultProps,
  allowFontScaling: false,
};


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const windowDimensions = Dimensions.get("window");

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { display: "none" },
        headerShown: false, // Hides the default tab bar
      })}
      tabBar={(props) => <BottomNav {...props} />}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="SearchPriceScreen" component={SearchPriceScreen} />
      <Tab.Screen name="QRScanner" component={QRScanner} />
      <Tab.Screen name="PriceChart" component={PriceChart as any} />
      <Tab.Screen
        name="UnregisteredCropDetails"
        component={UnregisteredCropDetails as any}
      />
      <Tab.Screen name="SearchFarmer" component={SearchFarmer} />
      <Tab.Screen name="ManagerDashboard" component={ManagerDashboard} />
      <Stack.Screen name="DailyTargetList" component={DailyTargetList} />
      <Stack.Screen
        name="CollectionOfficersList"
        component={CollectionOfficersList}
      />
      <Stack.Screen name="DailyTarget" component={DailyTarget as any} />
      <Stack.Screen
        name="PassTargetScreen"
        component={PassTargetScreen as any}
      />
      <Stack.Screen
        name="RecieveTargetScreen"
        component={RecieveTargetScreen as any}
      />
      <Stack.Screen name="ComplainHistory" component={ComplainHistory} />
      <Stack.Screen
        name="EditTargetManager"
        component={EditTargetManager as any}
      />
      <Stack.Screen name="TransactionList" component={TransactionList as any} />
      <Stack.Screen name="OfficerSummary" component={OfficerSummary as any} />
    </Tab.Navigator>
  );
}

const index = () => {
  const navigation = useNavigation();
  // Prevent screenshots and screen recording
  // ScreenCapture.usePreventScreenCapture();

  // const [appState, setAppState] = useState(AppState.currentState); // Track app state
  // const [empId, setEmpId] = useState<string | null>(null); // Store empId
  // const navigation = useNavigation(); // Use the navigation hook

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
  // useEffect(() => {
  //   setupSocketListeners();

  //   // Clean up on unmount
  //   return () => {
  //     cleanupSocketListeners();
  //   };
  // }, []);

  // const setupSocketListeners = () => {
  //   if (socket.listeners('connect').length === 0) {
  //     socket.on('connect', async () => {
  //       console.log('Socket connected with ID:', socket.id);
  //       // Re-emit login event on reconnection
  //       try {
  //         const storedEmpId = await AsyncStorage.getItem('empid');
  //         if (storedEmpId) {
  //           socket.emit('login', { empId: storedEmpId });
  //           console.log('Reconnected and sent login for empId:', storedEmpId);
  //         }
  //       } catch (error) {
  //         console.error('Error getting stored empId:', error);
  //       }
  //     });

  //     socket.on('disconnect', () => {
  //       console.log('Socket disconnected');
  //     });

  //     socket.on('loginSuccess', (data) => {
  //       console.log('Login success:', data);
  //     });

  //     socket.on('loginError', (error) => {
  //       console.error('Socket login error:', error);
  //     });

  //     socket.on('employeeOnline', (data) => {
  //       console.log('Employee online:', data.empId);
  //       // Update your UI to show employee is online
  //     });

  //     socket.on('employeeOffline', (data) => {
  //       console.log('Employee offline:', data.empId);
  //       // Update your UI to show employee is offline
  //     });

  //     // Set up AppState listener for background/foreground transitions
  //     AppState.addEventListener('change', async (nextAppState) => {
  //       if (nextAppState === 'active') {
  //         // App came to foreground
  //         if (!socket.connected) {
  //           socket.connect();
  //           try {
  //             const storedEmpId = await AsyncStorage.getItem('empid');
  //             if (storedEmpId) {
  //               socket.emit('login', { empId: storedEmpId });
  //               console.log('App active, sent login for empId:', storedEmpId);
  //             }
  //           } catch (error) {
  //             console.error('Error getting stored empId:', error);
  //           }
  //         }
  //       } else if (nextAppState === 'background' || nextAppState === 'inactive') {
  //         // Option 1: Maintain connection in background (do nothing)

  //         // Option 2: Disconnect when app goes to background
  //         console.log('App went to background, disconnecting socket');
  //         socket.disconnect();
  //       }
  //     });
  //   }
  // };

  // const cleanupSocketListeners = () => {
  //   socket.off('connect');
  //   socket.off('disconnect');
  //   socket.off('loginSuccess');
  //   socket.off('loginError');
  //   socket.off('employeeOnline');
  //   socket.off('employeeOffline');
  // };

  useEffect(() => {
    onlineStatus();
  }, []);

  const onlineStatus = async () => {
    AppState.addEventListener("change", async (nextAppState) => {
      console.log("App state changed toooolllllll:", nextAppState);
      const storedEmpId = await AsyncStorage.getItem("empid");

      if (nextAppState === "active") {
        if (storedEmpId) {
          await status(storedEmpId, true);
        }
      } else if (nextAppState === "background") {
        console.log("App went to background, disconnecting socketssssss");
        if (storedEmpId) {
          await status(storedEmpId, false);
        }
      }
    });
  };

  const status = async (empId: string, status: boolean) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("Token not found");
        return;
      }

      const response = await fetch(
        `${environment.API_BASE_URL}api/collection-officer/online-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add token in Authorization header
          },
          body: JSON.stringify({
            empId: empId, // Use the passed empId
            status: status, // Use the passed status
          }),
        }
      );
    } catch (error) {
      console.error("Online status error:", error);
    }
  };

  return (
    <LanguageProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: false, // Disable swipe gestures globally
          }}
        >
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePassword as any}
          />
          <Stack.Screen name="Registeredfarmer" component={Registeredfarmer} />
          <Stack.Screen
            name="Ufarmercropdetails"
            component={Ufarmercropdetails}
          />
          {/* <Stack.Screen name="Dashboard" component={Dashboard} /> */}
          {/* <Stack.Screen name="QRScanner" component={QRScanner} /> */}
          <Stack.Screen name="FormScreen" component={FormScreen} />
          <Stack.Screen name="EngProfile" component={EngProfile} />
          <Stack.Screen
            name="UnregisteredFarmerDetails"
            component={UnregisteredFarmerDetails}
          />
          {/* <Stack.Screen name="UnregisteredCropDetails" component={UnregisteredCropDetails as any} /> */}
          <Stack.Screen
            name="SinChangePassword"
            component={SinChangePassword}
          />
          <Stack.Screen name="SinLogin" component={SinLogin} />
          <Stack.Screen name="Lanuage" component={Lanuage} />
          <Stack.Screen name="SinDashboard" component={SinDashboard} />
          <Stack.Screen
            name="SinUfarmercropdetails"
            component={SinUfarmercropdetails}
          />
          <Stack.Screen
            name="SinUnregisteredFarmerDetails"
            component={SinUnregisteredFarmerDetails}
          />
          <Stack.Screen
            name="SinRegisteredfarmer"
            component={SinRegisteredfarmer}
          />
          <Stack.Screen
            name="SinUnregisteredCropDetails"
            component={SinUnregisteredCropDetails as any}
          />
          <Stack.Screen
            name="TamChangePassword"
            component={TamChangePassword}
          />
          <Stack.Screen name="TamLogin" component={TamLogin} />
          <Stack.Screen name="TamDashboard" component={TamDashboard} />
          <Stack.Screen
            name="TamRegisteredfarmer"
            component={TamRegisteredfarmer}
          />
          <Stack.Screen
            name="TamUfarmercropdetails"
            component={TamUfarmercropdetails}
          />
          <Stack.Screen
            name="TamUnregisteredFarmerDetails"
            component={TamUnregisteredFarmerDetails}
          />
          <Stack.Screen
            name="TamUnregisteredCropDetails"
            component={TamUnregisteredCropDetails as any}
          />
          <Stack.Screen name="SinProfile" component={SinProfile} />
          <Stack.Screen name="TamProfile" component={TamProfile} />
          {/* <Stack.Screen name="SearchFarmer" component={SearchFarmer} /> */}
          <Stack.Screen name="FarmerQr" component={FarmerQr} />
          <Stack.Screen name="OfficerQr" component={OfficerQr} />
          <Stack.Screen name="ComplainPage" component={ComplainPage} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="ReportPage" component={ReportPage} />
          {/* <Stack.Screen name="SearchPriceScreen" component={SearchPriceScreen} />  */}
          {/* <Stack.Screen name="PriceChart" component={PriceChart as any}/> */}
          {/* <Stack.Screen name="CollectionOfficersList" component={CollectionOfficersList }/> */}
          {/* <Stack.Screen name="OfficerSummary" component={OfficerSummary as any} /> */}
          <Stack.Screen
            name="ReportGenerator"
            component={ReportGenerator as any}
          />
          {/* <Stack.Screen name="DailyTargetList" component={DailyTargetList} /> */}
          <Stack.Screen
            name="AddOfficerBasicDetails"
            component={AddOfficerBasicDetails}
          />
          <Stack.Screen
            name="AddOfficerAddressDetails"
            component={AddOfficerAddressDetails}
          />
          <Stack.Screen name="ClaimOfficer" component={ClaimOfficer} />
          {/* <Stack.Screen name="TransactionList" component={TransactionList as any} /> */}
          <Stack.Screen name="OTPE" component={OTPE} />
          <Stack.Screen name="FarmerReport" component={FarmerReport as any} />
          <Stack.Screen
            name="EditTargetScreen"
            component={EditTargetScreen as any}
          />
          {/* <Stack.Screen name="DailyTarget" component={DailyTarget as any} /> */}
          {/* <Stack.Screen name="PassTargetScreen" component={PassTargetScreen as any} />  */}
          <Stack.Screen
            name="NoCollectionCenterScreen"
            component={NoCollectionCenterScreen}
          />
          {/* <Stack.Screen name="RecieveTargetScreen" component={RecieveTargetScreen as any} /> */}
          <Stack.Screen
            name="DailyTargetListForOfficers"
            component={DailyTargetListForOfficers as any}
          />
          <Stack.Screen
            name="PassTargetBetweenOfficers"
            component={PassTargetBetweenOfficers as any}
          />
          <Stack.Screen
            name="RecieveTargetBetweenOfficers"
            component={RecieveTargetBetweenOfficers as any}
          />
          <Stack.Screen name="CenterTarget" component={CenterTarget as any} />
          <Stack.Screen
            name="ManagerTransactions"
            component={ManagerTransactions as any}
          />

          {/* <Stack.Screen name="EditTargetManager" component={EditTargetManager as any} /> */}
          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </GestureHandlerRootView>
    </LanguageProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: windowDimensions.width * 0.05, // 5% padding
    paddingVertical: windowDimensions.height * 0.02, // 2% padding
  },
  header: {
    fontSize: windowDimensions.width * 0.05, // 5% of screen width for font size
  },
});

export default index;
