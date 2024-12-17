import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  useColorScheme,
  Platform,
  PermissionsAndroid
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/src/firebase';
import { MapPinIcon, GlobeAltIcon, ArrowsRightLeftIcon } from 'react-native-heroicons/outline';
import * as Location from 'expo-location';

const SetLocation = () => {
  const [classLatitude, setClassLatitude] = useState('');
  const [classLongitude, setClassLongitude] = useState('');
  const [distance, setDistance] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const isDark = useColorScheme() === 'dark';

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location access is required.');
      return null;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      return location.coords;
    } catch (error) {
      console.error('Location Error:', error);
      Alert.alert('Error', 'Unable to fetch location. Please try again.');
      return null;
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const docRef = doc(firestore, 'classLocation', 'U6rrz1w3nuVE9rla9vUf');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setClassLatitude(data.classLatitude ? data.classLatitude.toString() : '');
          setClassLongitude(data.classLongitude ? data.classLongitude.toString() : '');
          setDistance(data.distance ? data.distance.toString() : '');
        } else {
          setError('No such document exists.');
        }
      } catch (err) {
        setError('Failed to fetch document: ' + err.message);
      } finally {
        setLoading(false); // Stop loading after data fetch
      }
    };

    fetchLocation();
  }, []);

  const validateNumericInput = (value, setter) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setter(value);
      setError(null);
    } else {
      setError('Only numeric values are allowed.');
    }
  };

  const handleUpdate = async () => {
    try {
      if (!classLatitude || !classLongitude || !distance) {
        setError('All fields are required.');
        return;
      }

      const docRef = doc(firestore, 'classLocation', 'U6rrz1w3nuVE9rla9vUf');
      await updateDoc(docRef, {
        classLatitude: parseFloat(classLatitude),
        classLongitude: parseFloat(classLongitude),
        distance: parseFloat(distance),
      });

      Alert.alert('Success', 'Location updated successfully!');
    } catch (err) {
      setError('Failed to update fields: ' + err.message);
    }
  };

  const handleGetLocation = async () => {
    setLoading(true); // Set loading to true when starting to fetch location
    const location = await getLocation();
    if (location) {
      setClassLatitude(location.latitude.toString());
      setClassLongitude(location.longitude.toString());
    }
    setLoading(false); // Set loading to false when done fetching location
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, isDark && styles.darkBackground]}>
        <ActivityIndicator size="large" color={isDark ? '#1E90FF' : '#0066cc'} />
        <Text style={[styles.loadingText, isDark && styles.darkText]}>Fetching location...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={[styles.container, isDark && styles.darkBackground]}>
        <Text style={[styles.title, isDark && styles.darkText]}>Set Class Location</Text>

        {error && <Text style={[styles.errorText, isDark && styles.darkErrorText]}>{error}</Text>}

        <View
          style={[
            styles.inputContainer,
            isDark ? styles.darkInputContainer : styles.lightInputContainer,
          ]}
        >
          <MapPinIcon size={24} color={isDark ? '#1E90FF' : '#0066cc'} />
          <TextInput
            placeholder="Enter latitude"
            placeholderTextColor={isDark ? '#AAAAAA' : '#888888'}
            keyboardType="numeric"
            style={[styles.input, isDark && styles.darkInput]}
            value={classLatitude}
            onChangeText={(value) => validateNumericInput(value, setClassLatitude)}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            isDark ? styles.darkInputContainer : styles.lightInputContainer,
          ]}
        >
          <GlobeAltIcon size={24} color={isDark ? '#1E90FF' : '#0066cc'} />
          <TextInput
            placeholder="Enter longitude"
            placeholderTextColor={isDark ? '#AAAAAA' : '#888888'}
            keyboardType="numeric"
            style={[styles.input, isDark && styles.darkInput]}
            value={classLongitude}
            onChangeText={(value) => validateNumericInput(value, setClassLongitude)}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            isDark ? styles.darkInputContainer : styles.lightInputContainer,
          ]}
        >
          <ArrowsRightLeftIcon size={24} color={isDark ? '#1E90FF' : '#0066cc'} />
          <TextInput
            placeholder="Enter distance (meters)"
            placeholderTextColor={isDark ? '#AAAAAA' : '#888888'}
            keyboardType="numeric"
            style={[styles.input, isDark && styles.darkInput]}
            value={distance}
            onChangeText={(value) => validateNumericInput(value, setDistance)}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isDark && styles.darkButton]}
          onPress={handleUpdate}
        >
          <Text style={[styles.buttonText, isDark && styles.darkButtonText]}>   Update Location   </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isDark && styles.darkButton]}
          onPress={handleGetLocation}
        >
          <Text style={[styles.buttonText, isDark && styles.darkButtonText]}>Get Current Location</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  darkBackground: {
    backgroundColor: '#000000',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 30,
  },
  darkText: {
    color: '#ffffff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    height: 50,
  },
  lightInputContainer: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  darkInputContainer: {
    backgroundColor: '#333333',
    borderWidth: 1,
    borderColor: '#555555',
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: '#000000',
  },
  darkInput: {
    color: '#ffffff',
  },
  errorText: {
    color: '#cc0000',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  darkErrorText: {
    color: '#ff6666',
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  darkButton: {
    backgroundColor: '#1E90FF',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  darkButtonText: {
    color: '#ffffff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000000',
  },
});

export default SetLocation;
