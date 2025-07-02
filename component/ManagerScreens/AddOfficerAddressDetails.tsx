import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { environment } from "@/environment/environment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from "react-native-vector-icons/AntDesign";
import countryCodes from "./countryCodes.json";
import { SelectList } from "react-native-dropdown-select-list";
import { ActivityIndicator } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";
import bankNames from "../../assets/jsons/banks.json";
import { useTranslation } from "react-i18next";

type AddOfficerAddressDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AddOfficerAddressDetails"
>;

type District = {
  en: string;
  si: string;
  ta: string;
};

const AddOfficerAddressDetails: React.FC = () => {
  const navigation = useNavigation<AddOfficerAddressDetailsNavigationProp>();
  const route =
    useRoute<RouteProp<RootStackParamList, "AddOfficerAddressDetails">>();

  // Rename the destructured `formData` from route.params to avoid conflict
  const {
    formData: basicDetails,
    type,
    preferredLanguages,
    jobRole,
  } = route.params;
  console.log(
    "Basic details:",
    basicDetails,
    type,
    preferredLanguages,
    jobRole
  );
  const [filteredBranches, setFilteredBranches] = useState<any[]>([]);
  const [bankName, setBankName] = useState<string>("");
  const [branchName, setBranchName] = useState<string>("");
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    houseNumber: "",
    streetName: "",
    city: "",
    country: "Sri Lanka", // Always set to Sri Lanka
    province: "",
    district: "",
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    bankName: "",
    branchName: "",
    profileImage: "",
  });

  console.log(formData);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countries, setCountries] = useState<
    { name: string; dial_code: string; code: string }[]
  >([]);

  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const fetchSelectedLanguage = async () => {
    try {
      const lang = await AsyncStorage.getItem("@user_language"); // Get stored language
      setSelectedLanguage(lang || "en"); // Default to English if not set
    } catch (error) {
      console.error("Error fetching language preference:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchSelectedLanguage();
    };
    fetchData();
  }, []);

  // Function to save data to AsyncStorage whenever a field changes
  const saveDataToStorage = async (updatedData: any) => {
    try {
      await AsyncStorage.setItem(
        "officerFormData",
        JSON.stringify(updatedData)
      );
    } catch (error) {
      console.error("Error saving form data:", error);
    }
  };

  // Handle input changes and save to AsyncStorage
  const handleInputChange = (key: string, value: string) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [key]: value };
      saveDataToStorage(updatedData); // Save every time data changes
      return updatedData;
    });
  };

  // Validation for matching account numbers
  const handleValidation = (key: string, value: string) => {
    setFormData((prevState) => {
      const updatedFormData = { ...prevState, [key]: value };
      const { accountNumber, confirmAccountNumber } = updatedFormData;

      if (
        accountNumber &&
        confirmAccountNumber &&
        accountNumber !== confirmAccountNumber
      ) {
        setError(t("Error.Account numbers do not match."));
      } else {
        setError(""); // Clear error if they match
      }

      saveDataToStorage(updatedFormData); // Ensure data is saved after validation
      return updatedFormData;
    });
  };

  // Load saved data when the component mounts
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("officerFormData");
        if (storedData) {
          setFormData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Error loading form data:", error);
      }
    };

    loadStoredData();
  }, []);

  // Load country data from JSON
  useEffect(() => {
    setCountries(countryCodes); // Assuming countryCodes is preloaded
  }, []);

  // Clear AsyncStorage after successful submission
  const handleSubmit = async () => {
    if (
      !formData.houseNumber ||
      !formData.streetName ||
      !formData.city ||
      !formData.accountHolderName ||
      !formData.accountNumber ||
      !formData.confirmAccountNumber ||
      !formData.bankName ||
      !formData.branchName ||
      !formData.province
    ) {
      Alert.alert(
        t("Error.error"),
        t("Error.Please fill in all required fields.")
      );
      return;
    }

    if (formData.accountNumber !== formData.confirmAccountNumber) {
      Alert.alert(t("Error.error"), t("Error.Account numbers do not match."));
      return;
    }

    // Ensure 'Sri Lanka' is set as the country before submitting
    const combinedData = {
      ...basicDetails,
      ...formData,
      jobRole,
      empType: type,
      languages: Object.keys(preferredLanguages)
        .filter(
          (lang) => preferredLanguages[lang as keyof typeof preferredLanguages]
        )
        .join(", "), // Convert preferred languages to a comma-separated string
      profileImage: basicDetails.profileImage || "", // Include the base64 image in the payload
    };

    console.log("Combined data for passing to backend:", combinedData);

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        `${environment.API_BASE_URL}api/collection-manager/collection-officer/add`,
        combinedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        Alert.alert(
          t("Error.Success"),
          t("Error.Officer created successfully")
        );
        setLoading(false);
         // Clear saved form data after successful submission

        if(jobRole==="Collection Officer")
        navigation.navigate("Main", { screen: "CollectionOfficersList" });
      await AsyncStorage.removeItem("officerFormData");
      }else if(jobRole==="Distribution Officer"){
                navigation.navigate("Main", { screen: "DistributionOfficersList" });
await AsyncStorage.removeItem("officerFormData");
      }
    } catch (error) {
      console.error("Error submitting officer data:", error);
      setLoading(false);
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 400
      ) {
        const serverErrors = error.response.data.error;
        if (serverErrors) {
          if (typeof serverErrors === "string") {
            Alert.alert(t("Error.error"), t("Error.somethingWentWrong"));
          } else {
            const errorMessages = Object.values(serverErrors).join("\n");
            // Alert.alert(t("Error.error"), errorMessages);
            Alert.alert(t("Error.error"), t("Error.somethingWentWrong"));
          }
        } else {
          Alert.alert(
            t("Error.error"),
            t("Error.An error occurred while creating the officer.")
          );
        }
      } else {
        Alert.alert(
          t("Error.error"),
          t("Error.An error occurred while creating the officer.")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const jsonData = {
    provinces: [
      {
        name: { en: "Western", si: "බටහිර", ta: "மேற்கு" },
        districts: [
          { en: "Colombo", si: "කොළඹ", ta: "கொழும்பு" },
          { en: "Gampaha", si: "ගම්පහ", ta: "கம்பஹா" },
          { en: "Kalutara", si: "කළුතර", ta: "களுத்துறை" },
        ],
      },
      {
        name: { en: "Central", si: "මධ්‍යම", ta: "மத்திய" },
        districts: [
          { en: "Kandy", si: "මහනුවර", ta: "கண்டி" },
          { en: "Matale", si: "මාතලේ", ta: "மாதளை" },
          { en: "Nuwara Eliya", si: "නුවරඑළිය", ta: "நுவரேலியா" },
        ],
      },
      {
        name: { en: "Southern", si: "දකුණ", ta: "தெற்கு" },
        districts: [
          { en: "Galle", si: "ගාල්ල", ta: "காலி" },
          { en: "Matara", si: "මාතර", ta: "மாத்தறை" },
          { en: "Hambantota", si: "හම්බන්තොට", ta: "ஹம்பாந்தோட்டை" },
        ],
      },
      {
        name: { en: "Eastern", si: "නැගෙනහිර", ta: "கிழக்கு" },
        districts: [
          { en: "Ampara", si: "අම්පාර", ta: "அம்பாறை" },
          { en: "Batticaloa", si: "මඩකලපුව", ta: "பாட்டிக்கோடை" },
          { en: "Trincomalee", si: "ත්‍රිකුණාමලය", ta: "திருகோணமலை" },
        ],
      },
      {
        name: { en: "Northern", si: " උතුරු", ta: "வடக்கு" },
        districts: [
          { en: "Jaffna", si: "යාපනය", ta: "யாழ்ப்பாணம்" },
          { en: "Kilinochchi", si: "කිලිනොච්චි", ta: "கில்லினோச்சி" },
          { en: "Mullaitivu", si: "මුල්ලිතිවු", ta: "முல்லைத்தீவு" },
        ],
      },
      {
        name: { en: "North Western", si: "උතුරු මැද", ta: "வடமேல்" },
        districts: [
          { en: "Kurunegala", si: "කුරුණෑගල", ta: "குருநாகல்" },
          { en: "Puttalam", si: "පුත්තලම", ta: "புத்தளம்" },
        ],
      },
      {
        name: { en: "North Central", si: "උතුරු මධ්‍යම", ta: "வட மத்திய" },
        districts: [
          { en: "Anuradhapura", si: "අනුරාධපුර", ta: "அனுராதபுரம்" },
          { en: "Polonnaruwa", si: "පොලොන්නරුව", ta: "பொலன்னருவ" },
        ],
      },
      {
        name: { en: "Uva", si: "උව", ta: "உவா" },
        districts: [
          { en: "Badulla", si: "බදුල්ල", ta: "பதுளை" },
          { en: "Moneragala", si: "මොනරාගල", ta: "முனரகலை" },
        ],
      },
      {
        name: { en: "Sabaragamuwa", si: "සබරගමුව", ta: "சபரகமுவ" },
        districts: [
          { en: "Ratnapura", si: "රත්නපුර", ta: "ரத்நாபுர" },
          { en: "Kegalle", si: "කැගල්ල", ta: "கெகலே" },
        ],
      },
    ],
  };

  const [districts, setDistricts] = useState<District[]>([]); // Change from string[] to District[]

  const handleProvinceChange = (provinceName: string) => {
    const selectedProvince = jsonData.provinces.find(
      (p) => p.name.en === provinceName // Use 'en' for comparison
    );

    if (selectedProvince) {
      setFormData({
        ...formData,
        province: selectedProvince.name.en,
        district: "", // Reset district when changing the province
      });

      if (!selectedLanguage) return; // Ensure selectedLanguage is not null

      setDistricts(
        selectedProvince.districts.map((d) => ({
          en: d.en,
          si: d.si,
          ta: d.ta,
        }))
      );
    }
  };

  const handleDistrictChange = (district: string) => {
    setFormData({ ...formData, district }); // Ensure the district is stored in formData
  };

  useEffect(() => {
    if (bankName) {
      const selectedBank = bankNames.find((bank) => bank.name === bankName);
      if (selectedBank) {
        try {
          const data = require("../../assets/jsons/branches.json");
          const filteredBranches = data[selectedBank.ID] || [];

          const sortedBranches = filteredBranches.sort(
            (a: { name: string }, b: { name: any }) =>
              a.name.localeCompare(b.name)
          );

          setFilteredBranches(sortedBranches);
        } catch (error) {
          console.error("Error loading branches", error);
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

  const handleBankSelection = (selectedBank: string) => {
    setBankName(selectedBank);
    setFormData((prevData) => {
      const updatedData = { ...prevData, bankName: selectedBank }; // Update the form data with new bankName
      saveDataToStorage(updatedData); // Save every time bank name changes
      return updatedData;
    });
  };

  const handleBranchSelection = (selectedBranch: string) => {
    setBranchName(selectedBranch);
    setFormData((prevData) => {
      const updatedData = { ...prevData, branchName: selectedBranch }; // Update the form data with new branchName
      saveDataToStorage(updatedData); // Save every time branch name changes
      return updatedData;
    });
  };

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
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="pr-4"
          >
            <AntDesign name="left" size={24} color="#000502" />
          </TouchableOpacity>
          {/* <Text className="text-lg font-bold ml-[25%]">{t("AddOfficerAddressDetails.AddOfficer")}</Text> */}
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg font-bold">
              {t("AddOfficerAddressDetails.AddOfficer")}
            </Text>
          </View>
        </View>

        {/* Address Details */}
        <View className="px-8 mt-4">
          <TextInput
            placeholder={t("AddOfficerAddressDetails.House")}
            value={formData.houseNumber}
            onChangeText={(text) =>
              setFormData({ ...formData, houseNumber: text })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          />
          <TextInput
            placeholder={t("AddOfficerAddressDetails.Street Name")}
            value={formData.streetName}
            onChangeText={(text) =>
              setFormData({ ...formData, streetName: text })
            }
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          />
          <TextInput
            placeholder={t("AddOfficerAddressDetails.City")}
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          />
          <TextInput
            placeholder={t("AddOfficerAddressDetails.Country")}
            value={t("AddOfficerAddressDetails.Country")} // Always set to Sri Lanka
            editable={false} // Make the input non-editable
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          />

          <View style={{ marginBottom: 10 }}>
            {/* <Text style={{ fontSize: 18, marginBottom: 5 }}>Select Province</Text> */}
            <SelectList
              setSelected={(province: any) => handleProvinceChange(province)}
              data={jsonData.provinces.map((province) => ({
                key: province.name.en,
                value:
                  province.name[
                    selectedLanguage as keyof typeof province.name
                  ] || province.name.en,
              }))}
              boxStyles={{
                borderColor: "#cccccc",
                borderWidth: 1,
                borderRadius: 5,
                padding: 10,
                paddingLeft: 15,
                paddingRight: 15,
              }}
              dropdownStyles={{
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "#cccccc",
              }}
              search={true}
              placeholder={t("AddOfficerAddressDetails.Select Province")}
            />
          </View>

          {/* District Dropdown */}
          {formData.province && (
            <View style={{ marginBottom: 2 }}>
              {/* <Text style={{ fontSize: 18, marginBottom: 5 }}>Select District</Text> */}
              <SelectList
                setSelected={handleDistrictChange} // Use the updated function to handle district change
                data={districts.map((district) => ({
                  key: district.en,
                  value: district[selectedLanguage as keyof typeof district], // Value displayed in the selected language
                }))}
                boxStyles={{
                  borderColor: "#cccccc",
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 10,
                  paddingLeft: 15,
                  paddingRight: 15,
                }}
                dropdownStyles={{
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: "#cccccc",
                }}
                search={true}
                placeholder={t("AddOfficerAddressDetails.Select District")}
              />
            </View>
          )}
        </View>

        {/* Bank Details */}
        <View className="px-8 mt-4">
          <TextInput
            placeholder={t("AddOfficerAddressDetails.AccountName")}
            value={formData.accountHolderName}
            onChangeText={(text) =>
              handleInputChange("accountHolderName", text)
            }
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          />
          <TextInput
            placeholder={t("AddOfficerAddressDetails.AccountNum")}
            keyboardType="numeric"
            value={formData.accountNumber}
            onChangeText={(text) => handleValidation("accountNumber", text)}
            className="border border-gray-300 rounded-lg px-3 py-2 mb-4 text-gray-700"
          />
          <TextInput
            placeholder={t("AddOfficerAddressDetails.Confirm AccountNum")}
            keyboardType="numeric"
            value={formData.confirmAccountNumber}
            onChangeText={(text) =>
              handleValidation("confirmAccountNumber", text)
            }
            className={`border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-lg px-3 py-2 mb-4 text-gray-700`}
          />
          {error && <Text className="text-red-500 text-sm mb-4">{error}</Text>}

          <View className="">
            <View className="mb-4">
              <SelectList
                setSelected={handleBankSelection} // Handle bank selection
                data={bankNames.map((bank) => ({
                  key: bank.name, // Bank name as key
                  value: bank.name, // Display name in dropdown
                }))}
                defaultOption={{
                  key: formData.bankName,
                  value: formData.bankName,
                }}
                placeholder={t("AddOfficerAddressDetails.BankName")}
                boxStyles={{
                  borderColor: "#cccccc",
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 10,
                  paddingLeft: 15,
                  paddingRight: 15,
                }}
                dropdownStyles={{
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: "#cccccc",
                }}
                search={true}
              />
            </View>
            <View>
              {filteredBranches.length > 0 && (
                <SelectList
                  setSelected={handleBranchSelection} // Handle branch selection
                  data={filteredBranches.map((branch) => ({
                    key: branch.name, // Branch name as key
                    value: branch.name, // Display branch name in dropdown
                  }))}
                  defaultOption={{
                    key: formData.branchName,
                    value: formData.branchName,
                  }}
                  placeholder={t("AddOfficerAddressDetails.BranchName")}
                  boxStyles={{
                    borderColor: "#cccccc",
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 10,
                    paddingLeft: 15,
                    paddingRight: 15,
                  }}
                  dropdownStyles={{
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: "#cccccc",
                  }}
                  search={true}
                />
              )}
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View className="flex-row justify-center space-x-4 px-4 mt-8 mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-gray-300 px-8 py-3 rounded-full"
          >
            <Text className="text-gray-800 text-center">
              {t("AddOfficerAddressDetails.Go")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            // className="bg-green-600 px-8 py-3 rounded-full"
            className={`bg-green-600 px-8 py-3 rounded-full ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-white text-center">
                {t("AddOfficerAddressDetails.Submit")}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddOfficerAddressDetails;
