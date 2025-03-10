// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, Image, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import { RootStackParamList } from '../types';
// import axios from 'axios';
// import environment from '@/environment/environment';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import LottieView from 'lottie-react-native'; // Import Lottie for animation
// import BottomNav from '../BottomNav';

// const { width } = Dimensions.get('window');
// const scale = (size: number) => (width / 375) * size;

// type CollectionOfficersListNavigationProps = StackNavigationProp<RootStackParamList, 'CollectionOfficersList'>;

// interface CollectionOfficersListProps {
//   navigation: CollectionOfficersListNavigationProps;
// }

// interface Officer {
//   empId: string;
//   fullName: string;
//   phoneNumber1: string;
//   phoneNumber2: string;
//   collectionOfficerId: number;
// }

// const CollectionOfficersList: React.FC<CollectionOfficersListProps> = ({ navigation }) => {
//   const [officers, setOfficers] = useState<Officer[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [showMenu, setShowMenu] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   useFocusEffect(
//     React.useCallback(() => {
//       setShowMenu(false);
//     }
//     , [])
//   );

//   const fetchOfficers = async () => {
//     try {
//       setLoading(true);
//       setErrorMessage(null);

//       const token = await AsyncStorage.getItem('token');
//       const response = await axios.get(
//         `${environment.API_BASE_URL}api/collection-manager/collection-officers`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.data.status === 'success') {
//         setOfficers(response.data.data);
//       } else {
//         setErrorMessage('Failed to fetch officers.');
//       }
//     } catch (error: any) {
//       if (error.response?.status === 404) {
//         setErrorMessage('No officers available.');
//       } else {
//         setErrorMessage('An error occurred while fetching officers.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await fetchOfficers();
//     setRefreshing(false);
//   };

//   useFocusEffect(
//     React.useCallback(() => {
//       fetchOfficers();
//     }, [])
//   );

//   const renderOfficer = ({ item }: { item: Officer }) => (
//     <TouchableOpacity
//       className="flex-row items-center p-4 mb-3 rounded-[35px] bg-gray-100 shadow-sm mx-4"
//       onPress={() =>
//         navigation.navigate('OfficerSummary' as any, {
//           officerId: item.empId,
//           officerName: item.fullName,
//           phoneNumber1: item.phoneNumber1,
//           phoneNumber2: item.phoneNumber2,
//           collectionOfficerId: item.collectionOfficerId,
//         })
//       }
//     >
//       <View className="w-14 h-14 rounded-full overflow-hidden justify-center items-center mr-4 shadow-md">
//         <Image
//           source={require('../../assets/images/ava.webp')}
//           className="w-full h-full"
//           resizeMode="cover"
//         />
//       </View>

//       <View className="flex-1">
//         <Text className="text-[18px] font-semibold text-gray-900">{item.fullName}</Text>
//         <Text className="text-sm text-gray-500">EMP ID : {item.empId}</Text>
//       </View>

//       <Ionicons name="chevron-forward" size={scale(20)} color="#9CA3AF" />
//     </TouchableOpacity>
//   );

//   return (
//     <View className="flex-1 bg-[#2AAD7A]">
//       <View className="bg-[#2AAD7A] py-6 px-4  relative">
//         <Text style={{ fontSize: 18 }} className="text-white text-center font-bold">
//           Collection Officers
//         </Text>

//         <TouchableOpacity className="absolute top-6 right-4" onPress={() => setShowMenu((prev) => !prev)}>
//           <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
//         </TouchableOpacity>

//         {showMenu && (
//           <View className="absolute top-14 right-4 bg-white shadow-lg rounded-lg">
//             <TouchableOpacity className="px-4 py-2 bg-white rounded-lg shadow-lg" onPress={() => navigation.navigate('ClaimOfficer')}>
//               <Text className="text-gray-700 font-semibold">Claim Officer</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>

//       <View className="flex-1  mt-3 rounded-t-2xl bg-white">
//         <View className='mt-4 px-4'>
//         <Text style={{ fontSize: scale(16) }} className="font-bold text-[#21202B] mb-2">
//           Officers List <Text className="text-[#21202B] font-semibold">(All {officers.length})</Text>

