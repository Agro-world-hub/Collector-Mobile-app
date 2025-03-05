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
import * as ImagePicker from 'expo-image-picker';
import environment from "../environment/environment";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import * as ImageManipulator from 'expo-image-manipulator';
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
    city: "",
    province: "",
    district:"",
    profileImage: "",
  });
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newPhoneNumber2, setNewPhoneNumber2] = useState("");

  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState({ uri: "" });


  const handlePhoneNumberChange = (text: string) => {
    setNewPhoneNumber(text);

    if (text.length > 9) {
      setErrorMessage("Phone number cannot exceed 9 digits.");
    } else {
      setErrorMessage("");
    }
    toggleUpdateButton(text, newPhoneNumber2);
  };

  const handlePhoneNumber2Change = (text: string) => {
    setNewPhoneNumber2(text);

    if (text.length > 9) {
      setErrorMessage("Phone number cannot exceed 9 digits.");
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
        phoneNumber2: data.phoneNumber02,
        province:data.province,
        district:data.district,
        profileImage: data.image,
      });
      setProfileImage({ uri: data.image });
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
  
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Please allow access to your photo library to upload a profile picture."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      let imageUri = result.assets[0].uri;

      const resizedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 500 } }], 
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );
      console.log("Resized and compressed image:", resizedImage);
      setProfileImage({ uri: resizedImage.uri });
      await uploadImage(resizedImage.uri);  
    }
  };

  const uploadImage = async (imageUri: string) => {
    console.log("Uploading image...");
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert(("Main.error"), ("Main.somethingWentWrong"));
        return;
      }
      const formData = new FormData();
      if (imageUri) {
        const fileName = imageUri.split("/").pop();
        const fileType = fileName?.split(".").pop()
          ? `image/${fileName.split(".").pop()}`
          : "image/jpeg";

        formData.append("profileImage", {
          uri: imageUri,
          name: fileName,
          type: fileType,
        } as any);
      }
      console.log(formData);
      const response = await fetch(
        `${environment.API_BASE_URL}api/collection-officer/upload-profile-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.status === "success") {
      } else {
        Alert.alert(("Sorry"), ("Something went wrong"));
      }
    } catch (error) {
      Alert.alert(("Sorry"), ("Something went wrong"));
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
          source={require("../assets/images/mprofile.webp")}
          className="w-28 h-28 rounded-full"
        /> */}
      
                      <View className="items-center mb-6 relative">
                <Image
                  source={
                    profileImage
                      ? profileImage
                      : require("../assets/images/pcprofile 1.webp")
                  }
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                />
                <TouchableOpacity
                  className="absolute right-0 bottom-0 p-1 bg-white  rounded-full"
                  onPress={pickImage}
                >
                  <Image
                    source={require("../assets/images/Pencil.webp")}
                    style={{ width: 17, height: 17, tintColor: "green" }}
                  />
                </TouchableOpacity>
              </View>
          
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
              placeholder="7XXXXXXXX"
              keyboardType="numeric"
              onChangeText={handlePhoneNumberChange}
              maxLength={9}
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
              placeholder="7XXXXXXXX"
              keyboardType="numeric"
              onChangeText={handlePhoneNumber2Change}
              maxLength={9}
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
            <Text className="text-gray-500 ">City</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black mb-2"
              value={profileData.city}
              editable={false}
            />
          </View>

          <View>
            <Text className="text-gray-500 ">District</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black mb-2"
              value={profileData.district}
              editable={false}
            />
          </View>

          <View>
            <Text className="text-gray-500 mb-">Province</Text>
            <TextInput
              className="px-4 py-2 rounded-[35px] border border-gray-300 text-black mb-2"
              value={profileData.province}
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
