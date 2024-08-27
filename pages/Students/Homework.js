import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../../Component/Config';

const Homework = () => {
    const [homework, setHomework] = useState([]);
    const [currentDate, setCurrentDate] = useState('');
    const [clasess, setClass] = useState('');
    const [section, setSection] = useState('');

    const getUserProfile = async () => {
        try {
            const userProfile = await AsyncStorage.getItem('userProfile');
            if (userProfile !== null) {
                const parsedProfile = JSON.parse(userProfile);
                setClass(parsedProfile['Class']);
                // console.log(parsedProfile['Class']);
                setSection(parsedProfile['section_or_department']);
                // console.log(parsedProfile['section_or_department']);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    useEffect(() => {
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        setCurrentDate(formattedDate);
        fetchHomework(formattedDate);
        getUserProfile();
    }, []);

    const fetchHomework = async (date) => {
        console.log(clasess)
        try {
            const response = await fetch(`${url}/homework`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    class: clasess,
                    section: section,
                    date: date,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // console.log(data)
                setHomework(data["Home Work"]);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching homework:', error);
            alert('Error fetching homework: ' + error.message);
        }
    };

    const renderHomeworkItem = ({ item }) => (
        <View style={styles.homeworkItem}>
            <Text style={styles.subjectText}>{item.Subject}</Text>
            <Text style={styles.dateText}>{item.Date}</Text>
            <Text style={styles.homeworkText}>{item.Homework}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Homework</Text>
            <FlatList
                data={homework}
                keyExtractor={(item) => item.Date + item.Subject}
                renderItem={renderHomeworkItem}
                contentContainerStyle={styles.homeworkList}
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
        marginVertical: wp('2%'),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    homeworkList: {
        marginTop: hp('2%'),
    },
    homeworkItem: {
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
    subjectText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    dateText: {
        fontSize: 16,
        marginVertical: hp('0.5%'),
    },
    homeworkText: {
        fontSize: 18,
    },
});

export default Homework;
