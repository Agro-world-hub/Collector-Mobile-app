import React from 'react'
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '@/components/Splash';
import Login from '@/components/Login';
import ChangePassword from '@/components/ChangePassword';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const Stack = createNativeStackNavigator(); // Create Stack navigator instance
const index = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ChangePassword" component={ChangePassword}/>
    </Stack.Navigator>
   </GestureHandlerRootView> 
  )
}

export default index