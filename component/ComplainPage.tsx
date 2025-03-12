// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   Image,
//   SafeAreaView,
//   ScrollView,
// } from "react-native";
// import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import { Picker } from "@react-native-picker/picker";
// import { StackNavigationProp } from "@react-navigation/stack";
// import { RootStackParamList } from "./types";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import environment from "../environment/environment";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import { useFocusEffect } from "@react-navigation/native";
// import AntDesign from "react-native-vector-icons/AntDesign";
// const api = axios.create({
//   baseURL: environment.API_BASE_URL,
// });
// import { useTranslation } from "react-i18next";

// type ComplainPageNavigationProps = StackNavigationProp<
//   RootStackParamList,
//   "ComplainPage"
// >;

// interface ComplainPageProps {
//   navigation: ComplainPageNavigationProps;
// }

// const ComplainPage: React.FC<ComplainPageProps> = () => {
//   const navigation = useNavigation();
//   const route = useRoute<RouteProp<RootStackParamList, "ComplainPage">>();
//   const { userId } = route.params;
//   const { t } = useTranslation();
//   const [complain, setComplain] = useState<string>("");
//   const [selectedLanguage, setSelectedLanguage] = useState("");
//   const [complainText, setComplainText] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
//     undefined
//   );
//   const [language, setLanguage] = useState("en");
//   const [userRole, setUserRole] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchUserRole = async () => {
  //     try {
  //       const role = await AsyncStorage.getItem("jobRole");
  //       setUserRole(role);
  //       console.log("User role:", role);
  //     } catch (error) {
  //       console.error("Error fetching user role:", error);
  //     }
  //   };

  //   fetchUserRole();
  // }, []);

//   // const handleSubmit = async () => {
//   //   if (!complain) {
//   //     Alert.alert("Error", "Please select a language and add your complaint.");
//   //     return;
//   //   }
//   //   const storedLanguage = await AsyncStorage.getItem("@user_language");
//   //   if (storedLanguage) {
//   //     setLanguage(storedLanguage);
//   //   }
//   //   console.log(selectedCategory);
//   //   try {
//   //     const token = await AsyncStorage.getItem("token"); // Retrieve token if using authentication
//   //     const response = await api.post(
//   //       "api/auth/farmer-complaint", // Adjust this endpoint based on your backend route
//   //       {
//   //         complain: complain,
//   //         language: storedLanguage,
//   //         category: selectedCategory,
//   //         userId,
//   //       },
//   //       {
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       }
//   //     );

//   //     // Handle successful response
//   //     Alert.alert(
//   //       "Submitted",
//   //       `Your complaint has been registered with reference: ${response.data.refNo}`
//   //     );
//   //     setComplain("");

//   //     navigation.goBack();
//   //   } catch (error) {
//   //     console.error("Error submitting complaint:", error);
//   //     Alert.alert("Error", "Failed to submit complaint. Please try again.");
//   //   }
//   // };

//   const handleSubmit = async () => {
//     if (!complain || !selectedCategory) {
//       Alert.alert("Error", "Please select a category and add your complaint.");
//       return;
//     }
  
//     try {
//       const storedLanguage = await AsyncStorage.getItem("@user_language");
//       if (storedLanguage) {
//         setLanguage(storedLanguage);
//       }
  
//       const token = await AsyncStorage.getItem("token"); // Retrieve token if using authentication
  
//       let response;
  
//       if (userId === 0) {
//         response = await api.post(
//           "api/auth/officer-complaint", // Adjust this endpoint based on your backend route
//           {
//             complain,
//             language: storedLanguage,
//             category: selectedCategory,
//           },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//       } else {
//         response = await api.post(
//           "api/auth/farmer-complaint", 
//           {
//             complain,
//             language: storedLanguage,
//             category: selectedCategory,
//             userId,
//           },
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//       }
  
//       Alert.alert(
//         "Submitted",
//         `Your complaint has Submit successfuly!:`
//       );
//       setComplain("");
//       setSelectedCategory(undefined);
//       navigation.goBack();
//     } catch (error) {
//       console.error("Error submitting complaint:", error);
//       Alert.alert("Error", "Failed to submit complaint. Please try again.");
//     }
//   };
  

