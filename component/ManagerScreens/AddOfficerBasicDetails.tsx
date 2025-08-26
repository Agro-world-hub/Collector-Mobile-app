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
  const [jobRole, setJobRole] = useState<string>("Collection Officer");
//   const [jobRole, setJobRole] = useState<string>(String(jobRolle));
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
  // Block special characters and letters except V - only allow numbers and V/v
  const filteredInput = input.replace(/[^0-9Vv]/g, '');
  
  // Normalize 'v' to uppercase 'V'
  const normalizedInput = filteredInput.replace(/[vV]/g, "V");

  setFormData({ ...formData, nicNumber: normalizedInput });

  // Validate NIC format
  if (normalizedInput.length === 0) {
    setError3(""); // Clear error when empty
  } else if (!validateNicNumber(normalizedInput)) {
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
  if (nic.length === 0) return;
  
  try {
    setIsValidating(true);
    const token = await AsyncStorage.getItem("token");

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
    console.error("Error checking NIC:", error);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
  } finally {
    setIsValidating(false);
  }
};

  // const checkEmailExists = async (email: string) => {
  //   if (!validateEmail(email)) {
  //     setErrorEmail(
  //       t(
  //         "Error.Invalid email address. Please enter a valid email format (e.g. example@domain.com)."
  //       )
  //     );
  //     return;
  //   }

  //   try {
  //     setIsValidating(true);
  //     const token = await AsyncStorage.getItem("token");
  //     console.log("hittting2");
  //     const response = await axios.get(
  //       `${environment.API_BASE_URL}api/collection-manager/driver/check-email/${email}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.data.exists) {
  //       setErrorEmail(
  //         t("Error.This Email is already registered in the system.")
  //       );
  //     } else {
  //       setErrorEmail("");
  //     }
  //   } catch (error: any) {
  //     console.error("Error checking Email:", error);

  //     if (error.response) {
  //       console.error("Status:", error.response.status);
  //       console.error("Data:", error.response.data);
  //     }
  //     // Set a generic error message if the check fails
  //     setErrorEmail(t("Error.Failed to verify email. Please try again."));
  //   } finally {
  //     setIsValidating(false);
  //   }
  // };
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

  // const handleJobRoleChange = (role: string) => {
    // setJobRole(role);
    // if (role !== "Select Job Role") {
    //   fetchEmpId(role); // Fetch empId based on the selected role
    // }
  // };

    useFocusEffect(
    useCallback(() => {
      fetchEmpId(jobRole); // Fetch empId based on the selected role
    }, [jobRole])
  );

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
        formData: { ...updatedFormData },
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

  // const validateEmail = (email: string) =>
  //   /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|\.com|\.gov|\.lk)$/i.test(email);

  // const handleEmailChange = (input: string) => {
  //   const trimmedInput = input.trim();
  //   setFormData({ ...formData, email: trimmedInput });

  //   if (!trimmedInput) {
  //     setErrorEmail(t("Error.Email is required"));
  //     return;
  //   }
  //   if (!validateEmail(trimmedInput)) {
  //     setErrorEmail(
  //       t(
  //         "Error.Invalid email address. Please enter a valid email format (e.g. example@domain.com)."
  //       )
  //     );
  //     return;
  //   }
  //   checkEmailExists(trimmedInput);
  // };

  // Validation function for phone numbers
 

  const jobRoles = [
    { key: "2", value: "Collection Officer" },
    // Add more roles as necessary
  ];

  const handleEnglishNameChange = (text: string, fieldName: string) => {
  // Only allow English letters and spaces - block numbers, special chars, and other languages
  let filteredText = text.replace(/[^a-zA-Z\s]/g, '');
  
  // Prevent space at the beginning
  if (filteredText.startsWith(' ')) {
    filteredText = filteredText.trimStart();
  }
  
  // Capitalize first letter and make rest lowercase, handle multiple words
  const capitalizedText = filteredText
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (word.length > 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
  
  setFormData({ ...formData, [fieldName]: capitalizedText });
};

// Sinhala name validation function
// const handleSinhalaNameChange = (text: string, fieldName: string) => {
//   // Only allow Sinhala characters and spaces - block English, numbers, special chars
//   // Sinhala Unicode range: \u0D80-\u0DFF
//   let filteredText = text.replace(/[^\u0D80-\u0DFF\s]/g, '');
  
//   // Prevent space at the beginning
//   if (filteredText.startsWith(' ')) {
//     filteredText = filteredText.trimStart();
//   }
  
//   setFormData({ ...formData, [fieldName]: filteredText });
// };

const handleSinhalaNameChange = (text: string, fieldName: string) => {
  // Allow all characters, just prevent space at the beginning
  let filteredText = text;
  
  // Prevent space at the beginning
  if (filteredText.startsWith(' ')) {
    filteredText = filteredText.trimStart();
  }
  
  setFormData({ ...formData, [fieldName]: filteredText });
};

// Tamil name validation function
// const handleTamilNameChange = (text: string, fieldName: string) => {
//   // Only allow Tamil characters and spaces - block English, numbers, special chars
//   // Tamil Unicode range: \u0B80-\u0BFF
//   let filteredText = text.replace(/[^\u0B80-\u0BFF\s]/g, '');
  
//   // Prevent space at the beginning
//   if (filteredText.startsWith(' ')) {
//     filteredText = filteredText.trimStart();
//   }
  
//   setFormData({ ...formData, [fieldName]: filteredText });
// };

const handleTamilNameChange = (text: string, fieldName: string) => {
  // Allow all characters, just prevent space at the beginning
  let filteredText = text;
  
  // Prevent space at the beginning
  if (filteredText.startsWith(' ')) {
    filteredText = filteredText.trimStart();
  }
  
  setFormData({ ...formData, [fieldName]: filteredText });
};

// Updated validation function - must be 9 digits and start with 7
const validatePhoneNumber = (input: string) => {
  return /^7[0-9]{8}$/.test(input); // Must start with 7 and have exactly 9 digits
};

// Handle phone number 1 change - with special character/letter blocking and 7 validation
const handlePhoneNumber1Change = (input: string) => {
  // Block special characters and letters - only allow numbers
  let numbersOnly = input.replace(/[^0-9]/g, '');
  
  // Remove leading zeros
  if (numbersOnly.startsWith("0")) {
    numbersOnly = numbersOnly.replace(/^0+/, "");
  }
  
  setPhoneNumber1(numbersOnly);
  
  // Validate phone number format
  if (numbersOnly.length === 0) {
    setError1(""); // Clear error when empty
  } else if (!numbersOnly.startsWith('7')) {
    setError1(t("Error.Invalid phone number"));
  } else if (numbersOnly.length < 9) {
    setError1(t("Error.Phone number must be 9 digits long"));
  } else if (validatePhoneNumber(numbersOnly)) {
    setError1("");
    checkPhoneExists(numbersOnly);
  } else {
    setError1(t("Error.Invalid phone number"));
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

// Handle phone number 2 change - with special character/letter blocking and 7 validation
const handlePhoneNumber2Change = (input: string) => {
  // Block special characters and letters - only allow numbers
  let numbersOnly = input.replace(/[^0-9]/g, '');
  
  // Remove leading zeros
  if (numbersOnly.startsWith("0")) {
    numbersOnly = numbersOnly.replace(/^0+/, "");
  }
  
  setPhoneNumber2(numbersOnly);
  
  // Validate phone number format
  if (numbersOnly.length === 0) {
    setError2(""); // Clear error when empty
  } else if (!numbersOnly.startsWith('7')) {
    setError2(t("Error.Invalid phone number"));
  } else if (numbersOnly.length < 9) {
    setError2(t("Error.Phone number must be 9 digits long"));
  } else if (validatePhoneNumber(numbersOnly)) {
    setError2("");
    checkPhone2Exists(numbersOnly);
  } else {
    setError2(t("Error.Invalid phone number"));
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

const validateEmail = (email: string): boolean => {
  // Basic email format check
  const generalEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!generalEmailRegex.test(email)) {
    return false;
  }
  
  // Extract local part and domain
  const emailLower = email.toLowerCase();
  const [localPart, domain] = emailLower.split('@');
  
  // Check for specific allowed domains
  const allowedSpecificDomains = ['gmail.com', 'googlemail.com', 'yahoo.com'];
  const allowedTLDs = ['.com', '.gov', '.lk'];
  
  // Gmail/Googlemail specific validation
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    return validateGmailLocalPart(localPart);
  }
  
  // Yahoo validation (standard email rules)
  if (domain === 'yahoo.com') {
    return true;
  }
  
  // Check for other allowed domains (.com, .gov, .lk)
  for (const tld of allowedTLDs) {
    if (domain.endsWith(tld)) {
      return true;
    }
  }
  
  return false;
};

// Gmail-specific local part validation
const validateGmailLocalPart = (localPart: string): boolean => {
  // Gmail rules:
  // 1. Only alphanumeric characters, dots (.), and plus signs (+) allowed
  // 2. No consecutive dots
  // 3. No leading or trailing dots
  
  // Check for valid characters only (a-z, 0-9, ., +)
  const validCharsRegex = /^[a-zA-Z0-9.+]+$/;
  if (!validCharsRegex.test(localPart)) {
    return false;
  }
  
  // Check for leading or trailing dots
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return false;
  }
  
  // Check for consecutive dots
  if (localPart.includes('..')) {
    return false;
  }
  
  // Must have at least one character
  if (localPart.length === 0) {
    return false;
  }
  
  return true;
};

// Enhanced email change handler
const handleEmailChange = (input: string) => {
  const trimmedInput = input.trim();
  setFormData({ ...formData, email: trimmedInput });

  if (!trimmedInput) {
    setErrorEmail(t("Error.Email is required"));
    return;
  }

  if (!validateEmail(trimmedInput)) {
    // Provide specific error messages based on domain
    const emailLower = trimmedInput.toLowerCase();
    const domain = emailLower.split('@')[1];
    
    if (domain === 'gmail.com' || domain === 'googlemail.com') {
      setErrorEmail(
        t("Error.Invalid Gmail address")
      );
    } else {
      setErrorEmail(
        t("Error.Invalid email address Example")
      );
    }
    return;
  }

  // Clear any previous errors and check if email exists
  setErrorEmail("");
  checkEmailExists(trimmedInput);
};

// Updated checkEmailExists function
const checkEmailExists = async (email: string) => {
  // Double-check validation before API call
  if (!validateEmail(email)) {
    setErrorEmail(
       t("Error.Invalid email address Example")
    );
    return;
  }

  try {
    setIsValidating(true);
    const token = await AsyncStorage.getItem("token");
    console.log("Checking email existence:", email);
    
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
    setErrorEmail(t("Error.somethingWentWrong"));
  } finally {
    setIsValidating(false);
  }
};


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled
      style={{ flex: 1}}
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
                : require("../../assets/images/user2.png")
            }
            className="w-24 h-24 rounded-full"
          />

          {/* Edit Icon (Pen Icon) */}
          <TouchableOpacity
            onPress={handleImagePick} // Handle the image picking
            className="absolute bottom-0 right-4 bg-[#980775] p-1 rounded-full mr-[35%] shadow-md"
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
              color="#980775"
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
              color="#980775"
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
                  color="#980775"
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
          {/* <View className="flex-row items-center border border-gray-300 rounded-lg mb-4 bg-gray-100">
        
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

 
            <View style={{ flex: 7 }}>
              <TextInput
                placeholder="--User ID--"
                value={formData.userId}
                editable={false} // Make this field read-only
                className="px-3 py-2 text-gray-700 bg-[#F4F4F4]"
                style={{
                  height: 40, // Ensure the height matches the grey part
                }}
              />
            </View>
          </View> */}

         <TextInput
  placeholder={t("AddOfficerBasicDetails.FirstNameEnglish")}
  value={formData.firstNameEnglish}
  onChangeText={(text) => handleEnglishNameChange(text, 'firstNameEnglish')}
  className="border border-[#F4F4F4] bg-[#F4F4F4] rounded-full px-3 py-2 mb-4 text-gray-700"
  keyboardType="default"
  autoCapitalize="words"
  autoCorrect={false}
/>

<TextInput
  placeholder={t("AddOfficerBasicDetails.LastNameEnglish")}
  value={formData.lastNameEnglish}
  onChangeText={(text) => handleEnglishNameChange(text, 'lastNameEnglish')}
  className="border border-[#F4F4F4] bg-[#F4F4F4] rounded-full px-3 py-2 mb-4 text-gray-700"
  keyboardType="default"
  autoCapitalize="words"
  autoCorrect={false}
/>

<TextInput
  placeholder={t("AddOfficerBasicDetails.FirstNameinSinhala")}
  value={formData.firstNameSinhala}
  onChangeText={(text) => handleSinhalaNameChange(text, 'firstNameSinhala')}
  className="border border-[#F4F4F4] bg-[#F4F4F4] rounded-full px-3 py-2 mb-4 text-gray-700"
  autoCorrect={false}
/>

<TextInput
  placeholder={t("AddOfficerBasicDetails.LastNameSinhala")}
  value={formData.lastNameSinhala}
  onChangeText={(text) => handleSinhalaNameChange(text, 'lastNameSinhala')}
  className="border border-[#F4F4F4] bg-[#F4F4F4] rounded-full px-3 py-2 mb-4 text-gray-700"
  autoCorrect={false}
/>

<TextInput
  placeholder={t("AddOfficerBasicDetails.FirstNameTamil")}
  value={formData.firstNameTamil}
  onChangeText={(text) => handleTamilNameChange(text, 'firstNameTamil')}
  className="border border-[#F4F4F4] bg-[#F4F4F4] rounded-full px-3 py-2 mb-4 text-gray-700"
  autoCorrect={false}
/>

<TextInput
  placeholder={t("AddOfficerBasicDetails.LastNameTamil")}
  value={formData.lastNameTamil}
  onChangeText={(text) => handleTamilNameChange(text, 'lastNameTamil')}
  className="border border-[#F4F4F4] bg-[#F4F4F4] rounded-full px-3 py-2 mb-4 text-gray-700"
  autoCorrect={false}
/>

          {/* Phone Number 1 */}
       <View className="mb-4">
  <View className="flex-row gap-2 rounded-lg">
    <View style={{ flex: 3, alignItems: "center" }} className="">
      <SelectList
        setSelected={setPhoneCode1}
        data={countryCodes.map((country) => ({
          key: country.code,
          value: `${country.code} (${country.dial_code})`,
        }))}
        boxStyles={{
          borderColor: "#F4F4F4", // Fixed: Removed backticks
          borderRadius: 25,
          width: "100%",
          height: 45,
          backgroundColor: "#F4F4F4", // Fixed: Removed backticks
        }}
        dropdownStyles={{ borderColor: "#ccc" }}
        search={false}
        defaultOption={{ key: phoneCode1, value: phoneCode1 }}
      />
    </View>
    <View
      style={{ flex: 7 }}
      className="border border-[#F4F4F4] bg-[#F4F4F4] rounded-full text-gray-700" // Fixed: Removed backticks
    >
      <TextInput
        placeholder="7X-XXX-XXXX"
        keyboardType="phone-pad"
        value={phoneNumber1}
        onChangeText={handlePhoneNumber1Change}
        className="px-3 py-3 text-gray-700 border-[#F4F4F4] bg-[#F4F4F4] rounded-full" // Fixed: Removed backticks
        maxLength={9}
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
          borderColor: "#F4F4F4", // Fixed: Removed backticks
          borderRadius: 25,
          width: "100%",
          height: 45,
          backgroundColor: "#F4F4F4", // Fixed: Removed backticks
        }}
        dropdownStyles={{ borderColor: "#ccc" }}
        search={false}
        defaultOption={{ key: phoneCode2, value: phoneCode2 }}
      />
    </View>
    <View
      style={{ flex: 7 }}
      className="border border-[#F4F4F4] bg-[#F4F4F4] rounded-full text-gray-700" // Fixed: Removed backticks
    >
      <TextInput
        placeholder="7X-XXX-XXXX"
        keyboardType="phone-pad"
        value={phoneNumber2}
        onChangeText={handlePhoneNumber2Change}
        className="px-3 py-3 text-gray-700"
        maxLength={9}
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
  keyboardType="default"
  autoCapitalize="characters"
  autoCorrect={false}
  className="border border-[#F4F4F4] bg-[#F4F4F4] rounded-full px-3 py-2 mb-4 text-gray-700" // Fixed: Removed backticks
