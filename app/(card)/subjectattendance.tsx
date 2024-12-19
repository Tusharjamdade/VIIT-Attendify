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
      // Example fetch - make sure to update this to fetch the actual students
      // You can replace the data with the actual data fetching logic here
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

  const renderHeader = () => (
    <View>
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
      <StudentProfile />
      <FlatList
        data={[]} // You will need to replace this with the actual student data
        renderItem={null} // Placeholder for now, use your actual render logic
        keyExtractor={() => 'header'} // Dummy key for the header
        ListHeaderComponent={renderHeader} // Renders the header with other components
        ListFooterComponent={<StudentList lecture={details} />} // StudentList is passed here to render footer content
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
