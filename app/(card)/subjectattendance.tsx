import StudentList from '@/components/StudentList';
import StudentProfile from '@/components/StudentProfile';
import SubjectCard from '@/components/SubjectCard';
import { useSearchParams } from 'expo-router/build/hooks';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

export default function SubjectAttendance() {
  const params = useSearchParams();
  const subjectDetailsString = params.get('subjectDetails');

  // if (subjectDetailsString) {
  const details = JSON.parse(subjectDetailsString);
  // }
  console.log(details)
  const [students, setStudents] = useState(
    Array.from({ length: 79 }, (_, i) => ({
      id: i + 1,
      rollNumber: `00${i + 1}`.slice(-3),
      name: `Student ${i + 1}`,
      isPresent: false,
    }))
  );

  const toggleAttendance = (id: number) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id ? { ...student, isPresent: !student.isPresent } : student
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <StudentProfile />
        <SubjectCard
          subjectName={details.subject || 'Unknown Subject'}
          startTime={details.startTime || 'N/A'}
          endTime={details.endTime || 'N/A'}
          date={details.date || 'N/A'}
          teacherName={details.teacher || 'Unknown Teacher'}
          location={details.location || 'N/A'}
          presentCount={students.filter((s) => s.isPresent).length}
          totalCount={students.length}
        />
        <StudentList students={students} toggleAttendance={toggleAttendance} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContent: {
    padding: 16,
  },
});
