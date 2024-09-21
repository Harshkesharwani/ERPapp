import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { url } from '../../Component/Config';

const Holiday = () => {
    const [holidays, setHolidays] = useState({ holidays: [] });

    const fetchHolidays = async () => {
        try {
            const response = await fetch(`${url}/holidays`,{
                method: 'POST',
            }); // Replace with your API endpoint
            const data = await response.json();
            // console.log(data)
            setHolidays(data);
        } catch (error) {
            console.error('Error fetching holidays:', error);
        }
    };

    useEffect(() => {
        fetchHolidays();
    }, []);

    const renderHolidayItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.holidayName}>{item.name}</Text>
            <View style={styles.detailsContainer}>
                <Text style={styles.dateText}>{item.date}</Text>
                <Text style={styles.dayOfWeek}>{item.dayOfWeek}</Text>
            </View>
        </View>
    );

    // Add a check to ensure holidays.holidays exists and is an array
    const months = holidays.holidays.length ? Array.from(new Set(holidays.holidays.map(item => item.month))) : [];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Holidays</Text>
            {months.map((month, index) => (
                <View key={index} style={styles.monthContainer}>
                    <Text style={styles.monthText}>{month}</Text>
                    <FlatList
                        data={holidays.holidays.filter(item => item.month === month)}
                        keyExtractor={(item) => item.date.toString()}
                        renderItem={renderHolidayItem}
                    />
                </View>
            ))}
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
        alignSelf: 'center'
    },
    holidayName: {
        fontSize: 18,
    },
    dayOfWeek: {
        fontSize: 18,
    },
});

export default Holiday;
