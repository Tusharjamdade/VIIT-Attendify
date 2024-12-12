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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '@/src/firebase';

const Profile = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [rollNo, setRollNo] = useState('CS2023001');
  const [className, setClassName] = useState('Computer Science - Year 2');
  const [imageChanged, setImageChanged] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUserDetails = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(firestore, 'users', user.uid));
          if (userDoc.exists()) {
            setCurrentUser(userDoc.data());
            setFirstName(userDoc.data().firstName);
            setLastName(userDoc.data().lastName);
            setEmail(userDoc.data().email);
            setRollNo(userDoc.data().rollNo);
            setClassName(userDoc.data().className);
          } else {
            console.log('User document does not exist');
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUserDetails();
  }, []);

  const profileImages = [
    { name: 'boy1', source: require('@/assets/images/boy1.jpg') },
    { name: 'boy2', source: require('@/assets/images/boy2.jpg') },
    { name: 'boy3', source: require('@/assets/images/boy3.jpg') },
    { name: 'girl1', source: require('@/assets/images/girl1.jpg') },
    { name: 'girl2', source: require('@/assets/images/girl2.jpg') },
    { name: 'girl3', source: require('@/assets/images/girl3.jpg') },
  ];

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const selectImage = (index) => {
    setSelectedImage(index);
    setImageChanged(true);
  };

  // Save changes (store image name in Firestore)
  const saveChanges = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Get the selected image name
        const selectedImageName = profileImages[selectedImage].name;

        // Update user data in Firestore
        const userRef = doc(firestore, 'users', user.uid);
        await updateDoc(userRef, {
          image: selectedImageName,  // Store the selected image name in Firestore
        });

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
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
            source={profileImages[selectedImage].source}
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

        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: textColor, marginBottom: 8 }}>First Name</Text>
          <TextInput
            value={firstName}
            // onChangeText={setFirstName}
            editable={false}
            style={{
              backgroundColor: inputBgColor,
              color: textColor,
              padding: 12,
              borderRadius: 8,
            }}
          />
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: textColor, marginBottom: 8 }}>Last Name</Text>
          <TextInput
            value={lastName}
            editable={false}
            style={{
              backgroundColor: inputBgColor,
              color: textColor,
              padding: 12,
              borderRadius: 8,
            }}
          />
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: textColor, marginBottom: 8 }}>Email</Text>
          <TextInput
            value={email}
            editable={false}
            keyboardType="email-address"
            style={{
              backgroundColor: inputBgColor,
              color: textColor,
              padding: 12,
              borderRadius: 8,
            }}
          />
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: textColor, marginBottom: 8 }}>Roll Number</Text>
          <TextInput
            value={rollNo}
            onChangeText={setRollNo}
            style={{
              backgroundColor: inputBgColor,
              color: textColor,
              padding: 12,
              borderRadius: 8,
            }}
          />
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: textColor, marginBottom: 8 }}>Class</Text>
          <TextInput
            value={className}
            editable={false}
            style={{
              backgroundColor: inputBgColor,
              color: textColor,
              padding: 12,
              borderRadius: 8,
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
