import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Student {
  id: number;
  rollNumber: string;
  name: string;
  isPresent: boolean;
}

interface StudentListProps {
  students: Student[];
  toggleAttendance: (id: number) => void;
}

export default function StudentList({ students, toggleAttendance }: StudentListProps) {
  const renderItem = ({ item }: { item: Student }) => (
    <TouchableOpacity onPress={() => toggleAttendance(item.id)} style={styles.studentItem}>
      <View style={styles.studentInfo}>
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
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: 'white',
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

