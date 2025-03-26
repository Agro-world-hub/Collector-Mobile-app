import React, { useState } from "react";
import { View, Text, KeyboardAvoidingView, ScrollView, TextInput, Platform, Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { RouteProp } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useTranslation } from "react-i18next";
import { SelectList } from "react-native-dropdown-select-list";
import CountryPicker, { Country, CountryCode } from "react-native-country-picker-modal";
import axios from "axios";
import { environment } from '@/environment/environment';
import AsyncStorage from "@react-native-async-storage/async-storage";
const api = axios.create({
    baseURL: environment.API_BASE_URL,
  });

// Define props for the screen
type RegisterFarmerProps = {
  navigation: StackNavigationProp<RootStackParamList, "RegisterFarmer">;
  route: RouteProp<RootStackParamList, "RegisterFarmer">;
};

const RegisterFarmer: React.FC<RegisterFarmerProps> = ({ navigation, route }) => {
  // Extract NIC from route params
  const { NIC } = route.params || {};

  // State for form fields
  const [nicNumber, setNicNumber] = useState(NIC || '');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [district, setDistrict] = useState("");
  
  const { t } = useTranslation();
  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [callingCode, setCallingCode] = useState("+94");
  const [loading, setLoading] = useState(false);

  // List of districts with translation support
  const districtOptions = [
    { key: 1, value: "Ampara", translationKey: t("Districts.Ampara") },
    {
      key: 2,
      value: "Anuradhapura",
      translationKey: t("Districts.Anuradhapura"),
    },
    { key: 3, value: "Badulla", translationKey: t("Districts.Badulla") },
    { key: 4, value: "Batticaloa", translationKey: t("Districts.Batticaloa") },
    { key: 5, value: "Colombo", translationKey: t("Districts.Colombo") },
    { key: 6, value: "Galle", translationKey: t("Districts.Galle") },
    { key: 7, value: "Gampaha", translationKey: t("Districts.Gampaha") },
    { key: 8, value: "Hambantota", translationKey: t("Districts.Hambantota") },
    { key: 9, value: "Jaffna", translationKey: t("Districts.Jaffna") },
    { key: 10, value: "Kalutara", translationKey: t("Districts.Kalutara") },
    { key: 11, value: "Kandy", translationKey: t("Districts.Kandy") },
    { key: 12, value: "Kegalle", translationKey: t("Districts.Kegalle") },
    {
      key: 13,
      value: "Kilinochchi",
      translationKey: t("Districts.Kilinochchi"),
    },
    { key: 14, value: "Kurunegala", translationKey: t("Districts.Kurunegala") },
    { key: 15, value: "Mannar", translationKey: t("Districts.Mannar") },
    { key: 16, value: "Matale", translationKey: t("Districts.Matale") },
    { key: 17, value: "Matara", translationKey: t("Districts.Matara") },
    { key: 18, value: "Moneragala", translationKey: t("Districts.Moneragala") },
    { key: 19, value: "Mullaitivu", translationKey: t("Districts.Mullaitivu") },
    {
      key: 20,
      value: "Nuwara Eliya",
      translationKey: t("Districts.NuwaraEliya"),
    },
    {
      key: 21,
      value: "Polonnaruwa",
      translationKey: t("Districts.Polonnaruwa"),
    },
    { key: 22, value: "Puttalam", translationKey: t("Districts.Puttalam") },
    { key: 23, value: "Rathnapura", translationKey: t("Districts.Rathnapura") },
    {
      key: 24,
      value: "Trincomalee",
      translationKey: t("Districts.Trincomalee"),
    },
    { key: 25, value: "Vavuniya", translationKey: t("Districts.Vavuniya") },
  ];

  const handleCountrySelect = (country: Country) => {
    setCountryCode(country.cca2 as CountryCode);
    setCallingCode(`+${country.callingCode[0]}`);
  };

  const handleSubmit = async () => {
    // Validation
    if (!firstName || !lastName || !nicNumber || !phoneNumber || !district) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // Prepare check body
      const checkBody = {
        phoneNumber: `${callingCode}${phoneNumber}`,
        NICnumber: nicNumber,
      };

      // Check for existing registration
      const checkResponse = await api.post('api/farmer/farmer-register-checker', checkBody);

      // Handle different registration check scenarios
      switch (checkResponse.data.message) {
        case "This Phone Number already exists.":
          Alert.alert("Error", "This Phone Number is already registered.");
          setLoading(false);
          return;
        case "This NIC already exists.":
          Alert.alert("Error", "This NIC is already registered.");
          setLoading(false);
          return;
        case "This Phone Number and NIC already exist.":
          Alert.alert("Error", "This Phone Number and NIC are already registered.");
          setLoading(false);
          return;
      }

      // Send OTP
      const otpResponse = await axios.post(
        "https://api.getshoutout.com/otpservice/send",
        {
          source: "ShoutDEMO",
          transport: "sms",
          content: {
            sms: "Your verification code is {{code}}",
          },
          destination: `${callingCode}${phoneNumber}`,
        },
        {
          headers: {
            Authorization: `Apikey ${environment.SHOUTOUT_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Store reference ID
      await AsyncStorage.setItem("referenceId", otpResponse.data.referenceId);

      // Navigate to OTP verification
      navigation.navigate("OTPverification", {
        firstName,
        lastName,
        NICnumber: nicNumber,
        phoneNumber: `${callingCode}${phoneNumber}`,
        district,
      });

    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", "Failed to process registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="bg-white"
      >
        <View className="flex-1 px-6 py-4">
          <View className="flex-row items-center mb-6">
            <TouchableOpacity onPress={() => navigation.goBack()} className="">
              <AntDesign name="left" size={24} color="#000" />
            </TouchableOpacity>
            <Text className="flex-1 text-center text-xl font-bold text-black">
              Register Farmer
            </Text>
          </View>
          
          <View className="px-2 py-2 mt-3">
            {/* First Name Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2">First Name</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
              />
            </View>

            {/* Last Name Input */}
            <View className="mb-4 mt-3">
              <Text className="text-gray-700 mb-2">Last Name</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
              />
            </View>

            {/* NIC Number Input */}
            <View className="mb-4 mt-3">
              <Text className="text-gray-700 mb-2">NIC Number</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={nicNumber}
                onChangeText={setNicNumber}
                placeholder="Enter NIC number"
                keyboardType="numeric"
              />
            </View>

            {/* Phone Number Input */}
            <View className="mb-4 mt-3">
              <Text className="text-gray-600 mb-2">{t("UnregisteredFarmerDetails.Phone")}</Text>
              <View className="flex-row items-center border border-gray-300 p-1 rounded-lg">
                <CountryPicker
                  countryCode={countryCode}
                  withFilter
                  withFlag
                  withCallingCode 
                  onSelect={handleCountrySelect}
                />
                <TextInput
                  placeholder="7XXXXXXXX"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  className="flex-1"
                  maxLength={9}
                />
              </View>
            </View>

            {/* District Dropdown */}
            <View className="mb-4 mt-3">
              <Text className="text-gray-600 mb-2">{t("UnregisteredFarmerDetails.District")}</Text>
              <View className="rounded-lg">
                <SelectList
                  setSelected={setDistrict}
                  data={districtOptions.map(district => ({
                    key: district.value,
                    value: district.translationKey,
                  }))}
                  placeholder="Select District"
                  boxStyles={{ borderColor: '#ccc', borderRadius: 8 }}
                  dropdownStyles={{ borderColor: '#ccc' }}
                  search={false}
                />
              </View>
            </View>
          
            <TouchableOpacity
              className="bg-[#2AAD7A] rounded-full py-3 mt-4 w-full"
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text className="text-white text-center text-lg font-bold">
                {loading ? "Processing..." : "Submit"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterFarmer;