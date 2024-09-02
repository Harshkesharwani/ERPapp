import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Button } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as DocumentPicker from 'expo-document-picker';

const demoData = {
    1: ['Math', 'English', 'Hindi', 'Social Science'],
    2: ['Math', 'Science', 'English', 'Social Studies'],
    3: ['Math', 'Science', 'English', 'Social Studies', 'Computer Science'],
    11: {
        commerce: ['Accountancy', 'Business Studies', 'Economics', 'English'],
        maths: ['Math', 'Physics', 'Chemistry', 'English'],
        biology: ['Biology', 'Physics', 'Chemistry', 'English'],
        arts: ['History', 'Geography', 'Political Science', 'English'],
    },
    12: {
        commerce: ['Accountancy', 'Business Studies', 'Economics', 'English'],
        maths: ['Math', 'Physics', 'Chemistry', 'English'],
        biology: ['Biology', 'Physics', 'Chemistry', 'English'],
        arts: ['History', 'Geography', 'Political Science', 'English'],
    },
};

const examTypes = ['Final', 'Half Yearly', 'Unit Test'];

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

const Teacher_Result = ({ navigation }) => {
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedExamType, setSelectedExamType] = useState(null);
    const [showExamTypeDropdown, setShowExamTypeDropdown] = useState(false);
    const [showBranchDropdown, setShowBranchDropdown] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [studentId, setStudentId] = useState('');

    const handleClassChange = (value) => {
        const classNumber = parseInt(value.split(' ')[1]);
        setSelectedClass(classNumber);
        setSelectedExamType(null);
        setSelectedBranch(null);
        setSelectedSubject(null);
        setShowExamTypeDropdown(true);
        setShowBranchDropdown(classNumber === 11 || classNumber === 12);
    };

    const handleExamTypeChange = (value) => {
        setSelectedExamType(value);
    };

    const handleBranchChange = (branch) => {
        setSelectedBranch(branch);
        setSelectedSubject(null);
    };

    const handleSubjectChange = (subject) => {
        setSelectedSubject(subject);
    };

    const selectDoc = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                multiple: true
            });
            console.log(result);
        } catch (err) {
            console.log("Error selecting document: ", err);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.box1}>
                <Text style={styles.title}>Result Page</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Admin_EditResult')}>
                    <FontAwesome name="edit" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <Dropdown
                label="Select Class"
                options={Object.keys(demoData).map((key) => `Class ${key}`)}
                onSelect={handleClassChange}
            />
            {showBranchDropdown && (
                <Dropdown
                    label="Select Branch"
                    options={Object.keys(demoData[selectedClass])}
                    onSelect={handleBranchChange}
                />
            )}
            {showExamTypeDropdown && (
                <Dropdown
                    label="Select Exam Type"
                    options={examTypes}
                    onSelect={handleExamTypeChange}
                />
            )}
            {(selectedClass && !showBranchDropdown) && (
                <Dropdown
                    label="Select Subject"
                    options={demoData[selectedClass]}
                    onSelect={handleSubjectChange}
                />
            )}
            {(selectedClass && showBranchDropdown && selectedBranch) && (
                <Dropdown
                    label="Select Subject"
                    options={demoData[selectedClass][selectedBranch]}
                    onSelect={handleSubjectChange}
                />
            )}
            <TextInput
                style={styles.input}
                placeholder="Enter Student ID"
                value={studentId}
                onChangeText={setStudentId}
            />
            <View style={styles.documentPicker}>
                <Text
                    style={{
                        color: 'black',
                        fontSize: 28,
                        textAlign: 'center',
                        marginVertical: 40,
                    }}>
                    Upload Result Document
                </Text>
                <View style={{ marginHorizontal: 40 }}>
                    <Button title="Select Document" onPress={selectDoc} />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp('5%'),
    },
    title: {
        fontSize: wp('6%'),
        fontWeight: 'bold',
        marginVertical: hp('2%'),
    },
    box1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    documentPicker: {
        marginTop: hp('4%'),
    },
});

export default Teacher_Result;
