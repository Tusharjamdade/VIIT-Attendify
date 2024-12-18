import { useState, useEffect } from 'react';
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
import { auth, firestore } from '@/src/firebase'; // Adjust path to your project structure
import { doc, getDoc } from 'firebase/firestore';

const Signin = () => {
  console.log("Index")
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');
  const [code, setCode] = useState('');
  const [codes, setCodes] = useState(null); // To store role codes
  const router = useRouter();

  
  useEffect(() => {
    // Fetch access codes on component mount
    const fetchCodes = async () => {
      try {
        const docRef = doc(firestore, "accessCode", "nv8grcC0Y9XWjjhGEL02");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCodes(docSnap.data());
        } else {
          console.error("No access code document found.");
        }
      } catch (error) {
        console.error("Error fetching access codes:", error);
      }
    };

    fetchCodes();
  }, []);

  const validateRoleCode = () => {
    if (!codes) return false; // Ensure codes are loaded
    if (role === 'classRepresentative' && code !== codes.classRepresentative) return false;
    if (role === 'faculty' && code !== codes.faculty) return false;
    if (role === 'admin' && code !== codes.admin) return false;
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
      router.replace('/(tabs)/subject');
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
            <Picker.Item label="Class Representative" value="classRepresentative" />
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

      <View className="flex-row items-center mt-2">
        <Text className="text-gray-700">
          Don't have an account?{' '}
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/signup')} // Use router instead of navigation
        >
          <Text className="text-blue-500 font-semibold">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Signin;
