import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { firestore } from '../../src/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import ExcelJS from 'exceljs';
import * as Print from 'expo-print';
import useUserDetails from '@/hooks/useUserDetails';
import StudentList from '@/components/StudentList';
import StudentProfile from '@/components/StudentProfile';

const DownloadAttendance = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lectures, setLectures] = useState([]);
  const { currentUser, refetch } = useUserDetails();

  useEffect(() => {
    if (currentUser) {
      fetchLectures();
    }
  }, [currentUser]);

  const fetchLectures = async () => {
    try {
      setLoading(true);
      const lecturesQuery = query(
        collection(firestore, 'lectures'),
        where('userId', '==', currentUser.uid)
      );
      const lectureSnapshot = await getDocs(lecturesQuery);
      const lecturesData = lectureSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLectures(lecturesData);
    } catch (error) {
      console.error('Error fetching lectures:', error);
      Alert.alert('Error', 'Failed to fetch lectures. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const fetchAttendanceData = async (lectureId) => {
    try {
      const attendanceQuery = query(
        collection(firestore, 'attendance'),
        where('lectureId', '==', lectureId)
      );
      const attendanceSnapshot = await getDocs(attendanceQuery);
  
      if (attendanceSnapshot.empty) {
        Alert.alert('Error', 'No attendance data found for this lecture.');
        return [];
      }
  
      const attendanceData = attendanceSnapshot.docs.map((doc) => doc.data())[0];
  
      // Sort the students by rollNo in ascending order
      const sortedStudents = (attendanceData.students || []).sort((a, b) => a.rollNo - b.rollNo);
  
      return sortedStudents;
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      Alert.alert('Error', 'Failed to fetch attendance data.');
      return [];
    }
  };
  

  const generateExcel = async (lectureId, subjectName, lecture) => {
    try {
      // Fetch the attendance data
      const attendanceData = await fetchAttendanceData(lectureId);
  
      // Create a new workbook and add a worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(subjectName);
  
      // Define the columns for the worksheet
      worksheet.columns = [
        { header: 'Roll Number', key: 'rollNo', width: 15 },
        { header: 'StudentName', key: 'StudentName', width: 20 },
        { header: 'Status', key: 'status', width: 15 },
      ];
  
      // Add rows for each student in the attendance data
      attendanceData.forEach((student) => {
        worksheet.addRow({
          rollNo: student.rollNo,
          StudentName: student.firstName +" "+ student.lastName,
          status: student.present ? 'Present' : 'Absent',
        });
      });
  
      // Create the file path to save the Excel file
      const fileUri = `${FileSystem.documentDirectory}${subjectName}_Attendance.xlsx`;
  
      // Write the Excel file to the specified location
      const buffer = await workbook.xlsx.writeBuffer();
      await FileSystem.writeAsStringAsync(fileUri, buffer.toString('base64'), {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      // Share the file if sharing is available on the device
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Error', 'Sharing is not available on this device.');
      }
    } catch (error) {
      console.error('Error generating Excel:', error);
      Alert.alert('Error', 'Failed to generate Excel file.');
    }
  };
  

  const generatePDF = async (lectureId, subjectName,lecture) => {
    try {
      const attendanceData = await fetchAttendanceData(lectureId);
      const tableRows = attendanceData
      .map(
        (student) =>
          `<tr>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${student.rollNo}</td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${student.firstName} ${student.lastName}</td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${student.present ? 'Present' : 'Absent'}</td>
          </tr>`
      )
      .join('');
    
    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f9;
              color: #333;
              margin: 0;
              padding: 20px;
            }
            h1 {
              text-align: center;
              color: #003366;
              font-size: 28px;
              margin-bottom: 20px;
            }
            h2 {
              text-align: center;
              color: #003366;
              font-size: 18px;
              margin: 10px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              padding: 12px;
              text-align: center;
              border: 1px solid #ddd;
            }
            th {
              background-color: #003366;
              color: white;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f2f2f2;
            }
            tr:hover {
              background-color: #ddd;
            }
          </style>
        </head>
        <body>
          <h1>Subject: ${subjectName}</h1>
          <h2>Date: ${lecture.lectureDate} Time: ${lecture.startTime} - ${lecture.endTime} </h2>
          <h2>Teacher Name: ${lecture.teacherName} Location: ${lecture.location}</h2>
          <table>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Status</th>
            </tr>
            ${tableRows}
          </table>
        </body>
      </html>
    `;
    
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Error', 'Sharing is not available on this device.');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF file.');
    }
  };

  const handleDownload = (format, lectureId, subjectName,lecture) => {
    if (format === 'PDF') {
      generatePDF(lectureId, subjectName,lecture);
    } else if (format === 'Excel') {
      generateExcel(lectureId, subjectName,lecture);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLectures();
    setRefreshing(false);
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
        <Text style={{ fontSize: 18, color: 'red' }}>User not logged in or details missing</Text>
      </View>
    );
  }
  const imageMap = {
    boy1: require('@/assets/images/boy1.jpg'),
    boy2: require('@/assets/images/boy2.jpg'),
    boy3: require('@/assets/images/boy3.jpg'),
    boy4: require('@/assets/images/boy4.png'),
    boy5: require('@/assets/images/boy5.jpg'),
    girl1: require('@/assets/images/girl1.jpg'),
    girl2: require('@/assets/images/girl2.jpg'),
    girl3: require('@/assets/images/girl3.jpg'),
    girl4: require('@/assets/images/girl4.jpg'),
    girl5: require('@/assets/images/girl5.jpg'),
  };

  const imageUrl = currentUser?.image ? imageMap[currentUser.image] : null;

  return (
    <ScrollView
  style={{ flex: 1, backgroundColor: '#f0f8ff' }}
  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
>
  {/* <StudentList/> */}
 {/* Profile Section */}
         <View style={{ backgroundColor: '#fff', padding: 16, paddingTop: 10 }}>
           <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
             <Image
               source={imageUrl || require('@/assets/images/default.jpg')}
               style={{ width: 80, height: 80, borderRadius: 40 }}
             />
             <View style={{ marginLeft: 16 }}>
               <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                 {currentUser.firstName} {currentUser.lastName}
               </Text>
               <Text style={{ fontSize: 16, color: '#666' }}>{currentUser.email}</Text>
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
          flexDirection: 'row', // Align content horizontally
          alignItems: 'center', // Center the content vertically
        }}
      >
        {/* Circle with Subject's First Letter */}
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#4CAF50', // Green background
            marginRight: 16, // Space between the circle and the text
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
            {lecture.subject[0].toUpperCase()}
          </Text>
        </View>

        {/* Lecture Details */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#003366' }}>
            {lecture.subject}
          </Text>
          <Text style={{ fontSize: 14, color: '#666' }}>
            Date: {lecture.lectureDate} | {lecture.startTime} - {lecture.endTime}
          </Text>
          <Text style={{ fontSize: 14, color: '#666' }}>
            Location: {lecture.location}
          </Text>
          <Text style={{ fontSize: 14, color: '#666' }}>
            Teacher: {lecture.teacherName}
          </Text>

          {/* Action buttons */}
          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <TouchableOpacity
              onPress={() => handleDownload('PDF', lecture.id, lecture.subject, lecture)}
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
              onPress={() => handleDownload('Excel', lecture.id, lecture.subject)}
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
      </View>
    ))}
  </View>
</ScrollView>

  );
};

export default DownloadAttendance;
