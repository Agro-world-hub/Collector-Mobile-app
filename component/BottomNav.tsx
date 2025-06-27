// import React, { useState, useEffect, useCallback } from "react";
// import NetInfo from "@react-native-community/netinfo";
// import {
//   View,
//   TouchableOpacity,
//   Image,
//   Animated,
//   Keyboard,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import { environment } from "@/environment/environment";
// import { AppState, AppStateStatus } from "react-native";
// import { use } from "i18next";

// const homeIcon = require("../assets/images/homee.webp");
// const searchIcon = require("../assets/images/searchh.webp");
// const qrIcon = require("../assets/images/target.webp");
// const adminIcon = require("../assets/images/People.webp");

// const BottomNav = ({ navigation, state }: { navigation: any; state: any }) => {
//   let tabs = [
//     { name: "DailyTargetList", icon: qrIcon, focusedIcon: qrIcon },
//     { name: "Dashboard", icon: homeIcon, focusedIcon: homeIcon },
//     { name: "SearchPriceScreen", icon: searchIcon, focusedIcon: searchIcon },
//   ];
//   const [userRole, setUserRole] = useState<string | null>(null);
//   const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false);

//   useEffect(() => {
//     const keyboardDidShowListener = Keyboard.addListener(
//       "keyboardDidShow",
//       () => {
//         setKeyboardVisible(true);
//       }
//     );
//     const keyboardDidHideListener = Keyboard.addListener(
//       "keyboardDidHide",
//       () => {
//         setKeyboardVisible(false);
//       }
//     );

//     return () => {
//       keyboardDidShowListener.remove();
//       keyboardDidHideListener.remove();
//     };
//   }, []);

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const role = await AsyncStorage.getItem("jobRole");
//         setUserRole(role);
//         console.log("User role:", role);
//       } catch (error) {
//         console.error("Error fetching user role:", error);
//       }
//     };

//     fetchUserRole();
//   }, []);

//   useEffect(() => {
//     const checkClaimStatus = async () => {
//       try {
//         const response = await axios.get(
//           `${environment.API_BASE_URL}api/collection-officer/get-claim-status`,
//           {
//             headers: {
//               Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
//             },
//           }
//         );

//         if (response.data.claimStatus === 0) {
//           navigation.navigate("NoCollectionCenterScreen");
//         }
//       } catch (error) {
//         console.error("Error checking claim status:", error);
//         navigation.navigate("Login");
//       }
//     };

//     checkClaimStatus();
//   }, [navigation]);

//   // Get the name of the currently focused tab from the state
//   let currentTabName = state.routes[state.index]?.name;
//   console.log("Current tab:", currentTabName);
//   if (currentTabName === "PriceChart") {
//     currentTabName = "SearchPriceScreen";
//   } else if (
//     currentTabName === "EditTargetManager" ||
//     currentTabName === "PassTargetScreen" ||
//     currentTabName === "RecieveTargetScreen"
//   ) {
//     currentTabName = "DailyTarget";
//   } else if (
//     currentTabName === "TransactionList" ||
//     currentTabName === "OfficerSummary"
//   ) {
//     currentTabName = "CollectionOfficersList";
//   }

//   if (userRole === "Collection Center Manager") {
//     tabs = [
//       { name: "ManagerDashboard", icon: homeIcon, focusedIcon: homeIcon },
//       { name: "DailyTarget", icon: qrIcon, focusedIcon: qrIcon },

//       {
//         name: "CollectionOfficersList",
//         icon: adminIcon,
//         focusedIcon: adminIcon,
//       },
//       { name: "SearchPriceScreen", icon: searchIcon, focusedIcon: searchIcon },
//     ];
//   }
//   useEffect(() => {
//     // Check the userRole and manually navigate if needed
//     if (
//       userRole === "Collection Center Manager" &&
//       currentTabName == "Dashboard"
//     ) {
//       navigation.navigate("ManagerDashboard");
//     }
//   }, [userRole, currentTabName, navigation]);

//   useEffect(() => {
//     onlineStatus();
//   }, []);
//   const onlineStatus = async () => {
//     AppState.addEventListener("change", async (nextAppState) => {
//       console.log("App state changed toooolllllll:", nextAppState);
//       const storedEmpId = await AsyncStorage.getItem("empid");

//       if (nextAppState === "active") {
//       } else if (nextAppState === "background") {
//         console.log("App went to background, disconnecting socketssssss");
//         setTimeout(async () => {
//           // Recheck app state after 5 seconds
//           if (
//             AppState.currentState === "background" ||
//             AppState.currentState === "inactive"
//           ) {
//             try {
//               // Remove token and empId from AsyncStorage
//               await AsyncStorage.removeItem("token");
//               await AsyncStorage.removeItem("empid");

//               // Disconnect socket
//               console.log(
//                 "App in background for 5 seconds, disconnecting socket"
//               );
//               // socket.disconnect();

//               // Navigate to login screen
//               navigation.navigate("Login" as never);
//             } catch (error) {
//               console.error("Error removing credentials or navigating:", error);
//             }
//           }
//         }, 3000); // 5 seconds delay
//       }
//     });
//   };

//   if (isKeyboardVisible) return null;
//   return (
//     <View
//       className={` ${currentTabName === "QRScanner" ? "bg-black" : "bg-white"}`}
//     >
//       <View className="absolute bottom-0 flex-row  justify-between items-center bg-[#21202B] py-3 px-6 rounded-t-3xl w-full">
//         {tabs.map((tab, index) => {
//           // Check if the current tab is focused
//           const isFocused = currentTabName === tab.name;
//           return (
//             <TouchableOpacity
//               key={index}
//               onPress={() => navigation.navigate(tab.name)}
//               className={`${
//                 isFocused
//                   ? "bg-green-500 p-4 rounded-full -mt-6 border-4 border-[#1A1920] shadow-md"
//                   : "items-center justify-center"
//               }`}
//               style={{
//                 backgroundColor: isFocused ? "#34D399" : "transparent",
//                 padding: isFocused ? 8 : 6,
//                 borderRadius: 50,
//                 borderWidth: isFocused ? 2 : 0,
//                 borderColor: "#1A1920",
//                 shadowColor: isFocused ? "#000" : "transparent",
//                 shadowOpacity: 0.2,
//                 shadowRadius: 4,
//                 elevation: isFocused ? 5 : 0,
//               }}
//             >
//               <Image
//                 source={isFocused ? tab.focusedIcon : tab.icon}
//                 style={{ width: 24, height: 24, resizeMode: "contain" }}
//               />
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </View>
//   );
// };

// export default BottomNav;

