import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Modal,
    TouchableHighlight,
    TextInput,
    ActivityIndicator,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { url } from '../../Component/Config';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';

const AddHomework = () => {
    const [homeworkList, setHomeworkList] = useState([]);
    const [classes, setClasses] = useState([]); // Array of classes with sections
    const [sections, setSections] = useState([]); // Sections for selected class
    const [modalVisible, setModalVisible] = useState(false);
    const [newHomework, setNewHomework] = useState({
        id: '',
        class: '',
        section: '',
        subject: '',
        homework: '',
        date: new Date(),
    });
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (selectedClass) {
            // When a class is selected, update sections accordingly
            const classObject = classes.find(cls => cls.classNumber === selectedClass);
            if (classObject) {
                setSections(classObject.sections);
            }
        }
    }, [selectedClass]);

    useEffect(() => {
        if (selectedClass && selectedSection) {
            fetchHomeworkList();
        }
    }, [selectedClass, selectedSection]);

    const fetchUserProfile = async () => {
        try {
            const userProfile = await AsyncStorage.getItem('userProfile');
            if (userProfile) {
                const parsedProfile = JSON.parse(userProfile);
                fetchClassAndSection(parsedProfile["enrollment_or_employee_id"]);
            }
        } catch (error) {
            setError('Failed to fetch user profile');
            setLoading(false);
        }
    };

    const fetchClassAndSection = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/teacher_class_section_details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ enrollment_or_employee_id: id }),
            });
            const data = await response.json();
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
        } catch (error) {
            setError('Failed to fetch class and section data');
        } finally {
            setLoading(false);
        }
    };

    const fetchHomeworkList = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${url}/admin_homework_fetch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ class: selectedClass, section: selectedSection }),
            });
            const data = await response.json();
            setHomeworkList(data);
        } catch (error) {
            setError('Failed to fetch homework list');
        } finally {
            setLoading(false);
        }
    };

    const handleAddHomework = async () => {
        try {
            const response = await fetch(`${url}/admin_homework_create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newHomework),
            });
            const data = await response.json();
            if (response.ok) {
                fetchHomeworkList();
                setModalVisible(false);
            } else {
                Alert.alert('Error', data.message || 'Failed to add homework');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to add homework');
        }
    };

    const handleEditHomework = async () => {
        try {
            const response = await fetch(`${url}/admin_homework_update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newHomework),
            });
            if (response.ok) {
                fetchHomeworkList();
                setModalVisible(false);
            } else {
                Alert.alert('Error', 'Failed to update homework');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update homework');
        }
    };

    const handleEditPress = (item) => {
        setNewHomework({
            ...item,
            date: new Date(item.date), // Assuming date is returned in ISO format
        });
        setModalVisible(true);
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        setShowDatePicker(false);
        setNewHomework({ ...newHomework, date: currentDate });
    };

    const renderItem = ({ item }) => (
        <View style={styles.homeworkItem}>
            <View>
                <Text style={styles.homeworkText}>
                    Class: {item.class}
                </Text>
                <Text style={styles.homeworkText}>
                    Section: {item.section}
                </Text>
                <Text style={styles.homeworkText}>
                    Subject: {item.subject}
                </Text>
                <Text style={styles.homeworkText}>
                    Homework: {item.homework}
                </Text>
                <Text style={styles.homeworkText}>
                    Date: {new Date(item.date).toLocaleDateString()}
                </Text>
            </View>
            <TouchableOpacity onPress={() => handleEditPress(item)}>
                <MaterialIcons name="edit" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );

    const toggleDropdown = (type) => {
        setDropdownOpen(dropdownOpen === type ? '' : type);
    };

    const selectItem = (item, type) => {
        if (type === 'class') {
            setSelectedClass(item.classNumber); // Update selected class
            setSelectedSection(''); // Reset section when class changes
            setSections(item.sections); // Update sections based on selected class
            setDropdownOpen('');
        } else if (type === 'section') {
            setSelectedSection(item.section_name); // Update selected section
            setDropdownOpen('');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={styles.error}>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Homework</Text>
            <View style={styles.dropdownContainer}>
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => toggleDropdown('class')}
                >
                    <Text style={styles.dropdownButtonText}>
                        {selectedClass || 'Select Class'}
                    </Text>
                </TouchableOpacity>
                {dropdownOpen === 'class' && (
                    <View style={styles.dropdownMenu}>
                        {classes.map((classItem) => (
                            <TouchableOpacity
                                key={classItem.classNumber}
                                style={styles.dropdownMenuItem}
                                onPress={() => selectItem(classItem, 'class')}
                            >
                                <Text style={styles.dropdownMenuText}>{classItem.classNumber}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => toggleDropdown('section')}
                    disabled={!selectedClass} // Disable until class is selected
                >
                    <Text style={styles.dropdownButtonText}>
                        {selectedSection || 'Select Section'}
                    </Text>
                </TouchableOpacity>
                {dropdownOpen === 'section' && (
                    <View style={styles.dropdownMenu}>
                        {sections.map((sectionItem) => (
                            <TouchableOpacity
                                key={sectionItem.section_id}
                                style={styles.dropdownMenuItem}
                                onPress={() => selectItem(sectionItem, 'section')}
                            >
                                <Text style={styles.dropdownMenuText}>{sectionItem.section_name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
            <FlatList
                data={homeworkList}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    setNewHomework({ id: '', class: '', section: '', subject: '', homework: '', date: new Date() });
                    setModalVisible(true);
                }}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{newHomework.id ? 'Edit Homework' : 'Add Homework'}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Class"
                        value={newHomework.class}
                        onChangeText={(text) => setNewHomework({ ...newHomework, class: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Section"
                        value={newHomework.section}
                        onChangeText={(text) => setNewHomework({ ...newHomework, section: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Subject"
                        value={newHomework.subject}
                        onChangeText={(text) => setNewHomework({ ...newHomework, subject: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Homework"
                        value={newHomework.homework}
                        onChangeText={(text) => setNewHomework({ ...newHomework, homework: text })}
                    />
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={styles.dateButtonText}>
                            {newHomework.date.toLocaleDateString()}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={newHomework.date}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    )}
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={newHomework.id ? handleEditHomework : handleAddHomework}
                        >
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableHighlight
                            style={styles.cancelButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginBottom: '10%'
    },
    fabText: {
        fontSize: 24,
        color: 'white'
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    dropdownContainer: {
        marginBottom: 20,
    },
    dropdownButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    dropdownButtonText: {
        fontSize: 16,
    },
    dropdownMenu: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    dropdownMenuItem: {
        padding: 10,
    },
    dropdownMenuText: {
        fontSize: 16,
    },
    homeworkItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    homeworkText: {
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#567BC2',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalView: {
        top: '24%',
        width: '80%', // Adjust the width to your preference
        padding: 20,  // Add some padding for the modal content
        backgroundColor: 'white',
        borderRadius: 10, // Rounded corners
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // For Android shadow
        alignSelf: 'center', // Center the modal horizontally
        justifyContent: 'center', // Center the content vertically
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'black',
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    addButton: {
        backgroundColor: '#567BC2',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        width: '48%',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        width: '48%',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    error: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default AddHomework;
