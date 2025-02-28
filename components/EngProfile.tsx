// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   Modal,
//   Linking,
//   Alert,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { StackNavigationProp } from "@react-navigation/stack";
// import { RootStackParamList } from "./types";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import environment from "../environment/environment";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import AntDesign from "react-native-vector-icons/AntDesign";
// import { useTranslation } from "react-i18next";
// import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

// type EngProfileNavigationProp = StackNavigationProp<
//   RootStackParamList,
//   "EngProfile"
// >;

// interface EngProfileProps {
//   navigation: EngProfileNavigationProp;
// }

// const api = axios.create({
//   baseURL: environment.API_BASE_URL,
// });

// interface UserProfile {
//   firstNameEnglish: string;
//   lastNameEnglish: string;
//   companyName: string;
// }


// const EngProfile: React.FC<EngProfileProps> = ({ navigation }) => {
//   const [isLanguageDropdownOpen, setLanguageDropdownOpen] =
//     useState<boolean>(false);
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
//   const [isModalVisible, setModalVisible] = useState<boolean>(false);
//   const [empid, setEmpid] = useState<string>("");
//   const [selectedComplaint, setSelectedComplaint] = useState<string | null>(
//     null
//   );
//   const [isComplaintDropdownOpen, setComplaintDropdownOpen] =
//     useState<boolean>(false);
//   const { t } = useTranslation();

//   const complaintOptions = [t("Report Complaint"), t("View Complaint History")];

//   const handleComplaintSelect = (complaint: string) => {
//     setComplaintDropdownOpen(false);

//     if (complaint === t("Report Complaint")) {
//       navigation.navigate("ComplainPage" as any, { userId: 0 });
//     } else if (complaint === t("View Complaint History")) {
//       navigation.navigate("ComplainHistory" as  any);
//     }
//   };

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const token = await AsyncStorage.getItem("token");
//         if (token) {
//           const response = await api.get("api/collection-officer/user-profile", {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           setProfile(response.data.data);
//           console.log("Profile data:", response.data.data);
//         }
//       } catch (error) {
//         console.error("Failed to fetch user profile:", error);
//       }
//     };

//     fetchUserProfile();
//   }, []);

//   const handleLanguageSelect = (language: string) => {
//     setSelectedLanguage(language);
//     setLanguageDropdownOpen(false);
//   };

//   const handleCall = () => {
//     const phoneNumber = "+1234567890"; // Replace with the actual number
//     const url = `tel:${phoneNumber}`;
//     Linking.canOpenURL(url)
//       .then((supported) => {
//         if (supported) {
//           return Linking.openURL(url);
//         } else {
//           Alert.alert("Error", "Unable to open dialer.");
//         }
//       })
//       .catch((err) => console.error("An error occurred", err));
//   };

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.removeItem("token");
//       navigation.navigate("Login");
//     } catch (error) {
//       console.error("An error occurred during logout:", error);
//       Alert.alert("Error", "Failed to log out.");
//     }
//   };

//   const handleEditClick = () => {
//     navigation.navigate("Profile");
//   };

//   return (
//     <View
//       className="flex-1 bg-white "
//       style={{ paddingHorizontal: wp(6), paddingVertical: hp(2) }}
//     >
//       {/* Back Button */}
//       <TouchableOpacity onPress={() => navigation.goBack()} className="">
//         <AntDesign name="left" size={24} color="#000502" />
//       </TouchableOpacity>

//       {/* Profile Card */}
//       <View className="flex-row items-center p-2 mt-4  mb-4">
//         <Image
//           source={require("../assets/images/mprofile.png")}
//           className="w-16 h-16 rounded-full mr-3"
//         />
//         <View className="flex-1">
//           <Text className="text-lg mb-1">
//           {profile?.firstNameEnglish} {profile?.lastNameEnglish}
//           </Text>
//           <Text className="text-sm text-gray-500">{profile?.companyName}</Text>
//         </View>
//         <TouchableOpacity onPress={handleEditClick}>
//           <Ionicons name="create-outline" size={30} color="#2fcd46" />
//         </TouchableOpacity>
//       </View>

//       <View className="flex-1 p-4">
//         {/* Horizontal Line */}
//         <View className="h-0.5 bg-[#D2D2D2] my-4" />

//         {/* Language Settings */}
//         <TouchableOpacity
//           onPress={() => setLanguageDropdownOpen(!isLanguageDropdownOpen)}
//           className="flex-row items-center py-3"
//         >
//           <Ionicons name="globe-outline" size={20} color="black" />
//           <Text className="flex-1 text-lg ml-2">Language Settings</Text>
//           <Ionicons
//             name={isLanguageDropdownOpen ? "chevron-up" : "chevron-down"}
//             size={20}
//             color="black"
//           />
//         </TouchableOpacity>

