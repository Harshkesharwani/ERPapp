import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox'; // Import CheckBox component
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const STATUS = {
    PRESENT: 'Present',
    ABSENT: 'Absent',
    UNKNOWN: 'Unknown', // if you want to handle cases where status is not known
};

const StudentAttendancePage = () => {
    const [attendance, setAttendance] = useState([]);
    const [classes, setClasses] = useState([]);
    const [section, setSections]= useState([]);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    }, []);
    
    useEffect(() => {
        fetchUserProfile();
        if (selectedStudent) {
            fetchAttendanceData();
        }
    }, [selectedStudent]);

    const fetchUserProfile = async () => {
        try {
            const userProfile = await AsyncStorage.getItem('userProfile');
            if (userProfile) {
                const parsedProfile = JSON.parse(userProfile);
                fetchStudentList(parsedProfile["Employee ID"]);
            }
        } catch (error) {
            setError('Failed to fetch user profile');
            setLoading(false);
        }
    };

    const fetchStudentList = async (id) => {
        try {
            const response = await fetch(`${url}/teacher_class_section_details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ enrollment_or_employee_id: id }),
            });
            const data = await response.json();
            // console.log(data)
            setClasses(data.class);
            setSections(data.section);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch student list');
            setLoading(false);
        }
    };

    const fetchAttendanceData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/student_attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ student_id: selectedStudent }),
            });
            const data = await response.json();
            setAttendance(data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch attendance data');
            setLoading(false);
        }
    };

    const handleStudentFilter = (studentId) => {
        setSelectedStudent(studentId);
        setDropdownVisible(false);
    };

    const handleAttendanceChange = (date, status) => {
        setAttendance(prevAttendance =>
            prevAttendance.map(item =>
                item.date === date ? { ...item, status: status === STATUS.PRESENT ? STATUS.ABSENT : STATUS.PRESENT } : item
            )
        );
    };

    const saveAttendance = async () => {
        Alert.alert(
            'Confirm Save',
            'Are you sure you want to save the changes?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Save',
                    onPress: async () => {
                        try {
                            await fetch(`${url}/save_attendance`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ student_id: selectedStudent, attendance }),
                            });
                            Alert.alert('Success', 'Attendance saved successfully');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to save attendance');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: item.status === STATUS.PRESENT ? 'lightgreen' : item.status === STATUS.ABSENT ? 'lightcoral' : '#fff' }]}>
            <Text style={styles.cardTitle}>Date: {item.date}</Text>
            <Text style={styles.cardText}>Status: {item.status}</Text>
            <View style={styles.checkboxContainer}>
                <CheckBox
                    value={item.status === STATUS.PRESENT}
                    onValueChange={() => handleAttendanceChange(item.date, item.status)}
                />
                <Text style={styles.checkboxLabel}>Mark as {item.status === STATUS.PRESENT ? 'Absent' : 'Present'}</Text>
            </View>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Student Attendance</Text>
            <View style={styles.dropdownContainer}>
                <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)} style={styles.dropdownButton}>
                    <Text style={styles.dropdownButtonText}>
                        Filter by Student: {selectedStudent ? selectedStudent : 'All'}
                    </Text>
                </TouchableOpacity>
                {dropdownVisible && (
                    <View style={styles.dropdown}>
                        <TouchableOpacity onPress={() => handleStudentFilter(null)} style={styles.dropdownItem}>
                            <Text>All</Text>
                        </TouchableOpacity>
                        {students.map((student, index) => (
                            <TouchableOpacity key={index} onPress={() => handleStudentFilter(student.student_id)} style={styles.dropdownItem}>
                                <Text>{student.student_name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
            <FlatList
                data={attendance}
                renderItem={renderItem}
                keyExtractor={(item) => `${item.student_id}-${item.date}`}
            />
            <TouchableOpacity onPress={saveAttendance} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Attendance</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp('4%'),
    },
    title: {
        fontSize: hp('3%'),
        fontWeight: 'bold',
        marginBottom: hp('2%'),
    },
    dropdownContainer: {
        marginBottom: hp('2%'),
    },
    dropdownButton: {
        padding: wp('3%'),
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginBottom: hp('1%'),
    },
    dropdownButtonText: {
        fontSize: hp('2%'),
    },
    dropdown: {
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    dropdownItem: {
        padding: wp('3%'),
    },
    card: {
        borderRadius: 5,
        padding: wp('4%'),
        marginBottom: hp('2%'),
        borderWidth: 1,
        borderColor: '#ccc',
    },
    cardTitle: {
        fontSize: hp('2.5%'),
        fontWeight: 'bold',
    },
    cardText: {
        fontSize: hp('2%'),
        marginVertical: hp('0.5%'),
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp('1%'),
    },
    checkboxLabel: {
        marginLeft: wp('2%'),
        fontSize: hp('2%'),
    },
    saveButton: {
        marginTop: hp('2%'),
        backgroundColor: '#4caf50',
        padding: wp('2%'),
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: hp('2%'),
    },
});

export default StudentAttendancePage;
