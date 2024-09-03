import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// pages
import Main from '../Component/MainNavbar';
import Footer from '../Component/Footer';

import ChatList from '../pages/Commons/ChatList';
import ChatDetail from '../pages/Commons/Chat';
import NotificationPage from '../pages/Commons/Notification';
import ChangePassword from '../pages/Commons/ChangePassword';
import HelpAndSupport from '../pages/Commons/Help_Support';
import Menu from '../pages/Commons/Menu';

// Admin Page Import
import Admin_Dashboard from '../pages/Admin/Admin_Dashboard';
import Admin_Enquiry from '../pages/Admin/Admin_Enquiry';
import Admin_Teacher from '../pages/Admin/Admin_Teacher';
import Admin_Student from '../pages/Admin/Admin_student';
import Admin_Attendence from '../pages/Admin/Admin_attendence';
import ExamTimetable from '../pages/Admin/Admin_Examination';
import EditExamination from '../pages/Admin/Admin_EditExam';
import LeaveRequestList from '../pages/Admin/Admin_Leaves';
import HomeworkList from '../pages/Admin/Admin_Homework';
import Admin_Holidays from '../pages/Admin/Admin_Holidays';
import Admin_Events from '../pages/Admin/Admin_Events';
import BusRequests from '../pages/Admin/Admin_bus';
import HostelRequests from '../pages/Admin/Admin_hostel';


const Admin = createNativeStackNavigator();

const AdminRoute = () => {
  return (
    <>
      <StatusBar translucent={false} />
      <Main />

      <Admin.Navigator>
        {/* Admin Section */}
        <Admin.Screen options={{ headerShown: false }} name="admin" component={Admin_Dashboard} />
        <Admin.Screen options={{ headerShown: false }} name="Admin_Teacher" component={Admin_Teacher} />
        <Admin.Screen options={{ headerShown: false }} name="Admin_Student" component={Admin_Student} />
        <Admin.Screen options={{ headerShown: false }} name="Admin_Enquiry" component={Admin_Enquiry} />
        <Admin.Screen options={{ headerShown: false }} name="Admin_Attendence" component={Admin_Attendence} />
        <Admin.Screen options={{ headerShown: false }} name="Admin_Examination" component={ExamTimetable} />
        <Admin.Screen options={{ headerShown: false }} name="Admin_EditExamination" component={EditExamination} />
        <Admin.Screen options={{ headerShown: false }} name="Admin_Leaves" component={LeaveRequestList} />
        <Admin.Screen options={{ headerShown: false }} name="Admin_Homework" component={HomeworkList} />
        {/* <Admin.Screen options={{ headerShown: false }} name="Admin_Setpaper" component={SetPaperPage} /> */}
        {/* <Admin.Screen options={{ headerShown: false }} name="Admin_Result" component={ResultPage} />
      <Admin.Screen options={{ headerShown: false }} name="Admin_certificate" component={CertificationPage} /> */}
        <Admin.Screen options={{ headerShown: false }} name="Admin_Holiday" component={Admin_Holidays} />
        <Admin.Screen options={{ headerShown: false }} name="Admin_Events" component={Admin_Events} />
        <Admin.Screen options={{ headerShown: false }} name="Admin_Bus" component={BusRequests} />
        <Admin.Screen options={{ headerShown: false }} name="Admin_Hostel" component={HostelRequests} />

        <Admin.Screen options={{ headerShown: false }} name="Menu" component={Menu} />
        <Admin.Screen options={{ headerShown: false }} name="ChangePassword" component={ChangePassword} />
        <Admin.Screen options={{ headerShown: false }} name="HelpandSupport" component={HelpAndSupport} />
        <Admin.Screen options={{ headerShown: false }} name="Notification" component={NotificationPage} />
        <Admin.Screen options={{ headerShown: false }} name="ChatList" component={ChatList} />
        <Admin.Screen options={{ headerShown: false }} name="ChatDetail" component={ChatDetail} />
      </Admin.Navigator>
      <Footer />
    </>
  );
};

export default AdminRoute;