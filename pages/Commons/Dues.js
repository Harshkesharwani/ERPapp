import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../../Component/Config';

const Dues = () => {
    const [duesData, setDuesData] = useState([]);

    const getUserProfile = async () => {
        try {
            const userProfile = await AsyncStorage.getItem('userProfile');
            if (userProfile !== null) {
                const parsedProfile = JSON.parse(userProfile);
                fetchDuesData(parsedProfile["enrollment_or_employee_id"]);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };
    useEffect(() => {
        getUserProfile();
    }, []);

    const fetchDuesData = async (student_id) => {
        try {
            const response = await fetch(`${url}/dues`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    student_id: student_id,
                }),
            });

            const data = await response.json();
            console.log(data)
            if (data.Dues) {
                setDuesData(data.Dues);
            } else {
                console.error('Error fetching dues data:', data.error);
            }
        } catch (error) {
            console.error('Error fetching dues data:', error);
        }
    };

    const renderDuesItem = ({ item }) => (
        <View style={styles.duesItem}>
            <View style={styles.duesInfo}>
                <Text style={styles.duesTitle}>{item.title}</Text>
            </View>
            <TouchableOpacity style={styles.payButton}>
                <Text style={styles.payButtonText}>Pay:  <Text style={styles.duesAmount}>₹ {item.amount}</Text></Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Dues</Text>
            <FlatList
                data={duesData}
                renderItem={renderDuesItem}
                keyExtractor={(item, index) => index.toString()}
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
    text: {
        fontSize: 30,
        marginBottom: wp('4%'),
    },
    duesItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        paddingVertical: wp('3%'),
        borderRadius: 10,
        paddingHorizontal: wp('5%'),
        marginVertical: wp('2%')
    },
    duesInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    duesTitle: {
        fontSize: 18,
    },
    duesAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: wp('3%'),
    },
    payButton: {
        backgroundColor: '#567BC2',
        borderRadius: 5,
        paddingVertical: wp('2%'),
        paddingHorizontal: wp('4%'),
    },
    payButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default Dues;
