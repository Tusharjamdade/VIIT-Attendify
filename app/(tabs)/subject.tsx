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
  useColorScheme,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { firestore } from '../../src/firebase';
import { deleteDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import useUserDetails from '@/hooks/useUserDetails';
// import { StatusBar } from 'expo-status-bar';

const Subject = () => {
  const isDarkMode = useColorScheme() === 'dark'; // Determine if dark mode is active
  const router = useRouter();
  const { currentUser, loading: userLoading, error, refetch } = useUserDetails();
  const [lectures, setLectures] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const darkThemeColors = {
    background: '#121212',
    text: '#E0E0E0',
    cardBackground: '#1E1E1E',
    primary: '#90CAF9', // Light blue for dark mode accents
    deleteButton: '#E57373', // Light red for dark mode
  };

  const lightThemeColors = {
    background: '#f0f0f0',
    text: '#333',
    cardBackground: '#fff',
    primary: '#4CAF50', // Green for light mode accents
    deleteButton: 'red',
  };

  const themeColors = isDarkMode ? darkThemeColors : lightThemeColors;

  function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const fetchLectures = async () => {
    try {
      const today = new Date();
      const formattedDate = formatDate(today);
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
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    await fetchLectures();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchLectures();
  }, []);

  const handleSubjectPress = (subjectDetails) => {
    router.push({
      pathname: '/subjectattendance',
      params: { subjectDetails: JSON.stringify(subjectDetails) },
    });
  };

  const handleDeleteUser = async () => {
    if (!currentUser) {
      Alert.alert('Error', 'No user is logged in.');
      return;
    }

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
              const credential = EmailAuthProvider.credential(
                currentUser.email,
                'YourPassword' // Replace with a password prompt
              );
              await reauthenticateWithCredential(auth.currentUser, credential);

              const userDocRef = doc(firestore, 'users', currentUser.uid);
              await deleteDoc(userDocRef);

              await deleteUser(auth.currentUser);

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

  if (userLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: themeColors.text }}>Error: {error.message}</Text>
      </View>
    );
  }

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

  const imageUrl = currentUser.image ? imageMap[currentUser.image] : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
         <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={themeColors.background}
      />
        <View style={{ backgroundColor: themeColors.cardBackground, padding: 16, paddingTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Image
              source={imageUrl || require('@/assets/images/default.jpg')}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
            <View style={{ marginLeft: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: themeColors.text }}>
                {currentUser.firstName} {currentUser.lastName}
              </Text>
              <Text style={{ fontSize: 16, color: '#666' }}>{currentUser.email}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: themeColors.text }}>
            Hi, {currentUser.firstName}
          </Text>
          <Text style={{ fontSize: 16, color: themeColors.text }}>Welcome to your class</Text>
        </View>

        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: themeColors.text }}>
            Today's Schedule
          </Text>
          {lectures.length > 0 ? (
            lectures.map((lecture) => (
              <TouchableOpacity
                key={lecture.id}
                style={{
                  backgroundColor: themeColors.cardBackground,
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
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: themeColors.primary,
                    marginRight: 12,
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
                    {lecture.subject[0].toUpperCase()}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: themeColors.text }}>
                    {lecture.subject}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#666' }}>
                    {lecture.startTime} - {lecture.endTime} | {lecture.lectureDate}
                  </Text>
                  <Text style={{ fontSize: 14, color: themeColors.text }}>
                    Location: {lecture.location}
                  </Text>
                  <Text style={{ fontSize: 14, color: themeColors.text }}>
                    Teacher: {lecture.teacherName}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={themeColors.text} />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ fontSize: 16, color: themeColors.text, textAlign: 'center' }}>
              No lectures scheduled for today.
            </Text>
          )}
          <TouchableOpacity
            onPress={handleDeleteUser}
            disabled={isDeleting}
            style={{
              backgroundColor: isDeleting ? '#d3d3d3' : themeColors.deleteButton,
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
    </SafeAreaView>
  );
};

export default Subject;