/>
{error3 ? (
  <Text className="mb-3" style={{ color: "red" }}>
    {error3}
  </Text>
) : null}


          {/* <TextInput
            placeholder={t("AddOfficerBasicDetails.Email")}
            value={formData.email}
            onChangeText={handleEmailChange}
            className="border border-[#F4F4F4] bg-[#F4F4F4] rounded-full  px-3 py-2 mb-2 text-gray-700"
          />
          {errorEmail ? (
            <Text className="" style={{ color: "red" }}>
              {errorEmail}
            </Text>
          ) : null} */}

          <View>
  <TextInput
    placeholder={t("AddOfficerBasicDetails.Email")}
    value={formData.email}
    onChangeText={handleEmailChange}
    className="border border-[#F4F4F4] bg-[#F4F4F4] rounded-full px-3 py-2 mb-2 text-gray-700"
    keyboardType="email-address"
    autoCapitalize="none"
    autoCorrect={false}
    editable={!isValidating}
  />
  {isValidating && (
    <Text style={{ color: "#666", fontSize: 12, marginBottom: 4 }}>
      {t("Validating email...")}
    </Text>
  )}
  {errorEmail ? (
    <Text className="" style={{ color: "red" }}>
      {errorEmail}
    </Text>
  ) : null}
</View>
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
              isValidating ? "bg-gray-400" : "bg-[#000000]"
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
