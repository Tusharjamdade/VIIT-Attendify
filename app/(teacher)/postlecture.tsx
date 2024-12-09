// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Image,
//   Alert,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { auth, firestore } from '../(auth)/firebase'; // Ensure the correct Firebase file path
// import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
// import 'nativewind';

// const subjects = ['Mathematics', 'Science', 'History', 'Literature', 'Physics', 'Chemistry', 'Biology'];

// export default function PostLecturePage() {
//   const [subject, setSubject] = useState(subjects[0]);
//   const [startTime, setStartTime] = useState(new Date());
//   const [endTime, setEndTime] = useState(new Date());
//   const [lectureDate, setLectureDate] = useState(new Date());
//   const [location, setLocation] = useState('');
//   const [teacherName, setTeacherName] = useState('');
//   const [showStartPicker, setShowStartPicker] = useState(false);
//   const [showEndPicker, setShowEndPicker] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchCurrentUserDetails = async () => {
//     try {
//       const user = auth.currentUser;
//       if (user) {
//         const userDoc = await getDoc(doc(firestore, 'users', user.uid));
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
//           setCurrentUser(userData);
//           setTeacherName(`${userData.firstName} ${userData.lastName}`);
//         } else {
//           Alert.alert('Error', 'User document does not exist');
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching user details:', error);
//       Alert.alert('Error', 'Failed to fetch user details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCurrentUserDetails();
//   }, []);

//   const onChangeDate = (event, selectedDate) => {
//     const currentDate = selectedDate || lectureDate;
//     setShowDatePicker(false);
//     setLectureDate(currentDate);
//   };

//   const onChangeStartTime = (event, selectedTime) => {
//     const currentTime = selectedTime || startTime;
//     setShowStartPicker(false);
//     setStartTime(currentTime);
//   };

//   const onChangeEndTime = (event, selectedTime) => {
//     const currentTime = selectedTime || endTime;
//     setShowEndPicker(false);
//     setEndTime(currentTime);
//   };

