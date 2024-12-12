// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import axios from 'axios';
// import environment from '../environment/environment';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from './types';
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';
// import * as MediaLibrary from 'expo-media-library';
// // import { decode as atob } from 'base-64'; // To decode base64 string

// const api = axios.create({
//   baseURL: environment.API_BASE_URL,
// });

// type FarmerQrNavigationProp = StackNavigationProp<RootStackParamList, 'FarmerQr'>;

// interface FarmerQrProps {
//   navigation: FarmerQrNavigationProp;
// }

// type FarmerQrRouteProp = RouteProp<RootStackParamList, 'FarmerQr'>;

// const FarmerQr: React.FC<FarmerQrProps> = ({ navigation }) => {
//   const [farmerName, setFarmerName] = useState('');
//   const [farmerNIC, setFarmerNIC] = useState('');
//   const [farmerQRCode, setFarmerQRCode] = useState(''); // Base64 QR code image
//   const [permissionsGranted, setPermissionsGranted] = useState(false);
//   const [farmerPhone, setFarmerPhone] = useState('');

//   const route = useRoute<FarmerQrRouteProp>();
//   const { userId } = route.params;
//   console.log('-----user Id ----',userId)

//   useEffect(() => {
//     const fetchFarmerData = async () => {
//       try {
//         const response = await api.get(`api/farmer/register-farmer/${userId}`);
//         const { firstName, lastName, NICnumber, qrCode,phoneNumber } = response.data;
//         setFarmerName(`${firstName} ${lastName}`);
//         setFarmerNIC(NICnumber);
//         setFarmerQRCode(qrCode);
//         setFarmerPhone(phoneNumber); 
//       } catch (error) {
//         Alert.alert('Error', 'Failed to fetch farmer details');
//       }
//     };

//     fetchFarmerData();

//     // Request permissions for saving images
//     const getPermissions = async () => {
//       const { status } = await MediaLibrary.requestPermissionsAsync();
//       setPermissionsGranted(status === 'granted');
//     };

//     getPermissions();
//   }, [userId]);

//   const downloadImage = async () => {
//     if (!permissionsGranted) {
//       Alert.alert('Permission Denied', 'You need to grant permission to save images');
//       return;
//     }

//     try {
//       // Decode base64 image
//       const base64Code = farmerQRCode.replace(/^data:image\/png;base64,/, '');
//       const fileUri = FileSystem.documentDirectory + `farmer_qr_${userId}.png`;

//       // Save the base64 image as a file
//       await FileSystem.writeAsStringAsync(fileUri, base64Code, { encoding: FileSystem.EncodingType.Base64 });

//       // Save to gallery
//       const asset = await MediaLibrary.createAssetAsync(fileUri);
//       await MediaLibrary.createAlbumAsync('Download', asset, false);
//       Alert.alert('Download Success', 'QR Code saved to your gallery!');
//     } catch (error) {
//       console.log('Error =>', error);
//       Alert.alert('Error', 'Failed to download the QR Code');
//     }
//   };

//   const shareImage = async () => {
//     try {
//       // Decode base64 image
//       const base64Code = farmerQRCode.replace(/^data:image\/png;base64,/, '');
//       const fileUri = FileSystem.documentDirectory + `farmer_qr_${userId}.png`;

//       // Save the base64 image as a file
//       await FileSystem.writeAsStringAsync(fileUri, base64Code, { encoding: FileSystem.EncodingType.Base64 });

//       // Share the image
//       await Sharing.shareAsync(fileUri, {
//         dialogTitle: 'Share QR Code',
//         UTI: 'image/png', // Ensure correct UTI
//       });
//     } catch (error) {
//       console.log('Error =>', error);
//       Alert.alert('Error', 'Failed to share the QR Code');
//     }
//   };

//   return (
//     <View className="flex-1 bg-white p-5">
//       {/* Header with Back Icon */}
//       <View className="flex-row items-center mb-4">
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Image
//             source={require('../assets/images/back.png')} // Path to your back icon
//             style={{ width: 24, height: 24 }}
//           />
//         </TouchableOpacity>
//         <Text className="text-xl font-bold ml-[27%]">Farmer Details</Text>
//       </View>

