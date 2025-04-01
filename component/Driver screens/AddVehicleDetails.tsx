import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Platform, RefreshControl } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SelectList } from 'react-native-dropdown-select-list';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import CameraComponent from '@/utils/CamComponentForDrivers';


type AddVehicleDetailsRouteProp = RouteProp<RootStackParamList, 'AddVehicleDetails'>;
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
    'VehicleSide1': false,
    'VehicleSide2': false
  });
  

  // State for image storage
  const [images, setImages] = useState<{[key: string]: string}>({});

  // Vehicle types for dropdown
  const vehicleTypes = [
    { key: '1', value: 'Car' },
    { key: '2', value: 'Truck' },
    { key: '3', value: 'Motorcycle' },
  ];

  // Handle image picking
  const handleImagePicked = (base64Image: string | null, imageType: string) => {
    if (base64Image) {
      setImages(prev => ({
        ...prev,
        [imageType]: base64Image
      }));
    }
  };

  // Handle date change
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setInsuranceExpireDate(selectedDate);
  };

  // Submit handler
  const handleSubmit = () => {
    // Validate required fields
    if (!drivingLicenseId || !vehicleType || !vehicleRegistrationNumber) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    // Validate image capture
    const requiredImages = [
      'Front', 'Back', 
      'Front', 'Back', 
      'Front', 'Back', 
      'Side-1', 'Side-2'
    ];

    const missingImages = requiredImages.filter(img => !images[img]);
    
    if (missingImages.length > 0) {
      Alert.alert('Image Missing', `Please capture all required images: ${missingImages.join(', ')}`);
      return;
    }

    // If all validations pass, proceed with submission
    // You would typically send this data to your backend
    console.log('Submission Data:', {
      drivingLicenseId,
      insuranceNumber,
      insuranceExpireDate,
      vehicleType,
      vehicleCapacity,
      vehicleRegistrationNumber,
      images
    });

    // Reset form or navigate to next screen
    // navigation.navigate('NextScreen');
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
        <Text className="text-[16px] font-bold mb-2">Driving License ID</Text>
        <TextInput
          placeholder="--Driving License ID--"
          value={drivingLicenseId}
          onChangeText={setDrivingLicenseId}
          className="border border-gray-300 rounded-md p-2 mb-2 w-full"
        />
        <View className="flex-row space-x-2 mt-4">
          <CameraComponent 
            onImagePicked={handleImagePicked}
            imageType="Front"
            resetImage={resetImages['DrivingLicenseFront']}
          />
          <CameraComponent 
            onImagePicked={handleImagePicked}
            imageType="Back"
            resetImage={resetImages['DrivingLicenseBack']}
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
            onImagePicked={handleImagePicked}
            imageType="Front"
            resetImage={resetImages['InsuranceFront']}
          />
          <CameraComponent 
            onImagePicked={handleImagePicked}
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
            borderColor: 'gray',
            borderRadius: 8,
            marginBottom: 8,
            width: '100%',
          }}
          dropdownStyles={{
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 8,
            width: '100%',
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
            onImagePicked={handleImagePicked}
            imageType="Front"
            resetImage={resetImages['VehicleFront']}
          />
          <CameraComponent 
            onImagePicked={handleImagePicked}
            imageType="Back"
            resetImage={resetImages['VehicleBack']}
          />
        </View>

        <View className="flex-row space-x-4">
          <CameraComponent 
            onImagePicked={handleImagePicked}
            imageType="Side-1"
            resetImage={resetImages['VehicleSide1']}
          />
          <CameraComponent 
            onImagePicked={handleImagePicked}
            imageType="Side-2"
            resetImage={resetImages['VehicleSide2']}
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