import React, { useState, useEffect, useCallback } from "react";
import NetInfo from "@react-native-community/netinfo";
import {
  View,
  TouchableOpacity,
  Image,
  Animated,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { environment } from "@/environment/environment";
import { AppState, AppStateStatus } from "react-native";
import useUserStore from "@/store/userStore";  // Import the global store

const homeIcon = require("../assets/images/homee.webp");
const searchIcon = require("../assets/images/searchh.webp");
const qrIcon = require("../assets/images/target.webp");
const adminIcon = require("../assets/images/People.webp");

const BottomNav = ({ navigation, state }: { navigation: any; state: any }) => {
  const { userRole, setUserRole, setToken, setEmpId } = useUserStore(); // Get data from the global store
  console.log("User role from store:", userRole);
  const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Fetch the user role once and store it globally
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem("jobRole");
        setUserRole(role ?? "");  // Set the role in the store, fallback to empty string if null
        console.log("User role:", role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, [setUserRole]);

  // Check claim status only once and navigate accordingly
  useEffect(() => {
    const checkClaimStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        setToken(token ?? "");  // Store token globally, fallback to empty string if null
        const response = await axios.get(
          `${environment.API_BASE_URL}api/collection-officer/get-claim-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.claimStatus === 0) {
          navigation.navigate("NoCollectionCenterScreen");
        }
      } catch (error) {
        console.error("Error checking claim status:", error);
        navigation.navigate("Login");
      }
    };

    if (userRole === "Collection Center Manager") {
      checkClaimStatus(); // Call only if the user role is Collection Center Manager
    }
     if (userRole === "Distribution Officer") {
      checkClaimStatus(); // Call only if the user role is Distribution Officer
    }
  }, [userRole, setToken, navigation]);

  // Determine the current tab
  let currentTabName = state.routes[state.index]?.name || "Dashboard";
  console.log("Current tab:", currentTabName);
  
 if (currentTabName === "PriceChart") {
    currentTabName = "SearchPriceScreen";
  } else if (
    currentTabName === "EditTargetManager" ||
    currentTabName === "PassTargetScreen" ||
    currentTabName === "RecieveTargetScreen"
  ) {
    currentTabName = "DailyTarget";
  } else if (
    currentTabName === "TransactionList" ||
    currentTabName === "OfficerSummary"
  ) {
    currentTabName = "CollectionOfficersList";
  }


  // Define tabs based on userRole
  let tabs = [
    { name: "DailyTargetList", icon: qrIcon, focusedIcon: qrIcon },
    { name: "Dashboard", icon: homeIcon, focusedIcon: homeIcon },
    { name: "SearchPriceScreen", icon: searchIcon, focusedIcon: searchIcon },
  ];

  if (userRole === "Collection Center Manager") {
    tabs = [
      { name: "ManagerDashboard", icon: homeIcon, focusedIcon: homeIcon },
      { name: "DailyTarget", icon: qrIcon, focusedIcon: qrIcon },
      { name: "CollectionOfficersList", icon: adminIcon, focusedIcon: adminIcon },
      { name: "SearchPriceScreen", icon: searchIcon, focusedIcon: searchIcon },
    ];
  }

  if (userRole === "Distribution Officer" || userRole === "Distribution Manager") {
    tabs = [
      { name: "DistridutionaDashboard", icon: homeIcon, focusedIcon: homeIcon },
    
    ];
  }

  useEffect(() => {
    if (userRole === "Collection Center Manager" && currentTabName == "Dashboard") {
      navigation.navigate("ManagerDashboard");
    }
  }, [userRole, currentTabName, navigation]);

  useEffect(() => {
    if (userRole === "Distribution Officer" && currentTabName == "Dashboard") {
      navigation.navigate("DistridutionaDashboard");
    }
  }, [userRole, currentTabName, navigation]);

  useEffect(() => {
    const onlineStatus = async () => {
      AppState.addEventListener("change", async (nextAppState) => {
        const storedEmpId = await AsyncStorage.getItem("empid");
        setEmpId(storedEmpId ?? "");  // Store empId globally, fallback to empty string if null

        if (nextAppState === "background") {
          setTimeout(async () => {
            if (AppState.currentState === "background" || AppState.currentState === "inactive") {
              try {
                await AsyncStorage.removeItem("token");
                await AsyncStorage.removeItem("empid");
                navigation.navigate("Login");
              } catch (error) {
                console.error("Error removing credentials or navigating:", error);
              }
            }
          }, 3000);
        }
      });
    };

    onlineStatus();
  }, [setEmpId, navigation]);

  if (isKeyboardVisible) return null;

  return (
    <View className={` ${currentTabName === "QRScanner" ? "bg-black" : "bg-white"}`}>
      <View className="absolute bottom-0 flex-row  justify-between items-center bg-[#21202B] py-3 px-6 rounded-t-3xl w-full">
        {tabs.map((tab, index) => {
          const isFocused = currentTabName === tab.name;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate(tab.name)}
              className={`${isFocused ? "bg-green-500 p-4 rounded-full -mt-6 border-4 border-[#1A1920] shadow-md" : "items-center justify-center"}`}
              style={{
                backgroundColor: isFocused ? "#34D399" : "transparent",
                padding: isFocused ? 8 : 6,
                borderRadius: 50,
                borderWidth: isFocused ? 2 : 0,
                borderColor: "#1A1920",
                shadowColor: isFocused ? "#000" : "transparent",
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: isFocused ? 5 : 0,
              }}
            >
              <Image source={isFocused ? tab.focusedIcon : tab.icon} style={{ width: 24, height: 24, resizeMode: "contain" }} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default BottomNav;
