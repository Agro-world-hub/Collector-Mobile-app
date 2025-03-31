import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
 import { RootStackParamList } from "../types"; // Ensure this file exists
import {environment }from '@/environment/environment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";

type CancelresonNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Cancelreson"
>;

interface CancelresonProps {
  navigation: CancelresonNavigationProp;
}

const Cancelreson: React.FC<CancelresonProps> = ({ navigation }) => {
    return (
         <KeyboardAvoidingView
               behavior={Platform.OS === "ios" ? "padding" : "height"}
               style={{ flex: 1 }}>
               <ScrollView
                 contentContainerStyle={{ flexGrow: 1 }}
                 keyboardShouldPersistTaps="handled"
               >
                 <View
                   className="flex-1 bg-white"
                   style={{ paddingHorizontal: wp(6), paddingVertical: hp(2) }}
                 >
                   {/* Header */}
                   <View className="flex-row items-center mb-6">
                     <TouchableOpacity onPress={() => navigation.goBack()} className="">
                       <AntDesign name="left" size={24} color="#000" />
                     </TouchableOpacity>
                     <Text className="flex-1 text-center text-xl font-bold text-black">
                     Reason to Cancel
                     </Text>
                   </View>

                   <View className="justify-center mb-4 items-center mt-[10%] ">
                    <Text className="font-bold">
                    Please mention below the reason
                    </Text>
                      <TextInput
                                   className="w-[80%] h-[50%] border border-[#CFCFCF] rounded-lg bg-white mt-[5%] text-gray-800 "
                                   placeholder="Enter here.."
                                   multiline
                                 //  value={complain}
                               //    onChangeText={(text) => setComplain(text)}
                               
                                   style={{ textAlignVertical: "top" }}
                                 />
                   
               
                   </View>
                   <View className="p-6">
                     <TouchableOpacity 
                           className="bg-black rounded-full py-3 mb-3 " 
                         //  onPress={handleConfirm}  
                         >
                           <Text className="text-white text-center font-medium">Confirm</Text>
                         </TouchableOpacity>
                         
                         <TouchableOpacity 
                           className="bg-gray-200 rounded-full py-3" 
                           //onPress={handleCancelConfim} 
                         >
                           <Text className="text-gray-700 text-center">Cancel</Text>
                         </TouchableOpacity>
                   </View>
                   </View>
                   </ScrollView>
                   </KeyboardAvoidingView>
      );

}

export default Cancelreson;

