import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { url } from '../../Component/Config';

const HostelApplication = () => {
    const [name, setName] = useState('');
    const [parentName, setParentName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userId, setUserId] = useState('');
    const [hostelData, setHostelData] = useState([]);
    const [studentHostelData, setStudentHostelData] = useState(null);
    const [Hostelname, setHostelname] = useState('');
    const getUserProfile = async () => {
        try {
            const userProfile = await AsyncStorage.getItem('userProfile');
            if (userProfile !== null) {
                const parsedProfile = JSON.parse(userProfile);
                setUserId(parsedProfile["enrollment_or_employee_id"]);
                setName(parsedProfile.Name);
                setParentName(parsedProfile.father_name);
                setPhoneNumber(parsedProfile.phone);
                console.log(parsedProfile.hostel)
                if (parsedProfile.hostel === "applied") {
                    fetchStudentBusData(parsedProfile["enrollment_or_employee_id"]);
                } else {
                    fetchHostelData();
                }
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const fetchHostelData = async () => {
        try {
            const response = await fetch(`${url}/hostel_details_fetch`); // replace with your API endpoint
            const data = await response.json();
            console.log(data)
            setHostelData(data.Result);
        } catch (error) {
            console.error('Error fetching hostel data:', error);
            Alert.alert('Error', 'Failed to fetch hostel data.');
        }
    };

    const fetchStudentBusData = async (studentId) => {
        try {
            const response = await fetch(`${url}/hostel_applied_fetch`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        enrollment_or_employee_id: studentId
                    }),
                }
            ); // replace with your API endpoint
            const data = await response.json();
            // console.log("answer:", data)
            setStudentHostelData(data.result);
            setHostelname(data.result.building_name)
        } catch (error) {
            console.error('Error fetching student hostel data:', error);
            // Alert.alert('Error', 'Failed to fetch student bus data.');
        }
    };

    const handleCancelBusApplication = async (item) => {
        try {
            const response = await fetch(`${url}/hostel_applied_cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    enrollment_or_employee_id: userId,
                    student_name: name,
                    parent_name: parentName,
                    phone_number: phoneNumber,
                    building_name: Hostelname,
                })
            });
            // const data = await response.json();
            if (response.ok) {
                Alert.alert('Success', 'Your bus application has been canceled.');
                fetchHostelData();
            } else {
                Alert.alert('Error', 'Failed to cancel bus application.');
            }
        } catch (error) {
            console.error('Error canceling bus application:', error);
            Alert.alert('Error', 'Failed to cancel bus application.');
        }
    };

    useEffect(() => {
        getUserProfile();
    }, []);

    const handleApply = async (hostel) => {
        const applicationData = {
            enrollment_or_employee_id: userId,
            student_name: name,
            parent_name: parentName,
            phone_number: phoneNumber,
            building_name: hostel.building_name,
        };
        console.log(applicationData);

        try {
            const response = await fetch(`${url}/hostel_apply`, { // replace with your API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(applicationData),
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert('Success', `Your application for ${hostel.building_name} has been sent.`);
                console.log(data);
            } else {
                Alert.alert('Error', 'Failed to submit application.');
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            Alert.alert('Error', 'Failed to submit application.');
        }
    };

    const renderHostelItem = ({ item }) => (
        <View style={styles.hostelItem}>
            <Text style={styles.hostelText}>Building Name: {item.building_name}</Text>
            <Text style={styles.hostelText}>Hostel Fees: {item.hostel_fees}</Text>
            <Text style={styles.hostelText}>Mess Fees: {item.mess_fees}</Text>
            <Text style={styles.hostelText}>Available Beds: {item.available_beds}</Text>
            <Text style={styles.hostelText}>Total Beds: {item.total_beds}</Text>
            <Text style={styles.hostelText}>Hostel Type: {item.hostel_type}</Text>
            <Button title="Apply" onPress={() => handleApply(item)} />
        </View>
    );

    const renderStudentHostel = () => (
        <View style={styles.item}>
            <Text style={{ fontSize: 25 }}>Building Name: {studentHostelData.building_name}</Text>
            <Text style={{ fontSize: 20 }}>Student Name: {studentHostelData.student_name}</Text>
            <Text style={{ fontSize: 20 }}>Parent Name: {studentHostelData.parent_name}</Text>
            <Text style={{ fontSize: 20 }}>Phone Number: {studentHostelData.phone_number}</Text>
            <Text style={{ fontSize: 20 }}>Status: {studentHostelData.status}</Text>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelBusApplication}>
                <MaterialIcons name="delete" size={30} color="red" />
                <Text style={styles.cancelButtonText}>Cancel </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Hostel Application</Text>
            {studentHostelData ? (
                renderStudentHostel()
            ) : (
                <FlatList
                    data={hostelData}
                    keyExtractor={(item) => item.building_name}
                    renderItem={renderHostelItem}
                    contentContainerStyle={styles.hostelList}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginBottom: 25,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    hostelList: {
        marginTop: 20,
    },
    hostelItem: {
        marginBottom: 20,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    hostelText: {
        fontSize: 18,
        marginBottom: 5,
    },
    item: {
        marginBottom: 20,
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
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

export default HostelApplication;
