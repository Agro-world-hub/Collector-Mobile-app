import { View, Text, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import the icon library
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import environment from '../environment';

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type LoginNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginProps {
    navigation: LoginNavigationProp;
}

const loginImage = require('@/assets/images/login.png');

const Login: React.FC<LoginProps> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const handleLogin = async () => {
        try {
            const response = await api.post(`api/collection-officer/login`, {
                email,
                password,
            });

            // Assuming the token is part of the response
            const { token, passwordUpdateRequired } = response.data;

            // Store token in AsyncStorage
            if (token) {
                await AsyncStorage.setItem('token', token);
                console.log('Token stored:', token); // Log token storage for debugging
            } else {
                console.error('No token received from the server.');
            }

            if (passwordUpdateRequired) {
                // Navigate to Change Password Screen
                navigation.navigate('ChangePassword', { email } as any);
            } else {
                // Navigate to the dashboard if password update is not required
                navigation.navigate('Dashboard');
            }
        } catch (error) {
            console.error('Login error:', error); // Log error for debugging
            Alert.alert('Error', 'Invalid email or password.');
        }
    };

    return (
        <ScrollView className="flex-1 w-full bg-white">
            <View className="items-center pt-[10%]">
                <Image source={loginImage} />
                <Text className="font-bold text-2xl pt-[7%]">Welcome Back!</Text>
            </View>

            <View className="ml-[10%] mr-[10%] pt-[12%]">
                <Text className="text-base pb-[2%] font-light">Email</Text>
                <View className="flex-row items-center border rounded-3xl w-full h-[53px] mb-5 bg-white px-3">
                    <Icon name="email" size={24} color="green" />
                    <TextInput
                        className="flex-1 h-[40px] text-base pl-2"
                        placeholder="Email"
                        onChangeText={setEmail}
                        value={email}
                    />
                </View>
                <Text className="text-base pb-[2%] font-light">Password</Text>
                <View className="flex-row items-center border rounded-3xl w-full h-[53px] mb-5 bg-white px-3">
                    <Icon name="lock" size={24} color="green" />
                    <TextInput
                        className="flex-1 h-[40px] text-base pl-2"
                        placeholder="Password"
                        secureTextEntry={secureTextEntry}
                        onChangeText={setPassword}
                        value={password}
                    />
                    <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                        <Icon name={secureTextEntry ? "eye-off-outline" : "eye-outline"} size={24} color="green" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    className="bg-[#2AAD7A] w-full h-[50px] rounded-3xl shadow-2xl items-center justify-center"
                    onPress={handleLogin}
                >
                    <Text className="text-center text-xl font-light text-white">Sign In</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default Login;