//   return (
//     // <ScrollView 
//     //   className="flex-1 bg-[#F9F9FA] "
//     //   style={{ paddingHorizontal: wp(6), paddingVertical: hp(2) }}
//     // >
//     //   <View className="flex-row items-center  mb-6">
//     //     <TouchableOpacity onPress={() => navigation.goBack()} className="">
//     //       <AntDesign name="left" size={24} color="#000" />
//     //     </TouchableOpacity>
//     //   </View>
//     //     <View className="items-center pb-20">
//     //       <Image
//     //         source={require("../assets/images/complain1.png")}
//     //         className="w-36 h-36 "
//     //         resizeMode="contain"
//     //       />

//     //       <View className="w-[90%] items-center p-6 shadow-2xl bg-[#FFFFFF] rounded-xl">
//     //         <View className="flex-row ">
//     //           <Text className="text-2xl font-semibold text-center mb-4 color-[#424242]">
//     //             {t("Tellus")}
//     //           </Text>
//     //           <Text className="text-2xl font-semibold text-center mb-4 pl-2 color-[#D72C62]">
//     //             {t("Problem")}
//     //           </Text>
//     //         </View>

//     //         <View className="w-full border border-gray-300 rounded-lg bg-white mb-4">
//     //           <Picker
//     //             selectedValue={selectedCategory}
//     //             onValueChange={(itemValue) => setSelectedCategory(itemValue)}
//     //           >
//     //             <Picker.Item
//     //               label={t("select Category")}
//     //               value=""
//     //             />
//     //             <Picker.Item
//     //               label={t("Finance")}
//     //               value="Finance"
//     //             />
//     //             <Picker.Item
//     //               label={t("collection")}
//     //               value="Collection"
//     //             />
//     //             <Picker.Item
//     //               label={t("Agro Input Suplire")}
//     //               value="Agro Input Supplier"
//     //             />
//     //           </Picker>
//     //         </View>

//     //         <Text className="text-sm text-gray-600 text-center mb-4">
//     //           {t("We will respond to you within two days of receiving your message")}
//     //         </Text>

//     //         <TextInput
//     //           className="w-full h-52 border border-gray-300 rounded-lg p-3 bg-white mb-8 text-gray-800 "
//     //           placeholder={t("Kindly submit")}
//     //           multiline
//     //           value={complain}
//     //           onChangeText={(text) => setComplain(text)}
//     //           style={{ textAlignVertical: "top" }}
//     //         />

//     //         <TouchableOpacity
//     //           className="w-full bg-gray-800 py-4 rounded-lg items-center  "
//     //           onPress={handleSubmit}
//     //         >
//     //           <Text className="text-white font-bold text-lg">
//     //             {t("Submit")}
//     //           </Text>
//     //         </TouchableOpacity>
//     //       </View>
//     //     </View>
//     // </ScrollView >
//     <SafeAreaView className="flex-1 bg-[#F9F9FA]pb-20">
//     <View className=" absolute z-10 ">
//       <AntDesign
//         name="left"
//         size={24}
//         color="#000000"
//         onPress={() => navigation.goBack()}
//         style={{ paddingHorizontal: wp(4), paddingVertical: hp(2) }}
//       />
//     </View>
//     <ScrollView className="flex-1 ">
//       <View className="items-center p-2 pb-20">
//         <Image
//           source={require("../assets/images/complain1.png")}
//           className="w-36 h-36 "
//           resizeMode="contain"
//         />

//         <View className="w-[90%] items-center p-6 shadow-2xl bg-[#FFFFFF] rounded-xl">
//           <View className="flex-row ">
//             <Text className="text-2xl font-semibold text-center mb-4 color-[#424242]">
//              Tell us the
//             </Text>
//             <Text className="text-2xl font-semibold text-center mb-4 pl-2 color-[#D72C62]">
//              Problem
//             </Text>
//           </View>

