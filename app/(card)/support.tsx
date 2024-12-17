import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
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
      setFirstName(currentUser.firstName +" "+currentUser.lastName || '');
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
        lastName,
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
        />
        <TextInput
          style={[styles.input, styles.disabledInput, { backgroundColor: colors.border, color: colors.text }]}
          value={email}
          editable={false}
          placeholder="Email"
        />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={subject}
          onChangeText={setSubject}
          placeholder="Subject"
          placeholderTextColor={colors.placeholder}
        />
        <TextInput
          style={[styles.input, styles.textArea, { color: colors.text }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          placeholderTextColor={colors.placeholder}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.disabledButton, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderColor: '#E2E8F0',
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
    backgroundColor: '#A0AEC0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SupportPage;
