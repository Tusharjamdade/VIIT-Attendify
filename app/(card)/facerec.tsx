// import React, { useState } from 'react';
// import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
// import * as LocalAuthentication from 'expo-local-authentication';
// import * as Location from 'expo-location';

// const classroomLocation = {
//   latitude: 18.4583825, // Replace with your classroom latitude
//   longitude: 73.8767101, // Replace with your classroom longitude
// };

// const FaceAuthenticationAttendance = () => {
//   const [status, setStatus] = useState('');
//   const [loading, setLoading] = useState(false);

//   const authenticateUser = async () => {
//     try {
//       const hasHardware = await LocalAuthentication.hasHardwareAsync();
//       if (!hasHardware) {
//         Alert.alert('Error', 'Device does not support biometric authentication.');
//         setStatus('Device does not support biometric authentication.');
//         return false;
//       }

//       const isEnrolled = await LocalAuthentication.isEnrolledAsync();
//       if (!isEnrolled) {
//         Alert.alert('Error', 'No biometric records found. Please set up Face ID.');
//         setStatus('No biometric records found.');
//         return false;
//       }

//       const result = await LocalAuthentication.authenticateAsync({
//         promptMessage: 'Scan your face or fingerprint to authenticate',
//         disableDeviceFallback: true,
//       });

//       if (result.success) {
//         setStatus('Authentication successful.');
//         return true;
//       } else {
//         setStatus('Authentication failed.');
//         Alert.alert('Authentication Failed', 'Invalid user. Please try again.');
//         return false;
//       }
//     } catch (error) {
//       console.error('Authentication Error:', error);
//       Alert.alert('Error', 'An error occurred during authentication.');
//       setStatus('An error occurred during authentication.');
//       return false;
//     }
//   };

//   const checkLocation = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Denied', 'Location permission is required to mark attendance.');
//         setStatus('Location permission denied.');
//         return false;
//       }

//       setLoading(true);

//       // Retry logic for location fetching
//       let location = null;
//       let attempts = 0;
//       while (!location && attempts < 5) {
//         try {
//           location = await Location.getCurrentPositionAsync({
//             accuracy: Location.Accuracy.High,
//           });
//         } catch (error) {
//           attempts++;
//           console.warn(`Attempt ${attempts}: Failed to fetch location.`);
//         }
//       }

//       setLoading(false);

//       if (!location) {
//         Alert.alert('Error', 'Unable to fetch location after multiple attempts.');
//         setStatus('Failed to fetch location.');
//         return false;
//       }

//       const { latitude, longitude } = location.coords;
//       console.log('Latitude:', latitude);
//       console.log('Longitude:', longitude);

//       const distance = getDistance(latitude, longitude, classroomLocation.latitude, classroomLocation.longitude);
//       console.log('Distance:', distance);

//       if (distance <= 15) {
//         setStatus('Location verified. Attendance marked.');
//         Alert.alert('Success', 'Attendance marked successfully!');
//         return true;
//       } else {
//         setStatus('Location does not match. Attendance not marked.');
//         Alert.alert('Error', 'Your location is not within the required radius of the classroom.');
//         return false;
//       }
//     } catch (error) {
//       console.error('Location Error:', error);
//       Alert.alert('Error', 'An error occurred while checking location.');
//       setStatus('An error occurred while checking location.');
//       setLoading(false);
//       return false;
//     }
//   };

//   const markAttendance = async () => {
//     const isAuthenticated = await authenticateUser();
//     if (isAuthenticated) {
//       await checkLocation();
//     }
//   };

//   const getDistance = (lat1, lon1, lat2, lon2) => {
//     const toRadians = (deg) => (deg * Math.PI) / 180;
//     const R = 6371e3; // Earth radius in meters

//     const phi1 = toRadians(lat1);
//     const phi2 = toRadians(lat2);
//     const deltaPhi = toRadians(lat2 - lat1);
//     const deltaLambda = toRadians(lon2 - lon1);

//     const a =
//       Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
//       Math.cos(phi1) * Math.cos(phi2) *
//       Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c; // Distance in meters
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Face Authentication Attendance</Text>
//       <Button title="Mark Attendance" onPress={markAttendance} />
//       {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
//       {status ? <Text style={styles.status}>{status}</Text> : null}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   status: {
//     marginTop: 20,
//     fontSize: 18,
//     color: 'blue',
//   },
// });

// export default FaceAuthenticationAttendance;


