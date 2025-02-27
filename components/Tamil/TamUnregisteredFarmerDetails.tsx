import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types'; // Adjust the path according to your project structure
import CountryPicker, { CountryCode } from 'react-native-country-picker-modal';
import NavBar from '../BottomNav';

type TamUnregisteredFarmerDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'TamUnregisteredFarmerDetails'>;

interface TamUnregisteredFarmerDetailsProps {
    navigation: TamUnregisteredFarmerDetailsNavigationProp;
}

const TamUnregisteredFarmerDetails: React.FC<TamUnregisteredFarmerDetailsProps> = ({ navigation }) => {
    const [countryCode, setCountryCode] = useState<CountryCode>('US');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleNext = () => {
        navigation.navigate('TamUnregisteredCropDetails', { cropCount: 1 });
    };

    return (
        <View className="flex-1 p-5 bg-white">
            {/* Header with Back Icon */}
            <View className="flex-row items-center mb-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image 
                        source={require('@/assets/images/back.png')} // Path to your PNG image
                        style={{ width: 24, height: 24 }} // Adjust size if needed
                    />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-center">விவசாயியின் தனிப்பட்ட விவரங்களை நிரப்பவும்</Text>
            </View>

            {/* Scrollable Form */}
            <ScrollView className="flex-1 p-3">
                {/* First Name */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">முதல் பெயர்</Text>
                    <TextInput 
                        placeholder="முதல் பெயர்" 
                        className="border p-3 rounded" 
                    />
                </View>

                {/* Last Name */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">கடைசி பெயர்</Text>
                    <TextInput 
                        placeholder="கடைசி பெயர்" 
                        className="border p-3 rounded" 
                    />
                </View>

                {/* NIC Number */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">தேசிய அடையாள அட்டை எண்</Text>
                    <TextInput 
                        placeholder="தேசிய அடையாள அட்டை எண்" 
                        className="border p-3 rounded" 
                    />
                </View>

                {/* Phone Number */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">தொலைபேசி எண்</Text>
                    <View className="flex-row items-center border p-3 rounded">
                        <CountryPicker 
                            countryCode={countryCode} 
                            withFilter 
                            withFlag 
                            onSelect={(country) => setCountryCode(country.cca2 as CountryCode)} 
                            // className="mr-2"
                        />
                        <TextInput 
                            placeholder="தொலைபேசி எண்" 
                            keyboardType="phone-pad" 
                            value={phoneNumber} 
                            onChangeText={setPhoneNumber} 
                            className="flex-1" 
                        />
                    </View>
                </View>

                {/* Address */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">முகவரி</Text>
                    <TextInput 
                        placeholder="முகவரி" 
                        className="border p-3 rounded" 
                    />
                </View>

                {/* Account Number */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">வங்கி கணக்கு எண்</Text>
                    <TextInput 
                        placeholder="வங்கி கணக்கு எண்" 
                        className="border p-3 rounded" 
                    />
                </View>

                {/* Account Holder's Name */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">கணக்கு வைத்திருப்பவரின் பெயர்</Text>
                    <TextInput 
                        placeholder="கணக்கு வைத்திருப்பவரின் பெயர்" 
                        className="border p-3 rounded" 
                    />
                </View>

                {/* Bank Name */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">வங்கி பெயர்</Text>
                    <TextInput 
                        placeholder="வங்கி பெயர்" 
                        className="border p-3 rounded" 
                    />
                </View>

                {/* Branch Name */}
                <View className="mb-8">
                    <Text className="text-gray-600 mb-2">கிளை பெயர்</Text>
                    <TextInput 
                        placeholder="கிளை பெயர்" 
                        className="border p-3 rounded" 
                    />
                </View>
            </ScrollView>

            {/* Next Button */}
            <TouchableOpacity 
                className="bg-green-500 p-3 rounded-full items-center mt-5"
                onPress={(handleNext)}
            >
                <Text className="text-white text-lg">அடுத்தது</Text>
            </TouchableOpacity>
            <View className='mt-4'>
                <NavBar/>
            </View>
        </View>
    );
};

export default TamUnregisteredFarmerDetails;
