import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './types';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import environment from '../environment';

const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

interface Crop {
    id: string;
    cropName: string;
}

// Define navigation and route props
type UnregisteredCropDetailsNavigationProp = StackNavigationProp<RootStackParamList, 'UnregisteredCropDetails'>;
type UnregisteredCropDetailsRouteProp = RouteProp<RootStackParamList, 'UnregisteredCropDetails'>;

interface UnregisteredCropDetailsProps {
    navigation: UnregisteredCropDetailsNavigationProp;
    route: UnregisteredCropDetailsRouteProp;
}

const UnregisteredCropDetails: React.FC<UnregisteredCropDetailsProps> = ({ navigation }) => {
    const [cropCount, setCropCount] = useState(1);
    const [cropNames, setCropNames] = useState<Crop[]>([]);
    const [selectedCrop, setSelectedCrop] = useState<{ id: string; name: string } | null>(null);
    const [varieties, setVarieties] = useState<{ id: string; variety: string }[]>([]);
    const [selectedVariety, setSelectedVariety] = useState<string | null>(null);
    const [unitPrices, setUnitPrices] = useState<{ [key: string]: number | null }>({ A: null, B: null, C: null });
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({ A: 0, B: 0, C: 0 });
    const [total, setTotal] = useState<number>(0);
    const [image, setImage] = useState<any>(null); // For image uploading

    useEffect(() => {
        // Fetch crop names on component mount
        const fetchCropNames = async () => {
            try {
                const response = await api.get<Crop[]>('api/unregisteredfarmercrop/get-crop-names');
                const uniqueCropNames = response.data.reduce((acc: Crop[], crop: Crop) => {
                    if (!acc.some((item: Crop) => item.cropName === crop.cropName)) {
                        acc.push(crop);
                    }
                    return acc;
                }, []);
                setCropNames(uniqueCropNames);
            } catch (error) {
                console.error('Error fetching crop names:', error);
            }
        };

        fetchCropNames();
    }, []);

    const handleCropChange = async (crop: { id: string; name: string }) => {
        setSelectedCrop(crop);
        setSelectedVariety(null);
        setUnitPrices({ A: null, B: null, C: null });
        setQuantities({ A: 0, B: 0, C: 0 }); // Reset quantities

        try {
            const varietiesResponse = await api.get(`api/unregisteredfarmercrop/crops/varieties/${crop.name}`);
            setVarieties(varietiesResponse.data);
        } catch (error) {
            console.error('Error fetching varieties:', error);
        }
    };

    const handleVarietyChange = async (varietyId: string) => {
        setSelectedVariety(varietyId);

        try {
            const pricesResponse = await api.get(`api/unregisteredfarmercrop/unitPrices/${varietyId}`);
            const prices = pricesResponse.data.reduce((acc: any, curr: any) => {
                acc[curr.grade] = curr.price;
                return acc;
            }, {});
            setUnitPrices(prices);
        } catch (error) {
            console.error('Error fetching unit prices for selected variety:', error);
        }
    };

    const incrementCropCount = () => {
        setCropCount(cropCount + 1);
    };

    const handleQuantityChange = (grade: string, value: string) => {
        const quantity = parseInt(value) || 0;
        setQuantities(prev => ({ ...prev, [grade]: quantity }));
        calculateTotal();
    };

    const calculateTotal = () => {
        const totalPrice = Object.keys(unitPrices).reduce((acc, grade) => {
            const price = unitPrices[grade] || 0;
            const quantity = quantities[grade] || 0;
            return acc + (price * quantity);
        }, 0);
        setTotal(totalPrice);
    };

    const handleSubmit = async () => {
        if (!selectedCrop || !selectedVariety) {
            alert("Please select both crop and variety");
            return;
        }

        const payload = {
            userId: 1, // Assuming you have a way to get the current user ID
            collectionOfficerId: 1, // Assuming you have a way to get the officer ID
            cropName: selectedCrop.name,
            quality: selectedVariety, // Assuming this is the correct mapping for quality
            unitPrice: unitPrices['A'] || 0, // Change according to your requirement
            weight: quantities['A'] || 0, // Change according to your requirement
            total,
            image: image ? image : null, // If you have an image to upload
        };

        try {
            const response = await api.post('api/registeredfarmerpayments', payload);
            console.log('Data submitted successfully:', response.data);
            alert("Payment details submitted successfully!");
            // Navigate back or to another screen
            navigation.goBack();
        } catch (error) {
            console.error('Error submitting data:', error);
            alert("There was an error submitting your details.");
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-50 px-6 py-4">
            <View className="flex-row items-center mt-1 mb-6">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                    <AntDesign name="left" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-center ml-[26%] text-lg font-semibold">Fill Details</Text>
            </View>

            <Text className="text-center text-md font-medium mt-2">Crop {cropCount}</Text>
            <View className="mb-6 border-b p-2 border-gray-200 pb-6">
                <Text className="text-gray-600 mt-4">Crop Name</Text>
                <View className="border border-gray-300 rounded-md mt-2 p-2">
                    <Picker
                        selectedValue={selectedCrop?.name || null}
                        onValueChange={(itemValue: any) => {
                            const crop = cropNames.find(c => c.cropName === itemValue);
                            if (crop) handleCropChange({ id: crop.id, name: crop.cropName });
                        }}
                        style={{ height: 50, width: '100%' }}
                    >
                        <Picker.Item label="Select Crop" value={null} />
                        {cropNames.map((crop) => (
                            <Picker.Item key={crop.id} label={crop.cropName} value={crop.cropName} />
                        ))}
                    </Picker>
                </View>

                <Text className="text-gray-600 mt-4">Variety</Text>
                <View className="border border-gray-300 rounded-md mt-2 p-2">
                    <Picker
                        selectedValue={selectedVariety || null}
                        onValueChange={(itemValue: any) => handleVarietyChange(itemValue)}
                        style={{ height: 50, width: '100%' }}
                        enabled={!!selectedCrop}
                    >
                        <Picker.Item label="Select Variety" value={null} />
                        {varieties.map((variety) => (
                            <Picker.Item key={variety.id} label={variety.variety} value={variety.id} /> 
                        ))}
                    </Picker>
                </View>

                {/* Unit Prices according to Grades */}
                <Text className="text-gray-600 mt-4">Unit Prices according to Grades</Text>
                <View className="border border-gray-300 rounded-lg mt-2 p-4">
                    {['A', 'B', 'C'].map((grade) => (
                        <View key={grade} className="flex-row items-center mb-3">
                            <Text className="w-8 text-gray-600">{grade}</Text>
                            <TextInput
                                placeholder="Rs."
                                keyboardType="numeric"
                                className="flex-1 border border-gray-300 rounded-md p-2 mx-2 text-gray-600"
                                value={unitPrices[grade]?.toString() || ''}
                                editable={false}
                            />
                            <TextInput
                                placeholder="kg"
                                keyboardType="numeric"
                                className="flex-1 border border-gray-300 rounded-md p-2 text-gray-600"
                                value={quantities[grade].toString()}
                                onChangeText={value => handleQuantityChange(grade, value)}
                            />
                        </View>
                    ))}
                </View>

                <TouchableOpacity className="mt-4 py-2 bg-black rounded-md">
                    <Text className="text-center text-white">Add Image</Text>
                </TouchableOpacity>

                {/* Total Display */}
                <Text className="text-gray-600 mt-4">Total (Rs.)</Text>
                <View className="border border-gray-300 rounded-md mt-2 p-2">
                    <TextInput 
                        placeholder="--Auto Fill--" 
                        editable={false} 
                        value={total.toString()} 
                        className="text-gray-600" 
                    />
                </View>

                {/* Add More Button */}
                <TouchableOpacity onPress={incrementCropCount} className="bg-green-500 rounded-md p-4 mt-2">
                    <Text className="text-center text-white font-semibold">Add more</Text>
                </TouchableOpacity>

                {/* Done Button */}
                <TouchableOpacity onPress={handleSubmit} className="border border-black rounded-md p-4 mt-4">
                    <Text className="text-center text-black font-semibold">Done</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default UnregisteredCropDetails;
