import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
} from 'react-native-heroicons/outline';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../src/firebase'; // Adjust this path as per your project structure

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');
  const [code, setCode] = useState('');
  const router = useRouter();

  // Role validation function
  const validateRoleCode = () => {
    if (role === 'class_representative' && code !== 'cr@123') return false;
    if (role === 'faculty' && code !== 'fa@123') return false;
    if (role === 'admin' && code !== 'ad@123') return false;
    return true;
  };

  const handleSignIn = async () => {
    // Validate role code for non-student roles
    if (role !== 'student' && !validateRoleCode()) {
      Alert.alert('Error', 'Invalid code for the selected role.');
      return;
    }

    try {
      // Firebase email/password sign-in
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign-in successful');
      Alert.alert('Success', 'Sign-in successful!');
      router.push({ pathname: '/(tabs)/home' }); // Redirect to home on success
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('Sign-in Failed', error.message);
    }
  };

  const handleGoogleSignIn = () => {
    // Placeholder for Google Sign-In logic
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
          secureTextEntry={!showPassword}
          className="flex-1 ml-2 text-gray-700"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <EyeSlashIcon size={20} color="#6B7280" />
          ) : (
            <EyeIcon size={20} color="#6B7280" />
          )}
        </TouchableOpacity>
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

      {/* Code Input for Non-Student Roles */}
      {role !== 'student' && (
        <View className="flex-row items-center w-full h-12 bg-white rounded-lg px-4 mb-4 shadow-md">
          <KeyIcon size={20} color="#6B7280" />
          <TextInput
            placeholder="Enter your role code"
            className="flex-1 ml-2 text-gray-700"
            value={code}
            onChangeText={setCode}
          />
        </View>
      )}

      {/* Sign In Button */}
      <TouchableOpacity
        className="w-full h-12 bg-blue-500 rounded-lg items-center justify-center mb-6 shadow-md"
        onPress={handleSignIn}
      >
        <Text className="text-white font-semibold text-lg">Sign In</Text>
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
        onPress={handleGoogleSignIn}
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

export default Signin;


// import React, { useState } from 'react';
// import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
// import { useRouter } from 'expo-router'; 
// import firebase from "../(auth)/firebase";
// const Signin = () => {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const signIn = async () => {
//     try {
//       await firebase.auth().signInWithEmailAndPassword(email, password);
//       Alert.alert('Login Successful!');
//       router.push({
//         pathname:"/home"
//       })
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       <Button title="Sign In" onPress={signIn} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', padding: 20 },
//   input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
// });

// export default Signin;

// import React, { useState } from 'react';
// import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
// import { useRouter } from 'expo-router'; 
// import firebase from "../(auth)/firebase";
// const Signin = () => {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const signIn = async () => {
//     try {
//       await firebase.auth().signInWithEmailAndPassword(email, password);
//       Alert.alert('Login Successful!');
//       router.push({
//         pathname:"/home"
//       })
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />
//       <Button title="Sign In" onPress={signIn} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', padding: 20 },
//   input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
// });

// export default Signin;