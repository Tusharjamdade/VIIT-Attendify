// import React, { useEffect, useState } from 'react';
// import {
//   Alert,
//   Button,
//   PermissionsAndroid,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   FlatList,
//   TouchableOpacity
// } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import { useSearchParams } from 'expo-router/build/hooks';
// import useUserDetails from '@/hooks/useUserDetails';
// import { firestore ,auth} from '@/src/firebase';
// import { addDoc, collection, getDocs, orderBy, Query, query, where } from 'firebase/firestore';
// import * as LocalAuthentication from 'expo-local-authentication';
// import * as Location from 'expo-location';
// import StudentList from '@/components/StudentList';
// import StudentProfile from '@/components/StudentProfile';

// export default function SubjectAttendance() {
//   const { currentUser, loading: userLoading, error, refetch } = useUserDetails();
//   const params = useSearchParams();
//   const subjectDetailsString = params.get('subjectDetails');

//   const details = JSON.parse(subjectDetailsString || '{}');
//   console.log(details);

//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     }
//     return true;
//   };

//   const getLocation = async () => {
//     const hasPermission = await requestLocationPermission();
//     if (!hasPermission) {
//       Alert.alert('Permission Denied', 'Location access is required.');
//       return;
//     }
//   };

  
//   const classroomLocation = {
//     latitude: 18.4583825, // Replace with your classroom latitude
//     longitude: 73.8767101, // Replace with your classroom longitude
//   };
  

//     const [status, setStatus] = useState('');
//     const [loading, setLoading] = useState(false);
  
//     const authenticateUser = async () => {
//       try {
//         const hasHardware = await LocalAuthentication.hasHardwareAsync();
//         if (!hasHardware) {
//           Alert.alert('Error', 'Device does not support biometric authentication.');
//           setStatus('Device does not support biometric authentication.');
//           return false;
//         }
  
//         const isEnrolled = await LocalAuthentication.isEnrolledAsync();
//         if (!isEnrolled) {
//           Alert.alert('Error', 'No biometric records found. Please set up Face ID.');
//           setStatus('No biometric records found.');
//           return false;
//         }
  
//         const result = await LocalAuthentication.authenticateAsync({
//           promptMessage: 'Scan your face or fingerprint to authenticate',
//           disableDeviceFallback: true,
//         });
  
//         if (result.success) {
//           setStatus('Authentication successful.');
//           return true;
//         } else {
//           setStatus('Authentication failed.');
//           Alert.alert('Authentication Failed', 'Invalid user. Please try again.');
//           return false;
//         }
//       } catch (error) {
//         console.error('Authentication Error:', error);
//         Alert.alert('Error', 'An error occurred during authentication.');
//         setStatus('An error occurred during authentication.');
//         return false;
//       }
//     };
  
//     const checkLocation = async () => {
//       try {
//         const { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== 'granted') {
//           Alert.alert('Permission Denied', 'Location permission is required to mark attendance.');
//           setStatus('Location permission denied.');
//           return false;
//         }
  
//         setLoading(true);
  
//         // Retry logic for location fetching
//         let location = null;
//         let attempts = 0;
//         while (!location && attempts < 5) {
//           try {
//             location = await Location.getCurrentPositionAsync({
//               accuracy: Location.Accuracy.High,
//             });
//           } catch (error) {
//             attempts++;
//             console.warn(`Attempt ${attempts}: Failed to fetch location.`);
//           }
//         }
  
//         setLoading(false);
  
//         if (!location) {
//           Alert.alert('Error', 'Unable to fetch location after multiple attempts.');
//           setStatus('Failed to fetch location.');
//           return false;
//         }
  
//         const { latitude, longitude } = location.coords;
//         console.log('Latitude:', latitude);
//         console.log('Longitude:', longitude);
  
//         const distance = getDistance(latitude, longitude, classroomLocation.latitude, classroomLocation.longitude);
//         console.log('Distance:', distance);
  
//         if (distance <= 20) {
//            const lecturesRef = collection(firestore, 'attendance');
//            await addDoc(lecturesRef, {
//             userId: currentUser.uid,
//             subjectId: details.uid, // Ensure a key name (e.g., `uid`) is specified
//             distance,
//           });
//           console.log("Attendance Marked")
//           setStatus('Location verified. Attendance marked.');
//           Alert.alert('Success', 'Attendance marked successfully!');
//           return true;
//         } else {

//           setStatus('Location does not match. Attendance not marked.');
//           Alert.alert('Error', 'Your location is not within the required radius of the classroom.');
//           return false;
//         }
//       } catch (error) {
//         console.error('Location Error:', error);
//         Alert.alert('Error', 'An error occurred while checking location.');
//         setStatus('An error occurred while checking location.');
//         setLoading(false);
//         return false;
//       }
//     };
  
//     const markAttendance = async () => {
//       const isAuthenticated = await authenticateUser();
//       if (isAuthenticated) {
//         await checkLocation();
//       }
//     };
  