//           <View className="w-full border border-gray-300 rounded-lg bg-white mb-4">
//             <Picker
//               selectedValue={selectedCategory}
//               onValueChange={(itemValue) => setSelectedCategory(itemValue)}
//             >
//               <Picker.Item
//                 label={t("ReportComplaint.selectCategory")}
//                 value=""
//               />
//               <Picker.Item
//                 label={t("ReportComplaint.Finance")}
//                 value="Finance"
//               />
//               <Picker.Item
//                 label={t("ReportComplaint.collection")}
//                 value="Collection"
//               />
//               <Picker.Item
//                 label={t("ReportComplaint.AgroInputSuplire")}
//                 value="Agro Input Supplier"
//               />
//             </Picker>
//           </View>

//           <Text className="text-sm text-gray-600 text-center mb-4 color-[#959595]">
//             {/* {t("ReportComplaint.WewilRespond")} */}
//             We will get back to the farmer within 2 days after hearing from you
//           </Text>

//           <TextInput
//             className="w-full h-52 border border-gray-300 rounded-lg p-3 bg-white mb-8 text-gray-800 "
//             placeholder={t("ReportComplaint.Kindlysubmit")}
//             multiline
//             value={complain}
//             onChangeText={(text) => setComplain(text)}
//             style={{ textAlignVertical: "top" }}
//           />

//           <TouchableOpacity
//             className="w-full bg-[#2AAD7A] py-3 rounded-full items-center  "
//             onPress={handleSubmit}
//           >
//             <Text className="text-white font-bold text-lg">
//               {/* {t("ReportComplaint.Submit")} */}
//               Submit
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   </SafeAreaView>
//   );
// };

// export default ComplainPage;


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {environment }from '@/environment/environment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AntDesign } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import DropDownPicker from "react-native-dropdown-picker";
import { use } from "i18next";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
const api = axios.create({
  baseURL: environment.API_BASE_URL,
});
type ComplainPageNavigationProps = StackNavigationProp<
  RootStackParamList,
  "ComplainPage"
>;

interface ComplainPageProps {
  navigation: ComplainPageNavigationProps;
}

