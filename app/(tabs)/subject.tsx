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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { firestore } from '../../src/firebase';
import { deleteDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import useUserDetails from '@/hooks/useUserDetails';
import { DarkTheme, DefaultTheme, useTheme } from '@react-navigation/native';

const Subject = () => {
  console.log("Subject")
  const router = useRouter();
  const { colors } = useTheme();
  const { currentUser, loading: userLoading, error, refetch } = useUserDetails();
  const [lectures, setLectures] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  if (userLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ fontSize: 18, color: colors.text }}>Error: {error.message}</Text>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
        }
      >
        <View style={{ backgroundColor: colors.card, padding: 16, paddingTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Image
              source={imageUrl || require('@/assets/images/default.jpg')}
              style={{ width: 80, height: 80, borderRadius: 40,borderColor: colors.primary ,borderWidth: 3 }}
            />
            <View style={{ marginLeft: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
                {currentUser.firstName} {currentUser.lastName}
              </Text>
              <Text style={{ fontSize: 16, color: colors.text }}>{currentUser.email}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: colors.text }}>
            Hi, {currentUser.firstName}
          </Text>
          <Text style={{ fontSize: 16, color: colors.text }}>Welcome to your class</Text>
        </View>

        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: colors.text }}>
            Today's Schedule
          </Text>
          {lectures.length > 0 ? (
            lectures.map((lecture) => (
              <TouchableOpacity
                key={lecture.id}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: colors.border,
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
                    backgroundColor: colors.primary,
                    marginRight: 12,
                    shadowColor: colors.border,
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Text style={{ color: colors.background, fontSize: 20, fontWeight: 'bold' }}>
                    {lecture.subject[0].toUpperCase()}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>
                    {lecture.subject}
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.text }}>
                    {lecture.startTime} - {lecture.endTime} | {lecture.lectureDate}
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.text }}>
                    Location: {lecture.location}
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.text }}>
                    Teacher: {lecture.teacherName}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={colors.text} />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ fontSize: 16, color: colors.text, textAlign: 'center' }}>
              No lectures scheduled for today.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Subject;

