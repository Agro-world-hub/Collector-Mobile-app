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
import {environment }from '@/environment/environment';
import { Picker } from "@react-native-picker/picker";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import bankNames from "../assets/jsons/banks.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native"; // Import LottieView
import { ActivityIndicator } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { SelectList } from "react-native-dropdown-select-list";
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
  console.log(bankName)
  const [branchName, setBranchName] = useState("");
  console.log(branchName)
  const [isModalVisible, setIsModalVisible] = useState(false); // Success modal visibility state
  const [isUnsuccessfulModalVisible, setIsUnsuccessfulModalVisible] = useState(false); // Unsuccessful modal visibility state
  const [loading, setLoading] = useState(false); // Loading state for the progress bar
  const [progress] = useState(new Animated.Value(0)); // Animated value for progress
  const [unsuccessfulProgress] = useState(new Animated.Value(0)); // Animated value for unsuccessful loading bar
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages
  const { t } = useTranslation();
  const [filteredBranches, setFilteredBranches] = useState<allBranches[]>([]);
  const [callingCode, setCallingCode] = useState("+94"); 
  // const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");


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
          Alert.alert(t("Error.error"), t("Error.somethingWentWrong"));
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
      Alert.alert("Sorry", "Please fill all fields");
      setLoading(false);
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
        Alert.alert("Sorry", "This Phone Number already exists.");
        return;
      } else if (checkResponse.data.message === "This NIC already exists.") {
        Alert.alert("Sorry", "This NIC already exists.");
        return;
      } else if (
        checkResponse.data.message ===
        "This Phone Number and NIC already exist."
      ) {
        Alert.alert("Sorry", "This Phone Number and NIC already exist.");
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
      Alert.alert(t("Error.error"), t("Error.SignupForum.otpSendFailed"));
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

  const getTextStyle = (language: string) => {
    if (language === "si") {
      return {
        fontSize: 14, // Smaller text size for Sinhala
        lineHeight: 20, // Space between lines
      };
    }
   
  };

  return (
      <KeyboardAvoidingView 
            behavior={Platform.OS ==="ios" ? "padding" : "height"}
            enabled
            className="flex-1"
            >
    <View className="flex-1 p-5 bg-white">
      {/* Header with Back Icon */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
           <AntDesign name="left" size={22} color="#000" />
        </TouchableOpacity>
        <View className="w-full items-center">
  <Text className="text-xl font-bold text-center">{t("UnregisteredFarmerDetails.FillDetails")}</Text>
</View>


      </View>

      {/* Scrollable Form */}
      <ScrollView className="flex-1 p-3">
        {/* First Name */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">{t("UnregisteredFarmerDetails.FirstName")}</Text>
          <TextInput
            placeholder={t("UnregisteredFarmerDetails.FirstName")}
            className="border border-gray-300  p-3 rounded-lg"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        {/* Last Name */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">{t("UnregisteredFarmerDetails.LastName")}</Text>
          <TextInput
            placeholder={t("UnregisteredFarmerDetails.LastName")}
            className="border border-gray-300  p-3 rounded-lg"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        {/* NIC Number */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">{t("UnregisteredFarmerDetails.NIC")}</Text>
          <TextInput
            placeholder="NIC Number"
            className="border border-gray-300  p-3 rounded-lg"
            value={NICnumber}
            onChangeText={setNICnumber}
          />
        </View>

        {/* Phone Number */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">{t("UnregisteredFarmerDetails.Phone")}</Text>
          <View className="flex-row items-center border border-gray-300  p-3 rounded-lg">
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

        {/* Address */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">{t("UnregisteredFarmerDetails.District")}</Text>
          <View className="  rounded-lg">
            {/* <Picker
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
            </Picker> */}
                     <SelectList
              setSelected={setDistrict}
              data={districtOptions.map(district => ({
                key: district.value,
                value: district.translationKey,
              }))}
              placeholder="Select District"
              boxStyles={{ borderColor: '#ccc', borderRadius: 8 }}
              dropdownStyles={{ borderColor: '#ccc' }}
              search={false}  // Optional: hide search inside dropdown
            />
          </View>
        </View>

        {/* Account Number */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">{t("UnregisteredFarmerDetails.AccountNum")}</Text>
          <TextInput
            placeholder={t("UnregisteredFarmerDetails.AccountNum")}
            className="border border-gray-300  p-3 rounded-lg"
            value={accNumber}
            onChangeText={setAccNumber}
          />
        </View>

        {/* Account Holder's Name */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">{t("UnregisteredFarmerDetails.AccountName")}</Text>
          <TextInput
            placeholder={t("UnregisteredFarmerDetails.AccountName")}
            className="border border-gray-300  p-3 rounded-lg"
            value={accHolderName}
            onChangeText={setAccHolderName}
          />
        </View>

        {/* Bank Name */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-2">{t("UnregisteredFarmerDetails.Bank")}</Text>
          <View className="  rounded-lg">
            {/* <Picker
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
            </Picker> */}
            <SelectList
              setSelected={setBankName}
              data={bankNames.map(bank => ({
                key: bank.name,
                value: bank.name,
              }))}
              placeholder="Select Bank"
              boxStyles={{ borderColor: '#ccc', borderRadius: 8 }}
              dropdownStyles={{ borderColor: '#ccc' }}
              search={true}  
            />
          </View>
        </View>

        {/* Branch Name */}
        <View className="mb-8">
          <Text className="text-gray-600 mb-2">{t("UnregisteredFarmerDetails.Branch")}</Text>
          <View className=" rounded-lg">
            {/* <Picker
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
            </Picker> */}
            <SelectList
              setSelected={setBranchName}
              data={filteredBranches.map(branch => ({
                key: branch.name,
                value: branch.name,
              }))}
              placeholder="Select Branch"
              boxStyles={{ borderColor: '#ccc', borderRadius: 8 }}
              dropdownStyles={{ borderColor: '#ccc' }}
              search={true}  
            />
          </View>
        </View>
      </ScrollView>

      {/* Next Button */}
      {/* <TouchableOpacity
        className="bg-[#2AAD7A] p-3 rounded-full items-center mt-5"
        onPress={handleNext}
      >
        <Text className="text-white text-lg">Submit</Text>
      </TouchableOpacity> */}

<TouchableOpacity
  className={`p-3 rounded-full items-center mt-5 ${
    loading ? "bg-gray-400 opacity-50" : "bg-[#2AAD7A]"
  }`}
  onPress={() => {
    if (!loading) {
      setLoading(true); // Disable the button on click
      handleNext(); // Your action function
    }
  }}
  disabled={loading} // Disable button during the operation
>
  {loading ? (
    <ActivityIndicator color="white" size="small" />
  ) : (
    <Text style={[{ fontSize: 16 }, getTextStyle(selectedLanguage)]} className="text-center text-xl font-light text-white">
      {t("UnregisteredFarmerDetails.Submit")}
    </Text>
  )}
</TouchableOpacity>



      {/* Success Modal */}
      <Modal transparent={true} visible={isModalVisible} animationType="slide">
        <View className="flex-1 justify-center items-center bg-gray-900 bg-opacity-50">
          <View className="bg-white rounded-lg w-72 p-6 items-center">
            <Text className="text-xl font-bold mb-4"> {t("UnregisteredFarmerDetails.Success")}</Text>
            <View className="mb-4">
              <Image
                source={require("../assets/images/tick.webp")} // Replace with your own checkmark image
                className="w-24 h-24"
              />
            </View>
            <Text className="text-gray-700">{t("UnregisteredFarmerDetails.Successful")}</Text>
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
            <Text className="text-xl font-bold mb-4">{t("UnregisteredFarmerDetails.Oops")}</Text>
            <View className="mb-4">
              <Image
                source={require("../assets/images/error.webp")} // Replace with your own error image
                className="w-24 h-24"
              />
            </View>
            <Text className="text-gray-700">{t("UnregisteredFarmerDetails.Unsuccessful")}</Text>

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
              <Text className="text-white">{t("UnregisteredFarmerDetails.Close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </KeyboardAvoidingView>
  );
};

export default UnregisteredFarmerDetails;
