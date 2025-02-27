import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import environment from "../environment/environment";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useFocusEffect } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
const api = axios.create({
  baseURL: environment.API_BASE_URL,
});
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [complain, setComplain] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [complainText, setComplainText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [language, setLanguage] = useState("en");
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

  // const handleSubmit = async () => {
  //   if (!complain) {
  //     Alert.alert("Error", "Please select a language and add your complaint.");
  //     return;
  //   }
  //   const storedLanguage = await AsyncStorage.getItem("@user_language");
  //   if (storedLanguage) {
  //     setLanguage(storedLanguage);
  //   }
  //   console.log(selectedCategory);
  //   try {
  //     const token = await AsyncStorage.getItem("token"); // Retrieve token if using authentication
  //     const response = await api.post(
  //       "api/auth/farmer-complaint", // Adjust this endpoint based on your backend route
  //       {
  //         complain: complain,
  //         language: storedLanguage,
  //         category: selectedCategory,
  //         userId,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     // Handle successful response
  //     Alert.alert(
  //       "Submitted",
  //       `Your complaint has been registered with reference: ${response.data.refNo}`
  //     );
  //     setComplain("");

  //     navigation.goBack();
  //   } catch (error) {
  //     console.error("Error submitting complaint:", error);
  //     Alert.alert("Error", "Failed to submit complaint. Please try again.");
  //   }
  // };

  const handleSubmit = async () => {
    if (!complain || !selectedCategory) {
      Alert.alert("Error", "Please select a category and add your complaint.");
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
          "api/auth/officer-complaint", // Adjust this endpoint based on your backend route
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
          "api/auth/farmer-complaint", 
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
      setSelectedCategory(undefined);
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting complaint:", error);
      Alert.alert("Error", "Failed to submit complaint. Please try again.");
    }
  };
  

  return (
    // <ScrollView 
    //   className="flex-1 bg-[#F9F9FA] "
    //   style={{ paddingHorizontal: wp(6), paddingVertical: hp(2) }}
    // >
    //   <View className="flex-row items-center  mb-6">
    //     <TouchableOpacity onPress={() => navigation.goBack()} className="">
    //       <AntDesign name="left" size={24} color="#000" />
    //     </TouchableOpacity>
    //   </View>
    //     <View className="items-center pb-20">
    //       <Image
    //         source={require("../assets/images/complain1.png")}
    //         className="w-36 h-36 "
    //         resizeMode="contain"
    //       />

    //       <View className="w-[90%] items-center p-6 shadow-2xl bg-[#FFFFFF] rounded-xl">
    //         <View className="flex-row ">
    //           <Text className="text-2xl font-semibold text-center mb-4 color-[#424242]">
    //             {t("Tellus")}
    //           </Text>
    //           <Text className="text-2xl font-semibold text-center mb-4 pl-2 color-[#D72C62]">
    //             {t("Problem")}
    //           </Text>
    //         </View>

    //         <View className="w-full border border-gray-300 rounded-lg bg-white mb-4">
    //           <Picker
    //             selectedValue={selectedCategory}
    //             onValueChange={(itemValue) => setSelectedCategory(itemValue)}
    //           >
    //             <Picker.Item
    //               label={t("select Category")}
    //               value=""
    //             />
    //             <Picker.Item
    //               label={t("Finance")}
    //               value="Finance"
    //             />
    //             <Picker.Item
    //               label={t("collection")}
    //               value="Collection"
    //             />
    //             <Picker.Item
    //               label={t("Agro Input Suplire")}
    //               value="Agro Input Supplier"
    //             />
    //           </Picker>
    //         </View>

    //         <Text className="text-sm text-gray-600 text-center mb-4">
    //           {t("We will respond to you within two days of receiving your message")}
    //         </Text>

    //         <TextInput
    //           className="w-full h-52 border border-gray-300 rounded-lg p-3 bg-white mb-8 text-gray-800 "
    //           placeholder={t("Kindly submit")}
    //           multiline
    //           value={complain}
    //           onChangeText={(text) => setComplain(text)}
    //           style={{ textAlignVertical: "top" }}
    //         />

    //         <TouchableOpacity
    //           className="w-full bg-gray-800 py-4 rounded-lg items-center  "
    //           onPress={handleSubmit}
    //         >
    //           <Text className="text-white font-bold text-lg">
    //             {t("Submit")}
    //           </Text>
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    // </ScrollView >
    <SafeAreaView className="flex-1 bg-[#F9F9FA]pb-20">
    <View className=" absolute z-10 ">
      <AntDesign
        name="left"
        size={24}
        color="#000000"
        onPress={() => navigation.goBack()}
        style={{ paddingHorizontal: wp(4), paddingVertical: hp(2) }}
      />
    </View>
    <ScrollView className="flex-1 ">
      <View className="items-center p-2 pb-20">
        <Image
          source={require("../assets/images/complain1.png")}
          className="w-36 h-36 "
          resizeMode="contain"
        />

        <View className="w-[90%] items-center p-6 shadow-2xl bg-[#FFFFFF] rounded-xl">
          <View className="flex-row ">
            <Text className="text-2xl font-semibold text-center mb-4 color-[#424242]">
             Tell us the
            </Text>
            <Text className="text-2xl font-semibold text-center mb-4 pl-2 color-[#D72C62]">
             Problem
            </Text>
          </View>

          <View className="w-full border border-gray-300 rounded-lg bg-white mb-4">
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            >
              <Picker.Item
                label={t("ReportComplaint.selectCategory")}
                value=""
              />
              <Picker.Item
                label={t("ReportComplaint.Finance")}
                value="Finance"
              />
              <Picker.Item
                label={t("ReportComplaint.collection")}
                value="Collection"
              />
              <Picker.Item
                label={t("ReportComplaint.AgroInputSuplire")}
                value="Agro Input Supplier"
              />
            </Picker>
          </View>

          <Text className="text-sm text-gray-600 text-center mb-4 color-[#959595]">
            {/* {t("ReportComplaint.WewilRespond")} */}
            We will get back to the farmer within 2 days after hearing from you
          </Text>

          <TextInput
            className="w-full h-52 border border-gray-300 rounded-lg p-3 bg-white mb-8 text-gray-800 "
            placeholder={t("ReportComplaint.Kindlysubmit")}
            multiline
            value={complain}
            onChangeText={(text) => setComplain(text)}
            style={{ textAlignVertical: "top" }}
          />

          <TouchableOpacity
            className="w-full bg-[#2AAD7A] py-3 rounded-full items-center  "
            onPress={handleSubmit}
          >
            <Text className="text-white font-bold text-lg">
              {/* {t("ReportComplaint.Submit")} */}
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
  );
};

export default ComplainPage;