//   const validateForm = () => {
//     if (!location.trim()) {
//       Alert.alert('Validation Error', 'Please enter a valid location.');
//       return false;
//     }
//     if (endTime <= startTime) {
//       Alert.alert('Validation Error', 'End time must be later than start time.');
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     try {
//       const user = auth.currentUser;
//       if (user) {
//         const lecturesRef = collection(firestore, `users/${user.uid}/lectures`);
//         await addDoc(lecturesRef, {
//           subject,
//           startTime: startTime.toISOString(),
//           endTime: endTime.toISOString(),
//           lectureDate: lectureDate.toISOString(),
//           location,
//           teacherName,
//         });
//         Alert.alert('Success', 'Lecture details successfully posted!');
//         setLocation('');
//       } else {
//         Alert.alert('Error', 'No user is logged in.');
//       }
//     } catch (error) {
//       console.error('Error posting lecture details:', error);
//       Alert.alert('Error', 'Failed to post lecture details. Please try again.');
//     }
//   };

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <ActivityIndicator size="large" color="#003366" />
//       </View>
//     );
//   }

//   if (!currentUser) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <Text className="text-lg text-red-500">Failed to load user details</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView className="flex-1 bg-white p-5">
//       <View className="flex-row items-center mb-4">
//         <Image
//           source={{
//             uri: currentUser.profileImage || 'https://randomuser.me/api/portraits/men/44.jpg',
//           }}
//           className="w-20 h-20 rounded-full border-4 border-white mr-4"
//         />
//         <View>
//           <Text className="text-lg font-bold">{currentUser.firstName} {currentUser.lastName}</Text>
//           <Text className="text-sm text-blue-400">{currentUser.email}</Text>
//         </View>
//       </View>

//       <Text className="text-2xl font-bold text-blue-600 text-center mb-4">Post Lecture Details</Text>

//       <View className="mb-4">
//         <Text className="text-lg text-blue-600">Subject</Text>
//         <View className="border border-gray-300 rounded-md">
//           <Picker
//             selectedValue={subject}
//             onValueChange={(itemValue) => setSubject(itemValue)}
//           >
//             {subjects.map((sub, index) => (
//               <Picker.Item key={index} label={sub} value={sub} />
//             ))}
//           </Picker>
//         </View>
//       </View>

//       <View className="mb-4">
//         <Text className="text-lg text-blue-600">Start Time</Text>
//         <TouchableOpacity
//           onPress={() => setShowStartPicker(true)}
//           className="p-3 bg-gray-200 rounded-md"
//         >
//           <Text className="text-blue-600">{startTime.toLocaleTimeString()}</Text>
//         </TouchableOpacity>
//         {showStartPicker && (
//           <DateTimePicker
//             value={startTime}
//             mode="time"
//             is24Hour
//             display="default"
//             onChange={onChangeStartTime}
//           />
//         )}
//       </View>

//       <View className="mb-4">
//         <Text className="text-lg text-blue-600">End Time</Text>
//         <TouchableOpacity
//           onPress={() => setShowEndPicker(true)}
//           className="p-3 bg-gray-200 rounded-md"
//         >
//           <Text className="text-blue-600">{endTime.toLocaleTimeString()}</Text>
//         </TouchableOpacity>
//         {showEndPicker && (
//           <DateTimePicker
//             value={endTime}
//             mode="time"
//             is24Hour
//             display="default"
//             onChange={onChangeEndTime}
//           />
//         )}
//       </View>

//       <View className="mb-4">
//         <Text className="text-lg text-blue-600">Lecture Date</Text>
//         <TouchableOpacity
//           onPress={() => setShowDatePicker(true)}
//           className="p-3 bg-gray-200 rounded-md"
//         >
//           <Text className="text-blue-600">{lectureDate.toDateString()}</Text>
//         </TouchableOpacity>
//         {showDatePicker && (
//           <DateTimePicker
//             value={lectureDate}
//             mode="date"
//             display="default"
//             onChange={onChangeDate}
//           />
//         )}
//       </View>

//       <View className="mb-4">
//         <Text className="text-lg text-blue-600">Location</Text>
//         <TextInput
//           className="border border-gray-300 rounded-md p-3 text-gray-700"
//           onChangeText={setLocation}
//           value={location}
//           placeholder="Enter lecture location"
//           placeholderTextColor="#A0AEC0"
//         />
//       </View>

//       <View className="mb-4">
//         <Text className="text-lg text-blue-600">Teacher Name</Text>
//         <TextInput
//           className="border border-gray-300 rounded-md p-3 text-gray-700 bg-gray-100"
//           value={teacherName}
//           editable={false} // Disable editing
//           placeholder="Teacher name"
//           placeholderTextColor="#A0AEC0"
//         />
//       </View>

//       <TouchableOpacity
//         className="bg-blue-600 p-4 rounded-md"
//         onPress={handleSubmit}
//       >
//         <Text className="text-white font-bold text-lg text-center">Submit</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth, firestore } from '../../src/firebase'; // Ensure the correct Firebase file path
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import 'nativewind';

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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const user = auth.currentUser;
      if (user) {
        const lecturesRef = collection(firestore, 'lectures');
        await addDoc(lecturesRef, {
          userId: user.uid,
          subject,
          startTime: formatTime(startTime),
          endTime: formatTime(endTime),
          lectureDate: lectureDate.toISOString().split('T')[0],
          location,
          teacherName,
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
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#003366" />
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
    <ScrollView className="flex-1 bg-white p-5">
      <View className="flex-row items-center mb-4">
        <Image
          source={{
            uri: currentUser.profileImage || 'https://randomuser.me/api/portraits/men/44.jpg',
          }}
          className="w-20 h-20 rounded-full border-4 border-white mr-4"
        />
        <View>
          <Text className="text-lg font-bold">{currentUser.firstName} {currentUser.lastName}</Text>
          <Text className="text-sm text-blue-400">{currentUser.email}</Text>
        </View>
      </View>

      <Text className="text-2xl font-bold text-blue-600 text-center mb-4">Post Lecture Details</Text>

      {/* Subject Picker */}
      <View className="mb-4">
        <Text className="text-lg text-blue-600">Subject</Text>
        <View className="border border-gray-300 rounded-md">
          <Picker
            selectedValue={subject}
            onValueChange={(itemValue) => setSubject(itemValue)}
          >
            {subjects.map((sub, index) => (
              <Picker.Item key={index} label={sub} value={sub} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Start Time Picker */}
      <View className="mb-4">
        <Text className="text-lg text-blue-600">Start Time</Text>
        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          className="p-3 bg-gray-200 rounded-md"
        >
          <Text className="text-blue-600">{formatTime(startTime)}</Text>
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

      {/* End Time Picker */}
      <View className="mb-4">
        <Text className="text-lg text-blue-600">End Time</Text>
        <TouchableOpacity
          onPress={() => setShowEndPicker(true)}
          className="p-3 bg-gray-200 rounded-md"
        >
          <Text className="text-blue-600">{formatTime(endTime)}</Text>
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

      {/* Lecture Date Picker */}
      <View className="mb-4">
        <Text className="text-lg text-blue-600">Lecture Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          className="p-3 bg-gray-200 rounded-md"
        >
          <Text className="text-blue-600">{lectureDate.toDateString()}</Text>
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

      {/* Location Input */}
      <View className="mb-4">
        <Text className="text-lg text-blue-600">Location</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-3 text-gray-700"
          onChangeText={setLocation}
          value={location}
          placeholder="Enter lecture location"
          placeholderTextColor="#A0AEC0"
        />
      </View>

      {/* Teacher Name */}
      <View className="mb-4">
        <Text className="text-lg text-blue-600">Teacher Name</Text>
        <TextInput
          className="border border-gray-300 rounded-md p-3 text-gray-700 bg-gray-100"
          value={teacherName}
          editable={false} // Prevent editing
          placeholder="Teacher name will appear here"
          placeholderTextColor="#A0AEC0"
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        className="bg-blue-600 p-4 rounded-md"
        onPress={handleSubmit}
      >
        <Text className="text-white font-bold text-lg text-center">Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

