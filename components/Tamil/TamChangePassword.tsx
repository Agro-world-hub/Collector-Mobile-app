import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import the icon library
import { ScrollView } from 'react-native-gesture-handler';

type TamChangePasswordNavigationProp = StackNavigationProp<RootStackParamList, 'TamChangePassword'>;

interface TamChangePasswordProps {
    navigation: TamChangePasswordNavigationProp;
}

const toplogo = require('@/assets/images/colector.png');

const TamChangePassword: React.FC<TamChangePasswordProps> = ({ navigation }) => {
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
                <Text className='font-bold text-xl'>புதிய கடவுச்சொல்லைத் தேர்ந்தெடுக்கவும்</Text>
                <Text className='w-[73%] text-center font-light pt-3'>
                    உங்கள் கணக்கிற்கான அணுகலைப் பெற புதிய கடவுச்சொல்லைத் தேர்ந்தெடுக்கவும்
                </Text>
            </View>

            <View className='ml-[10%] pt-[12%]'>
                <Text className='font-normal pb-2'>தற்போதைய கடவுச்சொல்</Text>
                {renderInputField('தற்போதைய கடவுச்சொல்', currentPassword, setCurrentPassword, secureCurrent, setSecureCurrent)}

                <Text className='font-normal pb-2'>புதிய கடவுச்சொல்</Text>
                {renderInputField('புதிய கடவுச்சொல்', newPassword, setNewPassword, secureNew, setSecureNew)}

                <Text className='font-normal pb-2'>புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்</Text>
                {renderInputField('புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்', confirmPassword, setConfirmPassword, secureConfirm, setSecureConfirm)}
            </View>
            <View className='items-center pt-7 gap-y-5'>
                <TouchableOpacity className='bg-[#2AAD7A] w-[60%] h-[40px] rounded-3xl' onPress={()=>navigation.navigate('TamLogin')} >
                    <Text className='text-center pt-1 text-xl font-light text-white' >அடுத்து</Text>
                </TouchableOpacity>
                <TouchableOpacity className='bg-white border w-[60%] h-[40px] rounded-3xl'>
                    <Text className='text-center pt-1 text-xl font-light text-black'>தவிர்க்க</Text>
                </TouchableOpacity>
            </View>
        </View>
    </ScrollView>  
    );
};

export default TamChangePassword;
