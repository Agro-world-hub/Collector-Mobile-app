// import React, { useState, useEffect, useCallback } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   Linking,
//   Alert,
//   ScrollView,
//   RefreshControl,
// } from "react-native";
// import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// import { CircularProgress } from "react-native-circular-progress";
// import { StackNavigationProp } from "@react-navigation/stack";
// import { RouteProp } from "@react-navigation/native";
// import { RootStackParamList } from "../types";
// import AntDesign from "react-native-vector-icons/AntDesign";
// import environment from "@/environment/environment";
// import axios from "axios";

// type OfficerSummaryNavigationProp = StackNavigationProp<
//   RootStackParamList,
//   "OfficerSummary"
// >;

// type OfficerSummaryRouteProp = RouteProp<RootStackParamList, "OfficerSummary">;

// interface OfficerSummaryProps {
//   navigation: OfficerSummaryNavigationProp;
//   route: OfficerSummaryRouteProp;
// }

// const OfficerSummary: React.FC<OfficerSummaryProps> = ({ route, navigation }) => {
//   const {
//     officerId,
//     officerName,
//     phoneNumber1,
//     phoneNumber2,
//     collectionOfficerId,
//   } = route.params;
//   const [showMenu, setShowMenu] = useState(false);
//   const [officerStatus, setOfficerStatus] = useState('offline');
//   const [taskPercentage, setTaskPercentage] = useState<number | null>(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const handleDial = (phoneNumber: string) => {
//     const phoneUrl = `tel:${phoneNumber}`;
//     Linking.openURL(phoneUrl).catch((err) =>
//       console.error("Failed to open dial pad:", err)
//     );
//   };

//   // Fetch task summary and completion percentage
//   const fetchTaskSummary = async () => {
//     try {
//       const res = await axios.get(
//         `${environment.API_BASE_URL}api/target/officer-task-summary/${collectionOfficerId}`
//       );

//       if (res.data.success) {
//         const { totalTasks, completedTasks } = res.data;
//         const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
//         setTaskPercentage(percentage); // Update the state with the percentage
//       } else {
//         Alert.alert("Error", "No task summary found for this officer.");
//       }
//     } catch (error) {
//       console.error("Error fetching task summary:", error);
//       Alert.alert("Error", "Failed to fetch task summary.");
//     }
//   };

//   // Refreshing function
//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchTaskSummary();  // Re-fetch task summary
//     setRefreshing(false);
//   }, [collectionOfficerId]);

//   useEffect(() => {
//     fetchTaskSummary();
//   }, [collectionOfficerId]);

//   const handleDisclaim = async () => {
//     setShowMenu(false);

//     if (!collectionOfficerId) {
//       Alert.alert("Error", "Missing collectionOfficerId. Please try again.");
//       return;
//     }

//     try {
//       const res = await fetch(
//         `${environment.API_BASE_URL}api/collection-manager/disclaim-officer`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ collectionOfficerId }),
//         }
//       );

//       if (!res.ok) {
//         const errorData = await res.json();
//         console.error("Disclaim failed:", errorData);
//         Alert.alert(
//           "Error",
//           errorData.message || "Failed to disclaim officer."
//         );
//         return;
//       }

//       const data = await res.json();
//       console.log(data);

//       if (data.status === "success") {
//         Alert.alert("Success", "Officer disclaimed successfully.");
//         navigation.navigate("CollectionOfficersList");
//       } else {
//         Alert.alert("Failed", data.message || "Failed to disclaim officer.");
//       }
//     } catch (error) {
//       console.error("Failed to disclaim:", error);
//       Alert.alert("Error", "Failed to disclaim officer. Please try again.");
//     }
//   };

//   return (
//     <ScrollView
//       className="flex-1 bg-white "
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//       }
//     >
//       {/* Header */}
//       <View className="relative">
//         {/* Header Section */}
//         <View className="bg-white rounded-b-[25px] px-4 pt-12 pb-6 items-center shadow-lg z-10">
//           {/* Back Icon */}
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             className="absolute top-6 left-4"
//           >
//             <AntDesign name="left" size={24} color="#000" />
//           </TouchableOpacity>

//           <TouchableOpacity
//             className="absolute top-6 right-4"
//             onPress={() => setShowMenu((prev) => !prev)}
//           >
//             <Ionicons name="ellipsis-vertical" size={24} />
//           </TouchableOpacity>

