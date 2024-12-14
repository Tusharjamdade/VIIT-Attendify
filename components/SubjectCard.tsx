import React, { useState, useEffect } from 'react';
import {
  Alert,
  Button,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Location from 'expo-location';
import { firestore } from '@/src/firebase';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import useUserDetails from '@/hooks/useUserDetails';

interface SubjectCardProps {
  subjectId: string;
  subjectName: string;
  startTime: string;
  endTime: string;
  date: string;
  location: string;
  teacherName: string;
}

export default function SubjectCard({
  subjectId,
  subjectName,
  startTime,
  endTime,
  date,
  location,
  teacherName,
}: SubjectCardProps) {
  const [status, setStatus] = useState('');
  const { currentUser } = useUserDetails();
  const [loading, setLoading] = useState(false);
  const [presentCount, setPresentCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  const classroomLocation = {
    latitude: 18.4583825,
    longitude: 73.8767101,
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

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

  const markAttendance = async () => {
    setLoading(true);

    const isAuthenticated = await authenticateUser();
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const location = await getLocation();
    if (!location) {
      setLoading(false);
      return;
    }

    const { latitude, longitude } = location;
    const distance = getDistance(latitude, longitude, classroomLocation.latitude, classroomLocation.longitude);

    if (distance > 20) {
      Alert.alert('Error', 'Your location is not within the required radius of the classroom.');
      setStatus('Location does not match. Attendance not marked.');
      setLoading(false);
      return;
    }

    const attendanceQuery = query(
      collection(firestore, 'attendance'),
      where('lectureId', '==', subjectId)
    );

    try {
      const querySnapshot = await getDocs(attendanceQuery);

      querySnapshot.forEach(async (docSnapshot) => {
        const attendanceDoc = docSnapshot.data();
        const studentIndex = attendanceDoc.students.findIndex(
          (student) => student.uid === currentUser.uid && student.present === false
        );

        if (studentIndex !== -1) {
          const updatedStudents = [...attendanceDoc.students];
          updatedStudents[studentIndex] = {
            ...updatedStudents[studentIndex],
            present: true,
          };

          await updateDoc(doc(firestore, 'attendance', docSnapshot.id), {
            students: updatedStudents,
          });

          // Update counts
          const present = updatedStudents.filter((student) => student.present).length;
          const total = updatedStudents.length;
          setPresentCount(present);
          setTotalCount(total);

          setAttendanceMarked(true);
          console.log(`Updated attendance for lecture: ${subjectId}`);
        }
      });

      Alert.alert('Success', 'Attendance marked successfully!');
      setStatus('Attendance marked successfully.');
    } catch (error) {
      console.error('Error updating attendance:', error);
      Alert.alert('Error', 'An error occurred while marking attendance.');
      setStatus('An error occurred while marking attendance.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAttendanceCounts = async () => {
      const attendanceQuery = query(
        collection(firestore, 'attendance'),
        where('lectureId', '==', subjectId)
      );

      try {
        const querySnapshot = await getDocs(attendanceQuery);
        querySnapshot.forEach((docSnapshot) => {
          const attendanceDoc = docSnapshot.data();
          const present = attendanceDoc.students.filter((student) => student.present).length;
          const total = attendanceDoc.students.length;
          setPresentCount(present);
          setTotalCount(total);

          const currentStudent = attendanceDoc.students.find(
            (student) => student.uid === currentUser.uid
          );
          if (currentStudent?.present) {
            setAttendanceMarked(true);
          }
        });
      } catch (error) {
        console.error('Error fetching attendance counts:', error);
      }
    };

    fetchAttendanceCounts();
  }, [subjectId]);

  return (
    <View style={styles.card}>
      <Text style={styles.subjectName}>{subjectName}</Text>
      <Text style={styles.info}>Time: {startTime} - {endTime}</Text>
      <Text style={styles.info}>Date: {date}</Text>
      <Text style={styles.info}>Location: {location}</Text>
      <Text style={styles.info}>Teacher: {teacherName}</Text>
      <Text style={styles.attendance}>
        Attendance: {presentCount}/{totalCount}
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : attendanceMarked ? (
        <Text style={styles.markedText}>Attendance Marked</Text>
      ) : (
        <TouchableOpacity style={styles.button} onPress={markAttendance}>
          <Text style={styles.buttonText}>Mark Attendance</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subjectName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  attendance: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  markedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#28A745', // Green color to indicate success
    textAlign: 'center',
    marginTop: 8,
  },
});
