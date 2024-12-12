import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { auth, firestore } from '@/src/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = (width - 75) / 2; // 48 = padding (16 * 2) + gap between cards (16)

const Card = ({ title, icon, onPress }) => (
  <TouchableOpacity 
    className="bg-blue-100 rounded-2xl shadow-md flex items-center justify-center mb-4"
    style={{ width: cardWidth, height: cardWidth }}
    onPress={onPress}
  >
    <Feather name={icon} size={36} color="#3B82F6" />
    <Text className="text-blue-600 font-bold mt-2 text-center text-lg">{title}</Text>
  </TouchableOpacity>
);

const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);  // State to track pull-to-refresh

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCurrentUserDetails();
    setRefreshing(false);
  };

  const fetchCurrentUserDetails = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser(userDoc.data());
        } else {
          console.log('User document does not exist');
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUserDetails();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-blue-500">Failed to load user details</Text>
      </View>
    );
  }

  const cards = [
    { title: "Attendance", icon: "user-check", path: "/attendance" },
    { title: "Schedule", icon: "calendar", path: "/" },
    { title: "Support", icon: "help-circle", path: "/support" },
    { title: "Add Lecture", icon: "plus-circle", path: "/postlecture" },
    { title: "Face Recog.", icon: "camera", path: "/facerec" },
    { title: "Download", icon: "download", path: "/downloadattendance" },
    { title: "Profile", icon: "user", path: "/profile" },
    { title: "Settings", icon: "settings", path: "/settings" },
    { title: "Logout", icon: "log-out", path: "/logout" },
    { title: "Help", icon: "help-circle", path: "/faq" },
    { title: "Notifications", icon: "bell", path: "/notifications" },
    { title: "Messages", icon: "message-square", path: "/messages" },
  ];

  const imageMap = {
    'boy1': require('@/assets/images/boy1.jpg'),
    'boy2': require('@/assets/images/boy2.jpg'),
    'boy3': require('@/assets/images/boy3.jpg'),
    'girl1': require('@/assets/images/girl1.jpg'),
    'girl2': require('@/assets/images/girl2.jpg'),
    'girl3': require('@/assets/images/girl3.jpg'),
    // Add more mappings as needed
  };
  
  const imageUrl = currentUser.image ? imageMap[currentUser.image] : null;
  
  return (
    <SafeAreaView className="flex-1 bg-blue-50">
      <ScrollView 
        className="flex-1" 
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="#3B82F6" // Color for the pull-to-refresh spinner
          />
        }
      >
        {/* Profile Section */}
        <View style={{ backgroundColor: '#fff', padding: 16, paddingTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Image
              source={imageUrl || { uri: "https://images.app.goo.gl/3ugxQh9jgVZEshzf8" }}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
            <View style={{ marginLeft: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                {currentUser.firstName} {currentUser.lastName}
              </Text>
              <Text style={{ fontSize: 16, color: '#666' }}>Computer Science Student</Text>
            </View>
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
            Hi, {currentUser.firstName}
          </Text>
          <Text style={{ fontSize: 16, color: '#666' }}>Welcome to your class</Text>
        </View>

        {/* Dashboard Section */}
        <View className="px-4 mt-5">
          <Text className="text-2xl font-bold text-blue-800 mb-4">My Dashboard</Text>
          <View className="flex-row flex-wrap justify-around">
            {cards.map((card, index) => (
              <Card
                key={index}
                title={card.title}
                icon={card.icon}
                onPress={() => router.push({ pathname: card.path })}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
