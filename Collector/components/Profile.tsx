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
    address: "",
    phoneNumber: "",
  });
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePhoneNumberChange = (text: string) => {
    setNewPhoneNumber(text);

    if (text.length > 11) {
      setErrorMessage("Phone number cannot exceed 11 digits.");
      setShowUpdateButton(false);
    } else {
      setErrorMessage("");
      setShowUpdateButton(
        text.length > 0 && text !== profileData.phoneNumber
      );
    }
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
        address: `${data.houseNumber}, ${data.streetName}, ${data.city}, ${data.district}, ${data.province}`,
        phoneNumber: data.phoneNumber01,
      });
      setNewPhoneNumber(data.phoneNumber01);
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

      await api.put(
        "api/collection-officer/update-phone",
        { phoneNumber: newPhoneNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfileData((prevData) => ({
        ...prevData,
        phoneNumber: newPhoneNumber,
      }));
      setShowUpdateButton(false);
      Alert.alert("Success", "Phone number updated successfully");
    } catch (error) {
      console.error("Error updating phone number:", error);
      Alert.alert("Error", "Failed to update phone number");
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
          source={require("../assets/images/profile.png")}
          className="w-28 h-28 rounded-full"
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
        <View className="space-y-4">
          <View>
            <Text className="text-gray-500">First Name</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={profileData.firstName}
              editable={false}
            />
          </View>
          <View>
            <Text className="text-gray-500">Last Name</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={profileData.lastName}
              editable={false}
            />
          </View>
          <View>
            <Text className="text-gray-500">Company Name</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={profileData.companyName}
              editable={false}
            />
          </View>
          <View>
            <Text className="text-gray-500">Branch Code</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={profileData.regcode}
              editable={false}
            />
          </View>
          <View>
            <Text className="text-gray-500">Job Role</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={profileData.jobRole}
              editable={false}
            />
          </View>
          <View>
            <Text className="text-gray-500">NIC Number</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={profileData.nicNumber}
              editable={false}
            />
          </View>
          <View>
            <Text className="text-gray-500">Phone Number</Text>
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
            <Text className="text-gray-500">Address</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black"
              value={profileData.address}
              editable={false}
            />
          </View>
          {showUpdateButton && (
            <TouchableOpacity
              onPress={handleUpdatePhoneNumber}
              className="bg-[#2AAD7A] py-2 rounded-[30px] mt-4"
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
