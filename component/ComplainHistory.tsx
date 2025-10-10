import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { environment } from "@/environment/environment";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";
import LottieView from "lottie-react-native";

interface complainItem {
  id: number;
  createdAt: string;
  complain: string;
  language: string;
  complainCategory: string;
  status: "Opened" | "Closed";
  reply?: string;
  refNo: string;
}

type ComplainHistoryNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ComplainHistory"
>;

interface ComplainHistoryProps {
  navigation: ComplainHistoryNavigationProp;
}

const ComplainHistory: React.FC<ComplainHistoryProps> = ({ navigation }) => {
  const [complains, setComplains] = useState<complainItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [language, setLanguage] = useState("en");
  const [modalVisible, setModalVisible] = useState(false);
  const [complainReply, setComplainReply] = useState<string | null>(null);
  const { t } = useTranslation();

  const fetchComplaints = async () => {
    try {
      setLanguage(t("MyCrop.LNG"));
      const token = await AsyncStorage.getItem("token");
      console.log(token);

      const res = await axios.get<complainItem[]>(
        `${environment.API_BASE_URL}api/complain/get-complains`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComplains(res.data);
    } catch (err) {
      // Alert.alert(t("ReportHistory.sorry"), t("ReportHistory.noData"));
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchComplaints();
    }, [])
  );

  const formatDateTime = (isoDate: string) => {
    const date = new Date(isoDate);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    const minuteStr = minutes.toString().padStart(2, "0");
    const timeStr = `${hour12}.${minuteStr}${ampm}`;

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    return `${timeStr},${day} ${month} ${year}`;
  };

  const handleViewReply = (reply: string | undefined) => {
    if (reply) {
      setComplainReply(reply);
      setModalVisible(true);
    } else {
      Alert.alert(t("ReportHistory.sorry"), t("ReportHistory.NoReply"));
    }
  };

  return (
    <View className="flex-1 bg-[#FFFFFF]">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View
        className="flex-row justify-between"
        style={{ paddingHorizontal: wp(6), paddingVertical: hp(2) }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("EngProfile")}
          className="bg-[#f3f3f380] rounded-full p-2 justify-center w-10"
        >
          <AntDesign name="left" size={24} color="#000502" />
        </TouchableOpacity>

        <Text className="font-bold text-lg mt-2">
          {t("ReportHistory.Complaints")}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <LottieView
            source={require("../assets/lottie/newLottie.json")}
            autoPlay
            loop
            style={{ width: 300, height: 300 }}
          />
        </View>
      ) : complains.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <LottieView
            source={require("../assets/lottie/NoComplaints.json")}
            style={{ width: wp(50), height: hp(50) }}
            autoPlay
            loop
          />
          <Text className="text-center text-gray-600 mt-4">
            {t("ReportHistory.noData")}
          </Text>
        </View>
      ) : (
        <ScrollView
          className="p-4 flex-1 mb-14"
          contentContainerStyle={{
            paddingBottom: hp(4),
            paddingHorizontal: wp(2),
          }}
        >
          {complains.map((complain) => (
            <View
              key={complain.id}
              className="bg-white p-6 my-2 rounded-xl shadow-md border border-[#CFCFCF]"
            >
              <Text className="self-start mb-4 font-semibold">
                {t("ReportHistory.RefNo")} : {complain.refNo}
              </Text>
              <Text className="self-start mb-4 text-[#6E6E6E]">
                {t("ReportHistory.Sent")} {""}
                {formatDateTime(complain.createdAt)}
              </Text>

              <Text className="self-start mb-4">{complain.complain}</Text>
              <View className="flex-row justify-between items-center">
                {complain.status === "Closed" && (
                  <TouchableOpacity
                    className="bg-black px-3 py-2 rounded"
                    onPress={() => handleViewReply(complain.reply)}
                  >
                    <Text className="text-white text-xs">
                      {t("ReportHistory.View")}
                    </Text>
                  </TouchableOpacity>
                )}
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text
                    className={`text-s font-semibold px-4 py-2 rounded ${
                      complain.status === "Opened"
                        ? "bg-blue-100 text-[#0051FF]"
                        : "bg-[#FFDFF7] text-[#980775]"
                    }`}
                  >
                    {complain.status === "Opened"
                      ? t("ReportHistory.Opened")
                      : t("ReportHistory.Closed")}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent={false}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View className="flex-1 bg-[#FFFFFF]">
          <View 
            className="flex-1"
            style={{ 
              paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
              paddingBottom: Platform.OS === 'android' ? 20 : 0,
            }}
          >
            <View className="flex-1" style={{ padding: wp(4) }}>
              <View className="p-4 bg-white rounded-xl w-full mb-4">
                <Text className="text-lg font-bold">{t("Thank You")}</Text>
                <ScrollView className="mt-8" style={{ maxHeight: hp(55) }}>
                  <Text className="pb-4">{complainReply || "Loading..."}</Text>
                </ScrollView>
              </View>

              <View className="mt-auto" style={{ paddingBottom: 20 }}>
                <TouchableOpacity
                  className="bg-black py-4 rounded-lg items-center"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-white text-lg">
                    {t("ReportHistory.Closed")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ComplainHistory;