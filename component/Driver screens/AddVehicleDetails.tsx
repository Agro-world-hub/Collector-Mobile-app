import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Platform, RefreshControl } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SelectList } from 'react-native-dropdown-select-list';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import CameraComponent from '@/utils/CamComponentForDrivers';
import axios from 'axios';
import { environment } from '@/environment/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';


type AddressDetails = {
  houseNumber: string;
  streetName: string;
  city: string;
  country: string;
  province: string;
  district: string;
  accountHolderName?: string;
  accountNumber?: string;
  bankName?: string;
  branchName?: string;
};

type AddVehicleDetailsRouteProp = RouteProp<RootStackParamList, 'AddVehicleDetails'> & {
  params: {
    basicDetails: any;
    jobRole: string;
    type: string;
    preferredLanguages: string[];
    addressDetails: AddressDetails;
  };
};
type AddVehicleDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'AddVehicleDetails'>;

const AddVehicleDetails: React.FC = () => {
  const route = useRoute<AddVehicleDetailsRouteProp>();
  const navigation = useNavigation<AddVehicleDetailsNavigationProp>();

  // State for form fields
  const [drivingLicenseId, setDrivingLicenseId] = useState<string>('');
  const [insuranceNumber, setInsuranceNumber] = useState<string>('');
  const [insuranceExpireDate, setInsuranceExpireDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [vehicleType, setVehicleType] = useState<string>('');
  const [vehicleCapacity, setVehicleCapacity] = useState<string>('');
  const [vehicleRegistrationNumber, setVehicleRegistrationNumber] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  // State to control image reset
  const [resetImages, setResetImages] = useState<{[key: string]: boolean}>({
    'Front': false,
    'Back': false,
    'InsuranceFront': false,
    'InsuranceBack': false,
    'VehicleFront': false,
    'VehicleBack': false,
    'Side-1': false,
    'Side-2': false
  });
  
  // State for image storage
  const [images, setImages] = useState<{[key: string]: string}>({});

  // Vehicle types for dropdown
  const vehicleTypes = [
    { key: '1', value: 'Car' },
    { key: '2', value: 'Truck' },
    { key: '3', value: 'Motorcycle' },
  ];

  // Handle image picking - map display names to backend keys
  const handleImagePicked = (base64Image: string | null, imageType: string) => {
    if (base64Image) {
      const imageMapping: {[key: string]: string} = {
        // Driving License
        'Front': 'Front',  // This will be mapped to licFrontImg in submission
        'Back': 'Back',    // This will be mapped to licBackImg in submission
        
        // Insurance
        'InsuranceFront': 'InsuranceFront',
        'InsuranceBack': 'InsuranceBack',
        
        // Vehicle
        'VehicleFront': 'VehicleFront',
        'VehicleBack': 'VehicleBack',
        'Side-1': 'VehicleSide1',
        'Side-2': 'VehicleSide2'
      };
      
      // Store image with the correct key for backend submission
      const backendKey = imageMapping[imageType] || imageType;
      setImages(prev => ({
        ...prev,
        [backendKey]: base64Image
      }));
    }
  };

  // Handle date change
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setInsuranceExpireDate(selectedDate);
  };

  // Submit handler
  const handleSubmit = async () => {
    // Validate required fields
    if (!drivingLicenseId || !vehicleType || !vehicleRegistrationNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Validate image capture
    const requiredImageTypes = [
      'Front', 'Back', 
      'InsuranceFront', 'InsuranceBack', 
      'VehicleFront', 'VehicleBack', 
      'VehicleSide1', 'VehicleSide2'
    ];

    const missingImages = requiredImageTypes.filter(img => !images[img]);
    
    // Uncomment if you want to enforce all images
    // if (missingImages.length > 0) {
    //   Alert.alert('Image Missing', `Please capture all required images: ${missingImages.join(', ')}`);
    //   return;
    // }

    try {
      // Get the data passed from the previous screen
      const { basicDetails, jobRole, type, preferredLanguages, addressDetails } = route.params;
      
      console.log('-------------------last page -------------------------------------');
      console.log('addressDetails in last page', addressDetails);
      console.log('basicDetails in last page', basicDetails);
      console.log('jobRole in last page', jobRole);
      console.log('type in last page', type);
      console.log('preferredLanguages in last page', preferredLanguages);
      

      // Format the data to match the backend's expected structure
      
      
      const officerData = {
        // Basic details
        firstNameEnglish: basicDetails.firstNameEnglish,
        lastNameEnglish: basicDetails.lastNameEnglish,
        firstNameSinhala: basicDetails.firstNameSinhala,
        lastNameSinhala: basicDetails.lastNameSinhala,
        firstNameTamil: basicDetails.firstNameTamil,
        lastNameTamil: basicDetails.lastNameTamil,
        empId: basicDetails.userId,
        empType: type,
        nic: basicDetails.nicNumber,
        email: basicDetails.email,
        phoneCode01: basicDetails.phoneCode1,
        phoneNumber01: basicDetails.phoneNumber1,
        phoneCode02: basicDetails.phoneCode2,
        phoneNumber02: basicDetails.phoneNumber2,
        jobRole: jobRole,
        preferredLanguages: Object.keys(preferredLanguages)
        .filter(
          (lang) => preferredLanguages[lang as keyof typeof preferredLanguages]
        )
        .join(", "),
        
        // Address details
        houseNumber: addressDetails.houseNumber,
        streetName: addressDetails.streetName,
        city: addressDetails.city,
        district: addressDetails.district,
        province: addressDetails.province,
        country: addressDetails.country,
        
        // Bank details
        accHolderName: addressDetails.accountHolderName,
        accNumber: addressDetails.accountNumber,
        bankName: addressDetails.bankName,
        branchName: addressDetails.branchName,
        
        // Profile image
        profileImageUrl: images.profileImage,
        
        // Vehicle details
        licNo: drivingLicenseId,
        insNo: insuranceNumber,
        insExpDate: insuranceExpireDate ? insuranceExpireDate.toISOString().split('T')[0] : null,
        vType: vehicleType,
        vCapacity: vehicleCapacity,
        vRegNo: vehicleRegistrationNumber,
        
        // License and insurance images - map to the correct backend field names
        licFrontImg: images.Front,
        licBackImg: images.Back,
        insFrontImg: images.InsuranceFront,
        insBackImg: images.InsuranceBack,
        
        // Vehicle images
        vehFrontImg: images.VehicleFront,
        vehBackImg: images.VehicleBack,
        vehSideImgA: images.VehicleSide1,
        vehSideImgB: images.VehicleSide2
      };
      
      console.log('officerData before sending', officerData);

      // Get the auth token from AsyncStorage
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert('Authentication Error', 'No authentication token found');
        return;
      }

     // Make the API call with authorization headers
     const response = await axios.post(
      `${environment.API_BASE_URL}api/collection-manager/driver/add`,
      officerData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data) {
      // Clear stored form data after successful submission
      await AsyncStorage.removeItem("driverFormData");
      
      // Refresh the form
      onRefresh();
      
      Alert.alert('Success', 'Driver and vehicle information submitted successfully', [
        { 
          text: 'OK', 
          onPress: () => navigation.navigate('RegisterDriver' as any) 
        }
      ]);
    }
  } catch (error) {
      console.error('Error submitting driver and vehicle data:', error);
      
      // More detailed error handling
      let errorMessage = 'Failed to submit driver and vehicle information. Please try again.';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      }
      
      Alert.alert('Submission Error', errorMessage);
    }
  };
  
  
  

  // Refresh handler
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    
    // Reset all form fields
    setDrivingLicenseId('');
    setInsuranceNumber('');
    setInsuranceExpireDate(null);
    setVehicleType('');
    setVehicleCapacity('');
    setVehicleRegistrationNumber('');
    
    // Clear all images
    setImages({});

    // Trigger image reset for all camera components
    setResetImages(prev => {
      const newResetState: {[key: string]: boolean} = {};
      Object.keys(prev).forEach(key => {
        newResetState[key] = true;
      });
      return newResetState;
    });

    // Simulate a brief loading time
    setTimeout(() => {
      // Reset the reset flags
      setResetImages(prev => {
        const newResetState: {[key: string]: boolean} = {};
        Object.keys(prev).forEach(key => {
          newResetState[key] = false;
        });
        return newResetState;
      });

      setRefreshing(false);
      // Optional: Show a refresh confirmation
      Alert.alert('Form Refreshed', 'All fields have been reset');
    }, 1000);
  }, []);

  return (
    <ScrollView 
    className="flex-1 bg-white"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#959595']} // Customizable refresh indicator color
          tintColor="#959595"
          title="Pull to refresh"
        />
      }
    >
      <View className="flex-row items-center px-4 py-4 bg-white shadow-sm">
        <TouchableOpacity onPress={() => navigation.goBack()} className="pr-4">
          <AntDesign name="left" size={24} color="#000502" />
        </TouchableOpacity>
        <Text className="text-lg font-bold ml-[23%]">Driving Details</Text>
      </View>

      {/* Driving License Details Section */}
      <View className="p-8 items-center">
        {/* <Text className="text-[16px] font-bold mb-2">Driving License ID</Text> */}
        <TextInput
          placeholder="--Driving License ID--"
          value={drivingLicenseId}
          onChangeText={setDrivingLicenseId}
          className="border border-gray-300 rounded-md p-2 mb-2 w-full"
        />
        <View className="flex-row space-x-2 mt-4">
          <CameraComponent 
            onImagePicked={(image) => handleImagePicked(image, 'Front')}
            imageType="Front"
            resetImage={resetImages['Front']}
          />
          <CameraComponent 
            onImagePicked={(image) => handleImagePicked(image, 'Back')}
            imageType="Back"
            resetImage={resetImages['Back']}
          />
        </View>
      </View>

      <View className="h-[2px] bg-gray-300 w-[100%] self-center mt-4"></View>

      {/* Vehicle Insurance Details Section */}
      <View className="p-8 items-center">
        <Text className="text-[16px] font-bold mb-2">Vehicle Insurance Details</Text>
        <TextInput
          placeholder="--Insurance Number--"
          value={insuranceNumber}
          onChangeText={setInsuranceNumber}
          className="border border-gray-300 rounded-md p-2 mb-2 w-full"
        />

        <TouchableOpacity 
          onPress={() => setShowDatePicker(true)}
          className="border border-gray-300 rounded-md p-2 mb-2 flex-row justify-between items-center w-full"
        >
          <Text>{insuranceExpireDate ? insuranceExpireDate.toDateString() : '--Insurance Expire Date--'}</Text>
          <Ionicons name="calendar" size={20} color="gray" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={insuranceExpireDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}

        <View className="flex-row space-x-2 justify-center mt-4">
        <CameraComponent 
            onImagePicked={(image) => handleImagePicked(image, 'InsuranceFront')}
            imageType="Front"
            resetImage={resetImages['InsuranceFront']}
          />
          <CameraComponent 
            onImagePicked={(image) => handleImagePicked(image, 'InsuranceBack')}
            imageType="Back"
            resetImage={resetImages['InsuranceBack']}
          />
        </View>
      </View>

      <View className="h-[2px] bg-gray-300 w-[100%] self-center mt-4"></View>

      {/* Vehicle Details Section */}
      <View className="p-8 items-center">
        <Text className="text-[16px] font-bold mb-2">Vehicle Details</Text>
        <SelectList
          setSelected={(val: string) => setVehicleType(val)}
          data={vehicleTypes}
          save="value"
          placeholder="--Vehicle Type--"
          searchPlaceholder="--Vehicle Type--"
          boxStyles={{
            borderWidth: 1,
            borderColor: "#cccccc",
            borderRadius: 8,
            marginBottom: 8,
            width: '100%',
          }}
          dropdownStyles={{
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 8,
          }}
        />

        <TextInput
          placeholder="--Vehicle Capacity--"
          value={vehicleCapacity}
          onChangeText={setVehicleCapacity}
          className="border border-gray-300 rounded-md p-2 mb-2 w-full"
        />
        <TextInput
          placeholder="--Vehicle Registration Number--"
          value={vehicleRegistrationNumber}
          onChangeText={setVehicleRegistrationNumber}
          className="border border-gray-300 rounded-md p-2 mb-2 w-full"
        />

        <View className="flex-row space-x-4 mb-4 mt-4">
        <CameraComponent 
            onImagePicked={(image) => handleImagePicked(image, 'VehicleFront')}
            imageType="Front"
            resetImage={resetImages['VehicleFront']}
          />
          <CameraComponent 
            onImagePicked={(image) => handleImagePicked(image, 'VehicleBack')}
            imageType="Back"
            resetImage={resetImages['VehicleBack']}
          />
        </View>

        <View className="flex-row space-x-4">
        <CameraComponent 
            onImagePicked={(image) => handleImagePicked(image, 'Side-1')}
            imageType="Side-1"
            resetImage={resetImages['Side-1']}
          />
          <CameraComponent 
            onImagePicked={(image) => handleImagePicked(image, 'Side-2')}
            imageType="Side-2"
            resetImage={resetImages['Side-2']}
          />
        </View>
      </View>

      {/* Submit Buttons Section */}
      <View className="items-center p-4">
        <View className="flex-row space-x-4">
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="bg-[#D9D9D9] px-6 py-3 items-center rounded-full w-32"
          >
            <Text className='text-[#686868]'>Go Back</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleSubmit} 
            className="bg-[#959595] px-6 py-3 rounded-full items-center w-32"
          >
            <Text className="text-white">Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddVehicleDetails;