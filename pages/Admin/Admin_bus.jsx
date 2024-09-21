import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { url } from '../../Component/Config';

const BusRequests = () => {
  const demoRequests = [
    { id: 1, name: 'John Doe', destination: 'Downtown' },
    { id: 2, name: 'Jane Smith', destination: 'Uptown' },
    { id: 3, name: 'Alice Johnson', destination: 'Suburb' },
  ];

  const [requests, setRequests] = useState(demoRequests);

  const handleApprove = (requestId) => {
    // Filter out the approved request from the list
    const updatedRequests = requests.filter((request) => request.id !== requestId);
    setRequests(updatedRequests);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text style={styles.requestText}>{item.name} - {item.destination}</Text>
            <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(item.id)}>
              <Text style={styles.approveButtonText}>Approve</Text>
            </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  requestText: {
    fontSize: 16,
  },
  approveButton: {
    backgroundColor: '#567BC2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  approveButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default BusRequests;
