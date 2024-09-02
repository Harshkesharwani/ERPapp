import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { url } from '../../Component/Config';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [student_id, setStudent_id] = useState('');

  const handleDayPress = async (day) => {
    try {
      const response = await fetch(`${url}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: day.dateString,
          student_id: student_id,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.Error) {
          alert("No data Found")
        } else {
          setApiResponse(data.attendance);
          setSelectedDate(day.dateString);
        }
      }
      else {
        // alert('No data found');
        return;
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getUserProfile = async () => {
    try {
      const userProfile = await AsyncStorage.getItem('userProfile');
      if (userProfile !== null) {
        const parsedProfile = JSON.parse(userProfile);
        // console.log('User Profile:', JSON.parse(userProfile));
        setStudent_id(parsedProfile["enrollment_or_employee_id"]);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Attendance</Text>
      <Calendar
        current={selectedDate || undefined}
        onDayPress={handleDayPress}
        style={styles.calendarStyle}
      />
      {apiResponse && (
        <View style={styles.dayDetailsContainer}>
          <Text style={styles.dayDetailsText}>Attendance Details {selectedDate}</Text>
          {/* <Text style={styles.statusText}>Pending</Text> */}
          <Text style={styles.apiText}>Attendance: {apiResponse["Attendance Type"]}</Text>
          {/* <Text style={styles.apiText}>Working From: {apiResponse["Working From"]}</Text> */}
          <Text style={styles.apiText}>Check In: {apiResponse["Check In Time"]}</Text>
          <Text style={styles.apiText}>Check Out: {apiResponse["Check Out Time"]}</Text>
          {/* <Text style={styles.apiText}>Total Working: {apiResponse["Total Working"]}</Text> */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('2%'),
  },
  calendarStyle: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: hp('2%'),
  },
  dayDetailsContainer: {
    marginTop: hp('2%'),
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  dayDetailsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: hp('1%'),
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginBottom: hp('1%'),
  },
  apiText: {
    fontSize: 16,
    color: '#444',
    marginBottom: hp('0.5%'),
  },
});

export default Attendance;
