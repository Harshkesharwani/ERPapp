import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { url } from '../../Component/Config';

const Timetable = () => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const periods = ['1st Period', '2nd Period', '3rd Period', 'Lunch', '4th Period', '5th Period'];

    // Dummy data for subjects
    const subjects = {
        'Monday': ['Mathematics', 'Physics', 'Chemistry', 'Lunch', 'Biology', 'English'],
        'Tuesday': ['English', 'Chemistry', 'Physics', 'Lunch', 'Mathematics', 'Biology'],
        'Wednesday': ['Biology', 'English', 'Physics', 'Lunch', 'Mathematics', 'Chemistry'],
        'Thursday': ['Chemistry', 'Mathematics', 'English', 'Lunch', 'Physics', 'Biology'],
        'Friday': ['Physics', 'Biology', 'Mathematics', 'Lunch', 'Chemistry', 'English'],
        'Saturday': ['English', 'Mathematics', 'Biology', 'Lunch', 'Physics', 'Chemistry'],
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Time-Table</Text>
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
                            {periods.map((period, idx) => (
                                <Text key={idx} style={styles.cell}>{subjects[day][idx]}</Text>
                            ))}
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
        width: wp('28%'),
        borderRightWidth: 1,
        borderRightColor: '#ddd',
    },
    dayHeader: {
        width: wp('25%'),
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
        width: wp('28%'),
        borderRightWidth: 1,
        borderRightColor: '#ddd',
        backgroundColor: '#fff',
    },
    dayCell: {
        backgroundColor: '#f0f0f0',
        fontWeight: 'bold',
        width: wp('25%'),
    },
});

export default Timetable;


/// Alternative TimeTable
// import React from 'react';
// import { View, Text, StyleSheet, FlatList } from 'react-native';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


// const Timetable = () => {
//     const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//     // Dummy data for periods
//     const periods = [
//         { period: '1st Period', time: '9:00 - 10:00' },
//         { period: '2nd Period', time: '10:00 - 11:00' },
//         { period: '3rd Period', time: '11:00 - 12:00' },
//         { period: 'Lunch', time: '12:00 - 1:00' },
//         { period: '4th Period', time: '1:00 - 2:00' },
//         { period: '5th Period', time: '2:00 - 3:00' },
//     ];

//     // Dummy data for subjects and teachers
//     const subjects = {
//         'Monday': [
//             { subject: 'Mathematics', teacher: 'Mr. Smith' },
//             { subject: 'Physics', teacher: 'Ms. Johnson' },
//             { subject: 'Chemistry', teacher: 'Dr. Lee' },
//             { subject: 'Lunch', teacher: '' },
//             { subject: 'Biology', teacher: 'Dr. Brown' },
//             { subject: 'English', teacher: 'Mrs. Davis' },
//         ],
//         'Tuesday': [
//             { subject: 'English', teacher: 'Mrs. Davis' },
//             { subject: 'Chemistry', teacher: 'Dr. Lee' },
//             { subject: 'Physics', teacher: 'Ms. Johnson' },
//             { subject: 'Lunch', teacher: '' },
//             { subject: 'Mathematics', teacher: 'Mr. Smith' },
//             { subject: 'Biology', teacher: 'Dr. Brown' },
//         ],
//         'Wednesday': [
//             { subject: 'Biology', teacher: 'Dr. Brown' },
//             { subject: 'English', teacher: 'Mrs. Davis' },
//             { subject: 'Physics', teacher: 'Ms. Johnson' },
//             { subject: 'Lunch', teacher: '' },
//             { subject: 'Mathematics', teacher: 'Mr. Smith' },
//             { subject: 'Chemistry', teacher: 'Dr. Lee' },
//         ],
//         'Thursday': [
//             { subject: 'Chemistry', teacher: 'Dr. Lee' },
//             { subject: 'Mathematics', teacher: 'Mr. Smith' },
//             { subject: 'English', teacher: 'Mrs. Davis' },
//             { subject: 'Lunch', teacher: '' },
//             { subject: 'Physics', teacher: 'Ms. Johnson' },
//             { subject: 'Biology', teacher: 'Dr. Brown' },
//         ],
//         'Friday': [
//             { subject: 'Physics', teacher: 'Ms. Johnson' },
//             { subject: 'Biology', teacher: 'Dr. Brown' },
//             { subject: 'Mathematics', teacher: 'Mr. Smith' },
//             { subject: 'Lunch', teacher: '' },
//             { subject: 'Chemistry', teacher: 'Dr. Lee' },
//             { subject: 'English', teacher: 'Mrs. Davis' },
//         ],
//         'Saturday': [
//             { subject: 'English', teacher: 'Mrs. Davis' },
//             { subject: 'Mathematics', teacher: 'Mr. Smith' },
//             { subject: 'Biology', teacher: 'Dr. Brown' },
//             { subject: 'Lunch', teacher: '' },
//             { subject: 'Physics', teacher: 'Ms. Johnson' },
//             { subject: 'Chemistry', teacher: 'Dr. Lee' },
//         ],
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Time-Table</Text>
//             <FlatList
//                 data={daysOfWeek}
//                 keyExtractor={(item) => item}
//                 horizontal
//                 renderItem={({ item }) => (
//                     <View style={styles.dayContainer}>
//                         <Text style={styles.dayHeader}>{item}</Text>
//                         {periods.map((period, index) => {
//                             const subject = subjects[item][index] || { subject: 'N/A', teacher: 'N/A' };
//                             return (
//                                 <View key={index} style={styles.periodContainer}>
//                                     <Text style={styles.periodText}>{period.period} ({period.time})</Text>
//                                     <Text style={styles.subjectText}>
//                                         {subject.subject}
//                                         {subject.teacher ? ` - ${subject.teacher}` : ''}
//                                     </Text>
//                                 </View>
//                             );
//                         })}
//                     </View>
//                 )}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: wp('5%'),
//         backgroundColor: '#f8f8f8',
//     },
//     title: {
//         fontSize: 28,
//         fontWeight: 'bold',
//         marginBottom: wp('4%'),
//         textAlign: 'center',
//         color: '#333',
//     },
//     dayContainer: {
//         width: wp('80%'),
//         padding: wp('3%'),
//         marginHorizontal: wp('2%'),
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 5,
//         elevation: 3,
//     },
//     dayHeader: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginBottom: wp('2%'),
//         textAlign: 'center',
//         color: '#4a4a4a',
//     },
//     periodContainer: {
//         marginBottom: wp('2%'),
//         padding: wp('4%'),
//         marginVertical: hp('1%'),
//         backgroundColor: '#f9f9f9',
//         borderRadius: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.3,
//         shadowRadius: 2,
//         elevation: 2,
//     },
//     periodText: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#4a4a4a',
//     },
//     subjectText: {
//         fontSize: 16,
//         color: '#333',
//     },
// });

// export default Timetable;
