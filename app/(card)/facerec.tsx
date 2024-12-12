
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

const FaceAuthentication = () => {
  const [status, setStatus] = useState('');

  const authenticateUser = async () => {
    try {
      // Check if the device supports biometric authentication
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert('Error', 'Device does not support biometric authentication.');
        setStatus('Device does not support biometric authentication.');
        return;
      }

      // Check if Face ID or any biometric records are enrolled
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert('Error', 'No biometric records found. Please set up Face ID.');
        setStatus('No biometric records found.');
        return;
      }

      // Authenticate the user
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Scan your face to authenticate',
        disableDeviceFallback: true, // Avoid fallback to passcode
      });

      if (result.success) {
        setStatus('Valid User');
        Alert.alert('Success', 'User is valid!', [{ text: 'OK' }]);
      } else {
        setStatus('Invalid User');
        Alert.alert('Authentication Failed', 'Invalid user. Please try again.', [
          { text: 'OK' },
        ]);
      }
    } catch (error) {
      console.error('Authentication Error:', error);
      Alert.alert('Error', 'An error occurred during authentication.');
      setStatus('An error occurred during authentication.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Face Authentication</Text>
      <Button title="Scan Face" onPress={authenticateUser} />
      {status ? <Text style={styles.status}>{status}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    marginTop: 20,
    fontSize: 18,
    color: 'blue',
  },
});

export default FaceAuthentication;