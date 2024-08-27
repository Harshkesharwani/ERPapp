import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { url } from '../../Component/Config';

const ForgetPassword = ({ navigation }) => {
    const [userId, setUserId] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const handleSubmit = () => {
        // Here you would typically send the user ID to the backend to initiate OTP generation
        // For simplicity, let's directly open the OTP modal
        setModalVisible(true);
    };

    const handleModalSubmit = () => {
        // Here you would verify OTP and proceed to the next step (e.g., ConformPassword)
        // For simplicity, let's navigate directly to ConformPassword page
        setModalVisible(false);
        navigation.navigate('ConfirmPassword');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forget Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter ID"
                value={userId}
                onChangeText={text => setUserId(text)}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>

            {/* Modal for OTP */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Enter OTP</Text>
                        <TextInput style={styles.modalInput} placeholder="Enter OTP" />
                        <TouchableOpacity style={styles.modalSubmitButton} onPress={handleModalSubmit}>
                            <Text style={styles.modalSubmitButtonText}>Submit OTP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    submitButton: {
        backgroundColor: '#336EFF',
        width: '100%',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
    },
    // Modal styles
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalInput: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    modalSubmitButton: {
        backgroundColor: '#336EFF',
        width: '100%',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalSubmitButtonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default ForgetPassword;
