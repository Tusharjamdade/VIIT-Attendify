import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Button, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import firebase from "../app/(auth)/firebase";
export default function AttendanceScreen() {
  const classes = [
    { letter: 'M', subject: 'Mathematics I', time: '09:30 am', color: '#E3F2FD' },
    { letter: 'P', subject: 'Physics', time: '10:40 am', color: '#E1F5FE' },
    { letter: 'B', subject: 'Biology', time: '11:45 am', color: '#E0F2F1' },
    { letter: 'G', subject: 'Geography', time: '12:10 am', color: '#F3E5F5' },
  ];
  const logout = async () => {
    try {
      await firebase.auth().signOut();
      Alert.alert('Logged out successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.header}>
        <Ionicons name="home-outline" size={24} color="#000" />
        <Text style={styles.headerTitle}>Attendity</Text>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{ uri: '../images/image.png' }}
          style={styles.avatar}
        />
        <Text style={styles.email}>sakshichoudhary@email.com</Text>
      </View>

      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Hi, Sakshi.</Text>
        <Text style={styles.welcomeSubtitle}>Welcome to your Class</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Classes</Text>
        <Ionicons name="chevron-forward" size={24} color="#000" />
      </View>

      <View style={styles.classesContainer}>
        {classes.map((item, index) => (
          <View key={index} style={styles.classItem}>
            <View style={[styles.letterCircle, { backgroundColor: item.color }]}>
              <Text style={styles.letterText}>{item.letter}</Text>
            </View>
            <View style={styles.classInfo}>
              <Text style={styles.subjectText}>{item.subject}</Text>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
          </View>
        ))}
      </View>

      {['Check Attendance Report', 'Faculty Details', 'Class Details'].map((item, index) => (
        <TouchableOpacity key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{item}</Text>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </TouchableOpacity>
      ))} */}
      <Link href={"/home"}>Home</Link>
      <Link href={"/subject"}>subject</Link>
      <Link href={"/signin"}>Signin</Link>
      <Link href={"/signup"}>Signup</Link>
     
      <Button title="Logout" onPress={logout} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  profileSection: {
    padding: 16,
    gap: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  welcomeSection: {
    padding: 16,
    gap: 4,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '600',
  },
  welcomeSubtitle: {
    fontSize: 20,
    color: '#64B5F6',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  classesContainer: {
    padding: 16,
    gap: 12,
  },
  classItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  letterCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterText: {
    fontSize: 18,
    fontWeight: '500',
  },
  classInfo: {
    flex: 1,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
});



// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAR0kqtOfhnPVWV34bgCeMkNRRpkYo-nak",
//   authDomain: "attendify-by-tushar.firebaseapp.com",
//   projectId: "attendify-by-tushar",
//   storageBucket: "attendify-by-tushar.firebasestorage.app",
//   messagingSenderId: "880770431995",
//   appId: "1:880770431995:web:2e338f3945e16bd534695e"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);