import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
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
import { auth, firestore } from '@/src/firebase';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { router } from 'expo-router';
import { DarkTheme, DefaultTheme, useTheme } from '@react-navigation/native';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [codes, setCodes] = useState(null);
  const { colors } = useTheme();

  useEffect(() => {
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
    if (!codes) return false;
    if (role === 'classRepresentative' && code !== codes.classRepresentative) return false;
    if (role === 'faculty' && code !== codes.faculty) return false;
    if (role === 'admin' && code !== codes.admin) return false;
    return true;
  };

  const validateFields = () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required.');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return false;
    }
    if (role === "student" && (parseInt(rollNo) <= 0 || !rollNo)) {
      Alert.alert('Error', 'Invalid Roll No');
      return false;
    }
    if (role !== 'student' && !validateRoleCode()) {
      Alert.alert('Error', 'Invalid code for the selected role.');
      return false;
    }
    return true;
  };

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const handleSignUp = async () => {
    if (!validateFields()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      Alert.alert(
        'Verify Email',
        'A verification email has been sent to your email address. Please verify it to continue.'
      );

      await signOut(auth);

      const timeout = setTimeout(async () => {
        await user.reload();
        if (!user.emailVerified) {
          await deleteUser(user);
          Alert.alert(
            'Verification Failed',
            'You did not verify your email within 1 minute. Please try signing up again.'
          );
        }
      }, 60000);

      const interval = setInterval(async () => {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(interval);
          clearTimeout(timeout);

          const userDocRef = doc(firestore, 'users', user.uid);
          const userData = {
            uid: user.uid,
            firstName,
            lastName,
            email,
            role,
            createdAt: formatDate(new Date()),
            ...((role === "student" || role === "classRepresentative") && { rollNo }),
          };
          await setDoc(userDocRef, userData);
          Alert.alert('Success', 'Account created successfully after verification!');
          router.push('/');
        }
      }, 5000);

    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Error', error.message);
    }
  };

  const handleRollNoChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setRollNo(numericValue);
  };

  const styles = {
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: 'center',
      padding: 24,
    },
    linkContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 18,
      color: colors.text,
      marginTop: 8,
      textAlign: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      height: 48,
      backgroundColor: colors.card,
      borderRadius: 8,
      paddingHorizontal: 16,
      marginBottom: 16,
      shadowColor: colors.border,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    input: {
      flex: 1,
      marginLeft: 8,
      color: colors.text,
    },
    icon: {
      color: colors.text,
    },
    pickerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      backgroundColor: colors.card,
      borderRadius: 8,
      marginBottom: 16,
      overflow: 'hidden',
      shadowColor: colors.border,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    picker: {
      height: 48,
      flex: 1,
      color: colors.text,
    },
    button: {
      width: '100%',
      height: 48,
      backgroundColor: colors.primary,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
      shadowColor: colors.border,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    orText: {
      marginHorizontal: 16,
      color: colors.text,
    },
    linkText: {
      color: colors.text,
    },
    link: {
      color: colors.primary,
      fontWeight: 'bold',
    },
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Sign up to join the platform
        </Text>
      </View>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <IdentificationIcon size={20} color={styles.icon.color} />
        <TextInput
          placeholder="Enter your first name"
          placeholderTextColor={colors.text + '80'}
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>

      <View style={styles.inputContainer}>
        <IdentificationIcon size={20} color={styles.icon.color} />
        <TextInput
          placeholder="Enter your last name"
          placeholderTextColor={colors.text + '80'}
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      <View style={styles.inputContainer}>
        <UserIcon size={20} color={styles.icon.color} />
        <TextInput
          placeholder="Enter your Roll No (last 2 digits (if student))"
          placeholderTextColor={colors.text + '80'}
          style={styles.input}
          value={rollNo}
          onChangeText={handleRollNoChange}
        />
      </View>

      <View style={styles.inputContainer}>
        <EnvelopeIcon size={20} color={styles.icon.color} />
        <TextInput
          placeholder="Email address"
          keyboardType="email-address"
          placeholderTextColor={colors.text + '80'}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <LockClosedIcon size={20} color={styles.icon.color} />
        <TextInput
          placeholder="Password"
          secureTextEntry={!showPassword}
          placeholderTextColor={colors.text + '80'}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <EyeSlashIcon size={20} color={styles.icon.color} />
          ) : (
            <EyeIcon size={20} color={styles.icon.color} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <LockClosedIcon size={20} color={styles.icon.color} />
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          placeholderTextColor={colors.text + '80'}
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          {showConfirmPassword ? (
            <EyeSlashIcon size={20} color={styles.icon.color} />
          ) : (
            <EyeIcon size={20} color={styles.icon.color} />
          )}
        </TouchableOpacity>
      </View>

      {/* Role Picker */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          onValueChange={setRole}
          style={styles.picker}>
          <Picker.Item label="Student" value="student" />
          <Picker.Item label="Class Representative" value="classRepresentative" />
          <Picker.Item label="Faculty" value="faculty" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>
      </View>

      {/* Code Input for Role-Specific Codes */}
      {role !== 'student' && (
        <View style={styles.inputContainer}>
          <KeyIcon size={20} color={styles.icon.color} />
          <TextInput
            placeholder="Enter role code"
            placeholderTextColor={colors.text + '80'}
            style={styles.input}
            value={code}
            onChangeText={setCode}
          />
        </View>
      )}

      {/* SignUp Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      {/* OR Divider */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
        <Text style={{ marginHorizontal: 12, color: colors.text }}>or</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
      </View>
      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.link}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Signup;
