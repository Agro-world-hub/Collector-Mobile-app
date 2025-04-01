import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { environment } from '@/environment/environment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type RootStackParamList = {
  Cancelreson: { requestId: string; status: string };
  RequestList: undefined;
  // add other routes as needed
};

type CancelresonNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Cancelreson"
>;

interface CancelresonProps {
  navigation: CancelresonNavigationProp;
  route: {
    params: {
      requestId: string;
      status: string;
    };
  };
}

const Cancelreson: React.FC<CancelresonProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { requestId, status } = route.params;
  
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      Alert.alert(t('Error'), t('Please provide a reason for cancellation'));
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert(t('Error'), t('Authentication token not found'));
        return;
      }

      const response = await fetch(`${environment.API_BASE_URL}api/collectionrequest/cancell-request/${requestId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: requestId,
          cancelReason: reason
        })
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert(
          t('Success'),
          t('Request cancelled successfully'),
          [{ text: t('OK'), onPress: () => navigation.navigate('RequestList') }]
        );
      } else {
        Alert.alert(t('Error'), result.message || t('Failed to cancel request'));
      }
    } catch (error) {
      console.error('Error cancelling request:', error);
      // Log more details about the error
      if (error instanceof SyntaxError) {
        console.error('This appears to be a parsing error. The server likely returned non-JSON content.');
      }
      Alert.alert(t('Error'), t('Failed to connect to server'));
    }
  };

  const handleCancelConfirm = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          className="flex-1 bg-white"
          style={{ paddingHorizontal: wp(6), paddingVertical: hp(2) }}
        >
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity onPress={() => navigation.goBack()} className="">
              <AntDesign name="left" size={24} color="#000" />
            </TouchableOpacity>
            <Text className="flex-1 text-center text-xl font-bold text-black">
              Reason to Cancel
            </Text>
          </View>

          <View className="justify-center mb-4 items-center mt-[10%]">
            <Text className="font-bold">
              Please mention below the reason
            </Text>
            <TextInput
              className="w-[80%] h-[50%] border border-[#CFCFCF] rounded-lg bg-white mt-[5%] text-gray-800"
              placeholder="Enter here.."
              multiline
              value={reason}
              onChangeText={(text) => setReason(text)}
              style={{ textAlignVertical: "top" }}
              editable={!loading}
            />
          </View>
          
          <View className="p-6">
            <TouchableOpacity 
              className={`${loading ? 'bg-gray-400' : 'bg-black'} rounded-full py-3 mb-3`}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text className="text-white text-center font-medium">
                {loading ? 'Processing...' : 'Confirm'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-gray-200 rounded-full py-3"
              onPress={handleCancelConfirm}
              disabled={loading}
            >
              <Text className="text-gray-700 text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Cancelreson;