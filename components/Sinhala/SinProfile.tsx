import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type SinProfileNavigationProp = StackNavigationProp<RootStackParamList, 'SinProfile'>;

interface SinProfileProps {
    navigation: SinProfileNavigationProp;
}

const SinProfile: React.FC<SinProfileProps> = ({ navigation }) => {
    const [isLanguageDropdownOpen, setLanguageDropdownOpen] = useState<boolean>(false);
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [isModalVisible, setModalVisible] = useState<boolean>(false);

    const handleLanguageSelect = (language: string) => {
        setSelectedLanguage(language);
        setLanguageDropdownOpen(false);
    };

    const handleCall = () => {
        const phoneNumber = '+1234567890'; // Replace with the actual number
        const url = `tel:${phoneNumber}`;
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(url);
                } else {
                    Alert.alert('දෝෂයක්', 'අමතන උපකරණ විවෘත කළ නොහැක.');
                }
            })
            .catch((err) => console.error('දෝෂයක් ඇති විය', err));
    };

    const handleLogout = async () => {
        try {
            // Handle logout logic
            // For example, clear authentication tokens or session data
            // Redirect to the login screen
            // navigation.navigate('Signin');
        } catch (error) {
            console.error('ඉවත්වීමේදී දෝෂයක් ඇතිවී ඇත:', error);
            Alert.alert('දෝෂයක්', 'පිටවීමට අසමත් විය.');
        }
    };

    const handleEditClick = () => {
        // navigation.navigate('EngEditProfile');
    };

    return (
        <View className="flex-1 bg-white p-10 mt-2.5">
            {/* Profile Card */}
            <View className="flex-row items-center mb-4">
                <Image
                    source={require('@/assets/images/profile.webp')}
                    className="w-12 h-12 rounded-full mr-3"
                />
                <View className="flex-1">
                    <Text className="text-lg mb-1">John Doe</Text>
                    <Text className="text-sm text-gray-500">සමාගම</Text>
                </View>
                <TouchableOpacity onPress={handleEditClick}>
                    <Ionicons name="pencil" size={30} color="#2fcd46" />
                </TouchableOpacity>
            </View>

            {/* Horizontal Line */}
            <View className="h-0.5 bg-black my-2 mt-10" />

            {/* Language Settings */}
            <TouchableOpacity
                onPress={() => setLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex-row items-center py-3"
            >
                <Ionicons name="globe-outline" size={20} color="black" />
                <Text className="flex-1 text-lg ml-2">භාෂා සැකසීම්</Text>
                <Ionicons name={isLanguageDropdownOpen ? "chevron-up" : "chevron-down"} size={20} color="black" />
            </TouchableOpacity>

            {isLanguageDropdownOpen && (
                <View className="pl-8">
                    {['English', 'Tamil', 'Sinhala'].map(language => (
                        <TouchableOpacity
                            key={language}
                            onPress={() => handleLanguageSelect(language)}
                            className={`flex-row items-center py-2 px-4 rounded-lg my-1 ${selectedLanguage === language ? 'bg-green-100' : 'bg-transparent'}`}
                        >
                            <Text className={`text-base ${selectedLanguage === language ? 'text-black' : 'text-gray-500'}`}>
                                {language}
                            </Text>
                            {selectedLanguage === language && (
                                <View className="absolute right-4">
                                    <Ionicons name="checkmark" size={20} color="black" />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Horizontal Line */}
            <View className="h-0.5 bg-black my-4" />

            {/* View My QR Code */}
            <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
            // onPress={() => navigation.navigate('EngQRcode')}
            >
                <Ionicons name="qr-code" size={20} color="black" />
                <Text className="flex-1 text-lg ml-2">මගේ QR කේතය බලන්න</Text>
            </TouchableOpacity>

            {/* Horizontal Line */}
            <View className="h-0.5 bg-black my-4" />

            {/* Plant Care Help */}
            <TouchableOpacity className="flex-row items-center py-3" onPress={() => setModalVisible(true)}>
                <Ionicons name="lock-closed-outline" size={20} color="black" />
                <Text className="flex-1 text-lg ml-2">මුරපදය වෙනස් කරන්න</Text>
            </TouchableOpacity>


            {/* Horizontal Line */}
            <View className="h-0.5 bg-black my-4" />

            {/* Logout */}
            <TouchableOpacity className="flex-row items-center py-3" onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="red" />
                <Text className="flex-1 text-lg ml-2 text-red-500">ලොග් අවුට්</Text>
            </TouchableOpacity>

            {/* Modal for Call */}
            <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black opacity-50">
                    <View className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <View className="flex-row justify-center mb-4">
                            <View className="bg-gray-200 rounded-full p-4">
                                <Image
                                    source={require('@/assets/images/ringer.webp')} // Replace with your call ringing PNG path
                                    className="w-16 h-16"
                                />
                            </View>
                        </View>
                        <Text className="text-xl font-bold text-center mb-2">උදව් අවශ්‍යද?</Text>
                        <Text className="text-lg text-center mb-4">
                            PlantCare උදව් අවශ්‍යද? අපගේ උදව් මධ්‍යස්ථානයෙන් ඉක්මන් සහාය ලබා ගැනීමට ඇමතුමක් ලබා දෙන්න.
                        </Text>
                        <View className="flex-row justify-around">
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                className="bg-gray-200 p-3 rounded-full flex-1 mx-2"
                            >
                                <Text className="text-center">අවලංගු කරන්න</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleCall}
                                className="bg-green-500 p-3 rounded-full flex-1 mx-2"
                            >
                                <Text className="text-center text-white">ඇමතුමක්</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default SinProfile;
