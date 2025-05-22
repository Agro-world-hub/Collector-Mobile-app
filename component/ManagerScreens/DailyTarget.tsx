import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { CircularProgress } from "react-native-circular-progress";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import AntDesign from "react-native-vector-icons/AntDesign";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { environment } from "@/environment/environment";
import LottieView from "lottie-react-native";
import { useTranslation } from "react-i18next";

type DailyTargetNavigationProps = StackNavigationProp<
  RootStackParamList,
  "DailyTarget"
>;

interface DailyTargetProps {
  navigation: DailyTargetNavigationProps;
}

interface TargetData {
  dailyTarget: any;
  officerTarget: number;
  complete: number;
  varietyId: number;
  centerTarget: any;
  varietyNameEnglish: string;
  grade: string;
  target: number;
  todo: number;
  qty: number;
  varietyNameSinhala: string;
  varietyNameTamil: string;
}

const DailyTarget: React.FC<DailyTargetProps> = ({ navigation }) => {
  const [todoData, setTodoData] = useState<TargetData[]>([]);
  const [completedData, setCompletedData] = useState<TargetData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedToggle, setSelectedToggle] = useState("ToDo"); // Track selected toggle
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const fetchSelectedLanguage = async () => {
    try {
      const lang = await AsyncStorage.getItem("@user_language"); // Get stored language
      setSelectedLanguage(lang || "en"); // Default to English if not set
    } catch (error) {
      console.error("Error fetching language preference:", error);
    }
  };

  const getGradePriority = (grade: string): number => {
    switch (grade) {
      case "A":
        return 1;
      case "B":
        return 2;
      case "C":
        return 3;
      default:
        return 4; // Any other grades come after A, B, C
    }
  };

  // Sort function that first sorts by variety name, then by grade (A, B, C)
  const sortByVarietyAndGrade = (data: TargetData[]) => {
    return [...data].sort((a, b) => {
      // First sort by variety name
      const nameA = getVarietyNameForSort(a);
      const nameB = getVarietyNameForSort(b);

      const nameComparison = nameA.localeCompare(nameB);

      // If variety names are the same, sort by grade (A, B, C)
      if (nameComparison === 0) {
        return getGradePriority(a.grade) - getGradePriority(b.grade);
      }

      return nameComparison;
    });
  };

  // Helper function to get the variety name based on selected language
  const getVarietyNameForSort = (item: TargetData) => {
    switch (selectedLanguage) {
      case "si":
        return item.varietyNameSinhala || "";
      case "ta":
        return item.varietyNameTamil || "";
      default:
        return item.varietyNameEnglish || "";
    }
  };

  useEffect(() => {
    const fetchTargets = async () => {
      setLoading(true);
      const startTime = Date.now(); // Capture the start time for the spinner
      try {
        const authToken = await AsyncStorage.getItem("token");
        const response = await axios.get(
          `${environment.API_BASE_URL}api/target/officer`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        const allData = response.data.data;
        console.log("--------all data----------", allData);
        const todoItems = allData.filter((item: TargetData) => item.todo > 0);
        const completedItems = allData.filter(
          (item: TargetData) => item.complete >= item.officerTarget
        );

        // Sort the data by variety name and then by grade
        // Sort the data by variety name and then by grade
        setTodoData(sortByVarietyAndGrade(todoItems));
        setCompletedData(sortByVarietyAndGrade(completedItems));
        setError(null);
      } catch (err) {
        setError(t("Error.Failed to fetch data."));
      } finally {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = 3000 - elapsedTime; // Ensure at least 3 seconds loading time
        setTimeout(
          () => setLoading(false),
          remainingTime > 0 ? remainingTime : 0
        );
      }
    };

    fetchTargets();
  }, [selectedLanguage]); // Re-fetch when language changes

  // Refreshing function
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const fetchTargets = async () => {
      try {
        const authToken = await AsyncStorage.getItem("token");
        const response = await axios.get(
          `${environment.API_BASE_URL}api/target/officer`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log(response.data);

        const allData = response.data.data;
        const todoItems = allData.filter((item: TargetData) => item.todo > 0); // Move tasks with todo > 0 to ToDo
        // const completedItems = allData.filter((item: TargetData) => item.todo === 0); // Tasks with todo === 0 go to Completed
        const completedItems = allData.filter(
          (item: TargetData) => item.complete >= item.officerTarget
        );
        console.log("completedItems", completedItems);
        console.log("todoItems", todoItems);

        setTodoData(sortByVarietyAndGrade(todoItems));
        setCompletedData(sortByVarietyAndGrade(completedItems));
        setRefreshing(false); // Stop refreshing once data is loaded
      } catch (err) {
        setError(t("Error.Failed to fetch data."));
        setRefreshing(false); // Stop refreshing on error
      }
    };
    fetchTargets();
  }, []);

  const displayedData = selectedToggle === "ToDo" ? todoData : completedData;
  console.log("--------displayedData----------", displayedData);

  useEffect(() => {
    const fetchData = async () => {
      await fetchSelectedLanguage();
    };
    fetchData();
  }, []);

  const getvarietyName = (TargetData: TargetData) => {
    switch (selectedLanguage) {
      case "si":
        return TargetData.varietyNameSinhala;
      case "ta":
        return TargetData.varietyNameTamil;
      default:
        return TargetData.varietyNameEnglish;
    }
  };

  return (
    <View className="flex-1 bg-[#282828] w-full">
      {/* Header */}
      <View className="bg-[#282828] px-4 py-3 flex-row justify-between items-center">
        <Text className="text-white text-lg font-bold ml-[35%]">
          {t("DailyTarget.MyTarget")}
        </Text>
      </View>

      {/* Toggle Buttons */}
      <View className="flex-row justify-center items-center py-4 bg-[#282828]">
        {/* To Do Button */}
        <TouchableOpacity
          className={`px-4 py-2 rounded-full mx-2 flex-row items-center justify-center ${
            selectedToggle === "ToDo" ? "bg-[#2AAD7A]" : "bg-white"
          }`}
          onPress={() => setSelectedToggle("ToDo")}
        >
          <Text
            className={`font-bold mr-2 ${
              selectedToggle === "ToDo" ? "text-white" : "text-black"
            }`}
          >
            {t("DailyTarget.Todo")}
          </Text>
          <View className="bg-white rounded-full px-2">
            <Text className="text-green-500 font-bold text-xs">
              {todoData.length}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Completed Button */}
        <TouchableOpacity
          className={`px-4 py-2 rounded-full mx-2 flex-row items-center ${
            selectedToggle === "Completed" ? "bg-[#2AAD7A]" : "bg-white"
          }`}
          onPress={() => setSelectedToggle("Completed")}
        >
          <Text
            className={`font-bold ${
              selectedToggle === "Completed" ? "text-white" : "text-black"
            }`}
          >
            {t("DailyTarget.Completed")}
          </Text>
          <View className="bg-white rounded-full px-2 ml-2">
            <Text className="text-green-500 font-bold text-xs">
              {completedData.length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Target List Table */}
      <ScrollView
        horizontal
        className="bg-white w-full"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="w-full bg-white">
          {/* Table Header */}
          <View className="flex-row bg-[#2AAD7A] h-[7%]">
            <Text className="w-16 p-2 text-center text-white">
              {t("DailyTarget.No")}
            </Text>
            <Text className="w-40 p-2 text-center text-white">
              {t("DailyTarget.Variety")}
            </Text>
            <Text className="w-32 p-2 text-center text-white">
              {t("DailyTarget.Grade")}
            </Text>
            <Text className="w-32 p-2 text-center text-white">
              {t("DailyTarget.Target")}
            </Text>
            {/* Dynamic Column Name */}
            <Text className="w-32 p-2 text-center text-white">
              {selectedToggle === "ToDo"
                ? t("DailyTarget.Todo()")
                : t("DailyTarget.Completedkg")}
            </Text>
          </View>

          {/* Table Data */}
          {loading ? (
            <View className="flex-1 justify-center items-center mr-[40%] -mt-[10%]">
              <LottieView
                source={require("../../assets/lottie/collector.json")}
                autoPlay
                loop
                style={{ width: 250, height: 250 }}
              />
            </View>
          ) : displayedData.length > 0 ? (
            displayedData.map((item, index) => (
              <TouchableOpacity
                key={index}
                className={`flex-row ${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                }`}
                onPress={() => {
                  // If "Completed", prevent navigation
                  if (selectedToggle === "Completed") return;

                  navigation.navigate("EditTargetManager" as any, {
                    varietyNameEnglish: item.varietyNameEnglish,
                    varietyId: item.varietyId,
                    grade: item.grade,
                    target: item.officerTarget,
                    todo: item.todo,
                    dailyTarget: item.dailyTarget,
                    varietyNameSinhala: item.varietyNameSinhala,
                    varietyNameTamil: item.varietyNameTamil,
                  });
                }}
              >
                <Text className="w-16 p-2 text-center">
                  {selectedToggle === "ToDo" ? (
                    index + 1
                  ) : (
                    <Ionicons name="flag" size={20} color="green" />
                  )}
                </Text>
                <Text className="w-40 p-2 text-center">
                  {getvarietyName(item)}
                </Text>
                <Text className="w-32 p-2 text-center">{item.grade}</Text>
                <Text className="w-32 p-2 text-center">
                  {item.officerTarget}
                </Text>
                <Text className="w-32 p-2 text-center">
                  {selectedToggle === "Completed" ? item.complete : item.todo}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            // Empty state with Lottie animation
            <View className="flex-1 justify-center items-center mr-[35%]">
              <LottieView
                source={require("../../assets/lottie/NoComplaints.json")}
                autoPlay
                loop
                style={{ width: 150, height: 150 }}
              />
              <Text className="text-gray-500  mt-4">
                {selectedToggle === "ToDo"
                  ? t("DailyTarget.NoTodoItems") || "No items to do"
                  : t("DailyTarget.noCompletedTargets") || "No completed items"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default DailyTarget;
