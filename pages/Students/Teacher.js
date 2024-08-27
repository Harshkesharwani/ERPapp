import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../../Component/Config';

const Teacher = () => {
    const [teachers, setTeachers] = useState([]);
    // const [clasess, setClass] = useState('');
    // const [section, setSection] = useState('');

    const fetchTeachers = async (clasess, section) => {
        // console.log(clasess);

        try {
            const response = await fetch(`${url}/teachers_details`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        class: clasess,
                        section: section
                    })
                });
            // console.log(response);
            const data = await response.json();
            // console.log(data)
            setTeachers(data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const getUserProfile = async () => {
        try {
            const userProfile = await AsyncStorage.getItem('userProfile');
            if (userProfile !== null) {
                const parsedProfile = JSON.parse(userProfile);
                fetchTeachers(parsedProfile['Class'], parsedProfile['section_or_department']);
                // console.log(parsedProfile['Class']);
                // setSection();
                // console.log(parsedProfile['section_or_department']);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    useEffect(() => {
        fetchTeachers();
        getUserProfile();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardText}>Name: {item.Name}</Text>
            <Text style={styles.cardText}>Mobile No.: {item.Contact}</Text>
            <Text style={styles.cardText}>Email: {item.email}</Text>
            <Text style={styles.cardText}>Subject: {item.Subject}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Teacher</Text>
            <FlatList
                data={teachers.teachers}
                renderItem={renderItem}
                keyExtractor={item => item.Id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp('5%'),
        backgroundColor: '#fff',
    },
    title: {
        fontSize: wp('8%'),
        fontWeight: 'bold',
        marginBottom: hp('2%'),
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: wp('5%'),
        marginVertical: hp('1%'),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    cardText: {
        fontSize: wp('4%'),
        marginBottom: hp('0.5%'),
    },
});

export default Teacher;