//           {showMenu && (
//             <View className="absolute top-14 right-4 bg-white shadow-lg rounded-lg">
//               <TouchableOpacity
//                 className="px-4 py-2 bg-white rounded-lg shadow-lg"
//                 onPress={handleDisclaim}
//               >
//                 <Text className="text-gray-700 font-semibold">Disclaim</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* Profile Image with Green Border */}
//           <View className="w-28 h-28 border-[6px] border-[#2AAD7A] rounded-full items-center justify-center">
//             <Image
//               source={require("../../assets/images/mprofile.png")}
//               className="w-24 h-24 rounded-full"
//             />
//           </View>
//           {/* Name and EMP ID */}
//           <Text className="mt-4 text-lg font-bold text-black">
//             {officerName}
//           </Text>
//           <Text className="text-sm text-gray-500">EMP ID : {officerId}</Text>
//         </View>

//         {/* Action Buttons Section */}
//         <View className="bg-[#2AAD7A] rounded-b-[45px] px-8 py-4 -mt-6 flex-row justify-around shadow-md z-0">
//           {/* Phone Number 1 */}
//           {phoneNumber1 ? (
//             <TouchableOpacity
//               className="items-center mt-5"
//               onPress={() => handleDial(phoneNumber1)}
//             >
//               <View className="w-12 h-12 bg-[#FFFFFF66] rounded-full items-center justify-center shadow-md">
//                 <Ionicons name="call" size={24} color="white" />
//               </View>
//               <Text className="text-white mt-2 text-xs">Num 1</Text>
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity disabled={true} className="items-center mt-5">
//               <View className="w-12 h-12 bg-[#FFFFFF66] rounded-full items-center justify-center shadow-md">
//                 <MaterialIcons name="error-outline" size={24} color="white" />
//               </View>
//               <Text className="text-white mt-2 text-xs">Num 1</Text>
//             </TouchableOpacity>
//           )}

//           {/* Phone Number 2 */}
//           {phoneNumber2 ? (
//             <TouchableOpacity
//               className="items-center mt-5"
//               onPress={() => handleDial(phoneNumber2)}
//             >
//               <View className="w-12 h-12 bg-[#FFFFFF66] rounded-full items-center justify-center shadow-md">
//                 <Ionicons name="call" size={24} color="white" />
//               </View>
//               <Text className="text-white mt-2 text-xs">Num 2</Text>
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity disabled={true} className="items-center mt-5">
//               <View className="w-12 h-12 bg-[#FFFFFF66] rounded-full items-center justify-center shadow-md">
//                 <MaterialIcons name="error-outline" size={24} color="white" />
//               </View>
//               <Text className="text-white mt-2 text-xs">Num 2</Text>
//             </TouchableOpacity>
//           )}

//           <TouchableOpacity
//             className="items-center mt-5"
//             onPress={() =>
//               navigation.navigate("TransactionList" as any, {
//                 officerId,
//                 collectionOfficerId,
//               })
//             }
//           >
//             <View className="w-12 h-12 bg-[#FFFFFF66] rounded-full items-center justify-center shadow-md">
//               <Image
//                 source={require("../../assets/images/lf.png")} // Replace with your image path
//                 style={{ width: 28, height: 28, resizeMode: "contain" }} // Adjust dimensions as needed
//               />
//             </View>
//             <Text className="text-white mt-2 text-xs">Collection</Text>
//           </TouchableOpacity>

//           {/* Report Button */}
//           <TouchableOpacity
//             className="items-center mt-5"
//             onPress={() =>
//               navigation.navigate("ReportGenerator" as any, {
//                 officerId,
//                 collectionOfficerId,
//               })
//             }
//           >
//             <View className="w-12 h-12 bg-[#FFFFFF66] rounded-full items-center justify-center shadow-md">
//               <MaterialIcons name="description" size={24} color="white" />
//             </View>
//             <Text className="text-white mt-2 text-xs">Report</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Stats Section */}
//       <View className="mt-6 px-6">
//         <Text className="text-gray-800 font-bold mb-4 text-lg">Today ▶</Text>