//     const getDistance = (lat1, lon1, lat2, lon2) => {
//       const toRadians = (deg) => (deg * Math.PI) / 180;
//       const R = 6371e3; // Earth radius in meters
  
//       const phi1 = toRadians(lat1);
//       const phi2 = toRadians(lat2);
//       const deltaPhi = toRadians(lat2 - lat1);
//       const deltaLambda = toRadians(lon2 - lon1);
  
//       const a =
//         Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
//         Math.cos(phi1) * Math.cos(phi2) *
//         Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  
//       const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
//       return R * c; // Distance in meters
//     };
  

//   const imageMap = {
//     boy1: require('@/assets/images/boy1.jpg'),
//     boy2: require('@/assets/images/boy2.jpg'),
//     boy3: require('@/assets/images/boy3.jpg'),
//     boy4: require('@/assets/images/boy4.png'),
//     boy5: require('@/assets/images/boy5.jpg'),
//     girl1: require('@/assets/images/girl1.jpg'),
//     girl2: require('@/assets/images/girl2.jpg'),
//     girl3: require('@/assets/images/girl3.jpg'),
//     girl4: require('@/assets/images/girl4.jpg'),
//     girl5: require('@/assets/images/girl5.jpg'),
//   };

//   const imageUrl = currentUser?.image ? imageMap[currentUser.image] : null;

//   const SubjectCard = ({
//     subjectName,
//     startTime,
//     endTime,
//     date,
//     location,
//     teacherName,
//     presentCount,
//     totalCount,
//   }) => (
//     <View style={cardStyles.card}>
//       <Text style={cardStyles.subjectName}>{subjectName}</Text>
//       <Text style={cardStyles.info}>Time: {startTime} - {endTime}</Text>
//       <Text style={cardStyles.info}>Date: {date}</Text>
//       <Text style={cardStyles.info}>Location: {location}</Text>
//       <Text style={cardStyles.info}>Teacher: {teacherName}</Text>
//       <Text style={cardStyles.attendance}>
//         Attendance: {presentCount}/{totalCount}
//       </Text>
//       <TouchableOpacity
//         style={[cardStyles.button, { backgroundColor: (currentUser?.role === 'student' || currentUser?.role === 'class_representative') ? '#007AFF' : '#ccc' }]}
//         disabled={!(currentUser?.role === 'student' || currentUser?.role === 'class_representative')}
//         onPress={markAttendance}
//       >
//         <Text style={cardStyles.buttonText}>Mark Attendance</Text>
//       </TouchableOpacity>
//     </View>
//   );


//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <StudentProfile />
//         <SubjectCard
//           subjectName={details.subject || 'Unknown Subject'}
//           startTime={details.startTime || 'N/A'}
//           endTime={details.endTime || 'N/A'}
//           date={details.lectureDate || 'N/A'}
//           teacherName={details.teacherName || 'Unknown Teacher'}
//           location={details.location || 'N/A'}
//           presentCount={10}
//           totalCount={10}
//         />
//         <StudentList lecture={details} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f0f0f0',
//   },
//   scrollContent: {
//     padding: 16,
//   },
// });

// const profileStyles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   image: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     borderWidth: 3,
//     borderColor: 'white',
//   },
//   textContainer: {
//     marginLeft: 16,
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   role: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#666',
//   },
// });

// const cardStyles = StyleSheet.create({
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   subjectName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   info: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 4,
//   },
//   attendance: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginTop: 8,
//     marginBottom: 12,
//   },
//   button: {
//     borderRadius: 8,
//     padding: 12,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// const listStyles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 12,
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   studentItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   studentInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   rollNumber: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginRight: 8,
//     minWidth: 40,
//   },
//   studentName: {
//     fontSize: 16,
//   },
// });


import React, { useState } from 'react';
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
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Location from 'expo-location';
import { firestore } from '@/src/firebase';
import { addDoc, collection } from 'firebase/firestore';
import StudentProfile from '@/components/StudentProfile';
import StudentList from '@/components/StudentList';
import { useSearchParams } from 'expo-router/build/hooks';
import SubjectCard from '@/components/SubjectCard';

export default function SubjectAttendance() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const subjectDetailsString = params.get('subjectDetails');

  const details = JSON.parse(subjectDetailsString || '{}');
  console.log(details);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <StudentProfile />
        {/* <View style={styles.card}>
          <Text style={styles.cardTitle}>Subject Attendance</Text>
          <TouchableOpacity style={styles.button} onPress={markAttendance} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Processing...' : 'Mark Attendance'}</Text>
          </TouchableOpacity>
        </View> */}
         <SubjectCard
          subjectName={details.subject || 'Unknown Subject'}
          startTime={details.startTime || 'N/A'}
          endTime={details.endTime || 'N/A'}
          date={details.lectureDate || 'N/A'}
          teacherName={details.teacherName || 'Unknown Teacher'}
          location={details.location || 'N/A'}
          presentCount={10}
          totalCount={10}
        /> 
        <StudentList lecture={details} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContent: {
    padding: 16,
  },
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
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
});