//         {isLanguageDropdownOpen && (
//           <View className="pl-8">
//             {["English", "Tamil", "Sinhala"].map((language) => (
//               <TouchableOpacity
//                 key={language}
//                 onPress={() => handleLanguageSelect(language)}
//                 className={`flex-row items-center py-2 px-4 rounded-lg my-1 ${selectedLanguage === language ? "bg-green-100" : "bg-transparent"}`}
//               >
//                 <Text
//                   className={`text-base ${selectedLanguage === language ? "text-black" : "text-gray-500"}`}
//                 >
//                   {language}
//                 </Text>
//                 {selectedLanguage === language && (
//                   <View className="absolute right-4">
//                     <Ionicons name="checkmark" size={20} color="black" />
//                   </View>
//                 )}
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         {/* Horizontal Line */}
//         <View className="h-0.5 bg-[#D2D2D2] my-4" />

//         {/* View My QR Code */}
//         <TouchableOpacity
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             paddingVertical: 12,
//           }}
//           onPress={() => navigation.navigate("OfficerQr")}
//         >
//           <Ionicons name="qr-code" size={20} color="black" />
//           <Text className="flex-1 text-lg ml-2">View My QR Code</Text>
//         </TouchableOpacity>

//         {/* Horizontal Line */}
//         <View className="h-0.5 bg-[#D2D2D2] my-4" />

//         {/* Change Password */}
//         <TouchableOpacity
//           className="flex-row items-center py-3"
//           onPress={() =>
//             navigation.navigate("ChangePassword", { empid } as any)
//           }
//         >
//           <Ionicons name="lock-closed-outline" size={20} color="black" />
//           <Text className="flex-1 text-lg ml-2">Change Password</Text>
//         </TouchableOpacity>

//         {/* Horizontal Line */}

//         {/* <View className="h-0.5 bg-[#D2D2D2] my-4" />

// <TouchableOpacity
//   className="flex-row items-center py-3"
//   onPress={() => setModalVisible(true)}
// >
//   <Ionicons name="person" size={20} color="black" />
//   <Text className="flex-1 text-lg ml-2">
//     {t("Profile.PlantCareHelp")}
//   </Text>
// </TouchableOpacity> */}

//         <View className="h-0.5 bg-[#D2D2D2] my-4" />

//         <TouchableOpacity
//           onPress={() => setComplaintDropdownOpen(!isComplaintDropdownOpen)}
//           className="flex-row items-center py-3"
//         >
//           <AntDesign name="warning" size={20} color="black" />
//           <Text className="flex-1 text-lg ml-2">{t("Complaints")}</Text>
//           <Ionicons
//             name={isComplaintDropdownOpen ? "chevron-up" : "chevron-down"}
//             size={20}
//             color="black"
//           />
//         </TouchableOpacity>

//         {isComplaintDropdownOpen && (
//           <View className="pl-8">
//             {complaintOptions.map((complaint) => (
//               <TouchableOpacity
//                 key={complaint}
//                 onPress={() => handleComplaintSelect(complaint)}
//                 className={`flex-row items-center py-2 px-4 rounded-lg my-1 ${
//                   selectedComplaint === complaint ? "bg-green-200" : ""
//                 }`}
//               >
//                 <Text
//                   className={`text-base ${
//                     selectedComplaint === complaint
//                       ? "text-black"
//                       : "text-gray-700"
//                   }`}
//                 >
//                   {complaint}
//                 </Text>
//                 {selectedComplaint === complaint && (
//                   <View className="absolute right-4">
//                     <Ionicons name="checkmark" size={20} color="black" />
//                   </View>
//                 )}
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         <View className="h-0.5 bg-[#D2D2D2] my-4" />

//         {/* Logout */}
//         <TouchableOpacity
//           className="flex-row items-center py-3"
//           onPress={handleLogout}
//         >
//           <Ionicons name="log-out-outline" size={20} color="red" />
//           <Text className="flex-1 text-lg ml-2 text-red-500">Logout</Text>
//         </TouchableOpacity>

