import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, Dimensions, Modal, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';

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

  const extractUserId = (data: string): string | null => {
    const lines = data.split('\n');
    const idLine = lines.find(line => line.trim().startsWith("ID:"));
    if (idLine) {
      const userId = idLine.split(":")[1].trim();
      return userId;
    }
    return null;
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    const userId = extractUserId(data);

    if (userId) {
      navigation.navigate('FarmerQr' as any, { userId });
    } else {
      Alert.alert('Invalid QR Code', 'The scanned QR code does not contain a valid user ID.');
      setScanned(false); // Reset scanned state if the QR code is invalid
    }
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
            <Text style={{ color: '#555', marginBottom: 20 }}>
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
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
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
      {scanned && (
        <View style={{ padding: 16, alignItems: 'center' }}>
          <Button title="Tap to Scan Again" onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
};

export default QRScanner;
