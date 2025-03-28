// import React, { useState, useEffect, useCallback } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   Alert,
//   ScrollView,
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform
// } from "react-native";
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import axios from "axios";
// import { StackNavigationProp } from "@react-navigation/stack";
//  import { RootStackParamList } from "../types"; // Ensure this file exists
// import {environment }from '@/environment/environment';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";
// import AntDesign from "react-native-vector-icons/AntDesign";
// import { useFocusEffect } from "expo-router";
// import { useTranslation } from "react-i18next";

// type CollectionRequestsNavigationProp = StackNavigationProp<
//   RootStackParamList,
//   "CollectionRequests"
// >;

// interface CollectionRequestsProps {
//   navigation: CollectionRequestsNavigationProp;
// }

// const CollectionRequests: React.FC<CollectionRequestsProps> = ({ navigation }) => {
//     return (
//         <View>
//           <Text>Collection Requests Screen</Text>
//         </View>
//       );

// }

// export default CollectionRequests;

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Image,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import axios from "axios";
import {environment }from '@/environment/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';


type NotAssignedRequest = {
    id: number;
    name: string;
    route: string;
    farmerId: number;  // Assuming this is part of your response data
    cropId: number;    // Assuming this is part of your response data
    
  };
  
  type AssignedRequest = {
    id: number;
    name: string;
    route: string;
    status: 'Collected' | 'On way' | 'Cancelled';
    farmerId: number;  // Assuming this is part of your response data
    cropId: number;    // Assuming this is part of your response data
    assignedStatus: string;
  };
  
  type CollectionRequestsNavigationProp = StackNavigationProp<
    RootStackParamList,
    "CollectionRequests"
  >;
  
  interface CollectionRequestsProps {
    navigation: CollectionRequestsNavigationProp;
  }
  
  const CollectionRequests: React.FC<CollectionRequestsProps> = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState<'Not Assigned' | 'Assigned'>('Not Assigned');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    const [notAssignedRequests, setNotAssignedRequests] = useState<NotAssignedRequest[]>([]);
    const [assignedRequests, setAssignedRequests] = useState<AssignedRequest[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<(NotAssignedRequest | AssignedRequest)[]>([]);
  
    // Helper function to get name
    const getName = (name: string) => {
      return ` ${name}`; // Placeholder logic
    };
  
    // Helper function to get route
    const getRoute = (route: string) => {
      return `Route  ${route}`; // Placeholder logic
    };
  
    useFocusEffect(
        useCallback(() => {
        //   const fetchCollectionRequests = async () => {
        //     try {
        //       const token = await AsyncStorage.getItem("token");
        //       if (!token) {
        //         Alert.alert('Error', 'Authentication token not found');
        //         return;
        //       }
  
        //       const headers = {
        //         'Authorization': `Bearer ${token}`,
        //         'Content-Type': 'application/json',
        //       };
  
        //       // Ensure leading slash and handle parameters carefully
        //       const queryParams = new URLSearchParams();
        //       queryParams.append('status', activeTab);
        //       if (selectedFilter) {
        //         queryParams.append('assignedStatus', selectedFilter);
        //       }
  
        //       const fullUrl = `${environment.API_BASE_URL}api/collectionrequest/all-collectionrequest?${queryParams.toString()}`;
        //       console.log('Request URL:', fullUrl);
  
        //       try {
        //         const response = await axios.get(fullUrl, { headers });
  
        //         const data = response.data;
        //         console.log('Received Data:', data);
  
        //         if (activeTab === 'Not Assigned') {
        //           setNotAssignedRequests(data);
        //           setFilteredRequests(data);
        //         } else {
        //           setAssignedRequests(data);
        //           setFilteredRequests(
        //             selectedFilter
        //               ? data.filter((req: AssignedRequest) => req.status === selectedFilter)
        //               : data
        //           );
        //         }
        //       } catch (error: unknown) {
        //         // Detailed error logging
        //         if (axios.isAxiosError(error)) {
        //           console.error('Axios Error Details:', {
        //             status: error.response?.status,
        //             data: error.response?.data,
        //             headers: error.response?.headers
        //           });
  
        //           if (error.response) {
        //             Alert.alert('Error', error.response.data.message || 'Failed to fetch collection requests');
        //           } else if (error.request) {
        //             Alert.alert('Error', 'No response received from server');
        //           } else {
        //             Alert.alert('Error', 'Error setting up the request');
        //           }
        //         } else if (error instanceof Error) {
        //           Alert.alert('Error', error.message);
        //         } else {
        //           Alert.alert('Error', 'An unexpected error occurred');
        //         }
        //         console.error('Fetch Collection Requests Error:', error);
        //       }
        //     } catch (error: unknown) {
        //       if (error instanceof Error) {
        //         Alert.alert('Error', error.message);
        //       } else {
        //         Alert.alert('Error', 'An unexpected error occurred');
        //       }
        //       console.error('Unexpected Error:', error);
        //     }
        //   };
        const fetchCollectionRequests = async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              if (!token) {
                Alert.alert('Error', 'Authentication token not found');
                return;
              }
          
              const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              };
          
              // Build query params based on activeTab and selectedFilter
              const queryParams = new URLSearchParams();
              queryParams.append('status', activeTab);
              if (selectedFilter) {
                queryParams.append('assignedStatus', selectedFilter); // Apply the selected filter
              }
          
              const fullUrl = `${environment.API_BASE_URL}api/collectionrequest/all-collectionrequest?${queryParams.toString()}`;
              console.log('Request URL:', fullUrl);
          
              const response = await axios.get(fullUrl, { headers });
              const data = response.data;
              console.log('Received Data:', data);
          
              if (activeTab === 'Not Assigned') {
                setNotAssignedRequests(data);
                setFilteredRequests(data);
              } else {
                setAssignedRequests(data);
                // Filter based on the selected status (AssignedRequests)
                setFilteredRequests(
                  selectedFilter ? data.filter((req: AssignedRequest) => req.assignedStatus === selectedFilter) : data
                );
              }
            } catch (error) {
              console.error('Fetch Collection Requests Error:', error);
            }
          };
  
          fetchCollectionRequests();
        }, [activeTab, selectedFilter])
      );
  
    const renderRequestItem = (item: NotAssignedRequest | AssignedRequest) => {
      const name = getName(item.name);
      const route = getRoute(item.route);
  
      return (
        <View key={item.id} className="flex-row justify-between p-4 mb-2 bg-white shadow rounded-lg items-center">
          <View>
            <Text className="font-semibold">{name}</Text>
            <Text className="text-gray-500 text-sm">{route}</Text>
          </View>
          {activeTab === 'Not Assigned' ? (
            <TouchableOpacity className="bg-green-500 px-4 py-2 rounded-full">
              <Text className="text-white">Assign</Text>
            </TouchableOpacity>
          ) : (
            <View 
            className={`px-3 py-2 rounded-lg shadow-md 
              ${(item as AssignedRequest).assignedStatus === 'Collected' ? 'bg-[#C8E0FF]' :
                (item as AssignedRequest).assignedStatus === 'On way' ? 'bg-[#F8FFA6]' :
                (item as AssignedRequest).assignedStatus === 'Cancelled' ? 'bg-[#FFB9B7]' : ''}`}
          >
            <Text 
              className={`${
                (item as AssignedRequest).assignedStatus === 'Collected' ? 'text-[#415CFF]' :
                (item as AssignedRequest).assignedStatus === 'On way' ? 'text-yellow-600' :
                (item as AssignedRequest).assignedStatus === 'Cancelled' ? 'text-red-600' : ''}`}
            >
              {(item as AssignedRequest).assignedStatus}
            </Text>
          </View>
          
          )}
        </View>
      );
    };
  
    return (
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="p-4">
          {/* Navigation Header */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="left" size={24} color="#000" />
            </TouchableOpacity>
            <Text className="flex-1 text-center text-xl font-bold text-black">
              Collection Requests
            </Text>
          </View>
  
          {/* Tab Navigation */}
          <View className="flex-row justify-center mb-4">
            <TouchableOpacity
              className={`px-4 py-2 rounded-full mx-2 border border-[#ADADAD] 
                ${activeTab === 'Not Assigned' ? 'bg-[#2AAD7A]' : 'bg-white'}`}
              onPress={() => { 
                setActiveTab('Not Assigned'); 
                setSelectedFilter(null); 
              }}
            >
              <Text className={`font-semibold 
                ${activeTab === 'Not Assigned' ? 'text-white' : 'text-black'}`}>
                Not Assigned ({notAssignedRequests.length})
              </Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              className={`px-4 py-2 rounded-full mx-2 border border-[#ADADAD] 
                ${activeTab === 'Assigned' ? 'bg-[#2AAD7A]' : 'bg-white'}`}
              onPress={() => setActiveTab('Assigned')}
            >
              <Text className={`font-semibold 
                ${activeTab === 'Assigned' ? 'text-white' : 'text-black'}`}>
                Assigned ({assignedRequests.length})
              </Text>
            </TouchableOpacity>
          </View>
  
          {/* Divider */}
          <View className="h-0.5 bg-[#D2D2D2] mb-4" />
  
          {/* Search Input */}
          <View className="mx-4 flex-row items-center bg-white rounded-full shadow-md px-6 py-1 mb-4 border border-[#ADADAD]">
            <TextInput 
              placeholder="Search route here.." 
              className="flex-1 ml-2 text-gray-600" 
            />
            <Image
              source={require("../../assets/images/Searchicon.webp")}
              className="h-[20px] w-[20px] rounded-lg"
              resizeMode="contain"
            />
          </View>
  
          {/* Assigned Tab Filter */}
          {activeTab === 'Assigned' && (
            <View className="px-2 relative">
              <TouchableOpacity 
                onPress={() => setShowDropdown(!showDropdown)} 
                className="flex-row items-center"
              >
                <Image
                  source={require("../../assets/images/Filter.webp")}
                  className="h-[30px] w-[30px] rounded-lg"
                />
                <Text className="ml-2">{selectedFilter || "All"}</Text>
              </TouchableOpacity>
  
              {showDropdown && (
  <View className="absolute top-full z-50 w-full bg-white border rounded-lg shadow-lg mt-1">
    {['All', 'Collected', 'On way', 'Cancelled'].map((status) => (
      <TouchableOpacity
        key={status}
        onPress={() => {
          setSelectedFilter(status === 'All' ? null : status); // Set filter
          setShowDropdown(false); // Close dropdown
        }}
        className="p-2 border-b"
      >
        <Text>{status}</Text>
      </TouchableOpacity>
    ))}
  </View>
)}

            </View>
          )}
  
          {/* Request List */}
          <ScrollView className="mt-4">
            {filteredRequests.map(renderRequestItem)}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  };

export default CollectionRequests;