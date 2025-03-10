import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types'; // Adjust the path according to your project structure
import CountryPicker, { CountryCode } from 'react-native-country-picker-modal';
import NavBar from '../BottomNav';

type SinUnregisteredFarmerDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'SinUnregisteredFarmerDetails'>;

interface SinUnregisteredFarmerDetailsProps {
    navigation: SinUnregisteredFarmerDetailsNavigationProp;
}

const SinUnregisteredFarmerDetails: React.FC<SinUnregisteredFarmerDetailsProps> = ({ navigation }) => {
    const [countryCode, setCountryCode] = useState<CountryCode>('US');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleNext = () => {
        navigation.navigate('SinUnregisteredCropDetails', { cropCount: 1 });
    };

    return (
        <View className="flex-1 p-5 bg-white">
            {/* Header with Back Icon */}
            <View className="flex-row items-center mb-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image 
                        source={require('@/assets/images/back.webp')} // Path to your PNG image
                        style={{ width: 24, height: 24 }} // Adjust size if needed
                    />
                </TouchableOpacity>
                <Text className="text-xl font-bold ml-3 text-center pl-[20%]">ගොවියාගේ විස්තර</Text>
            </View>

            {/* Scrollable Form */}
            <ScrollView className="flex-1 p-3">
                {/* First Name */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">මුල් නම</Text>
                    <TextInput 
                        placeholder="මුල් නම" 
                        className="border p-3 rounded" 
                    />
                </View>

                {/* Last Name */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">අවසන් නම</Text>
                    <TextInput 
                        placeholder="අවසන් නම" 
                        className="border p-3 rounded" 
                    />
                </View>

                {/* NIC Number */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">ජාතික හැඳුනුම්පත් අංකය</Text>
                    <TextInput 
                        placeholder="ජාතික හැඳුනුම්පත් අංකය" 
                        className="border p-3 rounded" 
                    />
                </View>

                {/* Phone Number */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">දුරකතන අංකය</Text>
                    <View className="flex-row items-center border p-3 rounded">
                        <CountryPicker 
                            countryCode={countryCode} 
                            withFilter 
                            withFlag 
                            onSelect={(country) => setCountryCode(country.cca2 as CountryCode)} 
                            // className="mr-2"
                        />
                        <TextInput 
                            placeholder="Phone Number" 
                            keyboardType="phone-pad" 
                            value={phoneNumber} 
                            onChangeText={setPhoneNumber} 
                            className="flex-1" 
                        />
                    </View>
                </View>

                {/* Address */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">ලිපිනය</Text>
                    <TextInput 
                        placeholder="ලිපිනය" 
                        className="border p-3 rounded" 
                    />
                </View>

                {/* Account Number */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">ගිණුම් අංකය</Text>
                    <TextInput 
                        placeholder="ගිණුම් අංකය" 
                        className="border p-3 rounded" 
                    />
                </View>

                {/* Account Holder's Name */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">ගිණුම් හිමියාගෙ නම</Text>
                    <TextInput 
                        placeholder="ගිණුම් හිමියාගෙ නම" 
                        className="border p-3 rounded" 
                    />
                </View>

                {/* Bank Name */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">බැංකුවේ නම</Text>
                    <TextInput 
                        placeholder="බැංකුවේ නම" 
                        className="border p-3 rounded" 
                    />
                </View>

                {/* Branch Name */}
                <View className="mb-8">
                    <Text className="text-gray-600 mb-2">ශාකාව</Text>
                    <TextInput 
                        placeholder="Branch Name" 
                        className="border p-3 rounded" 
                    />
                </View>
            </ScrollView>

            {/* Next Button */}
            <TouchableOpacity 
                className="bg-green-500 p-3 rounded-full items-center mt-5"
                onPress={handleNext}
            >
                <Text className="text-white text-lg">ඉදිරියට යන්න</Text>
            </TouchableOpacity>
            <View className='mt-4'>
            <NavBar/>
            </View>
        </View>
    );
};

export default SinUnregisteredFarmerDetails;
