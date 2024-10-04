import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types'; // Adjust the path according to your project structure
import CountryPicker, { CountryCode } from 'react-native-country-picker-modal';
import NavBar from './BottomNav';

type UnregisteredFarmerDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'UnregisteredFarmerDetails'>;

interface UnregisteredFarmerDetailsProps {
    navigation: UnregisteredFarmerDetailsNavigationProp;
}

const UnregisteredFarmerDetails: React.FC<UnregisteredFarmerDetailsProps> = ({ navigation }) => {
    const [countryCode, setCountryCode] = useState<CountryCode>('US');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [NICnumber, setNICnumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [accNumber, setAccNumber] = useState('');
    const [accHolderName, setAccHolderName] = useState('');
    const [bankName, setBankName] = useState('');
    const [branchName, setBranchName] = useState('');

    const handleNext = async () => {
        try {
            const response = await fetch('http://10.0.2.2:3001/api/farmer/register-farmer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    NICnumber,
                    phoneNumber,
                    address,
                    accNumber,
                    accHolderName,
                    bankName,
                    branchName,
                }),
            });
    
            const result = await response.json();
            
            if (response.ok) {
                Alert.alert("Success", result.message);
                // Capture userId from the result and navigate to the crop details screen
                const userId = result.userId;
                navigation.navigate('UnregisteredCropDetails', { userId }as any);
            } else {
                Alert.alert("Error", result.error);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to connect to the server");
        }
    };

    return (
        <View className="flex-1 p-5 bg-white">
            {/* Header with Back Icon */}
            <View className="flex-row items-center mb-4">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image 
                        source={require('../assets/images/back.png')} // Path to your PNG image
                        style={{ width: 24, height: 24 }} // Adjust size if needed
                    />
                </TouchableOpacity>
                <Text className="text-xl font-bold ml-3">Fill Farmer Personal Details</Text>
            </View>

            {/* Scrollable Form */}
            <ScrollView className="flex-1 p-3">
                {/* First Name */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">First Name</Text>
                    <TextInput 
                        placeholder="First Name" 
                        className="border p-3 rounded" 
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                </View>

                {/* Last Name */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">Last Name</Text>
                    <TextInput 
                        placeholder="Last Name" 
                        className="border p-3 rounded" 
                        value={lastName}
                        onChangeText={setLastName}
                    />
                </View>

                {/* NIC Number */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">NIC Numbers</Text>
                    <TextInput 
                        placeholder="NIC Number" 
                        className="border p-3 rounded" 
                        value={NICnumber}
                        onChangeText={setNICnumber}
                    />
                </View>

                {/* Phone Number */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">Phone Number</Text>
                    <View className="flex-row items-center border p-3 rounded">
                        <CountryPicker 
                            countryCode={countryCode} 
                            withFilter 
                            withFlag 
                            onSelect={(country) => setCountryCode(country.cca2 as CountryCode)} 
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
                    <Text className="text-gray-600 mb-2">Address</Text>
                    <TextInput 
                        placeholder="Address" 
                        className="border p-3 rounded" 
                        value={address}
                        onChangeText={setAddress}
                    />
                </View>

                {/* Account Number */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">Account Number</Text>
                    <TextInput 
                        placeholder="Account Number" 
                        className="border p-3 rounded" 
                        value={accNumber}
                        onChangeText={setAccNumber}
                    />
                </View>

                {/* Account Holder's Name */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">Account Holder's Name</Text>
                    <TextInput 
                        placeholder="Account Holder's Name" 
                        className="border p-3 rounded" 
                        value={accHolderName}
                        onChangeText={setAccHolderName}
                    />
                </View>

                {/* Bank Name */}
                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">Bank Name</Text>
                    <TextInput 
                        placeholder="Bank Name" 
                        className="border p-3 rounded" 
                        value={bankName}
                        onChangeText={setBankName}
                    />
                </View>

                {/* Branch Name */}
                <View className="mb-8">
                    <Text className="text-gray-600 mb-2">Branch Name</Text>
                    <TextInput 
                        placeholder="Branch Name" 
                        className="border p-3 rounded" 
                        value={branchName}
                        onChangeText={setBranchName}
                    />
                </View>
            </ScrollView>

            {/* Next Button */}
            <TouchableOpacity 
                className="bg-green-500 p-3 rounded-full items-center mt-5"
                onPress={handleNext}
            >
                <Text className="text-white text-lg">Next</Text>
            </TouchableOpacity>

            <View className='mt-4'>
                <NavBar/>
            </View>
        </View>
    );
};

export default UnregisteredFarmerDetails;
