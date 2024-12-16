import React from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions, RefreshControl, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons'; // Adjust the path as needed
import useUserDetails from '@/hooks/useUserDetails';

const { width } = Dimensions.get('window');
const cardWidth = (width - 75) / 2;

const Card = ({ title, icon, onPress, textColor, backgroundColor }) => (
  <TouchableOpacity
    style={{
      backgroundColor,
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      width: cardWidth,
      height: cardWidth,
    }}
    onPress={onPress}
  >
    <Feather name={icon} size={36} color={textColor} />
    <Text style={{ color: textColor, fontWeight: 'bold', marginTop: 8, textAlign: 'center', fontSize: 16 }}>
      {title}
    </Text>
  </TouchableOpacity>
);

const Home = () => {
  const { currentUser, loading, error, refetch } = useUserDetails();
  const [refreshing, setRefreshing] = React.useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const themeColors = {
    background: isDarkMode ? 'black' : '#F7FAFC',
    cardBackground: isDarkMode ? '#2D3748' : '#E2E8F0',
    textPrimary: isDarkMode ? '#E2E8F0' : '#2D3748',
    textSecondary: isDarkMode ? '#A0AEC0' : '#4A5568',
    accent: '#3B82F6',
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.background }}>
        <ActivityIndicator size="large" color={themeColors.accent} />
      </View>
    );
  }

  if (error || !currentUser) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.background }}>
        <Text style={{ color: themeColors.accent, fontSize: 18 }}>Failed to load user details</Text>
      </View>
    );
  }

  const cards = [
    { title: "Attendance", icon: "user-check", path: "/attendance" },
    { title: "Schedule", icon: "calendar", path: "/" },
    { title: "Support", icon: "help-circle", path: "/support" },
    { title: "Add Lecture", icon: "plus-circle", path: "/postlecture" },
    { title: "Face Recog.", icon: "camera", path: "/facerec" },
    { title: "Download", icon: "download", path: "/downloadattendance" },
    { title: "Users", icon: "user", path: "/users" },
    { title: "Settings", icon: "settings", path: "/settings" },
    { title: "Logout", icon: "log-out", path: "/logout" },
    { title: "Help", icon: "help-circle", path: "/faq" },
    { title: "Notifications", icon: "bell", path: "/notifications" },
    { title: "Messages", icon: "message-square", path: "/messages" },
  ];

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
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={themeColors.accent}
          />
        }
      >
        {/* Profile Section */}
        <View style={{ backgroundColor: themeColors.cardBackground, padding: 16, paddingTop: 10, borderRadius: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Image
              source={imageUrl || require('@/assets/images/default.jpg')}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
            <View style={{ marginLeft: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: themeColors.textPrimary }}>
                {currentUser.firstName} {currentUser.lastName}
              </Text>
              <Text style={{ fontSize: 16, color: themeColors.textSecondary }}>{currentUser.email}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: themeColors.textPrimary, marginBottom: 8 }}>
            Hi, {currentUser.firstName}
          </Text>
          <Text style={{ fontSize: 16, color: themeColors.textSecondary }}>Welcome to your class</Text>
        </View>

        {/* Dashboard Section */}
        <View style={{ padding: 16, marginTop: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: themeColors.textPrimary, marginBottom: 16 }}>My Dashboard</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
            {cards.map((card, index) => (
              <Card
                key={index}
                title={card.title}
                icon={card.icon}
                onPress={() => router.push({ pathname: card.path })}
                textColor={themeColors.accent}
                backgroundColor={themeColors.cardBackground}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
