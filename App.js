import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// pages
import Main from './Component/MainNavbar';
import Footer from './Component/Footer';

import Sign from './pages/Commons/Sign';
import Login from './pages/Login';

// commons
import Holiday from './pages/Commons/Holiday';
import BusDetails from './pages/Commons/BusDetail';
import HostelApplication from './pages/Commons/Hostel';
import ChatList from './pages/Commons/ChatList';
import ChatDetail from './pages/Commons/Chat';
import NotificationPage from './pages/Commons/Notification';
import ChangePassword from './pages/Commons/ChangePassword';
import HelpAndSupport from './pages/Commons/Help_Support';
import BusList from './pages/Commons/BusList';
import Events from './pages/Commons/Events';
import Fees from './pages/Commons/Fees';
import Dues from './pages/Commons/Dues';
import Timetable from './pages/Commons/Time_table';
import Library from './pages/Commons/Library';
import Refund from './pages/Commons/Refund';
import Menu from './pages/Commons/Menu';
import ForgetPassword from './pages/Commons/Forgetpassword';
import ConformPassword from './pages/Commons/ConformPassword';

// Students page import
import Dashboard from './pages/Students/Dashboard';
import Attendance from './pages/Students/Attendance';
import Leave from './pages/Students/Leave';
import Enquiry from './pages/Students/Enquiry';
import Teacher from './pages/Students/Teacher';
import Certificate from './pages/Students/Certificate';
import Examination from './pages/Students/Examination';
import Result from './pages/Students/Result';
import Homework from './pages/Students/Homework';

// Admin Page Import
import Admin_Dashboard from './pages/Admin/Admin_Dashboard';
import Admin_Enquiry from './pages/Admin/Admin_Enquiry';
import Admin_Teacher from './pages/Admin/Admin_Teacher';
import Admin_Student from './pages/Admin/Admin_student';
import Admin_Attendence from './pages/Admin/Admin_attendence';
import ExamTimetable from './pages/Admin/Admin_Examination';
import EditExamination from './pages/Admin/Admin_EditExam';
import LeaveRequestList from './pages/Admin/Admin_Leaves';
import HomeworkList from './pages/Admin/Admin_Homework';
import Admin_Holidays from './pages/Admin/Admin_Holidays';
import Admin_Events from './pages/Admin/Admin_Events';
import BusRequests from './pages/Admin/Admin_bus';
import HostelRequests from './pages/Admin/Admin_hostel';


