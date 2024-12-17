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
import { router, useNavigation } from 'expo-router';

const Signup = ({navigation}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rollNo, setRollNo] = useState("");
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

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0'); // Ensures two digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (role == "student" && rollNo <= 0) {
      Alert.alert('Error', 'Invalid Roll No');
      return;
    }

    if (role !== 'student' && !validateRoleCode()) {
      Alert.alert('Error', 'Invalid code for the selected role.');
      return;
    }
    setFirstName("")
    setLastName("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setRollNo("")

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);
      Alert.alert(
        'Verify Email',
        'A verification email has been sent to your email address. Please verify it to continue.'
      );

      // Sign out the user until verification is complete
      await signOut(auth);

      // Timeout to clear interval and delete the user if not verified within 1 minute
      const timeout = setTimeout(async () => {
        await user.reload();
        if (!user.emailVerified) {
          await deleteUser(user);
          Alert.alert(
            'Verification Failed',
            'You did not verify your email within 1 minute. Please try signing up again.'
          );
        }
      }, 60000); // 1-minute timeout

      // Check verification status periodically
      const interval = setInterval(async () => {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(interval); // Stop the interval when verified
          clearTimeout(timeout); // Clear timeout to avoid deleting verified user

          // Store user details in Firestore
          const userDocRef = doc(firestore, 'users', user.uid);
          const userData = {
            uid: user.uid,
            firstName,
            lastName,
            email,
            role,
            password,
            createdAt: formatDate(new Date()),
            ...(role === "student" && { rollNo }), // Conditionally add rollNo if role is "student"
          };
          await setDoc(userDocRef, userData);
          Alert.alert('Success', 'Account created successfully after verification!');
          router.push({pathname:"/(auth)/signin"})
        }
      }, 5000); // Check every 5 seconds

    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handleRollNoChange = (text) => {
    // Ensure only numeric characters are accepted
    const numericValue = text.replace(/[^0-9]/g, ""); // Remove non-numeric characters
    setRollNo(numericValue);
  };

  return (
    <ScrollView   contentContainerStyle={{ flexGrow: 1, marginTop: 20, alignItems: 'center' }}
    className="flex-1 bg-gray-100 p-6">
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

      {/* Roll No */}
      {(role == "student" || role == "class_representative") && (
        <View className="flex-row items-center w-full h-12 bg-white rounded-lg px-4 mb-4 shadow-md">
          <IdentificationIcon size={20} color="#6B7280" />
          <TextInput
            keyboardType={"numeric"}
            placeholder="Enter your roll no"
            className="flex-1 ml-2 text-gray-700"
            value={rollNo.toString()}
            onChangeText={handleRollNoChange}
          />
        </View>
      )}
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

      <View className="flex-row items-center mb-6">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-4 text-gray-500">or</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      {/* Sign Up Link */}
      <View className="flex-row items-center mt-2">
        <Text className="text-gray-700">
          Already have an account?{' '}
        </Text>
        <TouchableOpacity
           onPress={() =>navigation.navigate('Signin')}  
        >
          <Text className="text-blue-500 font-semibold">Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Signup;