// FaceRecognitionPage.js
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  NativeEventEmitter,
} from 'react-native';
import {
  FaceRecognitionSdkView,
  FaceSDKModule,
} from 'face-recognition-sdk';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useIsFocused } from '@react-navigation/native';

const cameraPermission = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
});

const FaceRecognitionPage = ({ navigation, route }) => {
  const { persons } = route.params;
  const [faces, setFaces] = useState([]);
  const [cameraShow, setCameraShow] = useState(false);
  const isFocused = useIsFocused();
  const sdkViewRef = useRef(null);

  let recognized = false;

  useEffect(() => {
    checkPermission();
    const eventEmitter = new NativeEventEmitter(FaceSDKModule);
    const eventListener = eventEmitter.addListener('onFaceDetected', (event) => {
      setFaces(event);
      if (!recognized) identifyPerson(event);
    });

    return () => {
      eventListener.remove();
    };
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      if (isFocused) stopCamera();
    };
  }, [isFocused]);

  const startCamera = async () => {
    await FaceSDKModule.startCamera();
  };

  const stopCamera = async () => {
    await FaceSDKModule.stopCamera();
  };

  const checkPermission = async () => {
    const permissionStatus = await check(cameraPermission);
    handlePermissionStatus(permissionStatus);
  };

  const requestPermission = async () => {
    const permissionStatus = await request(cameraPermission);
    handlePermissionStatus(permissionStatus);
  };

  const handlePermissionStatus = (status) => {
    switch (status) {
      case RESULTS.GRANTED:
        setCameraShow(true);
        break;
      case RESULTS.DENIED:
        requestPermission();
        break;
      default:
        setCameraShow(false);
    }
  };

  const identifyPerson = async (curFaces) => {
    let maxSimilarity = -1;
    let maxSimilarityName = '';
    let maxLiveness = -1;
    let enrolledFace, identifiedFace;

    if (curFaces.length > 0) {
      const face = curFaces[0];
      for (const person of persons) {
        try {
          const similarity = await FaceSDKModule.similarityCalculation(
            face.templates,
            person.templates
          );
          if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
            maxSimilarityName = person.name;
            maxLiveness = face.liveness;
            identifiedFace = face.faceJpg;
            enrolledFace = person.faceJpg;
          }
        } catch (error) {
          console.error('Error calculating similarity:', error);
        }
      }
    }

    if (maxSimilarity > 0.8 && maxLiveness > 0.7) {
      recognized = true;
      navigation.replace('Result', {
        enrolledFace,
        identifiedFace,
        maxSimilarityName,
        maxSimilarity,
        maxLiveness,
      });
      setFaces([]);
    }
  };

  const FacePainter = ({ faces }) => {
    const renderFaces = () => {
      return faces.map((face, index) => {
        const isRealFace = face.liveness >= 0.7;
        const rectStyle = isRealFace ? styles.realFaceRect : styles.spoofFaceRect;
        const textStyle = isRealFace ? styles.realFaceText : styles.spoofFaceText;
        return (
          <React.Fragment key={index}>
            <Text style={[styles.faceText, textStyle]}>{`${
              isRealFace ? 'Real' : 'Spoof'
            } ${face.liveness}`}</Text>
            <View style={[styles.faceRect, rectStyle]} />
          </React.Fragment>
        );
      });
    };

    return <View style={styles.faceOverlay}>{renderFaces()}</View>;
  };

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Face Recognition</Text>
      </View>
      <View style={styles.body}>
        {cameraShow ? (
          <FaceRecognitionSdkView ref={sdkViewRef} style={styles.cameraView} />
        ) : (
          <Text style={styles.errorText}>Camera permission issue.</Text>
        )}
        <FacePainter faces={faces} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1C1B1F' },
  appBar: { height: 60, backgroundColor: '#1C1B1F', flexDirection: 'row', alignItems: 'center' },
  backButton: { padding: 10 },
  backText: { color: '#FFF' },
  title: { color: '#FFF', fontSize: 18, marginLeft: 20 },
  body: { flex: 1, position: 'relative' },
  cameraView: { flex: 1 },
  errorText: { color: '#FFF', textAlign: 'center', marginTop: 20 },
  faceOverlay: { ...StyleSheet.absoluteFillObject },
  faceRect: { position: 'absolute', borderWidth: 2 },
  realFaceRect: { borderColor: '#00FF00' },
  spoofFaceRect: { borderColor: '#FF0000' },
  faceText: { position: 'absolute', fontSize: 16 },
  realFaceText: { color: '#00FF00' },
  spoofFaceText: { color: '#FF0000' },
});

export default FaceRecognitionPage;
