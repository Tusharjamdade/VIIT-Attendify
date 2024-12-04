import Card from '@/components/card';
import React from 'react';
import { View, Text, Image, ImageBackground, ScrollView } from 'react-native';

const Home = () => {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTkzNzN8MHwxfGFsbHwxfHx8fHx8fHwxNjM5MDU0MzYw&ixlib=rb-1.2.1&q=80&w=1080' }}
      className="flex-1 bg-gray-800"
    >
      <ScrollView className="flex-1">
        {/* Profile Section */}
        <View className="h-[40%] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 pt-12 pb-8">
          <View className="flex-row items-center space-x-4">
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
              className="w-24 h-24 rounded-full border-4 border-white"
            />
            <View>
              <Text className="text-white text-2xl font-bold">Sarah Johnson</Text>
              <Text className="text-yellow-300 text-base font-semibold">Computer Science Student</Text>
            </View>
          </View>
          <View className="bg-white/20 rounded-xl mt-6 p-4">
            <Text className="text-white text-lg font-semibold">Student Bio</Text>
            <Text className="text-gray-200 mt-2">
              Passionate about AI and machine learning, I'm a third-year CS student with a knack for problem-solving and a love for coding. When I'm not debugging, you'll find me exploring new tech or contributing to open-source projects.
            </Text>
          </View>
        </View>

        {/* Dashboard Section */}
        <View className="bg-white/90 rounded-t-3xl -mt-10 p-6">
          <Text className="text-indigo-900 text-lg font-semibold mb-4">My Dashboard</Text>
          <View className="flex-row flex-wrap justify-between">
            <Card title="Attendance" icon="user-check" color="bg-teal-500" />
            <Card title="Today's Subjects" icon="book-open" color="bg-green-500" />
            <Card title="Support" icon="help-circle" color="bg-purple-500" />
            <Card title="Assignments" icon="clipboard" color="bg-orange-500" />
            <Card title="Grades" icon="bar-chart-2" color="bg-red-500" />
            <Card title="Calendar" icon="calendar" color="bg-indigo-500" />
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Home;
