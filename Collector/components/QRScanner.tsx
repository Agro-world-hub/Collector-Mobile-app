import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, Dimensions, Modal, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner'; // For Expo QR code scanner
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';

type QRScannerNavigationProp = StackNavigationProp<RootStackParamList, 'QRScanner'>;

interface QRScannerProps {
  navigation: QRScannerNavigationProp;
}

const { width } = Dimensions.get('window');
const scanningAreaSize = width * 0.8; // Adjust scanning area size


//code for checking push requests
const QRScanner: React.FC<QRScannerProps> = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [showPermissionModal, setShowPermissionModal] = useState<boolean>(false);

  useEffect(() => {
    const getCameraPermission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
      } else {
        setHasPermission(false);
        setShowPermissionModal(true);
      }
    };

    getCameraPermission();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    Alert.alert('QR Code Scanned', data);
    // Optionally, navigate to a different screen with scanned data
    // navigation.navigate('FormScreen', { scannedData: { qrData: data } });
  };

  if (hasPermission === null) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-800">Requesting for camera permission</Text>
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
        <View className="flex-1 justify-center items-center bg-gray-800 bg-opacity-70">
          <View className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-sm">
            <Text className="text-lg font-bold mb-4">Camera Permission Required</Text>
            <Text className="text-gray-700 mb-4">
              We need camera access to scan QR codes. Please enable camera permissions in your device settings.
            </Text>
            <TouchableOpacity
              className="bg-green-500 p-4 rounded-lg"
              onPress={() => {
                setShowPermissionModal(false);
                navigation.navigate('Dashboard'); // Navigate to 'Dashboard' when permissions are denied
              }}
            >
              <Text className="text-white text-center text-lg">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View className="flex-1 relative">
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ flex: 1 }}
      />
      <View className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
        <View
          className="relative"
          style={{
            width: scanningAreaSize,
            height: scanningAreaSize,
          }}
        >
          <View className="absolute top-0 left-0 w-full h-[30px] border-t-2 border-green-500 rounded-t-lg" />
          <View className="absolute bottom-0 left-0 w-full h-[30px] border-b-2 border-green-500 rounded-b-lg" />
          <View className="absolute top-0 left-0 w-[30px] h-full border-l-2 border-green-500 rounded-tl-lg rounded-bl-lg" />
          <View className="absolute top-0 right-0 w-[30px] h-full border-r-2 border-green-500 rounded-tr-lg rounded-br-lg" />
          <View className="absolute inset-0 border-2 border-green-500 rounded-lg" />
        </View>
      </View>
      {scanned && (
        <View className="p-4">
          <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
};

export default QRScanner;
