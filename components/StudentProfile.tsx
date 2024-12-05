import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function StudentProfile() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>Sarah Johnson</Text>
        <Text style={styles.role}>Computer Science Student</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'white',
  },
  textContainer: {
    marginLeft: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});

