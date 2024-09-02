import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Modal, TextInput, Alert, Button } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../../Component/Config';

const Enquiry = () => {
    const [name, setName] = useState('');
    const [classes, setClasses] = useState('');
    const [section, setSection] = useState('');
    const [parentName, setParentName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [enquiries, setEnquiries] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [expandedIndex, setExpandedIndex] = useState(null);

    const fetchEnquiries = async (studid) => {
        try {
            const response = await fetch(`${url}/admin_enquiry_fetch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    enrollment_or_employee_id: studid,
                }),
            }); // Replace with your API URL
            const data = await response.json();
            console.log(data);
            const formattedEnquiries = data.data.map((enquiry, index) => ({
                id: `${index + 1}`,
                title: `Enquiry ${index + 1}`,
                submitDate: enquiry.date,
                studentName: enquiry.Name,
                class: enquiry.Class,
                section: enquiry.Section,
                contactNo: enquiry["Phone Number"],
                parentName: enquiry["Parent Name"],
                message: enquiry.Message,
                student: enquiry.Student_id,
                messageReply: enquiry.message_replied,
                messageby: enquiry.replied_by,
                messageon: enquiry.replied_on,
            }));
            setEnquiries(formattedEnquiries);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const fetchUserProfile = async () => {
        const userProfile = await AsyncStorage.getItem('userProfile');
        // console.log(userProfile);
        if (userProfile) {
            const parsedProfile = JSON.parse(userProfile);
            console.log(parsedProfile);
            fetchEnquiries(parsedProfile["enrollment_or_employee_id"]);
            setClasses(parsedProfile.Class);
            setSection(parsedProfile.section_or_department);
            setName(parsedProfile.Name);
            setParentName(parsedProfile.father_name);
            setPhoneNumber(parsedProfile.phone);
        }
    };

    const sendmessage = async () => {
        const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
        const userProfile = await AsyncStorage.getItem('userProfile');
        const parsedProfile = JSON.parse(userProfile);
        const studid = parsedProfile["enrollment_or_employee_id"];
        console.log(studid, currentDate, name, classes, section, parentName, phoneNumber, message,);
        try {
            const response = await fetch(`${url}/enquiry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: currentDate,
                    student_id: studid,
                    student_name: name,
                    class: classes,
                    section: section,
                    parent_name: parentName,
                    contact_number: phoneNumber,
                    message: message,
                }),
            });
            const object = await response.json();
            console.log(object);
            if (response.ok) {
                Alert.alert("Success", "Enquiry sent successfully!");
                setModalVisible(false); // Close the modal on success
                fetchEnquiries(studid); // Refresh the enquiries list
            } else {
                Alert.alert("Error", "Failed to send enquiry. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Error", "An error occurred. Please try again.");
        }
    };


    useEffect(() => {
        fetchUserProfile();
    }, []);

    const renderEnquiryItem = ({ item, index }) => {
        const isExpanded = expandedIndex === index;

        return (
            <View style={styles.enquiryItem}>
                <TouchableOpacity onPress={() => setExpandedIndex(isExpanded ? null : index)}>
                    {/* <Text style={styles.enquiryTitle}>{item.title}</Text> */}
                    <Text style={styles.detailText}>Student Name: {item.studentName}</Text>
                    <Text style={styles.messageText}>Message: {item.message}</Text>
                </TouchableOpacity>
                {isExpanded && (
                    <View style={styles.detailsContainer}>
                        <Text style={styles.dateText}>{item.id}</Text>
                        <Text style={styles.dateText}>Submit Date: {item.submitDate}</Text>
                        <Text style={styles.detailText}>Class: {item.class}</Text>
                        <Text style={styles.detailText}>Section: {item.section}</Text>
                        <Text style={styles.detailText}>Contact No: {item.contactNo}</Text>
                        <Text style={styles.detailText}>Parent Name: {item.parentName}</Text>
                        <View style={{ borderWidth: 1, borderRadius: 10, padding: 10, margin: 5, }}>
                            <Text style={styles.detailText}>Message Replied: {item.messageReply}</Text>
                            <Text style={styles.detailText}>Replied By: {item.messageby}</Text>
                            <Text style={styles.detailText}>Replied On: {item.messageon}</Text>
                        </View>

                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={enquiries}
                renderItem={renderEnquiryItem}
                keyExtractor={(item) => item.id.toString()} // Assuming each enquiry has a unique id
                contentContainerStyle={styles.listContainer}
            />

            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Send Message</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your message"
                        multiline
                        numberOfLines={4}
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity style={styles.button} onPress={sendmessage}>
                        <Text style={styles.buttonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContainer: {
        padding: wp('4%'),
    },
    enquiryItem: {
        backgroundColor: '#f9f9f9',
        padding: wp('4%'),
        marginVertical: hp('1%'),
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    enquiryText: {
        fontSize: wp('4%'),
    },
    boldText: {
        fontWeight: 'bold',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#585E97',
        width: wp('15%'),
        height: wp('15%'),
        borderRadius: wp('7.5%'),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    fabIcon: {
        color: 'white',
        fontSize: wp('10%'),
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: wp('6%'),
    },
    input: {
        width: wp('80%'),
        height: hp('20%'),
        borderColor: '#000',
        borderWidth: 1,
        padding: wp('2%'),
        fontSize: wp('4%'),
        borderRadius: 10,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#585E97',
        padding: wp('2%'),
        alignItems: 'center',
        borderRadius: 10,
        width: wp('50%'),
        marginTop: hp('2%'),
    },
    buttonText: {
        color: 'white',
        fontSize: wp('5%'),
    },
    enquiryTitle: {
        fontWeight: 'bold',
        fontSize: wp('5%'),
    },
    detailText: {
        fontSize: wp('4%'),
    },
    messageText: {
        fontSize: wp('4%'),
        fontStyle: 'italic',
    },
    detailsContainer: {
        marginTop: hp('1%'),
    },
    dateText: {
        fontSize: wp('3.5%'),
        // color: 'gray',
    },
    replyButton: {
        fontSize: wp('4%'),
        color: '#585E97',
        marginTop: hp('1%'),
    },
    replyContainer: {
        marginTop: hp('1%'),
    },
    replyInput: {
        width: '100%',
        borderColor: '#000',
        borderWidth: 1,
        padding: wp('2%'),
        fontSize: wp('4%'),
        borderRadius: 10,
        textAlignVertical: 'top',
    },
});

export default Enquiry;
