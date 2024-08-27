import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../../Component/Config';

const BusDetails = ({ route }) => {
  const { bus } = route.params;
  const [name, setName] = useState('');
  const [parentName, setParentName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userId, setUserId] = useState('');
  const [boardingPoint, setBoardingPoint] = useState('');

  const fetchUserProfile = async () => {
    const userProfile = await AsyncStorage.getItem('userProfile');
    if (userProfile) {
      const parsedProfile = JSON.parse(userProfile);
      setUserId(parsedProfile["enrollment_or_employee_id"]);
      setName(parsedProfile.Name);
      setParentName(parsedProfile.father_name);
      setPhoneNumber(parsedProfile.phone);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleApply = async () => {
    if (!boardingPoint) {
      Alert.alert('Error', 'Please select a boarding point.');
      return;
    }
    const currentDate = new Date().toISOString();
    const applicationData = {
      enrollment_or_employee_id: userId,
      student_name: name,
      parent_name: parentName,
      phone_number: phoneNumber,
      bus_number: bus.bus_number,
      boarding_point: boardingPoint,
      date_applied: currentDate,
    };

    try {
      const response = await fetch(`${url}/bus_apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });
      console.log("response: ", response)
      const data = await response.json();
      console.log("data: ", data)
      if (response.ok) {
        Alert.alert('Success', 'Your application has been sent.');
      } else {
        Alert.alert('Error', 'Failed to submit application.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert('Error', 'An error occurred while submitting your application.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus Number: {bus.bus_number}</Text>
      <Text style={styles.detail}>Driver Name: {bus.driver_name}</Text>
      <Text style={styles.detail}>Driver Phone Number: {bus.driver_phone_number}</Text>
      <Text style={styles.detail}>Route:</Text>
      <View style={styles.routeContainer}>
        {bus.route.split(' to ').map((stop, index) => (
          <View key={index} style={styles.stopContainer}>
            <TouchableOpacity onPress={() => setBoardingPoint(stop)} style={styles.stop}>
              <Text style={styles.stopText}>{stop}</Text>
            </TouchableOpacity>
            {index < bus.route.split(' to ').length - 1 && <Text style={styles.arrow}>-{'>'}</Text>}
          </View>
        ))}
      </View>
      <Text style={styles.selectedBoardingPoint}>Selected Boarding Point: {boardingPoint}</Text>
      {/* <Button title="Apply" /> */}
      <TouchableOpacity onPress={handleApply} style={styles.button}>
        <Text style={{ color: 'white' }}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 18,
    marginBottom: 5,
  },
  routeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 10,
  },
  stopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stop: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    marginVertical: 5,
  },
  stopText: {
    fontSize: 18,
  },
  arrow: {
    fontSize: 18,
    marginHorizontal: 5,
  },
  selectedBoardingPoint: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#567BC2',
    borderColor: '#ccc',
    marginTop: 10,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    width: '100%',
  }
});

export default BusDetails;
