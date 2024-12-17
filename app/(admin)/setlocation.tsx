import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/src/firebase';
import { MapPinIcon, GlobeAltIcon, ArrowsRightLeftIcon } from 'react-native-heroicons/outline';

const SetLocation = () => {
  const [classLatitude, setClassLatitude] = useState('');
  const [classLongitude, setClassLongitude] = useState('');
  const [distance, setDistance] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const isDark = useColorScheme() === 'dark';

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
        setLoading(false);
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
      setModalVisible(true);
    } catch (err) {
      setError('Failed to update fields: ' + err.message);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent, isDark && styles.darkBackground]}>
        <ActivityIndicator size="large" color={isDark ? '#1E90FF' : '#0066cc'} />
        <Text style={[styles.loadingText, isDark && styles.darkText]}>Loading...</Text>
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
          <Text style={[styles.buttonText, isDark && styles.darkButtonText]}>Update Location</Text>
        </TouchableOpacity>

        <Modal
          transparent={true}
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, isDark && styles.darkModalContent]}>
              <Text style={[styles.modalText, isDark && styles.darkText]}>
                Location updated successfully!
              </Text>
              <TouchableOpacity
                style={[styles.modalButton, isDark && styles.darkButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, isDark && styles.darkButtonText]}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 5,
  },
  darkModalContent: {
    backgroundColor: '#111111',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#000000',
  },
  modalButton: {
    backgroundColor: '#0066cc',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SetLocation;