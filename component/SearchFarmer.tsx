import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import { environment } from "@/environment/environment";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type SearchFarmerNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SearchFarmer"
>;

interface SearchFarmerProps {
  navigation: SearchFarmerNavigationProp;
}

const SearchFarmer: React.FC<SearchFarmerProps> = ({ navigation }) => {
  const [NICnumber, setNICnumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [newQr, setNewQr] = useState<boolean>(false);
  const [farmers, setFarmers] = useState<{
    NICnumber: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    PreferdLanguage: string;
    id: string;
  } | null>(null);
  const [ere, setEre] = useState("");
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const { t } = useTranslation();

  const validateNic = (nic: string) => {
    console.log("Validating NIC:", nic);
    const regex = /^(\d{12}|\d{9}V|\d{9}X|\d{9}v|\d{9}x)$/;
    if (!regex.test(nic)) {
      setEre(t("Transport.Enter Valide NIC"));
      return false;
    } else {
      setEre("");
      return true;
    }
  };

  const handleNicChange = (text: string) => {
    const normalizedText = text.replace(/[vV]/g, "V");
    setNICnumber(normalizedText);

    // Clear error message when input changes
    if (ere) {
      setEre("");
    }

    // Reset search button clicked state when user starts typing again
    if (searchButtonClicked && text.length === 0) {
      setSearchButtonClicked(false);
    }

    // Reset search states when user modifies the input
    if (noResults || newQr) {
      setNoResults(false);
      setNewQr(false);
      setFarmers(null);
    }
  };

  const handleSearch = async () => {
    // Set search button clicked to true
    setSearchButtonClicked(true);

    Keyboard.dismiss();
    if (NICnumber.trim().length === 0) return;

    // Validate NIC and return if invalid
    const isValid = validateNic(NICnumber);
    if (!isValid) {
      return;
    }

    // Reset states and show searching
    setIsSearching(true);
    setNoResults(false);
    setNewQr(false);
    setFarmers(null);

    try {
      const response = await api.get(`api/auth/get-users/${NICnumber}`);
      console.log("farmerdata", response.data);

      if (response.status === 200) {
        const farmer = response.data;
        console.log("Farmer data-----:", farmer);
        if (farmer.farmerQr === null || farmer.farmerQr === "") {
          setIsSearching(false);
          setNewQr(true);
          setFarmers(farmer);
        } else {
          setIsSearching(false);
          navigation.navigate("FarmerQr" as any, {
            NICnumber: farmer.NICnumber,
            userId: farmer.id,
          });
        }
      }
    } catch (error) {
      setIsSearching(false);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setNoResults(true);
        } else {
          Alert.alert(
            t("Error.error"),
            t("Error.Failed to search for farmer.")
          );
        }
      } else {
        Alert.alert(t("Error.error"), t("Error.somethingWentWrong"));
      }
    }
  };

  // Reset all states when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setNICnumber("");
      setNoResults(false);
      setEre("");
      setNewQr(false);
      setFarmers(null);
      setIsSearching(false);
      setSearchButtonClicked(false);
    }, [])
  );

  const DismisKeyboard = () => {
    Keyboard.dismiss();
  };

  const getTextStyle = (language: string) => {
    if (language === "si") {
      return {
        fontSize: 12, // Smaller text size for Sinhala
        lineHeight: 20, // Space between lines
      };
    }
    return {};
  };

  // Calculate what to display based on current state
  const shouldShowSearchImage = !searchButtonClicked;
  const shouldShowNoResults =
    !isSearching && noResults && NICnumber.length > 0 && !ere;
  const shouldShowNewQr =
    !isSearching && newQr && farmers && NICnumber.length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
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
              {t("SearchFarmer.Search")}
            </Text>
          </View>

          {/* Search Form */}
          <View className="p-4">
            <Text
              style={[{ fontSize: 16 }, getTextStyle(selectedLanguage)]}
              className="text-center text-lg  mt-5"
            >
              {t("SearchFarmer.EnterFarmer")}
            </Text>

            <View className="flex-row justify-center items-center border border-[#A7A7A7] rounded-full mt-4 px-4 py-2  bg-white">
              <TextInput
                value={NICnumber}
                onChangeText={handleNicChange}
                placeholder={t("SearchFarmer.EnterNIC")}
                className="flex-1 text-center"
                maxLength={12}
                style={{
                  color: "#000",
                  textAlign: "center", // Ensures the text is centered
                  paddingRight: NICnumber.length === 0 ? 0 : 20, // Add padding when text is empty to ensure centering
                }}
              />
              <TouchableOpacity className="ml-2" onPress={handleSearch}>
                <FontAwesome name="search" size={24} color="green" />
              </TouchableOpacity>
            </View>
            {ere ? (
              <Text className="text-red-500 mt-2 justify-center text-center">
                {ere}
              </Text>
            ) : null}

            {/* Display search image when no NIC is entered or during search */}
            {shouldShowSearchImage && (
              <View className="mt-10 items-center">
                <Image
                  source={require("../assets/images/search.webp")}
                  className="h-[350px] w-[300px] rounded-lg"
                  resizeMode="contain"
                />
                {isSearching && (
                  <Text
                    style={[{ fontSize: 16 }, getTextStyle(selectedLanguage)]}
                    className="text-center text-lg mt-4"
                  >
                    {t("SearchFarmer.Searching")}
                  </Text>
                )}
              </View>
            )}

            {/* Searching status - removed as it's now part of the search image section */}

            {/* No Results Found */}
            {shouldShowNoResults && (
              <View className="mt-6 items-center">
                <Image
                  source={require("../assets/images/notfound.webp")}
                  className="h-[200px] w-[200px] rounded-lg"
                  resizeMode="contain"
                />
                <Text
                  style={[{ fontSize: 16 }, getTextStyle(selectedLanguage)]}
                  className="text-center text-lg mt-4 color-[#888888]"
                >
                  {t("SearchFarmer.Noregistered")}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("UnregisteredFarmerDetails" as any, {
                      NIC: NICnumber,
                    })
                  }
                  className="mt-16 bg-[#2AAD7A]  rounded-full px-16 py-3  "
                >
                  <Text
                    style={[{ fontSize: 16 }, getTextStyle(selectedLanguage)]}
                    className="text-center text-white text-lg"
                  >
                    {t("SearchFarmer.RegisterFarmer")}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Farmer found but no QR */}
            {shouldShowNewQr && (
              <View className="mt-6 items-center">
                <Text
                  style={[{ fontSize: 16 }, getTextStyle(selectedLanguage)]}
                  className="text-center text-lg mt-4 color-[#888888]"
                >
                  {t("SearchFarmer.Result Found")}
                </Text>
                <View className="border border-[#A7A7A7] rounded-xl mt-4 px-6 py-2 w-full ">
                  <Text
                    style={[{ fontSize: 20 }, getTextStyle(selectedLanguage)]}
                    className="text-center text-lg mt-2"
                  >
                    {farmers.firstName} {farmers.lastName}
                  </Text>
                  <Text
                    style={[{ fontSize: 16 }, getTextStyle(selectedLanguage)]}
                    className="text-center text-lg mt-2 color-[#888888]"
                  >
                    {farmers.NICnumber}
                  </Text>
                </View>
                <Text
                  style={[{ fontSize: 16 }, getTextStyle(selectedLanguage)]}
                  className="text-center text-lg mt-4 text-red-600"
                >
                  {t("SearchFarmer.This Farmer does not have the QR")}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("UpdateFarmerBankDetails" as any, {
                      id: farmers.id,
                      NICnumber: farmers.NICnumber,
                      phoneNumber: farmers.phoneNumber,
                      PreferdLanguage: farmers.PreferdLanguage,
                      officerRole: "COO",
                    })
                  }
                  className="mt-8 bg-[#2AAD7A]  rounded-full px-16 py-3  "
                >
                  <Text
                    style={[{ fontSize: 16 }, getTextStyle(selectedLanguage)]}
                    className="text-center text-white text-lg"
                  >
                    {t("SearchFarmer.Set QR Code")}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SearchFarmer;
