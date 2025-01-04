import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import { url } from '../../Component/Config';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const STATUS = {
    PRESENT: 'Present',
    ABSENT: 'Absent',
};

const StudentAttendancePage = () => {
    const [attendance, setAttendance] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isClassDropdownVisible, setClassDropdownVisible] = useState(false);
    const [isSectionDropdownVisible, setSectionDropdownVisible] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            filterSections(selectedClass);
        }
    }, [selectedClass]);

    useEffect(() => {
        if (selectedClass && selectedSection) {
            fetchStudentList();
        }
    }, [selectedClass, selectedSection]);

    const fetchUserProfile = async () => {
        try {
            const userProfile = await AsyncStorage.getItem('userProfile');
            if (userProfile) {
                const parsedProfile = JSON.parse(userProfile);
                fetchClassSectionDetails(parsedProfile["enrollment_or_employee_id"]);
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            setLoading(false);
        }
    };

    const fetchClassSectionDetails = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/teacher_class_section_details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ enrollment_or_employee_id: id }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.Sections) {
                const mappedClasses = data.Sections.reduce((acc, [classNumber, section]) => {
                    let existingClass = acc.find(cls => cls.classNumber === classNumber);
                    if (!existingClass) {
                        existingClass = { classNumber, sections: [] };
                        acc.push(existingClass);
                    }
                    existingClass.sections.push({ section_id: section, section_name: section });
                    return acc;
                }, []);
                setClasses(mappedClasses);
            } else {
                console.log('No Classes returned from API');
                Alert.alert('No classes found.');
            }

            setLoading(false);
        } catch (error) {
            console.error('Fetch error:', error);
            Alert.alert('Failed to fetch class and section details');
            setLoading(false);
        }
    };

    const filterSections = (classId) => {
        const filteredSections = classes.find(cls => cls.classNumber === classId)?.sections || [];
        setSections(filteredSections);
    };

    const fetchStudentList = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/student_fetch_classwise`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ class: selectedClass, section: selectedSection }),
            });

            const data = await response.json();
            console.log(data);
            if (response.ok) {
                const updatedStudents = data.map(student => ({
                    ...student,
                    status: STATUS.PRESENT,
                }));
                setStudents(updatedStudents);
            } else {
                Alert.alert('Failed to fetch student list');
                console.error('Error:', data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Fetch error:', error);
            Alert.alert('Failed to fetch student list');
            setLoading(false);
        }
    };

    const handleAttendanceChange = (studentId, newStatus) => {
        setStudents(prevStudents =>
            prevStudents.map(student =>
                student.student_id === studentId
                    ? { ...student, status: newStatus }
                    : student
            )
        );
    };

    const saveAttendance = async () => {
        const attendanceData = students.map(student => ({
            student_id: student.student_id,
            status: student.status.toLowerCase(),
        }));
        const date = new Date(); // Format date as YYYY-MM-DD
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
                        console.log('Sending Attendance Data:', attendanceData);
                        try {
                            await fetch(`${url}/teacher_class_attendance`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ class: selectedClass, section: selectedSection, date, attendance: attendanceData }),
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

    const renderStudentItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: item.status === STATUS.PRESENT ? 'lightgreen' : 'lightcoral' }]}>
            <Text style={styles.cardTitle}>Name: {item.student_name}</Text>
            <View style={styles.checkboxContainer}>
                <CheckBox
                    value={item.status === STATUS.PRESENT}
                    onValueChange={() => handleAttendanceChange(item.student_id, STATUS.PRESENT)}
                />
                <Text style={styles.checkboxLabel}>Present</Text>
                <CheckBox
                    value={item.status === STATUS.ABSENT}
                    onValueChange={() => handleAttendanceChange(item.student_id, STATUS.ABSENT)}
                />
                <Text style={styles.checkboxLabel}>Absent</Text>
            </View>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Student Attendance</Text>

            {/* Class Dropdown */}
            <TouchableOpacity
                onPress={() => setClassDropdownVisible(!isClassDropdownVisible)}
                style={styles.dropdownButton}
            >
                <Text style={styles.dropdownButtonText}>
                    {selectedClass ? `Class: ${selectedClass}` : 'Select Class'}
                </Text>
            </TouchableOpacity>

            {/* Class Dropdown List */}
            {isClassDropdownVisible && (
                <View style={styles.dropdownList}>
                    {classes.map(cls => (
                        <TouchableOpacity
                            key={cls.classNumber}
                            onPress={() => {
                                setSelectedClass(cls.classNumber);
                                setClassDropdownVisible(false);
                            }}
                            style={styles.dropdownListItem}
                        >
                            <Text style={styles.dropdownListItemText}>{cls.classNumber}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Section Dropdown */}
            {selectedClass && (
                <TouchableOpacity
                    onPress={() => setSectionDropdownVisible(!isSectionDropdownVisible)}
                    style={styles.dropdownButton}
                >
                    <Text style={styles.dropdownButtonText}>
                        {selectedSection ? `Section: ${selectedSection}` : 'Select Section'}
                    </Text>
                </TouchableOpacity>
            )}

            {/* Section Dropdown List */}
            {isSectionDropdownVisible && (
                <View style={styles.dropdownList}>
                    {sections.map(section => (
                        <TouchableOpacity
                            key={section.section_id}
                            onPress={() => {
                                setSelectedSection(section.section_id);
                                setSectionDropdownVisible(false);
                            }}
                            style={styles.dropdownListItem}
                        >
                            <Text style={styles.dropdownListItemText}>{section.section_name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {students.length > 0 ? (
                <>
                    <FlatList
                        data={students}
                        renderItem={renderStudentItem}
                        keyExtractor={item => item.student_id.toString()}
                    />
                    <TouchableOpacity
                        onPress={saveAttendance}
                        style={styles.saveButton}
                    >
                        <Text style={styles.saveButtonText}>Save Attendance</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text style={styles.noDataText}>No Students to Display</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    dropdownButton: {
        padding: 15,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    dropdownButtonText: {
        fontSize: 16,
    },
    dropdownList: {
        // position: 'absolute',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    dropdownListItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    dropdownListItemText: {
        fontSize: 16,
    },
    card: {
        padding: 20,
        borderRadius: 10,
        marginVertical: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    checkboxLabel: {
        fontSize: 16,
        marginLeft: 8,
        marginRight: 16,
    },
    saveButton: {
        backgroundColor: '#567BC2',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 20,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    noDataText: {
        textAlign: 'center',
        fontSize: 18,
        color: 'gray',
        marginTop: 20,
    },
});

export default StudentAttendancePage;
