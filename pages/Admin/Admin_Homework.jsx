import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, TextInput, Button } from 'react-native';
import { url } from '../../Component/Config';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const Dropdown = ({ label, options, selectedValue, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.dropdown}>
        <Text style={styles.dropdownLabel}>{label}: {selectedValue || 'Select'}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownOptions}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => {
                onValueChange(option);
                setIsOpen(false);
              }}
              style={styles.dropdownOption}
            >
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const HomeworkList = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [homeworkData, setHomeworkData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [formData, setFormData] = useState({
    class: '',
    section: '',
    date: '',
    subject: '',
    homework: '',
  });
  const [editData, setEditData] = useState(null);

  const fetchHomeworkData = async () => {
    const dates = new Date().toISOString().split('T')[0];
    if (!selectedClass || !selectedSection) return;

    setLoading(true);

    const response = await fetch(`${url}/admin_homework_fetch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        class: selectedClass,
        section: selectedSection,
        date: dates,
      }),
    });

    const data = await response.json();
    console.log(data)
    setHomeworkData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHomeworkData();
  }, [selectedClass, selectedSection]);

  const handleAddHomework = async () => {
    const response = await fetch(`${url}/admin_homework_create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    console.log(response)
    const data = await response.json();
    console.log(data)
    if (response.ok) {
      fetchHomeworkData();
      setModalVisible1(false);
    }
  };

  const handleEditHomework = async () => {
    console.log(editData);
    const response = await fetch(`${url}/admin_homework_update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editData),
    });
    if (response.ok) {
      fetchHomeworkData();
      setModalVisible2(false);
      // setEditData(null);
    }
  };

  const handleDeleteHomework = async (item) => {
    console.log(item)
    const response = await fetch(`${url}/admin_homework_delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    // console.log(response)
    if (response.ok) {
      fetchHomeworkData();
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setEditData(item);
        setModalVisible2(true);
      }}
    >
      <Text style={styles.text}><Text style={styles.label}>Subject:</Text> {item.subject}</Text>
      <Text style={styles.text}><Text style={styles.label}>Class:</Text> {item.class}</Text>
      <Text style={styles.text}><Text style={styles.label}>Section:</Text> {item.section}</Text>
      <Text style={styles.text}><Text style={styles.label}>Date:</Text> {item.date}</Text>
      <Text style={styles.text}><Text style={styles.label}>Homework:</Text> {item.homework}</Text>
      <TouchableOpacity onPress={() => handleDeleteHomework(item)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Filters:</Text>
      <Dropdown
        label="Class"
        options={['9', '10', '11', '12']}
        selectedValue={selectedClass}
        onValueChange={setSelectedClass}
      />
      <Dropdown
        label="Section"
        options={['A', 'B', 'C']}
        selectedValue={selectedSection}
        onValueChange={setSelectedSection}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={homeworkData}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}`}
          style={styles.list}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible1(true)}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible1} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Homework</Text>
            <TextInput
              placeholder="Class"
              style={styles.input}
              value={formData.class}
              onChangeText={(text) => setFormData({ ...formData, class: text })}
            // editable={false}
            />
            <TextInput
              placeholder="Section"
              style={styles.input}
              value={formData.section}
              onChangeText={(text) => setFormData({ ...formData, section: text })}
            // editable={false}
            />
            <TextInput
              placeholder="Date"
              style={styles.input}
              value={formData.date}
              onChangeText={(text) => setFormData({ ...formData, date: text })}
            // editable={false}
            />
            <TextInput
              placeholder="Subject"
              style={styles.input}
              value={formData.subject}
              onChangeText={(text) => setFormData({ ...formData, subject: text })}
            />
            <TextInput
              placeholder="Homework"
              style={styles.input}
              value={formData.homework}
              onChangeText={(text) => setFormData({ ...formData, homework: text })}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={styles.addButton} onPress={handleAddHomework}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => setModalVisible1(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={modalVisible2} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Homework</Text>
            <TextInput
              placeholder="Class"
              style={styles.input}
              value={editData?.class}
              onChangeText={(text) => setEditData({ ...editData, class: text })}
              editable={false}
            />
            <TextInput
              placeholder="Section"
              style={styles.input}
              value={editData?.section}
              onChangeText={(text) => setEditData({ ...editData, section: text })}
              editable={false}
            />
            <TextInput
              placeholder="Date"
              style={styles.input}
              value={editData?.date}
              onChangeText={(text) => setEditData({ ...editData, date: text })}
            />
            <TextInput
              placeholder="Subject"
              style={styles.input}
              value={editData?.subject}
              onChangeText={(text) => setEditData({ ...editData, subject: text })}
              editable={false}
            />
            <TextInput
              placeholder="Homework"
              style={styles.input}
              value={editData?.homework}
              onChangeText={(text) => setEditData({ ...editData, homework: text })}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={handleEditHomework} style={styles.addButton}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible2(false)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
    marginBottom: ('10%'),
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dropdownLabel: {
    fontSize: 16,
  },
  dropdownOptions: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 5,
  },
  dropdownOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  list: {
    marginTop: 20,
  },
  item: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    marginVertical: 2,
  },
  label: {
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#567BC2',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabIcon: {
    fontSize: 30,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 4,
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
  addButton: {
    backgroundColor: '#567BC2',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',

    width: '48%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '48%',
    alignItems: 'center',
  },
});

export default HomeworkList;
