import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useColorScheme,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth, firestore } from '../../src/firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import 'nativewind';
import StudentProfile from '@/components/StudentProfile';

const subjects = ['Mathematics', 'Science', 'History', 'Literature', 'Physics', 'Chemistry', 'Biology'];

export default function PostLecturePage() {
  const [subject, setSubject] = useState(subjects[0]);
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
  const isDarkMode = useColorScheme() === 'dark';

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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUserDetails();
  }, []);

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
        const q = query(
          collection(firestore, 'users'),
          where('role', '==', 'student')
        );

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

  const containerStyle = isDarkMode
    ? 'flex-1 bg-black text-white'
    : 'flex-1 bg-white text-gray-800';

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={isDarkMode ? '#00BFFF' : '#003366'} />
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-red-500">Failed to load user details</Text>
      </View>
    );
  }

  return (
    <ScrollView className={`${containerStyle} p-5`}>
      <StudentProfile />

      <Text className="text-2xl font-bold text-center mb-4" style={{ color: isDarkMode ? '#00BFFF' : '#003366' }}>
        Post Lecture Details
      </Text>

      <View className="mb-4">
        <Text className="text-lg" style={{ color: isDarkMode ? '#00BFFF' : '#003366' }}>Subject</Text>
        <View className="border rounded-md" style={{ borderColor: isDarkMode ? '#00BFFF' : '#003366' }}>
          <Picker
            selectedValue={subject}
            onValueChange={(itemValue) => setSubject(itemValue)}
            style={{ color: isDarkMode ? '#FFFFFF' : '#000000' }}
          >
            {subjects.map((sub, index) => (
              <Picker.Item key={index} label={sub} value={sub} />
            ))}
          </Picker>
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-lg" style={{ color: isDarkMode ? '#00BFFF' : '#003366' }}>Start Time</Text>
        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          className="p-3 rounded-md"
          style={{ backgroundColor: isDarkMode ? '#333333' : '#E0E0E0' }}
        >
          <Text style={{ color: isDarkMode ? '#00BFFF' : '#003366' }}>{formatTime(startTime)}</Text>
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
      </View>

      <View className="mb-4">
        <Text className="text-lg" style={{ color: isDarkMode ? '#00BFFF' : '#003366' }}>End Time</Text>
        <TouchableOpacity
          onPress={() => setShowEndPicker(true)}
          className="p-3 rounded-md"
          style={{ backgroundColor: isDarkMode ? '#333333' : '#E0E0E0' }}
        >
          <Text style={{ color: isDarkMode ? '#00BFFF' : '#003366' }}>{formatTime(endTime)}</Text>
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
      </View>

      <View className="mb-4">
        <Text className="text-lg" style={{ color: isDarkMode ? '#00BFFF' : '#003366' }}>Lecture Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="p-3 rounded-md"
          style={{ backgroundColor: isDarkMode ? '#333333' : '#E0E0E0' }}
        >
          <Text style={{ color: isDarkMode ? '#00BFFF' : '#003366' }}>{lectureDate.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={lectureDate}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
      </View>

      <View className="mb-4">
        <Text className="text-lg" style={{ color: isDarkMode ? '#00BFFF' : '#003366' }}>Location</Text>
        <TextInput
          className="border rounded-md p-3"
          style={{
            color: isDarkMode ? '#FFFFFF' : '#000000',
            backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
            borderColor: isDarkMode ? '#00BFFF' : '#003366',
          }}
          onChangeText={setLocation}
          value={location}
          placeholder="Enter lecture location"
          placeholderTextColor={isDarkMode ? '#BBBBBB' : '#A0AEC0'}
        />
      </View>

      <View className="mb-4">
        <Text className="text-lg" style={{ color: isDarkMode ? '#00BFFF' : '#003366' }}>Teacher Name</Text>
        <TextInput
          className="border rounded-md p-3 bg-gray-100"
          style={{
            color: isDarkMode ? '#FFFFFF' : '#000000',
            backgroundColor: isDarkMode ? '#333333' : '#E0E0E0',
            borderColor: isDarkMode ? '#00BFFF' : '#003366',
          }}
          value={teacherName}
          editable={false}
        />
      </View>

      <TouchableOpacity
  className="p-4 rounded-md"
  style={{ backgroundColor: isDarkMode ? '#00BFFF' : '#003366' }}
  onPress={handleSubmit}
>
  <Text className="text-white font-bold text-lg text-center">Submit</Text>
</TouchableOpacity>

    </ScrollView>
  );
}

