import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { url } from '../../Component/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Teacher_enquiry = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [sortOrder, setSortOrder] = useState('new');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [replyingIndex, setReplyingIndex] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [isClassDropdownVisible, setClassDropdownVisible] = useState(false);
    const [isSectionDropdownVisible, setSectionDropdownVisible] = useState(false);
    const [id, setid] = useState('');
    const [classes, setClasses] = useState([]); // Initialize classes state
    const [sections, setSections] = useState([]); // Initialize sections state
    const [loading, setLoading] = useState(false); // Optional: to handle loading states

    const fetchUserProfile = async () => {
        try {
            const userProfile = await AsyncStorage.getItem('userProfile');
            if (userProfile) {
                const parsedProfile = JSON.parse(userProfile);
                fetchClassSectionDetails(parsedProfile["enrollment_or_employee_id"]);
                setid(parsedProfile["enrollment_or_employee_id"]);
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };

    useEffect(() => {
        if (selectedClass) {
            filterSections(selectedClass);
        }
    }, [selectedClass]);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (selectedClass && selectedSection) {
            fetchEnquiries();
        }
    }, [selectedClass, selectedSection]);

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

    const fetchEnquiries = async () => {
        try {
            const response = await fetch(`${url}/teacher_enquiry_fetch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    enrollment_or_employee_id: id,
                    class: selectedClass,
                    section: selectedSection,
                }),
            });
            const data = await response.json();
            console.log(data);
            const formattedEnquiries = data.map((enquiry, index) => ({
                title: `Enquiry ${index + 1}`,
                submitDate: enquiry.date,
                studentName: enquiry.Name,
                class: enquiry.Class,
                section: enquiry.Section,
                contactNo: enquiry["Phone Number"],
                parentName: enquiry["Parent Name"],
                message: enquiry.Message,
                student: enquiry.Student_id,
            }));
            setEnquiries(formattedEnquiries);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const handleSort = (order) => {
        const sortedEnquiries = [...enquiries].sort((a, b) => {
            if (order === 'new') {
                return new Date(b.submitDate) - new Date(a.submitDate);
            } else {
                return new Date(a.submitDate) - new Date(b.submitDate);
            }
        });
        setSortOrder(order);
        setEnquiries(sortedEnquiries);
    };

    const handleReply = async (index) => {
        const enquiry = enquiries[index];
        const repliedOn = new Date().toISOString().split('T')[0];

        const postData = {
            date: enquiry.submitDate,
            student_id: enquiry.student,
            student_name: enquiry.studentName,
            class: enquiry.class,
            section: enquiry.section,
            parent_name: enquiry.parentName,
            contact_number: enquiry.contactNo,
            message: enquiry.message,
            replied_message: replyMessage,
            replied_by: "Teacher",
            replied_date: repliedOn
        };

        try {
            const response = await fetch(`${url}/admin_enquiry_replied`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });
            console.log(response);
            const x = await response.json();
            console.log(x);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            alert('Reply sent successfully!');
            setReplyingIndex(null);
            setReplyMessage('');
        } catch (error) {
            console.error('Failed to send reply:', error);
        }
    };

    const renderEnquiryItem = ({ item, index }) => {
        const isExpanded = expandedIndex === index;
        const isReplying = replyingIndex === index;

        return (
            <View style={styles.itemContainer}>
                <TouchableOpacity onPress={() => setExpandedIndex(isExpanded ? null : index)}>
                    <Text style={styles.detailText}>Student Name: {item.studentName}</Text>
                    <Text style={styles.messageText}>Message: {item.message}</Text>
                </TouchableOpacity>
                {isExpanded && (
                    <View style={styles.detailsContainer}>
                        <Text style={styles.dateText}>{item.student}</Text>
                        <Text style={styles.dateText}>Submit Date: {item.submitDate}</Text>
                        <Text style={styles.detailText}>Class: {item.class}</Text>
                        <Text style={styles.detailText}>Section: {item.section}</Text>
                        <Text style={styles.detailText}>Contact No: {item.contactNo}</Text>
                        <Text style={styles.detailText}>Parent Name: {item.parentName}</Text>
                        <TouchableOpacity onPress={() => setReplyingIndex(isReplying ? null : index)}>
                            <Text style={styles.replyButton}>Reply</Text>
                        </TouchableOpacity>
                        {isReplying && (
                            <View style={styles.replyContainer}>
                                <TextInput
                                    style={styles.replyInput}
                                    placeholder="Type your reply here..."
                                    value={replyMessage}
                                    onChangeText={setReplyMessage}
                                />
                                <Button title="Send" onPress={() => handleReply(index)} />
                            </View>
                        )}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enquiry List</Text>
            <View style={styles.sortContainer}>
                <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)} style={styles.dropdownButton}>
                    <Text style={styles.dropdownButtonText}>Sort by: {sortOrder === 'new' ? 'Newest' : 'Oldest'}</Text>
                </TouchableOpacity>
                {dropdownVisible && (
                    <View style={styles.dropdown}>
                        <TouchableOpacity onPress={() => { handleSort('new'); setDropdownVisible(false); }} style={styles.dropdownItem}>
                            <Text>Newest</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { handleSort('old'); setDropdownVisible(false); }} style={styles.dropdownItem}>
                            <Text>Oldest</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <TouchableOpacity
                onPress={() => setClassDropdownVisible(!isClassDropdownVisible)}
                style={styles.dropdownButton}
            >
                <Text style={styles.dropdownButtonText}>
                    {selectedClass ? `Selected Class: ${selectedClass}` : 'Select Class'}
                </Text>
            </TouchableOpacity>
            {isClassDropdownVisible && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={classes}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedClass(item.classNumber);
                                    setClassDropdownVisible(false);
                                    setSections(item.sections); // Set sections directly based on class
                                }}
                                style={styles.dropdownItem}
                            >
                                <Text>{item.classNumber}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.classNumber.toString()}
                    />
                </View>
            )}

            <TouchableOpacity
                onPress={() => setSectionDropdownVisible(!isSectionDropdownVisible)}
                style={styles.dropdownButton}
                disabled={!selectedClass} // Disable until class is selected
            >
                <Text style={styles.dropdownButtonText}>
                    {selectedSection ? `Selected Section: ${selectedSection}` : 'Select Section'}
                </Text>
            </TouchableOpacity>
            {isSectionDropdownVisible && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={sections}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedSection(item.section_name);
                                    setSectionDropdownVisible(false);
                                }}
                                style={styles.dropdownItem}
                            >
                                <Text>{item.section_name}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.section_name}
                    />
                </View>
            )}

            <FlatList
                data={enquiries}
                renderItem={renderEnquiryItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        paddingHorizontal: wp('5%'),
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sortContainer: {
        marginBottom: 10,
    },
    dropdownButton: {
        padding: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
        marginBottom: 5,
    },
    dropdownButtonText: {
        fontSize: 16,
    },
    dropdown: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    dropdownItem: {
        padding: 10,
    },
    itemContainer: {
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    detailsContainer: {
        marginTop: 10,
    },
    dateText: {
        fontSize: 14,
        color: '#555',
    },
    detailText: {
        fontSize: 16,
        marginBottom: 5,
    },
    messageText: {
        fontSize: 16,
        marginBottom: 5,
    },
    replyButton: {
        fontSize: 16,
        color: '#007BFF',
        marginTop: 10,
    },
    replyContainer: {
        marginTop: 10,
    },
    replyInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
});

export default Teacher_enquiry;
