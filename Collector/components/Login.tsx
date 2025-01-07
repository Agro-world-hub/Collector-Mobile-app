import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Import the icon library
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import environment from "../environment/environment";
import { useTranslation } from "react-i18next";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type LoginNavigationProp = StackNavigationProp<RootStackParamList, "Login">;

interface LoginProps {
  navigation: LoginNavigationProp;
}

const loginImage = require("@/assets/images/login.png");

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const [empid, setEmapid] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { t } = useTranslation();
  const handleLogin = async () => {
    try {
      // Replace `api.post` with `fetch` and pass the request payload as JSON

      const response = await fetch(
        `${environment.API_BASE_URL}api/collection-officer/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            empId:empid,
            password,
          }),
        }
      );
  
      const data = await response.json();
      // Check if the response is successful
      if (!response.ok) {
        if (response.status === 404) {
          Alert.alert("Error", "Invalid Employee ID. Please try again.");
        } else if (response.status === 401) {
          Alert.alert("Error", "Invalid Password. Please try again.");
        } else {
          Alert.alert("Error", data.message || "An error occurred. Try again.");
        }
        return;
      }
      // Parse the response data
  
      const { token, passwordUpdateRequired, payload, jobRole } = data;
      // Store token in AsyncStorage if received
      console.log("passwordUpdateRequired", passwordUpdateRequired);
      await AsyncStorage.setItem("jobRole", jobRole);
      if (token) {
        await AsyncStorage.setItem("token", token);
      } else {
        console.error("No token received from the server.");
      }

      // Navigate to the appropriate screen based on password update requirement
      if (passwordUpdateRequired == true) {
        navigation.navigate("ChangePassword", { empid } as any);
      } else {
        navigation.navigate("Main");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <ScrollView
      className="flex-1 w-full bg-white"
      style={{ paddingHorizontal: wp(6), paddingVertical: hp(2) }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} className="">
        <AntDesign name="left" size={24} color="#000502" />
      </TouchableOpacity>
      <View className="items-center pt-[10%]">
        <Image source={loginImage} />
        <Text className="font-bold text-2xl pt-[7%]">
          {t("SignIn.Wellcome")}
        </Text>
      </View>
      <View className="mt-2 items-center">
        <Text>Please Sign in to login</Text>
      </View>

      <View className="p-2 pt-[8%]">
        <Text className="text-base pb-[2%] font-light">Employee ID</Text>
        <View className="flex-row items-center border rounded-3xl w-full h-[53px] mb-5 bg-white px-3">
          <Icon name="email" size={24} color="green" />
          <TextInput
            className="flex-1 h-[40px] text-base pl-2"
            placeholder="Employee ID"
            onChangeText={setEmapid}
            value={empid}
          />
        </View>
        <Text className="text-base pb-[2%] font-light">Password</Text>
        <View className="flex-row items-center border rounded-3xl w-full h-[53px] mb-10 bg-white px-3">
          <Icon name="lock" size={24} color="green" />
          <TextInput
            className="flex-1 h-[40px] text-base pl-2"
            placeholder="Password"
            secureTextEntry={secureTextEntry}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          >
            <Icon
              name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="green"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-[#2AAD7A]   w-full p-3 rounded-3xl shadow-2xl items-center justify-center"
          onPress={handleLogin}
        >
          <Text className="text-center  text-xl font-light text-white">
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Login;
