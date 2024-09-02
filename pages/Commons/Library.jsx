// LibraryPage.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AvailableBooksScreen from './AvailableBooks';
import MyBooksScreen from './MyBooks';
import { MaterialIcons } from '@expo/vector-icons';
import { url } from '../../Component/Config';

const Tab = createBottomTabNavigator();

const Library = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Available Books') {
            iconName = 'menu-book';
          } else if (route.name === 'My Books') {
            iconName = 'library-books';
          }

          // You can return any component that you like here!
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#567BC2',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { display: 'flex' },
      })}
    >
      <Tab.Screen name="Available Books" component={AvailableBooksScreen} />
      <Tab.Screen name="My Books" component={MyBooksScreen} />
    </Tab.Navigator>
  );
};

export default Library;
