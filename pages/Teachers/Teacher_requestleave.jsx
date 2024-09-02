import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { url } from '../../Component/Config';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontAwesome } from '@expo/vector-icons';

const leaveTypes = ['Casual Leave', 'Sick Leave', 'Paid Leave'];

const pendingLeaves = [
    { id: 1, type: 'Casual Leave', startDate: '2024-06-01', endDate: '2024-06-02', status: 'Approved' },
    { id: 2, type: 'Sick Leave', startDate: '2024-06-05', endDate: '2024-06-06', status: 'Pending' },
];

const Teacher_requestleave = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [leaveType, setLeaveType] = useState(null);
    const [reason, setReason] = useState('');
    const [image, setImage] = useState(null);

    const onChangeStartDate = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setShowStartDatePicker(false);
        setStartDate(currentDate);
    };

    const onChangeEndDate = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setShowEndDatePicker(false);
        setEndDate(currentDate);
    };

    const handleSubmit = () => {
        alert('Leave request submitted!');
    };

    // const handleImageUpload = async () => {
    //     let result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //         allowsEditing: true,
    //         aspect: [4, 3],
    //         quality: 1,
    //     });

    //     if (!result.canceled) {
    //         setImage(result.uri);
    //     }
    // };

    return (
        <View style={styles.formContainer}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.datePickerButton}>
                <Text>{startDate.toDateString()}</Text>
            </TouchableOpacity>
            {showStartDatePicker && (
                <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={onChangeStartDate}
                />
            )}
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.datePickerButton}>
                <Text>{endDate.toDateString()}</Text>
            </TouchableOpacity>
            {showEndDatePicker && (
                <DateTimePicker
                    value={endDate}
                    mode="date"
                    display="default"
                    onChange={onChangeEndDate}
                />
            )}
            <Text style={styles.label}>Leave Type</Text>
            <Dropdown
                label="Select Leave Type"
                options={leaveTypes}
                onSelect={setLeaveType}
            />
            <Text style={styles.label}>Reason for Leave</Text>
            <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={8}
                onChangeText={setReason}
                value={reason}
            />
            {/* <TouchableOpacity onPress={handleImageUpload} style={styles.imageUploadButton}>
                <FontAwesome name="camera" size={24} color="black" />
                <Text style={styles.imageUploadButtonText}>Upload Image</Text>
            </TouchableOpacity> */}
            {image && <Image source={{ uri: image }} style={styles.uploadedImage} />}
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

const LeaveHistory = () => {
    return (
        <ScrollView style={styles.historyContainer}>
            {pendingLeaves.map((leave) => (
                <View key={leave.id} style={styles.historyItem}>
                    <Text style={styles.historyText}><Text style={styles.boldText}>Type:</Text> {leave.type}</Text>
                    <Text style={styles.historyText}><Text style={styles.boldText}>Start Date:</Text> {leave.startDate}</Text>
                    <Text style={styles.historyText}><Text style={styles.boldText}>End Date:</Text> {leave.endDate}</Text>
                    <Text style={styles.historyText}><Text style={styles.boldText}>Status:</Text> {leave.status}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const Leave = ({ navigation }) => {
    const [selectedTab, setSelectedTab] = useState('Leave Request');

    return (
        <View style={styles.container}>
            <View style={styles.tabContainer}>
                <TouchableOpacity onPress={() => setSelectedTab('Leave Request')} style={[styles.tabButton, selectedTab === 'Leave Request' && styles.activeTab]}>
                    <Text style={styles.tabButtonText}>Leave Request</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedTab('Leave History')} style={[styles.tabButton, selectedTab === 'Leave History' && styles.activeTab]}>
                    <Text style={styles.tabButtonText}>Leave History</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.contentContainer}>
                {selectedTab === 'Leave Request' && <LeaveRequestForm />}
                {selectedTab === 'Leave History' && <LeaveHistory />}
            </ScrollView>
        </View>
    );
};

const Dropdown = ({ label, options, onSelect }) => {
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleSelect = (option) => {
        setSelected(option);
        setVisible(false);
        onSelect(option);
    };

    return (
        <View style={styles.dropdown}>
            <Text>{label}</Text>
            <TouchableOpacity style={styles.dropdownButton} onPress={() => setVisible(!visible)}>
                <Text style={styles.dropdownButtonText}>{selected ? selected : 'Select'}</Text>
            </TouchableOpacity>
            {visible && (
                <View style={styles.dropdownOptions}>
                    {options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.dropdownOption}
                            onPress={() => handleSelect(option)}
                        >
                            <Text style={styles.dropdownOptionText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp('5%'),
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: hp('2%'),
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tabButton: {
        flex: 1,
        padding: wp('2.5%'),
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#007BFF',
    },
    tabButtonText: {
        fontSize: wp('4%'),
        color: '#007BFF',
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
    },
    formContainer: {
        padding: wp('5%'),
    },
    label: {
        fontSize: wp('4%'),
        marginBottom: hp('1%'),
    },
    datePickerButton: {
        padding: wp('2.5%'),
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: hp('2%'),
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: wp('2.5%'),
        marginBottom: hp('2%'),
    },
    imageUploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp('2.5%'),
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: hp('2%'),
    },
    imageUploadButtonText: {
        marginLeft: wp('2%'),
    },
    uploadedImage: {
        width: wp('80%'),
        height: hp('20%'),
        alignSelf: 'center',
        marginBottom: hp('2%'),
    },
    submitButton: {
        padding: wp('2.5%'),
        backgroundColor: '#567BC2',
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    historyContainer: {
        padding: wp('5%'),
    },
    historyItem: {
        padding: wp('2.5%'),
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: hp('2%'),
        backgroundColor: '#f9f9f9',
    },
    historyText: {
        fontSize: wp('4%'),
        marginBottom: hp('0.5%'),
    },
    boldText: {
        fontWeight: 'bold',
    },
    dropdown: {
        marginBottom: hp('2%'),
    },
    dropdownButton: {
        padding: wp('2.5%'),
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    dropdownButtonText: {
        textAlign: 'center',
    },
    dropdownOptions: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    dropdownOption: {
        padding: wp('2.5%'),
    },
    dropdownOptionText: {
        textAlign: 'center',
    },
});

export default Teacher_requestleave;
