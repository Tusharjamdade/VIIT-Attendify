import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const Profile = () => {
  const [image, setImage] = useState('https://randomuser.me/api/portraits/men/1.jpg');
  const [name, setName] = useState('John');
  const [surname, setSurname] = useState('Doe');
  const [bio, setBio] = useState('Computer Science Student');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const openCamera = () => {
    Alert.alert('Face Recognition', 'This would open the camera for face recognition.');
    // Implement actual camera opening and face recognition here
  };

  const changeFingerprint = () => {
    Alert.alert('Fingerprint', 'This would access the fingerprint sensor to update the fingerprint.');
    // Implement actual fingerprint change functionality here
  };

  return (
    <SafeAreaView className="flex-1 bg-indigo-50">
      <ScrollView className="flex-1 p-4">
        <View className="items-center mb-6">
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{ uri: image }}
              className="w-32 h-32 rounded-full"
            />
            <View className="absolute bottom-0 right-0 bg-indigo-500 rounded-full p-2">
              <Feather name="camera" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-600 mb-1">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              className="bg-white p-3 rounded-lg text-gray-800"
            />
          </View>

          <View>
            <Text className="text-gray-600 mb-1">Surname</Text>
            <TextInput
              value={surname}
              onChangeText={setSurname}
              className="bg-white p-3 rounded-lg text-gray-800"
            />
          </View>

          <View>
            <Text className="text-gray-600 mb-1">Bio</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={3}
              className="bg-white p-3 rounded-lg text-gray-800"
            />
          </View>
        </View>

        <View className="mt-6 space-y-4">
          <TouchableOpacity 
            onPress={openCamera}
            className="flex-row items-center bg-indigo-500 p-4 rounded-lg"
          >
            <Feather name="user" size={24} color="white" />
            <Text className="text-white ml-3 font-semibold">Face Recognition</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={changeFingerprint}
            className="flex-row items-center bg-indigo-500 p-4 rounded-lg"
          >
            <Feather name="fingerprint" size={24} color="white" />
            <Text className="text-white ml-3 font-semibold">Change Fingerprint</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

