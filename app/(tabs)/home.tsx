import React, { useEffect, useState } from 'react';
import { View, Text, Image, ImageBackground, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import Card from '@/components/card';
import { router } from 'expo-router';
import { auth, firestore } from '../../src/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  const [currentUser, setCurrentUser] = useState(null); // To store user details
  const [loading, setLoading] = useState(true); // To manage loading state

  const fetchCurrentUserDetails = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid)); // Fetch user document from Firestore
        if (userDoc.exists()) {
          setCurrentUser(userDoc.data()); // Update state with user details
        } else {
          console.log('User document does not exist');
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  useEffect(() => {
    fetchCurrentUserDetails(); // Fetch user details on component mount
  }, []);

  if (loading) {
    // Show loading spinner while fetching data
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  if (!currentUser) {
    // Show error message if user details could not be fetched
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: 'red' }}>Failed to load user details</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
    <ImageBackground source={{ uri: '' }} className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image
              source={{
                uri: currentUser.profileImage || 'https://randomuser.me/api/portraits/women/44.jpg',
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.profileName}>
                {currentUser.firstName} {currentUser.lastName}
              </Text>
              <Text style={styles.profileRole}>{currentUser.email}</Text>
            </View>
          </View>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Hi, {currentUser.firstName}({currentUser.role})</Text>
            <Text style={styles.welcomeSubtitle}>Welcome to your Class</Text>
          </View>
          {/* <View style={styles.bioContainer}>
            <Text style={styles.bioTitle}>Student Bio</Text>
            <Text style={styles.bioDescription}>{currentUser.role}</Text>
          </View> */}
        </View>

        {/* Dashboard Section */}
        <View style={styles.dashboardSection}>
          <Text style={styles.dashboardTitle}>My Dashboard</Text>
          <View style={styles.cardContainer}>
            <Card
              title="Attendance"
              icon="user-check"
              color="bg-blue-500"
              onPress={() => {
                router.push({ pathname: '/attendance' });
              }}
            />
            <Card
              title="Today's Schedule"
              icon="book-open"
              color="bg-blue-400"
              onPress={() => {
                router.push({ pathname: '/' });
              }}
            />
            <Card
              title="Support"
              icon="help-circle"
              color="bg-blue-300"
              onPress={() => {
                router.push({ pathname: '/support' });
              }}
            />
            <Card
              title="Add Lecture"
              icon="help-circle"
              color="bg-blue-300"
              onPress={() => {
                router.push({ pathname: '/postlecture' });
              }}
            />
            <Card
              title="Face Recognition"
              icon="help-circle"
              color="bg-blue-300"
              onPress={() => {
                router.push({ pathname: '/facerec' });
              }}
            />
            <Card
              title="Download Attendance"
              icon="help-circle"
              color="bg-blue-300"
              onPress={() => {
                router.push({ pathname: '/downloadattendance' });
              }}
            />
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  profileSection: {
    backgroundColor: '#003366', // Deep Blue
    padding: 24,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginRight: 16,
  },
  profileName: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  profileRole: {
    fontSize: 14,
    color: '#B3E5FC', // Light Blue
  },
  welcomeSection: {
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#B3E5FC', // Light Blue
  },
  bioContainer: {
    backgroundColor: '#004080', // Medium Blue
    padding: 16,
    borderRadius: 12,
  },
  bioTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bioDescription: {
    fontSize: 14,
    color: '#E3F2FD', // Very Light Blue
  },
  dashboardSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  dashboardTitle: {
    fontSize: 20,
    color: '#003366',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
