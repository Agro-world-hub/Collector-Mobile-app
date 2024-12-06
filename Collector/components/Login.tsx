import { View, Text, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import the icon library
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import environment from '../environment/environment';

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type LoginNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginProps {
    navigation: LoginNavigationProp;
}

const loginImage = require('@/assets/images/login.png');

const Login: React.FC<LoginProps> = ({ navigation }) => {
    const [empid, setEmapid] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const handleLogin = async () => {
        try {
            // Replace `api.post` with `fetch` and pass the request payload as JSON
            
            const response = await fetch(`${environment.API_BASE_URL}api/collection-officer/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    empid,
                    password,
                }),
            });
    
            // Check if the response is successful
            if (!response.ok) {
                throw new Error('Invalid email or password.');
            }
    
            // Parse the response data
            const data = await response.json();
            const { token, passwordUpdateRequired , payload} = data;
    
            // Store token in AsyncStorage if received
            if (token) {
                await AsyncStorage.setItem('token', token);
                console.log('Token stored:', token); // Log token storage for debugging
            } else {
                console.error('No token received from the server.');
            }
    
            // Navigate to the appropriate screen based on password update requirement
            if (passwordUpdateRequired === true) {
                navigation.navigate('ChangePassword', { empid } as any);
            } else {
                navigation.navigate('Dashboard');
            }
        } catch (error) {
            // Log any error that occurs
            console.error('Login error:', error);
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
                <Text className="text-base pb-[2%] font-light">Employee ID</Text>
                <View className="flex-row items-center border rounded-3xl w-full h-[53px] mb-5 bg-white px-3">
                    <Icon name="email" size={24} color="green" />
                    <TextInput
                        className="flex-1 h-[40px] text-base pl-2"
                        placeholder="Email"
                        onChangeText={setEmapid}
                        value={empid}
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
