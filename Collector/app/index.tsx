import React,{ useEffect } from 'react'
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '@/components/Splash';
import Login from '@/components/Login';
import ChangePassword from '@/components/ChangePassword';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Registeredfarmer from '@/components/Registeredfarmer';
import Ufarmercropdetails from '@/components/Ufarmercropdetails';
import Dashboard from '@/components/Dashboard';
import QRScanner from '@/components/QRScanner';
import FormScreen from '@/components/FormScreen';
import EngProfile from '@/components/EngProfile';
import UnregisteredFarmerDetails from '@/components/UnregisteredFarmerDetails';
import UnregisteredCropDetails from '@/components/UnregisteredCropDetails';
import SinChangePassword from '@/components/Sinhala/SinChangePassword';
import SinLogin from '@/components/Sinhala/SinLogin';
import Lanuage from '@/components/Lanuage';
import SinDashboard from '@/components/Sinhala/SinDashboard';
import SinUfarmercropdetails from '@/components/Sinhala/SinUfarmercropdetails';
import SinUnregisteredFarmerDetails from '@/components/Sinhala/SinUnregisteredFarmerDetails';
import SinRegisteredfarmer from '@/components/Sinhala/SinRegisteredfarmer';
import SinUnregisteredCropDetails from '@/components/Sinhala/SinUnregisteredCropDetails';
import TamChangePassword from '@/components/Tamil/TamChangePassword';
import TamLogin from '@/components/Tamil/TamLogin';
import TamDashboard from '@/components/Tamil/TamDashboard';
import TamRegisteredfarmer from '@/components/Tamil/TamRegisteredFarmer';
import TamUfarmercropdetails from '@/components/Tamil/TamUfarmercropdetails';
import TamUnregisteredFarmerDetails from '@/components/Tamil/TamUnregisteredFarmerDetails';
import TamUnregisteredCropDetails from '@/components/Tamil/TamUnregisteredCropdetails';
import SinProfile from '@/components/Sinhala/SinProfile';
import TamProfile from '@/components/Tamil/TamProfile';
import SearchFarmer from '@/components/SearchFarmer';
import FarmerQr from '@/components/FarmerQr';
import ComplainPage from '@/components/ComplainPage';
import OfficerQr from '@/components/OfficerQr';
import Profile from '@/components/Profile';
import * as ScreenCapture from 'expo-screen-capture';
import ReportPage from '@/components/ReportPage';
import SearchPriceScreen from '@/components/SearchPriceScreen';
import PriceChart from '@/components/PriceChart';
import { LanguageProvider } from '@/context/LanguageContext';





const Stack = createNativeStackNavigator(); // Create Stack navigator instance
const index = () => {
  
    // Prevent screenshots and screen recording
    // ScreenCapture.usePreventScreenCapture()

  return (
    <LanguageProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ChangePassword" component={ChangePassword as any}/>
      <Stack.Screen name="Registeredfarmer" component={Registeredfarmer}/>
      <Stack.Screen name="Ufarmercropdetails" component={Ufarmercropdetails}/>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="QRScanner" component={QRScanner} />
      <Stack.Screen name="FormScreen" component={FormScreen} />
      <Stack.Screen name="EngProfile" component={EngProfile} />
      <Stack.Screen name="UnregisteredFarmerDetails" component={UnregisteredFarmerDetails} />
      <Stack.Screen name="UnregisteredCropDetails" component={UnregisteredCropDetails as any} />
      <Stack.Screen name="SinChangePassword" component={SinChangePassword} />
      <Stack.Screen name="SinLogin" component={SinLogin} />
      <Stack.Screen name="Lanuage" component={Lanuage} />
      <Stack.Screen name="SinDashboard" component={SinDashboard} />
      <Stack.Screen name="SinUfarmercropdetails" component={SinUfarmercropdetails} />
      <Stack.Screen name="SinUnregisteredFarmerDetails" component={SinUnregisteredFarmerDetails} />
      <Stack.Screen name="SinRegisteredfarmer" component={SinRegisteredfarmer} />
      <Stack.Screen name="SinUnregisteredCropDetails" component={SinUnregisteredCropDetails as any} />
      <Stack.Screen name="TamChangePassword" component={TamChangePassword} />
      <Stack.Screen name="TamLogin" component={TamLogin} />
      <Stack.Screen name="TamDashboard" component={TamDashboard} />
      <Stack.Screen name="TamRegisteredfarmer" component={TamRegisteredfarmer} />
      <Stack.Screen name="TamUfarmercropdetails" component={TamUfarmercropdetails} />
      <Stack.Screen name="TamUnregisteredFarmerDetails" component={TamUnregisteredFarmerDetails} />
      <Stack.Screen name="TamUnregisteredCropDetails" component={TamUnregisteredCropDetails as any} />
      <Stack.Screen name="SinProfile" component={SinProfile} />
      <Stack.Screen name="TamProfile" component={TamProfile} />
      <Stack.Screen name="SearchFarmer" component={SearchFarmer} />
      <Stack.Screen name="FarmerQr" component={FarmerQr} />
      <Stack.Screen name="OfficerQr" component={OfficerQr} />
      <Stack.Screen name="ComplainPage" component={ComplainPage} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ReportPage" component={ReportPage} />
      <Stack.Screen name="SearchPriceScreen" component={SearchPriceScreen} /> 
      <Stack.Screen name="PriceChart" component={PriceChart as any}/>
     
      
      

      
      
    </Stack.Navigator>
   </GestureHandlerRootView>
    </LanguageProvider>
  )
}

export default index