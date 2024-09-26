import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from './types'; // Adjust the path according to your project structure
import NavBar from './BottomNav';

type UnregisteredCropDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'UnregisteredCropDetails'>;
type UnregisteredCropDetailsRouteProp = RouteProp<RootStackParamList, 'UnregisteredCropDetails'>;

interface UnregisteredCropDetailsProps {
    navigation: UnregisteredCropDetailsNavigationProp;
    route: UnregisteredCropDetailsRouteProp;
}

const UnregisteredCropDetails: React.FC<UnregisteredCropDetailsProps> = ({ navigation, route }) => {
    const { cropCount } = route.params;
    const [currentCrop, setCurrentCrop] = useState(cropCount);
    const [imageUri, setImageUri] = useState<string | null>(null);

    const handleAddMore = () => {
        setCurrentCrop(prevCrop => prevCrop + 1);
        navigation.push('UnregisteredCropDetails', { cropCount: currentCrop + 1 });
    };

    const handleDone = () => {
        // Save to database logic here
        navigation.navigate('UnregisteredFarmerDetails'); // Or navigate to some confirmation page
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
            setImageUri(result.assets[0].uri); // Set the image URI
        }
    };

    return (
        <ScrollView className="flex-1 p-5 bg-white">
            <Text className="text-xl font-bold mb-4">Fill Crop details</Text>
            <Text className="text-lg mb-4 ml-[150px]">Crop {currentCrop}</Text>
            <TextInput placeholder="Crop Name" className="border mb-3 p-3 rounded" />
            <TextInput placeholder="Quality" className="border mb-3 p-3 rounded" />
            <TextInput placeholder="Quantity" className="border mb-3 p-3 rounded" />
            <TextInput placeholder="Unit Price (Rs.)" className="border mb-3 p-3 rounded" />

            {imageUri ? (
                <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginBottom: 10 }} />
            ) : (
                <TouchableOpacity 
                    className="bg-gray-800 p-3 ml-[40px] w-[250px] h-[50px] items-center mb-3"
                    onPress={selectImage}>
                    <Text className="text-white text-lg">Add Product Image</Text>
                </TouchableOpacity>
            )}

            <TextInput placeholder="Total (Rs.)" className="border mb-3 p-3 rounded" editable={false} />

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
