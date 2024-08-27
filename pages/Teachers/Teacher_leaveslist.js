import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { url } from '../../Component/Config';

const TeacherLeavelist = () => {
    const [leaveData, setLeaves] = useState({ leaves: [] });

    const fetchLeaves = async () => {
        try {
            const response = await fetch(`${url}/leaves`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    student_id: 'STU001'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setLeaves(data);
        } catch (error) {
            console.error('Error fetching leaves:', error);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const renderLeaveItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.type}>{item.type}</Text>
            <View style={styles.detailsContainer}>
                <Text style={styles.dateText}>{item.date} {item.month}</Text>
                <Text style={styles.dayOfWeek}>{item.dayOfWeek}</Text>
            </View>
        </View>
    );

    const years = leaveData.leaves.length ? Array.from(new Set(leaveData.leaves.map(item => item.year))) : [];
    const getMonthsForYear = (year) => Array.from(new Set(leaveData.leaves.filter(item => item.year === year).map(item => item.month)));

    return (
        <ScrollView style={styles.container}>
            {/* <Text style={styles.title}>Leaves</Text> */}
            {years.map((year, yearIndex) => (
                <View key={yearIndex} style={styles.yearContainer}>
                    {getMonthsForYear(year).map((month, monthIndex) => (
                        <View key={monthIndex} style={styles.monthContainer}>
                            <Text style={styles.monthText}>{month} {year}</Text>
                            <FlatList
                                data={leaveData.leaves.filter(item => item.year === year && item.month === month)}
                                keyExtractor={(item) => `${item.year}-${item.month}-${item.date}`}
                                renderItem={renderLeaveItem}
                            />
                        </View>
                    ))}
                </View>
            ))}
        </ScrollView>
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
    yearContainer: {
        marginBottom: wp('6%'),
    },
    yearText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    monthContainer: {
        marginBottom: wp('4%'),
    },
    monthText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: wp('2%'),
        borderWidth: 0.5,
        padding: wp('2%'),
        borderRadius: 10,
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    detailsContainer: {
        alignItems: 'center',
        alignSelf: 'center',
    },
    type: {
        fontSize: 18,
    },
    dayOfWeek: {
        fontSize: 18,
    },
});

export default TeacherLeavelist;