//         </Text>
//         </View>

//       {loading ? (
//         // Lottie Loader for 4 seconds
//         <View className="flex-1 justify-center items-center">
//           <LottieView
//             source={require('../../assets/lottie/collector.json')} // Ensure JSON file is correct
//             autoPlay
//             loop
//             style={{ width: 350, height: 350 }}
//           />
//         </View>
//       ) : errorMessage ? (
//         <View className="flex-1 justify-center items-center">
//           <Text className="text-gray-500 text-lg">{errorMessage}</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={officers}
//           keyExtractor={(item) => item.empId}
//           renderItem={renderOfficer}
//           contentContainerStyle={{
//             paddingBottom: scale(80),
//             paddingTop: scale(10),
//           }}
//           refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ADADAD1A" colors={['#ADADAD1A']}/>}
//           showsVerticalScrollIndicator={true}

//         />
//       )}

//       <TouchableOpacity
//       onPress={async () => {
//         try {
//           await AsyncStorage.removeItem('officerFormData'); // Clear stored data
//           navigation.navigate('AddOfficerBasicDetails' as any)
//         } catch (error) {
//           console.error("Error clearing form data:", error);
//         }
//       }}
//         className="absolute bottom-5 right-5 bg-black w-14 h-14 rounded-full justify-center items-center shadow-lg"

//       >
//         <Ionicons name="add" size={scale(24)} color="#fff" />
//       </TouchableOpacity>

//       </View>

//     </View>
//   );
// };

// export default CollectionOfficersList;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import axios from "axios";
import environment from "@/environment/environment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native"; // Import Lottie for animation
import BottomNav from "../BottomNav";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");
const scale = (size: number) => (width / 375) * size;

type CollectionOfficersListNavigationProps = StackNavigationProp<
  RootStackParamList,
  "CollectionOfficersList"
>;

interface CollectionOfficersListProps {
  navigation: CollectionOfficersListNavigationProps;
}

interface Officer {
  empId: string;
  fullName: string;
  phoneNumber1: string;
  phoneNumber2: string;
  collectionOfficerId: number;
  status: string;
  image: string;
}

