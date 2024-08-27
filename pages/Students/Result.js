import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { url } from '../../Component/Config';

const Result = () => {
    const [selectedExamType, setSelectedExamType] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [isExamTypeVisible, setIsExamTypeVisible] = useState(false);
    const [isClassVisible, setIsClassVisible] = useState(false);
    const [results, setResults] = useState(null);

    const examTypes = ['Half Yearly', 'Quarterly', 'final'];
    const classes = ['10', '12'];

    const fetchResults = async (examType, studentClass) => {
        try {
            const response = await fetch(`${url}/results`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "student_id": "stu001",
                    "student_name": "Ram",
                    "class": studentClass,
                    "exam_name": examType
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setResults(data.Results || {});
        } catch (error) {
            console.error('Error fetching results:', error);
            alert('Error fetching results: ' + error.message);
        }
    };

    const handleExamTypeSelect = (examType) => {
        setSelectedExamType(examType);
        setIsExamTypeVisible(false);
        if (selectedClass) {
            fetchResults(examType, selectedClass);
        }
    };

    const handleClassSelect = (cls) => {
        setSelectedClass(cls);
        setIsClassVisible(false);
        if (selectedExamType) {
            fetchResults(selectedExamType, cls);
        }
    };

    const renderResults = () => {
        if (results) {
            return (
                <View style={styles.resultsContainer}>
                    <Text style={styles.resultText}>Results for {selectedExamType} - Class {selectedClass}</Text>
                    {Object.entries(results).map(([subject, marks]) => (
                        <Text key={subject} style={styles.subjectText}>{subject}: {marks}</Text>
                    ))}
                </View>
            );
        }
        return <Text style={styles.noDataText}>Please select both exam type and class.</Text>;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Result</Text>

            <TouchableOpacity style={styles.dropdown} onPress={() => setIsExamTypeVisible(!isExamTypeVisible)}>
                <Text style={styles.dropdownText}>
                    {selectedExamType ? selectedExamType : 'Select Exam Type'}
                </Text>
            </TouchableOpacity>
            {isExamTypeVisible && (
                <View style={styles.dropdownList}>
                    {examTypes.map((type, index) => (
                        <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => handleExamTypeSelect(type)}>
                            <Text style={styles.dropdownItemText}>{type}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <TouchableOpacity style={styles.dropdown} onPress={() => setIsClassVisible(!isClassVisible)}>
                <Text style={styles.dropdownText}>
                    {selectedClass ? selectedClass : 'Select Class'}
                </Text>
            </TouchableOpacity>
            {isClassVisible && (
                <View style={styles.dropdownList}>
                    {classes.map((cls, index) => (
                        <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => handleClassSelect(cls)}>
                            <Text style={styles.dropdownItemText}>{cls}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            {renderResults()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp('5%'),
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 30,
        margin: wp('2%'),
    },
    dropdown: {
        height: 50,
        width: wp('90%'),
        borderColor: '#ccc',
        borderWidth: 1,
        justifyContent: 'center',
        marginVertical: hp('1%'),
        paddingHorizontal: wp('3%'),
        borderRadius: 5,
    },
    dropdownText: {
        fontSize: 18,
        color: '#000',
    },
    dropdownList: {
        width: wp('90%'),
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginTop: hp('1%'),
    },
    dropdownItem: {
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('3%'),
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    dropdownItemText: {
        fontSize: 18,
        color: '#000',
    },
    resultsContainer: {
        marginTop: hp('3%'),
        padding: wp('4%'),
        marginVertical: hp('1%'),
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    },
    resultText: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    subjectText: {
        fontSize: 18,
        marginVertical: hp('0.5%'),
    },
    totalText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: hp('2%'),
    },
    noDataText: {
        fontSize: 18,
        color: 'red',
        marginTop: hp('2%'),
    },
});

export default Result;
