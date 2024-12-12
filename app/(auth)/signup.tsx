
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  KeyIcon,
  IdentificationIcon,
  EyeIcon,
  EyeSlashIcon,
} from 'react-native-heroicons/outline';
import { auth, firestore } from '../../src/firebase'; // Adjust this import path
import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateRoleCode = () => {
    if (role === 'class_representative' && code !== 'cr@123') return false;
    if (role === 'faculty' && code !== 'fa@123') return false;
    if (role === 'admin' && code !== 'ad@123') return false;
    return true;
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (role !== 'student' && !validateRoleCode()) {
      Alert.alert('Error', 'Invalid code for the selected role.');
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);
      Alert.alert(
        'Verify Email',
        'A verification email has been sent to your email address. You have 1 minute to verify your email.'
      );

      // Sign out the user until verification is complete
      await signOut(auth);

      // Start a 1-minute timer to check verification status
      const timer = setTimeout(async () => {
        // Check if the user verified their email
        await user.reload();
        if (user.emailVerified) {
          // Store user details in Firestore
          const userDocRef = doc(firestore, 'users', user.uid);
          const userData = {
            uid: user.uid,
            firstName,
            lastName,
            email,
            role,
            createdAt: new Date(),
          };
          await setDoc(userDocRef, userData);
          Alert.alert('Success', 'Account created successfully after verification!');
        } else {
          await deleteUser(user)
          Alert.alert(
            'Verification Failed',
            'You did not verify your email within the 30 seconds window. Please try signing up again.'
          );
        }
      }, 30000); // 1-minute timeout

      return () => clearTimeout(timer); // Clear timer on component unmount
    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 bg-gray-100 p-6">
      <View className="items-center mb-8">
        <Text className="text-4xl font-bold text-gray-800">Create Account</Text>
        <Text className="text-lg text-gray-600 mt-2 text-center">
          Sign up to join the platform
        </Text>
      </View>

      {/* First Name */}
      <View className="flex-row items-center w-full h-12 bg-white rounded-lg px-4 mb-4 shadow-md">
        <IdentificationIcon size={20} color="#6B7280" />
        <TextInput
          placeholder="Enter your first name"
          className="flex-1 ml-2 text-gray-700"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>

      {/* Last Name */}
      <View className="flex-row items-center w-full h-12 bg-white rounded-lg px-4 mb-4 shadow-md">
        <IdentificationIcon size={20} color="#6B7280" />
        <TextInput
          placeholder="Enter your last name"
          className="flex-1 ml-2 text-gray-700"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      {/* Email */}
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

      {/* Password */}
      <View className="flex-row items-center w-full h-12 bg-white rounded-lg px-4 mb-4 shadow-md">
        <LockClosedIcon size={20} color="#6B7280" />
        <TextInput
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          className="flex-1 ml-2 text-gray-700"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeSlashIcon size={20} color="#6B7280" /> : <EyeIcon size={20} color="#6B7280" />}
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <View className="flex-row items-center w-full h-12 bg-white rounded-lg px-4 mb-4 shadow-md">
        <LockClosedIcon size={20} color="#6B7280" />
        <TextInput
          placeholder="Confirm your password"
          secureTextEntry={!showConfirmPassword}
          className="flex-1 ml-2 text-gray-700"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          {showConfirmPassword ? (
            <EyeSlashIcon size={20} color="#6B7280" />
          ) : (
            <EyeIcon size={20} color="#6B7280" />
          )}
        </TouchableOpacity>
      </View>

      {/* Role Picker */}
      <View className="flex-row items-center w-full bg-white rounded-lg mb-4 shadow-md">
        <View className="px-4">
          <UserIcon size={20} color="#6B7280" />
        </View>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={{ height: 48, flex: 1 }}
        >
          <Picker.Item label="Student" value="student" />
          <Picker.Item label="Class Representative" value="class_representative" />
          <Picker.Item label="Faculty" value="faculty" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>
      </View>

      {/* Code Input */}
      {role !== 'student' && (
        <View className="flex-row items-center w-full h-12 bg-white rounded-lg px-4 mb-4 shadow-md">
          <KeyIcon size={20} color="#6B7280" />
          <TextInput
            placeholder="Enter your code"
            className="flex-1 ml-2 text-gray-700"
            value={code}
            onChangeText={setCode}
          />
        </View>
      )}

      {/* Sign Up Button */}
      <TouchableOpacity
        className="w-full h-12 bg-blue-500 rounded-lg items-center justify-center mb-6 shadow-md"
        onPress={handleSignUp}
      >
        <Text className="text-white font-semibold text-lg">Sign Up</Text>
      </TouchableOpacity>

            {/* Horizontal Line */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-4 text-gray-500">or</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>
      
            {/* Sign In with Google Button */}
            <TouchableOpacity
              className="w-full h-12 bg-white border border-gray-300 rounded-lg items-center justify-center shadow-md flex-row"
              
            >
              <Image
                source={{
                  uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
                }}
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              <Text className="text-gray-700 font-semibold text-lg">
                Sign In with Google
              </Text>
            </TouchableOpacity>
    </ScrollView>
  );
};

export default Signup;
