import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
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

    const handleAddMore = () => {
        setCurrentCrop(prevCrop => prevCrop + 1);
        navigation.push('UnregisteredCropDetails', { cropCount: currentCrop + 1 });
    };

    const handleDone = () => {
        // Save to database logic here
        navigation.navigate('UnregisteredFarmerDetails'); // Or navigate to some confirmation page
    };

    return (
        <ScrollView className="flex-1 p-5 bg-white">
            <Text className="text-xl font-bold mb-4">Fill Crop details</Text>
            <Text className="text-lg mb-4 ml-[150px]">Crop {currentCrop}</Text>
            <TextInput placeholder="Crop Name" className="border mb-3 p-3 rounded" />
            <TextInput placeholder="Quality" className="border mb-3 p-3 rounded" />
            <TextInput placeholder="Quantity" className="border mb-3 p-3 rounded" />
            <TextInput placeholder="Unit Price (Rs.)" className="border mb-3 p-3 rounded" />
            <TouchableOpacity 
                className="bg-gray-800 p-3 ml-[40px] w-[250px] h-[50px]  items-center mb-3">
                <Text className="text-white text-lg">Add Product Image</Text>
            </TouchableOpacity>
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
