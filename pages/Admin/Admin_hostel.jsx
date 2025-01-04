import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { url } from '../../Component/Config';

const HostelRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHostelRequests();
    }, []);

    const fetchHostelRequests = async () => {
        try {
            const response = await fetch(`${url}/admin_hostel_applied_fetch`);
            const data = await response.json();
            setRequests(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching hostel requests:', error);
            setLoading(false);
        }
    };

    const HandleDecision = async (status, items) => {
        try {
            const response = await fetch(`${url}/hostel_decision_update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: status,
                    enrollment_or_employee_id: items.enrollment_or_employee_id,
                    building_name: items.building_name,
                    date_applied: items.date_applied,
                }),
            });

            if (response.ok) {
                const updatedRequests = requests.filter((request) => request.enrollment_or_employee_id !== items.enrollment_or_employee_id);
                setRequests(updatedRequests);
            }
        } catch (error) {
            console.error('Error updating request status:', error);
        }
    };


    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hostel Requests</Text>
            <FlatList
                data={requests}
                keyExtractor={(item) => item.enrollment_or_employee_id}
                renderItem={({ item }) => (
                    <View style={styles.requestItem}>
                        <View style={styles.requestDetails}>
                            <Text style={styles.requestText}>Name: {item.name}</Text>
                            <Text style={styles.requestText}>Building Name: {item.building_name}</Text>
                            <Text style={styles.requestText}>Enrollment ID: {item.enrollment_or_employee_id}</Text>
                            <Text style={styles.requestText}>Parent Name: {item.parent_name}</Text>
                            <Text style={styles.requestText}>Phone Number: {item.phone_number}</Text>
                            <Text style={styles.requestText}>Date Applied: {item.date_applied}</Text>
                            <Text style={styles.requestText}>Status: {item.status}</Text>

                        </View>
                        {item.status === 'pending' &&
                            <View style={styles.buttonsContainer}>
                                <TouchableOpacity style={styles.approveButton} onPress={() => HandleDecision("Approved", item)}>
                                    <Text style={styles.buttonText}>Approve</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.declineButton} onPress={() => HandleDecision("Declined", item)}>
                                    <Text style={styles.buttonText}>Decline</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    requestItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 10,
    },
    requestDetails: {
        marginBottom: 10,
    },
    requestText: {
        fontSize: 16,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    approveButton: {
        backgroundColor: '#567BC2',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    declineButton: {
        backgroundColor: '#FF3333',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default HostelRequests;
