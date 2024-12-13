import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { updateDoc, doc } from 'firebase/firestore';
import { firestore } from '@/src/firebase';
import useUserDetails from '@/hooks/useUserDetails';

const Profile = () => {
  const { currentUser, loading: userLoading, error } = useUserDetails();
  const [darkMode, setDarkMode] = useState(false);
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

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

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

  const bgColor = darkMode ? '#1A202C' : '#F7FAFC';
  const textColor = darkMode ? '#E2E8F0' : '#2D3748';
  const inputBgColor = darkMode ? '#2D3748' : '#FFFFFF';
  const buttonBgColor = darkMode ? '#4A5568' : '#E2E8F0';
  const buttonTextColor = darkMode ? '#E2E8F0' : '#2D3748';

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: textColor }}>Profile</Text>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={darkMode ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>

        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Image
            source={
              selectedImage !== null
                ? profileImages[selectedImage].source
                : require('@/assets/images/boy1.jpg') // Fallback image
            }
            style={{ width: 120, height: 120, borderRadius: 60 }}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {profileImages.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => selectImage(index)}
              style={{ marginRight: 8 }}
            >
              <Image
                source={image.source}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  borderWidth: selectedImage === index ? 2 : 0,
                  borderColor: 'blue',
                }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

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
            <Text style={{ color: buttonTextColor, textAlign: 'center', fontWeight: '600' }}>
              Save Changes
            </Text>
          </TouchableOpacity>
        )}

        {/* Display form fields */}
        {currentUser && [
          { label: 'First Name', value: currentUser.firstName, editable: false },
          { label: 'Last Name', value: currentUser.lastName, editable: false },
          { label: 'Email', value: currentUser.email, editable: false },
          { label: 'Roll Number', value: rollNo, editable: true },
          { label: 'Class', value: currentUser.className, editable: false },
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

export default Profile;
