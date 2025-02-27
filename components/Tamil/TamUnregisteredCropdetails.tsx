import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types'; // Adjust the path according to your project structure
import NavBar from '../BottomNav';

type TamUnregisteredCropDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'TamUnregisteredCropDetails'>;
type TamUnregisteredCropDetailsRouteProp = RouteProp<RootStackParamList, 'TamUnregisteredCropDetails'>;

interface TamUnregisteredCropDetailsProps {
    navigation: TamUnregisteredCropDetailsNavigationProp;
    route: TamUnregisteredCropDetailsRouteProp;
}

const TamUnregisteredCropDetails: React.FC<TamUnregisteredCropDetailsProps> = ({ navigation, route }) => {
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
            <Text className="text-xl font-bold mb-4">விவசாயத்தின் விவரங்களை நிரப்பவும்</Text>
            <Text className="text-lg mb-4 ml-[150px]">விவசாயம் {currentCrop}</Text>
            <TextInput placeholder="பயிர் பெயர்" className="border mb-3 p-3 rounded" />
            <TextInput placeholder="தரம்" className="border mb-3 p-3 rounded" />
            <TextInput placeholder="அளவு" className="border mb-3 p-3 rounded" />
            <TextInput placeholder="ஒன்றுக்கு விலை (ரூ.)" className="border mb-3 p-3 rounded" />
            <TouchableOpacity 
                className="bg-gray-800 p-3 ml-[40px] w-[250px] h-[50px]  items-center mb-3">
                <Text className="text-white text-lg">தயாரிப்பு படத்தைச் சேர்க்கவும்</Text>
            </TouchableOpacity>
            <TextInput placeholder="மொத்தம் (ரூ.)" className="border mb-3 p-3 rounded" editable={false} />
            
            <TouchableOpacity 
                className="bg-green-500 p-3 rounded-full items-center mt-5"
                onPress={handleAddMore}>
                <Text className="text-white text-lg">மேலும் சேர்க்க</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                className="border border-black p-3 rounded-full items-center mt-3"
                onPress={handleDone}>
                <Text className="text-black text-lg">முடிந்தது</Text>
            </TouchableOpacity>
            <View className='mt-[60px]'>
                <NavBar />
            </View>
        </ScrollView>
    );
};

export default TamUnregisteredCropDetails;
