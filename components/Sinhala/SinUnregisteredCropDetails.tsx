import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types'; // Adjust the path according to your project structure
import NavBar from '../BottomNav';

type SinUnregisteredCropDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'SinUnregisteredCropDetails'>;
type SinUnregisteredCropDetailsRouteProp = RouteProp<RootStackParamList, 'UnregisteredCropDetails'>;

interface SinUnregisteredCropDetailsProps {
    navigation: SinUnregisteredCropDetailsNavigationProp;
    route: SinUnregisteredCropDetailsRouteProp;
}

const SinUnregisteredCropDetails: React.FC<SinUnregisteredCropDetailsProps> = ({ navigation, route }) => {
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
            <Text className="text-xl font-bold mb-4">බෝග විස්තර</Text>
            <Text className="text-lg mb-4 ml-[150px]">බෝග {currentCrop}</Text>
            <TextInput placeholder="බෝග නාමය" className="border mb-3 p-3 rounded" />
            <TextInput placeholder="ගුණාත්මකභාවය" className="border mb-3 p-3 rounded" />
            <TextInput placeholder="ප්රමාණය" className="border mb-3 p-3 rounded" />
            <TextInput placeholder="ඒකක මිල (රු.)" className="border mb-3 p-3 rounded" />
            <TouchableOpacity 
                className="bg-gray-800 p-3 ml-[40px] w-[250px] h-[50px]  items-center mb-3">
                <Text className="text-white text-lg">චායාරූපය ඇතුලත් කරන්න</Text>
            </TouchableOpacity>
            <TextInput placeholder="මුළු මුදල (රු.)" className="border mb-3 p-3 rounded" editable={false} />
            
            <TouchableOpacity 
                className="bg-green-500 p-3 rounded-full items-center mt-5"
                onPress={handleAddMore}>
                <Text className="text-white text-lg">තවත් එකතු කරන්න</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                className="border border-black p-3 rounded-full items-center mt-3"
                onPress={handleDone}>
                <Text className="text-black text-lg">සම්පූර්ණයි</Text>
            </TouchableOpacity>
            <View className='mt-[60px]'>
        <NavBar/>
        </View>
        </ScrollView>
      
    );
};

export default SinUnregisteredCropDetails;
