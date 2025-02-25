import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
  StyleSheet,
  Animated,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import CountryPicker, { Country, CountryCode } from "react-native-country-picker-modal";
import axios from "axios";
import environment from "../environment/environment";
import { Picker } from "@react-native-picker/picker";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import bankNames from "../assets/jsons/banks.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type UnregisteredFarmerDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "UnregisteredFarmerDetails"
>;

interface UnregisteredFarmerDetailsProps {
  navigation: UnregisteredFarmerDetailsNavigationProp;
  route: any; // Add route to the props interface
}

interface allBranches {
  bankID: number;
  ID: number;
  name: string;
}

const UnregisteredFarmerDetails: React.FC<UnregisteredFarmerDetailsProps> = ({
  navigation,
  route,
}) => {
  const { NIC } = route.params;
  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [NICnumber, setNICnumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [district, setDistrict] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [accHolderName, setAccHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false); // Success modal visibility state
  const [isUnsuccessfulModalVisible, setIsUnsuccessfulModalVisible] = useState(false); // Unsuccessful modal visibility state
  const [loading, setLoading] = useState(false); // Loading state for the progress bar
  const [progress] = useState(new Animated.Value(0)); // Animated value for progress
  const [unsuccessfulProgress] = useState(new Animated.Value(0)); // Animated value for unsuccessful loading bar
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages
  const { t } = useTranslation();
  const [filteredBranches, setFilteredBranches] = useState<allBranches[]>([]);
  const [callingCode, setCallingCode] = useState("+94"); 


  console.log(countryCode)

  // const handleNext = async () => {
  //   setLoading(true); // Start loading

  //   // Start loading animation
  //   Animated.timing(progress, {
  //     toValue: 100, // Animate to 100%
  //     duration: 4000, // Duration of the loading bar animation (4 seconds)
  //     useNativeDriver: false, // Set to false for width animation
  //   }).start();

  //   try {
  //     const response = await api.post(`api/farmer/register-farmer`, {
  // firstName,
  // lastName,
  // NICnumber,
  // phoneNumber,
  // address,
  // accNumber,
  // accHolderName,
  // bankName,
  // branchName,
  //     });

  //     if (response.status === 201) {
  //       const userId = response.data.userId; // Capture userId
  //       const cropCount = response.data.cropCount || 0; // Ensure you have a cropCount value

  //       // Show success modal
  //       setIsModalVisible(true);

  //       // Modal is visible for 6 seconds before navigating
  //       setTimeout(() => {
  //         setIsModalVisible(false); // Close the success modal
  //         navigation.navigate('FarmerQr' as any, { userId, cropCount }); // Navigate to FarmerQr
  //       }, 6000); // Wait for 6 seconds before redirecting
  //     }
  //   } catch (error: any) {
  //     console.error(error); // Log for debugging
  //     setLoading(false); // End loading
  //     setIsUnsuccessfulModalVisible(true); // Show the unsuccessful modal

  //     // Start unsuccessful loading animation
  //     unsuccessfulProgress.setValue(100); // Reset the animated value
  //     Animated.timing(unsuccessfulProgress, {
  //       toValue: 0, // Animate to 0%
  //       duration: 4000, // Duration of the loading bar animation (4 seconds)
  //       useNativeDriver: false, // Set to false for width animation
  //     }).start();

  //     // Set error message based on the error
  //     if (error.response) {
  //       const statusCode = error.response.status;
  //       const serverError = error.response.data?.error || "An unexpected error occurred.";

  //       // Handle 409 Conflict
  //       if (statusCode === 409) {
  //           setErrorMessage(serverError || "User already exists with the provided details.");
  //       } else {
  //           setErrorMessage(serverError);
  //       }

  //       console.error("Server error:", error.response.data);
  //     } else if (error.request) {
  //       setErrorMessage("Failed to connect to the server");
  //     } else {
  //       setErrorMessage(error.message);
  //     }
  //   } finally {
  //     setLoading(false); // End loading
  //   }
  // };

  useEffect(() => {
    if (bankName) {
      const selectedBank = bankNames.find((bank) => bank.name === bankName);
      if (selectedBank) {
        try {
          const data = require("../assets/jsons/branches.json");
          const filteredBranches = data[selectedBank.ID] || [];

          const sortedBranches = filteredBranches.sort(
            (a: { name: string }, b: { name: any }) =>
              a.name.localeCompare(b.name)
          );

          setFilteredBranches(sortedBranches);
        } catch (error) {
          console.error("Error loading branches", error);
          Alert.alert(t("Main.error"), t("Main.somethingWentWrong"));
        } finally {
          setLoading(false);
        }
      } else {
        setFilteredBranches([]);
      }
    } else {
      setFilteredBranches([]);
    }
  }, [bankName]);

  const districtOptions = [
    { key: 0, value: "", translationKey: t("Districts.selectDistrict") },
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

  useEffect(() => {
    if (NIC) {
      setNICnumber(NIC);
    }
  }, [NIC]);

  const handleNext = async () => {
    if (
      !firstName ||
      !lastName ||
      !NICnumber ||
      !phoneNumber ||
      !district ||
      !accNumber ||
      !accHolderName ||
      !bankName ||
      !branchName // Removed trailing comma
    ) {
      Alert.alert("Main.error", "SignupForum.fillAllFields");
      return;
    }

    try {
      const checkApiUrl = `api/farmer/farmer-register-checker`;
      const checkBody = {
        phoneNumber: `${callingCode}${phoneNumber}`,
        NICnumber: NICnumber,
      };

      console.log(checkBody);
      console.log("Full API URL:", `${api.defaults.baseURL}${checkApiUrl}`);
      const checkResponse = await api.post(checkApiUrl, checkBody);
      console.log("API Response:", checkResponse.data);


      if (checkResponse.data.message === "This Phone Number already exists.") {
        Alert.alert("Main.error", "SignupForum.phoneExists");
        return;
      } else if (checkResponse.data.message === "This NIC already exists.") {
        Alert.alert("Main.error", "SignupForum.nicExists");
        return;
      } else if (
        checkResponse.data.message ===
        "This Phone Number and NIC already exist."
      ) {
        Alert.alert("Main.error", "SignupForum.phoneNicExist");
        return;
      }

      const apiUrl = "https://api.getshoutout.com/otpservice/send";
      const headers = {
        Authorization: `Apikey ${environment.SHOUTOUT_API_KEY}`,
        "Content-Type": "application/json",
      };

      console.log(phoneNumber)
      

      const body = {
        source: "ShoutDEMO",
        transport: "sms",
        content: {
          sms: "Your code is {{code}}",
        },
        destination: `${callingCode}${phoneNumber}`,
      };



      const response = await axios.post(apiUrl, body, { headers });
      console.log("OTP Response:", response.data);
      await AsyncStorage.setItem("referenceId", response.data.referenceId);


      navigation.navigate("OTPE", {
        firstName: firstName,
        lastName: lastName,
        NICnumber: NICnumber,
        phoneNumber: `${callingCode}${phoneNumber}`,
        district: district,
        accNumber: accNumber,
        accHolderName: accHolderName,
        bankName: bankName,
        branchName: branchName,
      });
    } catch (error) {
      Alert.alert("Main.error", "SignupForum.otpSendFailed");
    }
  };

  // Interpolating the animated value for width
  const loadingBarWidth = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const unsuccessfulLoadingBarWidth = unsuccessfulProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const handleCountrySelect = (country: Country) => {
    setCountryCode(country.cca2 as CountryCode); // Update country code
    setCallingCode(`+${country.callingCode[0]}`); // Update dial code
  };

  return (
    <View className="flex-1 p-5 bg-white">
      {/* Header with Back Icon */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/images/back.png")} // Path to your PNG image
            style={{ width: 24, height: 24 }} // Adjust size if needed
          />
        </TouchableOpacity>
        <View className="w-full items-center">
  <Text className="text-xl font-bold text-center">Fill Personal Details</Text>
</View>


      </View>

      {/* Scrollable Form */}
      <ScrollView className="flex-1 p-3">
        {/* First Name */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">First Name</Text>
          <TextInput
            placeholder="First Name"
            className="border border-gray-300  p-3 rounded-lg"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        {/* Last Name */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">Last Name</Text>
          <TextInput
            placeholder="Last Name"
            className="border border-gray-300  p-3 rounded-lg"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        {/* NIC Number */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">NIC Number</Text>
          <TextInput
            placeholder="NIC Number"
            className="border border-gray-300  p-3 rounded-lg"
            value={NICnumber}
            onChangeText={setNICnumber}
          />
        </View>

        {/* Phone Number */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">Phone Number</Text>
          <View className="flex-row items-center border border-gray-300  p-3 rounded-lg">
            <CountryPicker
              countryCode={countryCode}
              withFilter
              withFlag
              withCallingCode 
              onSelect={handleCountrySelect}

            />
            <TextInput
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              className="flex-1"
            />
          </View>
        </View>

        {/* Address */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">District</Text>
          <View className="border border-gray-300  rounded-lg">
            <Picker
              selectedValue={district}
              onValueChange={(itemValue: any) => setDistrict(itemValue)}
              style={{
                fontSize: 14,
                width: wp(85),
              }}
            >
              {districtOptions.map((item) => (
                <Picker.Item
                  label={item.translationKey}
                  value={item.value}
                  key={item.key}
                  style={{
                    fontSize: 14,
                  }}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Account Number */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">Account Number</Text>
          <TextInput
            placeholder="Account Number"
            className="border border-gray-300  p-3 rounded-lg"
            value={accNumber}
            onChangeText={setAccNumber}
          />
        </View>

        {/* Account Holder's Name */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">Account Holder's Name</Text>
          <TextInput
            placeholder="Account Holder's Name"
            className="border border-gray-300  p-3 rounded-lg"
            value={accHolderName}
            onChangeText={setAccHolderName}
          />
        </View>

        {/* Bank Name */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">Bank Name</Text>
          <View className="border border-gray-300  rounded-lg">
            <Picker
              selectedValue={bankName}
              onValueChange={(value) => setBankName(value)}
              style={{
                fontSize: 14,
                width: wp(85),
              }}
            >
              <Picker.Item label={t("BankDetails.BankName")} value="" />
              {bankNames
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((bank) => (
                  <Picker.Item
                    key={bank.ID}
                    label={bank.name}
                    value={bank.name}
                  />
                ))}
            </Picker>
          </View>
        </View>

        {/* Branch Name */}
        <View className="mb-8">
          <Text className="text-gray-600 mb-2">Branch Name</Text>
          <View className="border border-gray-300  rounded-lg">
            <Picker
              selectedValue={branchName}
              onValueChange={(value) => setBranchName(value)}
              style={{
                fontSize: 14,
                width: wp(85),
              }}
            >
              <Picker.Item label={t("BankDetails.BranchName")} value="" />
              {filteredBranches.map((branch) => (
                <Picker.Item
                  key={branch.ID}
                  label={branch.name}
                  value={branch.name}
                />
              ))}
            </Picker>
          </View>
        </View>
      </ScrollView>

      {/* Next Button */}
      <TouchableOpacity
        className="bg-[#2AAD7A] p-3 rounded-full items-center mt-5"
        onPress={handleNext}
      >
        <Text className="text-white text-lg">Submit</Text>
      </TouchableOpacity>

      {/* Success Modal */}
      <Modal transparent={true} visible={isModalVisible} animationType="slide">
        <View className="flex-1 justify-center items-center bg-gray-900 bg-opacity-50">
          <View className="bg-white rounded-lg w-72 p-6 items-center">
            <Text className="text-xl font-bold mb-4">Success!</Text>
            <View className="mb-4">
              <Image
                source={require("../assets/images/tick.png")} // Replace with your own checkmark image
                className="w-24 h-24"
              />
            </View>
            <Text className="text-gray-700">Registration Successful</Text>
            <View className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mt-6">
              <Animated.View
                className="h-full bg-green-500"
                style={{ width: loadingBarWidth }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={isUnsuccessfulModalVisible}
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-gray-900 bg-opacity-50">
          <View className="bg-white rounded-lg w-72 p-6 items-center">
            <Text className="text-xl font-bold mb-4">Oops!</Text>
            <View className="mb-4">
              <Image
                source={require("../assets/images/error.png")} // Replace with your own error image
                className="w-24 h-24"
              />
            </View>
            <Text className="text-gray-700">Registration Unsuccessful</Text>

            {/* Display error message */}
            {errorMessage && (
              <Text className="text-red-600 text-center mt-2">
                {errorMessage}
              </Text>
            )}

            {/* Red Loading Bar */}
            <View className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mt-6">
              <Animated.View
                className="h-full bg-red-500"
                style={{ width: unsuccessfulLoadingBarWidth }}
              />
            </View>

            <TouchableOpacity
              className="bg-red-500 p-2 rounded-full mt-4"
              onPress={() => {
                setIsUnsuccessfulModalVisible(false);
                setErrorMessage(null); // Clear error message when closing
                unsuccessfulProgress.setValue(0); // Reset animation value when closing
              }}
            >
              <Text className="text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UnregisteredFarmerDetails;
