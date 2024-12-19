import React, { useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import useUserDetails from '@/hooks/useUserDetails';
import { DarkTheme, DefaultTheme, useTheme } from '@react-navigation/native';

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
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();

  // Avoid unnecessary re-renders by using useCallback
  const onRefresh = useCallback(async () => {
    if (!refreshing) {
      setRefreshing(true);
      await refetch();
      setRefreshing(false);
    }
  }, [refreshing, refetch]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !currentUser) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <Text style={{ color: colors.primary, fontSize: 18 }}>Failed to load user details</Text>
      </View>
    );
  }

  const allCards = [
    { title: "Location", icon: "map-pin", path: "/setlocation" },
    { title: "Add Lecture", icon: "plus-circle", path: "/postlecture" },
    { title: "Access Code", icon: "key", path: "/setaccesscode" },
    { title: "Attendance", icon: "user-check", path: "/attendance" },
    { title: "Download", icon: "download", path: "/downloadattendance" },
    { title: "Users", icon: "users", path: "/users" },
    // { title: "Schedule", icon: "calendar", path: "/" },
    { title: "Support", icon: "shield", path: "/support" },
    { title: "Support Requests", icon: "bell", path: "/supportRequests" },
    // { title: "Settings", icon: "settings", path: "/settings" },
    { title: "FAQ", icon: "question-circle", path: "/faq" },
    // { title: "Notifications", icon: "bell", path: "/notifications" },
  ];

  // Filter cards based on user role
  const filteredCards = (() => {
    switch (currentUser.role) {
      case "student":
        return allCards.filter((card) => ["Attendance", "Users", "Support", "FAQ"].includes(card.title));
      case "classRepresentative":
        return allCards.filter((card) =>
          ["Attendance", "Users", "Download", "Support", "FAQ"].includes(card.title)
        );
      case "faculty":
        return allCards.filter((card) =>
          ["Add Lecture", "Users", "Support", "FAQ", "Download"].includes(card.title)
        );
      case "admin":
        return allCards.filter((card) =>
          ["Location", "Access Code", "Users", "Download", "FAQ", "Support Requests"].includes(card.title)
        );
      default:
        return []; // No cards for unknown roles
    }
  })();

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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Profile Section */}
        <View style={{ backgroundColor: colors.card, padding: 16, paddingTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Image
              source={imageUrl || require('@/assets/images/default.jpg')}
              style={{ width: 80, height: 80, borderRadius: 40, borderColor: colors.primary, borderWidth: 3 }}
            />
            <View style={{ marginLeft: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
                {currentUser.firstName} {currentUser.lastName}
              </Text>
              <Text style={{ fontSize: 16, color: colors.text }}>{currentUser.email}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: colors.text }}>
            Hi, {currentUser.firstName}
          </Text>
          <Text style={{ fontSize: 16, color: colors.text }}>Welcome to your class</Text>
        </View>

        {/* Dashboard Section */}
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>My Dashboard</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
            {filteredCards.map((card, index) => (
              <Card
                key={index}
                title={card.title}
                icon={card.icon}
                onPress={() => router.push({ pathname: card.path })}
                textColor={colors.primary}
                backgroundColor={colors.card}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
