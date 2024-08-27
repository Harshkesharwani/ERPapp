import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { url } from '../../Component/Config';

const Admin_Teacher = () => {
    const [teachers, setTeachers] = useState([]);
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false); // New state for add modal
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [newTeacher, setNewTeacher] = useState({ // New state for new teacher form
        profile_type: 'teacher',
        Name: '',
        phone: '',
        email: '',
        section_or_department: '',
        city: '',
        country: '',
        state: '',
        postal_code: '',
        address: '',
        date_of_birth: '',
        father_name: '',
        mother_name: '',
        from_year: '',
        to_year: '',
        joining_date_or_admission_date: '',
        gender: '',
        age: '',
    });

    useEffect(() => {
        fetchTeachersData();
    }, []);

    const fetchTeachersData = async () => {
        try {
            const response = await fetch(`${url}/admin_teacher_fetch`); // Replace with your API URL
            const data = await response.json();
            const formattedTeachers = data.Teachers.map((teacher, index) => ({
                index,
                EmployeeID: teacher['Employee ID'],
                Name: teacher.Name,
                phone: teacher.phone,
                email: teacher.email,
                section_or_department: teacher.section_or_department,
                city: teacher.city,
                country: teacher.country,
                state: teacher.state,
                postal_code: teacher.postal_code,
                address: teacher.address,
                date_of_birth: teacher.date_of_birth,
                father_name: teacher.father_name,
                mother_name: teacher.mother_name,
                from_year: teacher.from_year,
                to_year: teacher.to_year,
                joining_date_or_admission_date: teacher.joining_date_or_admission_date,
                gender: teacher.gender,
                Age: teacher.Age,
            }));
            setTeachers(formattedTeachers);
            setFilteredTeachers(formattedTeachers);
            setDepartments(data.Deparments);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch data');
            setLoading(false);
        }
    };

    const handleFilter = (department) => {
        setSelectedDepartment(department);
        if (department) {
            setFilteredTeachers(teachers.filter(teacher => teacher.section_or_department === department));
        } else {
            setFilteredTeachers(teachers);
        }
        setDropdownVisible(false);
    };

    const handleCardPress = (teacher) => {
        setSelectedTeacher(teacher);
        setModalVisible(true);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${url}/admin_teacher_update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedTeacher),
            });
            if (response.ok) {
                fetchTeachersData();
                setModalVisible(false);
            } else {
                setError('Failed to update data');
            }
        } catch (error) {
            setError('Failed to update data');
        }
    };

    const handleDelete = async (id) => {
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
                        try {
                            const response = await fetch(`${url}/admin_teacher_delete`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ teacher_id: id }),
                            });
                            if (response.ok) {
                                fetchTeachersData();
                            } else {
                                setError('Failed to delete data');
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

    const handleAddTeacher = async () => {
        console.log(newTeacher);
        try {
            const response = await fetch(`${url}/add_user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTeacher),
            });
            console.log(response)
            if (response.ok) {
                fetchTeachersData();
                setModalVisible1(false);
            } else {
                setError('Failed to add teacher');
            }
        } catch (error) {
            setError('Failed to add teacher');
        }
    };

    const renderItem = (item) => (
        <TouchableOpacity key={item.index} onPress={() => handleCardPress(item)} style={styles.card}>
            <Text style={styles.cardTitle}>{item.Name}</Text>
            <Text style={styles.cardText}>Mobile: {item.phone}</Text>
            <Text style={styles.cardText}>Email: {item.email}</Text>
            <Text style={styles.cardText}>Department: {item.section_or_department}</Text>
            <Text style={styles.cardText}>City: {item.city}</Text>
            <Text style={styles.cardText}>Country: {item.country}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.EmployeeID)} style={styles.deleteButton}>
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
        <>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Admin Teacher</Text>
                <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)} style={styles.dropdownButton}>
                    <Text style={styles.dropdownButtonText}>
                        Filter by Department: {selectedDepartment ? selectedDepartment : 'All'}
                    </Text>
                </TouchableOpacity>
                {dropdownVisible && (
                    <View style={styles.dropdown}>
                        <TouchableOpacity onPress={() => handleFilter(null)} style={styles.dropdownItem}>
                            <Text>All</Text>
                        </TouchableOpacity>
                        {departments.map((department, index) => (
                            <TouchableOpacity key={index} onPress={() => handleFilter(department)} style={styles.dropdownItem}>
                                <Text>{department}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                {filteredTeachers.map(renderItem)}
                {selectedTeacher && (
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Edit Teacher</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Name"
                                    value={selectedTeacher.Name}
                                    onChangeText={(text) => setSelectedTeacher({ ...selectedTeacher, Name: text })}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Phone"
                                    value={selectedTeacher.phone}
                                    onChangeText={(text) => setSelectedTeacher({ ...selectedTeacher, phone: text })}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    value={selectedTeacher.email}
                                    onChangeText={(text) => setSelectedTeacher({ ...selectedTeacher, email: text })}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Department"
                                    value={selectedTeacher.section_or_department}
                                    editable={false} // Disable editing
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="City"
                                    value={selectedTeacher.city}
                                    onChangeText={(text) => setSelectedTeacher({ ...selectedTeacher, city: text })}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Country"
                                    value={selectedTeacher.country}
                                    onChangeText={(text) => setSelectedTeacher({ ...selectedTeacher, country: text })}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TouchableOpacity
                                        onPress={handleSave}
                                        style={[styles.button, { backgroundColor: 'green' }]}
                                    >
                                        <Text style={styles.buttonText}>Save</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(false)}
                                        style={[styles.button, { backgroundColor: 'red' }]}
                                    >
                                        <Text style={styles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible1}
                    onRequestClose={() => setModalVisible1(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add New Teacher</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Name"
                                value={newTeacher.Name}
                                onChangeText={(text) => setNewTeacher({ ...newTeacher, Name: text })}
                                required
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Phone"
                                value={newTeacher.phone}
                                onChangeText={(text) => setNewTeacher({ ...newTeacher, phone: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={newTeacher.email}
                                onChangeText={(text) => setNewTeacher({ ...newTeacher, email: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Department"
                                value={newTeacher.section_or_department}
                                onChangeText={(text) => setNewTeacher({ ...newTeacher, section_or_department: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="City"
                                value={newTeacher.city}
                                onChangeText={(text) => setNewTeacher({ ...newTeacher, city: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Address"
                                value={newTeacher.address}
                                onChangeText={(text) => setNewTeacher({ ...newTeacher, address: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Age"
                                value={newTeacher.age}
                                onChangeText={(text) => setNewTeacher({ ...newTeacher, age: text })}
                                required
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity
                                    onPress={handleAddTeacher}
                                    style={[styles.button, { backgroundColor: 'green' }]}
                                >
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setModalVisible1(false)}
                                    style={[styles.button, { backgroundColor: 'red' }]}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible1(true)}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    dropdownButton: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        marginBottom: 8,
    },
    dropdownButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    dropdown: {
        backgroundColor: '#fff',
        borderRadius: 5,
        elevation: 5,
        margin: 10,
    },
    dropdownItem: {
        padding: 10,
        // marginBottom: 10,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        elevation: 3,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardText: {
        fontSize: 14,
        marginBottom: 4,
    },
    deleteButton: {
        marginTop: 8,
        padding: 8,
        backgroundColor: 'red',
        borderRadius: 4,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    error: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 16,
        padding: 8,
        fontSize: 16,
    },
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '48%',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    fab: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    fabIcon: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default Admin_Teacher;
