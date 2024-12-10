import StudentList from '@/components/StudentList';
import StudentProfile from '@/components/StudentProfile';
import SubjectCard from '@/components/SubjectCard';
import { useSearchParams } from 'expo-router/build/hooks';
import React, { useState } from 'react';
import { Alert, Button, PermissionsAndroid, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SubjectAttendance() {
  const params = useSearchParams();
  const subjectDetailsString = params.get('subjectDetails');

  // if (subjectDetailsString) {
  const details = JSON.parse(subjectDetailsString);
  // }
  console.log(details)
  const [students, setStudents] = useState(
    Array.from({ length: 79 }, (_, i) => ({
      id: i + 1,
      rollNumber: `00${i + 1}`.slice(-3),
      name: `Student ${i + 1}`,
      isPresent: false,
    }))
  );

  const toggleAttendance = (id: number) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id ? { ...student, isPresent: !student.isPresent } : student
      )
    );
  };
  const [location, setLocation] = useState(null);

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
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
      },
      (error) => {
        Alert.alert('Error', error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <StudentProfile />
        <SubjectCard
          subjectName={details.subject || 'Unknown Subject'}
          startTime={details.startTime || 'N/A'}
          endTime={details.endTime || 'N/A'}
          date={details.lectureDate || 'N/A'}
          teacherName={details.teacherName || 'Unknown Teacher'}
          location={details.location || 'N/A'}
          presentCount={students.filter((s) => s.isPresent).length}
          totalCount={students.length}
        />
        {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20 }}>
        {location
          ? `Latitude: ${location.latitude}, Longitude: ${location.longitude}`
          : 'Location not fetched'}
      </Text>
      <Button title="Get Location" onPress={getLocation} />
    </View> */}
        <StudentList students={students} toggleAttendance={toggleAttendance} />
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
});
