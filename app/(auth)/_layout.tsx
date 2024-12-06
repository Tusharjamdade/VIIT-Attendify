import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Signup from './signup';
import Signin from './signin';
const Stack = createStackNavigator();

export default function App() {
  return (
    // <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="signin" component={Signin} />
      </Stack.Navigator>
    // </NavigationContainer>
  );
}
