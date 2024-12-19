import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useCallback } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const hideSplash = async () => {
      if (loaded) {
        console.log('Fonts loaded. Hiding splash screen.');
        await SplashScreen.hideAsync();
      }
    };
    hideSplash();
  }, [loaded]);

  if (!loaded) {
    console.log('Fonts are still loading...');
    return null; // Render nothing while fonts are loading
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Universal StatusBar */}
      <StatusBar
        style={colorScheme === 'dark' ? 'light' : 'dark'}
        backgroundColor={colorScheme === 'dark' ? '#121212' : '#FFFFFF'}
        translucent={false}
      />

      {/* Navigation Stack */}
      <Stack initialRouteName="index" screenOptions={{ headerShown: true }}>
        {/* Replace "index" with a non-conflicting name like "home" */}
        <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ title: 'Main', headerShown: false }} />
        <Stack.Screen name="(card)/users" options={{ title: 'Users', headerShown: true }} />
        <Stack.Screen name="(card)/attendance" options={{ title: 'Attendance', headerShown: true }} />
        <Stack.Screen name="(card)/support" options={{ title: 'Support', headerShown: true }} />
        <Stack.Screen name="(teacher)/postlecture" options={{ title: 'Post Lecture', headerShown: true }} />
        <Stack.Screen name="(card)/subjectattendance" options={{ title: 'Lecture', headerShown: true }} />
        <Stack.Screen name="(teacher)/downloadattendance" options={{ title: 'Download Attendance', headerShown: true }} />
        <Stack.Screen name="(admin)/setlocation" options={{ title: 'Class Location', headerShown: true }} />
        <Stack.Screen name="(card)/faq" options={{ title: 'FAQ', headerShown: true }} />
        <Stack.Screen name="(admin)/setaccesscode" options={{ title: 'Access Code', headerShown: true }} />
        <Stack.Screen name="(admin)/supportRequests" options={{ title: 'Support Requests', headerShown: true }} />
        <Stack.Screen name="signup" options={{ title: 'Sign Up', headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
