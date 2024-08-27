import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { url } from '../../Component/Config';

const Admin_Student = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [classDropdownVisible, setClassDropdownVisible] = useState(false);
    const [sectionDropdownVisible, setSectionDropdownVisible] = useState(false);
    const [subjectDropdownVisible, setSubjectDropdownVisible] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [newStudent, setNewStudent] = useState({
        profile_type: 'student',
        Name: '',
        date_of_birth: '',
        age: '',
        address: '',
        city: '',
        email: '',
        student_class: '',
    });

    useEffect(() => {
        fetchStudentsData();
    }, []);

    const fetchStudentsData = async () => {
        try {
            const response = await fetch(`${url}/admin_student_fetch`); // Replace with your API URL
            const data = await response.json();
            console.log(data);
            setStudents(data.Students);
            setFilteredStudents(data.Students);
            setClasses(data.Classes);
            setSections(data.Sections); // Assuming data.Sections is provided by your API
            setSubjects(data.Subjects); // Assuming data.Subjects is provided by your API
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch data');
            setLoading(false);
        }
    };

    const handleClassFilter = (className) => {
        setSelectedClass(className);
        setSelectedSection(null); // Reset section and subject filters
        setSelectedSubject(null);
        if (className) {
            setFilteredStudents(students.filter(student => student.student_class === className));
        } else {
            setFilteredStudents(students);
        }
        setClassDropdownVisible(false);
    };

    const handleSectionFilter = (section) => {
        setSelectedSection(section);
        if (section) {
            setFilteredStudents(students.filter(student => student.section === section && student.student_class === selectedClass));
        } else {
            setFilteredStudents(students.filter(student => student.student_class === selectedClass));
        }
        setSectionDropdownVisible(false);
    };

    const handleSubjectFilter = (subject) => {
        setSelectedSubject(subject);
        if (subject) {
            setFilteredStudents(students.filter(student => student.subject === subject && student.student_class === selectedClass));
        } else {
            setFilteredStudents(students.filter(student => student.student_class === selectedClass));
        }
        setSubjectDropdownVisible(false);
    };

    const handleCardPress = (student) => {
        setSelectedStudent(student);
        setModalVisible(true);
    };

    const handleSave = async () => {
        console.log(selectedStudent)
        try {
            const response = await fetch(`${url}/admin_student_update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedStudent),
            });
            console.log(response)
            // const data = await response.json();
            if (response.ok) {
                fetchStudentsData();
                setModalVisible(false);
            }
        } catch (error) {
            setError('Failed to update data');
        }
    };

    const handleDelete = async (id) => {
        console.log(id)
        Alert.alert(
            'Confirm Deletion',
            'Do you really want to delete this data?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        console.log(id)
                        try {
                            const response = await fetch(`${url}/admin_student_delete`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ "student_id": id }),
                            });
                            console.log(response)
                            if (response.ok) {
                                fetchStudentsData();
                            }
                        } catch (error) {
                            setError('Failed to delete data');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const handleAddStudent = async () => {
        try {
            const response = await fetch(`${url}/add_user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newStudent),
            });
            if (response.ok) {
                fetchStudentsData();
                setModalVisible1(false);
                setNewStudent({
                    Name: '',
                    date_of_birth: '',
                    age: '',
                    address: '',
                    city: '',
                    email: '',
                    student_class: '',
                });
            } else {
                setError('Failed to add student');
            }
        } catch (error) {
            setError('Failed to add student');
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleCardPress(item)} style={styles.card}>
            <Text style={styles.cardTitle}>{item.Name}</Text>
            <Text style={styles.cardText}>Mobile: {item.phone}</Text>
            <Text style={styles.cardText}>Email: {item.email}</Text>
            <Text style={styles.cardText}>Class: {item.student_class}</Text>
            <Text style={styles.cardText}>City: {item.city}</Text>
            <Text style={styles.cardText}>Country: {item.country}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.student_id)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
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
            <Text style={styles.title}>Admin Student</Text>
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

                {(selectedClass === '11' || selectedClass === '12') && (
                    <TouchableOpacity onPress={() => setSubjectDropdownVisible(!subjectDropdownVisible)} style={styles.dropdownButton}>
                        <Text style={styles.dropdownButtonText}>
                            Filter by Subject: {selectedSubject ? selectedSubject : 'All'}
                        </Text>
                    </TouchableOpacity>
                )}
                {subjectDropdownVisible && (
                    <View style={styles.dropdown}>
                        <TouchableOpacity onPress={() => handleSubjectFilter(null)} style={styles.dropdownItem}>
                            <Text>All</Text>
                        </TouchableOpacity>
                        {subjects.map((subject, index) => (
                            <TouchableOpacity key={index} onPress={() => handleSubjectFilter(subject)} style={styles.dropdownItem}>
                                <Text>{subject}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
            <FlatList
                data={filteredStudents}
                renderItem={renderItem}
                keyExtractor={(item) => item.student_id.toString()}
                contentContainerStyle={styles.cardContainer}
            />
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Student</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={selectedStudent?.Name || ''}
                            onChangeText={(text) => setSelectedStudent({ ...selectedStudent, Name: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Date of Birth"
                            value={selectedStudent?.date_of_birth || ''}
                            onChangeText={(text) => setSelectedStudent({ ...selectedStudent, date_of_birth: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Age"
                            value={selectedStudent?.age || ''}
                            onChangeText={(text) => setSelectedStudent({ ...selectedStudent, age: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Address"
                            value={selectedStudent?.address || ''}
                            onChangeText={(text) => setSelectedStudent({ ...selectedStudent, address: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="City"
                            value={selectedStudent?.city || ''}
                            onChangeText={(text) => setSelectedStudent({ ...selectedStudent, city: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={selectedStudent?.email || ''}
                            onChangeText={(text) => setSelectedStudent({ ...selectedStudent, email: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Class"
                            value={selectedStudent?.student_class || ''}
                            onChangeText={(text) => setSelectedStudent({ ...selectedStudent, student_class: text })}
                        />
                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={modalVisible1}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible1(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Student</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={newStudent.Name}
                            onChangeText={(text) => setNewStudent({ ...newStudent, Name: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Date of Birth"
                            value={newStudent.date_of_birth}
                            onChangeText={(text) => setNewStudent({ ...newStudent, date_of_birth: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Age"
                            value={newStudent.age}
                            onChangeText={(text) => setNewStudent({ ...newStudent, age: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Address"
                            value={newStudent.address}
                            onChangeText={(text) => setNewStudent({ ...newStudent, address: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="City"
                            value={newStudent.city}
                            onChangeText={(text) => setNewStudent({ ...newStudent, city: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={newStudent.email}
                            onChangeText={(text) => setNewStudent({ ...newStudent, email: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Class"
                            value={newStudent.student_class}
                            onChangeText={(text) => setNewStudent({ ...newStudent, student_class: text })}
                        />
                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity onPress={handleAddStudent} style={styles.saveButton}>
                                <Text style={styles.saveButtonText}>Add</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setModalVisible1(false)} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible1(true)}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

// Styles updated
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp('4%'),
        backgroundColor: '#fff',
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
        padding: hp('1%'),
        backgroundColor: '#ddd',
        borderRadius: 5,
        marginBottom: hp('1%'),
    },
    dropdownButtonText: {
        fontSize: hp('2%'),
    },
    dropdown: {
        backgroundColor: '#eee',
        padding: hp('1%'),
        borderRadius: 5,
    },
    dropdownItem: {
        padding: hp('1%'),
    },
    cardContainer: {
        paddingBottom: hp('10%'), // To avoid overlap with FAB
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: hp('2%'),
        borderRadius: 5,
        marginBottom: hp('1%'),
    },
    cardTitle: {
        fontSize: hp('2.5%'),
        fontWeight: 'bold',
        marginBottom: hp('1%'),
    },
    cardText: {
        fontSize: hp('2%'),
    },
    deleteButton: {
        backgroundColor: '#ff6666',
        padding: hp('1%'),
        borderRadius: 5,
        marginTop: hp('1%'),
    },
    deleteButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: hp('3%'),
        borderRadius: 5,
        width: wp('80%'),
    },
    modalTitle: {
        fontSize: hp('2.5%'),
        fontWeight: 'bold',
        marginBottom: hp('2%'),
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: hp('1%'),
        marginBottom: hp('1%'),
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: hp('1%'),
        borderRadius: 5,
    },
    saveButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    cancelButton: {
        backgroundColor: '#ff6666',
        padding: hp('1%'),
        borderRadius: 5,
    },
    cancelButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: hp('2%'),
        right: wp('4%'),
        backgroundColor: '#4CAF50',
        width: hp('7%'),
        height: hp('7%'),
        borderRadius: hp('3.5%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabText: {
        color: '#fff',
        fontSize: hp('4%'),
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: hp('2%'),
    },
});

export default Admin_Student;
