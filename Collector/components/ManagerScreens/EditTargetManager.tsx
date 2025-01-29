import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type EditTargetManagerNavigationProps = StackNavigationProp<RootStackParamList, 'EditTargetManager'>;

interface EditTargetManagerProps {
  navigation: EditTargetManagerNavigationProps;
  route: {
    params: {
      varietyName: string;
      grade: string;
      target: string;
      todo: string;
      qty: string;
    };
  };
}

const EditTargetManager: React.FC<EditTargetManagerProps> = ({ navigation,route }) => {
  const [myTarget, setMyTarget] = useState('100kg');
  const [isEditing, setIsEditing] = useState(false);
  const [toDoAmount] = useState('50kg');
  const { varietyName, grade, target, todo, qty } = route.params;
  console.log('officers edit details',varietyName, grade, target, todo, qty);
  console.log(qty)

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center bg-[#2AAD7A] p-6 rounded-b-lg">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold ml-[30%]">{varietyName}</Text>
      </View>

      {/* Content */}
      <View className="mt-6 space-y-6 p-8">
        {/* Total Target */}
        <View>
          <Text className="text-gray-600 font-medium">Total Target for the center</Text>
          <TextInput
            className="border border-gray-300 rounded-md px-3 py-2 mt-2 text-gray-800"
            value={qty.toString()}
            editable={false}
          />
        </View>

        {/* My Target */}
        <View>
          <Text className="text-gray-600 font-medium">My Target</Text>
          <View className="flex-row items-center mt-2 border border-gray-300 rounded-md px-3 py-2">
            <TextInput
              className="flex-1 text-gray-800"
              value={target.toString()}
              editable={isEditing}
              onChangeText={(text) => setMyTarget(text)}
            />
            <TouchableOpacity onPress={() => setIsEditing((prev) => !prev)}>
              <Ionicons
                name={isEditing ? 'pencil' : 'pencil'}
                size={20}
                color={isEditing ? 'green' : 'green'}
              />
            </TouchableOpacity>
          </View>

          {/* Buttons in Edit Mode */}
          {isEditing && (
            <View className="flex-row justify-center space-x-4 mt-4 p-5">
              <TouchableOpacity
                className="flex-1 bg-[#D16D6A] px-6 py-2 rounded-md items-center"
                onPress={() => navigation.navigate('PassTargetScreen')}
              >
                <Text className="text-white font-medium">Pass</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-[#2AAD7A] px-6 py-2 rounded-md items-center"
                onPress={() => navigation.navigate('RecieveTargetScreen')} // Save and exit edit mode
              >
                <Text className="text-white font-medium">Receive</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>

        {/* To Do Amount */}
        <View>
          <Text className="text-gray-600 font-medium">To Do Amount</Text>
          <TextInput
            className="border border-gray-300 rounded-md px-3 py-2 mt-2 text-gray-800"
            value={todo.toString()}
            editable={false}
          />
        </View>
      </View>
    </View>
  );
};

export default EditTargetManager;
