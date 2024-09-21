import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './pages/Login';
import ForgetPassword from './pages/Commons/Forgetpassword';
import ConformPassword from './pages/Commons/ConformPassword';
import AdminRoute from './pages/AdminRoute';
import StudentRoute from './pages/StudentRoute';
import TeacherRoute from './pages/TeacherRoute';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar translucent={false} />
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="login" component={Login} />
        <Stack.Screen options={{ headerShown: false }} name="ForgotPassword" component={ForgetPassword} />
        <Stack.Screen options={{ headerShown: false }} name="ConfirmPassword" component={ConformPassword} />
        <Stack.Screen options={{ headerShown: false }} name="AdminStack" component={AdminRoute} />
        <Stack.Screen options={{ headerShown: false }} name="StudentStack" component={StudentRoute} />
        <Stack.Screen options={{ headerShown: false }} name="TeacherStack" component={TeacherRoute} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;