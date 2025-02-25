import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import environment from "../environment/environment";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types";

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type ProfileNavigationProps = StackNavigationProp<RootStackParamList, 'Profile'>;

interface ProfileProps {
  navigation: ProfileNavigationProps;
}

const Profile: React.FC<ProfileProps> = ({ navigation }) => {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    regcode: "",
    jobRole: "",
    nicNumber: "",
    phoneNumber: "",
    phoneNumber2: "",
    houseNumber: "",
    streetName: "",
    city: ""
  });
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newPhoneNumber2, setNewPhoneNumber2] = useState("");

  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const handlePhoneNumberChange = (text: string) => {
    setNewPhoneNumber(text);

    if (text.length > 12) {
      setErrorMessage("Phone number cannot exceed 12 digits.");
    } else {
      setErrorMessage("");
    }
    toggleUpdateButton(text, newPhoneNumber2);
  };

  const handlePhoneNumber2Change = (text: string) => {
    setNewPhoneNumber2(text);

    if (text.length > 12) {
      setErrorMessage("Phone number cannot exceed 12 digits.");
    } else {
      setErrorMessage("");
    }
    toggleUpdateButton(newPhoneNumber, text);
  };
  
  const toggleUpdateButton = (phone1: string, phone2: string) => {
    setShowUpdateButton(
      (phone1 !== "" && phone1 !== profileData.phoneNumber) ||
      (phone2 !== "" && phone2 !== profileData.phoneNumber2)
    );
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No token found");
        return;
      }

      const response = await api.get("api/collection-officer/user-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data.data;
      console.log(data);

      setProfileData({
        firstName: data.firstNameEnglish,
        lastName: data.lastNameEnglish,
        companyName: data.companyName,
        regcode: data.centerId.toString(),
        jobRole: data.jobRole,
        nicNumber: data.nic,
        houseNumber: data.houseNumber,
        streetName: data.streetName,
        city: data.city,
        phoneNumber: data.phoneNumber01,
        phoneNumber2: data.phoneNumber02
      });
      setNewPhoneNumber(data.phoneNumber01);
      setNewPhoneNumber2(data.phoneNumber02);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      Alert.alert("Error", "Failed to load profile data");
    }
  };

  const handleUpdatePhoneNumber = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No token found");
        return;
      }
  
      // Always send both phone numbers
      const payload = {
        phoneNumber: newPhoneNumber,
        phoneNumber2: newPhoneNumber2,
      };

      console.log(payload);
  
      await api.put("api/collection-officer/update-phone", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Update local state with the new values
      setProfileData((prevData) => ({
        ...prevData,
        phoneNumber: newPhoneNumber,
        phoneNumber2: newPhoneNumber2,
      }));
      setShowUpdateButton(false);
      Alert.alert("Success", "Phone numbers updated successfully");
    } catch (error) {
      console.error("Error updating phone numbers:", error);
      Alert.alert("Error", "Failed to update phone numbers");
    }
  };
  



  return (
    <View
      className="flex-1 bg-white"
      style={{ paddingHorizontal: wp(6), paddingVertical: hp(2) }}
    >
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => navigation.goBack()} className="">
          <AntDesign name="left" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-bold text-black">
          My Profile
        </Text>
      </View>

      <View className="items-center mb-6">
        <Image
          source={require("../assets/images/mprofile.png")}
          className="w-28 h-28 rounded-full"
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
        <View className="space-y-4">
          <View>
            <Text className="text-gray-500 mb-2">First Name</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={profileData.firstName}
              editable={false}
            />
          </View>
          <View>
            <Text className="text-gray-500 mb-2">Last Name</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={profileData.lastName}
              editable={false}
            />
          </View>
          <View>
            <Text className="text-gray-500 mb-2">Company Name</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={profileData.companyName}
              editable={false}
            />
          </View>
          <View>
            <Text className="text-gray-500 mb-2">Center Code</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={profileData.regcode}
              editable={false}
            />
          </View>
          <View>
            <Text className="text-gray-500 mb-2">Job Role</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={profileData.jobRole}
              editable={false}
            />
          </View>
          <View>
            <Text className="text-gray-500 mb-2">NIC Number</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={profileData.nicNumber}
              editable={false}
            />
          </View>
          <View>
            <Text className="text-gray-500 mb-2">Phone Number - 1</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={newPhoneNumber}
              placeholder="716615228"
              keyboardType="numeric"
              onChangeText={handlePhoneNumberChange}
            />
            {errorMessage && (
              <Text className="text-red-500">{errorMessage}</Text>
            )}
          </View>

          <View>
            <Text className="text-gray-500 mb-2">Phone Number - 2</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={newPhoneNumber2}
              placeholder="716615228"
              keyboardType="numeric"
              onChangeText={handlePhoneNumber2Change}
            />
            {errorMessage && (
              <Text className="text-red-500">{errorMessage}</Text>
            )}
          </View>
          <View>
            <Text className="text-gray-500 mb-2">House / Building No</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={profileData.houseNumber}
              editable={false}
            />
          </View>
          <View>
            <Text className="text-gray-500 mb-2">Street Name</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={profileData.streetName}
              editable={false}
            />
          </View>
          
          <View>
            <Text className="text-gray-500 mb-">City</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black mb-4"
              value={profileData.city}
              editable={false}
            />
          </View>
        
          
          {showUpdateButton && (
            <TouchableOpacity
              onPress={handleUpdatePhoneNumber}
              className="bg-[#2AAD7A] py-3 rounded-[30px] mb-4" 
            >
              <Text className="text-center text-white font-semibold">
                Update
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