//       {/* Farmer Name and NIC */}
//       <View className="items-center mt-[10%]">
//         <Text className="text-lg font-bold mb-2">{farmerName}</Text>
//         <Text className="text-gray-500 mb-9">{farmerNIC}</Text>

//         {/* QR Code */}
//         {farmerQRCode ? (
//           <Image
//             source={{ uri: farmerQRCode }} // Display the Base64 QR code image
//             style={{ width: 300, height: 300, borderWidth: 1, borderColor: '#00C853' }} // Adding border and dimensions
//           />
//         ) : (
//           <Text className="text-red-500">QR Code not available</Text>
//         )}
//       </View>

//       {/* Buttons Wrapper */}
//       <View className="items-center mt-8">
//         {/* Collect Button */}
//         <TouchableOpacity className="bg-[#2AAD7A] w-[300px] py-3 rounded-full items-center"  onPress={()=> navigation.navigate('UnregisteredCropDetails' as any,{userId})} >
//           <Text className="text-white text-lg">Collect</Text>
//         </TouchableOpacity>

//         {/* Complain Button */}
//         <TouchableOpacity 
//           className="border border-gray-400 w-[300px] mt-4 py-3 rounded-full items-center" 
//           onPress={() => navigation.navigate('ComplainPage' as any, {
//             farmerName,
//             farmerPhone
//           })}
//         >
//   <Text className="text-gray-700 text-lg">Report a Complain</Text>
// </TouchableOpacity>

//       </View>

//       {/* Download and Share buttons */}
//       <View className="flex-row justify-around w-full mt-6">
//         <TouchableOpacity className="bg-gray-600 p-4 h-[80px] w-[120px] rounded-lg items-center" onPress={downloadImage}>
//           <Image
//             source={require('../assets/images/download.png')} // Path to download icon
//             style={{ width: 24, height: 24 }}
//           />
//           <Text className="text-sm text-cyan-50">Download</Text>
//         </TouchableOpacity>

//         <TouchableOpacity className="bg-gray-600 p-4 h-[80px] w-[120px] rounded-lg items-center" onPress={shareImage}>
//           <Image
//             source={require('../assets/images/Share.png')} // Path to share icon
//             style={{ width: 24, height: 24 }}
//           />
//           <Text className="text-sm text-cyan-50">Share</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default FarmerQr;


import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import axios from 'axios';
import environment from '../environment/environment';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

// Create API instance
const api = axios.create({
  baseURL: environment.API_BASE_URL,
});

type FarmerQrNavigationProp = StackNavigationProp<RootStackParamList, 'FarmerQr'>;

interface FarmerQrProps {
  navigation: FarmerQrNavigationProp;
}

type FarmerQrRouteProp = RouteProp<RootStackParamList, 'FarmerQr'>;

