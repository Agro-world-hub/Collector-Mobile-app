import React, { useState } from "react";
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
import { RouteProp } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import DropDownPicker from "react-native-dropdown-picker";
import { RootStackParamList } from "../types";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";

type CollectionRequestFormProps = {
  navigation: StackNavigationProp<RootStackParamList, "CollectionRequestForm">;
  route: RouteProp<RootStackParamList, "CollectionRequestForm">;
};

const CollectionRequestForm: React.FC<CollectionRequestFormProps> = ({ navigation }) => {
  const [crop, setCrop] = useState(null);
  const [variety, setVariety] = useState(null);
  const [load, setLoad] = useState("");
  const [address, setAddress] = useState("");
  const [rootNumber, setRootNumber] = useState("");
  const { t } = useTranslation();
  const [openCrop, setOpenCrop] = useState(false);
  const [openVariety, setOpenVariety] = useState(false);
  
 
  

  const cropOptions = [
    { label: "Wheat", value: "wheat" },
    { label: "Rice", value: "rice" },
    { label: "Corn", value: "corn" }
  ];

  const varietyOptions = [
    { label: "Type A", value: "typeA" },
    { label: "Type B", value: "typeB" }
  ];

  const handleSubmit = () => {
    if (!crop || !variety || !load || !address || !rootNumber) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    Alert.alert("Success", "Collection Request Submitted!");
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
  style={{
    borderColor: '#CFCFCF',  // Set the border color
    borderWidth: 1,          // Optional: Add border width to ensure visibility
    marginBottom:4,
  //  backgroundColor:'white'
  }}

/>


      {/* Variety Dropdown */}
      <Text className="text-gray-700 mb-2 mt-2">Variety</Text>
      <DropDownPicker
        open={openVariety}
        value={variety}
        items={varietyOptions}
        setOpen={setOpenVariety}
        setValue={setVariety}
        placeholder="--Select Variety--"
      //  className="mb-4"
      style={{
        borderColor: '#CFCFCF',  // Set the border color
        borderWidth: 1,          // Optional: Add border width to ensure visibility
        marginBottom:4
      }}
      />

      {/* Load Input */}
      <Text className="text-gray-700 mb-2 mt-2">Load in kg (Approx)</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
        value={load}
        onChangeText={setLoad}
        keyboardType="numeric"
        placeholder=" "
      />

      {/* Address Input */}
      <Text className="text-gray-700 mb-2">Geo Location</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
        value={address}
        onChangeText={setAddress}
        placeholder=" "
      />
      {/* Address Input */}
      <Text className="text-gray-700 mb-2">Building / House No</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
        value={address}
        onChangeText={setAddress}
        placeholder=" "
      />
      {/* Address Input */}
      <Text className="text-gray-700 mb-2">Street Name</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
        value={address}
        onChangeText={setAddress}
        placeholder=" "
      />
       {/* Address Input */}
       <Text className="text-gray-700 mb-2">Street Name</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
        value={address}
        onChangeText={setAddress}
        placeholder=" "
      />

      {/* Root Number Input */}
      <Text className="text-gray-700 mb-2">City</Text>
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-2 mb-6"
        value={rootNumber}
        onChangeText={setRootNumber}
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
