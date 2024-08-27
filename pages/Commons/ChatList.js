import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const ChatList = ({ navigation }) => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        // Mock fetch function, replace with actual API call
        const fetchChats = async () => {
            const data = [
                { id: '1', name: 'Alice', lastMessage: 'Hi!', timestamp: '2024-06-28T14:48:00.000Z' },
                { id: '2', name: 'Bob', lastMessage: 'Hello!', timestamp: '2024-06-28T14:50:00.000Z' },
                { id: '3', name: 'Charlie', lastMessage: 'Hey there!', timestamp: '2024-06-28T14:52:00.000Z' },
            ];
            // Sort chats by timestamp, most recent first
            const sortedChats = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setChats(sortedChats);
        };
        fetchChats();
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('ChatDetail', { chat: item })}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.message}>{item.lastMessage}</Text>
            <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleTimeString()}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={chats}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    message: {
        fontSize: 16,
        color: '#555',
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
    },
});

export default ChatList;
