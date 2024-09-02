import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Button } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { url } from '../../Component/Config';

const Admin_Enquiry = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [sortOrder, setSortOrder] = useState('new');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [replyingIndex, setReplyingIndex] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const response = await fetch(`${url}/admin_enquiry_fetch`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        enrollment_or_employee_id: "admin"
                    })
                }
            ); // Replace with your API URL
            const data = await response.json();
            console.log(response)
            console.log(data);
            const formattedEnquiries = data.data.map((enquiry, index) => ({
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
            replied_by: "Admin",
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
                    {/* <Text style={styles.enquiryTitle}>{item.title}</Text> */}
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
            <FlatList
                data={enquiries}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderEnquiryItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp('5%'),
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 30,
        marginBottom: wp('2%'),
    },
    sortContainer: {
        marginBottom: wp('2%'),
        alignItems: 'flex-start',
    },
    dropdownButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: wp('2%'),
        backgroundColor: '#f9f9f9',
    },
    dropdownButtonText: {
        fontSize: 16,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginTop: wp('2%'),
        width: wp('30%'),
        backgroundColor: '#f9f9f9',
    },
    dropdownItem: {
        padding: wp('2%'),
    },
    itemContainer: {
        marginVertical: wp('2%'),
        borderWidth: 0.5,
        padding: wp('2%'),
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
    },
    enquiryTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    detailsContainer: {
        marginTop: wp('2%'),
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    detailText: {
        fontSize: 16,
        marginVertical: wp('0.5%'),
    },
    messageText: {
        fontSize: 16,
        marginTop: wp('1%'),
    },
    replyButton: {
        marginTop: wp('2%'),
        color: '#007BFF',
        textDecorationLine: 'underline',
    },
    replyContainer: {
        marginTop: wp('2%'),
    },
    replyInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: wp('2%'),
        marginBottom: wp('2%'),
    },
});

export default Admin_Enquiry;
