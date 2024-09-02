import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Alert, Switch } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { url } from '../../Component/Config';

const AttendancePage = () => {
  const [id, setId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [editedCheckIn, setEditedCheckIn] = useState(new Date());
  const [editedCheckOut, setEditedCheckOut] = useState(new Date());
  const [attendanceType, setAttendanceType] = useState(true); // true for 'Full Day', false for 'Half Day'
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const [newId, setNewId] = useState(''); // New state for 'Enter ID' in Add Attendance modal

  const handleDayPress = async (day) => {
    const formattedDate = day.dateString;
    setSelectedDate(formattedDate);
    await fetchAttendanceData(id, formattedDate);
  };

  const fetchAttendanceData = async (id, date) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${url}/admin_attendance_fetch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id_or_employee_id: id, date }),
      });
      const result = await response.json();
      if (response.ok) {
        const filteredData = result.data.find(item => item.Date === date);
        setAttendanceData(filteredData || {});
      } else {
        setError('Failed to fetch attendance data.');
      }
    } catch (error) {
      setError('An error occurred while fetching data.');
      console.error(error);
    }
    setLoading(false);
  };

  const handleEdit = () => {
    setEditedCheckIn(new Date(`1970-01-01T${attendanceData["Check In Time"] || new Date().toTimeString().split(' ')[0]}`));
    setEditedCheckOut(new Date(`1970-01-01T${attendanceData["Check Out Time"] || new Date().toTimeString().split(' ')[0]}`));
    setAttendanceType(attendanceData["Type"] === 'Full Day');
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${url}/admin_attendance_update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id_or_employee_id: id,
          date: selectedDate,
          check_in_time: editedCheckIn.toTimeString().split(' ')[0],
          check_out_time: editedCheckOut.toTimeString().split(' ')[0],
          type: attendanceType ? 'Full Day' : 'Half Day',
        }),
      });

      if (response.ok) {
        await fetchAttendanceData(id, selectedDate);
        setModalVisible(false);
      } else {
        Alert.alert('Error', 'Failed to update attendance data.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating data.');
      console.error(error);
    }
  };

  const handleSaveNewAttendance = async () => {
    try {
      const response = await fetch(`${url}/admin_put_attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id_or_employee_id: newId, // Use newId here
          date: selectedDate,
          check_in_time: editedCheckIn.toTimeString().split(' ')[0],
          check_out_time: editedCheckOut.toTimeString().split(' ')[0],
          type: attendanceType ? 'Full Day' : 'Half Day',
        }),
      });
      if (response.ok) {
        await fetchAttendanceData(newId, selectedDate); // Fetch with newId
        setModalVisible1(false);
      } else {
        Alert.alert('Error', 'Failed to add attendance data.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while adding data.');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Delete',
      'Do you really want to delete this data?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const response = await fetch(`${url}/admin_attendance_delete`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  student_id_or_employee_id: id,
                  date: selectedDate,
                  check_in_time: attendanceData["Check In Time"],
                  check_out_time: attendanceData["Check Out Time"],
                  type: attendanceData["Type"],
                }),
              });

              if (response.ok) {
                setAttendanceData(null);
              } else {
                Alert.alert('Error', 'Failed to delete attendance data.');
              }
            } catch (error) {
              Alert.alert('Error', 'An error occurred while deleting data.');
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const showPicker = (type) => {
    if (type === 'checkIn') {
      setShowCheckInPicker(true);
    } else {
      setShowCheckOutPicker(true);
    }
  };

  const handleDateChange = (event, selectedDate, type) => {
    if (event.type === 'set' && selectedDate) {
      if (type === 'checkIn') {
        setEditedCheckIn(selectedDate);
      } else {
        setEditedCheckOut(selectedDate);
      }
    }
    if (type === 'checkIn') {
      setShowCheckInPicker(false);
    } else {
      setShowCheckOutPicker(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter ID"
        value={id}
        onChangeText={setId}
        keyboardType="default"
      />
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{ [selectedDate]: { selected: true, selectedColor: 'blue' } }}
        />
      </View>
      {loading && <Text>Loading...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      {attendanceData && (
        <View style={styles.dayDetailsContainer}>
          <Text style={styles.dayDetailsText}>Attendance Details for {selectedDate}</Text>
          <Text style={styles.apiText}>Attendance: {attendanceData["Type"]}</Text>
          <Text style={styles.apiText}>Check In: {attendanceData["Check In Time"]}</Text>
          <Text style={styles.apiText}>Check Out: {attendanceData["Check Out Time"]}</Text>
          <View style={{ flexDirection: 'row', marginHorizontal: 75, justifyContent: 'space-between' }}>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {!attendanceData && selectedDate && !loading && !error && (
        <Text style={styles.noData}>No data available for {selectedDate}</Text>
      )}
      {!attendanceData && !selectedDate && (
        <Text style={styles.noData}>Select a date from the calendar to view attendance</Text>
      )}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible1(true)}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Attendance</Text>
            <View style={styles.inputContainer}>
              <Text>Check In Time:</Text>
              <TouchableOpacity onPress={() => showPicker('checkIn')}>
                <Text>{editedCheckIn.toTimeString().split(' ')[0]}</Text>
              </TouchableOpacity>
              {showCheckInPicker && (
                <DateTimePicker
                  value={editedCheckIn}
                  mode="time"
                  display="default"
                  onChange={(event, date) => handleDateChange(event, date, 'checkIn')}
                />
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text>Check Out Time:</Text>
              <TouchableOpacity onPress={() => showPicker('checkOut')}>
                <Text>{editedCheckOut.toTimeString().split(' ')[0]}</Text>
              </TouchableOpacity>
              {showCheckOutPicker && (
                <DateTimePicker
                  value={editedCheckOut}
                  mode="time"
                  display="default"
                  onChange={(event, date) => handleDateChange(event, date, 'checkOut')}
                />
              )}
            </View>
            <View style={styles.switchContainer}>
              <Text>Attendance Type:</Text>
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setAttendanceType(prev => !prev)}
              >
                <Text style={styles.toggleText}>{attendanceType ? 'Full Day' : 'Half Day'}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={() => setModalVisible1(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Attendance</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter ID"
              value={newId}
              onChangeText={setNewId}
              keyboardType="default"
            />
            <View style={styles.inputContainer}>
              <Text>Check In Time:</Text>
              <TouchableOpacity onPress={() => showPicker('checkIn')}>
                <Text>{editedCheckIn.toTimeString().split(' ')[0]}</Text>
              </TouchableOpacity>
              {showCheckInPicker && (
                <DateTimePicker
                  value={editedCheckIn}
                  mode="time"
                  display="default"
                  onChange={(event, date) => handleDateChange(event, date, 'checkIn')}
                />
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text>Check Out Time:</Text>
              <TouchableOpacity onPress={() => showPicker('checkOut')}>
                <Text>{editedCheckOut.toTimeString().split(' ')[0]}</Text>
              </TouchableOpacity>
              {showCheckOutPicker && (
                <DateTimePicker
                  value={editedCheckOut}
                  mode="time"
                  display="default"
                  onChange={(event, date) => handleDateChange(event, date, 'checkOut')}
                />
              )}
            </View>
            <View style={styles.switchContainer}>
              <Text>Attendance Type:</Text>
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setAttendanceType(prev => !prev)}
              >
                <Text style={styles.toggleText}>{attendanceType ? 'Full Day' : 'Half Day'}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveNewAttendance}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible1(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    height: hp('6%'),
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  calendarContainer: {
    marginVertical: 16,
  },
  dayDetailsContainer: {
    marginVertical: 16,
    padding: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
  },
  dayDetailsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  apiText: {
    fontSize: 14,
    marginVertical: 4,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 4,
  },
  editButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  noData: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    backgroundColor: 'blue',
    borderRadius: 28,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 4,
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  error: {
    color: 'red',
  },
});

export default AttendancePage;
