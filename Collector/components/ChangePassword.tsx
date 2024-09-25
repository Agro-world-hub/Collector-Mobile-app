import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import the icon library
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';

type ChangePasswordNavigationProp = StackNavigationProp<RootStackParamList, 'ChangePassword'>;

interface ChangePasswordProps {
    navigation: ChangePasswordNavigationProp;
    route: {
        params: {
            email: string;
        };
    };
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ navigation, route }) => {
    const { email } = route.params;
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureCurrent, setSecureCurrent] = useState(true);
    const [secureNew, setSecureNew] = useState(true);
    const [secureConfirm, setSecureConfirm] = useState(true);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New password and confirm password do not match.');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'New password must be at least 6 characters long.');
            return;
        }

        try {
            const response = await axios.post('http://10.0.2.2:3001/api/collection-officer/change-password', {
                email,
                currentPassword,
                newPassword,
            });

            Alert.alert('Success', 'Password updated successfully');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Error', 'Failed to update password.');
        }
    };

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="flex-1 h-full pt-[10%] bg-white">
                <View className="items-center pt-[10%]">
                    <Text className="font-bold text-xl">Choose a New Password</Text>
                    <Text className="w-[53%] text-center font-light pt-3">
                        Choose your new password to access your account
                    </Text>
                </View>

                <View className="ml-[10%] pt-[12%]">
                    <Text className="font-normal pb-2">Current Password</Text>
                    <View className="flex-row items-center border rounded-3xl w-[90%] h-[53px] mb-5 bg-white px-3">
                        <TextInput
                            className="flex-1 h-[40px] text-base"
                            placeholder="Current Password"
                            secureTextEntry={secureCurrent}
                            onChangeText={setCurrentPassword}
                            value={currentPassword}
                        />
                        <TouchableOpacity onPress={() => setSecureCurrent(!secureCurrent)}>
                            <Icon name={secureCurrent ? "eye-off-outline" : "eye-outline"} size={24} color="green" />
                        </TouchableOpacity>
                    </View>

                    <Text className="font-normal pb-2">New Password</Text>
                    <View className="flex-row items-center border rounded-3xl w-[90%] h-[53px] mb-5 bg-white px-3">
                        <TextInput
                            className="flex-1 h-[40px] text-base"
                            placeholder="New Password"
                            secureTextEntry={secureNew}
                            onChangeText={setNewPassword}
                            value={newPassword}
                        />
                        <TouchableOpacity onPress={() => setSecureNew(!secureNew)}>
                            <Icon name={secureNew ? "eye-off-outline" : "eye-outline"} size={24} color="green" />
                        </TouchableOpacity>
                    </View>

                    <Text className="font-normal pb-2">Confirm New Password</Text>
                    <View className="flex-row items-center border rounded-3xl w-[90%] h-[53px] mb-5 bg-white px-3">
                        <TextInput
                            className="flex-1 h-[40px] text-base"
                            placeholder="Confirm New Password"
                            secureTextEntry={secureConfirm}
                            onChangeText={setConfirmPassword}
                            value={confirmPassword}
                        />
                        <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
                            <Icon name={secureConfirm ? "eye-off-outline" : "eye-outline"} size={24} color="green" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="items-center pt-7 gap-y-5">
                    <TouchableOpacity
                        className="bg-[#2AAD7A] w-[60%] h-[40px] rounded-3xl"
                        onPress={handleChangePassword}
                    >
                        <Text className="text-center pt-1 text-xl font-light text-white">Next</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-white border w-[60%] h-[40px] rounded-3xl"
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text className="text-center pt-1 text-xl font-light text-black">Skip</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default ChangePassword;
