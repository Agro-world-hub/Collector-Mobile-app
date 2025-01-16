import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SelectList } from "react-native-dropdown-select-list"; // Install react-native-dropdown-select-list for dropdowns
import { RootStackParamList } from "../types";

type SetTargetScreenNavigationProps = StackNavigationProp<RootStackParamList, 'SetTargetScreen'>;

interface SetTargetScreenProps {
  navigation: SetTargetScreenNavigationProps;
}


const SetTargetScreen: React.FC<SetTargetScreenProps> = ({ navigation }) => {
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedVariety, setSelectedVariety] = useState("");
  const [weights, setWeights] = useState({
    gradeA: "0.00",
    gradeB: "0.00",
    gradeC: "0.00",
  });

  const cropOptions = [
    { key: "1", value: "Wheat" },
    { key: "2", value: "Rice" },
  ];

  const varietyOptions = [
    { key: "1", value: "Basmati" },
    { key: "2", value: "Non-Basmati" },
  ];

  const handleWeightChange = (grade: string, value: string) => {
    setWeights((prev) => ({ ...prev, [grade]: value }));
  };

  return (
    <View className="flex-1 bg-white px-6 py-8">
      {/* Header */}
      <View className="flex-row justify-center items-center">
        <Text className="text-xl font-bold text-center text-black">Set Target</Text>
      </View>

      {/* Select Crop */}
      <View className="mt-8">
        <Text className="text-sm text-gray-600">--Select Crop--</Text>
        <SelectList
          setSelected={setSelectedCrop}
          data={cropOptions}
          save="value"
          placeholder="--Select Crop--"
          boxStyles={{ borderColor: "#D1D5DB", borderWidth: 1, borderRadius: 8 }}
        />
      </View>

      {/* Select Variety */}
      <View className="mt-4">
        <Text className="text-sm text-gray-600">--Select Variety--</Text>
        <SelectList
          setSelected={setSelectedVariety}
          data={varietyOptions}
          save="value"
          placeholder="--Select Variety--"
          boxStyles={{ borderColor: "#D1D5DB", borderWidth: 1, borderRadius: 8 }}
        />
      </View>

      {/* Weight Section */}
      <View className="mt-8">
        <Text className="text-base font-bold text-gray-700">Weight according to Grades</Text>

        {/* Grade A */}
        <View className="flex-row justify-between items-center mt-4 border rounded-lg px-4 py-2">
          <Text className="text-base font-medium text-gray-700">Grade A</Text>
          <TextInput
            value={weights.gradeA}
            onChangeText={(value) => handleWeightChange("gradeA", value)}
            keyboardType="decimal-pad"
            placeholder="0.00"
            className="flex-1 ml-4 text-right text-gray-700"
          />
        </View>

        {/* Grade B */}
        <View className="flex-row justify-between items-center mt-4 border rounded-lg px-4 py-2">
          <Text className="text-base font-medium text-gray-700">Grade B</Text>
          <TextInput
            value={weights.gradeB}
            onChangeText={(value) => handleWeightChange("gradeB", value)}
            keyboardType="decimal-pad"
            placeholder="0.00"
            className="flex-1 ml-4 text-right text-gray-700"
          />
        </View>

        {/* Grade C */}
        <View className="flex-row justify-between items-center mt-4 border rounded-lg px-4 py-2">
          <Text className="text-base font-medium text-gray-700">Grade C</Text>
          <TextInput
            value={weights.gradeC}
            onChangeText={(value) => handleWeightChange("gradeC", value)}
            keyboardType="decimal-pad"
            placeholder="0.00"
            className="flex-1 ml-4 text-right text-gray-700"
          />
        </View>
      </View>

      {/* Buttons */}
      <View className="mt-8">
        <TouchableOpacity className="border border-gray-500 rounded-lg px-4 py-2 mb-4">
          <Text className="text-center text-gray-700 font-medium">Add More</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-green-500 rounded-lg px-4 py-2">
          <Text className="text-center text-white font-medium">Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SetTargetScreen;
