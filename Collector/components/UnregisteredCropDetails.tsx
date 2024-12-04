import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView,Image, Alert } from 'react-native';
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
    cropNameEnglish: string;
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
                const response = await api.get('api/unregisteredfarmercrop/get-crop-names');
                
                console.log(response.data);
                const uniqueCropNames = response.data.reduce((acc: { cropNameEnglish: any; }[], crop: { cropNameEnglish: any; }) => {
                    if (!acc.some((item: { cropNameEnglish: any; }) => item.cropNameEnglish === crop.cropNameEnglish)) {
                        acc.push(crop); // Push unique crop names
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
    
    const handleCropChange = async (crop: { id: string; cropNameEnglish: string }) => {
        // Update the selected crop state
        setSelectedCrop({ id: crop.id, name: crop.cropNameEnglish });
        console.log(crop.cropNameEnglish);  // Log the selected crop name
    
        // Reset other states
        setSelectedVariety(null);
        setUnitPrices({ A: null, B: null, C: null });
        setQuantities({ A: 0, B: 0, C: 0 });
    
        try {
            // Use the crop ID to fetch varieties from the API
            const varietiesResponse = await api.get(`api/unregisteredfarmercrop/crops/varieties/${crop.id}`);
            console.log('Varieties response:', varietiesResponse.data);  // Log to verify the response structure
    
            // Ensure the response is valid and has data
            if (varietiesResponse.data && Array.isArray(varietiesResponse.data)) {
                // Update the varieties state with the response data
                setVarieties(varietiesResponse.data.map((variety: { id: string, varietyNameEnglish: string }) => ({
                    id: variety.id,  // Use the actual variety ID
                    variety: variety.varietyNameEnglish
                })));
            } else {
                console.error('Varieties response is not an array or is empty.');
            }
        } catch (error) {
            console.error('Error fetching varieties:', error); // Log any errors
        }
    };
    
    

   

    const handleVarietyChange = async (varietyId: string) => {
        setSelectedVariety(varietyId);  // Set the selected variety ID
    
        // Find the selected variety name by the ID
        const selectedVariety = varieties.find(variety => variety.id === varietyId);
        if (selectedVariety) {
            setSelectedVarietyName(selectedVariety.variety); // Store the name of the selected variety
        }
    
        try {
            // Send the selected varietyId to fetch unit prices
            const pricesResponse = await api.get(`api/unregisteredfarmercrop/unitPrices/${varietyId}`);
    
            // Check if the response status is 404 (Not Found)
            if (pricesResponse.status === 404) {
                Alert.alert('No Prices Available', 'Prices for the selected variety were not found.');
                setUnitPrices({});  // Clear any previously set prices
                return;  // Stop further execution
            }
    
            console.log(pricesResponse.data);  // Log the response to verify the data
    
            // Check if there are no prices in the response body
            if (pricesResponse.data && pricesResponse.data.length === 0) {
                // Show an alert if no prices are available
                Alert.alert('No Prices Available', 'No prices are available for the selected variety.');
                setUnitPrices({});  // Clear any previously set prices
                return;  // Do not proceed with setting prices or calculating the total
            }
    
            // Process the prices data (map it by grade)
            const prices = pricesResponse.data.reduce((acc: any, curr: any) => {
                acc[curr.grade] = curr.price;
                return acc;
            }, {});
    
            // Set the unit prices
            setUnitPrices(prices);
            calculateTotal();  // Recalculate total after setting prices
        } catch (error) {
            console.error('Error fetching unit prices for selected variety:', error);
            // You can handle other error cases here, for example:
            Alert.alert('Error', 'no any prices found !');
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
            cropId: selectedCrop.id || '', // Include crop ID
            varietyId: selectedVariety || '', // Include the varietyId for the selected variety
            gradeAprice: unitPrices.A || 0,  // Updated field names for backend alignment
            gradeAquan: quantities.A || 0,   // Updated field names for backend alignment
            gradeBprice: unitPrices.B || 0,
            gradeBquan: quantities.B || 0,
            gradeCprice: unitPrices.C || 0,
            gradeCquan: quantities.C || 0,
            image: image?.assets[0]?.base64 || null,
        };
    
        // Append new crop to the existing array
        setCrops(prevCrops => {
            console.log('Adding new crop:', newCrop);
            return [...prevCrops, newCrop];
        });
    
        // Reset input fields
        resetCropEntry();
    };
    
    
    const resetCropEntry = () => {
        setSelectedCrop(null);
        setSelectedVariety(null);
        setUnitPrices({ A: null, B: null, C: null });
        setQuantities({ A: 0, B: 0, C: 0 });
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
        try {
            // Retrieve the token from AsyncStorage
            const token = await AsyncStorage.getItem('token');
    
            // Construct the payload using the selected variety ID
            const payload = {
                farmerId: userId, // Farmer ID
                crops: crops.map(crop => ({
                    varietyId: crop.varietyId || '', // Include variety ID (ensure this is stored in the state for each crop)
                    gradeAprice: crop.gradeAprice || 0,
                    gradeAquan: crop.gradeAquan || 0,
                    gradeBprice: crop.gradeBprice || 0,
                    gradeBquan: crop.gradeBquan || 0,
                    gradeCprice: crop.gradeCprice || 0,
                    gradeCquan: crop.gradeCquan || 0,
                    image: crop.image || null, // Include image if provided
                })),
            };
    
            console.log('Payload before sending:', payload);
    
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
    
            // Make the API call to submit crop data
            await api.post('api/unregisteredfarmercrop/add-crops', payload, config);
    
            console.log('Crops added successfully', payload);
            alert('All crop details submitted successfully!');
            
            // Navigate to the ReportPage
            navigation.navigate('ReportPage' as any, { userId });
        } catch (error) {
            console.error('Error submitting crop data:', error);
            alert('Failed to submit crop details. Please try again.');
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
                    selectedValue={selectedCrop?.id || null} // Use the crop's id for selection
                    onValueChange={(itemValue: string | null) => {
                        const crop = cropNames.find(c => c.id === itemValue); // Find the crop by id
                        if (crop) handleCropChange({ id: crop.id, cropNameEnglish: crop.cropNameEnglish }); // Pass the correct object structure
                    }}
                    style={{ height: 50, width: '100%' }}
                >
                    <Picker.Item label="Select Crop" value={null} />
                    {cropNames.map((crop) => (
                        <Picker.Item key={crop.id} label={crop.cropNameEnglish} value={crop.id} /> // Use id as the value
                    ))}
                </Picker>

                </View>

                <Text className="text-gray-600 mt-4">Variety</Text>
                <View className="border border-gray-300 rounded-md mt-2 p-2">
                <Picker
                    selectedValue={selectedVariety || null}
                    onValueChange={(itemValue: any) => handleVarietyChange(itemValue)}
                    style={{ height: 50, width: '100%' }}
                    enabled={!!selectedCrop}  // Ensure Picker is only enabled after selecting a crop
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
