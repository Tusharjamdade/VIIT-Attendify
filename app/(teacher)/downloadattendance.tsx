import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth, firestore } from '../../src/firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

const DownloadAttendance = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lectures, setLectures] = useState([]);

  const fetchCurrentUserDetails = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser(userDoc.data());

          // Fetch lectures related to the user
          const lecturesQuery = query(
            collection(firestore, 'lectures'),
            where('userId', '==', user.uid)
          );
          const lecturesSnapshot = await getDocs(lecturesQuery);
          const lecturesData = lecturesSnapshot.docs.map((doc) => {
            const lecture = doc.data();
            // Convert Firebase Timestamps to readable strings
            lecture.startTime = lecture.startTime.toLocaleString() || '';
            lecture.endTime = lecture.endTime.toLocaleString() || '';
            lecture.lectureDate = lecture.lectureDate.toLocaleString()  || '';
            return { id: doc.id, ...lecture };
          });
          setLectures(lecturesData);
        } else {
          console.log('User document does not exist');
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCurrentUserDetails();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCurrentUserDetails();
  };

  if (loading && !refreshing) {
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

  const handleDownload = (format) => {
    Alert.alert('Download', `Downloading attendance in ${format} format.`);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f0f8ff' }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={{ backgroundColor: '#ffffff', padding: 16, paddingTop: 40 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/44.jpg' }}
            style={{ width: 80, height: 80, borderRadius: 40 }}
          />
          <View style={{ marginLeft: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              {currentUser.firstName} {currentUser.lastName}
            </Text>
            <Text style={{ fontSize: 16, color: '#666' }}>Computer Science Student</Text>
          </View>
        </View>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#003366' }}>
          Your Lectures
        </Text>
        {lectures.map((lecture) => (
          <View
            key={lecture.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name="book" size={24} color="#003366" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#003366' }}>
                {lecture.subject}
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: '#666' }}>
              Time: {lecture.startTime} - {lecture.endTime}
            </Text>
            <Text style={{ fontSize: 14, color: '#666' }}>Date: {lecture.lectureDate}</Text>
            <Text style={{ fontSize: 14, color: '#666' }}>Location: {lecture.location}</Text>
            <Text style={{ fontSize: 14, color: '#666' }}>Teacher: {lecture.teacherName}</Text>
            <View style={{ flexDirection: 'row', marginTop: 12 }}>
              <TouchableOpacity
                onPress={() => handleDownload('PDF')}
                style={{
                  backgroundColor: '#003366',
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  marginRight: 8,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Download PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDownload('Excel')}
                style={{
                  backgroundColor: '#003366',
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Download Excel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default DownloadAttendance;
