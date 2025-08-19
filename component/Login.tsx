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
  Keyboard,
  BackHandler,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { environment } from "@/environment/environment";
import { useTranslation } from "react-i18next";
import AntDesign from "react-native-vector-icons/AntDesign";
import LottieView from "lottie-react-native"; // Import LottieView
import { useFocusEffect } from "expo-router";
import { setUser } from '../store/authSlice';
import { useDispatch } from "react-redux";
// import socket from "@/services/socket";

type LoginNavigationProp = StackNavigationProp<RootStackParamList, "Login">;

interface LoginProps {
  navigation: LoginNavigationProp;
}

const loginImage = require("@/assets/images/New/login.png");
const user = require("@/assets/images/New/user.png")
const passwordicon = require("@/assets/images/New/password.png")

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const [empid, setEmpid] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false); // State for showing loader
  const { t } = useTranslation();
const dispatch = useDispatch();
//   const handleLogin = async () => {
//     Keyboard.dismiss(); // Dismiss the keyboard
//     if (!empid && !password) {
//       Alert.alert(
//         t("Error.error"),
//         t("Error.Password & Employee ID are not allowed to be empty")
//       );
//       return false;
//     }

//     // Second check: Only password is empty
//     if (empid && !password) {
//       Alert.alert(
//         t("Error.error"),
//         t("Error.Password is not allowed to be empty")
//       );
//       return false;
//     }

//     // Third check: Only employee ID is empty
//     if (!empid && password) {
//       Alert.alert(
//         t("Error.error"),
//         t("Error.Employee ID is not allowed to be empty")
//       );
//       return false;
//     }
//     setLoading(true); // Show loader when login starts
//     await AsyncStorage.removeItem("token");
//     await AsyncStorage.removeItem("jobRole");
//     await AsyncStorage.removeItem("companyNameEnglish");
//     await AsyncStorage.removeItem("companyNameSinhala");
//     await AsyncStorage.removeItem("companyNameTamil");
//     await AsyncStorage.removeItem("empid");
//     try {
//       const response = await fetch(
//         `${environment.API_BASE_URL}api/collection-officer/login`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             empId: empid,
//             password,
//           }),
//         }
//       );

//       const data = await response.json();
//       console.log("Login response:", data);

//       if (!response.ok) {
//         setLoading(false);
//         if (response.status === 404) {
//           Alert.alert(t("Error.error"), t("Error.Invalid EMP ID & Password"));
//         } else if (response.status === 401) {
//           Alert.alert(
//             t("Error.error"),
//             t("Error.Invalid Password. Please try again.")
//           );
//         } else if (data.status === "error") {
//           console.log("Login error:", data);
//           Alert.alert(t("Error.error"), t("Error.Invalid EMP ID"));
//         } else {
//           Alert.alert(t("Error.error"), t("Error.somethingWentWrong"));
//         }
//         return;
//       }

//       // Login successful
//       const {
//         token,
//         passwordUpdateRequired,
//         jobRole,
//         empId,
//         companyNameEnglish,
//         companyNameSinhala,
//         companyNameTamil,
//       } = data;
//       await AsyncStorage.setItem("token", token);
//       await AsyncStorage.setItem("jobRole", jobRole);
//       await AsyncStorage.setItem("companyNameEnglish", companyNameEnglish);
//       await AsyncStorage.setItem("companyNameSinhala", companyNameSinhala);
//       await AsyncStorage.setItem("companyNameTamil", companyNameTamil);
//       await AsyncStorage.setItem("empid", empId.toString());
// dispatch(setUser({ token, jobRole, empId: empId.toString() }));
//       if (token) {
//         const timestamp = new Date();
//         const expirationTime = new Date(
//           timestamp.getTime() + 8 * 60 * 60 * 1000
//           // timestamp.getTime() + 2 * 60 * 1000
//         );
//         await AsyncStorage.multiSet([
//           ["tokenStoredTime", timestamp.toISOString()],
//           ["tokenExpirationTime", expirationTime.toISOString()],
//         ]);
//       }

