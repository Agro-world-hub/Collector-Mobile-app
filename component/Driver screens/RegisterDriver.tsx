import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { useNavigation } from "@react-navigation/native";
import { OfficerBasicDetailsFormData } from "../types";
import { environment } from "@/environment/environment";
import countryCodes from "../ManagerScreens/countryCodes.json";
import AntDesign from "react-native-vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import { SelectList } from "react-native-dropdown-select-list";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

type RegisterDriverNavigationProp = StackNavigationProp<
  RootStackParamList,
  "RegisterDriver"
>;

const RegisterDriver: React.FC = () => {
  const navigation = useNavigation<RegisterDriverNavigationProp>();

  const [type, setType] = useState<"Permanent" | "Temporary">("Permanent");
  const [preferredLanguages, setPreferredLanguages] = useState({
    Sinhala: false,
    English: false,
    Tamil: false,
  });
  const [jobRole, setJobRole] = useState<string>("Select Job Role");
  const [phoneCode1, setPhoneCode1] = useState<string>("+94");
  const [phoneCode2, setPhoneCode2] = useState<string>("+94");
  const [phoneNumber1, setPhoneNumber1] = useState("");
  const [phoneNumber2, setPhoneNumber2] = useState("");
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
  });

  const [error1, setError1] = useState("");
  const [error2, setError2] = useState("");
  const [error3, setError3] = useState("");
  const [errorEmail, setErrorEmail] = useState("");

  const toggleLanguage = (language: keyof typeof preferredLanguages) => {
    setPreferredLanguages((prev) => ({
      ...prev,
      [language]: !prev[language],
    }));
  };

  const validateNicNumber = (input: string) => /^[0-9]{9}V$|^[0-9]{10}$/.test(input);
  const validateEmail = (email: string) =>
    /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|\.com|\.gov|\.lk)$/i.test(email);
  const validatePhoneNumber = (input: string) => /^[0-9]{9}$/.test(input);

  const handleNicNumberChange = (input: string) => {
    const normalizedInput = input.replace(/[vV]/g, "V");
    setFormData({ ...formData, nicNumber: normalizedInput });

    if (!validateNicNumber(normalizedInput)) {
      setError3("NIC Number must be 9 digits followed by 'V' or 10 digits.");
    } else {
      setError3("");
    }
  };

  const handleEmailChange = (input: string) => {
    setFormData({ ...formData, email: input });
    if (!validateEmail(input)) {
      setErrorEmail(t("ErrorEmail"));
    } else {
      setErrorEmail("");
    }
  };

  const handlePhoneNumber1Change = (input: string) => {
    setPhoneNumber1(input);
    if (!validatePhoneNumber(input)) {
      setError1(t("Error.setphoneError1"));
    } else {
      setError1("");
    }
  };

  const handlePhoneNumber2Change = (input: string) => {
    setPhoneNumber2(input);
    if (!validatePhoneNumber(input)) {
      setError2(t("Error.setphoneError2"));
    } else {
      setError2("");
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
          userId: response.data.result.empId,
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
      fetchEmpId(role);
    }
  };

  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission required",
        "You need to grant camera roll permissions to select an image"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (result.assets[0].base64) {
        setSelectedImage(result.assets[0].base64);
      }
    }
  };

  const handleNext = () => {
    if (
      !formData.userId ||
      !formData.firstNameEnglish ||
      !formData.lastNameEnglish ||
      !phoneNumber1 ||
      !formData.nicNumber ||
      !formData.email
    ) {
      Alert.alert(t("Error.error"), t("Error.Please fill in all required fields."));
      return;
    }

    const updatedFormData = {
      ...formData,
      phoneCode1,
      phoneNumber1,
      phoneCode2,
      phoneNumber2,
    };

    updatedFormData.profileImage = selectedImage || "";

    console.log(
      "Form Data:",
      updatedFormData,
      preferredLanguages,
      type,
      jobRole
    );

    const prefixedUserId =
      jobRole === "Driver" ? `DVR${formData.userId}` : formData.userId;

    // Commented out navigation as it was in the original code
    navigation.navigate("AddDriverAddressDetails" as any, {
      formData: { ...updatedFormData, userId: prefixedUserId },
      type,
      preferredLanguages,
      jobRole,
    });
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
      <ScrollView className="flex-1 bg-white" keyboardShouldPersistTaps="handled">
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
          <Text className="font-semibold text-sm mr-4">{t("AddOfficerBasicDetails.Type")}</Text>
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
            <Text className="ml-2 text-gray-700">{t("AddOfficerBasicDetails.Permanent")}</Text>
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
            <Text className="ml-2 text-gray-700">{t("AddOfficerBasicDetails.Temporary")}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ borderBottomWidth: 1, borderColor: "#ADADAD", marginVertical: 10 }} />

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

        <View style={{ borderBottomWidth: 1, borderColor: "#ADADAD", marginVertical: 10 }} />

        {/* Input Fields */}
        <View className="px-8">
          {/* Job Role Dropdown */}
          <View className="mt-[-2] ">
            <Text className="font-semibold text-sm mb-2">{t("AddOfficerBasicDetails.JobRole")}</Text>
            <View className=" rounded-lg pb-3 " >
              <SelectList
                setSelected={handleJobRoleChange}
                data={jobRoles}
                save="value"
                defaultOption={{
                  key: "1",
                  value: formData.jobRole,
                }}
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
          </View>

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
                {jobRole === "Collection Officer" ? "COO" : ""}
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
                {/* <Picker
              selectedValue={phoneCode1}
              onValueChange={(itemValue) => setPhoneCode1(itemValue)}
              style={{ width: '100%' }}
            >
              {countryCodes.map((country) => (
                <Picker.Item
                  key={country.code}
                  label={`${country.code} (${country.dial_code})`}
                  value={country.dial_code}
                />
              ))}
            </Picker> */}

            
                <SelectList
                  setSelected={setPhoneCode1}
                  data={countryCodes.map((country: { code: any; dial_code: any; }) => ({
                    key: country.code,
                    value: `${country.code} (${country.dial_code})`,
                  }))}
                  boxStyles={{
                    borderColor: "#ccc", // Remove the border
                    borderRadius: 8,
                    width: "100%",
                    height: 40
                  }}
                  dropdownStyles={{ borderColor: "#ccc" }}
                  search={false} // Disable search in dropdown if not needed
                  defaultOption={{ key: phoneCode1, value: phoneCode1 }} // Set the default selected value
                />
              </View>
              <View style={{ flex: 7 }} className="border border-gray-300 rounded-lg  text-gray-700 ">
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
            {error1 ? <Text className="mt-2" style={{ color: "red" }}>{error1}</Text> : null}
          </View>

          {/* Phone Number 2 */}
          <View className="mb-4">
            <View className="flex-row items-center gap-2 rounded-lg">
              <View style={{ flex: 3, alignItems: "center" }}>
                {/* <Picker
              selectedValue={phoneCode2}
              onValueChange={(itemValue) => setPhoneCode2(itemValue)}
              style={{ width: '100%' }}
            >
              {countryCodes.map((country) => (
                <Picker.Item
                  key={country.code}
                  label={`${country.code} (${country.dial_code})`}
                  value={country.dial_code}
                />
              ))}
            </Picker> */}
                <SelectList
                  setSelected={setPhoneCode2}
                  data={countryCodes.map((country: { code: any; dial_code: any; }) => ({
                    key: country.code,
                    value: `${country.code} (${country.dial_code})`,
                  }))}
                  boxStyles={{
                    borderColor: "#ccc", // Remove the border
                    borderRadius: 8,
                    width: "100%",
                    height: 40
                  }}
                  dropdownStyles={{ borderColor: "#ccc" }}
                  search={false} // Disable search in dropdown if not needed
                  defaultOption={{ key: phoneCode2, value: phoneCode2 }} // Set the default selected value
                />
              </View>
              <View style={{ flex: 7 }} className="border border-gray-300 rounded-lg  text-gray-700 ">
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
            {error2 ? <Text className="mt-2" style={{ color: "red" }}>{error2}</Text> : null}
          </View>

          {/* <TextInput
            placeholder="--NIC Number--"
            value={formData.nicNumber}
            onChangeText={(text) =>
              setFormData({ ...formData, nicNumber: text })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          /> */}

<TextInput
            placeholder={t("AddOfficerBasicDetails.NIC")}
            value={formData.nicNumber}
            onChangeText={handleNicNumberChange}
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          />
          {error3 ? <Text className="mb-3" style={{ color: "red" }}>{error3}</Text> : null}
          <TextInput
            placeholder={t("AddOfficerBasicDetails.Email")}
            value={formData.email}
            onChangeText={handleEmailChange}
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          />
          {errorEmail ? <Text className="mt-2" style={{ color: "red" }}>{errorEmail}</Text> : null}
        </View>

        {/* Buttons */}
        <View className="flex-row justify-center space-x-4 px-4 mt-8 mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-gray-300 px-8 py-3 rounded-full"
          >
            <Text className="text-gray-800 text-center">{t("AddOfficerBasicDetails.Cancel")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            className="bg-[#2AAD7A] px-8 py-3 rounded-full"
          >
            <Text className="text-white text-center">{t("AddOfficerBasicDetails.Next")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterDriver;

