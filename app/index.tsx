import React, {useEffect} from "react";
import { Text, TextInput, Platform, Dimensions, StyleSheet } from "react-native";
import Splash from "../component/Splash";
import Lanuage from "../component/Lanuage";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from "@/component/Login";



import { NativeWindStyleSheet } from "nativewind";
import { LanguageProvider } from "@/context/LanguageContext";

import { LogBox } from 'react-native';

import NavigationBar from "@/component/BottomNav";

import { useNavigation } from "@react-navigation/native";
import { BackHandler } from "react-native";
import ChangePassword from "@/component/ChangePassword";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Registeredfarmer from "@/component/Registeredfarmer";
import Ufarmercropdetails from "@/component/Ufarmercropdetails";
import Dashboard from "@/component/Dashboard";
import QRScanner from "@/component/QRScanner";
import FormScreen from "@/component/FormScreen";
import EngProfile from "@/component/EngProfile";
import UnregisteredFarmerDetails from "@/component/UnregisteredFarmerDetails";
import UnregisteredCropDetails from "@/component/UnregisteredCropDetails";
import SearchFarmer from "@/component/SearchFarmer";
import FarmerQr from "@/component/FarmerQr";
import ComplainPage from "@/component/ComplainPage";
import OfficerQr from "@/component/OfficerQr";
import Profile from "@/component/Profile";
import * as ScreenCapture from "expo-screen-capture";
import ReportPage from "@/component/ReportPage";
import SearchPriceScreen from "@/component/SearchPriceScreen";
import PriceChart from "@/component/PriceChart";

import Ionicons from "react-native-vector-icons/Ionicons";
import BottomNav from "@/component/BottomNav";
import CollectionOfficersList from "@/component/ManagerScreens/CollectionOfficersList";
import OfficerSummary from "@/component/ManagerScreens/OfficerSummary";
import ReportGenerator from "@/component/ManagerScreens/ReportGenerator";
import ComplainHistory from "@/component/ComplainHistory";
import DailyTargetList from "@/component/DailyTargetList";
import AddOfficerBasicDetails from "@/component/ManagerScreens/AddOfficerBasicDetails";
import AddOfficerAddressDetails from "@/component/ManagerScreens/AddOfficerAddressDetails";
import ClaimOfficer from "@/component/ManagerScreens/ClaimOfficer";
import TransactionList from "@/component/ManagerScreens/TransactionList";
import FarmerReport from "@/component/ManagerScreens/FarmerReport";
import SetTargetScreen from "@/component/ManagerScreens/SetTargetScreen";
import DailyTarget from "@/component/ManagerScreens/DailyTarget";
import TargetValidPeriod from "@/component/ManagerScreens/TargetValidPeriod";
import NoCollectionCenterScreen from "@/component/NoCollectionCenterScreen ";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import EditTargetScreen from "@/component/ManagerScreens/EditTargetScreen";
import PassTargetScreen from "@/component/ManagerScreens/PassTargetScreen";
import RecieveTargetScreen from "@/component/ManagerScreens/RecieveTargetScreen";
import DailyTargetListForOfficers from "@/component/ManagerScreens/DailyTargetListForOfficers";
import EditTargetManager from "@/component/ManagerScreens/EditTargetManager";
import RecieveTargetBetweenOfficers from "@/component/ManagerScreens/RecieveTargetBetweenOfficers";
import PassTargetBetweenOfficers from "@/component/ManagerScreens/PassTargetBetweenOfficers";
import OTPE from "@/component/Otpverification";
import { AppState } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import ManagerDashboard from "@/component/ManagerScreens/ManagerDashboard";
import CenterTarget from "@/component/ManagerScreens/CenterTarget";
import ManagerTransactions from "@/component/ManagerScreens/ManagerTransactions";
import { environment } from "../environment/environment";
import RegisterDriver from "@/component/Driver screens/RegisterDriver";
LogBox.ignoreAllLogs(true);
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

const Stack = createStackNavigator(); 
const Tab = createBottomTabNavigator();
const windowDimensions = Dimensions.get("window");


function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { display: 'none' }, 
        headerShown: false,
      })}
      tabBar={(props) => <NavigationBar {...props} />}
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
      <Stack.Screen name="RegisterDriver" component={RegisterDriver as any} />
    </Tab.Navigator>
  );
}
const Index = () => {
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

          <Stack.Screen name="Lanuage" component={Lanuage} />



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

          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
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

export default Index;