import Teacher_Dashboard from './pages/Teachers/Teacher_Dashbroad';
import Teacher_enquiry from './pages/Teachers/Teacher_enquiry';
import Teacher_timetable from './pages/Teachers/Teacher_Timetable';
import Teacher_leave from './pages/Teachers/Teaacher_leave';
import ExamPage from './pages/Teachers/Teacher_Setpaper';
import AddHomework from './pages/Teachers/Teacher_homework';
import Teacher_Examination from './pages/Teachers/Teacher_Examination';
import Teacher_Attendence from './pages/Teachers/Teacher_stuAttendence';
import TeacherStudentPage from './pages/Teachers/TeacherStudent';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar translucent={false} />
      <Main />

      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="login" component={Login} />
        <Stack.Screen options={{ headerShown: false }} name="ForgotPassword" component={ForgetPassword} />
        <Stack.Screen options={{ headerShown: false }} name="ConfirmPassword" component={ConformPassword} />

        <Stack.Screen options={{ headerShown: false }} name="sign" component={Sign} />

        <Stack.Screen options={{ headerShown: false }} name="dashboard" component={Dashboard} />

        <Stack.Screen options={{ headerShown: false }} name="attendance" component={Attendance} />
        <Stack.Screen options={{ headerShown: false }} name="Teacher" component={Teacher} />
        <Stack.Screen options={{ headerShown: false }} name="Enquiry" component={Enquiry} />

        <Stack.Screen options={{ headerShown: false }} name="Refund" component={Refund} />
        <Stack.Screen options={{ headerShown: false }} name="Fees" component={Fees} />
        <Stack.Screen options={{ headerShown: false }} name="Dues" component={Dues} />

        <Stack.Screen options={{ headerShown: false }} name="Certificate" component={Certificate} />
        <Stack.Screen options={{ headerShown: false }} name="examination" component={Examination} />
        <Stack.Screen options={{ headerShown: false }} name="Result" component={Result} />
        <Stack.Screen options={{ headerShown: false }} name="Homework" component={Homework} />
        <Stack.Screen options={{ headerShown: false }} name="TimeTable" component={Timetable} />

        <Stack.Screen options={{ headerShown: false }} name="Holiday" component={Holiday} />
        <Stack.Screen options={{ headerShown: false }} name="leave" component={Leave} />
        <Stack.Screen options={{ headerShown: false }} name="events" component={Events} />
        <Stack.Screen options={{ headerShown: false }} name="library" component={Library} />
        <Stack.Screen options={{ headerShown: false }} name="BusList" component={BusList} />
        <Stack.Screen options={{ headerShown: false }} name="BusDetails" component={BusDetails} />
        <Stack.Screen options={{ headerShown: false }} name="Hostel" component={HostelApplication} />

        <Stack.Screen options={{ headerShown: false }} name="Menu" component={Menu} />
        <Stack.Screen options={{ headerShown: false }} name="ChangePassword" component={ChangePassword} />
        <Stack.Screen options={{ headerShown: false }} name="HelpandSupport" component={HelpAndSupport} />
        <Stack.Screen options={{ headerShown: false }} name="Notification" component={NotificationPage} />
        <Stack.Screen options={{ headerShown: false }} name="ChatList" component={ChatList} />
        <Stack.Screen options={{ headerShown: false }} name="ChatDetail" component={ChatDetail} />

        {/* Admin Section */}
        <Stack.Screen options={{ headerShown: false }} name="admin" component={Admin_Dashboard} />
        <Stack.Screen options={{ headerShown: false }} name="Admin_Teacher" component={Admin_Teacher} />
        <Stack.Screen options={{ headerShown: false }} name="Admin_Student" component={Admin_Student} />
        <Stack.Screen options={{ headerShown: false }} name="Admin_Enquiry" component={Admin_Enquiry} />
        <Stack.Screen options={{ headerShown: false }} name="Admin_Attendence" component={Admin_Attendence} />
        <Stack.Screen options={{ headerShown: false }} name="Admin_Examination" component={ExamTimetable} />
        <Stack.Screen options={{ headerShown: false }} name="Admin_EditExamination" component={EditExamination} />
        <Stack.Screen options={{ headerShown: false }} name="Admin_Leaves" component={LeaveRequestList} />
        <Stack.Screen options={{ headerShown: false }} name="Admin_Homework" component={HomeworkList} />
        {/* <Stack.Screen options={{ headerShown: false }} name="Admin_Setpaper" component={SetPaperPage} /> */}
        {/* <Stack.Screen options={{ headerShown: false }} name="Admin_Result" component={ResultPage} />
      <Stack.Screen options={{ headerShown: false }} name="Admin_certificate" component={CertificationPage} /> */}
        <Stack.Screen options={{ headerShown: false }} name="Admin_Holiday" component={Admin_Holidays} />
        <Stack.Screen options={{ headerShown: false }} name="Admin_Events" component={Admin_Events} />
        <Stack.Screen options={{ headerShown: false }} name="Admin_Bus" component={BusRequests} />
        <Stack.Screen options={{ headerShown: false }} name="Admin_Hostel" component={HostelRequests} />

        {/* Teacher Section */}
        <Stack.Screen options={{ headerShown: false }} name="Teacher_dashboard" component={Teacher_Dashboard} />
        <Stack.Screen options={{ headerShown: false }} name="Teacher_enquiry" component={Teacher_enquiry} />
        <Stack.Screen options={{ headerShown: false }} name="Teacher_timetable" component={Teacher_timetable} />
        <Stack.Screen options={{ headerShown: false }} name="Teacher_leave" component={Teacher_leave} />
        <Stack.Screen options={{ headerShown: false }} name="Teacher_Certificate" component={Teacher_leave} />
        <Stack.Screen options={{ headerShown: false }} name="Teacher_Result" component={Teacher_leave} />
        <Stack.Screen options={{ headerShown: false }} name="Teacher_Setpaper" component={ExamPage} />
        <Stack.Screen options={{ headerShown: false }} name="Teacher_Homework" component={AddHomework} />
        <Stack.Screen options={{ headerShown: false }} name="Teacher_Examination" component={Teacher_Examination} />
        <Stack.Screen options={{ headerShown: false }} name="Teacher_Attendence" component={Teacher_Attendence} />
        <Stack.Screen options={{ headerShown: false }} name="Teacher_Student" component={TeacherStudentPage} />

      </Stack.Navigator>

      {/* <Stack.Screen
      name="Footer"
      component={() => {
        const hiddenRoutes = ['login', 'sign', 'ForgotPassword', 'ConfirmPassword'];
        const routeName = navigationRef.current?.getCurrentRoute()?.name;
        return !hiddenRoutes.includes(routeName) ? <Footer /> : null;
      }}
    /> */}
      <Footer />
    </NavigationContainer>
  );
};

export default App;
