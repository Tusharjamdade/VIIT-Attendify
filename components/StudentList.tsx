import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '@/src/firebase';
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
  const [loadingg, setLoading] = useState(true);
  const { currentUser } = useUserDetails();

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
        const attendanceDoc = attendanceSnapshot.docs[0].ref; // Get the reference to the matching document

        const updatedStudents = students.map(({ id, ...rest }) => rest); // Remove unique ID
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
      style={styles.studentItem}
      disabled={currentUser.role === 'student'} // Disable toggle for students
    >
      <View style={styles.studentInfo}>
        <Text style={styles.rollNumber}>{String(item.rollNo).padStart(3, '0')}</Text>
        <Text style={styles.studentName}>{`${item.firstName} ${item.lastName}`}</Text>
      </View>
      <Feather
        name={item.present ? 'check-circle' : 'x-circle'}
        size={24}
        color={item.present ? '#4CAF50' : '#F44336'}
      />
    </TouchableOpacity>
  );

  if (loadingg) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student List</Text>
      {students.length > 0 ? (
        <FlatList
          data={students}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.noStudentsText}>No students found for this lecture.</Text>
      )}
      {(currentUser.role === 'faculty' || currentUser.role === 'admin') && (
        <Button title="Update Attendance" onPress={updateAttendance} color="#007AFF" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
});
