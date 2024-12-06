import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Post Lecture Details</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Subject</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={subject}
            onValueChange={(itemValue) => setSubject(itemValue)}
            style={styles.picker}
          >
            {subjects.map((sub, index) => (
              <Picker.Item key={index} label={sub} value={sub} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Start Time</Text>
        <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateTimeButton}>
          <Text style={styles.dateTimeText}>{startTime.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeStartTime}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>End Time</Text>
        <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateTimeButton}>
          <Text style={styles.dateTimeText}>{endTime.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onChangeEndTime}
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Lecture Date</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateTimeButton}>
          <Text style={styles.dateTimeText}>{lectureDate.toDateString()}</Text>
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

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          onChangeText={setLocation}
          value={location}
          placeholder="Enter lecture location"
          placeholderTextColor="#A0AEC0"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Teacher Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={setTeacherName}
          value={teacherName}
          placeholder="Enter teacher name"
          placeholderTextColor="#A0AEC0"
        />
      </View>

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B6CB0',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#2B6CB0',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#4A5568',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  dateTimeButton: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 5,
    padding: 10,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#4A5568',
  },
  submitButton: {
    backgroundColor: '#2B6CB0',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

// import React, { useState } from 'react';
// import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import DateTimePickerModal from "react-native-modal-datetime-picker";

// const subjects = ['Mathematics', 'Science', 'History', 'Literature', 'Physics', 'Chemistry', 'Biology'];

// export default function PostLecturePage() {
//   const [subject, setSubject] = useState(subjects[0]);
//   const [startDateTime, setStartDateTime] = useState(new Date());
//   const [endDateTime, setEndDateTime] = useState(new Date());
//   const [location, setLocation] = useState('');
//   const [teacherName, setTeacherName] = useState('');
  
//   const [showStartPicker, setShowStartPicker] = useState(false);
//   const [showEndPicker, setShowEndPicker] = useState(false);
//   const [pickerMode, setPickerMode] = useState('date');

//   const showDateTimePicker = (type, mode) => {
//     if (type === 'start') {
//       setShowStartPicker(true);
//     } else {
//       setShowEndPicker(true);
//     }
//     setPickerMode(mode);
//   };

//   const hideDateTimePicker = (type) => {
//     if (type === 'start') {
//       setShowStartPicker(false);
//     } else {
//       setShowEndPicker(false);
//     }
//   };

//   const handleDateTimeConfirm = (type, selectedDateTime) => {
//     if (type === 'start') {
//       setStartDateTime(selectedDateTime);
//       setShowStartPicker(false);
//     } else {
//       setEndDateTime(selectedDateTime);
//       setShowEndPicker(false);
//     }
//   };

//   const renderDateTimePicker = (type) => {
//     const isStartPicker = type === 'start';
//     const show = isStartPicker ? showStartPicker : showEndPicker;
//     const dateTime = isStartPicker ? startDateTime : endDateTime;

//     if (Platform.OS === 'ios') {
//       return (
//         <View>
//           {show && (
//             <DateTimePicker
//               value={dateTime}
//               mode={pickerMode}
//               is24Hour={true}
//               display="default"
//               onChange={(event, selectedDate) => {
//                 if (event.type === 'set') {
//                   handleDateTimeConfirm(type, selectedDate);
//                 } else {
//                   hideDateTimePicker(type);
//                 }
//               }}
//             />
//           )}
//         </View>
//       );
//     } else {
//       return (
//         <DateTimePickerModal
//           isVisible={show}
//           mode={pickerMode}
//           onConfirm={(date) => handleDateTimeConfirm(type, date)}
//           onCancel={() => hideDateTimePicker(type)}
//           date={dateTime}
//         />
//       );
//     }
//   };

//   const formatDateTime = (date) => {
//     return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Post Lecture Details</Text>
      
//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Subject</Text>
//         <View style={styles.pickerContainer}>
//           <Picker
//             selectedValue={subject}
//             onValueChange={(itemValue) => setSubject(itemValue)}
//             style={styles.picker}
//           >
//             {subjects.map((sub, index) => (
//               <Picker.Item key={index} label={sub} value={sub} />
//             ))}
//           </Picker>
//         </View>
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Start Date and Time</Text>
//         <TouchableOpacity onPress={() => showDateTimePicker('start', 'date')} style={styles.dateTimeButton}>
//           <Text style={styles.dateTimeText}>{formatDateTime(startDateTime)}</Text>
//         </TouchableOpacity>
//         {renderDateTimePicker('start')}
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>End Date and Time</Text>
//         <TouchableOpacity onPress={() => showDateTimePicker('end', 'date')} style={styles.dateTimeButton}>
//           <Text style={styles.dateTimeText}>{formatDateTime(endDateTime)}</Text>
//         </TouchableOpacity>
//         {renderDateTimePicker('end')}
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Location</Text>
//         <TextInput
//           style={styles.input}
//           onChangeText={setLocation}
//           value={location}
//           placeholder="Enter lecture location"
//           placeholderTextColor="#A0AEC0"
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Text style={styles.label}>Teacher Name</Text>
//         <TextInput
//           style={styles.input}
//           onChangeText={setTeacherName}
//           value={teacherName}
//           placeholder="Enter teacher name"
//           placeholderTextColor="#A0AEC0"
//         />
//       </View>

//       <TouchableOpacity style={styles.submitButton}>
//         <Text style={styles.submitButtonText}>Submit</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2B6CB0',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     color: '#2B6CB0',
//     marginBottom: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     borderRadius: 5,
//     padding: 10,
//     fontSize: 16,
//     color: '#4A5568',
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     borderRadius: 5,
//     overflow: 'hidden',
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//   },
//   dateTimeButton: {
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     borderRadius: 5,
//     padding: 10,
//   },
//   dateTimeText: {
//     fontSize: 16,
//     color: '#4A5568',
//   },
//   submitButton: {
//     backgroundColor: '#2B6CB0',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   submitButtonText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

