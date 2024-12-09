import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';

const FaceRec = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [faceData, setFaceData] = useState(null);
  const [registeredFace, setRegisteredFace] = useState(null);
  const [mode, setMode] = useState('register'); // 'register' or 'verify'

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleFacesDetected = ({ faces }) => {
    if (faces.length > 0) {
      const face = faces[0];
      if (mode === 'register') {
        setRegisteredFace(face);
        Alert.alert('Face Registered', 'Your face has been successfully registered.');
        setMode('verify');
      } else if (mode === 'verify') {
        if (registeredFace) {
          const isSameFace = compareFaces(registeredFace, face);
          Alert.alert(isSameFace ? 'Authentication Successful' : 'Face Not Recognized');
        }
      }
    }
  };

  const compareFaces = (face1, face2) => {
    const threshold = 0.2; // Adjust for stricter similarity
    const deltaX = Math.abs(face1.bounds.origin.x - face2.bounds.origin.x);
    const deltaY = Math.abs(face1.bounds.origin.y - face2.bounds.origin.y);
    const deltaWidth = Math.abs(face1.bounds.size.width - face2.bounds.size.width);
    const deltaHeight = Math.abs(face1.bounds.size.height - face2.bounds.size.height);

    return deltaX < threshold && deltaY < threshold && deltaWidth < threshold && deltaHeight < threshold;
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centered}>
        <Text>Requesting for camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type="front"
        onFacesDetected={cameraReady ? handleFacesDetected : undefined}
        onCameraReady={() => setCameraReady(true)}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
          runClassifications: FaceDetector.FaceDetectorClassifications.all,
        }}
      />
      <View style={styles.controls}>
        <Button
          title={mode === 'register' ? 'Register Face' : 'Switch to Verification'}
          onPress={() => setMode(mode === 'register' ? 'verify' : 'register')}
        />
        <Button title="Clear Registered Face" onPress={() => setRegisteredFace(null)} />
      </View>
      {registeredFace && (
        <View style={styles.faceDetails}>
          <Text>Face Registered: </Text>
          <Text>Bounds: {JSON.stringify(registeredFace.bounds)}</Text>
        </View>
      )}
    </View>
  );
};

export default FaceRec;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  camera: {
    flex: 1,
  },
  controls: {
    padding: 16,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceDetails: {
    padding: 16,
    backgroundColor: '#eef',
  },
});
