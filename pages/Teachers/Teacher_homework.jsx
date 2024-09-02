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
    Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { url } from '../../Component/Config';

const AddHomework = () => {
    const [homeworkList, setHomeworkList] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
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
        if (selectedClass && selectedSection) {
            fetchHomeworkList();
        }
    }, [selectedClass, selectedSection]);

    const fetchUserProfile = async () => {
        try {
            const userProfile = await AsyncStorage.getItem('userProfile');
            if (userProfile) {
                const parsedProfile = JSON.parse(userProfile);
                fetchClassAndSection(parsedProfile["Employee ID"]);
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
            setClasses(data.class);
            setSections(data.section);
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
            setSelectedClass(item);
            setDropdownOpen('');
        } else {
            setSelectedSection(item);
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
            <Text style={styles.title}>Homework List</Text>
            <View style={styles.dropdownContainer}>
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => toggleDropdown('class')}
                >
                    <Text style={styles.dropdownButtonText}>
                        Class: {selectedClass || 'Select Class'}
                    </Text>
                </TouchableOpacity>
                {dropdownOpen === 'class' && (
                    <View style={styles.dropdownMenu}>
                        {classes.map((classItem) => (
                            <TouchableOpacity
                                key={classItem}
                                style={styles.dropdownMenuItem}
                                onPress={() => selectItem(classItem, 'class')}
                            >
                                <Text style={styles.dropdownMenuText}>{classItem}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => toggleDropdown('section')}
                >
                    <Text style={styles.dropdownButtonText}>
                        Section: {selectedSection || 'Select Section'}
                    </Text>
                </TouchableOpacity>
                {dropdownOpen === 'section' && (
                    <View style={styles.dropdownMenu}>
                        {sections.map((sectionItem) => (
                            <TouchableOpacity
                                key={sectionItem}
                                style={styles.dropdownMenuItem}
                                onPress={() => selectItem(sectionItem, 'section')}
                            >
                                <Text style={styles.dropdownMenuText}>{sectionItem}</Text>
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
                <MaterialIcons name="add" size={24} color="white" />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
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
                        style={styles.input}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text>{`Date: ${newHomework.date.toLocaleDateString()}`}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={newHomework.date}
                            mode='date'
                            display='default'
                            onChange={onDateChange}
                        />
                    )}
                    <TouchableHighlight
                        style={styles.addButton}
                        onPress={() => {
                            if (newHomework.id) {
                                handleEditHomework();
                            } else {
                                handleAddHomework();
                            }
                        }}
                    >
                        <Text style={styles.addButtonText}>
                            {newHomework.id ? 'Update Homework' : 'Add Homework'}
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.cancelButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableHighlight>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 20,
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
        backgroundColor: '#2196F3',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
    },
    input: {
        width: '80%',
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    addButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
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
