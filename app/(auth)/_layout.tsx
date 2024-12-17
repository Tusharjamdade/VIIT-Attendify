import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';// Don't forget to wrap with NavigationContainer
import Signup from './signup';
import Signin from './signin';


const Stack = createStackNavigator();

function App() {
  return (
    // <NavigationContainer> {/* Wrap with NavigationContainer */}
    // <ThemeProvider>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}  
      >
        <Stack.Screen name="Signin" component={Signin} />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
      // </ThemeProvider>
    // </NavigationContainer>
  );
}

export default App;
