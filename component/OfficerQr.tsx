import React, { useRef, useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import QRCode from "react-native-qrcode-svg";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { captureRef } from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import axios from "axios";
import {environment} from "../environment/environment";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type OfficerQrNavigationProps = StackNavigationProp<
  RootStackParamList,
  "OfficerQr"
>;

interface OfficerQrProps {
  navigation: OfficerQrNavigationProps;
}

const OfficerQr: React.FC<OfficerQrProps> = ({ navigation }) => {
  const qrCodeRef = useRef<any>(null);
  const [qrValue, setQrValue] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [jobRole, setJobRole] = useState<string>("");
  const [QR, setQR] = useState<string>("");
   const { t } = useTranslation();

  const fetchRegistrationDetails = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Error", "No token found");
      return;
    }

    const response = await api.get("api/collection-officer/user-profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response.data.data;
    console.log(data);

    if (response.data.status === "success") {
      setFirstName(data.firstNameEnglish || "");
      setLastName(data.lastNameEnglish || "");
      setCompanyName(data.companyName || "");
      setJobRole(data.jobRole || "");
      setQR(data.QRcode || ""); // Store QR Code URL
    } else {
      Alert.alert("Error", response.data.message);
    }
  } catch (error) {
    console.error("Error fetching registration details:", error);
    Alert.alert(t("Error.error"), t("Error.Failed to fetch details"));
  }
};

useEffect(() => {
      fetchRegistrationDetails();
    }, []);
  

const downloadQRCode = async () => {
  try {
    if (!QR) {
      Alert.alert(t("Error.error"), t("Error.No QR Code available."));
      return;
    }

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Gallery access is required to save QR Code.");
      return;
    }

    const fileUri = `${FileSystem.documentDirectory}QRCode_${Date.now()}.png`;

    // Download the QR code image from the URL
    const response = await FileSystem.downloadAsync(QR, fileUri);

    // Save to media library
    const asset = await MediaLibrary.createAssetAsync(response.uri);
    await MediaLibrary.createAlbumAsync("Download", asset, false);

    Alert.alert("Success", "QR Code saved to gallery.");
  } catch (error) {
    console.error("Download error:", error);
    Alert.alert(t("Error.error"), t("Error.failedSaveQRCode"));
  }
};

  
const shareQRCode = async () => {
  try {
    if (!QR) {
      Alert.alert(t("Error.error"), t("Error.No QR Code available."));
      return;
    }

    const fileUri = `${FileSystem.documentDirectory}QRCode_${Date.now()}.png`;

    // Download the QR code image from the URL
    const response = await FileSystem.downloadAsync(QR, fileUri);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(response.uri, {
        mimeType: "image/png",
        dialogTitle: "Share QR Code",
      });
    } else {
      Alert.alert("Sharing Unavailable", "Sharing is not available on this device.");
    }
  } catch (error) {
    console.error("Share error:", error);
    Alert.alert("Error", t("Error.Failed to share QR Code."));
  }
};


  return (
  
    <View
      className="flex-1 bg-white"
      style={{ paddingHorizontal: wp(6), paddingVertical: hp(2) }}
    >
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => navigation.goBack()} className="">
          <AntDesign name="left" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-bold text-black">
          {t("OfficerQr.QRCode")}
        </Text>
      </View>
      <ScrollView>
      {/* QR Code Display */}
      <View className="items-center mb-4 mt-5">
  {QR ? (
    <View className="bg-white p-2 rounded-xl border-2 border-[#2AAD7A]">
      <Image source={{ uri: QR }} style={{ width: 230, height: 230, resizeMode: "contain" }} />
    </View>
  ) : (
    <Text className="text-gray-500 text-center mt-4">{t("OfficerQr.Noavailable")}</Text>
  )}
</View>


      {/* Profile Info */}
      <View className="flex-row items-center justify-center mb-4 px-4 mt-[9sssssss%]">
        <Image
          source={require("../assets/images/profile.webp")}
          className="w-20 h-20 rounded-full border-2 border-gray-300 mr-4"
        />
        <View>
          <Text className="text-lg font-semibold">{`${firstName} ${lastName}`}</Text>
          <Text className="text-gray-600">{companyName}</Text>
          <Text className="text-gray-500">{jobRole}</Text>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row justify-evenly mt-[50px] mb-4">
        <TouchableOpacity
          className="bg-[#2AAD7A] w-24 h-20 rounded-lg items-center justify-center flex-col mx-2"
          onPress={downloadQRCode}
        >
          <MaterialIcons name="download" size={24} color="white" />
          <Text className="text-white text-xs mt-1">{t("OfficerQr.Download")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-[#2AAD7A] w-24 h-20 rounded-lg items-center justify-center flex-col mx-2"
          onPress={shareQRCode}
        >
          <MaterialIcons name="share" size={24} color="white" />
          <Text className="text-white text-xs mt-1">{t("OfficerQr.Share")}</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>

  );
};

export default OfficerQr;