//         {/* Modal for Call */}
//         <Modal
//           transparent={true}
//           visible={isModalVisible}
//           animationType="fade"
//           onRequestClose={() => setModalVisible(false)}
//         >
//           <View className="flex-1 justify-center items-center bg-black opacity-50">
//             <View className="bg-white p-6 rounded-lg shadow-lg w-80">
//               <View className="flex-row justify-center mb-4">
//                 <View className="bg-gray-200 rounded-full p-4">
//                   <Image
//                     source={require("../assets/images/ringer.png")} // Replace with your call ringing PNG path
//                     className="w-16 h-16"
//                   />
//                 </View>
//               </View>
//               <Text className="text-xl font-bold text-center mb-2">
//                 Need Help?
//               </Text>
//               <Text className="text-lg text-center mb-4">
//                 Need PlantCare help? Tap Call for instant support from our Help
//                 Center.
//               </Text>
//               <View className="flex-row justify-around">
//                 <TouchableOpacity
//                   onPress={() => setModalVisible(false)}
//                   className="bg-gray-200 p-3 rounded-full flex-1 mx-2"
//                 >
//                   <Text className="text-center">Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={handleCall}
//                   className="bg-green-500 p-3 rounded-full flex-1 mx-2"
//                 >
//                   <Text className="text-center text-white">Call</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </View>
//   );
// };

// export default EngProfile;
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import environment from "../environment/environment";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import socket from "@/services/socket";

type EngProfileNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EngProfile"
>;

interface EngProfileProps {
  navigation: EngProfileNavigationProp;
}

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

interface UserProfile {
  firstNameEnglish: string;
  lastNameEnglish: string;
  companyName: string;
}


