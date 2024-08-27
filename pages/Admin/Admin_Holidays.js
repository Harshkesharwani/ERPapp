import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Button, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { url } from '../../Component/Config';

const Admin_Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editHoliday, setEditHoliday] = useState(null);
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '', day: '' });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const response = await fetch(`${url}/holidays`);
      const data = await response.json();
      console.log(data)
      setHolidays(data.holidays);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    }
  };

  const handleAddHoliday = async () => {
    if (newHoliday.name && newHoliday.date && newHoliday.day) {
      try {
        const response = await fetch(`${url}/holidays`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newHoliday),
        });
        if (response.ok) {
          fetchHolidays();
          setNewHoliday({ name: '', date: '', day: '' });
          setModalVisible(false);
        }
      } catch (error) {
        console.error('Error adding holiday:', error);
      }
    }
  };

  const handleEditHoliday = (holiday) => {
    setEditHoliday(holiday);
    setNewHoliday({ name: holiday.name, date: holiday.date, day: holiday.day });
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (editHoliday) {
      try {
        const response = await fetch(`${url}/holidays/${editHoliday.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newHoliday),
        });
        if (response.ok) {
          fetchHolidays();
          setEditHoliday(null);
          setNewHoliday({ name: '', date: '', day: '' });
          setModalVisible(false);
        }
      } catch (error) {
        console.error('Error updating holiday:', error);
      }
    }
  };

  const handleDeleteHoliday = async (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this holiday?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const response = await fetch(`${url}/holidays/${id}`, {
                method: 'DELETE',
              });
              if (response.ok) {
                fetchHolidays();
              }
            } catch (error) {
              console.error('Error deleting holiday:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    const formattedDate = moment(currentDate).format('YYYY-MM-DD');
    const day = moment(currentDate).format('dddd');
    setNewHoliday({ ...newHoliday, date: formattedDate, day: day });
  };

  const renderHoliday = ({ item }) => (
    <TouchableOpacity style={styles.holidayBox} onPress={() => handleEditHoliday(item)}>
      <View style={styles.holidayTextContainer}>
        <Text style={styles.holidayName}>{item.name}</Text>
        <View style={styles.holidayDateContainer}>
          <Text style={styles.holidayDate}>{item.date}</Text>
          <Text style={styles.holidayDate}>{item.day}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDeleteHoliday(item.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Holidays</Text>
      <FlatList
        data={holidays}
        renderItem={renderHoliday}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Holiday Name"
              value={newHoliday.name}
              onChangeText={(text) => setNewHoliday({ ...newHoliday, name: text })}
              style={styles.input}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                placeholder="Holiday Date"
                value={newHoliday.date}
                style={styles.input}
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
              />
            )}
            <TextInput
              placeholder="Holiday Day"
              value={newHoliday.day}
              style={styles.input}
              editable={false}
            />
            <TouchableOpacity
              style={[styles.button, { backgroundColor: editHoliday ? '#567BC2' : '#567BC2' }]}
              onPress={editHoliday ? handleSaveEdit : handleAddHoliday}
            >
              <Text style={styles.buttonText}>{editHoliday ? 'Save' : 'Add'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#565f96' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
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
    backgroundColor: '#fff',
    padding: wp('5%'),
  },
  header: {
    fontSize: hp('3%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
    textAlign: 'left',
  },
  list: {
    alignItems: 'center',
  },
  holidayBox: {
    width: wp('90%'),
    padding: wp('4%'),
    marginVertical: hp('1%'),
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 2,
  },
  holidayTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  holidayDateContainer: {
    flexDirection: 'column',
  },
  holidayName: {
    fontSize: hp('2.2%'),
    fontWeight: 'bold',
  },
  holidayDate: {
    fontSize: hp('2%'),
    color: '#666',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#567BC2',
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabIcon: {
    fontSize: hp('4%'),
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: wp('80%'),
    padding: wp('5%'),
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    marginBottom: hp('2%'),
    padding: wp('3%'),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('2%'),
    borderRadius: 5,
    marginTop: hp('1%'),
  },
  buttonText: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#fff',
  },
  deleteText: {
    color: '#FF3333',
    fontWeight: 'bold',
  },
});

export default Admin_Holidays;