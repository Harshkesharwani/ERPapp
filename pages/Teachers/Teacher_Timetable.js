import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { url } from '../../Component/Config';

const Teacher_timetable = () => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const periods = ['1st Period', '2nd Period', '3rd Period', 'Lunch', '4th Period', '5th Period'];

    // Dummy data for subjects and class names
    const subjects = {
        'Monday': [
            { subject: 'Mathematics', class: 'Class 11 Commerce' },
            { subject: 'Physics', class: 'Class 11 Maths' },
            { subject: 'Chemistry', class: 'Class 11 Biology' },
            { subject: 'Lunch', class: '' },
            { subject: 'Biology', class: 'Class 11 Arts' },
            { subject: 'English', class: 'Class 11 Maths' },
        ],
        'Tuesday': [
            { subject: 'English', class: 'Class 11 Arts' },
            { subject: 'Chemistry', class: 'Class 11 Commerce' },
            { subject: 'Physics', class: 'Class 11 Maths' },
            { subject: 'Lunch', class: '' },
            { subject: 'Mathematics', class: 'Class 11 Biology' },
            { subject: 'Biology', class: 'Class 11 Maths' },
        ],
        'Wednesday': [
            { subject: 'Biology', class: 'Class 11 Arts' },
            { subject: 'English', class: 'Class 11 Maths' },
            { subject: 'Physics', class: 'Class 11 Maths' },
            { subject: 'Lunch', class: '' },
            { subject: 'Mathematics', class: 'Class 11 Commerce' },
            { subject: 'Chemistry', class: 'Class 11 Biology' },
        ],
        'Thursday': [
            { subject: 'Chemistry', class: 'Class 11 Commerce' },
            { subject: 'Mathematics', class: 'Class 11 Arts' },
            { subject: 'English', class: 'Class 11 Maths' },
            { subject: 'Lunch', class: '' },
            { subject: 'Physics', class: 'Class 11 Biology' },
            { subject: 'Biology', class: 'Class 11 Maths' },
        ],
        'Friday': [
            { subject: 'Physics', class: 'Class 11 Maths' },
            { subject: 'Biology', class: 'Class 11 Arts' },
            { subject: 'Mathematics', class: 'Class 11 Commerce' },
            { subject: 'Lunch', class: '' },
            { subject: 'Chemistry', class: 'Class 11 Biology' },
            { subject: 'English', class: 'Class 11 Maths' },
        ],
        'Saturday': [
            { subject: 'English', class: 'Class 11 Arts' },
            { subject: 'Mathematics', class: 'Class 11 Commerce' },
            { subject: 'Biology', class: 'Class 11 Arts' },
            { subject: 'Lunch', class: '' },
            { subject: 'Physics', class: 'Class 11 Maths' },
            { subject: 'Chemistry', class: 'Class 11 Biology' },
        ],
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Weekly Time-Table</Text>
            <ScrollView horizontal={true}>
                <View>
                    <View style={styles.headerRow}>
                        <Text style={[styles.headerCell, styles.dayHeader]}>Days</Text>
                        {periods.map((period, index) => (
                            <Text key={index} style={styles.headerCell}>{period}</Text>
                        ))}
                    </View>
                    {daysOfWeek.map((day, index) => (
                        <View key={index} style={styles.row}>
                            <Text style={[styles.cell, styles.dayCell]}>{day}</Text>
                            {periods.map((period, idx) => {
                                const { subject, class: className } = subjects[day][idx];
                                return (
                                    <View key={idx} style={styles.periodContainer}>
                                        {/* <Text style={styles.periodText}>{period}</Text> */}
                                        <Text style={styles.subjectText}>{subject}</Text>
                                        <Text style={styles.classText}>{className}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp('5%'),
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: wp('4%'),
        textAlign: 'center',
        color: '#333',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerCell: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: wp('3%'),
        textAlign: 'center',
        width: wp('35%'),
        borderRightWidth: 1,
        borderRightColor: '#ddd',
    },
    dayHeader: {
        width: wp('30%'),
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    cell: {
        fontSize: 16,
        padding: wp('3%'),
        textAlign: 'center',
        width: wp('30%'),
        borderRightWidth: 1,
        borderRightColor: '#ddd',
        backgroundColor: '#fff',
    },
    dayCell: {
        backgroundColor: '#f0f0f0',
        fontWeight: 'bold',
        width: wp('30%'),
    },
    periodContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: wp('2%'),
    },
    periodText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: wp('1%'),
    },
    subjectText: {
        fontSize: 14,
        color: '#333',
    },
    classText: {
        fontSize: 12,
        color: '#666',
    },
});

export default Teacher_timetable;
