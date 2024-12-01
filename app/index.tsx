import { Link } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';

export default function App() {
  const colorScheme = useColorScheme(); // 'light' or 'dark'

  const isDarkMode = colorScheme === 'light';
  const styles = isDarkMode ? darkStyles : lightStyles;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Dark Mode!</Text>
      
    </View>
  );
}

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000',
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
});
