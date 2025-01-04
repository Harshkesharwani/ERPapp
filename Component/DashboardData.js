import attendance from "../assets/icons/attendance.png";
import teachers from "../assets/icons/teachers.png";
import students from "../assets/icons/students.png";
import enquiry from "../assets/icons/enquiry.png";

import fees from "../assets/icons/fees.png";
import dues from "../assets/icons/dues.png";
import panelty from "../assets/icons/panelty.png";
import refund from "../assets/icons/refund.png";

import certificates from "../assets/icons/certificates.png";
import examination from "../assets/icons/examination.png";
import homework from "../assets/icons/homework.png";
import setPaper from "../assets/icons/set-paper.png"
import result from "../assets/icons/result.png"
import timeTable from "../assets/icons/time-table.png";

import events from "../assets/icons/events.png";
import holiday from "../assets/icons/holiday.png";
import leaves from "../assets/icons/leaves.png";
import sports from "../assets/icons/sports.png";

import bus from "../assets/icons/bus.png";
import hostel from "../assets/icons/hostel.png";
import library from "../assets/icons/library.png";

export const dashboard = [
  { title: "Attendance", icon: attendance, route: "attendance" },
  { title: "Teachers", icon: teachers, route: "Teacher" },
  // { title: "Students", icon: students, route: "" },
  { title: "Enquiry", icon: enquiry, route: "Enquiry" },
  { title: "Fees", icon: fees, route: "Fees" },
  { title: "Dues", icon: dues, route: "Dues" },
  // { title: "Panelty", icon: panelty, route: "" },
  { title: "Refund", icon: refund, route: "Refund" },
  { title: "Certificate", icon: certificates, route: "Certificate" },
  { title: "Examination", icon: examination, route: "examination" },
  { title: "Homework", icon: homework, route: "Homework" },
  { title: "Result", icon: result, route: "Result" },
  { title: "Time Table", icon: timeTable, route: "TimeTable" },
  { title: "Events", icon: events, route: "events" },
  { title: "Holiday", icon: holiday, route: "Holiday" },
  { title: "Leaves", icon: leaves, route: "leave" },
  { title: "Bus", icon: bus, route: "BusList" },
  { title: "Hostel", icon: hostel, route: "Hostel" },
  { title: "Library", icon: library, route: "library" }
];

export const Admin_dashboard = [
  { title: "Attendance", icon: attendance, route: "Admin_Attendence" },
  { title: "Teachers", icon: teachers, route: "Admin_Teacher" },
  { title: "Students", icon: students, route: "Admin_Student" },
  { title: "Enquiry", icon: enquiry, route: "Admin_Enquiry" },
  { title: "Fees", icon: fees, route: "Fees" },
  { title: "Dues", icon: dues, route: "Dues" },
  { title: "Refund", icon: refund, route: "Refund" },
  { title: "Certificate", icon: certificates, route: "Admin_certificate" },
  { title: "Examination", icon: examination, route: "Admin_Examination" },
  { title: "Homework", icon: homework, route: "Admin_Homework" },
  { title: "Set Paper", icon: setPaper, route: "Admin_Setpaper" },
  { title: "Result", icon: result, route: "Admin_Result" },
  { title: "Time Table", icon: timeTable, route: "" },
  { title: "Events", icon: events, route: "Admin_Events" },
  { title: "Holiday", icon: holiday, route: "Admin_Holiday" },
  { title: "Leaves", icon: leaves, route: "Admin_Leaves" },
  { title: "Bus", icon: bus, route: "Admin_Bus" },
  { title: "Hostel", icon: hostel, route: "Admin_Hostel" },
  { title: "Library", icon: library, route: "" },
];


// Teacher_dashboard.js
export const Teacher_dashboard = [
  { title: "Attendance", icon: attendance, route: "Teacher_Attendence" },
  { title: "Students", icon: students, route: "Teacher_Student" },
  { title: "Student Attendence", icon: students, route: "TeacherStu_Attendence" },
  { title: "Enquiry", icon: enquiry, route: "Teacher_enquiry" },
  { title: "Fees", icon: fees, route: "Fees" },
  { title: "Dues", icon: dues, route: "Dues" },
  // { title: "Panelty", icon: panelty, route: "" },
  { title: "Refund", icon: refund, route: "Refund" },
  { title: "Certificate", icon: certificates, route: "Teacher_Certificate" },
  { title: "Examination", icon: examination, route: "examination" },
  { title: "Homework", icon: homework, route: "Teacher_Homework" },
  { title: "Set Paper", icon: setPaper, route: "Teacher_Setpaper" },
  { title: "Result", icon: result, route: "Teacher_Result" },
  { title: "Time Table", icon: timeTable, route: "Teacher_timetable" },
  { title: "Events", icon: events, route: "events" },
  { title: "Holiday", icon: holiday, route: "Holiday" },
  { title: "Leaves", icon: leaves, route: "Teacher_leave" },
  { title: "Bus", icon: bus, route: "BusList" },
  { title: "Hostel", icon: hostel, route: "Hostel" },
  { title: "Library", icon: library, route: "library" },
];


// LibraryData.js
export const availableBooks = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    releaseDate: '1925',
    imageUrl: 'https://via.placeholder.com/100',
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    releaseDate: '1949',
    imageUrl: 'https://via.placeholder.com/100',
  },
  // Add more books as needed
];

export const myBooks = [
  {
    id: '1',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    issuedDate: '2024-01-15',
    returnDate: '2024-02-15',
  },
  {
    id: '2',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    issuedDate: '2024-02-01',
    returnDate: '2024-03-01',
  },
];


