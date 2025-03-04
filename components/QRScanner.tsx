// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, Alert, Dimensions, Modal, TouchableOpacity } from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from './types';

// type QRScannerNavigationProp = StackNavigationProp<RootStackParamList, 'QRScanner'>;

// interface QRScannerProps {
//   navigation: QRScannerNavigationProp;
// }

// interface QRData {
//   userInfo: {
//       id: string;        // or number, depending on your backend
//       name: string;
//       nic: string;
//       phone: string;
//   };
//   bankInfo: {
//       accountHolder: string;
//       accountNumber: string;
//       bank: string;
//       branch: string;
//   };
// }


// const { width } = Dimensions.get('window');
// const scanningAreaSize = width * 0.8;

// const QRScanner: React.FC<QRScannerProps> = ({ navigation }) => {
//   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
//   const [scanned, setScanned] = useState<boolean>(false);
//   const [showPermissionModal, setShowPermissionModal] = useState<boolean>(false);
//   const [error, setError] = useState<string>('')

//   useEffect(() => {
//     const getCameraPermission = async () => {
//       const { status } = await BarCodeScanner.requestPermissionsAsync();
//       if (status === 'granted') {
//         setHasPermission(true);
//       } else {
//         setHasPermission(false);
//         setShowPermissionModal(true);
//       }
//     };

//     getCameraPermission();
//   }, []);

//   // const extractUserId = (data: string): string | null => {
//   //   const lines = data.split('\n');
//   //   const idLine = lines.find(line => line.trim().startsWith("ID:"));
//   //   if (idLine) {
//   //     const userId = idLine.split(":")[1].trim();
//   //     return userId;
//   //   }
//   //   return null;
//   // };

//   // const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
//   //   setScanned(true);
//   //   const userId = extractUserId(data);

//   //   if (userId) {
//   //     navigation.navigate('FarmerQr' as any, { userId });
//   //   } else {
//   //     Alert.alert('Invalid QR Code', 'The scanned QR code does not contain a valid user ID.');
//   //     setScanned(false); // Reset scanned state if the QR code is invalid
//   //   }
//   // };

//   // QR scanning handler
//   const handleBarCodeScanned = async ({ data }: { type: string; data: string }) => {
//     setScanned(true); // Set the scanned flag to true

//     try {
//         console.log('Scanned Data:', data);
//         console.log('Data Type:', typeof data);

//         // Parse the QR code data as a JSON object
//         const qrData = JSON.parse(data); // Parse the JSON string into a JS object

//         console.log('Parsed QR Code Data:', qrData);
//         console.log('Parsed Type:', typeof qrData);

//         // Access the user information (userId in this case)
//         const userId = qrData.userInfo?.id; // Ensure userInfo and id are available

//         // Log the userId to verify
//         console.log('User ID:', userId);

//         if (!userId) {
//             throw new Error('User ID not found in QR code');
//         }

//         // Navigate to the desired screen and pass the userId
//         navigation.navigate('FarmerQr' as any, { userId });

//     } catch (error) {
//         console.error('QR Parsing Error:', error);
//         Alert.alert('Invalid QR Code', 'There was an error parsing the QR code.');
//         setScanned(false); // Reset scanned flag on error
//     }
// };

// const handleError = (err: any) => {
//     console.error('QR Reader Error:', err);
//     setError('Error reading QR code');
// };


// if (hasPermission === null) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text style={{ fontSize: 18, color: '#333' }}>Requesting for camera permission</Text>
//       </View>
//     );
//   }

//   if (hasPermission === false) {
//     return (
//       <Modal
//         visible={showPermissionModal}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setShowPermissionModal(false)}
//       >
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
//           <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, shadowColor: 'black', width: '80%' }}>
//             <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Camera Permission Required</Text>
//             <Text style={{ color: '#555', marginBottom: 20 }}>
//               We need camera access to scan QR codes. Please enable camera permissions in your device settings.
//             </Text>
//             <TouchableOpacity
//               style={{ backgroundColor: '#34D399', padding: 10, borderRadius: 8 }}
//               onPress={() => {
//                 setShowPermissionModal(false);
//                 navigation.navigate('Dashboard');
//               }}
//             >
//               <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     );
//   }

//   return (
//     <View style={{ flex: 1, position: 'relative' }}>
//       <BarCodeScanner
//         onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//         style={{ flex: 1 }}
//       />
//       <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
//         <View
//           style={{
//             width: scanningAreaSize,
//             height: scanningAreaSize,
//             borderColor: '#34D399',
//             borderWidth: 2,
//             borderRadius: 10,
//           }}
//         />
//       </View>
//       {scanned && (
//         <View style={{ padding: 16, alignItems: 'center' }}>
//           <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
//         </View>
//       )}
//     </View>
//   );
// };

// export default QRScanner;

import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Animated, Image, Dimensions } from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { CameraView, Camera } from "expo-camera";


type QRScannerNavigationProp = StackNavigationProp<RootStackParamList, 'QRScanner'>;

interface QRScannerProps {
  navigation: QRScannerNavigationProp;
}

const { width } = Dimensions.get('window');
const scanningAreaSize = width * 0.8;

