import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity style={styles.faqHeader} onPress={() => setIsOpen(!isOpen)}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <Feather name={isOpen ? "chevron-up" : "chevron-down"} size={24} color="#555" />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.faqAnswerContainer}>
          <Text style={styles.faqAnswer}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "What is Attendify?",
      answer: "Attendify is an advanced online attendance system that uses fingerprint and face detection technology to accurately record and manage attendance for various organizations."
    },
    {
      question: "How does the fingerprint detection work?",
      answer: "Attendify uses high-resolution fingerprint scanners to capture unique fingerprint patterns. These patterns are then encrypted and stored securely in our database for future verification."
    },
    {
      question: "Is face detection mandatory?",
      answer: "While we recommend using both fingerprint and face detection for maximum accuracy, you can configure Attendify to use either method or both, depending on your organization's needs."
    },
    {
      question: "How secure is my biometric data?",
      answer: "We take data security very seriously. All biometric data is encrypted using industry-standard encryption protocols and stored in secure, isolated databases. We comply with all relevant data protection regulations."
    },
    {
      question: "Can Attendify integrate with other systems?",
      answer: "Yes, Attendify offers API integrations with various HR management systems, payroll software, and other third-party applications. Contact our support team for more information on specific integrations."
    },
    {
      question: "What if someone forgets their fingerprint or face detection fails?",
      answer: "Attendify includes backup methods for attendance marking, such as PIN codes or manual entry by authorized personnel. This ensures that attendance can always be recorded accurately."
    },
    {
      question: "How accurate is the face detection system?",
      answer: "Our face detection system uses advanced AI algorithms and is highly accurate. It can recognize individuals even with changes in appearance like glasses, facial hair, or different hairstyles."
    },
    {
      question: "Can Attendify be used for remote workers?",
      answer: "Yes, Attendify supports remote attendance tracking. Remote workers can use the face detection feature through their device's camera, ensuring accurate attendance even for distributed teams."
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Attendify FAQ</Text>
          <Text style={styles.headerSubtitle}>Frequently Asked Questions about our fingerprint and face detection attendance system</Text>
        </View>

        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollView: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '600',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  faqItem: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
    elevation: 1, // Shadow for Android
    shadowColor: '#000', // iOS Shadow
    shadowOpacity: 0.1, 
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f1f1f1',
  },
  faqQuestion: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  faqAnswerContainer: {
    padding: 16,
    backgroundColor: '#fafafa',
  },
  faqAnswer: {
    fontSize: 16,
    color: '#333',
  },
});

export default FAQ;
