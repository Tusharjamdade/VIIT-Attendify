import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '@/components/SplashScreen';
import Home from './(tabs)/home';
import { Text, View } from 'react-native';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    // <NavigationContainer>
      // <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      //   {/* <Stack.Screen name="Splash" component={SplashScreen} /> */}
      //   <Stack.Screen name="Home" component={Home} />
      // </Stack.Navigator>
    // </NavigationContainer>
    <View>
      <Text>Test</Text>
    </View>
  );
};

export default App;

