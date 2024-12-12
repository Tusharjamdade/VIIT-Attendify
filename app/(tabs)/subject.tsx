import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth, firestore } from '../../src/firebase';
import { deleteDoc, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const Subject = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh
  const [lectures, setLectures] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const fetchLectures = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      console.log(formattedDate);
      const lecturesRef = collection(firestore, 'lectures');
      const q = query(lecturesRef, where('lectureDate', '==', formattedDate));
      const querySnapshot = await getDocs(q);

      const fetchedLectures = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLectures(fetchedLectures);
    } catch (error) {
      console.error('Error fetching lectures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCurrentUserDetails();
    await fetchLectures();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchCurrentUserDetails();
    fetchLectures();
  }, []);

  const handleSubjectPress = (subjectDetails) => {
    router.push({
      pathname: '/subjectattendance',
      params: { subjectDetails: JSON.stringify(subjectDetails) },
    });
  };

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
              const credential = EmailAuthProvider.credential(user.email, 'YourPassword'); // Replace with a password prompt
              await reauthenticateWithCredential(user, credential);

              // Delete Firestore document
              const userDocRef = doc(firestore, 'users', userUid);
              await deleteDoc(userDocRef);

              // Delete user from Firebase Authentication
              await deleteUser(user);

              Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
              router.replace('/');
            } catch (error) {
              Alert.alert('Error', `Failed to delete account: ${error.message}`);
              console.error('Error deleting user:', error);
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
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

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f0f0f0' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={{ backgroundColor: '#fff', padding: 16, paddingTop: 10 }}>
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
        {lectures.length > 0 ? (
          lectures.map((lecture) => (
            <TouchableOpacity
              key={lecture.id}
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
              onPress={() => handleSubjectPress(lecture)}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#4CAF50',
                  marginRight: 12,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 18 }}>{lecture.subject[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{lecture.subject}</Text>
                <Text style={{ fontSize: 14, color: '#666' }}>
                  {lecture.startTime} - {lecture.endTime} | {lecture.lectureDate}
                </Text>
                <Text style={{ fontSize: 14, color: '#666' }}>Location: {lecture.location}</Text>
                <Text style={{ fontSize: 14, color: '#666' }}>Teacher: {lecture.teacherName}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
            No lectures scheduled for today.
          </Text>
        )}
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