//       console.log("llllllll========================",passwordUpdateRequired)
//       await status(empId, true);
//       setTimeout(() => {
//         setLoading(false);
// //         if (passwordUpdateRequired) {
// //           navigation.navigate("ChangePassword", { empid } as any);
// //         } else {
// //           if (jobRole === "Collection Officer") {
// //             navigation.navigate("Main", { screen: "Dashboard" });
// //           } else {
// //             navigation.navigate("Main", { screen: "ManagerDashboard" });
// //           }
// //         }

// if (passwordUpdateRequired) {
//   navigation.navigate("ChangePassword", { empid } as any);
// } else {
//   // Fixed: Check for both Distribution roles individually
//   if (jobRole === "Distribution Officer" || jobRole === "Distribution Center Manager") {
//     navigation.navigate("Main", { screen: "DistridutionaDashboard" });
//   } else if (jobRole === "Collection Officer") {
//     navigation.navigate("Main", { screen: "Dashboard" });
//   } else {
//     navigation.navigate("Main", { screen: "ManagerDashboard" });
//   }
// }

//       }, 4000);
//     } catch (error) {
//       setLoading(false);
//       console.error("Login error:", error);
//       Alert.alert(t("Error.error"), t("Error.somethingWentWrong"));
//     }
//   };

const handleLogin = async () => {
  Keyboard.dismiss(); // Dismiss the keyboard
  if (!empid && !password) {
    Alert.alert(
      t("Error.error"),
      t("Error.Password & Employee ID are not allowed to be empty")
    );
    return false;
  }

  // Second check: Only password is empty
  if (empid && !password) {
    Alert.alert(
      t("Error.error"),
      t("Error.Password is not allowed to be empty")
    );
    return false;
  }

  // Third check: Only employee ID is empty
  if (!empid && password) {
    Alert.alert(
      t("Error.error"),
      t("Error.Employee ID is not allowed to be empty")
    );
    return false;
  }
  
  setLoading(true); // Show loader when login starts
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("jobRole");
  await AsyncStorage.removeItem("companyNameEnglish");
  await AsyncStorage.removeItem("companyNameSinhala");
  await AsyncStorage.removeItem("companyNameTamil");
  await AsyncStorage.removeItem("empid");
  
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
    console.log("Login response:", data);

    if (!response.ok) {
      setLoading(false);
      if (response.status === 404) {
        Alert.alert(t("Error.error"), t("Error.Invalid EMP ID & Password"));
      } else if (response.status === 401) {
        Alert.alert(
          t("Error.error"),
          t("Error.Invalid Password. Please try again.")
        );
      } else if (data.status === "error") {
        console.log("Login error:", data);
        Alert.alert(t("Error.error"), t("Error.Invalid EMP ID"));
      } else {
        Alert.alert(t("Error.error"), t("Error.somethingWentWrong"));
      }
      return;
    }

    // Login successful - extract job role for validation
    const {
      token,
      passwordUpdateRequired,
      jobRole,
      empId,
      companyNameEnglish,
      companyNameSinhala,
      companyNameTamil,
    } = data;

    // **NEW: Define allowed roles**
    const allowedRoles = [
      "Collection Officer",
      "Collection Center Manager", 
      "Distribution Officer",
      "Distribution Center Manager"
    ];

    // **NEW: Check if the user's job role is allowed**
    if (!allowedRoles.includes(jobRole)) {
      setLoading(false);
      Alert.alert(
        t("Error.error"),
        "Access denied. Your role is not authorized to use this application."
      );
      return;
    }

    // Continue with normal login flow if role is authorized
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("jobRole", jobRole);
    await AsyncStorage.setItem("companyNameEnglish", companyNameEnglish);
    await AsyncStorage.setItem("companyNameSinhala", companyNameSinhala);
    await AsyncStorage.setItem("companyNameTamil", companyNameTamil);
    await AsyncStorage.setItem("empid", empId.toString());
    dispatch(setUser({ token, jobRole, empId: empId.toString() }));
    
    if (token) {
      const timestamp = new Date();
      const expirationTime = new Date(
        timestamp.getTime() + 8 * 60 * 60 * 1000
        // timestamp.getTime() + 2 * 60 * 1000
      );
      await AsyncStorage.multiSet([
        ["tokenStoredTime", timestamp.toISOString()],
        ["tokenExpirationTime", expirationTime.toISOString()],
      ]);
    }

    console.log("llllllll========================", passwordUpdateRequired);
    await status(empId, true);
    
    setTimeout(() => {
      setLoading(false);
      
      if (passwordUpdateRequired) {
        navigation.navigate("ChangePassword", { empid } as any);
      } else {
        // Navigate based on role
        if (jobRole === "Distribution Officer" || jobRole === "Distribution Center Manager") {
          navigation.navigate("Main", { screen: "DistridutionaDashboard" });
        } else if (jobRole === "Collection Officer") {
          navigation.navigate("Main", { screen: "Dashboard" });
        } else if (jobRole === "Collection Center Manager") {
          navigation.navigate("Main", { screen: "ManagerDashboard" });
        }
      }
    }, 4000);
    
  } catch (error) {
    setLoading(false);
    console.error("Login error:", error);
    Alert.alert(t("Error.error"), t("Error.somethingWentWrong"));
  }
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

      if (response) {
        console.log("User is marked as online");
      } else {
        console.log("Failed to update online status");
      }
    } catch (error) {
      console.error("Online status error:", error);
    }
  };

  const handleNavBack = async () => {
    navigation.navigate("Login");
    await AsyncStorage.removeItem("@user_language");
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
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className=" bg-white"
      >
        {/* <TouchableOpacity onPress={() => handleNavBack()} className="p-4">
          <AntDesign name="left" size={24} color="#000502" />
        </TouchableOpacity> */}

        <View className="items-center mt-[8%]">
          <Image 
          source={loginImage} 
          style={{ width: 270, height: 270 }}
          resizeMode="contain"
        />

          <Text className="font-bold text-2xl pt-[7%]">
            {t("SignIn.Wellcome")}
          </Text>
        </View>

        <View className="mt-2 items-center">
          <Text>{t("SignIn.SigntoLogin")}</Text>
          {/* <Text>Please Sign in to login</Text> */}
        </View>

        {loading ? (
          // **Lottie Loader while logging in**
          <View className="flex-1 justify-center items-center ">
            <LottieView
              source={require("../assets/lottie/newLottie.json")} // Ensure you have a valid JSON file
              autoPlay
              loop
              style={{ width: 300, height: 300 }}
            />
          </View>
        ) : (
          <View className="p-6">
            <Text className="text-base pb-[2%] font-light">
              {t("SignIn.Employee")}
            </Text>
            <View className="flex-row items-center bg-[#F4F4F4] border border-[#F4F4F4] rounded-3xl w-[95%] h-[53px] mb-8 px-3">
              {/* <Icon name="email" size={24} color="green" /> */}
              {/* <AntDesign name="user" size={24} color="green" /> */}
              <Image 
              source={user} 
               style={{ width: 24, height: 24 }}
          resizeMode="contain"
              />
              <TextInput
                className="flex-1 h-[40px] text-base pl-2"
              //  placeholder={t("SignIn.Employee")}
                // onChangeText={setEmpid}
                    onChangeText={(text) => setEmpid(text)}
                    
    autoCapitalize="characters"  // Automatically capitalizes all letters
                value={empid}
              />
            </View>

            <Text className="text-base pb-[2%] font-light">
              {t("SignIn.Password")}
            </Text>
 <View className="flex-row items-center bg-[#F4F4F4] border border-[#F4F4F4] rounded-3xl w-[95%] h-[53px] mb-8 px-3">            
     <Image 
              source={passwordicon} 
               style={{ width: 24, height: 24 }}
          resizeMode="contain"
              />
              <TextInput
                className="flex-1 h-[40px] text-base pl-2"
              //  placeholder={t("SignIn.Password")}
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
                  color="black"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="bg-[#000000] w-full p-3 rounded-3xl shadow-2xl items-center justify-center mb-[20%]"
              onPress={handleLogin}
              disabled={loading} // Disable button while loading
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-center text-xl font-light text-white">
                  {t("SignIn.Sign")}
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