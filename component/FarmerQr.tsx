import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import axios from "axios";
import { environment } from "@/environment/environment";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import FarmerQrSkeletonLoader from "./Skeleton/FarmerQrSkeletonLoader";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useFocusEffect } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useTranslation } from "react-i18next";
import { goBack } from "expo-router/build/global-state/routing";
import i18n from "@/i18n/i18n";

// Create API instance
const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type FarmerQrNavigationProp = StackNavigationProp<
  RootStackParamList,
  "FarmerQr"
>;

interface FarmerQrProps {
  navigation: FarmerQrNavigationProp;
}

type FarmerQrRouteProp = RouteProp<RootStackParamList, "FarmerQr">;

const FarmerQr: React.FC<FarmerQrProps> = ({ navigation }) => {
  const [farmerName, setFarmerName] = useState("");
  const [farmerNIC, setFarmerNIC] = useState("");
  const [farmerQRCode, setFarmerQRCode] = useState<string | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [farmerPhone, setFarmerPhone] = useState("");
  const [farmerLanguage, setFarmerLanguage] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation();

  const route = useRoute<FarmerQrRouteProp>();
  const { userId } = route.params;

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const response = await api.get(`api/farmer/register-farmer/${userId}`);
        const {
          firstName,
          lastName,
          NICnumber,
          qrCode,
          phoneNumber,
          language,
        } = response.data;
      //  console.log(response.data); 

        setFarmerName(`${firstName} ${lastName}`);
        setFarmerNIC(NICnumber);
        if (qrCode) {
          console.log("QR Code Data:", qrCode); 
          setFarmerQRCode(qrCode); 
        } else {
          console.log("No QR Code data found");
        }

        setFarmerPhone(phoneNumber);
        setFarmerLanguage(language);
        setTimeout(() => {
          setLoading(false); // Stop loading after data is ready
        }, 2000);
      } catch (error) {
        Alert.alert(
          t("Error.error"),
          t("Error.Failed to fetch farmer details")
        );
        setLoading(false);
      }
    };

    fetchFarmerData();

    // Request permissions for saving images
    const getPermissions = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setPermissionsGranted(status === "granted");
    };

    getPermissions();
  }, [userId]);

  const downloadQRCode = async () => {
    try {
      if (!farmerQRCode) {
        Alert.alert(t("Error.error"), t("Error.noQRCodeAvailable"));
        return;
      }

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "QRcode.permissionDeniedTitle",
          "QRcode.permissionDeniedMessage"
        );
        return;
      }

      const fileUri = `${FileSystem.documentDirectory}QRCode_${Date.now()}.png`;
      const response = await FileSystem.downloadAsync(farmerQRCode, fileUri);

      const asset = await MediaLibrary.createAssetAsync(response.uri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);

      Alert.alert(t("QRcode.successTitle"), t("QRcode.savedToGallery"));
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert(t("Error.error"), t("Error.failedSaveQRCode"));
    }
  };

  const shareQRCode = async () => {
    try {
      if (!farmerQRCode) {
        Alert.alert(t("Error.error"), t("Error.noQRCodeAvailable"));
        return;
      }

      const fileUri = `${FileSystem.documentDirectory}QRCode_${Date.now()}.png`;
      const response = await FileSystem.downloadAsync(farmerQRCode, fileUri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(response.uri, {
          mimeType: "image/png",
          dialogTitle: "Share QR Code",
        });
      } else {
        Alert.alert(
          t("QRcode.sharingUnavailableTitle"),
          t("QRcode.sharingUnavailableMessage")
        );
      }
    } catch (error) {
      console.error("Share error:", error);
      Alert.alert(t("Main.error"), t("QRcode.failedShareQRCode"));
    }
  };

 
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("Dashboard");
        return true; // Prevent the default behavior
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [navigation])
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        className="bg-white"
        contentContainerStyle={{
          paddingHorizontal: wp(4),
          paddingVertical: hp(2),
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false} // Optional: Hide scrollbar
      >
        <View className="flex-1 ">
          {/* Header with Back Icon */}
          <View className="flex-row items-center  mb-6">
          
             <TouchableOpacity  onPress={() => navigation.navigate("Main" as any)} className="bg-[#f3f3f380] rounded-full p-2 justify-center w-10" >
                                               <AntDesign name="left" size={24} color="#000502" />
                                             </TouchableOpacity>
            <Text className="flex-1 text-center text-xl font-bold text-black mr-[5%]">
              {t("FarmerQr.FarmerDetails")}
            </Text>
          </View>

          {/* Farmer Name and NIC */}
          {loading ? (
            <View
              className="items-center -mt-4"
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FarmerQrSkeletonLoader />
            </View>
          ) : (
            <>
              <View className="items-center mt-[4%]">
                <Text className="text-lg font-bold mb-2">{farmerName}</Text>
                <Text className="text-gray-500 mb-9">{farmerNIC}</Text>

                {/* QR Code */}
                {farmerQRCode ? (
                  <Image
                    source={{ uri: farmerQRCode }} // Display the Base64 QR code image directly
                    style={{
                      width: 300,
                      height: 300,
                      borderWidth: 1,
                      borderColor: "#FAE432",
                    }} // Adding border and dimensions
                  />
                ) : (
                  <Text className="text-red-500">
                    {t("FarmerQr.QRavailable")}
                  </Text>
                )}
              </View>

              {/* Buttons Wrapper */}
              <View className="items-center mt-8">
                {/* Collect Button */}
                {/* <TouchableOpacity className="bg-[#2AAD7A] w-[300px] py-3 rounded-full items-center" onPress={() => navigation.navigate('UnregisteredCropDetails' as any, { userId })}> */}
                <TouchableOpacity
                  className={`w-[300px] py-3 rounded-full items-center ${
                    !farmerQRCode ? "bg-gray-400" : "bg-[#000000]"
                  }`}
                  onPress={() =>
                    navigation.navigate("Main", {
                      screen: "UnregisteredCropDetails",
                      params: { userId, farmerPhone, farmerLanguage },
                    } as never)
                  }
                  disabled={!farmerQRCode}
                >
                  <Text className="text-white text-lg">
                    {t("FarmerQr.Collect")}
                  </Text>
                </TouchableOpacity>

                {/* Complain Button */}
                <TouchableOpacity
                  className="border border-[#606060] w-[300px] mt-4 py-3 rounded-full items-center"
                  onPress={() =>
                    navigation.navigate("ComplainPage" as any, {
                      farmerName,
                      farmerPhone,
                      userId,
                      farmerLanguage,
                    })
                  }
                  disabled={!farmerQRCode}
                >
                  <Text className="text-gray-700 text-lg">
                    {t("FarmerQr.ReportComplain")}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Download and Share buttons */}
              <View className="flex-row justify-around w-full mt-6">
                <TouchableOpacity
                  className="bg-[#000000] p-4 h-[80px] w-[120px] rounded-lg items-center"
                  onPress={downloadQRCode}
                >
                  <Image
                    source={require("../assets/images/download.webp")} // Path to download icon
                    style={{ width: 24, height: 24 }}
                  />
                  <Text className="text-sm text-cyan-50"
                                 style={[
  i18n.language === "si"
    ? { fontSize: 12 }
    : i18n.language === "ta"
    ? { fontSize: 11 }
    : { fontSize: 15 }
]}
                  >
                    {t("FarmerQr.Download")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-[#000000] p-4 h-[80px] w-[120px] rounded-lg items-center"
                  onPress={shareQRCode}
                >
                  <Image
                    source={require("../assets/images/Share.webp")} // Path to share icon
                    style={{ width: 24, height: 24 }}
                  />
                  <Text className="text-sm text-cyan-50"
                                 style={[
  i18n.language === "si"
    ? { fontSize: 12 }
    : i18n.language === "ta"
    ? { fontSize: 11 }
    : { fontSize: 15 }
]}
                  >
                    {t("FarmerQr.Share")}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default FarmerQr;
