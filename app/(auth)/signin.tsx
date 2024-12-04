import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { EnvelopeIcon, LockClosedIcon, UserIcon, KeyIcon } from 'react-native-heroicons/outline';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Changed userType to role
  const [code, setCode] = useState('');

  const handleSignIn = () => {
    // Implement sign-in logic here
    console.log('Sign in pressed');
  };

  const handleGoogleSignIn = () => {
    // Implement Google sign-in logic here
    console.log('Google sign-in pressed');
  };

  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }}
      className="flex-1 bg-gray-100 p-6"
    >
      {/* Title */}
      <View className="items-center mb-8 mt-10">
        <Text className="text-4xl font-bold text-gray-800">Welcome Back!</Text>
        <Text className="text-lg text-gray-600 mt-2 text-center">
          Sign in to access your account
        </Text>
      </View>

      {/* Email Input */}
      <View className="flex-row items-center w-full h-12 bg-white rounded-lg px-4 mb-4 shadow-md">
        <EnvelopeIcon size={20} color="#6B7280" />
        <TextInput
          placeholder="Enter your email"
          keyboardType="email-address"
          className="flex-1 ml-2 text-gray-700"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View className="flex-row items-center w-full h-12 bg-white rounded-lg px-4 mb-4 shadow-md">
        <LockClosedIcon size={20} color="#6B7280" />
        <TextInput
          placeholder="Enter your password"
          secureTextEntry
          className="flex-1 ml-2 text-gray-700"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Role Dropdown */}
      <View className="flex-row items-center w-full bg-white rounded-lg mb-4 shadow-md">
        <View className="px-4">
          <UserIcon size={20} color="#6B7280" />
        </View>
        <View className="flex-1">
          <Picker
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue)}
            style={{ height: 48 }}
          >
            <Picker.Item label="Student" value="student" />
            <Picker.Item label="Class Representative" value="class_representative" />
            <Picker.Item label="Faculty" value="faculty" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>
        </View>
      </View>

      {/* Code Input (Shown only for roles other than 'student') */}
      {role !== 'student' && (
        <View className="flex-row items-center w-full h-12 bg-white rounded-lg px-4 mb-4 shadow-md">
          <KeyIcon size={20} color="#6B7280" />
          <TextInput
            placeholder="Enter your code"
            className="flex-1 ml-2 text-gray-700"
            value={code}
            onChangeText={(text) => setCode(text)}
          />
        </View>
      )}

      {/* Sign In Button */}
      <TouchableOpacity className="w-full h-12 bg-blue-500 rounded-lg items-center justify-center mb-6 shadow-md" onPress={handleSignIn}>
        <Text className="text-white font-semibold text-lg">Sign In</Text>
      </TouchableOpacity>

      {/* Horizontal Line */}
      <View className="flex-row items-center mb-6">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-4 text-gray-500">or</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      {/* Sign In with Google Button */}
      <TouchableOpacity className="w-full h-12 bg-white border border-gray-300 rounded-lg items-center justify-center shadow-md flex-row" onPress={handleGoogleSignIn}>
        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
          style={{ width: 20, height: 20, marginRight: 10 }}
        />
        <Text className="text-gray-700 font-semibold text-lg">Sign In with Google</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  //Existing styles are removed as they are no longer needed with the updated return statement.
});

export default Signin;

