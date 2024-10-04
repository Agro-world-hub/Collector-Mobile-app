import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios'; // Import axios
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { RootStackParamList } from './types'; // Adjust the path according to your project structure
import NavBar from './BottomNav';

type UnregisteredCropDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'UnregisteredCropDetails'>;
type UnregisteredCropDetailsRouteProp = RouteProp<RootStackParamList, 'UnregisteredCropDetails'>;

interface UnregisteredCropDetailsProps {
    navigation: UnregisteredCropDetailsNavigationProp;
    route: UnregisteredCropDetailsRouteProp;
}

const UnregisteredCropDetails: React.FC<UnregisteredCropDetailsProps> = ({ navigation, route }) => {
    const { cropCount, userId } = route.params; // Get userId from params
    const [currentCrop, setCurrentCrop] = useState(cropCount);
    const [image, setImage] = useState<string | null>(null);

    // State for crop details
    const [cropName, setCropName] = useState(''); // Added for crop name
    const [quality, setQuality] = useState(''); // Added for quality
    const [quantity, setQuantity] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [total, setTotal] = useState('');

    // Automatically calculate total whenever quantity or unitPrice changes
    useEffect(() => {
        const quantityValue = parseFloat(quantity) || 0;
        const unitPriceValue = parseFloat(unitPrice) || 0;
        const calculatedTotal = quantityValue * unitPriceValue;
        setTotal(calculatedTotal.toFixed(2)); // Ensures two decimal places
    }, [quantity, unitPrice]);

    const handleAddMore = () => {
        setCurrentCrop(prevCrop => prevCrop + 1);
        navigation.push('UnregisteredCropDetails', { cropCount: currentCrop + 1, userId });
    };

    // New function to handle form submission
    const handleDone = async () => {
        // Prepare crop data
        const cropData = {
            userId, // Include the userId
            cropName,
            quality,
            quantity: parseFloat(quantity),
            unitPrice: parseFloat(unitPrice),
            image,
            total: parseFloat(total),
        };

        try {
            // Retrieve the token from AsyncStorage
            const token = await AsyncStorage.getItem('token'); // Adjust the key as per your implementation

            // Set up the request headers
            const headers = {
                Authorization: `Bearer ${token}`, // Add token to headers
                'Content-Type': 'application/json',
            };

            // Replace with your actual backend endpoint
            const response = await axios.post('http://10.0.2.2:3001/api/unregisteredfarmercrop/unregister-farmercrop', cropData, { headers });
            console.log('Crop details submitted successfully:', response.data);
            navigation.navigate('Dashboard' as any); // Or navigate to some confirmation page
        } catch (error) {
            console.error('Error submitting crop details:', error);
            alert('Failed to submit crop details. Please try again.');
        }
    };

    const selectImage = async () => {
        // Request permission to access the image library
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            alert('Permission to access the gallery is required!');
            return;
        }

        // Open the image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets) {
            setImage(result.assets[0].uri); // Set the image URI
        }
    };

    return (
        <ScrollView className="flex-1 p-5 bg-white">
            <Text className="text-xl font-bold mb-4">Fill Crop details</Text>
            <Text className="text-lg mb-4 ml-[150px]">Crop {currentCrop}</Text>

            <TextInput
                placeholder="Crop Name"
                className="border mb-3 p-3 rounded"
                value={cropName} // Bind to cropName state
                onChangeText={setCropName} // Handle crop name changes
            />
            
            <TextInput
                placeholder="Quality"
                className="border mb-3 p-3 rounded"
                value={quality} // Bind to quality state
                onChangeText={setQuality} // Handle quality changes
            />
            
            <TextInput
                placeholder="Quantity"
                className="border mb-3 p-3 rounded"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
            />
            
            <TextInput
                placeholder="Unit Price (Rs.)"
                className="border mb-3 p-3 rounded"
                keyboardType="numeric"
                value={unitPrice}
                onChangeText={setUnitPrice}
            />

            {image ? (
                <Image source={{ uri: image }} style={{ width: 200, height: 200, marginBottom: 10 }} />
            ) : (
                <TouchableOpacity 
                    className="bg-gray-800 p-3 ml-[40px] w-[250px] h-[50px] items-center mb-3"
                    onPress={selectImage}>
                    <Text className="text-white text-lg">Add Product Image</Text>
                </TouchableOpacity>
            )}

            <TextInput
                placeholder="Total (Rs.)"
                className="border mb-3 p-3 rounded"
                value={total}
                editable={false} // Total should not be manually editable
            />

            <TouchableOpacity 
                className="bg-green-500 p-3 rounded-full items-center mt-5"
                onPress={handleAddMore}>
                <Text className="text-white text-lg">Add More</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                className="border border-black p-3 rounded-full items-center mt-3"
                onPress={handleDone}>
                <Text className="text-black text-lg">Done</Text>
            </TouchableOpacity>

            <View className='mt-[60px]'>
                <NavBar />
            </View>
        </ScrollView>
    );
};

export default UnregisteredCropDetails;
