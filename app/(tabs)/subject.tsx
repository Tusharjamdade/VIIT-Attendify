import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 

const Subject = () => {
  const router = useRouter(); // Use `useRouter` instead of `router`

  const classes = [
    {
      letter: 'M',
      subject: 'Mathematics',
      startTime: '09:30 AM',
      endTime: '10:45 AM',
      date: '05-Dec-2024',
      location: 'Room 101',
      teacher: 'Dr. Alan Smith',
      color: '#4CAF50',
    },
    {
      letter: 'P',
      subject: 'Physics',
      startTime: '11:00 AM',
      endTime: '12:15 PM',
      date: '05-Dec-2024',
      location: 'Room 202',
      teacher: 'Dr. Sarah Taylor',
      color: '#2196F3',
    },
    {
      letter: 'C',
      subject: 'Computer Science',
      startTime: '02:00 PM',
      endTime: '03:15 PM',
      date: '05-Dec-2024',
      location: 'Lab 303',
      teacher: 'Dr. Emily Brown',
      color: '#9C27B0',
    },
    {
      letter: 'E',
      subject: 'English Literature',
      startTime: '03:30 PM',
      endTime: '04:45 PM',
      date: '05-Dec-2024',
      location: 'Room 404',
      teacher: 'Dr. Henry Adams',
      color: '#FF9800',
    },
  ];

  const handleSubjectPress = (subjectDetails) => {
    router.push({
      pathname: '/subjectattendance',
      params: { subjectDetails: JSON.stringify(subjectDetails) },
    });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      <View style={{ backgroundColor: '#fff', padding: 16, paddingTop: 40 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
            style={{ width: 80, height: 80, borderRadius: 40 }}
          />
          <View style={{ marginLeft: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Sarah Johnson</Text>
            <Text style={{ fontSize: 16, color: '#666' }}>Computer Science Student</Text>
          </View>
        </View>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
          Hi, Sarah.
        </Text>
        <Text style={{ fontSize: 16, color: '#666' }}>Welcome to your class</Text>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
          Today's Schedule
        </Text>
        {classes.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              backgroundColor: '#fff',
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            onPress={() => handleSubjectPress(item)}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: item.color,
                marginRight: 12,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 18 }}>{item.letter}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.subject}</Text>
              <Text style={{ fontSize: 14, color: '#666' }}>
                {item.startTime} - {item.endTime} | {item.date}
              </Text>
              <Text style={{ fontSize: 14, color: '#666' }}>Location: {item.location}</Text>
              <Text style={{ fontSize: 14, color: '#666' }}>Teacher: {item.teacher}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default Subject;


