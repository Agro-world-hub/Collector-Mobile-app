import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import the icon library
import { ScrollView } from 'react-native-gesture-handler';

type SinChangePasswordNavigationProp = StackNavigationProp<RootStackParamList, 'SinChangePassword'>;

interface SinChangePasswordProps {
    navigation: SinChangePasswordNavigationProp;
}

const toplogo = require('../../assets/images/colector.webp');

const SinChangePassword: React.FC<SinChangePasswordProps> = ({ navigation }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureCurrent, setSecureCurrent] = useState(true);
    const [secureNew, setSecureNew] = useState(true);
    const [secureConfirm, setSecureConfirm] = useState(true);

    const renderInputField = (
        placeholder: string,
        value: string,
        setValue: React.Dispatch<React.SetStateAction<string>>,
        secure: boolean,
        setSecure: React.Dispatch<React.SetStateAction<boolean>>
    ) => (
        <View className="flex-row items-center border rounded-3xl w-[90%] h-[53px] mb-5 bg-white px-3">
            <TextInput
                className="flex-1 h-[40px] text-base"
                placeholderTextColor="#2E2E2E"
                onChangeText={setValue}
                secureTextEntry={secure}
                value={value}
            />
            <TouchableOpacity onPress={() => setSecure(!secure)}>
                <Icon name={secure ? "eye-off-outline" : "eye-outline"} size={24} color="green" />
            </TouchableOpacity>
        </View>
    );

    return (
       <ScrollView className='flex-1 bg-white'>
        <View className='flex-1 h-full pt-[10%] bg-white'>
            <Image source={toplogo} />
            <View className='items-center pt-[10%]'>
                <Text className='font-bold text-xl'>නව මුරපදයක් තෝරන්න</Text>
                <Text className='w-[53%] text-center font-light pt-3'>
                ඔබගේ ගිණුමට ප්‍රවේශ වීමට ඔබගේ නව මුරපදය තෝරන්න
                </Text>
            </View>

            <View className='ml-[10%] pt-[12%]'>
                <Text className='font-normal pb-2'>වත්මන් මුරපදය</Text>
                {renderInputField('Current Password', currentPassword, setCurrentPassword, secureCurrent, setSecureCurrent)}

                <Text className='font-normal pb-2'>නව මුර පදය</Text>
                {renderInputField('New Password', newPassword, setNewPassword, secureNew, setSecureNew)}

                <Text className='font-normal pb-2'>නව මුර පදය තහවුරු කරන්න</Text>
                {renderInputField('Confirm New Password', confirmPassword, setConfirmPassword, secureConfirm, setSecureConfirm)}
            </View>
            <View className='items-center pt-7 gap-y-5'>
                <TouchableOpacity className='bg-[#2AAD7A] w-[60%] h-[40px] rounded-3xl' onPress={()=>navigation.navigate('SinLogin')} >
                    <Text className='text-center pt-1 text-xl font-light text-white' >ඉදිරියට යන්න</Text>
                </TouchableOpacity>
                <TouchableOpacity className='bg-white border w-[60%] h-[40px] rounded-3xl'>
                    <Text className='text-center pt-1 text-xl font-light text-black'>මගහරින්න</Text>
                </TouchableOpacity>
            </View>
        </View>
    </ScrollView>  
    );
};

export default SinChangePassword;
