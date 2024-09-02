import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { url } from '../../Component/Config';

const LeaveRequestList = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    const fetchLeaveRequests = async () => {
        const dates = new Date().toISOString().split('T')[0];
        // console.log(dates)
        try {
            const response = await fetch(`${url}/admin_leaves_fetch`, {
                method: 'POST', // Adjust the method as required by your API
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date: dates
                })
            });
            // console.log(response);
            const data = await response.json();
            // console.log(data)
            setLeaveRequests(data.leaves);
        } catch (error) {
            console.error('Error fetching leave requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (statuses, item) => {
        // console.log(statuses)
        try {
            const response = await fetch(`${url}/admin_leaves_update`, {
                method: 'POST', // Adjust the method as required by your API
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: item.Id,
                    from_date: item.from_date,
                    to_date: item.to_date,
                    status: statuses
                })
            });
            // console.log(response);
            if (response.ok) {
                fetchLeaveRequests(); // Refresh the list after approval
            } else {
                console.log(`Failed to Appled action`)
            }
        } catch (error) {
            console.error('Error approving leave:', error);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.name}>ID: {item.Id}</Text>
            <Text style={styles.text}>Type: {item.type}</Text>
            <Text style={styles.text}>From: {item.from_date}</Text>
            <Text style={styles.text}>To: {item.to_date}</Text>
            <Text style={styles.text}>Status: {item.status}</Text>
            {item.status === 'pending' &&
                <View style={styles.buttonContainer}>
                    <Button title="Approve" onPress={() => handleAction("Approved", item)} />
                    <Button title="Decline" color="red" onPress={() => handleAction("Declined", item)} />
                </View>
            }
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={leaveRequests}
                renderItem={renderItem}
                keyExtractor={(item) => item.Id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    item: {
        padding: 20,
        marginVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 16,
        marginVertical: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LeaveRequestList;
