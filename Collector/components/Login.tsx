import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import environment from "../environment/environment";
import { useTranslation } from "react-i18next";
import AntDesign from "react-native-vector-icons/AntDesign";
import LottieView from "lottie-react-native"; // Import LottieView

type LoginNavigationProp = StackNavigationProp<RootStackParamList, "Login">;

interface LoginProps {
  navigation: LoginNavigationProp;
}

const loginImage = require("@/assets/images/login.png");

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const [empid, setEmpid] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false); // State for showing loader
  const { t } = useTranslation();

  const handleLogin = async () => {
    setLoading(true); // Show loader when login starts
    try {
      const response = await fetch(
        `${environment.API_BASE_URL}api/collection-officer/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            empId: empid,
            password,
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      
      
     

      if (!response.ok) {
        setLoading(false);
        if (response.status === 404) {
          Alert.alert("Error", "Invalid Employee ID. Please try again.");
        } else if (response.status === 401) {
          Alert.alert("Error", "Invalid Password. Please try again.");
        } else {
          Alert.alert("Error", data.message || "An error occurred. Try again.");
        }
        return;
      }

      const { token, passwordUpdateRequired, jobRole, empId } = data;

      await AsyncStorage.setItem("jobRole", jobRole);
      if (token) {
          await AsyncStorage.setItem("token", token);
      }

      // Store the empId in AsyncStorage
      await AsyncStorage.setItem("empid", empId.toString());


      // Wait 4 seconds before navigation
      setTimeout(() => {
        setLoading(false);
        if (passwordUpdateRequired) {
          navigation.navigate("ChangePassword", { empid } as any);
        } else {
          if (jobRole === "Collection Officer") {
            navigation.navigate("Main", { screen: "Dashboard" });
          } else {
            navigation.navigate("Main", { screen: "ManagerDashboard" });
          }
        }
      }, 4000);
    } catch (error) {
      setLoading(false);
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    enabled
    className="flex-1"
  >
    <ScrollView
      className="flex-1 w-full bg-white"
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity onPress={() => navigation.goBack()} className="p-4">
        <AntDesign name="left" size={24} color="#000502" />
      </TouchableOpacity>

      <View className="items-center mt-[-5%]">
        <Image source={loginImage} />
        <Text className="font-bold text-2xl pt-[7%]">
          {/* {t("SignIn.Wellcome")} */} Welcome!
        </Text>
      </View>

      <View className="mt-2 items-center">
        <Text>Please Sign in to login</Text>
      </View>

      {loading ? (
        // **Lottie Loader while logging in**
            <View className="flex-1 justify-center items-center ">
              <LottieView
                source={require('../assets/lottie/collector.json')} // Ensure you have a valid JSON file
                autoPlay
                loop
                style={{ width: 300, height: 300 }}
              />
            </View>
      ) : (
        <View className="p-6">
          <Text className="text-base pb-[2%] font-light">Employee ID</Text>
          <View className="flex-row items-center border rounded-3xl w-full h-[53px] mb-5 bg-white px-3" style={{ borderColor: '#D5D5D5' }}>

            {/* <Icon name="email" size={24} color="green" /> */}
            <AntDesign name="user" size={24} color="green" />
            <TextInput
              className="flex-1 h-[40px] text-base pl-2"
              placeholder="Employee ID"
              onChangeText={setEmpid}
              value={empid}
            />
          </View>

          <Text className="text-base pb-[2%] font-light">Password</Text>
          <View className="flex-row items-center border rounded-3xl w-full h-[53px] mb-5 bg-white px-3" style={{ borderColor: '#D5D5D5' }}>
            <Icon name="lock" size={24} color="green" />
            <TextInput
              className="flex-1 h-[40px] text-base pl-2"
              placeholder="Password"
              secureTextEntry={secureTextEntry}
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
              <Icon
                name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="green"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-[#2AAD7A] w-full p-3 rounded-3xl shadow-2xl items-center justify-center mb-[10%]"
            onPress={handleLogin}
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-center text-xl font-light text-white">
                Sign In
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  </KeyboardAvoidingView>
  );
};

export default Login;
