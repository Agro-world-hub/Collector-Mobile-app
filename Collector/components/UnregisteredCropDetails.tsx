import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView,Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp,useRoute } from '@react-navigation/native';
import { RootStackParamList } from './types';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    const [image, setImage] = useState<any>(null);
    const [crops, setCrops] = useState<any[]>([]);
    const [selectedVarietyName, setSelectedVarietyName] = useState<string | null>(null);
   
    const route = useRoute<UnregisteredCropDetailsRouteProp>();
    const { userId } = route.params;
    console.log(userId)

    useEffect(() => {
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
        setQuantities({ A: 0, B: 0, C: 0 });

        try {
            const varietiesResponse = await api.get(`api/unregisteredfarmercrop/crops/varieties/${crop.name}`);
            setVarieties(varietiesResponse.data);
        } catch (error) {
            console.error('Error fetching varieties:', error);
        }
    };

   

    const handleVarietyChange = async (varietyId: string) => {
        setSelectedVariety(varietyId);  // This should be correct
    
        const selectedVariety = varieties.find(variety => variety.id === varietyId);
        if (selectedVariety) {
            setSelectedVarietyName(selectedVariety.variety); // Store the name of the selected variety
        }
    
        try {
            const pricesResponse = await api.get(`api/unregisteredfarmercrop/unitPrices/${varietyId}`);
            const prices = pricesResponse.data.reduce((acc: any, curr: any) => {
                acc[curr.grade] = curr.price;
                return acc;
            }, {});
            setUnitPrices(prices);
            calculateTotal(); // Calculate total after setting unit prices
        } catch (error) {
            console.error('Error fetching unit prices for selected variety:', error);
        }
    };
    
    
    
    const handleQuantityChange = (grade: string, value: string) => {
        const quantity = parseInt(value) || 0;
        setQuantities(prev => ({ ...prev, [grade]: quantity }));
        calculateTotal(); // Calculate total after updating quantities
    };
    
        // useEffect to recalculate total when unitPrices or quantities change
        useEffect(() => {
            calculateTotal();
        }, [unitPrices, quantities]);

        const calculateTotal = () => {
            const totalPrice = Object.keys(unitPrices).reduce((acc, grade) => {
                const price = unitPrices[grade] || 0; // default to 0 if price is null
                const quantity = quantities[grade] || 0; // default to 0 if quantity is 0
                return acc + (price * quantity);
            }, 0);
            setTotal(totalPrice);
        };
    

      // Modify the new crop structure in the incrementCropCount function
      const incrementCropCount = () => {
        if (!selectedCrop || !selectedVariety) {
            alert("Please select both a crop and a variety before adding.");
            return;
        }

        const newCrop = {
            cropName: selectedCrop.name || '',
            variety: selectedVariety || null,
            unitPriceA: unitPrices.A || 0,
            weightA: quantities.A || 0,
            unitPriceB: unitPrices.B || 0,
            weightB: quantities.B || 0,
            unitPriceC: unitPrices.C || 0,
            weightC: quantities.C || 0,
            total: total || 0,
            image: image?.assets[0]?.base64 || null,
        };

        // Use a functional update to preserve previous crops
        setCrops(prevCrops => {
            console.log('Adding new crop:', newCrop);
            return [...prevCrops, newCrop]; // Append new crop to the existing array
        });

        // Reset input fields if necessary
        resetCropEntry(); // Ensure this function resets the right fields
    };
    
            const resetCropEntry = () => {
                setSelectedCrop(null);
                setSelectedVariety(null);
                setUnitPrices({ A: null, B: null, C: null });
                setQuantities({ A: 0, B: 0, C: 0 });
                setTotal(0);
                setImage(null);
            };
                    
        

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });

        if (!result.canceled) {
            setImage(result);
        }
    };

    
    const handleSubmit = async () => {
        const token = await AsyncStorage.getItem('token');
    
        const payload = {
            farmerId: userId,
            crops: crops.map(crop => ({
                cropName: crop.cropName || '',
                variety: selectedVarietyName || null, // Use the variety name instead of ID
                unitPriceA: crop.unitPriceA || 0,
                weightA: crop.weightA || 0,
                unitPriceB: crop.unitPriceB || 0,
                weightB: crop.weightB || 0,
                unitPriceC: crop.unitPriceC || 0,
                weightC: crop.weightC || 0,
                total: crop.total || 0,
                image: crop.image || null,
            })),
        };
    
        console.log('Payload before sending:', payload); // Log the payload here for debugging
    
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`, // Ensure the token is properly formatted
                },
            };
    
            await api.post('api/unregisteredfarmercrop/add-crops', payload, config);
            console.log('Crops added successfully', payload);
            alert("All crop details submitted successfully!");
            navigation.navigate('ReportPage' as any,{userId});
        } catch (error) {
            console.error('Error submitting crop data:', error);
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

                <View>
                <TouchableOpacity onPress={handleImagePick} className="mt-4 py-2 bg-black rounded-md">
                    <Text className="text-center text-white">Add Image</Text>

                </TouchableOpacity>
                {image && (
                    <Image
                        source={{ uri: `data:image/jpeg;base64,${image.assets[0].base64}` }}
                        style={{ width: 200, height: 200, marginTop: 10 ,marginLeft:70 }}
                    />
                )}
                </View>


                {/* Total and Buttons */}
                <Text className="text-gray-600 mt-4">Total (Rs.)</Text>
                <View className="border border-gray-300 rounded-md mt-2 p-2">
                    <TextInput 
                        placeholder="--Auto Fill--" 
                        editable={false} 
                        value={total.toString()} 
                        className="text-gray-600" 
                    />
                </View>

                <TouchableOpacity onPress={incrementCropCount} className="bg-green-500 rounded-md p-4 mt-2">
                    <Text className="text-center text-white font-semibold">Add more</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSubmit} className="border border-black rounded-md p-4 mt-4">
                    <Text className="text-center text-black font-semibold">Done</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default UnregisteredCropDetails;
