import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// pages
import Main from '../Component/MainNavbar';
import Footer from '../Component/Footer';

// commons
import Holiday from '../pages/Commons/Holiday';
import Leave from './Teachers/Teaacher_leave';
import BusDetails from '../pages/Commons/BusDetail';
import HostelApplication from '../pages/Commons/Hostel';
import ChatList from '../pages/Commons/ChatList';
import ChatDetail from '../pages/Commons/Chat';
import NotificationPage from '../pages/Commons/Notification';
import ChangePassword from '../pages/Commons/ChangePassword';
import HelpAndSupport from '../pages/Commons/Help_Support';
import BusList from '../pages/Commons/BusList';
import Events from '../pages/Commons/Events';
import Library from '../pages/Commons/Library';
import Menu from '../pages/Commons/Menu';

import Teacher_Dashboard from '../pages/Teachers/Teacher_Dashbroad';
import Teacher_enquiry from '../pages/Teachers/Teacher_enquiry';
import Teacher_timetable from '../pages/Teachers/Teacher_Timetable';
import Teacher_leave from '../pages/Teachers/Teaacher_leave';
import ExamPage from '../pages/Teachers/Teacher_Setpaper';
import AddHomework from '../pages/Teachers/Teacher_homework';
import Teacher_Examination from '../pages/Teachers/Teacher_Examination';
import Teacher_Attendence from '../pages/Teachers/Teacher_stuAttendence';
import TeacherStudentPage from '../pages/Teachers/TeacherStudent';

const Teacher = createNativeStackNavigator();

const TeacherRoute = () => {
  return (
    <>
      <StatusBar translucent={false} />
      <Main />

      <Teacher.Navigator>
        {/* Teacher Section */}
        <Teacher.Screen options={{ headerShown: false }} name="Teacher_dashboard" component={Teacher_Dashboard} />
        <Teacher.Screen options={{ headerShown: false }} name="Teacher_enquiry" component={Teacher_enquiry} />
        <Teacher.Screen options={{ headerShown: false }} name="Teacher_timetable" component={Teacher_timetable} />
        <Teacher.Screen options={{ headerShown: false }} name="Teacher_leave" component={Teacher_leave} />
        <Teacher.Screen options={{ headerShown: false }} name="Teacher_Certificate" component={Teacher_leave} />
        <Teacher.Screen options={{ headerShown: false }} name="Teacher_Result" component={Teacher_leave} />
        <Teacher.Screen options={{ headerShown: false }} name="Teacher_Setpaper" component={ExamPage} />
        <Teacher.Screen options={{ headerShown: false }} name="Teacher_Homework" component={AddHomework} />
        <Teacher.Screen options={{ headerShown: false }} name="Teacher_Examination" component={Teacher_Examination} />
        <Teacher.Screen options={{ headerShown: false }} name="Teacher_Attendence" component={Teacher_Attendence} />
        <Teacher.Screen options={{ headerShown: false }} name="Teacher_Student" component={TeacherStudentPage} />
        <Teacher.Screen options={{ headerShown: false }} name="Holiday" component={Holiday} />
        <Teacher.Screen options={{ headerShown: false }} name="leave" component={Leave} />
        <Teacher.Screen options={{ headerShown: false }} name="events" component={Events} />
        <Teacher.Screen options={{ headerShown: false }} name="library" component={Library} />
        <Teacher.Screen options={{ headerShown: false }} name="BusList" component={BusList} />
        <Teacher.Screen options={{ headerShown: false }} name="BusDetails" component={BusDetails} />
        <Teacher.Screen options={{ headerShown: false }} name="Hostel" component={HostelApplication} />

        <Teacher.Screen options={{ headerShown: false }} name="Menu" component={Menu} />
        <Teacher.Screen options={{ headerShown: false }} name="ChangePassword" component={ChangePassword} />
        <Teacher.Screen options={{ headerShown: false }} name="HelpandSupport" component={HelpAndSupport} />
        <Teacher.Screen options={{ headerShown: false }} name="Notification" component={NotificationPage} />
        <Teacher.Screen options={{ headerShown: false }} name="ChatList" component={ChatList} />
        <Teacher.Screen options={{ headerShown: false }} name="ChatDetail" component={ChatDetail} />
      </Teacher.Navigator>
      <Footer />
    </>
  );
};

export default TeacherRoute;