import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import Teacher_requestleave from './Teacher_requestleave';
import TeacherLeavelist from './Teacher_leaveslist';
import { url } from '../../Component/Config';

const Tab = createBottomTabNavigator();

const Teacher_Leave = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Leave') {
            iconName = 'event-note';  // Choose an appropriate icon for 'Leave'
          } else if (route.name === 'Request') {
            iconName = 'request-page';  // Choose an appropriate icon for 'Request'
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#567BC2',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { display: 'flex' },
      })}
    >
      <Tab.Screen name="Leave" component={TeacherLeavelist} />
      <Tab.Screen name="Request" component={Teacher_requestleave} />
    </Tab.Navigator>
  );
};

export default Teacher_Leave;
