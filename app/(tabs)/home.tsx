import React from 'react';
import { View, Text, Image, ImageBackground, ScrollView, StyleSheet } from 'react-native';
import Card from '@/components/card';

const Home = () => {
  return (
    <ImageBackground
      source={{ uri: '' }}
      className="flex-1 bg-white"
    >
      <ScrollView className="flex-1">
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.profileName}>Sarah Johnson</Text>
              <Text style={styles.profileRole}>Computer Science Student</Text>
            </View>
          </View>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Hi, Sarah.</Text>
            <Text style={styles.welcomeSubtitle}>Welcome to your Class</Text>
          </View>
          <View style={styles.bioContainer}>
            <Text style={styles.bioTitle}>Student Bio</Text>
            <Text style={styles.bioDescription}>
              Passionate about AI and machine learning, I'm a third-year CS student with a knack for problem-solving and a love for coding. When I'm not debugging, you'll find me exploring new tech or contributing to open-source projects.
            </Text>
          </View>
        </View>

        {/* Dashboard Section */}
        <View style={styles.dashboardSection}>
          <Text style={styles.dashboardTitle}>My Dashboard</Text>
          <View style={styles.cardContainer}>
            <Card title="Attendance" icon="user-check" color="bg-blue-500" />
            <Card title="Today's Schedule" icon="book-open" color="bg-blue-400" />
            <Card title="Support" icon="help-circle" color="bg-blue-300" />
            {/* <Card title="Assignments" icon="clipboard" color="bg-blue-200" />
            <Card title="Grades" icon="bar-chart-2" color="bg-blue-100" />
            <Card title="Calendar" icon="calendar" color="bg-blue-50" /> */}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
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
