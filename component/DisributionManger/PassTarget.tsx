import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { SelectList } from "react-native-dropdown-select-list";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { environment } from "@/environment/environment";
import { useTranslation } from "react-i18next";

// Updated PassTarget component interfaces and implementation:

interface PassTargetProps {
  navigation: any;
  route: {
    params: {
      collectionOfficerId?: number;
      officerId: string;
      selectedItems: number[]; // Array of distributedTargetItemIds
      invoiceNumbers: string[]; // Array of invoice numbers corresponding to selectedItems
      processOrderId: string[];
    };
  };
}

interface TargetItem {
  id: number;
  invoiceNumber: string;
  status: "Pending" | "Opened" | "Completed";
  processOrderId: number;
  distributedTargetItemId: number;
}

interface Officer {
  id: number;
  empId: string;
  firstNameEnglish: string;
  firstNameSinhala: string;
  firstNameTamil: string;
  lastNameEnglish: string;
  lastNameSinhala: string;
  lastNameTamil: string;
  jobRole: string;
}

const PassTarget: React.FC<PassTargetProps> = ({ navigation, route }) => {
  const { officerId, selectedItems: passedSelectedItems = [], invoiceNumbers = [] , processOrderId=[] } = route.params;
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [targetItems, setTargetItems] = useState<TargetItem[]>([]);
  const [officers, setOfficers] = useState<{key: string, value: string}[]>([]);
  const [loadingOfficers, setLoadingOfficers] = useState<boolean>(false);
  const { t } = useTranslation();

  console.log("Passed selectedItems:", passedSelectedItems);
  console.log("Passed invoiceNumbers:", invoiceNumbers);

  // Fetch officers from API
  const fetchOfficers = useCallback(async () => {
    setLoadingOfficers(true);
    try {
      const authToken = await AsyncStorage.getItem("token");
      
      const response = await axios.get(
        `${environment.API_BASE_URL}api/distribution-manager/get-all-distributionOfficer`,
        { 
          headers: { 
            Authorization: `Bearer ${authToken}` 
          } 
        }
      );

      if (response.data.success && response.data.data) {
        // Transform officer data for dropdown
        const officerDropdownData = response.data.data.map((officer: Officer) => ({
          key: officer.id.toString(),
          value: `${officer.firstNameEnglish} ${officer.lastNameEnglish} (${officer.empId})`
        }));
        
        setOfficers(officerDropdownData);
      } else {
        setError(t("Error.Failed to load officers."));
      }
    } catch (error) {
      console.error("Error fetching officers:", error);
      setError(t("Error.Failed to load officers."));
    } finally {
      setLoadingOfficers(false);
    }
  }, [t]);

  // Convert passed selectedItems to display format with correct invoice numbers
  const prepareTargetItems = useCallback(() => {
    if (passedSelectedItems && passedSelectedItems.length > 0) {
      const items: TargetItem[] = passedSelectedItems.map((itemId, index) => ({
        id: index + 1,
        invoiceNumber: invoiceNumbers[index] || `INV${itemId.toString().padStart(6, '0')}`, // Use actual invoice number
        status: "Pending", // Default status since these are selected pending items
        processOrderId: itemId,
        distributedTargetItemId: itemId
      }));
      setTargetItems(items);
    }
  }, [passedSelectedItems, invoiceNumbers]);

  // Initialize target items and fetch officers when component mounts
  useFocusEffect(
    useCallback(() => {
      prepareTargetItems();
      fetchOfficers();
    }, [prepareTargetItems, fetchOfficers])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    prepareTargetItems();
    fetchOfficers();
    setRefreshing(false);
  }, [prepareTargetItems, fetchOfficers]);

  const handleSave = async () => {
    if (!selectedAssignee) {
      setError(t("Error.Please select an assignee."));
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors
    
    try {
      const authToken = await AsyncStorage.getItem("token");
      
      // Prepare data for API call
      const saveData = {
        assigneeOfficerId: selectedAssignee, // This is the selected officer ID from dropdown
        targetItems: passedSelectedItems, // Array of distributedTargetItemIds
        invoiceNumbers: invoiceNumbers, // Send invoice numbers array to API
        processOrderId:processOrderId
      };

      console.log("Saving data:", saveData); // For debugging
      console.log("API URL:", `${environment.API_BASE_URL}api/distribution-manager/target-pass/${officerId}`);

      // API call to assign targets - Using officerId as the route parameter
      const response = await axios.post(
        `${environment.API_BASE_URL}api/distribution-manager/target-pass/${officerId}`,
        saveData,
        { 
          headers: { 
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      console.log("API Response:", response.data);

      if (response.data.success) {
        // Show success message (optional)
        // You can add a success toast here if needed
        
        // Navigate back on successful save
        navigation.goBack();
      } else {
        setError(response.data.message || t("Error.Failed to save data."));
      }
    } catch (error) {
      console.error("Error saving data:", error);
      
      // Enhanced error handling
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          console.log("Error response:", error.response.data);
          const errorMessage = error.response.data?.message || 
                              error.response.data?.error || 
                              `Server error: ${error.response.status}`;
          setError(errorMessage);
        } else if (error.request) {
          // Request was made but no response received
          console.log("No response received:", error.request);
          setError(t("Error.Network error. Please check your connection."));
        } else {
          // Something else happened in setting up the request
          console.log("Request setup error:", error.message);
          setError(error.message || t("Error.Failed to save data."));
        }
      } else if (error instanceof Error) {
        // Generic Error object
        console.log("Generic error:", error.message);
        setError(error.message || t("Error.Failed to save data."));
      } else {
        // Unknown error type
        console.log("Unknown error:", error);
        setError(t("Error.Failed to save data."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-[#2AAD7A] px-4 py-6 flex-row justify-center items-center">
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          className="absolute left-4"
        >
          <AntDesign name="left" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">EMP ID : {officerId}</Text>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Assignee Selection */}
        <View className="bg-white mx-4 my-2 p-4 rounded-lg shadow-sm">
         <Text className="text-[#475A6A] font-semibold mb-2">Select Assignee</Text>

          {loadingOfficers ? (
            <View className="flex-row items-center justify-center py-4">
              <ActivityIndicator size="small" color="#2AAD7A" />
              <Text className="ml-2 text-gray-600">Loading officers...</Text>
            </View>
          ) : (
            <SelectList
              setSelected={setSelectedAssignee}
              data={officers}
              placeholder="--Select an officer--"
              save="key"
              search={true}
              searchPlaceholder="Search officers..."
              boxStyles={{
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 8,
              }}
              inputStyles={{ color: "#374151" }}
              dropdownStyles={{
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 8,
                marginTop: 4,
              }}
            />
          )}
        </View>


      {/* Selected Targets */}
<View className="bg-white  my-2 rounded-lg  mb-20">
  <View className="items-center justify-center">
  <Text style={{ fontStyle: 'italic', color: '#2d3748', marginBottom: 12 }}>
    --Selected Targets--
  </Text>
  </View>
  
  {/* Table */}
  <View className="border border-gray-300 rounded-md ">

    
    
    {/* Table Rows */}
    {targetItems.map((item: TargetItem) => (
      <View 
        key={item.distributedTargetItemId} 
        className="flex-row border-b border-gray-300  px-[-19]"
      >
        <View className="w-16 items-center justify-center border-r border-gray-300 py-3">
          <Text className="text-[#606060] font-medium">{String(item.id).padStart(2, '0')}</Text>
        </View>
        <View className="flex-1 items-center justify-center border-r border-gray-300 py-3">
          <Text className="text-[#000000] font-medium">{item.invoiceNumber}</Text>
        </View>
        <View className="w-36 items-center justify-center py-3">
          <View 
            className={`px-5 py-1 rounded-md ${
              item.status === "Opened" 
                ? "bg-[#F8FFA6]" 
                : item.status === "Completed"
                ? "bg-[#BBFFC6]"
                : "bg-[#FFB9B7]"
            }`}
          >
            <Text 
              className={`text-xs font-medium ${
                item.status === "Opened" 
                  ? "text-[#A8A100]" 
                  : item.status === "Completed"
                  ? "text-[#6AD16D]"
                  : "text-[#D16D6A]"
              }`}
            >
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    ))}
  </View>
</View>
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity 
        onPress={handleSave}
        disabled={loading || !selectedAssignee || loadingOfficers}
        className={`absolute bottom-10 left-4 right-4 py-3 rounded-full items-center shadow-md mr-6 ml-6 ${
          loading || !selectedAssignee || loadingOfficers ? 'bg-white' : 'bg-[#2AAD7A]'
        }`}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold">
            Save 
          </Text>
        )}
      </TouchableOpacity>

      {/* Error Message */}
      {error && (
        <View className="absolute top-20 left-4 right-4 bg-red-100 border border-red-400 px-4 py-3 rounded">
          <Text className="text-red-700 text-center">{error}</Text>
          <TouchableOpacity 
            onPress={() => setError(null)}
            className="mt-2 self-center"
          >
            <Text className="text-red-600 font-medium">Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default PassTarget;