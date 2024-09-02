import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const HelpAndSupport = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        // Add your logic to handle form submission (e.g., API call)
        // For now, we'll just log the data to the console
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Message:', message);

        // Reset fields after successful submission
        setName('');
        setEmail('');
        setMessage('');

        // Show success message
        alert("Support request submitted successfully!");
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Help and Support</Text>

            <Text style={styles.sectionTitle}>Common Issues</Text>
            <View style={styles.commonIssues}>
                <Text style={styles.issueText}>1. How to reset my password?</Text>
                <Text style={styles.issueText}>2. How to update my profile information?</Text>
                <Text style={styles.issueText}>3. How to view my grades?</Text>
            </View>

            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactInfo}>
                <Text style={styles.contactText}>Email: support@schoolerp.com</Text>
                <Text style={styles.contactText}>Phone: +1 234 567 890</Text>
                <Text style={styles.contactText}>Address: 123 School St, Education City, EC 12345</Text>
            </View>

            <Text style={styles.sectionTitle}>Submit a Support Request</Text>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Your Name"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Your Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Your Message"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
        alignSelf: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    commonIssues: {
        marginBottom: 20,
    },
    issueText: {
        fontSize: 16,
        marginBottom: 5,
    },
    contactInfo: {
        marginBottom: 20,
    },
    contactText: {
        fontSize: 16,
        marginBottom: 5,
    },
    form: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: 'white',
        width: '100%',
        height: 45,
        marginBottom: 15,
        borderRadius: 8,
        borderColor: '#4C4C4F',
        borderWidth: 1,
        paddingHorizontal: 10,
    },
    submitButton: {
        backgroundColor: '#336EFF',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default HelpAndSupport;
