import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Location from 'expo-location';

const classroomLocation = {
  latitude: 18.4583825, // Replace with your classroom latitude
  longitude: 73.8767101, // Replace with your classroom longitude
};

const FaceAuthenticationAttendance = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const authenticateUser = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert('Error', 'Device does not support biometric authentication.');
        setStatus('Device does not support biometric authentication.');
        return false;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert('Error', 'No biometric records found. Please set up Face ID.');
        setStatus('No biometric records found.');
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Scan your face or fingerprint to authenticate',
        disableDeviceFallback: true,
      });

      if (result.success) {
        setStatus('Authentication successful.');
        return true;
      } else {
        setStatus('Authentication failed.');
        Alert.alert('Authentication Failed', 'Invalid user. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Authentication Error:', error);
      Alert.alert('Error', 'An error occurred during authentication.');
      setStatus('An error occurred during authentication.');
      return false;
    }
  };

  const checkLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to mark attendance.');
        setStatus('Location permission denied.');
        return false;
      }

      setLoading(true);

      // Retry logic for location fetching
      let location = null;
      let attempts = 0;
      while (!location && attempts < 5) {
        try {
          location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
        } catch (error) {
          attempts++;
          console.warn(`Attempt ${attempts}: Failed to fetch location.`);
        }
      }

      setLoading(false);

      if (!location) {
        Alert.alert('Error', 'Unable to fetch location after multiple attempts.');
        setStatus('Failed to fetch location.');
        return false;
      }

      const { latitude, longitude } = location.coords;
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);

      const distance = getDistance(latitude, longitude, classroomLocation.latitude, classroomLocation.longitude);
      console.log('Distance:', distance);

      if (distance <= 15) {
        setStatus('Location verified. Attendance marked.');
        Alert.alert('Success', 'Attendance marked successfully!');
        return true;
      } else {
        setStatus('Location does not match. Attendance not marked.');
        Alert.alert('Error', 'Your location is not within the required radius of the classroom.');
        return false;
      }
    } catch (error) {
      console.error('Location Error:', error);
      Alert.alert('Error', 'An error occurred while checking location.');
      setStatus('An error occurred while checking location.');
      setLoading(false);
      return false;
    }
  };

  const markAttendance = async () => {
    const isAuthenticated = await authenticateUser();
    if (isAuthenticated) {
      await checkLocation();
    }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (deg) => (deg * Math.PI) / 180;
    const R = 6371e3; // Earth radius in meters

    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const deltaPhi = toRadians(lat2 - lat1);
    const deltaLambda = toRadians(lon2 - lon1);

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) *
      Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Face Authentication Attendance</Text>
      <Button title="Mark Attendance" onPress={markAttendance} />
      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
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

export default FaceAuthenticationAttendance;
