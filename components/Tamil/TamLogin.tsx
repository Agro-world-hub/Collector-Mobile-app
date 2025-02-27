import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';

type TamLoginNavigationProp = StackNavigationProp<RootStackParamList, 'TamLogin'>;

interface LoginProps {
    navigation: TamLoginNavigationProp;
}

const login = require('@/assets/images/login.png');

const TamLogin: React.FC<LoginProps> = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    return (
        <ScrollView className='flex-1 w-full bg-white'>
            <View className='items-center pt-[10%]'>
                <Image source={login} />
                <Text className='font-bold text-2xl pt-[7%]'>வணக்கம்!</Text>
            </View>

            <View className='ml-[10%] mr-[10%] pt-[12%]'>
              <Text className='text-base pb-[2%] font-light'>பயனர்பெயர்</Text>
                <View className="flex-row items-center border rounded-3xl w-full h-[53px] mb-5 bg-white px-3">
                    <Icon name="account" size={24} color="green" />
                    <TextInput
                        className="flex-1 h-[40px] text-base pl-2"
                        placeholder="பயனர்பெயர்"
                        onChangeText={setUsername}
                        value={username}
                    />
                </View>
                <Text className='text-base pb-[2%] font-light'>கடவுச்சொல்</Text>
                <View className="flex-row items-center border rounded-3xl w-full h-[53px] mb-5 bg-white px-3">
                    <Icon name="lock" size={24} color="green" />
                    <TextInput
                        className="flex-1 h-[40px] text-base pl-2"
                        placeholder="கடவுச்சொல்"
                        secureTextEntry={secureTextEntry}
                        onChangeText={setPassword}
                        value={password}
                    />
                    <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                        <Icon name={secureTextEntry ? "eye-off-outline" : "eye-outline"} size={24} color="green" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity className='bg-[#2AAD7A] w-full h-[50px] rounded-3xl shadow-2xl items-center justify-center' onPress={()=>navigation.navigate('TamDashboard')}>
                    <Text className='text-center text-xl font-light text-white'>உள்நுழைக</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default TamLogin;
