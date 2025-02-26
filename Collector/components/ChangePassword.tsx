import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Import the icon library
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
import environment from "@/environment/environment";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";
import FastImage from "react-native-fast-image";
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
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureCurrent, setSecureCurrent] = useState(true);
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

  useEffect(() => {
    const fetchEmpid = async () => {
      try {
        const response = await axios.get(
          `${environment.API_BASE_URL}api/collection-officer/empid/`
        );
        console.log("Empid response:", response.data);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch empid.");
      }
    };
  }, []);

  const handleChangePassword = async () => {

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await axios.post(
        `${environment.API_BASE_URL}api/collection-officer/change-password`,
        {
          empId:empid,
          currentPassword,
          newPassword,
        }
      );

      console.log("Password update response:", response.data);
      Alert.alert("Success", "Password updated successfully");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", "Failed to update password.");
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      style={{ paddingHorizontal: wp(6), paddingVertical: hp(2) }}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity onPress={() => navigation.goBack()} className="">
        <AntDesign name="left" size={24} color="#000502" />
      </TouchableOpacity>

      <View className="items-center pt-4">
        <Image
          source={require("@/assets/images/Collectorimage.png")} // Update path to your image
          resizeMode="contain"
        />
      </View>

      <View className="items-center pt-[10%]">
        <Text className="font-bold text-xl">Choose a New Password</Text>
        <Text className="w-[53%] text-center font-light pt-3">
          Choose your new password to access your account
        </Text>
      </View>

      <View className="items-center pt-[12%]">
        <Text className="font-normal pb-2">Current Password</Text>
        <View className="flex-row items-center border rounded-3xl w-[95%] h-[53px] mb-8 bg-white px-3">
          <TextInput
            className="flex-1 h-[40px] text-base"
            placeholder="Current Password"
            secureTextEntry={secureCurrent}
            onChangeText={setCurrentPassword}
            value={currentPassword}
          />
          <TouchableOpacity onPress={() => setSecureCurrent(!secureCurrent)}>
            <Icon
              name={secureCurrent ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="green"
            />
          </TouchableOpacity>
        </View>

        <Text className="font-normal pb-2">New Password</Text>
        <View className="flex-row items-center border rounded-3xl w-[95%] h-[53px] mb-8 bg-white px-3">
          <TextInput
            className="flex-1 h-[40px] text-base"
            placeholder="New Password"
            secureTextEntry={secureNew}
            onChangeText={setNewPassword}
            value={newPassword}
          />
          <TouchableOpacity onPress={() => setSecureNew(!secureNew)}>
            <Icon
              name={secureNew ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="green"
            />
          </TouchableOpacity>
        </View>

        <Text className="font-normal pb-2">Confirm New Password</Text>
        <View className="flex-row items-center border rounded-3xl w-[95%] h-[53px] mb-5 bg-white px-3">
          <TextInput
            className="flex-1 h-[40px] text-base"
            placeholder="Confirm New Password"
            secureTextEntry={secureConfirm}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />
          <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
            <Icon
              name={secureConfirm ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="green"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className="items-center pt-7 gap-y-5">
        <TouchableOpacity
          className="bg-[#2AAD7A] w-[95%] p-3 rounded-3xl"
          onPress={handleChangePassword}
        >
          <Text className="text-center pt-1 text-xl font-light text-white">
            Next
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
                        className="bg-white border w-[60%] h-[40px] rounded-3xl"
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text className="text-center pt-1 text-xl font-light text-black">Skip</Text>
                    </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
};

export default ChangePassword;
