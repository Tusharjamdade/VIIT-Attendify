import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
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
import { auth, firestore } from '../(auth)/firebase'; // Adjust this import path
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);
      Alert.alert(
        'Verify Email',
        'A verification email has been sent to your email address. Please verify before proceeding.'
      );

      // Store user details in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      const userData = {
        uid: user.uid,
        firstName,
        lastName,
        email,
        password,
        role,
        createdAt: new Date(),
      };

      await setDoc(userDocRef, userData);
      Alert.alert('Success', 'Account created successfully!');
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
    </ScrollView>
  );
};

export default Signup;



// import React, { useState } from 'react';
// import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
// // import firebase from '../firebase/firebase'; // Update the path as needed
// import firebase from './firebase';
// const Signup = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const signUp = async () => {
//     try {
//       console.log('Signup process started');
//       await firebase.auth().createUserWithEmailAndPassword(email, password);
//       Alert.alert('Account Created Successfully!');
//       console.log('Signup process completed');
//     } catch (error) {
//       Alert.alert('Error', error.message);
//       console.error('Signup error:', error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       <Button title="Sign Up" onPress={signUp} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', padding: 20 },
//   input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
// });

// export default Signup;
