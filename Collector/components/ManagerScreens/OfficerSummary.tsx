import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { CircularProgress } from "react-native-circular-progress";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import AntDesign from "react-native-vector-icons/AntDesign";
import environment from "@/environment/environment";
import io from "socket.io-client"; 
import { socket } from "../../services/socket"

type OfficerSummaryNavigationProp = StackNavigationProp<
  RootStackParamList,
  "OfficerSummary"
>;

type OfficerSummaryRouteProp = RouteProp<RootStackParamList, "OfficerSummary">;

interface OfficerSummaryProps {
  navigation: OfficerSummaryNavigationProp;
  route: OfficerSummaryRouteProp;
}

const OfficerSummary: React.FC<OfficerSummaryProps> = ({
  route,
  navigation,
}) => {
  const {
    officerId,
    officerName,
    phoneNumber1,
    phoneNumber2,
    collectionOfficerId,
  } = route.params;
  const [showMenu, setShowMenu] = useState(false);
  console.log(route.params);
  const [officerStatus, setOfficerStatus] = useState('offline');
  
  console.log(officerStatus);
    const handleDial = (phoneNumber: string) => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl).catch((err) =>
      console.error("Failed to open dial pad:", err)
    );
  };




   useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected successfully");
    });

    socket.on("connect_error", (error: any) => {
      console.log("Socket connection error:", error);
    });

    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, [collectionOfficerId]);

  const handleDisclaim = async () => {
    setShowMenu(false);

    if (!collectionOfficerId) {
      Alert.alert("Error", "Missing collectionOfficerId. Please try again.");
      return;
    }

    try {
      const res = await fetch(
        `${environment.API_BASE_URL}api/collection-manager/disclaim-officer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ collectionOfficerId }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Disclaim failed:", errorData);
        Alert.alert(
          "Error",
          errorData.message || "Failed to disclaim officer."
        );
        return;
      }

      const data = await res.json();
      console.log(data);

      if (data.status === "success") {
        Alert.alert("Success", "Officer disclaimed successfully.");
        navigation.navigate("CollectionOfficersList");
      } else {
        Alert.alert("Failed", data.message || "Failed to disclaim officer.");
      }
    } catch (error) {
      console.error("Failed to disclaim:", error);
      Alert.alert("Error", "Failed to disclaim officer. Please try again.");
    }
  };

  // useEffect(() => {
  //   const fetchOfficerStatus = async () => {
  //     console.log(collectionOfficerId)
  //     if (collectionOfficerId) {
  //       try {
  //         const res = await fetch(
  //           `${environment.API_BASE_URL}api/collection-manager/get-officer-online`,
  //           {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({ collectionOfficerId }),
  //           }
  //         );
          
  //         if (!res.ok) {
  //           throw new Error("Failed to fetch officer status");
  //         }
  
  //         const data = await res.json();
  //         console.log(data.result.OnlineStatus);
  //       } catch (error) {
  //         console.error("Error fetching officer status:", error);
  //       }
  //     }
  //   };
  
  //   fetchOfficerStatus();
  // }, [collectionOfficerId]); 

  // useEffect(() => {
  //   // Connect to the backend server using the appropriate URL
  //   const socket = io(environment.API_BASE_URL, {
  //     transports: ['websocket'],
  //   });
    

  //   // On successful connection
  //   socket.on('connect', () => {
  //     console.log('Socket connected successfully');
  //   });

  //   // Handle connection errors
  //   socket.on('connect_error', (error) => {
  //     console.log('Socket connection error:', error);
  //   });

  //   // Listen for events from the server
  //   // socket.on('officer_status_update', (data) => {
  //   //   console.log('Received officer status update:', data);
  //   // });

  //   // Clean up socket connection when the component unmounts
  //   return () => {
  //     socket.disconnect();
  //     console.log('Socket disconnected');
  //   };
  // }, []);
  
// Client-Side (React Native)




  return (
    <View className="flex-1 bg-white ">
      {/* Header */}
      <View className="relative">
        {/* Header Section */}
        <View className="bg-white rounded-b-[25px] px-4 pt-12 pb-6 items-center shadow-lg z-10">
          {/* Back Icon */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-6 left-4"
          >
            <AntDesign name="left" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            className="absolute top-6 right-4"
            onPress={() => setShowMenu((prev) => !prev)}
          >
            <Ionicons name="ellipsis-vertical" size={24} />
          </TouchableOpacity>

          {showMenu && (
            <View className="absolute top-14 right-4 bg-white shadow-lg rounded-lg">
              <TouchableOpacity
                className="px-4 py-2 bg-white rounded-lg shadow-lg"
                onPress={handleDisclaim}
              >
                <Text className="text-gray-700 font-semibold">Disclaim</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Profile Image with Green Border */}
          <View className="w-28 h-28 border-[6px] border-[#2AAD7A] rounded-full items-center justify-center">
            <Image
              source={require("../../assets/images/mprofile.png")}
              className="w-24 h-24 rounded-full"
            />
          </View>
          {/* Name and EMP ID */}
          <Text className="mt-4 text-lg font-bold text-black">
            {officerName}
          </Text>
          <Text className="text-sm text-gray-500">EMP ID : {officerId}</Text>
        </View>

        {/* Action Buttons Section */}
        <View className="bg-[#2AAD7A] rounded-b-[45px] px-8 py-4 -mt-6 flex-row justify-around shadow-md z-0">
          {/* Phone Number 1 */}
          {phoneNumber1 ? (
            <TouchableOpacity
              className="items-center mt-5"
              onPress={() => handleDial(phoneNumber1)}
            >
              <View className="w-12 h-12 bg-[#FFFFFF66] rounded-full items-center justify-center shadow-md">
                <Ionicons name="call" size={24} color="white" />
              </View>
              <Text className="text-white mt-2 text-xs">Num 1</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity disabled={true} className="items-center mt-5">
              <View className="w-12 h-12 bg-[#FFFFFF66] rounded-full items-center justify-center shadow-md">
                <MaterialIcons name="error-outline" size={24} color="white" />
              </View>
              <Text className="text-white mt-2 text-xs">Num 1</Text>
            </TouchableOpacity>
          )}

          {/* Phone Number 2 */}
          {phoneNumber2 ? (
            <TouchableOpacity
              className="items-center mt-5"
              onPress={() => handleDial(phoneNumber2)}
            >
              <View className="w-12 h-12 bg-[#FFFFFF66] rounded-full items-center justify-center shadow-md">
                <Ionicons name="call" size={24} color="white" />
              </View>
              <Text className="text-white mt-2 text-xs">Num 2</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity disabled={true} className="items-center mt-5">
              <View className="w-12 h-12 bg-[#FFFFFF66] rounded-full items-center justify-center shadow-md">
                <MaterialIcons name="error-outline" size={24} color="white" />
              </View>
              <Text className="text-white mt-2 text-xs">Num 2</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="items-center mt-5"
            onPress={() =>
              navigation.navigate("TransactionList" as any, {
                officerId,
                collectionOfficerId,
              })
            }
          >
            <View className="w-12 h-12 bg-[#FFFFFF66] rounded-full items-center justify-center shadow-md">
              <Image
                source={require("../../assets/images/lf.png")} // Replace with your image path
                style={{ width: 28, height: 28, resizeMode: "contain" }} // Adjust dimensions as needed
              />
            </View>
            <Text className="text-white mt-2 text-xs">Collection</Text>
          </TouchableOpacity>

          {/* Report Button */}
          <TouchableOpacity
            className="items-center mt-5"
            onPress={() =>
              navigation.navigate("ReportGenerator" as any, {
                officerId,
                collectionOfficerId,
              })
            }
          >
            <View className="w-12 h-12 bg-[#FFFFFF66] rounded-full items-center justify-center shadow-md">
              <MaterialIcons name="description" size={24} color="white" />
            </View>
            <Text className="text-white mt-2 text-xs">Report</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Section */}
      <View className="mt-6 px-6">
        <Text className="text-gray-800 font-bold mb-4 text-lg">Today ▶</Text>

        {/* Vertical Progress Indicators */}
        <View className="items-center">
          {/* Total Weight */}
          <View className="items-center mb-8">
            <CircularProgress
              size={100}
              width={10}
              fill={40}
              tintColor="#0CB783"
              backgroundColor="#E5E7EB"
            />
            <Text className="text-center mt-2 text-lg font-bold">40%</Text>
            <Text className="text-sm text-gray-500 mt-1">Target Coverage</Text>
          </View>
          
            <View className="mt-6 items-center">
                  <TouchableOpacity
                    className="bg-[#2AAD7A] rounded-full w-64 py-3 h-12"
                    onPress={() => navigation.navigate('DailyTargetListForOfficers',{ officerId,collectionOfficerId })}
                  >
                    <Text className="text-white text-center font-medium">Open Target Board</Text>
                  </TouchableOpacity>
                </View>

        
        </View>
      </View>
    </View>
  );
};

export default OfficerSummary;