const EngProfile: React.FC<EngProfileProps> = ({ navigation }) => {
  const [isLanguageDropdownOpen, setLanguageDropdownOpen] =
    useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [empid, setEmpid] = useState<string>("");
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(
    null
  );
  const [isComplaintDropdownOpen, setComplaintDropdownOpen] =
    useState<boolean>(false);
  const { t } = useTranslation();

  const route = useRoute();
  const currentScreen = route.name;
  const handleBackPress = () => {
    if (currentScreen === "EngProfile") {
      navigation.reset({
        index: 0,  
        routes: [{ name: "Main" }],  
      });
    } else {
      navigation.goBack();
    }
  };
  const complaintOptions = [t("Report Complaint"), t("View Complaint History")];

  const handleComplaintSelect = (complaint: string) => {
    setComplaintDropdownOpen(false);

    if (complaint === t("Report Complaint")) {
      navigation.navigate("ComplainPage" as any, { userId: 0 });
    } else if (complaint === t("View Complaint History")) {
      navigation.navigate("Main",{screen:"ComplainHistory" });
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const response = await api.get("api/collection-officer/user-profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProfile(response.data.data);
          console.log("Profile data:", response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setLanguageDropdownOpen(false);
  };

  const handleCall = () => {
    const phoneNumber = "+1234567890"; // Replace with the actual number
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert("Error", "Unable to open dialer.");
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const handleLogout = async () => {
    try {
      // Disconnect the socket connection
      if (socket.connected) {
        socket.disconnect();
        console.log("Socket disconnected.");
      }
  
      // Remove the token and empId from AsyncStorage (or any storage you're using)
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("empId");  // Remove the empId as well
  
      // Optionally, you can also remove it from your app's state (if stored there)
      // setEmpId(null);  // Clear empId from the app's state (if using useState)
  
      // Navigate to the Login screen
      navigation.navigate("Login");
    } catch (error) {
      console.error("An error occurred during logout:", error);
      Alert.alert("Error", "Failed to log out.");
    }
  };
  
  const handleEditClick = () => {
    navigation.navigate("Profile");
  };


  return (
    <View
      className="flex-1 bg-white "
      style={{ paddingHorizontal: wp(6), paddingVertical: hp(2) }}
    >
      {/* Back Button */}
      <TouchableOpacity onPress={() => handleBackPress()} className="">
        <AntDesign name="left" size={24} color="#000502" />
      </TouchableOpacity>

      {/* Profile Card */}
      <View className="flex-row items-center p-2 mt-4  mb-4">
        <Image
          source={require("../assets/images/mprofile.png")}
          className="w-16 h-16 rounded-full mr-3"
        />
        <View className="flex-1">
          <Text className="text-lg mb-1">
          {profile?.firstNameEnglish} {profile?.lastNameEnglish}
          </Text>
          <Text className="text-sm text-gray-500">{profile?.companyName}</Text>
        </View>
        <TouchableOpacity onPress={handleEditClick}>
          <Ionicons name="create-outline" size={30} color="#2fcd46" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 p-4">
        {/* Horizontal Line */}
        <View className="h-0.5 bg-[#D2D2D2] my-4" />

        {/* Language Settings */}
        <TouchableOpacity
          onPress={() => setLanguageDropdownOpen(!isLanguageDropdownOpen)}
          className="flex-row items-center py-3"
        >
          <Ionicons name="globe-outline" size={20} color="black" />
          <Text className="flex-1 text-lg ml-2">Language Settings</Text>
          <Ionicons
            name={isLanguageDropdownOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="black"
          />
        </TouchableOpacity>

        {isLanguageDropdownOpen && (
          <View className="pl-8">
            {["English", "Tamil", "Sinhala"].map((language) => (
              <TouchableOpacity
                key={language}
                onPress={() => handleLanguageSelect(language)}
                className={`flex-row items-center py-2 px-4 rounded-lg my-1 ${selectedLanguage === language ? "bg-green-100" : "bg-transparent"}`}
              >
                <Text
                  className={`text-base ${selectedLanguage === language ? "text-black" : "text-gray-500"}`}
                >
                  {language}
                </Text>
                {selectedLanguage === language && (
                  <View className="absolute right-4">
                    <Ionicons name="checkmark" size={20} color="black" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Horizontal Line */}
        <View className="h-0.5 bg-[#D2D2D2] my-4" />

        {/* View My QR Code */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
          }}
          onPress={() => navigation.navigate("OfficerQr")}
        >
          <Ionicons name="qr-code" size={20} color="black" />
          <Text className="flex-1 text-lg ml-2">View My QR Code</Text>
        </TouchableOpacity>

        {/* Horizontal Line */}
        <View className="h-0.5 bg-[#D2D2D2] my-4" />

        {/* Change Password */}
        <TouchableOpacity
          className="flex-row items-center py-3"
          onPress={() =>
            navigation.navigate("ChangePassword", { empid } as any)
          }
        >
          <Ionicons name="lock-closed-outline" size={20} color="black" />
          <Text className="flex-1 text-lg ml-2">Change Password</Text>
        </TouchableOpacity>

        {/* Horizontal Line */}

        {/* <View className="h-0.5 bg-[#D2D2D2] my-4" />

<TouchableOpacity
  className="flex-row items-center py-3"
  onPress={() => setModalVisible(true)}
>
  <Ionicons name="person" size={20} color="black" />
  <Text className="flex-1 text-lg ml-2">
    {t("Profile.PlantCareHelp")}
  </Text>
</TouchableOpacity> */}

        <View className="h-0.5 bg-[#D2D2D2] my-4" />

        <TouchableOpacity
          onPress={() => setComplaintDropdownOpen(!isComplaintDropdownOpen)}
          className="flex-row items-center py-3"
        >
          <AntDesign name="warning" size={20} color="black" />
          <Text className="flex-1 text-lg ml-2">{t("Complaints")}</Text>
          <Ionicons
            name={isComplaintDropdownOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="black"
          />
        </TouchableOpacity>

        {isComplaintDropdownOpen && (
          <View className="pl-8">
            {complaintOptions.map((complaint) => (
              <TouchableOpacity
                key={complaint}
                onPress={() => handleComplaintSelect(complaint)}
                className={`flex-row items-center py-2 px-4 rounded-lg my-1 ${
                  selectedComplaint === complaint ? "bg-green-200" : ""
                }`}
              >
                <Text
                  className={`text-base ${
                    selectedComplaint === complaint
                      ? "text-black"
                      : "text-gray-700"
                  }`}
                >
                  {complaint}
                </Text>
                {selectedComplaint === complaint && (
                  <View className="absolute right-4">
                    <Ionicons name="checkmark" size={20} color="black" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View className="h-0.5 bg-[#D2D2D2] my-4" />

        {/* Logout */}
        <TouchableOpacity
          className="flex-row items-center py-3"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="red" />
          <Text className="flex-1 text-lg ml-2 text-red-500">Logout</Text>
        </TouchableOpacity>

        {/* Modal for Call */}
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black opacity-50">
            <View className="bg-white p-6 rounded-lg shadow-lg w-80">
              <View className="flex-row justify-center mb-4">
                <View className="bg-gray-200 rounded-full p-4">
                  <Image
                    source={require("../assets/images/ringer.png")} // Replace with your call ringing PNG path
                    className="w-16 h-16"
                  />
                </View>
              </View>
              <Text className="text-xl font-bold text-center mb-2">
                Need Help?
              </Text>
              <Text className="text-lg text-center mb-4">
                Need PlantCare help? Tap Call for instant support from our Help
                Center.
              </Text>
              <View className="flex-row justify-around">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="bg-gray-200 p-3 rounded-full flex-1 mx-2"
                >
                  <Text className="text-center">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCall}
                  className="bg-green-500 p-3 rounded-full flex-1 mx-2"
                >
                  <Text className="text-center text-white">Call</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default EngProfile;
