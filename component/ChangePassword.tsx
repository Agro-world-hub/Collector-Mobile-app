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
    if (!newPassword || !confirmPassword || !currentPassword) {
      Alert.alert(
        t("Error.error"),
        t("Error.Passwords are not allowed to be empty")
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(
        t("Error.error"),
        t("Error.New password and confirm password do not match.")
      );
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        t("Error.error"),
        t("Error.New password must be at least 6 characters long.")
      );
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
      Alert.alert("Success", "Password updated successfully");
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
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-white"
        style={{ paddingHorizontal: wp(6), paddingVertical: hp(2) }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={() => navigation.goBack()} className="">
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
          <Text className="font-normal pb-2 ml-[-55%]">
            {t("ChangePassword.CurrentPassword")}
          </Text>
          <View className="flex-row items-center border border-[#D5D5D5] rounded-3xl w-[95%] h-[53px] mb-8 bg-white px-3">
            <TextInput
              className="flex-1 h-[40px] text-base"
              placeholder={t("ChangePassword.CurrentPassword")}
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

          <Text className="font-normal pb-2 ml-[-60%]">
            {t("ChangePassword.NewPassword")}
          </Text>
          <View className="flex-row items-center border border-[#D5D5D5] rounded-3xl w-[95%] h-[53px] mb-8 bg-white px-3">
            <TextInput
              className="flex-1 h-[40px] text-base"
              placeholder={t("ChangePassword.NewPassword")}
              secureTextEntry={secureNew}
              onChangeText={setNewPassword}
              value={newPassword}
            />
            <TouchableOpacity onPress={() => setSecureNew(!secureNew)}>
              <Icon
                name={secureNew ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#000000"
              />
            </TouchableOpacity>
          </View>

          <Text className="font-normal pb-2 ml-[-45%]">
            {t("ChangePassword.ConfirmNewPassword")}
          </Text>
          <View className="flex-row items-center border border-[#D5D5D5] rounded-3xl w-[95%] h-[53px] mb-5 bg-white px-3">
            <TextInput
              className="flex-1 h-[40px] text-base"
              placeholder={t("ChangePassword.ConfirmNewPassword")}
              secureTextEntry={secureConfirm}
              onChangeText={setConfirmPassword}
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

        <View className="items-center pt-7 gap-y-5">
          <TouchableOpacity
            className="bg-[#000000] w-[95%] p-3 rounded-full"
            onPress={handleChangePassword}
          >
            <Text className="text-center pt-1 text-xl font-light text-white">
              {t("ChangePassword.Next")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ChangePassword;