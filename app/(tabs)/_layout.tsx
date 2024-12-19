import React from 'react';
import { View, Text, BackHandler } from 'react-native';
import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider, useTheme } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useColorScheme } from 'react-native';

// Type for TabbarProps
type TabbarProps = {
  icon: string; // The name of the FontAwesome icon
  color: string;
  name: string;
  focused: boolean;
};

const TabIcon = ({ icon, color, name, focused }: TabbarProps) => (
  <View style={{ alignItems: 'center' }}>
    <Icon name={icon} size={24} color={focused ? color : 'gray'} />
    <Text style={{ color: focused ? color : 'gray', fontSize: 12 }}>{name}</Text>
  </View>
);

const PreventBackNavigation = () => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true; // Prevent back navigation
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );
  return null;
};

const HeaderTitle = ({ icon, title }: { icon: string; title: string }) => {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <MaterialIcons name={icon} size={24} color={colors.text} />
      <Text style={{ marginLeft: 8, fontSize: 18, fontWeight: 'bold', color: colors.text }}>
        {title}
      </Text>
    </View>
  );
};

const HomePagelayout = () => {
  const colorScheme = useColorScheme();
  const { colors } = useTheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tabs
        screenOptions={{
          tabBarStyle: { backgroundColor: colors.card },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text,
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
        }}
      >
        <PreventBackNavigation />
        <Tabs.Screen
          name="subject"
          options={{
            title: '',
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon="book" color={color} name="Subs" focused={focused} />
            ),
            headerTitle: () => <HeaderTitle icon="menu-book" title="Lectures" />,
          }}
        />
        <Tabs.Screen
          name="home"
          options={{
            title: '',
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon="home" color={color} name="Home" focused={focused} />
            ),
            headerTitle: () => <HeaderTitle icon="home" title="Home" />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: '',
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon="user" color={color} name="Profile" focused={focused} />
            ),
            headerTitle: () => <HeaderTitle icon="how-to-reg" title="Profile" />,
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
};

export default HomePagelayout;
