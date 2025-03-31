import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  Modal
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import { environment } from '@/environment/environment';
import { useTranslation } from "react-i18next";
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CropItemsScrollView from '../Driver screens/CropItemsScrollView';

type ViewScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ViewScreen"
>;

interface ViewScreenProps {
  navigation: ViewScreenNavigationProp;
  route: {
    params: {
      requestId: number;
    };
  };
}

const ViewScreen: React.FC<ViewScreenProps> = ({ navigation, route }) => {
    const { t } = useTranslation();
    const [requestId, setRequestId] = useState(route.params?.requestId || "12403020001");
    const [crop, setCrop] = useState("Carrot");
    const [variety, setVariety] = useState("New Kuroda");
    const [loadWeight, setLoadWeight] = useState("2");
    const [scheduled, setScheduled] = useState("");
    const [driverName, setDriverName] = useState("Ravin Dilshan, Chalana Herath");
    const [driverId, setDriverId] = useState("DVR00001, DVR00002");
    const [scheduleDate, setScheduleDate] = useState("");
    const [buildingNo, setBuildingNo] = useState("");
    const [streetName, setStreetName] = useState("");
    const [city, setCity] = useState("");
    const [requestStatus , SetRequestStatus] = useState("");
    const [routeNumber, setRouteNumber] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isScheduled, setIsScheduled] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<Array<{
      itemId: number;
      cropName: string;
      cropId: number;
      varietyName: string;
      varietyId: number;
      loadWeight: number;
      crop?: string;
      variety?: string;
    }>>([]);
    
    // Change these to use number keys instead of string keys
    const [crops, setCrops] = useState<Record<number, string>>({});
    const [varieties, setVarieties] = useState<Record<number, string>>({});
    const [alertVisible, setAlertVisible] = useState(false);
    const [cancellationReason, setCancellationReason] = useState("");