const FarmerQr: React.FC<FarmerQrProps> = ({ navigation }) => {
  const [farmerName, setFarmerName] = useState('');
  const [farmerNIC, setFarmerNIC] = useState('');
  const [farmerQRCode, setFarmerQRCode] = useState<string | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [farmerPhone, setFarmerPhone] = useState('');

  const route = useRoute<FarmerQrRouteProp>();
  const { userId } = route.params;

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        const response = await api.get(`api/farmer/register-farmer/${userId}`);
        const { firstName, lastName, NICnumber, qrCode, phoneNumber } = response.data;
        console.log(response.data);  // Log the response to check

        setFarmerName(`${firstName} ${lastName}`);
        setFarmerNIC(NICnumber);

        // Check qrCode data before proceeding
        if (qrCode) {
          console.log('QR Code Data:', qrCode);  // Log the qrCode Base64 string
          setFarmerQRCode(qrCode);  // Set the QR code as a base64 string
        } else {
          console.log('No QR Code data found');
        }

        setFarmerPhone(phoneNumber);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch farmer details');
      }
    };

    fetchFarmerData();

    // Request permissions for saving images
    const getPermissions = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setPermissionsGranted(status === 'granted');
    };

    getPermissions();
  }, [userId]);

  const downloadImage = async () => {
    if (!permissionsGranted) {
      Alert.alert('Permission Denied', 'You need to grant permission to save images');
      return;
    }

    try {
      if (!farmerQRCode) {
        Alert.alert('Error', 'No QR Code available');
        return;
      }

      // Decode base64 image
      const base64Code = farmerQRCode.replace(/^data:image\/png;base64,/, '');

      // Save the base64 image as a file
      const fileUri = FileSystem.documentDirectory + `farmer_qr_${userId}.png`;
      await FileSystem.writeAsStringAsync(fileUri, base64Code, { encoding: FileSystem.EncodingType.Base64 });

      // Save to gallery
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('Download', asset, false);
      Alert.alert('Download Success', 'QR Code saved to your gallery!');
    } catch (error) {
      console.log('Error =>', error);
      Alert.alert('Error', 'Failed to download the QR Code');
    }
  };

  const shareImage = async () => {
    try {
      if (!farmerQRCode) {
        Alert.alert('Error', 'No QR Code available');
        return;
      }

      // Decode base64 image
      const base64Code = farmerQRCode.replace(/^data:image\/png;base64,/, '');

      // Save the base64 image as a file
      const fileUri = FileSystem.documentDirectory + `farmer_qr_${userId}.png`;
      await FileSystem.writeAsStringAsync(fileUri, base64Code, { encoding: FileSystem.EncodingType.Base64 });

      // Share the image
      await Sharing.shareAsync(fileUri, {
        dialogTitle: 'Share QR Code',
        UTI: 'image/png', // Ensure correct UTI
      });
    } catch (error) {
      console.log('Error =>', error);
      Alert.alert('Error', 'Failed to share the QR Code');
    }
  };

  return (
    <View className="flex-1 bg-white p-5">
      {/* Header with Back Icon */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/images/back.png')} // Path to your back icon
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-[27%]">Farmer Details</Text>
      </View>

      {/* Farmer Name and NIC */}
      <View className="items-center mt-[10%]">
        <Text className="text-lg font-bold mb-2">{farmerName}</Text>
        <Text className="text-gray-500 mb-9">{farmerNIC}</Text>

        {/* QR Code */}
        {farmerQRCode ? (
          <Image
            source={{ uri: farmerQRCode }} // Display the Base64 QR code image directly
            style={{ width: 300, height: 300, borderWidth: 1, borderColor: '#00C853' }} // Adding border and dimensions
          />
        ) : (
          <Text className="text-red-500">QR Code not available</Text>
        )}
      </View>

      {/* Buttons Wrapper */}
      <View className="items-center mt-8">
        {/* Collect Button */}
        <TouchableOpacity className="bg-[#2AAD7A] w-[300px] py-3 rounded-full items-center" onPress={() => navigation.navigate('UnregisteredCropDetails' as any, { userId })}>
          <Text className="text-white text-lg">Collect</Text>
        </TouchableOpacity>

        {/* Complain Button */}
        <TouchableOpacity 
          className="border border-gray-400 w-[300px] mt-4 py-3 rounded-full items-center" 
          onPress={() => navigation.navigate('ComplainPage' as any, {
            farmerName,
            farmerPhone
          })}
        >
          <Text className="text-gray-700 text-lg">Report a Complain</Text>
        </TouchableOpacity>
      </View>

      {/* Download and Share buttons */}
      <View className="flex-row justify-around w-full mt-6">
        <TouchableOpacity className="bg-gray-600 p-4 h-[80px] w-[120px] rounded-lg items-center" onPress={downloadImage}>
          <Image
            source={require('../assets/images/download.png')} // Path to download icon
            style={{ width: 24, height: 24 }}
          />
          <Text className="text-sm text-cyan-50">Download</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-gray-600 p-4 h-[80px] w-[120px] rounded-lg items-center" onPress={shareImage}>
          <Image
            source={require('../assets/images/Share.png')} // Path to share icon
            style={{ width: 24, height: 24 }}
          />
          <Text className="text-sm text-cyan-50">Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FarmerQr;