//         {/* Vertical Progress Indicators */}
//         <View className="items-center">
//           {/* Total Weight */}
//           <View className="items-center mb-8">
//             <CircularProgress
//               size={120}
//               width={10}
//               fill={taskPercentage ?? 0} // Dynamically set fill percentage
//               tintColor="#0CB783"
//               backgroundColor="#E5E7EB"
//             >
//               {(fill) => (
//                 <Text className="text-[#0CB783] font-bold text-xl">{Math.round(fill)}%</Text>
//               )}
//             </CircularProgress>

//             <Text className="text-sm text-gray-500 mt-4">Target Coverage</Text>
//           </View>

//           <View className="mt-6 items-center">
//             <TouchableOpacity
//               className="bg-[#2AAD7A] rounded-full w-64 py-3 h-12"
//               onPress={() => navigation.navigate('DailyTargetListForOfficers', { officerId, collectionOfficerId })}
//             >
//               <Text className="text-white text-center font-medium">Open Target Board</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default OfficerSummary;
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  ScrollView,
  RefreshControl,
  Modal
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { CircularProgress } from "react-native-circular-progress";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import AntDesign from "react-native-vector-icons/AntDesign";
import {environment }from '@/environment/environment';
import axios from "axios";
import { useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";

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
    image,
  } = route.params;
  const [showMenu, setShowMenu] = useState(false);
  const [officerStatus, setOfficerStatus] = useState("offline");
  const [taskPercentage, setTaskPercentage] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(false); // Track the online status
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);  

  const ConfirmationModal = ({ visible, onConfirm, onCancel }: any) => {
    return (
      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={onCancel}
      >
        <View className="flex-1 justify-center items-center bg-black/60 bg-opacity-50">
          <View className="bg-white items-center rounded-lg w-80 p-6">
           <View className="flex items-center justify-center mb-4 rounded-lg bg-[#f7f8fa] p-2 w-12 h-12 ">
        <Ionicons name="warning" size={30} color="#6c7e8c" />
      </View>
            <Text className="text-center text-sm font-semibold mb-4">
              {t("DisclaimOfficer.Are you sure you want to disclaim this officer?")}
            </Text>
          
            
            <View className="flex-row  justify-center gap-4">
              <TouchableOpacity
                onPress={onCancel}
                className="p-2 py-2 bg-gray-300 rounded-lg"
              >
                <Text className="text-sm text-gray-700">{t("ClaimOfficer.Cancel")}</Text>
              </TouchableOpacity>
  
              <TouchableOpacity
                onPress={onConfirm}
                className="p-2 py-2 bg-[#D16D6A] rounded-lg"
              >
                <Text className="text-sm text-white">{t("DisclaimOfficer.Disclaim")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  const handleDial = (phoneNumber: string) => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl).catch((err) =>
      console.error("Failed to open dial pad:", err)
    );
  };

  // Fetch task summary and completion percentage
  const fetchTaskSummary = async () => {
    try {
      const res = await axios.get(
        `${environment.API_BASE_URL}api/target/officer-task-summary/${collectionOfficerId}`
      );

      if (res.data.success) {
        const { totalTasks, completedTasks } = res.data;
        const percentage =
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        setTaskPercentage(percentage);
      } else {
        Alert.alert(t("Error.error"), t("Error.No task summary found for this officer."));
      }
    } catch (error) {
      console.error("Error fetching task summary:", error);
      Alert.alert(t("Error.error"), t("Error.Failed to fetch task summary."));
    }
  };

  // Refreshing function
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTaskSummary(); // Re-fetch task summary
    setRefreshing(false);
    setShowMenu(false)
    getOnlineStatus();
  }, [collectionOfficerId]);

  useEffect(() => {
    fetchTaskSummary();
  }, [collectionOfficerId]);

  const handleCancel = () => {
    setModalVisible(false); // Close the modal without taking action
    setShowMenu(false)
  };
  const handleDisclaim = async () => {
    setShowMenu(false);

    if (!collectionOfficerId) {
      Alert.alert(t("Error.error"), t("Error.Missing collectionOfficerId"));
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
          t("Error.error"), t("Error.Failed to disclaim officer.")
        );
        return;
      }

      const data = await res.json();
      console.log(data);

      if (data.status === "success") {
        setModalVisible(false); // Close the modal
        Alert.alert(t("Error.Success"), t("DisclaimOfficer.Officer disclaimed successfully."));
        navigation.navigate("Main", { screen: "CollectionOfficersList" });
      } else {
        Alert.alert("QRScanner.Failed", t("DisclaimOfficer.Failed to disclaim officer."));
      }
    } catch (error) {
      console.error("Failed to disclaim:", error);
      Alert.alert("QRScanner.Failed", t("DisclaimOfficer.Failed to disclaim officer."));
    }
  };

  // const isOnlineRef = useRef(false);

  // // Create stable callback references with useCallback
  // const handleLoginSuccess = useCallback(
  //   (data: any) => {
  //     if (data.empId === officerId) {
  //       if (!isOnlineRef.current) {
  //         isOnlineRef.current = true;
  //         setIsOnline(true);
  //       }
  //     }
  //   },
  //   [officerId]
  // );

  // const handleEmployeeOnline = useCallback(
  //   (data: any) => {
  //     if (data.empId === officerId) {
  //       if (!isOnlineRef.current) {
  //         console.log("Employee is online", data);
  //         isOnlineRef.current = true;
  //         setIsOnline(true);
  //       }
  //     }
  //   },
  //   [officerId]
  // );

  // const handleEmployeeOffline = useCallback(
  //   (data: any) => {
  //     if (data.empId === officerId) {
  //       if (isOnlineRef.current) {
  //         console.log("Employee is offline", data);
  //         isOnlineRef.current = false;
  //         setIsOnline(false);
  //       }
  //     }
  //   },
  //   [officerId]
  // );

  // useEffect(() => {
  //   // Use a flag to track if component is mounted
  //   let isMounted = true;

  //   // Set up event listeners first so we don't miss events
  //   socket.on("loginSuccess", handleLoginSuccess);
  //   socket.on("employeeOnline", handleEmployeeOnline);
  //   socket.on("employeeOffline", handleEmployeeOffline);

  //   // Send login event when component mounts
  //   // Add timestamp for latency measurement
  //   // console.log('Emitting login with empId:', officerId);
  //   // socket.emit('login', { empId: officerId, timestamp: Date.now() });

  //   // Clean up event listeners when component unmounts
  //   return () => {
  //     isMounted = false;
  //     socket.off("loginSuccess", handleLoginSuccess);
  //     socket.off("employeeOnline", handleEmployeeOnline);
  //     socket.off("employeeOffline", handleEmployeeOffline);
  //   };
  // }, [
  //   officerId,
  //   handleLoginSuccess,
  //   handleEmployeeOnline,
  //   handleEmployeeOffline,
  // ]);

  useFocusEffect(
    useCallback(() => {
      setShowMenu(false)
      getOnlineStatus();
    }, [collectionOfficerId])
  );
  const getOnlineStatus = async () => {
    console.log("Getting officer status...");
    try {
      const res = await fetch(
        `${environment.API_BASE_URL}api/collection-manager/get-officer-online/${collectionOfficerId}`
      );
      const data = await res.json();
      console.log("Officer status:", data);
  
      if (data.success) {
        // Check OnlineStatus value and set status accordingly
        const { OnlineStatus } = data.result;
        
        if (OnlineStatus === 1) {
          setOfficerStatus("online"); // Assuming you have a setStatus function to update state
          setIsOnline(true);
          console.log("Officer is online");
        } else {
          setOfficerStatus("offline");
          setIsOnline(false);
          console.log("Officer is offline");
        }
      } else {
        console.error("Failed to get officer status");
        Alert.alert(t("Error.error"), t("Error.Failed to get officer status."));
      }
    } catch (error) {
      console.error("Failed to get officer status:", error);
      Alert.alert(t("Error.error"), t("Error.Failed to get officer status."));
    }
  };
  

  return (
    <ScrollView
      className="flex-1 bg-white "
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View className="relative">
        {/* Header Section */}
        <View className="bg-white rounded-b-[25px] px-4 pt-12 pb-6 items-center shadow-lg z-10">
          {/* Back Icon */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Main", { screen: "CollectionOfficersList" })
            }
            className="absolute top-4 left-4"
          >
            <AntDesign name="left" size={22} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            className="absolute top-4 right-4"
            onPress={() => setShowMenu((prev) => !prev)}
          >
            <Ionicons name="ellipsis-vertical" size={24} />
          </TouchableOpacity>

          {showMenu && (
            <View className="absolute z-50 top-14 right-4 bg-white shadow-lg rounded-lg">
              <TouchableOpacity
                className="p-2 py-2 bg-white rounded-lg shadow-lg"
                onPress={() => setModalVisible(true)}
              >
                <Text className="text-gray-700 font-semibold">{t("OfficerSummary.Disclaim")}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Profile Image with Green Border */}
          <View className={`w-28 h-28 border-[6px] rounded-full items-center justify-center ${isOnline ? 'border-[#2AAD7A]' : 'border-gray-400'}`}>
            {/* <Image
              source={require("../../assets/images/mprofile.webp")}
              className="w-24 h-24 rounded-full"
            />  */}
            <Image
              source={
                image
                  ? { uri: image }
                  : require("../../assets/images/mprofile.webp")
              }
              className="w-24 h-24 rounded-full "
            />
          </View>
          {/* Name and EMP ID */}
          <Text className="mt-4 text-lg font-bold text-black">
            {officerName}
          </Text>
          <Text className="text-sm text-gray-500">{t("OfficerSummary.EMPID")} {officerId}</Text>
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
              <Text className="text-white mt-2 text-xs">{t("OfficerSummary.Num1")}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity disabled={true} className="items-center mt-5">
              <View className="w-12 h-12 bg-[#FFFFFF66] rounded-full items-center justify-center shadow-md">
                <MaterialIcons name="error-outline" size={24} color="white" />
              </View>
              <Text className="text-white mt-2 text-xs">{t("OfficerSummary.Num1")}</Text>
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
              <Text className="text-white mt-2 text-xs">{t("OfficerSummary.Num2")}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity disabled={true} className="items-center mt-5">
              <View className="w-12 h-12 bg-[#FFFFFF66] rounded-full items-center justify-center shadow-md">
                <MaterialIcons name="error-outline" size={24} color="white" />
              </View>
              <Text className="text-white mt-2 text-xs">{t("OfficerSummary.Num2")}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="items-center mt-5"
            onPress={() =>
              navigation.navigate("Main", {
                screen: "TransactionList",
                params: {
                  officerId,
                  collectionOfficerId,
                  phoneNumber1,
                  phoneNumber2,
                  officerName,
                },
              })
            }
          >
            <View className="w-12 h-12 bg-[#FFFFFF66] rounded-full items-center justify-center shadow-md">
              <Image
                source={require("../../assets/images/lf.webp")} // Replace with your image path
                style={{ width: 28, height: 28, resizeMode: "contain" }} // Adjust dimensions as needed
              />
            </View>
            <Text className="text-white mt-2 text-xs">{t("OfficerSummary.Collection")}</Text>
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
            <Text className="text-white mt-2 text-xs">{t("OfficerSummary.Report")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Section */}
      <View className="mt-6 px-6">
        {/* <Text className="text-gray-800 font-bold mb-4 text-lg">{t("OfficerSummary.Today")} ▶</Text> */}

        {/* Vertical Progress Indicators */}
        <View className="items-center mt-4">
          {/* Total Weight */}
          <View className="items-center mb-8">
            <CircularProgress
              size={120}
              width={10}
              fill={taskPercentage ?? 0} // Dynamically set fill percentage
              tintColor="#0CB783"
              backgroundColor="#E5E7EB"
            >
              {(fill) => (
                <Text className="text-[#0CB783] font-bold text-xl">
                  {Math.round(fill)}%
                </Text>
              )}
            </CircularProgress>

            <Text className="text-sm text-gray-500 mt-4">{t("OfficerSummary.Target Coverage")}</Text>
          </View>

          <View className="mt-6 mb-10 items-center">
            <TouchableOpacity
              className="bg-[#2AAD7A] rounded-full w-64 py-3 h-12"
              onPress={() =>
                navigation.navigate("DailyTargetListForOfficers", {
                  officerId,
                  collectionOfficerId,
                })
              }
            >
              <Text className="text-white text-center font-medium">
              {t("OfficerSummary.OpenTarget")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ConfirmationModal
        visible={modalVisible}
        onConfirm={handleDisclaim}
        onCancel={handleCancel}
      />
    </ScrollView>
  );
};

export default OfficerSummary;
