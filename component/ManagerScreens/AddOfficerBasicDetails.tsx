import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { OfficerBasicDetailsFormData } from "../types";
import { environment } from "@/environment/environment";
import countryCodes from "./countryCodes.json";
import AntDesign from "react-native-vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import { SelectList } from "react-native-dropdown-select-list";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "expo-router";

type AddOfficerBasicDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddOfficerBasicDetails"
>;

type AddOfficerRouteProp = RouteProp<RootStackParamList, "AddOfficerBasicDetails">;

interface AddOfficerProp {
  navigation: AddOfficerBasicDetailsNavigationProp;
  route: AddOfficerRouteProp;
}

const AddOfficerBasicDetails: React.FC <AddOfficerProp> = ({
  route,
  navigation,
}) => {
  const { jobRolle} = route.params;
  const [type, setType] = useState<"Permanent" | "Temporary">("Permanent");
  const [preferredLanguages, setPreferredLanguages] = useState({
    Sinhala: false,
    English: false,
    Tamil: false,
  });
  const [jobRole, setJobRole] = useState<string>(String(jobRolle));
    console.log(jobRole)

  const [phoneCode1, setPhoneCode1] = useState<string>("+94"); // Default Sri Lanka calling code
  const [phoneCode2, setPhoneCode2] = useState<string>("+94"); // Default Sri Lanka calling code
  const [phoneNumber1, setPhoneNumber1] = useState("");
  const [phoneNumber2, setPhoneNumber2] = useState("");
  const { t } = useTranslation();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const [formData, setFormData] = useState<OfficerBasicDetailsFormData>({
    userId: "",
    firstNameEnglish: "",
    lastNameEnglish: "",
    firstNameSinhala: "",
    lastNameSinhala: "",
    firstNameTamil: "",
    lastNameTamil: "",
    nicNumber: "",
    email: "",
    profileImage: "",
    jobRole: "",
    phoneCode1: "",
    phoneNumber1: "",
    phoneCode2: "",
    phoneNumber2: "",
  });

  const toggleLanguage = (language: keyof typeof preferredLanguages) => {
    setPreferredLanguages((prev) => ({
      ...prev,
      [language]: !prev[language],
    }));
  };

  const nicRegex = /^\d{9}[Vv]?$|^\d{10}$/;

  const validateNicNumber = (input: string) =>
    /^[0-9]{9}V$|^[0-9]{12}$/.test(input);

  const handleNicNumberChange = (input: string) => {
    // Normalize 'v' or 'V' to uppercase 'V'
    const normalizedInput = input.replace(/[vV]/g, "V");

    setFormData({ ...formData, nicNumber: normalizedInput });

    if (!validateNicNumber(normalizedInput)) {
      setError3(
        t("Error.NIC Number must be 9 digits followed by 'V' or 12 digits.")
      );
    } else {
      setError3("");
      checkNicExists(normalizedInput);
    }
  };

  const checkNicExists = async (nic: string) => {
    if (!validateNicNumber(nic)) return;
    if(nic.length ===0) return
    try {
      setIsValidating(true);
      const token = await AsyncStorage.getItem("token"); // Get your auth token

      const response = await axios.get(
        `${environment.API_BASE_URL}api/collection-manager/driver/check-nic/${nic}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.exists) {
        setError3(t("Error.This NIC is already registered in the system."));
      } else {
        setError3("");
      }
    } catch (error: any) {
      // Type the error as 'any' or create a more specific type
      console.error("Error checking NIC:", error);

      // Now you can access properties without TypeScript errors
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      }
    } finally {
      setIsValidating(false);
    }
  };

  const checkEmailExists = async (email: string) => {
    if (!validateEmail(email)) {
      setErrorEmail(
        t(
          "Error.Invalid email address. Please enter a valid email format (e.g. example@domain.com)."
        )
      );
      return;
    }

    try {
      setIsValidating(true);
      const token = await AsyncStorage.getItem("token");
      console.log("hittting2");
      const response = await axios.get(
        `${environment.API_BASE_URL}api/collection-manager/driver/check-email/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.exists) {
        setErrorEmail(
          t("Error.This Email is already registered in the system.")
        );
      } else {
        setErrorEmail("");
      }
    } catch (error: any) {
      console.error("Error checking Email:", error);

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      }
      // Set a generic error message if the check fails
      setErrorEmail(t("Error.Failed to verify email. Please try again."));
    } finally {
      setIsValidating(false);
    }
  };
  const fetchEmpId = async (role: string) => {
    console.log("Fetching empId for role:", role);
    try {
      const response = await axios.get(
        `${environment.API_BASE_URL}api/collection-manager/generate-empId/${role}`
      );
      if (response.data.status) {
        setFormData((prev) => ({
          ...prev,
          userId: response.data.result.empId, // Automatically set empId
        }));
      }
      console.log("EmpId:", response.data.result.empId);
    } catch (error) {
      console.error("Error fetching empId:", error);
      Alert.alert(t("Error.error"), t("Error.Failed to fetch empid."));
    }
  };

  const handleJobRoleChange = (role: string) => {
    setJobRole(role);
    if (role !== "Select Job Role") {
      fetchEmpId(role); // Fetch empId based on the selected role
    }
  };

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {

 setJobRole(String(jobRolle));
      fetchEmpId(String(jobRolle)); 
       return () => {
        console.log('This route is now unfocused.');
      };
    }, [])
  );
  const handleImagePick = async () => {
    // Request for camera roll permission if not granted
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        t("Error.Permission required"),
        t("Error.Permission required message")
      );
      return;
    }

    // Pick the image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true, // Ensure base64 data is returned
    });

    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        if (result.assets[0].base64) {
          setSelectedImage(result.assets[0].base64); // Set base64 image data
        }
      }
    }
  };

  const clearFormData = async () => {
    try {
      await AsyncStorage.removeItem("AddOfficerFormData");
    } catch (error) {
      console.error("Error clearing form data:", error);
    }
  };

  const handleNext = () => {
    console.log("jobRole", preferredLanguages);
    if (error1) {
      Alert.alert(t("Error.error"), error1);
      return;
    } else if (error2 && phoneNumber2.length > 0) {
      Alert.alert(t("Error.error"), error2);
      return;
    } else if (errorEmail) {
      Alert.alert(t("Error.error"), errorEmail);
      return;
    } else if (error3) {
      Alert.alert(t("Error.error"), error3);
      return;
    }
    if (
      !formData.userId ||
      !formData.firstNameEnglish ||
      !formData.lastNameEnglish ||
      !phoneNumber1 || // Ensure phone number 1 is provided
      !formData.nicNumber ||
      !formData.email ||
      !jobRole ||
      !type ||
      Object.values(preferredLanguages).every((val) => !val)
    ) {
      Alert.alert(
        t("Error.error"),
        t("Error.Please fill in all required fields.")
      );
      return;
    }
    try {
      setIsValidating(true);
      // Update formData with separate phone codes and numbers
      const updatedFormData = {
        ...formData,
        phoneCode1: phoneCode1,
        phoneNumber1: phoneNumber1,
        phoneCode2: phoneCode2,
        phoneNumber2: phoneNumber2,
      };

      // Set the profileImage to an empty string if no image was picked
      updatedFormData.profileImage = selectedImage || "";

      console.log(
        "Form Data:",
        updatedFormData,
        preferredLanguages,
        type,
        jobRole
      );

      const prefixedUserId =
        jobRole === "Collection Officer"
          ? `COO${formData.userId}`
          : `DIO${formData.userId}`;

      // Navigate to the next screen with the updated data
      navigation.navigate("AddOfficerAddressDetails", {
        formData: { ...updatedFormData, userId: prefixedUserId },
        type,
        preferredLanguages,
        jobRole,
      });
    } catch (error) {
      console.error("Error validating user data:", error);
      Alert.alert(t("Error.error"), t("Error.Failed to validate user data."));
    } finally {
      setIsValidating(false);
    }
  };

  const [error1, setError1] = useState("");
  const [error2, setError2] = useState("");
  const [error3, setError3] = useState("");
  const [errorEmail, setErrorEmail] = useState("");

  const validateEmail = (email: string) =>
    /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|\.com|\.gov|\.lk)$/i.test(email);

  const handleEmailChange = (input: string) => {
    const trimmedInput = input.trim();
    setFormData({ ...formData, email: trimmedInput });

    if (!trimmedInput) {
      setErrorEmail(t("Error.Email is required"));
      return;
    }
    if (!validateEmail(trimmedInput)) {
      setErrorEmail(
        t(
          "Error.Invalid email address. Please enter a valid email format (e.g. example@domain.com)."
        )
      );
      return;
    }
    checkEmailExists(trimmedInput);
  };

  // Validation function for phone numbers
  const validatePhoneNumber = (input: string) => /^[0-9]{9}$/.test(input);

  // Handle phone number 1 change
  const handlePhoneNumber1Change = (input: string) => {
    if (input.startsWith("0")) {
      input = input.replace(/^0+/, ""); // remove all leading zeros
    }
    setPhoneNumber1(input);
    if (!validatePhoneNumber(input)) {
      setError1(t("Error.setphoneError1"));
    } else {
      setError1("");
      checkPhoneExists(input);
    }
  };
  const checkPhoneExists = async (phoneNumber: string) => {
    if (!validatePhoneNumber(phoneNumber)) return;

    try {
      setIsValidating(true);
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${environment.API_BASE_URL}api/collection-manager/driver/check-phone/${phoneCode1}${phoneNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.exists) {
        setError1(
          t("Error.This phone number is already registered in the system.")
        );
      } else {
        setError1("");
      }
    } catch (error) {
      console.error("Error checking phone number:", error);
    } finally {
      setIsValidating(false);
    }
  };

  // Handle phone number 2 change
  const handlePhoneNumber2Change = (input: string) => {
        if (input.startsWith("0")) {
      input = input.replace(/^0+/, ""); // remove all leading zeros
    }
    setPhoneNumber2(input);
    if (!validatePhoneNumber(input) && input.length > 0) {
      setError2(t("Error.setphoneError2"));
    } else {
      setError2("");
      checkPhone2Exists(input);
    }
  };

  const checkPhone2Exists = async (phoneNumber: string) => {
    if (!validatePhoneNumber(phoneNumber)) return;

    try {
      setIsValidating(true);
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${environment.API_BASE_URL}api/collection-manager/driver/check-phone/${phoneCode2}${phoneNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.exists) {
        setError2(
          t("Error.This phone number is already registered in the system.")
        );
      } else {
        setError2("");
      }
    } catch (error) {
      console.error("Error checking phone number 2:", error);
    } finally {
      setIsValidating(false);
    }
  };

  const jobRoles = [
    { key: "2", value: "Collection Officer" },
    // Add more roles as necessary
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-white"
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-4 bg-white shadow-sm">
          {/* <TouchableOpacity onPress={() => navigation.goBack()} className="pr-4">
           <AntDesign name="left" size={24} color="#000502" />
        </TouchableOpacity> */}
          <TouchableOpacity
            onPress={async () => {
              try {
                await AsyncStorage.removeItem("officerFormData"); // Clear stored data
                navigation.goBack();
              } catch (error) {
                console.error("Error clearing form data:", error);
              }
            }}
            className="pr-4"
          >
            <AntDesign name="left" size={24} color="#000502" />
          </TouchableOpacity>

          <View className="flex-1 justify-center items-center">
            <Text className="text-lg font-bold text-center">
              {t("AddOfficerBasicDetails.AddOfficer")}
            </Text>
          </View>
        </View>

        {/* Profile Avatar */}
        <View className="justify-center items-center my-4 relative">
          {/* Profile Image */}
          <Image
            source={
              selectedImage
                ? { uri: `data:image/png;base64,${selectedImage}` }
                : require("../../assets/images/user1.webp")
            }
            className="w-24 h-24 rounded-full"
          />

          {/* Edit Icon (Pen Icon) */}
          <TouchableOpacity
            onPress={handleImagePick} // Handle the image picking
            className="absolute bottom-0 right-4 bg-[#3980C0] p-1 rounded-full mr-[35%] shadow-md"
            style={{
              elevation: 5, // For shadow effect
            }}
          >
            <Ionicons name="pencil" size={18} color="white" />
          </TouchableOpacity>
        </View>

        {/* Type Selector */}
        <View className="px-8 flex-row items-center mb-4 ">
          <Text className="font-semibold text-sm mr-4">
            {t("AddOfficerBasicDetails.Type")}
          </Text>
          <TouchableOpacity
            className="flex-row items-center mr-6"
            onPress={() => setType("Permanent")}
          >
            <Ionicons
              name={
                type === "Permanent" ? "radio-button-on" : "radio-button-off"
              }
              size={20}
              color="#0021F5"
            />
            <Text className="ml-2 text-gray-700">
              {t("AddOfficerBasicDetails.Permanent")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => setType("Temporary")}
          >
            <Ionicons
              name={
                type === "Temporary" ? "radio-button-on" : "radio-button-off"
              }
              size={20}
              color="#0021F5"
            />
            <Text className="ml-2 text-gray-700">
              {t("AddOfficerBasicDetails.Temporary")}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            borderBottomWidth: 1,
            borderColor: "#ADADAD",
            marginVertical: 10,
          }}
        />

        {/* Preferred Languages */}
        <View className="px-8 mb-4">
          <Text className="font-semibold text-sm mb-2">
            {t("AddOfficerBasicDetails.PreferredLanguages")}
          </Text>
          <View className="flex-row items-center">
            {["සිංහල", "English", "தமிழ்"].map((lang) => (
              <TouchableOpacity
                key={lang}
                className="flex-row items-center mr-6"
                onPress={() =>
                  toggleLanguage(lang as keyof typeof preferredLanguages)
                }
              >
                <Ionicons
                  name={
                    preferredLanguages[lang as keyof typeof preferredLanguages]
                      ? "checkbox"
                      : "square-outline"
                  }
                  size={20}
                  color="#0021F5"
                />
                <Text className="ml-2 text-gray-700">{lang}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View
          style={{
            borderBottomWidth: 1,
            borderColor: "#ADADAD",
            marginVertical: 10,
          }}
        />

        {/* Input Fields */}
        <View className="px-8">
          {/* Job Role Dropdown */}
          {/* <View className="mt-[-2] ">
            <Text className="font-semibold text-sm mb-2">
              {t("AddOfficerBasicDetails.JobRole")}
            </Text>
            <View className=" rounded-lg pb-3 ">
              <SelectList
                setSelected={handleJobRoleChange}
                data={jobRoles}
                save="value"
                // defaultOption={{
                //   key: "1",
                //   value: formData.jobRole,
                // }}
                placeholder="Select Job Role"
                boxStyles={{
                  height: 42,
                  borderWidth: 1,
                  borderColor: "#CFCFCF",
                  borderRadius: 5,
                  paddingLeft: 10,
                }}
                dropdownStyles={{ backgroundColor: "white", borderRadius: 5 }}
              />
            </View>
          </View> */}

          {/* User ID Field */}
          <View className="flex-row items-center border border-gray-300 rounded-lg mb-4 bg-gray-100">
            {/* Prefix (30% width) */}
            <View
              className="bg-gray-300 justify-center items-center"
              style={{
                flex: 3,
                height: 40, // Set the height to match the TextInput field
              }}
            >
              <Text className="text-gray-700 text-center">
                {jobRole === "Collection Officer" ? "COO" : "DIO"}
              </Text>
            </View>

            {/* User ID (remaining 70% width) */}
            <View style={{ flex: 7 }}>
              <TextInput
                placeholder="--User ID--"
                value={formData.userId}
                editable={false} // Make this field read-only
                className="px-3 py-2 text-gray-700 bg-gray-100"
                style={{
                  height: 40, // Ensure the height matches the grey part
                }}
              />
            </View>
          </View>

          <TextInput
            placeholder={t("AddOfficerBasicDetails.FirstNameEnglish")}
            value={formData.firstNameEnglish}
            onChangeText={(text) =>
              setFormData({ ...formData, firstNameEnglish: text })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          />
          <TextInput
            placeholder={t("AddOfficerBasicDetails.LastNameEnglish")}
            value={formData.lastNameEnglish}
            onChangeText={(text) =>
              setFormData({ ...formData, lastNameEnglish: text })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          />
          <TextInput
            placeholder={t("AddOfficerBasicDetails.FirstNameinSinhala")}
            value={formData.firstNameSinhala}
            onChangeText={(text) =>
              setFormData({ ...formData, firstNameSinhala: text })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          />
          <TextInput
            placeholder={t("AddOfficerBasicDetails.LastNameSinhala")}
            value={formData.lastNameSinhala}
            onChangeText={(text) =>
              setFormData({ ...formData, lastNameSinhala: text })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          />
          <TextInput
            placeholder={t("AddOfficerBasicDetails.FirstNameTamil")}
            value={formData.firstNameTamil}
            onChangeText={(text) =>
              setFormData({ ...formData, firstNameTamil: text })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          />
          <TextInput
            placeholder={t("AddOfficerBasicDetails.LastNameTamil")}
            value={formData.lastNameTamil}
            onChangeText={(text) =>
              setFormData({ ...formData, lastNameTamil: text })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          />

          {/* Phone Number 1 */}
          <View className="mb-4">
            <View className="flex-row gap-2 rounded-lg">
              <View style={{ flex: 3, alignItems: "center" }} className="  ">
                <SelectList
                  setSelected={setPhoneCode1}
                  data={countryCodes.map((country) => ({
                    key: country.code,
                    value: `${country.code} (${country.dial_code})`,
                  }))}
                  boxStyles={{
                    borderColor: "#ccc", // Remove the border
                    borderRadius: 8,
                    width: "100%",
                    height: 40,
                  }}
                  dropdownStyles={{ borderColor: "#ccc" }}
                  search={false} // Disable search in dropdown if not needed
                  defaultOption={{ key: phoneCode1, value: phoneCode1 }} // Set the default selected value
                />
              </View>
              <View
                style={{ flex: 7 }}
                className="border border-gray-300 rounded-lg  text-gray-700 "
              >
                <TextInput
                  placeholder="7X-XXX-XXXX"
                  keyboardType="phone-pad"
                  value={phoneNumber1}
                  onChangeText={handlePhoneNumber1Change}
                  className="px-3 py-3 text-gray-700"
                  maxLength={9} // Limit the input to 9 characters
                />
              </View>
            </View>
            {error1 ? (
              <Text className="mt-2" style={{ color: "red" }}>
                {error1}
              </Text>
            ) : null}
          </View>

          {/* Phone Number 2 */}
          <View className="mb-4">
            <View className="flex-row items-center gap-2 rounded-lg">
              <View style={{ flex: 3, alignItems: "center" }}>
                <SelectList
                  setSelected={setPhoneCode2}
                  data={countryCodes.map((country) => ({
                    key: country.code,
                    value: `${country.code} (${country.dial_code})`,
                  }))}
                  boxStyles={{
                    borderColor: "#ccc", // Remove the border
                    borderRadius: 8,
                    width: "100%",
                    height: 40,
                  }}
                  dropdownStyles={{ borderColor: "#ccc" }}
                  search={false} // Disable search in dropdown if not needed
                  defaultOption={{ key: phoneCode2, value: phoneCode2 }} // Set the default selected value
                />
              </View>
              <View
                style={{ flex: 7 }}
                className="border border-gray-300 rounded-lg  text-gray-700 "
              >
                <TextInput
                  placeholder="7X-XXX-XXXX"
                  keyboardType="phone-pad"
                  value={phoneNumber2}
                  onChangeText={handlePhoneNumber2Change}
                  className="px-3 py-3 text-gray-700"
                  maxLength={9} // Limit the input to 9 characters
                />
              </View>
            </View>
            {error2 ? (
              <Text className="mt-2" style={{ color: "red" }}>
                {error2}
              </Text>
            ) : null}
          </View>

          <TextInput
            placeholder={t("AddOfficerBasicDetails.NIC")}
            value={formData.nicNumber}
            onChangeText={handleNicNumberChange}
            maxLength={12}
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          />
          {error3 ? (
            <Text className="mb-3" style={{ color: "red" }}>
              {error3}
            </Text>
          ) : null}
          <TextInput
            placeholder={t("AddOfficerBasicDetails.Email")}
            value={formData.email}
            onChangeText={handleEmailChange}
            className="border border-gray-300 rounded-lg px-3 py-2 mb-2 text-gray-700"
          />
          {errorEmail ? (
            <Text className="" style={{ color: "red" }}>
              {errorEmail}
            </Text>
          ) : null}
        </View>

        {/* Buttons */}
        <View className="flex-row justify-center space-x-4 px-4 mt-8 mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-gray-300 px-8 py-3 rounded-full"
          >
            <Text className="text-gray-800 text-center">
              {t("AddOfficerBasicDetails.Cancel")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            disabled={isValidating}
            className={`${
              isValidating ? "bg-gray-400" : "bg-[#2AAD7A]"
            } px-8 py-3 rounded-full`}
          >
            <Text className="text-white text-center">
              {isValidating ? (
                <ActivityIndicator />
              ) : (
                t("AddOfficerBasicDetails.Next")
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddOfficerBasicDetails;
