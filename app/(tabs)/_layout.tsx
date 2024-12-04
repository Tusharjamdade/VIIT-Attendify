
import { View, Text, Image } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';

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
  return (
    <>
    
      <Tabs>
        <Tabs.Screen
          name="home"
          options={{
            title: '',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon="home" // FontAwesome icon name for "fa-house"
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
             icon='user' 
             color={color}
             name='Profile'
             focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default HomePagelayout;
