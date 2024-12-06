// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity } from 'react-native';
// import firebase from '../(auth)/firebase'; // Update path as per your project structure

// const getCurrentUserDetails = () => {
//   // Replace this with real authentication data in production
//   return {
//     firstName: 'Sarah',
//     lastName: 'Johnson',
//     email: 'sarah.johnson@example.com',
//   };
// };

// const SupportPage = () => {
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [subject, setSubject] = useState('');
//   const [description, setDescription] = useState('');

//   useEffect(() => {
//     const userDetails = getCurrentUserDetails();
//     setFirstName(userDetails.firstName);
//     setLastName(userDetails.lastName);
//     setEmail(userDetails.email);
//   }, []);

//   const handleSubmit = async () => {
//     if (!subject.trim() || !description.trim()) {
//       Alert.alert('Error', 'Subject and Description cannot be empty.');
//       return;
//     }

//     try {
     

//       Alert.alert('Success', 'Your support request has been submitted successfully.');
//       setSubject('');
//       setDescription('');
//     } catch (error) {
//       console.error('Error submitting support request:', error);
//       Alert.alert('Error', 'Failed to submit your support request. Please try again later.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Informational Section */}
//       <View style={styles.infoSection}>
//         <Text style={styles.infoText}>
//           Your feedback and reports help us improve our app. Please let us know how we can assist you!
//         </Text>
//       </View>

//       {/* Form Section */}
//       <View style={styles.form}>
//         {/* First Name */}
//         <TextInput
//           style={[styles.input, styles.disabledInput]}
//           value={firstName}
//           editable={false}
//           placeholder="First Name"
//         />

//         {/* Last Name */}
//         <TextInput
//           style={[styles.input, styles.disabledInput]}
//           value={lastName}
//           editable={false}
//           placeholder="Last Name"
//         />

//         {/* Email */}
//         <TextInput
//           style={[styles.input, styles.disabledInput]}
//           value={email}
//           editable={false}
//           placeholder="Email"
//         />

//         {/* Subject */}
//         <TextInput
//           style={styles.input}
//           value={subject}
//           onChangeText={setSubject}
//           placeholder="Subject"
//           placeholderTextColor="#A0AEC0"
//         />

//         {/* Description */}
//         <TextInput
//           style={[styles.input, styles.textArea]}
//           value={description}
//           onChangeText={setDescription}
//           placeholder="Description"
//           placeholderTextColor="#A0AEC0"
//           multiline
//           numberOfLines={4}
//         />

//         {/* Submit Button */}
//         <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//           <Text style={styles.buttonText}>Submit</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: 'white',
//   },
//   infoSection: {
//     marginBottom: 16,
//     padding: 16,
//     backgroundColor: '#E3F2FD',
//     borderRadius: 8,
//   },
//   infoText: {
//     fontSize: 16,
//     color: '#2B6CB0',
//     textAlign: 'center',
//   },
//   form: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     borderRadius: 4,
//     padding: 12,
//     marginBottom: 16,
//     fontSize: 16,
//     color: '#2D3748',
//   },
//   disabledInput: {
//     backgroundColor: '#EDF2F7',
//     color: '#A0AEC0',
//   },
//   textArea: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   button: {
//     backgroundColor: '#3182CE',
//     padding: 12,
//     borderRadius: 4,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default SupportPage;


//Android
// tushar786123.VIITAttendify

// plugins {
//   // ...

//   // Add the dependency for the Google services Gradle plugin
//   id("com.google.gms.google-services") version "4.4.2" apply false

// }
//plugins {
//   id("com.android.application")

//   // Add the Google services Gradle plugin
//   id("com.google.gms.google-services")

//   ...
//   }

// dependencies {
//   // Import the Firebase BoM
//   implementation(platform("com.google.firebase:firebase-bom:33.6.0"))


//   // TODO: Add the dependencies for Firebase products you want to use
//   // When using the BoM, don't specify versions in Firebase dependencies
//   // https://firebase.google.com/docs/android/setup#available-libraries
// }

// IOS
// tushar786123.VIITAttendify
// https://github.com/firebase/firebase-ios-sdk
// import SwiftUI
// import FirebaseCore


// class AppDelegate: NSObject, UIApplicationDelegate {
//   func application(_ application: UIApplication,
//                    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
//     FirebaseApp.configure()

//     return true
//   }
// }

// @main
// struct YourApp: App {
//   // register app delegate for Firebase setup
//   @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate


//   var body: some Scene {
//     WindowGroup {
//       NavigationView {
//         ContentView()
//       }
//     }
//   }
// }
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../(auth)/firebase';

// Dummy function to get current user details
const getCurrentUserDetails = () => {
  return {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
  };
};

const SupportPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  // Load user details on component mount
  useEffect(() => {
    const userDetails = getCurrentUserDetails();
    setFirstName(userDetails.firstName);
    setLastName(userDetails.lastName);
    setEmail(userDetails.email);
  }, []);

  // Submit support request to Firestore
  const handleSubmit = async () => {
    if (!subject.trim() || !description.trim()) {
      Alert.alert('Error', 'Subject and Description cannot be empty.');
      return;
    }

    try {
      // Firestore collection reference
      const supportRequestsRef = collection(firestore, 'supportRequests');

      // Data to store
      const supportData = {
        id:1,
        firstName,
        lastName,
        email,
        subject,
        description,
        createdAt: new Date().toISOString(),
      };

      // Add document to Firestore
      await addDoc(supportRequestsRef, supportData);

      // Success feedback
      Alert.alert('Success', 'Your support request has been submitted successfully.');
      setSubject('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting support request:', error);
      Alert.alert('Error', 'Failed to submit your support request. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoSection}>
        <Text style={styles.infoText}>
          Your feedback and reports help us improve our app. Please let us know how we can assist you!
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={firstName}
          editable={false}
          placeholder="First Name"
        />
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={lastName}
          editable={false}
          placeholder="Last Name"
        />
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={email}
          editable={false}
          placeholder="Email"
        />
        <TextInput
          style={styles.input}
          value={subject}
          onChangeText={setSubject}
          placeholder="Subject"
          placeholderTextColor="#A0AEC0"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          placeholderTextColor="#A0AEC0"
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  infoSection: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#2B6CB0',
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#2D3748',
  },
  disabledInput: {
    backgroundColor: '#EDF2F7',
    color: '#A0AEC0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#3182CE',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SupportPage;
