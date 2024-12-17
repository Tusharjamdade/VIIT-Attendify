import { useState } from 'react';
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
  EyeIcon,
  EyeSlashIcon,
} from 'react-native-heroicons/outline';
import { useRouter } from 'expo-router';
import {
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth, firestore } from '../../src/firebase'; // Adjust path to your project structure
import { doc, getDoc } from 'firebase/firestore';

const Signin = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');
  const [code, setCode] = useState('');
  const router = useRouter();

  const validateRoleCode = () => {
    if (role === 'class_representative' && code !== 'cr@123') return false;
    if (role === 'faculty' && code !== 'fa@123') return false;
    if (role === 'admin' && code !== 'ad@123') return false;
    return true;
  };

  const handleSignIn = async () => {
    if (role !== 'student' && !validateRoleCode()) {
      Alert.alert('Error', 'Invalid code for the selected role.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      const userData = userDoc.data();
      if (userData.role !== role) {
        throw new Error(`Role mismatch: Expected ${userData.role}, but selected ${role}`);
      }

      console.log('Sign-in successful');
      Alert.alert('Success', 'Sign-in successful!');
      router.replace({ pathname: '/(tabs)/subject' });
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('Sign-in Failed', error.message);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, marginTop: 120, alignItems: 'center' }}
      className="flex-1 bg-gray-100 p-6"
    >
      <View className="items-center mb-8 mt-10">
        <Text className="text-4xl font-bold text-gray-800">Welcome Back!</Text>
        <Text className="text-lg text-gray-600 mt-2 text-center">
          Sign in to access your account
        </Text>
      </View>

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

      <TouchableOpacity
        className="w-full h-12 bg-blue-500 rounded-lg items-center justify-center mb-6 shadow-md"
        onPress={handleSignIn}
      >
        <Text className="text-white font-semibold text-lg">Sign In</Text>
      </TouchableOpacity>
      <View className="flex-row items-center mb-6">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-4 text-gray-500">or</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      {/* Sign Up Link */}
      <View className="flex-row items-center mt-2">
        <Text className="text-gray-700">
          Don't have an account?{' '}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Signup")} 
        >
          <Text className="text-blue-500 font-semibold">Sign Up</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
};

export default Signin;