const ComplainPage: React.FC<ComplainPageProps> = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "ComplainPage">>();
  const { userId } = route.params;
  console.log("User ID:", userId);
  const [complain, setComplain] = useState<string>("");
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [Category, setCategory] = useState<{ value: string; label: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem("jobRole");
        setUserRole(role);
        console.log("User role:", role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);
          
  useEffect(() => {
    let appName = "";
    if (userId === 0) {
      appName = "CollectionOfficer";
    } else {
      appName = "PlantCare";
    }

    console.log("appName", appName);
    const selectedLanguage = t("ReportComplaint.LNG");
    setLanguage(selectedLanguage);
    console.log("slect", selectedLanguage);
    const fetchComplainCategory = async () => {
      try {
        const response = await axios.get(
          `${environment.API_BASE_URL}api/complain/get-complain-category/${appName}`
        );
        if (response.data.status === "success") {
          console.log(response.data.data);

          // Determine which language field to use
          const categoryField =
            selectedLanguage === "en"
              ? "categoryEnglish"
              : selectedLanguage === "si"
              ? "categorySinhala"
              : selectedLanguage === "ta"
              ? "categoryTamil"
              : "categoryEnglish";

          const mappedCategories = response.data.data
            .map((item: any) => {
              const categoryValue =
                item[categoryField] || item["categoryEnglish"];
              return {
                value: item.id,
                label: categoryValue,
              };
            })
            .filter((item: { value: any }) => item.value);

          setCategory(mappedCategories);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchComplainCategory();
  }, [t]);

  // useEffect(() => {
  //   const fetchToken = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("userToken");
  //       if (token) {
  //         setAuthToken(token);
  //       }
  //     } catch (error) {
  //       console.error(t("PublicForum.tokenFetchFailed"), error);
  //     }
  //   };

  //   fetchToken();
  // }, []);

  const handleSubmit = async () => {
    if (!complain || !selectedCategory) {
     Alert.alert(t("Error.error"), t("Error.Please select a category and add your complaint."));
      return;
    }
  
    try {
      const storedLanguage = await AsyncStorage.getItem("@user_language");
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
  
      const token = await AsyncStorage.getItem("token"); // Retrieve token if using authentication
  
      let response;
  
      if (userId === 0) {
        response = await api.post(
          "api/complain/officer-complaint", // Adjust this endpoint based on your backend route
          {
            complain,
            language: storedLanguage,
            category: selectedCategory,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        response = await api.post(
          "api/complain/farmer-complaint", 
          {
            complain,
            language: storedLanguage,
            category: selectedCategory,
            userId,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
  
      Alert.alert(
        "Submitted",
        `Your complaint has Submit successfuly!:`
      );
      setComplain("");
      setSelectedCategory(null);
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting complaint:", error);
      Alert.alert(t("Error.error"), t("Error.Failed to submit complaint"));
    }
  };

  // const category = [
  //   {
  //     value: "Finance",
  //     label:t("ReportComplaint.Finance")
  //   },
  //   {
  //     value: "Agriculture",
  //     label:t("ReportComplaint.Agriculture")
  //   },
  //   {
  //     label:t("ReportComplaint.Call Center"),
  //     value:"Call Center"
  //   },
  //   {
  //     label:t("ReportComplaint.Procuiment"),
  //     value:"Procuiment"
  //   },
  //   {
  //     label:t("ReportComplaint.Other"),
  //     value:"Other"
  //   }
  // ];

  function dismissKeyboard(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 bg-[#FFFFFF]pb-20">
        <View className=" absolute z-10 ">
          <AntDesign
            name="left"
            size={24}
            color="#000000"
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: wp(4), paddingVertical: hp(2) }}
          />
        </View>
        <ScrollView className="flex-1 " keyboardShouldPersistTaps="handled">
          <View className="items-center p-2 pb-20">
            <Image
              source={require("../assets/images/complain.webp")}
              className="w-36 h-36 "
              resizeMode="contain"
            />

            <View className="w-[90%] items-center p-6 shadow-2xl bg-[#FFFFFF] rounded-xl">
              <View className="flex-row ">
                <Text className="text-2xl font-semibold text-center mb-4 color-[#424242]">
                  {t("ReportComplaint.Tellus")}
                </Text>
                <Text className="text-2xl font-semibold text-center mb-4 pl-2 color-[#D72C62]">
                  {t("ReportComplaint.Problem")}
                </Text>
              </View>

              <View className="w-full rounded-lg mb-4">
                {Category.length > 0 && (
                  <DropDownPicker
                    open={open}
                    value={selectedCategory} // Assuming complain value is for category
                    setOpen={setOpen}
                    setValue={setSelectedCategory} // Here it updates the complain value, which represents the selected category
                    items={Category.map((item) => ({
                      label: t(item.label), // Apply translation here
                      value: item.value, // Keep the value as it is from Category
                    }))}
                    placeholder={t("ReportComplaint.selectCategory")}
                    placeholderStyle={{ color: "#d1d5db" }}
                    listMode="SCROLLVIEW"
                    zIndex={3000}
                    zIndexInverse={1000}
                    dropDownContainerStyle={{
                      borderColor: "#ccc",
                      borderWidth: 1,
                    }}
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      paddingHorizontal: 8,
                      paddingVertical: 10,
                    }}
                    textStyle={{ fontSize: 12 }}
                    onOpen={dismissKeyboard}
                  />
                )}
              </View>

              <Text className="text-sm text-gray-600 text-center mb-4">
                {t("ReportComplaint.WewilRespond")}
              </Text>

              <TextInput
                className="w-full h-52 border border-gray-300 rounded-lg p-3 bg-white mb-8 text-gray-800 "
                placeholder={t("ReportComplaint.Kindlysubmit")}
                multiline
                value={complain}
                onChangeText={(text) => setComplain(text)}
                onFocus={() => setOpen(false)}
                style={{ textAlignVertical: "top" }}
              />

              <TouchableOpacity
                className="w-full bg-[#2AAD7A] py-4 rounded-full items-center  "
                onPress={handleSubmit}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-lg">
                    {t("ReportComplaint.Submit")}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ComplainPage;
