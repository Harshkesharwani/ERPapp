import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// pages
import Main from '../Component/MainNavbar';
import Footer from '../Component/Footer';

// commons
import Holiday from '../pages/Commons/Holiday';
import BusDetails from '../pages/Commons/BusDetail';
import HostelApplication from '../pages/Commons/Hostel';
import ChatList from '../pages/Commons/ChatList';
import ChatDetail from '../pages/Commons/Chat';
import NotificationPage from '../pages/Commons/Notification';
import ChangePassword from '../pages/Commons/ChangePassword';
import HelpAndSupport from '../pages/Commons/Help_Support';
import BusList from '../pages/Commons/BusList';
import Events from '../pages/Commons/Events';
import Fees from '../pages/Commons/Fees';
import Dues from '../pages/Commons/Dues';
import Timetable from '../pages/Commons/Time_table';
import Library from '../pages/Commons/Library';
import Refund from '../pages/Commons/Refund';
import Menu from '../pages/Commons/Menu';

// Students page import
import Dashboard from '../pages/Students/Dashboard';
import Attendance from '../pages/Students/Attendance';
import Leave from '../pages/Students/Leave';
import Enquiry from '../pages/Students/Enquiry';
import Teacher from '../pages/Students/Teacher';
import Certificate from '../pages/Students/Certificate';
import Examination from '../pages/Students/Examination';
import Result from '../pages/Students/Result';
import Homework from '../pages/Students/Homework';


const Student = createNativeStackNavigator();

const StudentRoute = () => {
  return (
    <>
      <StatusBar translucent={false} />
      <Main />

      <Student.Navigator>
        <Student.Screen options={{ headerShown: false }} name="dashboard" component={Dashboard} />

        <Student.Screen options={{ headerShown: false }} name="attendance" component={Attendance} />
        <Student.Screen options={{ headerShown: false }} name="Teacher" component={Teacher} />
        <Student.Screen options={{ headerShown: false }} name="Enquiry" component={Enquiry} />

        <Student.Screen options={{ headerShown: false }} name="Refund" component={Refund} />
        <Student.Screen options={{ headerShown: false }} name="Fees" component={Fees} />
        <Student.Screen options={{ headerShown: false }} name="Dues" component={Dues} />

        <Student.Screen options={{ headerShown: false }} name="Certificate" component={Certificate} />
        <Student.Screen options={{ headerShown: false }} name="examination" component={Examination} />
        <Student.Screen options={{ headerShown: false }} name="Result" component={Result} />
        <Student.Screen options={{ headerShown: false }} name="Homework" component={Homework} />
        <Student.Screen options={{ headerShown: false }} name="TimeTable" component={Timetable} />

        <Student.Screen options={{ headerShown: false }} name="Holiday" component={Holiday} />
        <Student.Screen options={{ headerShown: false }} name="leave" component={Leave} />
        <Student.Screen options={{ headerShown: false }} name="events" component={Events} />
        <Student.Screen options={{ headerShown: false }} name="library" component={Library} />
        <Student.Screen options={{ headerShown: false }} name="BusList" component={BusList} />
        <Student.Screen options={{ headerShown: false }} name="BusDetails" component={BusDetails} />
        <Student.Screen options={{ headerShown: false }} name="Hostel" component={HostelApplication} />

        <Student.Screen options={{ headerShown: false }} name="Menu" component={Menu} />
        <Student.Screen options={{ headerShown: false }} name="ChangePassword" component={ChangePassword} />
        <Student.Screen options={{ headerShown: false }} name="HelpandSupport" component={HelpAndSupport} />
        <Student.Screen options={{ headerShown: false }} name="Notification" component={NotificationPage} />
        <Student.Screen options={{ headerShown: false }} name="ChatList" component={ChatList} />
        <Student.Screen options={{ headerShown: false }} name="ChatDetail" component={ChatDetail} />
      </Student.Navigator>
      <Footer />
    </>
  );
};

export default StudentRoute;