import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Modal,
    TouchableHighlight,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { url } from '../../Component/Config';

const Teacher_Examination = () => {
    const [examinationList, setExaminationList] = useState([
        { id: '1', class: '10', section: 'A', examType: 'Final' },
        { id: '2', class: '9', section: 'B', examType: 'Midyear' },
    ]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newExamination, setNewExamination] = useState({ class: '', section: '', examType: '' });

    const handleAddExamination = () => {
        setExaminationList([
            ...examinationList,
            { id: (examinationList.length + 1).toString(), ...newExamination },
        ]);
        setModalVisible(false);
        setNewExamination({ class: '', section: '', examType: '' });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Examination List</Text>
            <FlatList
                data={examinationList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.examinationItem}>
                        <Text style={styles.examinationText}>
                            Class: {item.class}, Section: {item.section}, Exam Type: {item.examType}
                        </Text>
                    </View>
                )}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
            >
                <MaterialIcons name="add" size={24} color="white" />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Add Examination</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Class"
                        value={newExamination.class}
                        onChangeText={(text) => setNewExamination({ ...newExamination, class: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Section"
                        value={newExamination.section}
                        onChangeText={(text) => setNewExamination({ ...newExamination, section: text })}
                    />
                    <View style={styles.dropdownContainer}>
                        <Text style={styles.dropdownLabel}>Exam Type</Text>
                        <View style={styles.dropdown}>
                            <TouchableOpacity
                                style={styles.dropdownOption}
                                onPress={() => setNewExamination({ ...newExamination, examType: 'Final' })}
                            >
                                <Text style={styles.dropdownOptionText}>Final</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.dropdownOption}
                                onPress={() => setNewExamination({ ...newExamination, examType: 'Midyear' })}
                            >
                                <Text style={styles.dropdownOptionText}>Midyear</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.dropdownOption}
                                onPress={() => setNewExamination({ ...newExamination, examType: 'Quarterly' })}
                            >
                                <Text style={styles.dropdownOptionText}>Quarterly</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableHighlight
                        style={styles.addButton}
                        onPress={handleAddExamination}
                    >
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.cancelButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableHighlight>
                </View>
            </Modal>
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
        alignSelf: 'center',
    },
    examinationItem: {
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 10,
        elevation: 3,
    },
    examinationText: {
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#336EFF',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
    },
    dropdownContainer: {
        width: '100%',
        marginBottom: 10,
    },
    dropdownLabel: {
        fontSize: 16,
        marginBottom: 5,
    },
    dropdown: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
    },
    dropdownOption: {
        paddingVertical: 10,
    },
    dropdownOptionText: {
        fontSize: 16,
    },
    addButton: {
        backgroundColor: '#336EFF',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Teacher_Examination;
