import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons'; // For sun and moon icons
import { updateDoc, doc } from 'firebase/firestore';
import { firestore } from '@/src/firebase';
import useUserDetails from '@/hooks/useUserDetails';
import Icon from 'react-native-vector-icons/FontAwesome';

const Profile = () => {
  const isDark = useColorScheme() === 'dark'; 
  const { currentUser, loading: userLoading, error } = useUserDetails();
  const [selectedImage, setSelectedImage] = useState(null);
  const [rollNo, setRollNo] = useState('');
  const [imageChanged, setImageChanged] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const profileImages = [
    { name: 'boy1', source: require('@/assets/images/boy1.jpg') },
    { name: 'boy2', source: require('@/assets/images/boy2.jpg') },
    { name: 'boy3', source: require('@/assets/images/boy3.jpg') },
    { name: 'boy4', source: require('@/assets/images/boy4.png') },
    { name: 'boy5', source: require('@/assets/images/boy5.jpg') },
    { name: 'girl1', source: require('@/assets/images/girl1.jpg') },
    { name: 'girl2', source: require('@/assets/images/girl2.jpg') },
    { name: 'girl3', source: require('@/assets/images/girl3.jpg') },
    { name: 'girl4', source: require('@/assets/images/girl4.jpg') },
    { name: 'girl5', source: require('@/assets/images/girl5.jpg') },
  ];

  useEffect(() => {
    if (currentUser) {
      setRollNo(currentUser.rollNo || '');
      const imageName = currentUser.image || null;
      if (imageName) {
        const index = profileImages.findIndex((img) => img.name === imageName);
        if (index !== -1) setSelectedImage(index);
      }
    }
  }, [currentUser]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Re-fetch user details using the hook logic
    setRefreshing(false);
  };

  const selectImage = (index) => {
    setSelectedImage(index);
    setImageChanged(true);
  };

  const saveChanges = async () => {
    try {
      if (currentUser && selectedImage !== null) {
        const selectedImageName = profileImages[selectedImage].name;
        const userRef = doc(firestore, 'users', currentUser.uid);
        await updateDoc(userRef, { image: selectedImageName });
        setImageChanged(false);
        Alert.alert('Success', 'Changes saved successfully!');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      Alert.alert('Error', 'Something went wrong while saving your changes.');
    }
  };

  const bgColor = isDark ? '#121212' : '#F7FAFC';
  const textColor = isDark ? '#E2E8F0' : '#2D3748';
  const inputBgColor = isDark ? '#2D3748' : '#FFFFFF';
  const buttonBgColor = isDark ? '#4A5568' : '#E2E8F0';
  const buttonTextColor = isDark ? '#E2E8F0' : '#2D3748';

  if (userLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor }}>
        <Text style={{ color: textColor }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: bgColor }}>
        <Text style={{ color: 'red' }}>Error: {error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <ScrollView
        style={{ flex: 1, padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={[styles.header, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
          <Icon name="user" size={24} color={isDark ? '#2F80ED' : '#2F80ED'} />
          <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#2F80ED' }]}>Profile</Text>
        </View>

        {/* Profile Image Section */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Image
            source={
              selectedImage !== null
                ? profileImages[selectedImage].source
                : require('@/assets/images/boy1.jpg') // Fallback image
            }
            style={{ width: 140, height: 140, borderRadius: 80 }}
          />
        </View>

        {/* Image Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {profileImages.map((image, index) => (
            <TouchableOpacity key={index} onPress={() => selectImage(index)} style={{ marginRight: 8 }}>
              <Image
                source={image.source}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 40,
                  borderWidth: selectedImage === index ? 2 : 0,
                  borderColor: 'blue',
                }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Save Button */}
        {imageChanged && (
          <TouchableOpacity
            onPress={saveChanges}
            style={{
              backgroundColor: buttonBgColor,
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: buttonTextColor, textAlign: 'center', fontWeight: '600' }}>Save Changes</Text>
          </TouchableOpacity>
        )}

        {/* User Details Form */}
        {currentUser && [
          { label: 'First Name', value: currentUser.firstName, editable: false },
          { label: 'Last Name', value: currentUser.lastName, editable: false },
          { label: 'Email', value: currentUser.email, editable: false },
          { label: 'Roll Number', value: currentUser.rollNo.toString(), editable: true },
          { label: 'Class', value: 'Computer Science and Engineering (Data Science)', editable: false },
        ].map(({ label, value, editable }, index) => (
          <View style={{ marginBottom: 24 }} key={index}>
            <Text style={{ color: textColor, marginBottom: 8 }}>{label}</Text>
            <TextInput
              value={value}
              onChangeText={editable ? setRollNo : undefined}
              editable={editable}
              style={{
                backgroundColor: inputBgColor,
                color: textColor,
                padding: 12,
                borderRadius: 8,
              }}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
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
};

export default Profile;
