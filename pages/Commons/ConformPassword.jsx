import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const ConformPassword = ({ navigation }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSavePassword = () => {
        // Here you would typically send newPassword and confirmPassword to the backend to save the new password
        // For simplicity, let's navigate back to login after saving password
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Confirm Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter New Password"
                value={newPassword}
                onChangeText={text => setNewPassword(text)}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChangeText={text => setConfirmPassword(text)}
                secureTextEntry
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSavePassword}>
                <Text style={styles.saveButtonText}>Save Password</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: '#336EFF',
        width: '100%',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default ConformPassword;
