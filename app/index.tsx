import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';
import { useRouter } from 'expo-router';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signOut,
} from 'firebase/auth';
import { auth, firestore } from '@/src/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useTheme } from '@react-navigation/native';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    const setUserPersistence = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence); // Ensures persistence across sessions
      } catch (error) {
        console.error('Error setting persistence:', error);
      }
    };

    setUserPersistence();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Force refresh token on auth state change
          await user.getIdToken(true); // This forces the token to refresh
          router.replace('/(tabs)/home');
        } catch (error) {
          console.error('Error refreshing token:', error);
          handleSignOut();
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Ensure token is fresh after sign-in
      await user.getIdToken(true); // Force refresh token

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
      router.replace('/(tabs)/home');
    } catch (error) {
      if (error.code === 'auth/user-token-expired') {
        Alert.alert('Session Expired', 'Your session has expired. Please log in again.');
        handleSignOut();
      } else {
        console.error('Error signing in:', error);
        Alert.alert('Sign-in Failed', error.message);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user
      router.replace('/signin'); // Redirect to sign-in page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingVertical: 32,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    subtitle: {
      fontSize: 18,
      color: colors.text,
      marginBottom: 24,
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
    },
    input: {
      flex: 1,
      marginLeft: 8,
      color: colors.text,
      height: 48, // Ensures the input takes full height of the container
    },
    button: {
      width: '100%',
      height: 48,
      backgroundColor: colors.primary,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    linkContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    linkText: {
      color: colors.text,
    },
    link: {
      color: colors.primary,
      fontWeight: 'bold',
    },
    iconButton: {
      marginLeft: 8,
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to access your account</Text>
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <EnvelopeIcon size={20} color={colors.text} />
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor={colors.text + '80'}
          keyboardType="email-address"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <LockClosedIcon size={20} color={colors.text} />
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor={colors.text + '80'}
          secureTextEntry={!showPassword}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeSlashIcon size={20} color={colors.text} />
          ) : (
            <EyeIcon size={20} color={colors.text} />
          )}
        </TouchableOpacity>
      </View>

      {/* Sign In Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      {/* OR Divider */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
        <Text style={{ marginHorizontal: 12, color: colors.text }}>or</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
      </View>

      {/* Sign Up Link */}
      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.link}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Signin;
