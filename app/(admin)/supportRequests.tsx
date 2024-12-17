import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, useColorScheme } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/src/firebase'; // Adjust this import based on your project structure

// Default photo for users without a photo URL
const defaultPhoto = require('@/assets/images/default.jpg');

interface SupportRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  description: string;
  image?: string; // Optional property for the photo URL
}

interface SupportRequestCardProps {
  supportRequest: SupportRequest;
  isDarkMode: boolean;
}

const SupportRequestCard: React.FC<SupportRequestCardProps> = ({ supportRequest, isDarkMode }) => {
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

  const requestImage = supportRequest.image && imageMap[supportRequest.image] ? imageMap[supportRequest.image] : defaultPhoto;

  return (
    <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
      <Image source={requestImage} style={styles.photo} />
      <View style={styles.info}>
        <Text style={[styles.name, isDarkMode ? styles.textDark : styles.textLight]}>
          {supportRequest.firstName} {supportRequest.lastName}
        </Text>
        <Text style={[styles.email, isDarkMode ? styles.textDark : styles.textLight]}>
          {supportRequest.email}
        </Text>
        <Text style={[styles.subject, isDarkMode ? styles.textDark : styles.textLight]}>
          Subject: {supportRequest.subject}
        </Text>
        <Text style={[styles.description, isDarkMode ? styles.textDark : styles.textLight]}>
          Description: {supportRequest.description}
        </Text>
      </View>
    </View>
  );
};

const SupportRequestsPage: React.FC = () => {
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const fetchSupportRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'supportRequests'));
        const fetchedRequests: SupportRequest[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          firstName: doc.data().firstName || 'Unknown',
          lastName: doc.data().lastName || 'Unknown',
          email: doc.data().email || 'No Email',
          subject: doc.data().subject || 'No Subject',
          description: doc.data().description || 'No Description',
          image: doc.data().image || '', // Empty string if no photo provided
        }));
        setSupportRequests(fetchedRequests);
      } catch (error) {
        console.error('Error fetching support requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupportRequests();
  }, []);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, isDarkMode ? styles.containerDark : styles.containerLight]}>
        <Text style={isDarkMode ? styles.textDark : styles.textLight}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]}>
      <Text style={[styles.headerText, isDarkMode ? styles.textDark : styles.textLight]}>Support Requests</Text>
      <Text style={[styles.subText, isDarkMode ? styles.textDark : styles.textLight]}>
        Here's a list of all the support requests from users.
      </Text>

      <FlatList
        data={supportRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SupportRequestCard supportRequest={item} isDarkMode={isDarkMode} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: '#f9f9f9',
  },
  containerDark: {
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  listContent: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardLight: {
    backgroundColor: '#ffffff',
    borderColor: '#ddd',
  },
  cardDark: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333',
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    marginBottom: 4,
  },
  subject: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginTop: 4,
  },
  textLight: {
    color: '#333',
  },
  textDark: {
    color: '#f9f9f9',
  },
});

export default SupportRequestsPage;
