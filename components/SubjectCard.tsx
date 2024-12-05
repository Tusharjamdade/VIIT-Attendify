import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface SubjectCardProps {
  subjectName: string;
  startTime: string;
  endTime: string;
  date: string;
  location:string;
  teacherName: string;
  presentCount: number;
  totalCount: number;
}

export default function SubjectCard({
  subjectName,
  startTime,
  endTime,
  date,
  location,
  teacherName,
  presentCount,
  totalCount,
}: SubjectCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.subjectName}>{subjectName}</Text>
      <Text style={styles.info}>Time: {startTime} - {endTime}</Text>
      <Text style={styles.info}>Date: {date}</Text>
      <Text style={styles.info}>Location: {location}</Text>
      <Text style={styles.info}>Teacher: {teacherName}</Text>
      <Text style={styles.attendance}>
        Attendance: {presentCount}/{totalCount}
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Mark Attendance</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subjectName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  attendance: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

