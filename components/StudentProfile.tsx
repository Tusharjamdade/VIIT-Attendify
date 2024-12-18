import React from 'react';
import { View, Text, Image, StyleSheet, useColorScheme } from 'react-native';
import useUserDetails from '@/hooks/useUserDetails';

export default function StudentProfile() {
  const { currentUser, loading, error, refetch } = useUserDetails();
  const isDarkMode = useColorScheme() === 'dark';

  const imageMap = {
    boy1: require('@/assets/images/boy1.jpg'),
    boy2: require('@/assets/images/boy2.jpg'),
    boy3: require('@/assets/images/boy3.jpg'),
    boy4: require('@/assets/images/boy4.png'),
    boy5: require('@/assets/images/boy5.jpg'),
    default: require('@/assets/images/default.jpg'),
    girl1: require('@/assets/images/girl1.jpg'),
    girl2: require('@/assets/images/girl2.jpg'),
    girl3: require('@/assets/images/girl3.jpg'),
    girl4: require('@/assets/images/girl4.jpg'),
    girl5: require('@/assets/images/girl5.jpg'),
  };

  const imageUrl = currentUser?.image ? imageMap[currentUser.image] : null;

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      backgroundColor: isDarkMode ? '#000' : '#E6F7FF', // Solid black for dark, light blue for light
      padding: 16,
      borderRadius: 8,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 3,
      borderColor: isDarkMode ? '#1E90FF' : '#00509E', // Light blue shades for contrast
    },
    textContainer: {
      marginLeft: 16,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#1E90FF' : '#00509E', // Text color matches the contrast
    },
    role: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#E6F7FF' : '#333', // Softer text color for each mode
    },
  });

  return (
    <View style={styles.container}>
      <Image source={imageUrl || require('@/assets/images/default.jpg')} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{currentUser?.firstName} {currentUser?.lastName}</Text>
        <Text style={styles.role}>{currentUser?.email}</Text>
      </View>
    </View>
  );
}
