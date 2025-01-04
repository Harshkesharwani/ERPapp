import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { url } from '../../Component/Config';

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const convertMonthNumberToName = (monthNumber) => {
  return monthNames[parseInt(monthNumber, 10) - 1];
};

const Admin_Events = () => {
  const [holidays, setHolidays] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editHoliday, setEditHoliday] = useState(null);
  const [newHoliday, setNewHoliday] = useState({ eventname: '', date: '', day: '' });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(moment().format('MM')); // Keep track of the current month

  useEffect(() => {
    fetchHolidays(currentMonth);
  }, [currentMonth]);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const fetchHolidays = async (month) => {
    try {
      const currentYear = moment().format('YYYY');
      const monthly = convertMonthNumberToName(month);
      const monthString = `${month}-${currentYear}`;

      const response = await fetch(`${url}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ month: monthly }),
      });
      const data = await response.json();
      setHolidays(data.events || []);
      // Update marked dates for the calendar
      const dates = data.events.reduce((acc, event) => {
        if (event.date) {
          acc[event.date] = { marked: true };
        }
        return acc;
      }, {});
      setMarkedDates(dates);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHoliday = async () => {
    if (newHoliday.eventname && newHoliday.date && newHoliday.day) {
      try {
        const response = await fetch(`${url}/admin_events_create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newHoliday),
        });
        if (response.ok) {
          fetchHolidays(currentMonth); // Fetch holidays for the current month after adding
          setModalVisible(false);
        } else {
          console.error('Failed to add holiday');
        }
      } catch (error) {
        console.error('Error adding holiday:', error);
      }
    }
  };

  const handleEditHoliday = async () => {
    if (editHoliday) {
      try {
        const response = await fetch(`${url}/admin_events_update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...newHoliday, id: editHoliday.id }),
        });
        if (response.ok) {
          fetchHolidays(currentMonth); // Fetch holidays for the current month after editing
          setModalVisible(false);
        } else {
          console.error('Failed to update holiday');
        }
      } catch (error) {
        console.error('Error updating holiday:', error);
      }
    }
  };

  const handleDeleteHoliday = async (item) => {
    try {
      const response = await fetch(`${url}/admin_events_delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: item.id }),
      });
      if (response.ok) {
        fetchHolidays(currentMonth); // Fetch holidays for the current month after deleting
      } else {
        console.error('Failed to delete holiday');
      }
    } catch (error) {
      console.error('Error deleting holiday:', error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const currentDate = selectedDate || new Date();
      const formattedDate = moment(currentDate).format('YYYY-MM-DD');
      const day = moment(currentDate).format('dddd');
      setNewHoliday({ ...newHoliday, date: formattedDate, day });
    }
  };

  const handleMonthChange = (month) => {
    const monthNumber = moment().month(month.month - 1).format('MM'); // Convert month name to number
    setCurrentMonth(monthNumber); // Update the current month state
  };

  const renderHoliday = ({ item }) => (
    <TouchableOpacity style={styles.holidayBox} onPress={() => setEditHoliday(item)}>
      <View style={styles.holidayTextContainer}>
        <Text style={styles.holidayName}>{item.eventname || 'N/A'}</Text>
        <View style={styles.holidayDateContainer}>
          <Text style={styles.holidayDate}>{item.date || 'N/A'}</Text>
          <Text style={styles.holidayDate}>{item.day || 'N/A'}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteHoliday(item)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Events</Text>
      <Calendar
        current={selectedDate || undefined}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange} // Handle month changes
        style={styles.calendarStyle}
      />
      <FlatList
        data={holidays}
        renderItem={renderHoliday}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.fab} onPress={() => {
        setEditHoliday(null);
        setNewHoliday({ eventname: '', date: '', day: '' });
        setModalVisible(true);
      }}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Event Name"
              value={newHoliday.eventname}
              onChangeText={(text) => setNewHoliday({ ...newHoliday, eventname: text })}
              style={styles.input}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                placeholder="Event Date"
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
              placeholder="Event Day"
              value={newHoliday.day}
              style={styles.input}
              editable={false}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#567BC2' }]}
                onPress={editHoliday ? handleEditHoliday : handleAddHoliday}
              >
                <Text style={styles.buttonText}>{editHoliday ? 'Save' : 'Add'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#e74c3c' }]}
                onPress={() => setModalVisible(false)}
              >
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
    padding: wp('5%'),
    marginVertical: hp('1%'),
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    elevation: 3,
  },
  holidayTextContainer: {
    flex: 1,
  },
  holidayName: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
  },
  holidayDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  holidayDate: {
    fontSize: hp('2%'),
  },
  fab: {
    position: 'absolute',
    right: wp('3%'),
    bottom: hp('7%'),
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
    width: '48%',
  },
  buttonText: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarStyle: {
    marginBottom: hp('2%'),
  },
  deleteButton: {
    marginTop: hp('1%'),
    backgroundColor: 'red',
    padding: wp('2%'),
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Admin_Events;
