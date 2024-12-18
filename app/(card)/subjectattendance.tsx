import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  RefreshControl,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import StudentProfile from '@/components/StudentProfile';
import StudentList from '@/components/StudentList';
import SubjectCard from '@/components/SubjectCard';
import { useSearchParams } from 'expo-router/build/hooks';

export default function SubjectAttendance() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const params = useSearchParams();
  const subjectDetailsString = params.get('subjectDetails');
  const { colors } = useTheme();

  // Parsing the subject details from the params
  const details = JSON.parse(subjectDetailsString || '{}');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Perform any necessary data fetching or state updates here
      console.log('Refreshing data...');
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);
  console.log("Subject attendance")

  const renderHeader = () => (
    <View>
      <StudentProfile />
      <SubjectCard
        subjectId={details.id}
        subjectName={details.subject || 'Unknown Subject'}
        startTime={details.startTime || 'N/A'}
        endTime={details.endTime || 'N/A'}
        date={details.lectureDate || 'N/A'}
        teacherName={details.teacherName || 'Unknown Teacher'}
        location={details.location || 'N/A'}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={[]} // Empty data as FlatList requires a `data` prop
        renderItem={null} // No item to render in this list
        keyExtractor={() => 'header'} // Dummy key
        ListHeaderComponent={renderHeader} // Renders the header with other components
        ListFooterComponent={<StudentList lecture={details} />} // Refreshes this component as well
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]} // Pull-to-refresh indicator color
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
});
