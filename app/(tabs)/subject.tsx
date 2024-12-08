import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth, firestore } from '../(auth)/firebase';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const Subject = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState(''); // State to store user-entered password
  const [isDeleting, setIsDeleting] = useState(false); // State to manage delete action

  const fetchCurrentUserDetails = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser(userDoc.data());
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

  useEffect(() => {
    fetchCurrentUserDetails();
  }, []);

  const handleDeleteUser = async () => {
    if (!auth.currentUser) {
      Alert.alert('Error', 'No user is logged in.');
      return;
    }

    const user = auth.currentUser;
    const userUid = user.uid;

    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              // Prompt for password input if not already entered
              if (!password) {
                Alert.prompt(
                  'Reauthentication Required',
                  'Please enter your password:',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Submit',
                      onPress: async (inputPassword) => {
                        setPassword(inputPassword);
                        await handleReauthenticationAndDelete(user, userUid, inputPassword);
                      },
                    },
                  ],
                  'secure-text'
                );
              } else {
                await handleReauthenticationAndDelete(user, userUid, password);
              }
            } catch (error) {
              console.error('Error during delete:', error);
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleReauthenticationAndDelete = async (user, userUid, inputPassword) => {
    try {
      const credential = EmailAuthProvider.credential(user.email, inputPassword);
      await reauthenticateWithCredential(user, credential);

      // Delete Firestore document
      const userDocRef = doc(firestore, 'users', userUid);
      await deleteDoc(userDocRef);

      // Delete user from Firebase Authentication
      await deleteUser(user);

      Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
      router.replace('/');
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        Alert.alert('Reauthentication Required', 'Please log in again to delete your account.');
      } else {
        Alert.alert('Error', `Failed to delete account: ${error.message}`);
      }
      console.error('Error deleting user:', error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: 'red' }}>Failed to load user details</Text>
      </View>
    );
  }

  const classes = [
    {
      letter: 'M',
      subject: 'Mathematics',
      startTime: '09:30 AM',
      endTime: '10:45 AM',
      date: '05-Dec-2024',
      location: 'Room 101',
      teacher: 'Dr. Alan Smith',
      color: '#4CAF50',
    },
    // Add other subjects here
  ];

  const handleSubjectPress = (subjectDetails) => {
    router.push({
      pathname: '/subjectattendance',
      params: { subjectDetails: JSON.stringify(subjectDetails) },
    });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      <View style={{ backgroundColor: '#fff', padding: 16, paddingTop: 40 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
            style={{ width: 80, height: 80, borderRadius: 40 }}
          />
          <View style={{ marginLeft: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              {currentUser.firstName} {currentUser.lastName}
            </Text>
            <Text style={{ fontSize: 16, color: '#666' }}>Computer Science Student</Text>
          </View>
        </View>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
          Hi, {currentUser.firstName}
        </Text>
        <Text style={{ fontSize: 16, color: '#666' }}>Welcome to your class</Text>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Today's Schedule</Text>
        {classes.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              backgroundColor: '#fff',
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            onPress={() => handleSubjectPress(item)}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: item.color,
                marginRight: 12,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 18 }}>{item.letter}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.subject}</Text>
              <Text style={{ fontSize: 14, color: '#666' }}>
                {item.startTime} - {item.endTime} | {item.date}
              </Text>
              <Text style={{ fontSize: 14, color: '#666' }}>Location: {item.location}</Text>
              <Text style={{ fontSize: 14, color: '#666' }}>Teacher: {item.teacher}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={handleDeleteUser}
          disabled={isDeleting}
          style={{
            backgroundColor: isDeleting ? '#d3d3d3' : 'red',
            padding: 12,
            marginTop: 16,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
            {isDeleting ? 'Deleting...' : 'Delete User'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Subject;
