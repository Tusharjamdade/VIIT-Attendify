import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, TouchableOpacity } from 'react-native';

// Mock function to get current logged-in user details
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

  useEffect(() => {
    const userDetails = getCurrentUserDetails();
    setFirstName(userDetails.firstName);
    setLastName(userDetails.lastName);
    setEmail(userDetails.email);
  }, []);

  const handleSubmit = () => {
    console.log('Support Request Details:');
    console.log(`First Name: ${firstName}`);
    console.log(`Last Name: ${lastName}`);
    console.log(`Email: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Description: ${description}`);

    Alert.alert('Support Request Sent', 'Your support request has been submitted successfully.');
    setSubject('');
    setDescription('');
  };

  return (
    <View style={styles.container}>
      {/* Informational Section */}
      <View className=" items-center bg-white mb-4">
      <Text className="text-2xl font-bold">Feedback / Support</Text>
    </View>
      <View style={styles.infoSection}>
        <Text style={styles.infoText}>
          Your feedback and reports help us improve our app. Please let us know how we can assist you!
        </Text>
      </View>

      {/* Form Section */}
      <View style={styles.form}>
        {/* First Name */}
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={firstName}
          editable={false}
          placeholder="First Name"
        />

        {/* Last Name */}
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={lastName}
          editable={false}
          placeholder="Last Name"
        />

        {/* Email */}
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={email}
          editable={false}
          placeholder="Email"
        />

        {/* Subject */}
        <TextInput
          style={styles.input}
          value={subject}
          onChangeText={setSubject}
          placeholder="Subject"
          placeholderTextColor="#A0AEC0"
        />

        {/* Description */}
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Description"
          placeholderTextColor="#A0AEC0"
          multiline
          numberOfLines={4}
        />

        {/* Submit Button */}
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
