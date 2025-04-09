import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Modal,
  Image,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import DropDownPicker from "react-native-dropdown-picker";
import { RootStackParamList } from "../types";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import { environment } from "@/environment/environment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

type CollectionRequestFormProps = {
  navigation: StackNavigationProp<RootStackParamList, "CollectionRequestForm">;
  route: RouteProp<RootStackParamList, "CollectionRequestForm">;
};

interface Crop {
  id: number;
  cropNameEnglish: string;
}

interface CropVariety {
  id: number;
  varietyEnglish: string;
}

interface Farmer {
  id: number;
  firstName: string;
  phoneNumber: string;
  nicNumber: string;
  profileImage: string | null;
  farmerQr: string | null;
  membership: string;
  activeStatus: string;
  address: {
    buildingNo: string | null;
    streetName: string | null;
    city: string | null;
    district: string | null;
  };
  routeNumber: string | null;
  createdAt: string | null;
}

const CollectionRequestForm: React.FC<CollectionRequestFormProps> = ({
  navigation,
}) => {
  const route = useRoute();
  const { NICnumber } = route.params as { NICnumber: string };
  const { id } = route.params as { id: number };
  const [crop, setCrop] = useState<string | null>(null);
  const [variety, setVariety] = useState(null);
  const [loadIn, setLoadIn] = useState("");
  // const [scheduleDate, setScheduleDate] = useState("");
  const [geoLocation, setGeoLocation] = useState("");
  // const [buildingNo, setBuildingNo] = useState("");
  //const [streetName, setStreetName] = useState("");
  //const [city, setCity] = useState("");
  const { t } = useTranslation();
  const [openCrop, setOpenCrop] = useState(false);
  const [openVariety, setOpenVariety] = useState(false);
  //const [cropOptions, setCropOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cropNames, setCropNames] = useState<Crop[]>([]);
  const [cropOptions, setCropOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [varietyOptions, setVarietyOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [buildingNo, setBuildingNo] = useState("");
  const [streetName, setStreetName] = useState("");
  const [city, setCity] = useState("");
  const [routeNumber, setRouteNumber] = useState("");
  const [scheduleDate, setScheduleDate] = useState<string>("");
  const [showPicker, setShowPicker] = useState(false);
  const [cropsList, setCropsList] = useState<any[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
    const [showAddmore, setShowAddMore] = useState(false);
  
  console.log("gggg", NICnumber);
  console.log("kkkkkkk", id);

  useFocusEffect(
    React.useCallback(() => {
      const fetchCropNames = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          if (!token) {
            console.error("No authentication token found");
            return;
          }

          const headers = { Authorization: `Bearer ${token}` };
          const response = await axios.get<Crop[]>(
            `${environment.API_BASE_URL}api/unregisteredfarmercrop/get-crop-names`,
            { headers }
          );

          // Remove duplicates based on cropNameEnglish
          const uniqueCropNames = response.data.reduce<Crop[]>((acc, crop) => {
            if (
              !acc.some((item) => item.cropNameEnglish === crop.cropNameEnglish)
            ) {
              acc.push(crop);
            }
            return acc;
          }, []);

          setCropOptions(
            uniqueCropNames.map((crop) => ({
              label: crop.cropNameEnglish,
              value: crop.id.toString(),
            }))
          );

          console.log("Unique Crop Names:", uniqueCropNames);
        } catch (error) {
          console.error("Error fetching crop names:", error);
        }
      };

      fetchCropNames();
    }, [])
  );

  // Fetch Crop Varieties
  useEffect(() => {
    const fetchVarieties = async () => {
      if (!crop) return;

      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        const cropId = Number(crop);

        console.log("Fetching varieties for crop ID:", cropId);
        console.log("...", cropOptions);

        // Important: Verify the correct API endpoint for varieties
        const response = await axios.get<CropVariety[]>(
          `${environment.API_BASE_URL}api/unregisteredfarmercrop/crops/varieties/collection/${cropId}`,
          { headers }
        );

        console.log("Fetched Varieties:", response.data);

        setVarietyOptions(
          response.data.map((variety) => ({
            label: variety.varietyEnglish,
            value: variety.id.toString(),
          }))
        );
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error fetching crop varieties:",
            error.response?.data || error.message
          );
        } else {
          console.error("Unexpected error fetching crop varieties:", error);
        }
      }
    };

    fetchVarieties();
  }, [crop]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("No token found!");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(
          `${environment.API_BASE_URL}api/unregisteredfarmercrop/all-farmer`,
          {
            headers,
            params: { nicNumber: NICnumber }, // Passing NICnumber as a query parameter
          }
        );
        console.log(response.data);

        const farmers: Farmer[] = response.data;

        // Assuming farmers data is valid and has the required fields
        if (farmers.length > 0) {
          const farmer = farmers[0];
          setBuildingNo(farmer.address.buildingNo || "");
          setStreetName(farmer.address.streetName || "");
          setCity(farmer.address.city || "");
          setRouteNumber(farmer.routeNumber || "");

          console.log("buildingNo:", farmer.address.buildingNo);
          console.log("streetName:", farmer.address.streetName);
          console.log("city:", farmer.address.city);
          console.log("routeNumber:", farmer.routeNumber);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error:", error.message);
        }
      }
    };

    fetchUsers();
  }, [NICnumber]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false); // Hide picker after selection
    if (selectedDate) {
      setScheduleDate(selectedDate.toISOString().split("T")[0]); // Format date as YYYY-MM-DD
    }
  };

  const handleAddMore = async () => {
    setShowAddMore(false);
  };

  const handleAddtoList  = () => {
    
    if (!crop || !variety || !loadIn) {
      Alert.alert("Error", "Please fill all fields before adding.");
      return;
    }

    const cropName = cropOptions.find((item) => item.value === crop)?.label || "";
    const varietyName = varietyOptions.find((item) => item.value === variety)?.label || "";
    
    const newCrop = { crop, variety, cropName, varietyName, loadIn };

    // Use functional update to ensure correct state updates
    setCropsList((prevList) => {
      const updatedList = [...prevList, newCrop];
      return updatedList;
    });
    console.log(",,", newCrop);

    // Clear input fields after adding
    setCrop("");
    setVariety(null);
    setLoadIn("");
    setShowAddMore(true);
    // navigation.navigate("ReviewCollectionRequests", {
    //   cropsList: [...cropsList, newCrop], // Include the newly added crop
    //   address: { buildingNo, streetName, city, routeNumber },
    //   scheduleDate,
    //   farmerId: id,
    // });
  };
  const handleSubmit = async () => {
    console.log("Submitting collection request...");
    console.log("Crops List:", cropsList);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        Alert.alert("Error", "Authentication required. Please log in.");
        return;
      }

      if (
        !routeNumber ||
        !buildingNo ||
        !streetName ||
        !city ||
        cropsList.length === 0 ||
        !scheduleDate
      ) {
        Alert.alert(
          "Error",
          "Please fill all fields, add crops, and select a schedule date."
        );
        return;
      }

      const farmerId = id; // Ensure `id` is properly set

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // 1. Update user address details
      const updateUserResponse = await axios.put(
        `${environment.API_BASE_URL}api/unregisteredfarmercrop/user/update/${farmerId}`,
        { routeNumber, buildingNo, streetName, city },
        { headers }
      );

      if (updateUserResponse.status !== 200) {
        Alert.alert("Error", "Failed to update user details");
        return;
      }

      // 2. Submit multiple collection requests with a single schedule date
      const collectionRequestData = cropsList.map((crop) => ({
        farmerId,
        crop: crop.crop,
        variety: crop.variety,
        loadIn: crop.loadIn,
        scheduleDate: scheduleDate, // Use the single schedule date for all crops
      }));

      console.log("Submission Data:", collectionRequestData);

      const collectionRequestResponse = await axios.post(
        `${environment.API_BASE_URL}api/unregisteredfarmercrop/submit-collection-request`,
        { requests: collectionRequestData }, // Send as an array
        { headers }
      );

      if (collectionRequestResponse.status === 200) {
        // Clear the form after successful submission
        Alert.alert("Success", "Collection Requests Submitted!");
        setCropsList([]); // Clear the crops list
        setRouteNumber("");
        setBuildingNo("");
        setStreetName("");
        setCity("");
        setScheduleDate("");
      } else {
        Alert.alert("Error", "Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      Alert.alert(
        "Error",
        "Failed to submit the request. Please check your connection."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white px-6 pt-8"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="">
            <AntDesign name="left" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-xl font-bold text-black">
            Collection Request Form
          </Text>
        </View>

        <View className="px-2 py-1">
          {/* Crop Dropdown */}

          {/* Address Input */}
          <Text className="text-gray-700 mb-2">Building / House No</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            value={buildingNo}
            onChangeText={setBuildingNo}
            placeholder=" "
          />
          {/* Address Input */}
          <Text className="text-gray-700 mb-2">Street Name</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            value={streetName}
            onChangeText={setStreetName}
            placeholder=" "
          />
          {/* Address Input */}
          <Text className="text-gray-700 mb-2">City</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            value={city}
            onChangeText={setCity}
            placeholder=" "
          />

          {/* Root Number Input */}
          <Text className="text-gray-700 mb-2">Route Number</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 mb-6"
            value={routeNumber}
            onChangeText={setRouteNumber}
            keyboardType="numeric"
            placeholder=" "
          />

          <Text className="text-gray-700 mb-2">Schedule Date</Text>
          <View className="border border-gray-300 rounded-lg px-4 mb-6 flex-row items-center">
            <TextInput
              className="flex-1 text-gray-700"
              value={scheduleDate}
              placeholder="Select Schedule Date"
              editable={false} // Prevent manual input
            />
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <Image
                source={require("../../assets/images/Rescheduling.webp")}
                className="h-[24px] w-[24px] ml-2"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {showPicker && (
            <DateTimePicker
              value={scheduleDate ? new Date(scheduleDate) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <View className="h-0.5 bg-[#D2D2D2] mb-4" />

          <View className="mb-4">
            <Text className="text-gray-700 mb-2">Added Requests</Text>
            {cropsList.map((item, index) => (
              <View
                key={index}
                className="flex-row justify-between p-2 rounded-lg mb-1 border border-[#CFCFCF]"
              >
                <Text>
                  {cropOptions.find((crop) => crop.value === item.crop)
                    ?.label || "Unknown Crop"}
                </Text>
                <View className="h-[20px] border-l border-gray-400 mx-2" />{" "}
                {/* Vertical Line */}
                <Text>
                  {varietyOptions.find(
                    (variety) => variety.value === item.variety
                  )?.label || "Unknown Variety"}
                </Text>
              </View>
            ))}
          </View>
{showAddmore ? (
        
                   <View>
                   <TouchableOpacity
                     onPress={handleAddMore}
                     className="bg-[#2AAD7A] mt-6 py-3 rounded-full"
                   >
                     <Text className="text-white text-center text-lg font-bold">Add more</Text>
                   </TouchableOpacity>
       
                   <TouchableOpacity onPress={handleSubmit} className="mt-4 py-3 rounded-full border border-black">
                     <Text className="text-black text-center text-lg font-bold">Submit</Text>
                   </TouchableOpacity>
                 </View>
        ) : (
          <View className="mb-8">
          <Text className="text-gray-700 mb-2">Crop</Text>
          <DropDownPicker
            open={openCrop}
            value={crop}
            items={cropOptions}
            setOpen={setOpenCrop}
            setValue={setCrop}
            placeholder="--Select Crop--"
            dropDownContainerStyle={{
              borderColor: "#CFCFCF",
              borderWidth: 1,
              backgroundColor: "#FFFFFF",
              maxHeight: 200,
              minHeight: 150,
            }}
            style={{ borderColor: "#CFCFCF", borderWidth: 1, marginBottom: 4 }}
            textStyle={{ fontSize: 14 }}
            zIndex={80000}
            listMode="SCROLLVIEW"
            loading={loading}
          />

          <Text className="text-gray-700 mb-2">Variety</Text>
          <DropDownPicker
            open={openVariety}
            value={variety}
            items={varietyOptions}
            setOpen={setOpenVariety}
            setValue={setVariety}
            placeholder="--Select Variety--"
            style={{
              borderColor: "#CFCFCF",
              borderWidth: 1,
              marginBottom: 4,
            }}
          />

          <Text className="text-gray-700 mb-2 mt-2">Load in kg (Approx)</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
            value={loadIn}
            onChangeText={setLoadIn}
            keyboardType="numeric"
            placeholder=" "
          />

          <TouchableOpacity
            onPress={handleAddtoList}
            className="bg-[#2AAD7A] mt-6 py-3 rounded-full"
          >
            <Text className="text-white text-center text-lg font-bold">Add to the List</Text>
          </TouchableOpacity>
        </View>
        )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CollectionRequestForm;
