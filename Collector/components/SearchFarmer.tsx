import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Keyboard
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import environment from "../environment/environment";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useFocusEffect } from "expo-router";

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type SearchFarmerNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SearchFarmer"
>;

interface SearchFarmerProps {
  navigation: SearchFarmerNavigationProp;
}

const SearchFarmer: React.FC<SearchFarmerProps> = ({ navigation }) => {
  const [NICnumber, setNICnumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [farmers, setFarmers] = useState<
    {
      NICnumber: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      userId: string;
    }[]
  >([]);
  const [ere, setEre] = useState("");

  const validateNic = (nic: string) => {
    const regex = /^(\d{12}|\d{9}V|\d{9}X|\d{9}v|\d{9}x)$/;
    if (!regex.test(nic)) {
      setEre("Enteravalidenic");
    } else {
      setEre("");
    }
  };

  const handleNicChange = (text: string) => {
    const normalizedText = text.replace(/[vV]/g, "V");
    setNICnumber(normalizedText);
    validateNic(normalizedText);
  };

  const handleSearch = async () => {
    Keyboard.dismiss();
    if (NICnumber.trim().length === 0) return;

    setIsSearching(true);
    setNoResults(false);

    try {
      const response = await api.get(`api/auth/get-users/${NICnumber}`);

      if (response.status === 200) {
        const farmer = response.data;
        navigation.navigate("FarmerQr" as any, {
          NICnumber: farmer.NICnumber,
          userId: farmer.id,
        });
      }
    } catch (error) {
      setIsSearching(false);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setNoResults(true);
        } else {
          Alert.alert(
            "Error",
            error.response?.data?.error || "Failed to search for farmer."
          );
        }
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }
  };


  useFocusEffect(
    useCallback(() => {
      setNICnumber("");
      setNoResults(false);
    }, [])
  );

  const DismisKeyboard = () => {
    Keyboard.dismiss();
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View
        className="flex-1 bg-white"
        style={{ paddingHorizontal: wp(6), paddingVertical: hp(2) }}
      >
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="">
            <AntDesign name="left" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-xl font-bold text-black">
            Search
          </Text>
        </View>

        {/* Search Form */}
        <View className="p-4">
          <Text className="text-center text-lg  mt-5">
            Enter Farmer's NIC number
          </Text>

          <View className="flex-row justify-center items-center border rounded-full mt-4 px-4 py-2 bg-gray-100">
            <TextInput
              value={NICnumber}
              onChangeText={handleNicChange}
              placeholder="Enter NIC number"
              className="flex-1 text-center"
              maxLength={12}
            />
            <TouchableOpacity className="ml-2" onPress={handleSearch}>
              <FontAwesome name="search" size={24} color="green" />
            </TouchableOpacity>
          </View>
          {ere ? (
            <Text className="text-red-500 mt-2 justify-center text-center">
              {ere}
            </Text>
          ) : null}

          {/* Display search image when no NIC is entered */}
          {!isSearching && NICnumber.length === 0 && (
            <View className="mt-10 items-center">
              <Image
                source={require("../assets/images/search.png")}
                className="h-[400px] w-[350px] rounded-lg"
                resizeMode="contain"
              />
            </View>
          )}

          {/* Searching status */}
          {isSearching && (
            <View className="mt-10 items-center">
              <Text className="text-center text-lg">Searching...</Text>
            </View>
          )}

          {/* No Results Found */}
          {!isSearching && noResults && NICnumber.length > 0 && (
            <View className="mt-6 items-center">
              <Image
                source={require("../assets/images/notfound.png")}
                className="h-[200px] w-[200px] rounded-lg"
                resizeMode="contain"
              />
              <Text className="text-center text-lg mt-4">
                No registered farmer found
              </Text>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("UnregisteredFarmerDetails" as any, {
                    NIC: NICnumber,
                  })
                }
                className="mt-16 bg-[#2AAD7A]  rounded-full px-16 py-3  "
              >
                <Text className="text-white text-lg">Register Farmer</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default SearchFarmer;
