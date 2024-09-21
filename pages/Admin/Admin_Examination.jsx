import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { url } from '../../Component/Config';

const examTypes = ['Final', 'Half Yearly', 'Unit Test'];

const Dropdown = ({ label, options, onSelect, disabled }) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    setSelected(option);
    setVisible(false);
    onSelect(option);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => !disabled && setVisible(!visible)}>
        <Text style={styles.dropdownButtonText}>{selected ? selected : 'Select'}</Text>
      </TouchableOpacity>
      {visible && (
        <View style={styles.dropdownOptions}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownOption}
              onPress={() => handleSelect(option)}
            >
              <Text style={styles.dropdownOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const ExaminationPage = ({ navigation }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [showExamTypeDropdown, setShowExamTypeDropdown] = useState(true);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [examData, setExamData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [newExams, setNewExams] = useState([]);
  const [currentExam, setCurrentExam] = useState({
    class: '',
    subject: '',
    date: '' || new Date(),
    examType: '',
    time: '' || new Date(),
    endTime: '' || new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleClassChange = (value) => {
    const classNumber = String(value.split(' ')[1]);
    setSelectedClass(classNumber);
    setCurrentExam((prevExam) => ({ ...prevExam, class: value }));
    setSelectedBranch(null);
    setShowExamTypeDropdown(true);
    setShowBranchDropdown(classNumber === '11' || classNumber === '12');
  };

  const handleExamTypeChange = (value) => {
    setSelectedExamType(value);
    setCurrentExam((prevExam) => ({ ...prevExam, examType: value }));
  };

  const handleSubmit = async () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

    try {
      const response = await fetch(`${url}/admin_exam_time_table`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          class: selectedClass,
          date: formattedDate,
          exam_type: selectedExamType,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setExamData(data['Exam Time Table']); // Store fetched data
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error posting data:', error);
      Alert.alert('Error', 'Failed to fetch examination data');
    }
  };

  const handleAddExam = () => {

    if (!currentExam.class || !currentExam.subject || !currentExam.examType || !currentExam.date || !currentExam.time || !currentExam.endTime) {
      Alert.alert('Error', 'Please fill out all the fields');
      return;
    }
    const formattedExam = {
      ...currentExam,
      date: formatDate(currentExam.date),
      time: formatTimeRange(currentExam.time, currentExam.endTime),
    };
    setNewExams((prevExams) => [...prevExams, formattedExam]);
    setCurrentExam({
      class: selectedClass,
      subject: '',
      examType: selectedExamType,
      time: new Date(),
      date: new Date(),
      endTime: new Date(),
    });
  };

  const handleRowClick = (exam) => {
    setCurrentExam({
      id: exam.id,
      class: exam.class,
      subject: exam.subject,
      date: exam.date || new Date(),
      examType: exam.examType,
      time: exam.time || new Date(),
      endTime: exam.endTime || new Date(),
    });
    setModalVisible(true); // Open the modal
  };

  // Handle save after editing
  const handleSaveExam = async () => {
    try {
      const response = await fetch(`${url}/admin_update_exam_time_table`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: currentExam.id, // Include ID to update the specific exam
          class: currentExam.class,
          subject: currentExam.subject,
          date: currentExam.date,
          examType: currentExam.examType,
          time: currentExam.time,
          endTime: currentExam.endTime,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setModalVisible(false); // Close modal on success
        Alert.alert('Success', 'Exam updated successfully');
        handleSubmit(); // Refresh the data
      } else {
        throw new Error('Failed to update exam');
      }
    } catch (error) {
      console.error('Error updating exam:', error);
      Alert.alert('Error', 'Failed to update exam');
    }
  };

  const handleNewExamSubmit = async () => {
    try {
      const response = await fetch(`${url}/admin_save_exam_time_table`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newExams),
      });
      const data = await response.json();
      if (response.ok) {
        setModalVisible1(false);
        handleSubmit();
        setNewExams([]);
        Alert.alert('Success', 'Examinations created successfully');
      } else {
        throw new Error('Failed to create examinations');
      }
    } catch (error) {
      console.error('Error creating examinations:', error);
      Alert.alert('Error', 'Failed to create examinations');
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const formatTime = (time) => {
    const t = new Date(time);
    let hours = t.getHours();
    const minutes = t.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
    return strTime;
  };

  useEffect(() => {
    if (selectedClass && selectedExamType) {
      handleSubmit();
    }
  }, [selectedClass, selectedExamType]);

  const formatTimeRange = (startTime, endTime) => {
    return `${formatTime(startTime)} to ${formatTime(endTime)}`;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.tableRow} onPress={() => handleRowClick(item)}>
      <Text style={styles.tableCell}>{item.subject}</Text>
      <Text style={styles.tableCell}>{item.date}</Text>
      <Text style={styles.tableCell}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.box1}>
        <Text style={styles.title}>Examination Page</Text>
      </View>
      <Dropdown
        label="Select Class"
        options={['Class 1', 'Class 2', 'Class 3', 'Class 10', 'Class 12']}
        onSelect={handleClassChange}
        disabled={false}
      />
      {showExamTypeDropdown && (
        <Dropdown
          label="Select Exam Type"
          options={examTypes}
          onSelect={handleExamTypeChange}
          disabled={false}
        />
      )}

      {examData && (
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellHeader}>Subject</Text>
            <Text style={styles.tableCellHeader}>Date</Text>
            <Text style={styles.tableCellHeader}>Time</Text>
          </View>
          <FlatList
            data={examData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible1(true)}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Modal for editing */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Examination</Text>
            <Dropdown
              label="Select Class"
              options={['1', '2', '3', '10', '12']}
              onSelect={(value) => setCurrentExam({ ...currentExam, class: value })}
            // disabled={!!selectedClass}
            />
            {showExamTypeDropdown && (
              <Dropdown
                label="Select Exam Type"
                options={examTypes}
                onSelect={handleExamTypeChange}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Enter Subject"
              value={currentExam.subject}
              onChangeText={(text) => setCurrentExam({ ...currentExam, subject: text })}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.input}>{formatDate(currentExam.date)}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <Text style={styles.input}>{formatTime(currentExam.time)}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
              <Text style={styles.input}>{formatTime(currentExam.endTime)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={currentExam.date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || currentExam.date;
                  setShowDatePicker(false);
                  setCurrentExam({ ...currentExam, date: currentDate });
                }}
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                value={currentExam.time}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  const currentTime = selectedTime || currentExam.time;
                  setShowTimePicker(false);
                  setCurrentExam({ ...currentExam, time: currentTime });
                }}
              />
            )}
            {showEndTimePicker && (
              <DateTimePicker
                value={currentExam.endTime}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  const currentEndTime = selectedTime || currentExam.endTime;
                  setShowEndTimePicker(false);
                  setCurrentExam({ ...currentExam, endTime: currentEndTime });
                }}
              />
            )}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleSaveExam}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => {
                setModalVisible(false);
              }
              }>
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for adding new exam */}
      <Modal visible={modalVisible1} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Examination</Text>
            <Dropdown
              label="Select Class"
              options={['1', '2', '3', '10', '12']}
              onSelect={(value) => setCurrentExam({ ...currentExam, class: value })}
              disabled={!!selectedClass}
            />
            {showExamTypeDropdown && (
              <Dropdown
                label="Select Exam Type"
                options={examTypes}
                onSelect={handleExamTypeChange}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Enter Subject"
              value={currentExam.subject}
              onChangeText={(text) => setCurrentExam({ ...currentExam, subject: text })}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.input}>{formatDate(currentExam.date)}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <Text style={styles.input}>{formatTime(currentExam.time)}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
              <Text style={styles.input}>{formatTime(currentExam.endTime)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={currentExam.date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || currentExam.date;
                  setShowDatePicker(false);
                  setCurrentExam({ ...currentExam, date: currentDate });
                }}
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                value={currentExam.time}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  const currentTime = selectedTime || currentExam.time;
                  setShowTimePicker(false);
                  setCurrentExam({ ...currentExam, time: currentTime });
                }}
              />
            )}
            {showEndTimePicker && (
              <DateTimePicker
                value={currentExam.endTime}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  const currentEndTime = selectedTime || currentExam.endTime;
                  setShowEndTimePicker(false);
                  setCurrentExam({ ...currentExam, endTime: currentEndTime });
                }}
              />
            )}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleAddExam}>
                <Text style={styles.modalButtonText}>Add Exam</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleNewExamSubmit}>
                <Text style={styles.modalButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => {
                setModalVisible1(false);
              }
              }>
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
            <View>
              <FlatList
                data={newExams}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.examItem}>
                    <Text>Class: {item.class}</Text>
                    <Text>Subject: {item.subject}</Text>
                    <Text>Date: {item.date}</Text>
                    <Text>Time: {item.time}</Text>
                  </View>
                )}
              />
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default ExaminationPage;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginBottom: '10%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dropdownButton: {
    // position: 'relative',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
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
    // position: 'absolute',
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
  tableContainer: {
    marginTop: 20,
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  tableCellHeader: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tableRow: {
    borderRadius: 5,
    borderWidth: 1,
    margin: 2,
    flexDirection: 'row',
    padding: 10,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  tableCellHeader: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  box1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#567BC2',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    color: '#fff',
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
    padding: 8,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#567BC2',
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
