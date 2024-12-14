import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { firestore } from '@/src/firebase';

interface Student {
  id: string;
  rollNumber: string;
  name: string;
  isPresent: boolean;
}

export default function StudentList({lecture}) {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Query Firestore for users with the role 'student', ordered by roll number
        const q = query(
          collection(firestore, 'users'),
          where('role', '==', 'student'),
          // orderBy('rollNo', 'asc') // Ensure rollNo field exists and is indexed
        );

        const usersSnapshot = await getDocs(q);

        const studentsData: Student[] = usersSnapshot.docs
  .map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      rollNumber: `00${data.rollNo}`.slice(-3), // Format roll number as 001, 002, etc.
      name: `${data.firstName} ${data.lastName}`,
      isPresent: false, // Default attendance status
    };
  })
  .sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));

        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const toggleAttendance = (id: string) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id ? { ...student, isPresent: !student.isPresent } : student
      )
    );
  };

  const renderItem = ({ item }: { item: Student }) => (
    <TouchableOpacity onPress={() => toggleAttendance(item.id)} style={styles.studentItem}>
      <View style={styles.studentInfo}>
        {/* <Text>{JSON.stringify(lecture)}</Text> */}
        <Text style={styles.rollNumber}>{item.rollNumber}</Text>
        <Text style={styles.studentName}>{item.name}</Text>
      </View>
      <Feather
        name={item.isPresent ? 'check-circle' : 'circle'}
        size={24}
        color={item.isPresent ? '#4CAF50' : '#F44336'}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student List</Text>
      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
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
});
