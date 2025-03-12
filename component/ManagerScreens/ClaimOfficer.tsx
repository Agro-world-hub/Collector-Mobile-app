import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Keyboard,
  // Picker,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useNavigation } from '@react-navigation/native';
import {environment }from '@/environment/environment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from "react-native-vector-icons/AntDesign";
import { SelectList } from 'react-native-dropdown-select-list';
import { useTranslation } from "react-i18next";


interface OfficerDetails {
  name: string;
  id: number;
  jobRole: string;
  empId: string;
  companyNameEnglish: string;
  companyNameSinhala: string;
  companyNameTamil: string;
}
type ClaimOfficerNavigationProp = StackNavigationProp<RootStackParamList, 'ClaimOfficer'>;

const ClaimOfficer: React.FC = () => {
  const navigation = useNavigation<ClaimOfficerNavigationProp>();

  const [jobRole, setJobRole] = useState('Collection Officer');
  const [empID, setEmpID] = useState('');
  const [officerFound, setOfficerFound] = useState(false);
  const [officerDetails, setOfficerDetails] = useState<OfficerDetails | null>(null);
    const { t } = useTranslation();

  const empPrefix = jobRole === 'Collection Officer' ? 'COO' : 'CUO';

  const handleSearch = async () => {
    Keyboard.dismiss();
    console.log(empID, jobRole);
    try {
      const userToken = await AsyncStorage.getItem('token');

      if (!userToken) {
        Alert.alert(t("Error.error"), t("Error.User token not found. Please log in again."));
        return;
      }

      const response = await fetch(`${environment.API_BASE_URL}api/collection-manager/get-claim-officer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ empID: `${empPrefix}${empID}`, jobRole }),
      });

      const data = await response.json();

      if (response.ok && data.result && data.result.length > 0) {
        const officer = data.result[0];
        setOfficerDetails({
          name: `${officer.firstNameEnglish} ${officer.lastNameEnglish}`,
          companyNameEnglish: officer.companyNameEnglish,
          companyNameSinhala: officer.companyNameSinhala,
          companyNameTamil: officer.companyNameTamil,
          id: officer.id,
          jobRole: officer.jobRole,
          empId: officer.empId,
        });
        setOfficerFound(true);
      } else {
        setOfficerFound(false);
      }
    } catch (err) {
      console.error(err);
      Alert.alert(t("Error.error"), t("Error.somethingWentWrong"));
    }
  };

  const handleClaimOfficer = async () => {
    try {
      const userToken = await AsyncStorage.getItem('token');

      if (!userToken) {
        Alert.alert(t("Error.error"), t("Error.User token not found. Please log in again."));
        return;
      }

      const response = await fetch(`${environment.API_BASE_URL}api/collection-manager/claim-officer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ officerId: officerDetails?.id }),
      });

      if (!response.ok) {
        Alert.alert(t("Error.error"), t("Error.Failed to claim the officer. Please try again later."));
      } else {
        Alert.alert(t("Error.Success"), t("Error.Officer successfully claimed."));
        setOfficerFound(false);
        setOfficerDetails(null);
        setEmpID('');
      }
    } catch (err) {
      console.error(err);
      Alert.alert(t("Error.error"), t("Error.somethingWentWrong"));
    }
  };
  

  return (
    <ScrollView className="flex-1 bg-white" keyboardShouldPersistTaps="handled" 

>
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 bg-white shadow-sm">
        <TouchableOpacity
          className="pr-4"
          onPress={() => navigation.goBack()}
        >
           <AntDesign name="left" size={24} color="#000" />
        </TouchableOpacity>
        {/* <Text className="text-lg font-bold ml-[25%]"> {t("ClaimOfficer.ClaimOfficers")}</Text> */}
        <View className="w-full">
  <Text className="text-lg font-bold text-center">{t("ClaimOfficer.ClaimOfficers")}</Text>
</View>


      </View>

      {/* Form */}
      <View className="px-8 mt-7">
        <Text className="font-semibold text-gray-800 mb-2 text-center">
        {t("ClaimOfficer.JobRole")}
        </Text>
        <View className=" rounded-lg pb-3">
          {/* <Picker
            selectedValue={jobRole}
            onValueChange={(itemValue) => setJobRole(itemValue)}
            style={{ height: 50, width: '100%' }}
          >
            <Picker.Item label="Collection Officer" value="Collection Officer" />
            <Picker.Item label="Customer Officer" value="Customer Officer" />
          </Picker> */}
                 <SelectList
            setSelected={(value: React.SetStateAction<string>) => setJobRole(value)}
            data={[
              { key: 'Collection Officer', value: 'Collection Officer' },
              { key: 'Customer Officer', value: 'Customer Officer' },
            ]}
            save="key"
            defaultOption={{ key: 'Collection Officer', value: 'Collection Officer' }}
          />
        </View>

        {/* EMP ID Input */}
        <Text className="font-semibold text-gray-800 mt-6 mb-2 text-center">
        {t("ClaimOfficer.EMPID")}
        </Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg mb-4">
          <View className="bg-gray-200 px-4 py-2 rounded-l-lg">
          <Text className="text-gray-600 font-bold">{empPrefix}</Text>
          </View>
          <TextInput
            placeholder="0122"
            value={empID}
            keyboardType="numeric"
            onChangeText={setEmpID}
            className="flex-1 px-4 py-2 text-gray-700"
          />
        </View>
      
        {/* Search Button */}
        <TouchableOpacity
          className={` py-4 rounded-full items-center mt-7 ${
            empID ? 'bg-[#2AAD7A]' : 'bg-gray-300'
          }`}
          disabled={!empID}
          onPress={handleSearch}
        >
          <Text className="text-white text-lg text-center font-semibold">  {t("ClaimOfficer.Search")}</Text>
        </TouchableOpacity>
      </View>

      {/* No Officer Found */}
      {!officerFound && empID && (
        <View className="flex items-center justify-center mt-24">
          <Image
            source={require('../../assets/images/dd.webp')} // Replace with your PNG file path
            className="w-28 h-28" // Adjust width and height as needed
            resizeMode="contain" // Ensures the image scales proportionally
          />
          <Text className="text-gray-500 mt-2">
          {t("ClaimOfficer.No Disclaimed")}   
          </Text>
        </View>
      )}

      {/* Officer Found */}
      {officerFound && (
        <View className="px-4 mt-10 items-center">
          {/* Officer Avatar */}
          <Image
            source={require('../../assets/images/profile.webp')}
            className="w-20 h-20 rounded-full mb-4"
          />
          {/* Officer Details */}
          <Text className="text-lg font-bold text-gray-800">
          {officerDetails?.name}
          </Text>
          <Text className="text-sm text-gray-500">
            {officerDetails?.jobRole} - {officerDetails?.empId}
          </Text>
          <Text className="text-sm text-gray-500">{officerDetails?.companyNameEnglish}</Text>

          {/* Claim Officer Button */}
          <TouchableOpacity
            className="mt-6 mb-10 bg-[#2AAD7A]    py-4 rounded-full"
            onPress={handleClaimOfficer}
          >
            <Text className="text-white text-lg px-28 font-semibold text-center">
              {t("ClaimOfficer.Claim Officer")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default ClaimOfficer;
