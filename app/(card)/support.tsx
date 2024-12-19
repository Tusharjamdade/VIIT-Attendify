import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../src/firebase';
import useUserDetails from '@/hooks/useUserDetails';
import { DarkTheme, DefaultTheme, useTheme } from '@react-navigation/native';

const SupportPage = () => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currentUser } = useUserDetails();
  const { colors } = useTheme(); // Get colors from theme

  // Update user details from currentUser
  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName + " " + currentUser.lastName || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  // Submit support request to Firestore
  const handleSubmit = async () => {
    if (!subject.trim() || !description.trim()) {
      Alert.alert('Error', 'Subject and Description cannot be empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Firestore collection reference
      const supportRequestsRef = collection(firestore, 'supportRequests');

      // Data to store
      const supportData = {
        firstName,
        lastName: currentUser.lastName,
        image: currentUser.image,
        uid: currentUser.uid,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.innerContainer, { backgroundColor: colors.background }]}>
      <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 16 }}>
  <Text style={[styles.infoText, { fontWeight: 'bold', fontSize: 18, color: colors.text }]}>
    Your feedback matters!!
  </Text>
</View>

<View style={[styles.infoSection, { backgroundColor: colors.card }]}>
  <Text style={[styles.infoText, { color: colors.text }]}>
    Your feedback and reports help us improve our app. Please let us know how we can assist you!
  </Text>
</View>


        <View style={[styles.form, { backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.input, styles.disabledInput, { backgroundColor: colors.border, color: colors.text }]}
            value={firstName}
            editable={false}
            placeholder="Name"
            placeholderTextColor={colors.text}
          />
          <TextInput
            style={[styles.input, styles.disabledInput, { backgroundColor: colors.border, color: colors.text }]}
            value={email}
            editable={false}
            placeholder="Email"
            placeholderTextColor={colors.text}
          />
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            value={subject}
            onChangeText={setSubject}
            placeholder="Subject"
            placeholderTextColor={colors.text}
          />
          <TextInput
            style={[styles.input, styles.textArea, { color: colors.text, borderColor: colors.border }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            placeholderTextColor={colors.text}
            multiline
            numberOfLines={10}
          />
          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.disabledButton, { backgroundColor: colors.primary, borderRadius: 14 }]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={[styles.buttonText, { color: colors.card }]}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
    padding: 16,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 600, // Limiting the width for better appearance on large screens
    padding: 16,
  },
  infoSection: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
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
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: '#EDF2F7',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SupportPage;
