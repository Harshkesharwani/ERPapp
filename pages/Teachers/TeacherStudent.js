import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { url } from '../../Component/Config';

const TeacherStudentPage = () => {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [classDropdownVisible, setClassDropdownVisible] = useState(false);
    const [sectionDropdownVisible, setSectionDropdownVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (selectedClass || selectedSection) {
            fetchStudentsData();
        }
    }, [selectedClass, selectedSection]);

    const fetchUserProfile = async () => {
        const userProfile = await AsyncStorage.getItem('userProfile');
        if (userProfile) {
            const parsedProfile = JSON.parse(userProfile);
            console.log(parsedProfile)
            fetchClassAndSection(parsedProfile["Employee ID"]);
        }
    };

    const fetchClassAndSection = async (id) => {
        // console.log(id)
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
            setError('Failed to fetch class and section data');
            setLoading(false);
        }
    };

    const fetchStudentsData = async () => {
        console.log(selectedClass);
        console.log(selectedSection);
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
            console.log(data)
            setStudents(data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch students data');
            setLoading(false);
        }
    };

    const handleClassFilter = (classValue) => {
        setSelectedClass(classValue);
        setClassDropdownVisible(false);
    };

    const handleSectionFilter = (sectionValue) => {
        setSelectedSection(sectionValue);
        setSectionDropdownVisible(false);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleCardPress(item)} style={styles.card}>
            <Text style={styles.cardTitle}>Student ID: {item.student_id}</Text>
            <Text style={styles.cardText}>Name: {item.student_name}</Text>

        </TouchableOpacity>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Teacher Student</Text>
            <View style={styles.dropdownContainer}>
                <TouchableOpacity onPress={() => setClassDropdownVisible(!classDropdownVisible)} style={styles.dropdownButton}>
                    <Text style={styles.dropdownButtonText}>
                        Filter by Class: {selectedClass ? selectedClass : 'All'}
                    </Text>
                </TouchableOpacity>
                {classDropdownVisible && (
                    <View style={styles.dropdown}>
                        <TouchableOpacity onPress={() => handleClassFilter(null)} style={styles.dropdownItem}>
                            <Text>All</Text>
                        </TouchableOpacity>
                        {classes.map((classValue, index) => (
                            <TouchableOpacity key={index} onPress={() => handleClassFilter(classValue)} style={styles.dropdownItem}>
                                <Text>{classValue}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <TouchableOpacity onPress={() => setSectionDropdownVisible(!sectionDropdownVisible)} style={styles.dropdownButton}>
                    <Text style={styles.dropdownButtonText}>
                        Filter by Section: {selectedSection ? selectedSection : 'All'}
                    </Text>
                </TouchableOpacity>
                {sectionDropdownVisible && (
                    <View style={styles.dropdown}>
                        <TouchableOpacity onPress={() => handleSectionFilter(null)} style={styles.dropdownItem}>
                            <Text>All</Text>
                        </TouchableOpacity>
                        {sections.map((section, index) => (
                            <TouchableOpacity key={index} onPress={() => handleSectionFilter(section)} style={styles.dropdownItem}>
                                <Text>{section}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
            <FlatList
                data={students}
                renderItem={renderItem}
                keyExtractor={(item) => item.student_id.toString()}
            />
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
        backgroundColor: '#fff',
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
    deleteButton: {
        marginTop: hp('2%'),
        backgroundColor: '#ff4d4d',
        padding: wp('2%'),
        borderRadius: 5,
    },
    deleteButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: hp('2%'),
    },
});

export default TeacherStudentPage;
