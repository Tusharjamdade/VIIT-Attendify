import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth, firestore } from '../../src/firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import StudentProfile from '@/components/StudentProfile';
import { DarkTheme, DefaultTheme, useTheme } from '@react-navigation/native';

export default function PostLecturePage() {
  const [subjects, setSubjects] = useState([]); // Initialize as empty array
  const [subject, setSubject] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [lectureDate, setLectureDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { colors, dark } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: dark ? colors.background : colors.card,
      paddingHorizontal: 20,
    },
    content: {
      paddingVertical: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 30,  // Increased margin for more space
    },
    label: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 4,  // Increased margin for label separation
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 14,
      color: colors.text,
      backgroundColor: dark ? colors.card : colors.background,
      marginBottom: 20,  // Increased margin between input fields
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      marginBottom: 20,  // Increased margin for picker
      backgroundColor: dark ? colors.card : colors.background,
    },
    picker: {
      color: colors.text,
    },
    dateTimeButton: {
      backgroundColor: dark ? colors.card : colors.background,
      padding: 14,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 20,  // Increased margin for DateTime buttons
    },
    dateTimeButtonText: {
      color: colors.text,
    },
    submitButton: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20, // Margin at top of submit button
      borderRadius:14
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  
  const getSubjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'addSubject'));
      const subjectsList = querySnapshot.docs.map((doc) => doc.data().name);
      setSubjects(subjectsList); // Update state with fetched subjects
    } catch (error) {
      console.error('Error fetching subjects:', error);
      Alert.alert('Error', 'Failed to fetch subjects');
    }
  };

  const fetchCurrentUserDetails = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCurrentUser(userData);
          setTeacherName(`${userData.firstName} ${userData.lastName}`);
        } else {
          Alert.alert('Error', 'User document does not exist');
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      Alert.alert('Error', 'Failed to fetch user details');
    } finally {
      setLoading(false); // Ensure loading state is set to false after user details are fetched
    }
  };

  useEffect(() => {
    getSubjects(); // Fetch subjects on mount
    fetchCurrentUserDetails(); // Fetch current user details
  }, []); // Empty dependency array ensures this effect runs only once after the initial render

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || lectureDate;
    setShowDatePicker(false);
    setLectureDate(currentDate);
  };

  const onChangeStartTime = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setShowStartPicker(false);
    setStartTime(currentTime);
  };

  const onChangeEndTime = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    setShowEndPicker(false);
    setEndTime(currentTime);
  };

  const validateForm = () => {
    if (!location.trim()) {
      Alert.alert('Validation Error', 'Please enter a valid location.');
      return false;
    }
    if (endTime <= startTime) {
      Alert.alert('Validation Error', 'End time must be later than start time.');
      return false;
    }
    return true;
  };

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const user = auth.currentUser;
      if (user) {
        const lecturesRef = collection(firestore, 'lectures');
        const lectureDocRef = await addDoc(lecturesRef, {
          userId: user.uid,
          subject,
          startTime: formatTime(startTime),
          endTime: formatTime(endTime),
          lectureDate: formatDate(lectureDate),
          location,
          teacherName,
        });

        const q = query(collection(firestore, 'users'), where('role', '==', 'student'));
        const usersSnapshot = await getDocs(q);
        const students = usersSnapshot.docs.map((doc) => {
          const { uid, rollNo, firstName, lastName } = doc.data();
          return {
            uid,
            rollNo,
            firstName,
            lastName,
            present: false,
          };
        });

        const attendanceRef = collection(firestore, 'attendance');
        await addDoc(attendanceRef, {
          lectureId: lectureDocRef.id,
          lectureMonth: new Date().getMonth() + 1,
          students,
        });

        Alert.alert('Success', 'Lecture details successfully posted!');
        setLocation('');
      } else {
        Alert.alert('Error', 'No user is logged in.');
      }
    } catch (error) {
      console.error('Error posting lecture details:', error);
      Alert.alert('Error', 'Failed to post lecture details. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: colors.text }}>Failed to load user details</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StudentProfile />
      <View style={styles.content}>
        <Text style={styles.title}>Post Lecture Details</Text>

        <Text style={styles.label}>Subject</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={subject}
            onValueChange={(itemValue) => setSubject(itemValue)}
            style={styles.picker}
          >
            {subjects.map((sub, index) => (
              <Picker.Item
                key={index}
                label={sub}
                value={sub}
                color={dark ? 'black' : '#1C1C1C'}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Start Time</Text>
        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          style={styles.dateTimeButton}
        >
          <Text style={styles.dateTimeButtonText}>{formatTime(startTime)}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={onChangeStartTime}
          />
        )}

        <Text style={styles.label}>End Time</Text>
        <TouchableOpacity
          onPress={() => setShowEndPicker(true)}
          style={styles.dateTimeButton}
        >
          <Text style={styles.dateTimeButtonText}>{formatTime(endTime)}</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={onChangeEndTime}
          />
        )}

        <Text style={styles.label}>Lecture Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.dateTimeButton}
        >
          <Text style={styles.dateTimeButtonText}>{lectureDate.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={lectureDate}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          onChangeText={setLocation}
          value={location}
          placeholder="Enter lecture location"
          placeholderTextColor={colors.text + '80'}
        />

        <Text style={styles.label}>Teacher Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: dark ? colors.border : colors.background }]}
          editable={false}
          value={teacherName}
        />

        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.submitButton}
        >
          <Text style={styles.submitButtonText}>Submit Lecture</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
