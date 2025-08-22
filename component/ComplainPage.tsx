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
import { environment } from "@/environment/environment";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AntDesign } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import DropDownPicker from "react-native-dropdown-picker";
import { use } from "i18next";
import { useFocusEffect } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import NetInfo from "@react-native-community/netinfo";
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
  const { userId, farmerLanguage } = route.params;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);
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

  const handleSubmit = async () => {
    if (!complain || !selectedCategory) {
      Alert.alert(
        t("Error.error"),
        t("Error.Please select a category and add your complaint.")
      );
      return;
    }

  const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
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
            language: farmerLanguage,
            category: selectedCategory,
            userId,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      Alert.alert(
        t("Error.Success"),
        t("Error.Your complaint has Submit successfuly")
      );
      setComplain("");
      setSelectedCategory(null);
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting complaint:", error);
      Alert.alert(t("Error.error"), t("Error.somethingWentWrong"));
    }
  };

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
        {loading ? (
          // Lottie Loader displays for 2 seconds
          <View className="flex-1 justify-center items-center">
            <LottieView
              source={require("../assets/lottie/newLottie.json")}
              autoPlay
              loop
              style={{ width: 300, height: 300 }}
            />
          </View>
        ) : (
          <>
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
<View className="w-full rounded-full mb-4">
  {Category.length > 0 && (
    <DropDownPicker
      open={open}
      value={selectedCategory}
      setOpen={setOpen}
      setValue={setSelectedCategory}
      items={Category.map((item) => ({
        label: t(item.label),
        value: item.value,
      }))}
      placeholder={t("ReportComplaint.selectCategory")}
      placeholderStyle={{ color: "#434343" }}
      listMode="SCROLLVIEW"
      zIndex={3000}
      zIndexInverse={1000}
      dropDownContainerStyle={{
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 25,
      }}
      style={{
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderRadius: 25,
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
  className="w-full h-60 border border-[#F6F6F6] rounded-lg p-3 bg-[#F6F6F6] mb-8"
  placeholder={t("ReportComplaint.Kindlysubmit")}
  placeholderTextColor="#434343" // ✅ Correct prop
  multiline
  value={complain}
  onChangeText={(text) => setComplain(text)}
  onFocus={() => setOpen(false)}
  style={{
    textAlignVertical: "top",
    color: "#424242", // ✅ Set actual input text color here
  }}
/>


                  <TouchableOpacity
                    className="w-full bg-[#000000] py-4 rounded-full items-center  "
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
          </>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ComplainPage;
