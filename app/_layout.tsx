
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
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
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack  screenOptions={{
        headerShown:true
      }}>
        <StatusBar style="light" />
        <Stack.Screen name="(tabs)" options={{title:"Main", headerShown: false }} />
        <Stack.Screen name="(card)/users" options={{title:"Users", headerShown: true }} />
        <Stack.Screen name="(card)/attendance" options={{title:"Attendance", headerShown: true }} />
        <Stack.Screen name="(card)/support" options={{title:"Supporta", headerShown: true }} />
        <Stack.Screen name="(teacher)/postlecture" options={{title:"Post Lecture", headerShown: true }} />
        <Stack.Screen name="(card)/subjectattendance" options={{title:"Lecture", headerShown: true }} />
        <Stack.Screen name="(teacher)/downloadattendance" options={{title:"Download Attendance", headerShown: true }} />
        <Stack.Screen name="(admin)/setlocation" options={{title:"Class Location", headerShown: true }} />
        <Stack.Screen name="(admin)/faq" options={{title:"FAQ", headerShown: true }} />
        <Stack.Screen name="(admin)/setaccesscode" options={{title:"Access Code", headerShown: true }} />
        <Stack.Screen name="(admin)/supportRequests" options={{title:"Support Requests", headerShown: true }} />
        <Stack.Screen name="(auth)" options={{title:"Signin", headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      </ThemeProvider>
  );
}
