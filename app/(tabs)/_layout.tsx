import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

// Type for TabbarProps
type TabbarProps = {
  icon: string; // The name of the FontAwesome icon
  color: string;
  name: string;
  focused: boolean;
};

const TabIcon = ({ icon, color, name, focused }: TabbarProps) => {
  return (
    <View style={{ alignItems: 'center' }}>
      <Icon name={icon} size={24} color={focused ? color : 'gray'} />
      <Text style={{ color: focused ? color : 'gray', fontSize: 12 }}>{name}</Text>
    </View>
  );
};

const HomePagelayout = () => {
  const isDarkMode = useColorScheme() === 'dark'; // Check the color scheme and pass to ThemeProvider

  return (
    <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}> {/* ThemeProvider will handle dynamic theme */}
      <Tabs>
        <Tabs.Screen
          name="subject"
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="book"
                color={color}
                name="Subs"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="home"
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="home"
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="user"
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
};

export default HomePagelayout;
