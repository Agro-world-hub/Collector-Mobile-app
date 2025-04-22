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
import axios from "axios";
import {environment }from '@/environment/environment';
import { useTranslation } from "react-i18next";
import bankNames from "../assets/jsons/banks.json";
import { ActivityIndicator } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { SelectList } from "react-native-dropdown-select-list";
import { navigate } from "expo-router/build/global-state/routing";
const api = axios.create({
  baseURL: environment.API_BASE_URL,
});


type UnregisteredFarmerDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "UpdateFarmerBankDetails"
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
  const { id, NICnumber} = route.params;
  console.log(id);
  console.log(NICnumber);
  const [accNumber, setAccNumber] = useState("");
  console.log(accNumber)
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
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");


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

  const handleNext = async () => {
    if (

      !accNumber ||
      !accHolderName ||
      !bankName ||
      !branchName // Removed trailing comma
    ) {
      Alert.alert(t("Error.error"), t("Error.Please fill in all required fields."));
      setLoading(false);
      return;
    }

   try {
      const response = await api.post("api/farmer/FarmerBankDetails", {
        accNumber: accNumber,
        accHolderName: accHolderName,
        bankName: bankName,
        branchName: branchName,
        userId: id,
        NICnumber: NICnumber,
      });

      if (response.status === 200) {
        setLoading(false);
        setIsModalVisible(true); // Show success modal
        Animated.timing(progress, {
          toValue: 100,
          duration: 2000,
          useNativeDriver: false,
        }).start(() => {
            // Close modal after animation completes
            setIsModalVisible(false);
            
            // Navigate to FarmerQr after closing the modal
            navigation.navigate("FarmerQr" as any, {
              NICnumber,
              userId: id,
            });
          });
      } else {
        setLoading(false);
        Alert.alert(t("Error.error"), t("Error.somethingWentWrong"));
      }
    } catch (error) {
        console.error("Error submitting form", error);
        setLoading(false);
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
        <View className="mb-4">
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
      </ScrollView>





      {/* Success Modal */}
      <Modal transparent={true} visible={isModalVisible} animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
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
        <View className="flex-1 justify-center items-center bg-black/50 bg-opacity-50">
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
