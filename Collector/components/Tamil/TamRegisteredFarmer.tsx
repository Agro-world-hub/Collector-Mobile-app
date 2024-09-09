import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../types'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/AntDesign';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

type TamRegisteredfarmerNavigationProp = StackNavigationProp<RootStackParamList, 'TamRegisteredfarmer'>;

interface TamRegisteredfarmerProps {
  navigation: TamRegisteredfarmerNavigationProp;
}

const TamRegisteredfarmer: React.FC<TamRegisteredfarmerProps> = ({ navigation }) => {

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [nic, setNic] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [address, setAddress] = useState('');
  const [accountnumber, setAccountnumber] = useState('');
  const [holdername, setHoldername] = useState('');
  const [bankname, setBankname] = useState('');
  const [branchname, setBranchname] = useState('');
  const [selectedNav, setSelectedNav] = useState<string | null>(null);

  return (
    <View className='flex-1 bg-white'>
      <View className='flex-row pt-[7%]'>
        <AntDesign name="left" size={24} color="#000502" onPress={() => navigation.goBack()} />
        <Text className='text-xl pl-[18%] text-center'>வேளாண்மாளர் விபரங்கள்</Text>
      </View>

      <View className='ml-[10%] mr-[10%] flex-1'>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}> 
          <Text className='text-base pb-[2%] font-medium'>பயனர் பெயர்</Text>
          <View className="flex-row items-center border w-full h-[40px] mb-5 bg-white px-3">
            <TextInput
              className="flex-1 h-[40px] text-base pl-2"
              onChangeText={setFirstname}
              value={firstname}
            />
          </View>

          <Text className='text-base pb-[2%] font-medium'>கடைசி பெயர்</Text>
          <View className="flex-row items-center border w-full h-[40px] mb-5 bg-white px-3">
            <TextInput
              className="flex-1 h-[40px] text-base pl-2"
              onChangeText={setLastname}
              value={lastname}
            />
          </View>

          <Text className='text-base pb-[2%] font-medium'>தேசிய அடையாள அட்டை எண்</Text>
          <View className="flex-row items-center border w-full h-[40px] mb-5 bg-white px-3">
            <TextInput
              className="flex-1 h-[40px] text-base pl-2"
              onChangeText={setNic}
              value={nic}
            />
          </View>

          <Text className='text-base pb-[2%] font-medium'>தொலைபேசி எண்</Text>
          <View className="flex-row items-center border w-full h-[40px] mb-5 bg-white px-3">
            <TextInput
              className="flex-1 h-[40px] text-base pl-2"
              onChangeText={setPhonenumber}
              value={phonenumber}
              keyboardType='numeric'
            />
          </View>

          <Text className='text-base pb-[2%] font-medium'>முகவரி</Text>
          <View className="flex-row items-center border w-full h-[40px] mb-5 bg-white px-3">
            <TextInput
              className="flex-1 h-[40px] text-base pl-2"
              onChangeText={setAddress}
              value={address}
            />
          </View>

          <Text className='text-base pb-[2%] font-medium'>வங்கி கணக்கு எண்</Text>
          <View className="flex-row items-center border w-full h-[40px] mb-5 bg-white px-3">
            <TextInput
              className="flex-1 h-[40px] text-base pl-2"
              onChangeText={setAccountnumber}
              value={accountnumber}
              keyboardType='numeric'
            />
          </View>

          <Text className='text-base pb-[2%] font-medium'>கணக்கின் மாலிகர் பெயர்</Text>
          <View className="flex-row items-center border w-full h-[40px] mb-5 bg-white px-3">
            <TextInput
              className="flex-1 h-[40px] text-base pl-2"
              onChangeText={setHoldername}
              value={holdername}
            />
          </View>

          <Text className='text-base pb-[2%] font-medium'>வங்கியின் பெயர்</Text>
          <View className="flex-row items-center border w-full h-[40px] mb-5 bg-white px-3">
            <TextInput
              className="flex-1 h-[40px] text-base pl-2"
              onChangeText={setBankname}
              value={bankname}
            />
          </View>

          <Text className='text-base pb-[2%] font-medium'>கிளை பெயர்</Text>
          <View className="flex-row items-center border w-full h-[40px] mb-5 bg-white px-3">
            <TextInput
              className="flex-1 h-[40px] text-base pl-2"
              onChangeText={setBranchname}
              value={branchname}
            />
          </View>
          <TouchableOpacity className='bg-[#2AAD7A] w-full h-[50px] rounded-3xl shadow-2xl items-center justify-center' onPress={() => navigation.navigate('TamUfarmercropdetails')}>
            <Text className='text-center text-xl font-light text-white'>அடுத்தது</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Navbar */}
        <View className="flex-row justify-around items-center py-4 border-t border-gray-300 h-16">
          <TouchableOpacity
            onPress={() => setSelectedNav('first')}
            style={{ transform: [{ scale: selectedNav === 'first' ? 1.5 : 1 }] }}
          >
            <Image
              source={require('@/assets/images/first-image.png')}
              style={{ width: 35, height: 35 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedNav('second')}
            style={{ transform: [{ scale: selectedNav === 'second' ? 1.5 : 1 }] }}
          >
            <Image
              source={require('@/assets/images/second-image.png')}
              style={{ width: 35, height: 35 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedNav('third')}
            style={{ transform: [{ scale: selectedNav === 'third' ? 1.5 : 1 }] }}
          >
            <Image
              source={require('@/assets/images/third-image.png')}
              style={{ width: 35, height: 35 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default TamRegisteredfarmer;
