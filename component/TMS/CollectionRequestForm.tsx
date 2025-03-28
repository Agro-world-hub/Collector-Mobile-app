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
  Image
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import DropDownPicker from "react-native-dropdown-picker";
import { RootStackParamList } from "../types";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import {environment }from '@/environment/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const CollectionRequestForm: React.FC<CollectionRequestFormProps> = ({ navigation }) => {
  const route = useRoute();
  const { NICnumber } = route.params as { NICnumber: string };
  const {id } = route.params as { id: number} ;
  const [crop, setCrop] = useState<string | null>(null);
  const [variety, setVariety] = useState(null);
  const [loadIn, setLoadIn] = useState("");

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
 const [cropOptions, setCropOptions] = useState<{ label: string; value: string }[]>([]);
 const [varietyOptions, setVarietyOptions] = useState<{ label: string; value: string }[]>([]);
 const [buildingNo, setBuildingNo] = useState('');
const [streetName, setStreetName] = useState('');
const [city, setCity] = useState('');
const [routeNumber, setRouteNumber] = useState('');

// const [variety, setVariety] = useState<string | null>(null);
//const [varietyOptions, setVarietyOptions] = useState<{ label: string; value: number }[]>([]);
 
  

console.log("gggg",NICnumber)
console.log("kkkkkkk", id)


  useFocusEffect(
    React.useCallback(() => {
      const fetchCropNames = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          if (!token) {
            console.error('No authentication token found');
            return;
          }

          const headers = { 'Authorization': `Bearer ${token}` };
          const response = await axios.get<Crop[]>(
            `${environment.API_BASE_URL}api/unregisteredfarmercrop/get-crop-names`, 
            { headers }
          );

          const uniqueCropNames = response.data.reduce<Crop[]>((acc, crop) => {
            if (!acc.some((item) => item.cropNameEnglish === crop.cropNameEnglish)) {
              acc.push(crop);
            }
            return acc;
          }, []);

          setCropNames(uniqueCropNames);
          setCropOptions(uniqueCropNames.map(crop => ({
            label: crop.cropNameEnglish,
            value: crop.id.toString(),
          })));

          console.log("Unique Crop Names:", uniqueCropNames);
        } catch (error) {
          console.error('Error fetching crop names:', error);
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
          console.error('No authentication token found');
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        const cropId = Number(crop);
        
        console.log("Fetching varieties for crop ID:", cropId);

        // Important: Verify the correct API endpoint for varieties
        const response = await axios.get<CropVariety[]>(
          `${environment.API_BASE_URL}api/unregisteredfarmercrop/crops/varieties/collection/${cropId}`, 
          { headers }
        );

        console.log("Fetched Varieties:", response.data);

        setVarietyOptions(response.data.map((variety) => ({
          label: variety.varietyEnglish,
          value: variety.id.toString(),
        })));
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching crop varieties:", error.response?.data || error.message);
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
            params: { nicNumber: NICnumber } // Passing NICnumber as a query parameter
          }
        );
        console.log(response.data);

        const farmers: Farmer[] = response.data;

        // Assuming farmers data is valid and has the required fields
        if (farmers.length > 0) {
          const farmer = farmers[0];
          setBuildingNo(farmer.address.buildingNo || '');
          setStreetName(farmer.address.streetName || '');
          setCity(farmer.address.city || '');
          setRouteNumber(farmer.routeNumber || '');
          
          console.log("buildingNo:", farmer.address.buildingNo);
          console.log("streetName:", farmer.address.streetName);
          console.log("city:", farmer.address.city);
          console.log("routeNumber:", farmer.routeNumber);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error:', error.message);
        }
      }
    };

    fetchUsers();
  }, [NICnumber]);

  
  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error('No authentication token found');
        Alert.alert("Error", "Authentication required. Please log in.");
        return;
      }
  
      if (!crop || !variety || !loadIn || !routeNumber || !buildingNo || !streetName || !city) {
        Alert.alert("Error", "Please fill all fields");
        return;
      }
  
      const requestData = {
        crop,
        variety,
        loadIn,
        routeNumber,
        buildingNo,
        streetName,
        city,
      };
  
      // Get the user ID from the decoded token (ensure the token is decoded)
      const farmerId = id; // Make sure 'id' is defined somewhere (either decoded from token or set earlier)
  
      // Set up headers including Authorization token
      const headers = { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };
  
      // 1. Update user address details (route number, building number, street name, city)
      const updateUserResponse = await axios.put(
        `${environment.API_BASE_URL}api/unregisteredfarmercrop/user/update/${farmerId}`,
        {
          routeNumber,
          buildingNo,
          streetName,
          city,
        },
        { headers }
      );
  
      if (updateUserResponse.status !== 200) {
        Alert.alert("Error", "Failed to update user details");
        return;
      }
  
      // 2. Now submit the collection request
      const collectionRequestData = {
        farmerId,
        crop,
        variety,
        loadIn,
      };
  
      const collectionRequestResponse = await axios.post(
        `${environment.API_BASE_URL}api/unregisteredfarmercrop/submit-collection-request`,
        collectionRequestData,
        { headers }
      );
  
      if (collectionRequestResponse.status === 200) {
        Alert.alert("Success", "Collection Request Submitted!");
      } else {
        Alert.alert("Error", "Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      Alert.alert("Error", "Failed to submit the request. Please check your connection.");
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
      <Text className="text-gray-700 mb-2">Crop</Text>
    

<DropDownPicker
  open={openCrop}
  value={crop}
  items={cropOptions}
  setOpen={setOpenCrop}
  setValue={setCrop}
  placeholder="--Select Crop--"
  dropDownContainerStyle={{ borderColor: "#CFCFCF", borderWidth: 1, backgroundColor: "#FFFFFF", maxHeight: 200, minHeight: 150 }}
  style={{ borderColor: '#CFCFCF', borderWidth: 1, marginBottom: 4 }}
  textStyle={{ fontSize: 14 }}
  zIndex={80000}
  listMode="SCROLLVIEW"
  loading={loading} // You can toggle this based on the fetch status
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



      {/* Load Input */}
      <Text className="text-gray-700 mb-2 mt-2">Load in kg (Approx)</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
        value={loadIn}
        onChangeText={setLoadIn}
        keyboardType="numeric"
        placeholder=" "
      />

 
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

      {/* Submit Button */}
      <TouchableOpacity
        className="bg-[#2AAD7A] rounded-full py-3 mb-8"
        onPress={handleSubmit}
      >
        <Text className="text-white text-center font-bold text-lg">
          Submit
        </Text>
      </TouchableOpacity>

      </View>

      </ScrollView>
          
    </KeyboardAvoidingView>
  );
};

export default CollectionRequestForm;
