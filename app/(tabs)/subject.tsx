import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Subject = () => {
  const navigation = useNavigation();

  const classes = [
    { letter: 'M', subject: 'Mathematics', startTime: '09:30 AM', endTime: '10:45 AM', color: '#4CAF50' },
    { letter: 'P', subject: 'Physics', startTime: '11:00 AM', endTime: '12:15 PM', color: '#2196F3' },
    { letter: 'C', subject: 'Computer Science', startTime: '02:00 PM', endTime: '03:15 PM', color: '#9C27B0' },
    { letter: 'E', subject: 'English Literature', startTime: '03:30 PM', endTime: '04:45 PM', color: '#FF9800' },
  ];

  const handleSubjectPress = (subject) => {
    console.log(`Navigating to ${subject} details`);
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Profile Section */}
      <View className="h-[40%] bg-gradient-to-r bg-white text-black px-6 pt-12 pb-8">
        <View className="flex-row items-center space-x-4">
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
            className="w-24 h-24 rounded-full border-4 border-white"
          />
          <View>
            <Text className="text-2xl font-bold">Sarah Johnson</Text>
            <Text className="text-base font-semibold">Computer Science Student</Text>
          </View>
        </View>
        <View className="mt-6">
          <Text className="text-3xl font-bold">Hi, Sarah.</Text>
          <Text className="text-xl">Welcome to your Class</Text>
        </View>
      </View>

      {/* Today's Schedule Section */}
      <View className="px-6 py-8">
        <Text className="text-2xl font-bold mb-4">Today's Schedule</Text>
        {classes.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white rounded-lg shadow-md mb-4 p-4"
            onPress={() => handleSubjectPress(item.subject)}
          >
            <View className="flex-row items-center">
              <View 
                className="w-12 h-12 rounded-full justify-center items-center mr-4"
                style={{ backgroundColor: item.color }}
              >
                <Text className="text-white text-xl font-bold">{item.letter}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">{item.subject}</Text>
                <Text className="text-sm text-gray-600">{item.startTime} - {item.endTime}</Text>
                <Text className="text-xs text-green-600 font-medium mt-1">You are marked as present</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#4CAF50" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default Subject;
