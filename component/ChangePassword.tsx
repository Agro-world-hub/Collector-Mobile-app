import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
  KeyboardAvoidingView,
  BackHandler,
  Keyboard,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Import the icon library
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
import { environment } from "@/environment/environment";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "expo-router";
import NetInfo from "@react-native-community/netinfo";


type ChangePasswordNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChangePassword"
>;

interface ChangePasswordProps {
  navigation: ChangePasswordNavigationProp;
  route: {
    params: {
      empid: string;
    };
  };
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  navigation,
  route,
}) => {
  const { empid } = route.params;
  console.log(empid)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureCurrent, setSecureCurrent] = useState(true);
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const { t } = useTranslation();

  const validatePassword = () => {
    // Check if all fields are filled
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert(t("Error.error"), t("Error.All fields are required"));
      return false;
    }

    // Check if new password meets format requirements
    if (newPassword.length < 8) {
      Alert.alert(t("Error.error"), t("Error.Your password must contain"));
      return false;
    }

    // Check for at least 1 uppercase letter
    if (!/[A-Z]/.test(newPassword)) {
      Alert.alert(t("Error.error"), t("Error.Your password must contain a minimum"));
      return false;
    }

    // Check for at least 1 number
    if (!/[0-9]/.test(newPassword)) {
      Alert.alert(t("Error.error"), t("Error.Your password must contain"));
      return false;
    }

    // Check for at least 1 special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)) {
       Alert.alert(t("Error.error"), t("Error.Your password must contain a minimum"));
      return false;
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      Alert.alert(t("Error.error"), 'New password and confirm password do not match');
      return false;
    }

    return true;
  };

  useEffect(() => {
    const fetchEmpid = async () => {
      try {
        const response = await axios.get(
          `${environment.API_BASE_URL}api/collection-officer/empid/`
        );
        console.log("Empid response:", response.data);
      } catch (error) {
        Alert.alert(t("Error.error"), t("Error.Failed to fetch empid."));
      }
    };
  }, []);

  const handleChangePassword = async () => {
    
        Keyboard.dismiss();
    // Validate inputs before proceeding
    if (!validatePassword()) {
      return;
    }

     const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
    return; 
  }

    try {
      const response = await axios.post(
        `${environment.API_BASE_URL}api/collection-officer/change-password`,
        {
          empId: empid,
          currentPassword,
          newPassword,
        }
      );

      console.log("Password update response:", response.data);
      Alert.alert(t("Error.Success"), t("Error.Password updated successfully"));
      navigation.navigate("Login");
    } catch (error) {
      // Alert.alert(t("Error.error"), t("Error.Failed to update password."));
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          Alert.alert(t("Error.error"), t("Error.Invalid current password"));
        } else {
          Alert.alert(t("Error.error"), t("Error.Failed to update password"));
        }
      } else {
        Alert.alert(t("Error.error"), "Error.somethingWentWrong");
      }
    }
  };

      useFocusEffect(
      useCallback(() => {
        const onBackPress = () => true;
        BackHandler.addEventListener("hardwareBackPress", onBackPress);
        return () =>
          BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      }, [])
    );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled
      style={{ flex: 1}}
    >
      <ScrollView
        className="flex-1 bg-white"
        style={{ paddingHorizontal: wp(6), paddingVertical: hp(2) }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={() => navigation.goBack()} className="bg-[#F6F6F680] rounded-full p-2">
          <AntDesign name="left" size={24} color="#000502" />
        </TouchableOpacity>

        <View className="flex-row items-center justify-center mt-[2%] space-x-[-30%] ml-[5%]">
         <Image
            source={require("@/assets/images/cangepassword.png")}
            resizeMode="contain"
            className="w-30 h-20"
          /> 
          {/* <Image
            source={require("@/assets/images/Codinetflat.webp")}
            resizeMode="contain"
            className="w-40 h-24 mt-10"
          /> */}
        </View>

        <View className="items-center pt-[5%]">
          <Text className="font-bold text-2xl">
            {t("ChangePassword.ChoosePassword")}
          </Text>
          <Text className="w-[53%] text-center font-light pt-3">
            {t("ChangePassword.Changepassword")}
          </Text>
        </View>

        <View className="items-center pt-[12%]">
          <Text className="font-normal pb-2 self-start ml-4">
            {t("ChangePassword.CurrentPassword")}
          </Text>
          <View className="flex-row items-center bg-[#F4F4F4] border border-[#F4F4F4] rounded-3xl w-[95%] h-[53px] mb-8 px-3">
          <TextInput
            className="flex-1 h-[40px] bg-[#F4F4F4]"
          //  placeholder={t("ChangePassword.CurrentPassword")}
            secureTextEntry={secureCurrent}
            onChangeText={setCurrentPassword}
            value={currentPassword}
          />
            <TouchableOpacity onPress={() => setSecureCurrent(!secureCurrent)}>
              <Icon
                name={secureCurrent ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#0000000"
              />
            </TouchableOpacity>
          </View>

          <Text className="font-normal pb-2 items-start self-start ml-4 ">
            {t("ChangePassword.NewPassword")}
          </Text>
             <View className="flex-row items-center bg-[#F4F4F4] border border-[#F4F4F4] rounded-3xl w-[95%] h-[53px] mb-8 px-3">
            <TextInput
              className="flex-1 h-[40px] "
           //   placeholder={t("ChangePassword.NewPassword")}
              secureTextEntry={secureNew}
              // onChangeText={setNewPassword}
              value={newPassword}
                 onChangeText={(text) => {
      // Remove all spaces and prevent starting with space
      const cleanText = text.replace(/\s/g, '');
      setNewPassword(cleanText);
    }}
            />
            <TouchableOpacity onPress={() => setSecureNew(!secureNew)}>
              <Icon
                name={secureNew ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#000000"
              />
            </TouchableOpacity>
          </View>

          <Text className="font-normal pb-2 self-start ml-4">
            {t("ChangePassword.ConfirmNewPassword")}
          </Text>
           <View className="flex-row items-center bg-[#F4F4F4] border border-[#F4F4F4] rounded-3xl w-[95%] h-[53px] mb-8 px-3">
            <TextInput
              className="flex-1 h-[40px] bg-[#F4F4F4]"
             // placeholder={t("ChangePassword.ConfirmNewPassword")}
              secureTextEntry={secureConfirm}
              // onChangeText={setConfirmPassword}
                        onChangeText={(text) => {
      // Remove all spaces and prevent starting with space
      const cleanText = text.replace(/\s/g, '');
      setConfirmPassword(cleanText);
    }}
              value={confirmPassword}
            />
            <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
              <Icon
                name={secureConfirm ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#000000"
              />
            </TouchableOpacity>
          </View>
        </View>

     
        <View className="items-center justify-center pt-7 gap-y-5 mb-20">
  <TouchableOpacity
    className="bg-[#000000] w-[95%] p-3 rounded-full items-center justify-center"
    onPress={handleChangePassword}
  >
    {/* 1️⃣ parent now centers its children */}
    <Text className="text-xl font-light text-white">
      {t("ChangePassword.Next")}
    </Text>
  </TouchableOpacity>
</View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ChangePassword;