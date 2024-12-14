import useUserDetails from '@/hooks/useUserDetails';
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function StudentProfile() {
  const { currentUser, loading, error, refetch } = useUserDetails();
  const imageMap = {
    boy1: require('@/assets/images/boy1.jpg'),
    boy2: require('@/assets/images/boy2.jpg'),
    boy3: require('@/assets/images/boy3.jpg'),
    boy4: require('@/assets/images/boy4.png'),
    boy5: require('@/assets/images/boy5.jpg'),
    girl1: require('@/assets/images/girl1.jpg'),
    girl2: require('@/assets/images/girl2.jpg'),
    girl3: require('@/assets/images/girl3.jpg'),
    girl4: require('@/assets/images/girl4.jpg'),
    girl5: require('@/assets/images/girl5.jpg'),
  };

  const imageUrl = currentUser?.image ? imageMap[currentUser.image] : require('@/assets/images/default.jpg');
  return (
    <View style={styles.container}>
      <Image
         source={imageUrl }
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{currentUser?.firstName} {currentUser?.lastName}</Text>
        <Text style={styles.role}>{currentUser?.email}</Text>
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

