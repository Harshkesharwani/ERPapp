import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { url } from '../../Component/Config';

const BusList = ({ navigation }) => {
    const [buses, setBuses] = useState([]);
    const [studentBusData, setStudentBusData] = useState(null);

    const getUserProfile = async () => {
        try {
            const userProfile = await AsyncStorage.getItem('userProfile');
            if (userProfile !== null) {
                const parsedProfile = JSON.parse(userProfile);
                console.log(parsedProfile)
                if (parsedProfile['bus'] === "applied") {
                    studentBus(parsedProfile["enrollment_or_employee_id"]);
                } else {
                    fetchBuses();
                }
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const fetchBuses = async () => {
        try {
            const response = await fetch(`${url}/bus_details_fetch`); // replace with your actual API endpoint
            const data = await response.json();
            setBuses(data.Result);
        } catch (error) {
            console.error('Error fetching bus data:', error);
        }
    };

    const handleCancelBusApplication = async () => {
        try {
            const response = await fetch(`${url}/bus_applied_cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    enrollment_or_employee_id: studentBusData.enrollment_or_employee_id,
                    student_name: studentBusData.student_name,
                    parent_name: studentBusData.parent_name,
                    phone_number: studentBusData.phone_number,
                    bus_number: studentBusData.bus_number,
                    boarding_point: studentBusData.boarding_point,
                })
            });
            // const data = await response.json();
            if (response.ok) {
                alert('Success', 'Your bus application has been canceled.');
                fetchBuses();
            } else {
                alert('Error', 'Failed to cancel bus application.');
            }
        } catch (error) {
            console.error('Error canceling bus application:', error);
            Alert.alert('Error', 'Failed to cancel bus application.');
        }
    };

    const studentBus = async (id) => {
        try {
            const response = await fetch(`${url}/bus_applied_fetch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ enrollment_or_employee_id: id }), // replace with actual ID
            });
            const data = await response.json();
            console.log(data);
            setStudentBusData(data.result);
        } catch (error) {
            console.log('Error fetching student bus data:', error);
        }
    };

    useEffect(() => {
        getUserProfile();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('BusDetails', { bus: item })} style={styles.item}>
            <Text style={{ fontSize: 25 }}>Bus Number: {item.bus_number}</Text>
            <Text style={{ fontSize: 20 }}>From: {item.starting_point} To: {item.ending_point}</Text>
        </TouchableOpacity>
    );

    const renderStudentBus = () => (
        <View style={styles.item}>
            <Text style={{ fontSize: 25 }}>Bus Number: {studentBusData.bus_number}</Text>
            <Text style={{ fontSize: 20 }}>Boarding Point: {studentBusData.boarding_point}</Text>
            <Text style={{ fontSize: 20 }}>Student Name: {studentBusData.student_name}</Text>
            <Text style={{ fontSize: 20 }}>Parent Name: {studentBusData.parent_name}</Text>
            <Text style={{ fontSize: 20 }}>Phone Number: {studentBusData.phone_number}</Text>
            <Text style={{ fontSize: 20 }}>Status: {studentBusData.status}</Text>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelBusApplication}>
                <MaterialIcons name="delete" size={30} color="red" />
                <Text style={styles.cancelButtonText}>Cancel </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {studentBusData ? (
                renderStudentBus()
            ) : (
                <FlatList
                    data={buses}
                    renderItem={renderItem}
                    keyExtractor={item => item.bus_number}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 10,
    },
    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#ccc',
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButtonText: {
        fontSize: 18,
        marginLeft: 5,
        color: 'red',
    },
});

export default BusList;
