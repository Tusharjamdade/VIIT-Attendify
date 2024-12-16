import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions, useColorScheme } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import StudentProfile from '@/components/StudentProfile';
import { firestore } from '@/src/firebase';
import { collection, getDocs } from 'firebase/firestore';
import useUserDetails from '@/hooks/useUserDetails';

const screenWidth = Dimensions.get('window').width;

const AttendanceReport = () => {
  const { currentUser } = useUserDetails();
  const [attendanceStats, setAttendanceStats] = useState({ total: 0, present: 0 });
  const [loading, setLoading] = useState(true);
  const isDark = useColorScheme() === 'dark';

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const attendanceRef = collection(firestore, 'attendance');
        const querySnapshot = await getDocs(attendanceRef);
        let totalLectures = 0;
        let presentLectures = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          totalLectures += 1; // Each document represents one lecture

          // Check if the user is present in this lecture
          const studentRecord = data.students.find((student) => student.uid === currentUser.uid);
          if (studentRecord && studentRecord.present) {
            presentLectures += 1;
          }
        });

        setAttendanceStats({ total: totalLectures, present: presentLectures });
      } catch (error) {
        console.error('Error fetching attendance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [currentUser]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
        <Text style={[styles.loadingText, { color: isDark ? '#FFFFFF' : '#666' }]}>Loading Attendance Report...</Text>
      </SafeAreaView>
    );
  }

  const { total, present } = attendanceStats;
  const absent = total - present;
  const overallPercentage = ((present / total) * 100).toFixed(2);

  const pieData = [
    {
      name: 'Present',
      population: present,
      color: '#2F80ED',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Absent',
      population: absent,
      color: '#E0E0E0',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? 'black' : '#FFFFFF' }]}>
      <ScrollView>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: isDark ? '#121212' : '#FFFFFF' }]}>
          <Icon name="home" size={24} color={isDark ? '#2F80ED' : '#2F80ED'} />
          <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#2F80ED' }]}>Attendity</Text>
        </View>

        {/* Profile Section */}
        <StudentProfile />

        {/* Title */}
        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#2F80ED' }]}>Check Attendance Report</Text>

        {/* Overall Percentage */}
        <View style={styles.overallSection}>
          <Text style={[styles.overallText, { color: isDark ? '#FFFFFF' : '#666' }]}>
            Overall Percentage: {overallPercentage}%
          </Text>
        </View>

        {/* Pie Chart */}
        <View style={styles.pieChartContainer}>
          <PieChart
            data={pieData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(47, 128, 237, ${opacity})`,
              labelColor: (opacity = 1) => (isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`),
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        {/* Stats */}
        <View style={[styles.statsContainer, { backgroundColor: isDark ? '#333333' : '#F8F9FA' }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: isDark ? '#FFFFFF' : '#666' }]}>Total Classes</Text>
            <Text style={[styles.statValue, { color: isDark ? '#2F80ED' : '#2F80ED' }]}>{total}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: isDark ? '#FFFFFF' : '#666' }]}>Present Days</Text>
            <Text style={[styles.statValue, { color: isDark ? '#2F80ED' : '#2F80ED' }]}>{present}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: isDark ? '#FFFFFF' : '#666' }]}>Absent Days</Text>
            <Text style={[styles.statValue, { color: isDark ? '#2F80ED' : '#2F80ED' }]}>{absent}</Text>
          </View>
        </View>

        {/* Encouragement Message */}
        <Text style={[styles.encouragementText, { color: isDark ? '#FFFFFF' : '#2F80ED' }]}>
          Keep Up the Good Work!
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginHorizontal: 16,
    marginTop: 16,
  },
  overallSection: {
    padding: 16,
  },
  overallText: {
    fontSize: 16,
  },
  pieChartContainer: {
    alignItems: 'center',
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  encouragementText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 24,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 24,
  },
});

export default AttendanceReport;
