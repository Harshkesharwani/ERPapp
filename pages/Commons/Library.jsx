// LibraryPage.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AvailableBooksScreen from './AvailableBooks';
import MyBooksScreen from './MyBooks';
import { MaterialIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Tab = createBottomTabNavigator();

const Library = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Available Books') {
            iconName = 'menu-book';
          } else if (route.name === 'My Books') {
            iconName = 'library-books';
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#567BC2',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { display: 'flex', marginBottom: '12.3%' },
      })}
    >
      <Tab.Screen name="Available Books" component={AvailableBooksScreen} />
      <Tab.Screen name="My Books" component={MyBooksScreen} />
    </Tab.Navigator>
  );
};

export default Library;