const QRScanner: React.FC<QRScannerProps> = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [showPermissionModal, setShowPermissionModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal visibility state for unsuccessful QR scan
  const [isUnsuccessfulModalVisible, setIsUnsuccessfulModalVisible] = useState<boolean>(false);

  // Animated loading bar width
  const [unsuccessfulLoadingBarWidth, setUnsuccessfulLoadingBarWidth] = useState(new Animated.Value(100));  // Start with 100%

  useEffect(() => {
    // const getCameraPermission = async () => {
    //   const { status } = await BarCodeScanner.requestPermissionsAsync();
    //   if (status === 'granted') {
    //     setHasPermission(true);
    //   } else {
    //     setHasPermission(false);
    //     setShowPermissionModal(true);
    //   }
    // };

    // getCameraPermission();
  
      const getCameraPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      };
      
      getCameraPermissions();

    // Reset scanner when the screen is focused again
    const unsubscribe = navigation.addListener('focus', () => {
      setScanned(false); // Reset scanned state when the screen is focused
      setErrorMessage(null); // Clear error message
      setIsUnsuccessfulModalVisible(false); // Close the unsuccessful modal
    });

    // Cleanup the listener on component unmount
    return unsubscribe;
  }, [navigation]);

  // Handle QR scan
  const handleBarCodeScanned = async ({ data }: { type: string; data: string }) => {
    setScanned(true); // Set the scanned flag to true

    try {
      console.log('Scanned Data:', data);
      console.log('Data Type:', typeof data);

      // Parse the QR code data as a JSON object
      const qrData = JSON.parse(data); // Parse the JSON string into a JS object

      console.log('Parsed QR Code Data:', qrData);
      console.log('Parsed Type:', typeof qrData);

      // Access the user information (userId in this case)
      const userId = qrData.userInfo?.id; // Ensure userInfo and id are available

      console.log('User ID:', userId);

      if (!userId) {
        throw new Error('User ID not found in QR code');
      }

      // Navigate to the desired screen and pass the userId
      navigation.navigate('FarmerQr' as any, { userId });
    } catch (error) {
      console.error('QR Parsing Error:', error);
      setErrorMessage('The scanned QR code does not contain a valid user ID or is damaged.');
      setIsUnsuccessfulModalVisible(true);

      // Start the decreasing animation
      Animated.timing(unsuccessfulLoadingBarWidth, {
        toValue: 0,  // Animate to 0 (empty bar)
        duration: 5000, // 5 seconds to empty the bar
        useNativeDriver: false,  // We are animating width, not a transform property
      }).start();

      // After 5 seconds (for the bar animation), close the modal and navigate
      setTimeout(() => {
        setIsUnsuccessfulModalVisible(false);
        setErrorMessage(null);
        navigation.navigate('SearchFarmer' as any); // Navigate to SearchFarmer
      }, 5000);
    }
  };

  const handleError = (err: any) => {
    console.error('QR Reader Error:', err);
  };

  if (hasPermission === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: '#333' }}>Requesting for camera permission</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <Modal
        visible={showPermissionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPermissionModal(false)}
      >
         
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, shadowColor: 'black', width: '80%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Camera Permission Required</Text>
            <Text style={{ color: '#555', marginBottom: 0 }}>
              We need camera access to scan QR codes. Please enable camera permissions in your device settings.
            </Text>
            <TouchableOpacity
              style={{ backgroundColor: '#34D399', padding: 10, borderRadius: 8 }}
              onPress={() => {
                setShowPermissionModal(false);
                navigation.navigate('Dashboard');
              }}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {/* Add a key prop to BarCodeScanner to force it to re-render when 'scanned' state changes */}
      {/* <BarCodeScanner
        key={scanned ? 'scanned' : 'reset'} // Force reset when 'scanned' is true
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ flex: 1 }}
      /> */}
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={{ flex: 1 }}
      />
    
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{
            width: scanningAreaSize,
            height: scanningAreaSize,
            borderColor: '#34D399',
            borderWidth: 2,
            borderRadius: 10,
          }}
        />
      </View>

      {/* "Tap to Scan Again" button */}
      {scanned && (
        <View style={{ position: 'absolute', bottom: 50, alignSelf: 'center' }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#34D399',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 8,
            }}
            onPress={() => {
              setScanned(false); // Reset the scanned state
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>Tap to Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Unsuccessful Modal */}
      <Modal
        transparent={true}
        visible={isUnsuccessfulModalVisible}
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-gray-900 bg-opacity-50">
          <View className="bg-white rounded-lg w-72 p-6 items-center">
            <Text className="text-xl font-bold mb-4">Failed</Text>
            <View className="mb-4">
              <Image
                source={require('../assets/images/error.png')} // Replace with your own error image
                className="w-24 h-24"
              />
            </View>
            <Text className="text-gray-700">Search by User’s NIC number</Text>

            {/* Red Loading Bar */}
            <View className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mt-6">
              <Animated.View className="h-full bg-red-500" style={{ width: unsuccessfulLoadingBarWidth }} />
            </View>

            <TouchableOpacity
              className="bg-red-500 p-2 rounded-full mt-4"
              onPress={() => {
                setIsUnsuccessfulModalVisible(false);
                setErrorMessage(null); // Clear error message when closing
              }}
            >
              <Text className="text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default QRScanner;