const CollectionOfficersList: React.FC<CollectionOfficersListProps> = ({
  navigation,
}) => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();

  useFocusEffect(
    React.useCallback(() => {
      setShowMenu(false);
    }, [])
  );

  // const fetchOfficers = async () => {
  //   try {
  //     setLoading(true);
  //     setErrorMessage(null);

  //     const token = await AsyncStorage.getItem('token');
  //     const response = await axios.get(
  //       `${environment.API_BASE_URL}api/collection-manager/collection-officers`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.data.status === 'success') {
  //       setOfficers(response.data.data);
  //     } else {
  //       setErrorMessage('Failed to fetch officers.');
  //     }
  //   } catch (error: any) {
  //     if (error.response?.status === 404) {
  //       setErrorMessage('No officers available.');
  //     } else {
  //       setErrorMessage('An error occurred while fetching officers.');
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchOfficers = async () => {
  //   try {
  //     setLoading(true);
  //     setErrorMessage(null);
  
  //     const token = await AsyncStorage.getItem('token');
  //     const response = await axios.get(
  //       `${environment.API_BASE_URL}api/collection-manager/collection-officers`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  
  //     if (response.data.status === 'success') {
  //       console.log("Backend status:", response.data.status); // Log the status field
      
  //       console.log("Raw officer data from backend:", response.data.data); // Log officer list
  //       // Sort officers alphabetically by fullName (A-Z)
  //       const sortedOfficers = response.data.data.sort((a: Officer, b: Officer) =>
  //         a.fullName.localeCompare(b.fullName)
  //       );
  
  //       setOfficers(sortedOfficers);
  //     } else {
  //       setErrorMessage('Failed to fetch officers.');
  //     }
  //   } catch (error: any) {
  //     if (error.response?.status === 404) {
  //       setErrorMessage('No officers available.');
  //     } else {
  //       setErrorMessage('An error occurred while fetching officers.');
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchOfficers = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${environment.API_BASE_URL}api/collection-manager/collection-officers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.status === 'success') {
        // Separate approved and not approved officers
        const approvedOfficers = response.data.data.filter((officer: Officer) => officer.status === 'Approved');
        const notApprovedOfficers = response.data.data.filter((officer: Officer) => officer.status === 'Not Approved');
        
        // Sort both lists alphabetically
        const sortedApprovedOfficers = approvedOfficers.sort((a: Officer, b: Officer) =>
          a.fullName.localeCompare(b.fullName)
        );
        const sortedNotApprovedOfficers = notApprovedOfficers.sort((a: Officer, b: Officer) =>
          a.fullName.localeCompare(b.fullName)
        );
  
        // Combine the sorted lists: approved officers first, then not approved
        setOfficers([...sortedApprovedOfficers, ...sortedNotApprovedOfficers]);
      } else {
        setErrorMessage(t("Error.Failed to fetch officers."));
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setErrorMessage(t("Error.No officers available."));
      } else {
         setErrorMessage(t("Error.An error occurred while fetching officers."));
      }
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  // const onRefresh = async () => {
  //   setRefreshing(true);
  //   await fetchOfficers();
  //   setRefreshing(false);
  // };

  useFocusEffect(
    React.useCallback(() => {
      fetchOfficers();
    }, [])
  );

  // const fetchOfficers = async () => {
  //   try {
  //     setLoading(true);
  //     setErrorMessage(null);

  //     const token = await AsyncStorage.getItem('token');
  //     const response = await axios.get(
  //       `${environment.API_BASE_URL}api/collection-manager/collection-officers`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.data.status === 'success') {
  //       console.log("Raw officer data from backend:", response.data.data); // Log all officer data

  //       // Check if the status field exists for each officer
  //       response.data.data.forEach((officer: Officer) => {
  //         console.log(`Officer: ${officer.fullName}, Status: ${officer.status}`);
  //       });

  //       const sortedOfficers = response.data.data.sort((a: Officer, b: Officer) =>
  //         a.fullName.localeCompare(b.fullName)
  //       );

  //       setOfficers(sortedOfficers);
  //     } else {
  //       setErrorMessage('Failed to fetch officers.');
  //     }
  //   } catch (error: any) {
  //     console.error("Error fetching officers:", error);
  //     setErrorMessage('An error occurred while fetching officers.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOfficers();
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchOfficers();
    }, [])
  );

  // const renderOfficer = ({ item }: { item: Officer }) => (
  //   <TouchableOpacity
  //     className="flex-row items-center p-4 mb-3 rounded-[35px] bg-gray-100 shadow-sm mx-4"
  //     onPress={() =>
  //       navigation.navigate('OfficerSummary' as any, {
  //         officerId: item.empId,
  //         officerName: item.fullName,
  //         phoneNumber1: item.phoneNumber1,
  //         phoneNumber2: item.phoneNumber2,
  //         collectionOfficerId: item.collectionOfficerId,
  //       })
  //     }
  //   >
  //     <View className="w-14 h-14 rounded-full overflow-hidden justify-center items-center mr-4 shadow-md">
  //       <Image
  //         source={require('../../assets/images/ava.webp')}
  //         className="w-full h-full"
  //         resizeMode="cover"
  //       />
  //     </View>

  //     <View className="flex-1">
  //       <Text className="text-[18px] font-semibold text-gray-900">{item.fullName}</Text>
  //       <Text className="text-sm text-gray-500">EMP ID : {item.empId}</Text>
  //     </View>

  //     <Ionicons name="chevron-forward" size={scale(20)} color="#9CA3AF" />
  //   </TouchableOpacity>

  // const renderOfficer = ({ item }: { item: Officer & { status?: string } }) => (
  //   <TouchableOpacity
  //     className={`flex-row items-center p-4 mb-3 rounded-[35px] shadow-sm mx-4 ${
  //       item.status === "Not Approved" ? "border border-red-500 bg-red-50" : "bg-gray-100"
  //     }`}
  //     onPress={() =>
  //       navigation.navigate('OfficerSummary' as any, {
  //         officerId: item.empId,
  //         officerName: item.fullName,
  //         phoneNumber1: item.phoneNumber1,
  //         phoneNumber2: item.phoneNumber2,
  //         collectionOfficerId: item.collectionOfficerId,
  //       })
  //     }
  //   >
  //     <View className="w-14 h-14 rounded-full overflow-hidden justify-center items-center mr-4 shadow-md">
  //       <Image
  //         source={require('../../assets/images/ava.webp')}
  //         className="w-full h-full"
  //         resizeMode="cover"
  //       />
  //     </View>

  //     <View className="flex-1">
  //       <Text className="text-[18px] font-semibold text-gray-900">{item.fullName}</Text>
  //       <Text className="text-sm text-gray-500">EMP ID : {item.empId}</Text>
  //     </View>

  //     {item.status === "Not Approved" && (
  //       <Text className="text-red-500 text-xs font-semibold mr-2">Not Approved</Text>
  //     )}

  //     <Ionicons name="chevron-forward" size={scale(20)} color="#9CA3AF" />
  //   </TouchableOpacity>
  // );

  // const renderOfficer = ({ item }: { item: Officer & { status?: string } }) => (
  //   <TouchableOpacity
  //     className={`flex-row items-center p-4 mb-3 rounded-[35px] shadow-sm mx-4 ${
  //       item.status === "Not Approved" ? "bg-gray-100" : "bg-gray-100"
  //     }`}
  //     onPress={() => {
  //       // Prevent navigation if officer status is "Not Approved"
  //       if (item.status !== "Not Approved") {
  //         navigation.navigate('OfficerSummary' as any, {
  //           officerId: item.empId,
  //           officerName: item.fullName,
  //           phoneNumber1: item.phoneNumber1,
  //           phoneNumber2: item.phoneNumber2,
  //           collectionOfficerId: item.collectionOfficerId,
  //         });
  //       }
  //     }}
  //     disabled={item.status === "Not Approved"} // Disable the TouchableOpacity when status is "Not Approved"
  //   >
  //     <View className="w-14 h-14 rounded-full overflow-hidden justify-center items-center mr-4 shadow-md">
  //       <Image
  //         source={require('../../assets/images/ava.webp')}
  //         className="w-full h-full"
  //         resizeMode="cover"
  //       />
  //     </View>

  //     <View className="flex-1">
  //       <Text className="text-[18px] font-semibold text-gray-900">{item.fullName}</Text>
  //       <Text className="text-sm text-gray-500">EMP ID : {item.empId}</Text>
  //     </View>
  
  //     {item.status === "Not Approved" && (
  //       <Text className="text-red-500 text-xs font-semibold mr-2 mt-[-12%]">Not Approved</Text>
  //     )}
  
  //     {/* Conditionally render the chevron icon based on the officer's status */}
  //     {item.status !== "Not Approved" && (
  //       <Ionicons name="chevron-forward" size={scale(20)} color="#9CA3AF" />
  //     )}
  //   </TouchableOpacity>
  // );
  
  // // Handling the button for adding new officers
  // <TouchableOpacity
  //   onPress={async () => {
  //     try {
  //       await AsyncStorage.removeItem('officerFormData'); // Clear stored data
  //       navigation.navigate('AddOfficerBasicDetails' as any);
  //     } catch (error) {
  //       console.error("Error clearing form data:", error);
  //     }
  //   }}
  //   className="absolute bottom-5 right-5 bg-black w-14 h-14 rounded-full justify-center items-center shadow-lg"
  // >
  //   <Ionicons name="add" size={scale(24)} color="#fff" />
  // </TouchableOpacity>

  const renderOfficer = ({ item }: { item: Officer & { status?: string } }) => (
    <TouchableOpacity
      className={`flex-row items-center p-4 mb-3 rounded-[35px] shadow-sm mx-4 ${
        item.status === "Not Approved" ? "bg-gray-100" : "bg-gray-100"
      }`}
      onPress={() => {
        // Prevent navigation if officer status is "Not Approved"
        if (item.status !== "Not Approved") {
          navigation.navigate("OfficerSummary" as any, {
            officerId: item.empId,
            officerName: item.fullName,
            phoneNumber1: item.phoneNumber1,
            phoneNumber2: item.phoneNumber2,
            collectionOfficerId: item.collectionOfficerId,
            image: item.image
          });
        }
      }}
      disabled={item.status === "Not Approved"} // Disable the TouchableOpacity when status is "Not Approved"
    >
      <View className="w-14 h-14 rounded-full overflow-hidden justify-center items-center mr-4 shadow-md">
        {/* <Image
          source={require('../../assets/images/ava.webp')}
          className="w-full h-full"
          resizeMode="cover"
        /> */}
        <Image
          source={
            item.image
              ? { uri: item.image }
              : require("../../assets/images/ava.webp")
          }
          className="w-16 h-16 rounded-full mr-3"
        />
      </View>

      <View className="flex-1">
        <Text className="text-[18px] font-semibold text-gray-900">
          {item.fullName}
        </Text>
        <Text className="text-sm text-gray-500">EMP ID : {item.empId}</Text>
      </View>

      {item.status === "Not Approved" && (
        <Text className="text-red-500 text-xs font-semibold mr-2 mt-[-12%]">
          Not Approved
        </Text>
      )}

      {/* Conditionally render the chevron icon based on the officer's status */}
      {item.status !== "Not Approved" && (
        <Ionicons name="chevron-forward" size={scale(20)} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  // Handling the button for adding new officers
  <TouchableOpacity
    onPress={async () => {
      try {
        await AsyncStorage.removeItem("officerFormData"); // Clear stored data
        navigation.navigate("AddOfficerBasicDetails" as any);
      } catch (error) {
        console.error("Error clearing form data:", error);
      }
    }}
    className="absolute bottom-5 right-5 bg-black w-14 h-14 rounded-full justify-center items-center shadow-lg"
  >
    <Ionicons name="add" size={scale(24)} color="#fff" />
  </TouchableOpacity>;

  return (
    <View className="flex-1 bg-[#2AAD7A]">
      <View className="bg-[#2AAD7A] py-6 px-4  relative">
        <Text style={{ fontSize: 18 }} className="text-white text-center font-bold">
         {t("CollectionOfficersList.Collection Officers")}
        </Text>

        <TouchableOpacity
          className="absolute top-6 right-4"
          onPress={() => setShowMenu((prev) => !prev)}
        >
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>

        {showMenu && (
          <View className="absolute top-14 right-4 bg-white shadow-lg rounded-lg">
            <TouchableOpacity className="px-4 py-2 bg-white rounded-lg shadow-lg" onPress={() => navigation.navigate('ClaimOfficer')}>
              <Text className="text-gray-700 font-semibold">{t("CollectionOfficersList.Claim Officer")}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View className="flex-1  mt-3 rounded-t-2xl bg-white">
        <View className='mt-4 px-4'>
        <Text style={{ fontSize: scale(16) }} className="font-bold text-[#21202B] mb-2">
        {t("CollectionOfficersList.Officers List")} <Text className="text-[#21202B] font-semibold">(All {officers.length})</Text>
         
        </Text>
        </View>

        {loading ? (
          // Lottie Loader for 4 seconds
          <View className="flex-1 justify-center items-center">
            <LottieView
              source={require("../../assets/lottie/collector.json")} // Ensure JSON file is correct
              autoPlay
              loop
              style={{ width: 350, height: 350 }}
            />
          </View>
        ) : errorMessage ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-lg">{errorMessage}</Text>
          </View>
        ) : (
          <FlatList
            data={officers}
            keyExtractor={(item) => item.empId}
            renderItem={renderOfficer}
            contentContainerStyle={{
              paddingBottom: scale(80),
              paddingTop: scale(10),
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#ADADAD1A"
                colors={["#ADADAD1A"]}
              />
            }
            showsVerticalScrollIndicator={true}
          />
        )}

        <TouchableOpacity
          onPress={async () => {
            try {
              await AsyncStorage.removeItem("officerFormData"); // Clear stored data
              navigation.navigate("AddOfficerBasicDetails" as any);
            } catch (error) {
              console.error("Error clearing form data:", error);
            }
          }}
          className="absolute bottom-5 right-5 bg-black w-14 h-14 rounded-full justify-center items-center shadow-lg"
        >
          <Ionicons name="add" size={scale(24)} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CollectionOfficersList;
