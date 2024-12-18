import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { firestore } from '@/src/firebase';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import useUserDetails from '@/hooks/useUserDetails';

interface Student {
  id: string;
  rollNo: number;
  firstName: string;
  lastName: string;
  present: boolean;
}

interface Lecture {
  id: string;
}

export default function StudentList({ lecture }: { lecture: Lecture }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useUserDetails();
  const { colors } = useTheme();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const attendanceQuery = query(
          collection(firestore, 'attendance'),
          where('lectureId', '==', lecture.id)
        );

        const attendanceSnapshot = await getDocs(attendanceQuery);

        const studentsData: Student[] = attendanceSnapshot.docs
          .flatMap((doc) => {
            const data = doc.data();
            if (Array.isArray(data.students)) {
              return data.students.map((student: any) => ({
                id: `${doc.id}-${student.rollNo}`,
                rollNo: student.rollNo,
                firstName: student.firstName,
                lastName: student.lastName,
                present: student.present,
              }));
            }
            return [];
          })
          .sort((a, b) => a.rollNo - b.rollNo);

        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [lecture.id]);

  const toggleAttendance = (id: string) => {
    if (currentUser.role === 'faculty' || currentUser.role === 'admin') {
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === id ? { ...student, present: !student.present } : student
        )
      );
    }
  };

  const updateAttendance = async () => {
    try {
      const attendanceQuery = query(
        collection(firestore, 'attendance'),
        where('lectureId', '==', lecture.id)
      );
      const attendanceSnapshot = await getDocs(attendanceQuery);

      if (!attendanceSnapshot.empty) {
        const attendanceDoc = attendanceSnapshot.docs[0].ref;

        const updatedStudents = students.map(({ id, ...rest }) => rest);
        await updateDoc(attendanceDoc, { students: updatedStudents });
        alert('Attendance updated successfully!');
      } else {
        alert('No matching attendance document found.');
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Failed to update attendance.');
    }
  };

  const renderItem = ({ item }: { item: Student }) => (
    <TouchableOpacity
      onPress={() => toggleAttendance(item.id)}
      style={[styles.studentItem, { backgroundColor: colors.card }]}
      disabled={currentUser.role === 'student'}
    >
      <View style={styles.studentInfo}>
        <Text style={[styles.rollNumber, { color: colors.text }]}>
          {String(item.rollNo).padStart(3, '0')}
        </Text>
        <Text style={[styles.studentName, { color: colors.text }]}>
          {`${item.firstName} ${item.lastName}`}
        </Text>
      </View>
      <Feather
        name={item.present ? 'check-circle' : 'x-circle'}
        size={24}
        color={item.present ? colors.primary : colors.notification}
      />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={students}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[styles.listContent, { backgroundColor: colors.background }]}
      nestedScrollEnabled
      ListHeaderComponent={
        <Text style={[styles.title, { color: colors.text }]}>Student List</Text>
      }
      ListEmptyComponent={
        <Text style={[styles.noStudentsText, { color: colors.text }]}>
          No students found for this lecture.
        </Text>
      }
      ListFooterComponent={
        (currentUser.role === 'faculty' || currentUser.role === 'admin') && (
          <TouchableOpacity
            style={[styles.updateButton, { backgroundColor: colors.primary }]}
            onPress={updateAttendance}
          >
            <Text style={[styles.updateButtonText, { color: colors.background }]}>
              Update Attendance
            </Text>
          </TouchableOpacity>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rollNumber: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
    minWidth: 40,
  },
  studentName: {
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noStudentsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  updateButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