const [cancelledBy, setCancelledBy] = useState("");
  
    // Determine if fields should be editable based on status
    const isEditable = scheduled === "Scheduled" || requestStatus === "Not Assigned" ;
    
    // Determine which buttons to show based on status
   // const showUpdateButton = scheduled === "Scheduled" || scheduled === "On way" || scheduled === "Collected" || scheduled === "Cancelled";
   const showUpdateButton = scheduled === "Scheduled" || requestStatus === "Not Assigned";
    const showCancelButton = scheduled === "Scheduled" || scheduled === "On way"|| requestStatus === "Not Assigned";
  
    const handleDateChange = (event: any, selectedDate?: Date) => {
      setShowDatePicker(false);
      if (selectedDate) {
        const formattedDate = `${selectedDate.getFullYear()}/${String(selectedDate.getMonth() + 1).padStart(2, '0')}/${String(selectedDate.getDate()).padStart(2, '0')}`;
        setScheduleDate(formattedDate);
      }
    };
  
    useEffect(() => {
      const fetchData = async () => {
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
    
          const url = `${environment.API_BASE_URL}api/collectionrequest/view-details/${requestId}`;
          console.log("Fetching URL:", url);
    
          const response = await fetch(url, {
            method: 'GET',
            headers: headers,
          });
    
          if (!response.ok) {
            console.error("Response not OK:", response.status, response.statusText);
            const errorText = await response.text();
            console.log("Error response:", errorText);
            setError(`Server returned ${response.status}: ${response.statusText}`);
            return;
          }
    
          const textResponse = await response.text();
          console.log("Raw response:", textResponse);
    
          try {
            const jsonData = JSON.parse(textResponse);
            console.log("Parsed JSON:", jsonData);
    
            if (jsonData.success) {
              const responseData = jsonData.data;
              
              // Set state with the fetched data
              setRequestId(responseData.id.toString());
              
              // Handle multiple items if they exist
              if (responseData.items && responseData.items.length > 0) {
                setItems(responseData.items);
                
                // Create mapping of crop IDs to crop Name
                const cropMapping: Record<number, string> = {};
                const varietyMapping: Record<number, string> = {};
                
                responseData.items.forEach((item: any) => {
                  cropMapping[item.cropId] = item.cropName || `Crop ${item.cropId}`;
                  varietyMapping[item.varietyId] = item.varietyName || `Variety ${item.varietyId}`;
                });
                
                setCrops(cropMapping);
                setVarieties(varietyMapping);
              }
              console.log("jjjjjjj")
              setScheduleDate(new Date(responseData.scheduleDate).toISOString().split('T')[0]);
              setRouteNumber(responseData.route);
              setScheduled(responseData.assignedStatus);
              SetRequestStatus(responseData.requestStatus)
              setBuildingNo(responseData.houseNo);
              setStreetName(responseData.streetName);
              setCity(responseData.city);

              if (responseData.assignedStatus === "Cancelled" ) {
                setCancellationReason(responseData.cancelReason || "");
                setCancelledBy(responseData.cancelledBy || "You");
              }
              
            }
          } catch (parseError: unknown) {
            console.error("JSON parse error:", parseError);
            if (parseError instanceof Error) {
              setError('Error parsing response: ' + parseError.message);
            } else {
              setError('Error parsing response: Unknown error');
            }
          }
        } catch (error: unknown) {
          console.error("Fetch error:", error);
          if (error instanceof Error) {
            setError('Error fetching data: ' + error.message);
          } else {
            setError('Error fetching data: Unknown error');
          }
        } finally {
          setLoading(false);
        }
      };
    
      fetchData();
    }, [requestId]);


    
    
    const getStatusBackgroundColor = (status: string) => {
      switch (status) {
        case 'On way':
          return '#F8FFA6'; 
        case 'Collected':
          return '#C8E0FF'; 
        case 'Cancelled':
          return '#FFB9B7'; 
        case 'Scheduled':
          return '#CFCFCF'; 
        case 'Not Assigned':
            return '#CCEAE5'
        default:
          return '#E0E0E0'; 
      }
    };
  
    const handleItemUpdate = (updatedItem: any) => {
      setItems(currentItems => 
        currentItems.map(item => 
          item.itemId === updatedItem.itemId ? updatedItem : item
        )
      );
    };
  
    
     const handleUpdate = () => {
        console.log("Updating request:", requestId);
        setAlertVisible(false);
      };
    
      const handleConfirm = () => {
        
        console.log("Confirmed update for request:", requestId);
        navigation.navigate("Cancelreson" as any, {
            requestId: requestId,
            status: scheduled,
       
          });
        setAlertVisible(false);
        
      };
    
      const handleCancel = () => {
        setAlertVisible(true);
      };
      const handleCancelConfim = () => {
        setAlertVisible(false);
      }
  
    return (
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView className="flex-1 bg-white">
            {/* Header with back button and ID */}
            <View className="flex-row px-4 py-4 border-b border-white">
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <AntDesign name="left" size={24} color="black" />
              </TouchableOpacity>
              <View className="flex-1 items-center justify-center">
                <Text className="text-base font-medium">ID : {requestId}</Text>
              </View>
            </View>
  
            {/* Form Content */}
            <View className="px-4 py-2">
              {items.length > 0 ? (
                <CropItemsScrollView 
                  items={items} 
                  crops={crops} 
                  varieties={varieties}
                  onItemUpdate={handleItemUpdate} 
                />
              ) : (
                // Fallback for when there are no items
                <>
                  <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-1">Crop</Text>
                    <TextInput
                      className="border border-gray-300 rounded px-3 py-2 text-base"
                      value={crop}
                      onChangeText={setCrop}
                      editable={isEditable}
                    />
                  </View>
  
                  <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-1">Variety</Text>
                    <TextInput
                      className="border border-gray-300 rounded px-3 py-2 text-base"
                      value={variety}
                      onChangeText={setVariety}
                      editable={isEditable}
                    />
                  </View>
  
                  <View className="mb-4">
                    <Text className="text-sm text-gray-600 mb-1">Load in kg (Approx)</Text>
                    <TextInput
                      className="border border-gray-300 rounded px-3 py-2 text-base"
                      value={loadWeight}
                      onChangeText={setLoadWeight}
                      keyboardType="numeric"
                      editable={isEditable}
                    />
                  </View>
                </>
              )}
  
             
            
              <View className="flex-row justify-center mb-4 items-center">
  <View
    className="px-4 py-1 rounded"
    style={{
      backgroundColor: getStatusBackgroundColor(
        requestStatus === "Not Assigned" ? requestStatus : scheduled
      ),
    }}
  >
    <Text className="text-gray-700 text-sm">
      {requestStatus === "Not Assigned" ? requestStatus : scheduled}
    </Text>
  </View>
</View>

{(scheduled === "Cancelled" || requestStatus === "Cancelled") && (
  <View className="mb-4   rounded-md p-3">
    <Text className="text-sm text-black mb-1 text-center">Reason to Cancel :</Text>
    <View className="border border-red-300 rounded-md p-2 ">
      <Text className="text-red-500 text-center">
        {cancellationReason || "The Farmer called and requested to cancel"}
      </Text>
    </View>
    <Text className="text-sm text-gray-500 text-center mt-1">
      Canceled by : {cancelledBy}
    </Text>
  </View>
)}
  
              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-1">Driver Name</Text>
                <View className="flex-row items-center">
                  <TextInput
                    className="border border-gray-300 rounded px-3 py-2 text-base flex-1"
                    value={driverName}
                    onChangeText={setDriverName}
                    editable={isEditable}
                  />
                  {isEditable && (
                    <TouchableOpacity className="ml-2">
                      <FontAwesome name="pencil" size={20} color="green" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
  
              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-1">Driver ID</Text>
                <TextInput
                  className="border border-gray-300 rounded px-3 py-2 text-base"
                  value={driverId}
                  onChangeText={setDriverId}
                  editable={isEditable}
                />
              </View>
  
              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-1">Schedule Date</Text>
                <View className="flex-row items-center">
                  <TextInput
                    className="border border-gray-300 rounded px-3 py-2 text-base flex-1"
                    value={scheduleDate}
                    onChangeText={setScheduleDate}
                    editable={isEditable}
                  />
                  {isEditable && (
                    <TouchableOpacity
                      className="ml-2"
                      onPress={() => setShowDatePicker(true)}
                    >
                      <FontAwesome name="calendar" size={20} color="gray" />
                    </TouchableOpacity>
                  )}
               
                {showDatePicker && (
                  <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
                 </View>
              </View>
  
              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-1">Building / House No</Text>
                <TextInput
                  className="border border-gray-300 rounded px-3 py-2 text-base"
                  value={buildingNo}
                  onChangeText={setBuildingNo}
                  editable={isEditable}
                />
              </View>
  
              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-1">Street Name</Text>
                <TextInput
                  className="border border-gray-300 rounded px-3 py-2 text-base"
                  value={streetName}
                  onChangeText={setStreetName}
                  editable={isEditable}
                />
              </View>
  
              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-1">City</Text>
                <TextInput
                  className="border border-gray-300 rounded px-3 py-2 text-base"
                  value={city}
                  onChangeText={setCity}
                  editable={isEditable}
                />
              </View>
  
              <View className="mb-4">
                <Text className="text-sm text-gray-600 mb-1">Route Number</Text>
                <TextInput
                  className="border border-gray-300 rounded px-3 py-2 text-base"
                  value={routeNumber}
                  onChangeText={setRouteNumber}
                  editable={isEditable}
                />
              </View>
  
         {/*Action Button*/}
              <View className="mt-4 mb-8">
                {showUpdateButton && (
                  <TouchableOpacity
                    className="bg-[#2AAD7A] rounded-full py-3 items-center mb-3"
                    onPress={handleUpdate}
                  >
                    <Text className="text-white text-base">Update</Text>
                  </TouchableOpacity>
                )}
  
                {showCancelButton && (
                  <TouchableOpacity
                    className="bg-[#E14242] rounded-full py-3 items-center"
                    onPress={handleCancel}
                  >
                    <Text className="text-white text-base">Cancel Request</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Modal
  transparent={true}
  visible={alertVisible}  
  animationType="fade"
  onRequestClose={handleCancel}  
>
  <View className="flex-1 justify-center items-center bg-black/50">
    <View className="bg-white rounded-lg w-4/5 p-5">
      <Text className="text-center text-lg font-medium mb-2">Are you sure?</Text>
      <Text className="text-center text-gray-600 mb-6">This will permanently delete the
request placed by farmer and cannot be undone.
</Text>
      
      <TouchableOpacity 
        className="bg-black rounded-full py-3 mb-3" 
        onPress={handleConfirm}  
      >
        <Text className="text-white text-center font-medium">Confirm</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        className="bg-gray-200 rounded-full py-3" 
        onPress={handleCancelConfim}  
      >
        <Text className="text-gray-700 text-center">Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  };
  
  export default ViewScreen;