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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { updateDoc, doc } from 'firebase/firestore';
import { auth, firestore } from '@/src/firebase';
import useUserDetails from '@/hooks/useUserDetails';
import { signOut } from 'firebase/auth';
import { router, useRouter } from 'expo-router';
import { DarkTheme, DefaultTheme, useTheme } from '@react-navigation/native';

const Profile = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { currentUser, loading: userLoading, error } = useUserDetails();
  const [selectedImage, setSelectedImage] = useState(null);
  const [rollNo, setRollNo] = useState('');
  const [imageChanged, setImageChanged] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace({ pathname: "/" });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  
  console.log("Profile")
  const profileImages = [
    { name: 'boy1', source: require('@/assets/images/boy1.jpg') },
    { name: 'boy2', source: require('@/assets/images/boy2.jpg') },
    { name: 'boy3', source: require('@/assets/images/boy3.jpg') },
    { name: 'boy4', source: require('@/assets/images/boy4.png') },
    { name: 'boy5', source: require('@/assets/images/boy5.jpg') },
    { name: 'default', source: require('@/assets/images/default.jpg') },
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

  if (userLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.text }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.error }}>Error: {error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, flexDirection: 'column' }}>
      <ScrollView
        style={{ flex: 1, padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Image
            source={
              selectedImage !== null
                ? profileImages[selectedImage].source
                : require('@/assets/images/default.jpg')
            }
            style={{ width: 140, height: 140, borderRadius: 80 ,borderColor:colors.primary,borderWidth:3}}
          />
        </View>

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
                  borderColor: colors.primary,
                }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {imageChanged && (
          <TouchableOpacity
            onPress={saveChanges}
            style={{
              backgroundColor: colors.primary,
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: colors.background, textAlign: 'center', fontWeight: '600' }}>Save Changes</Text>
          </TouchableOpacity>
        )}

        {currentUser && [
          { label: 'First Name', value: currentUser.firstName, editable: false },
          { label: 'Last Name', value: currentUser.lastName, editable: false },
          { label: 'Email', value: currentUser.email, editable: false },
          { label: 'Roll Number', value: currentUser.rollNo.toString(), editable: true },
          { label: 'Class', value: 'Computer Science and Engineering (Data Science)', editable: false },
        ].map(({ label, value, editable }, index) => (
          <View style={{ marginBottom: 24 }} key={index}>
            <Text style={{ color: colors.text, marginBottom: 8 }}>{label}</Text>
            <TextInput
              value={value}
              onChangeText={editable ? setRollNo : undefined}
              editable={editable}
              style={{
                backgroundColor: colors.card,
                color: colors.text,
                padding: 14,
                borderRadius: 8,
              }}
            />
          </View>
        ))}
      </ScrollView>
      <View style={{ padding: 16, marginTop: 'auto', justifyContent: 'flex-end' }}>
  <TouchableOpacity
    onPress={handleLogout}
    style={{
      backgroundColor: "red", // Red for a logout button
      paddingVertical: 10,
      paddingHorizontal: 4,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4, // Shadow effect for better visibility
      shadowColor: colors.text,
      shadowOpacity: 0.2,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
    }}
  >
    <Text style={{ color: colors.background, fontSize: 18, fontWeight: '600' }}>
      Logout
    </Text>
  </TouchableOpacity>
</View>

    </SafeAreaView>
  );
};

export default Profile;

