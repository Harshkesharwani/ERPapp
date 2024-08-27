import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { url } from '../../Component/Config';

const ExamTimeTable = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedExamType, setSelectedExamType] = useState(null);
  const [timeTable, setTimeTable] = useState([]);
  const [showYearDropdown, setShowYearDropdown] = useState(false); // State to toggle year dropdown
  const [showExamTypeDropdown, setShowExamTypeDropdown] = useState(false); // State to toggle exam type dropdown
  const [showDatePicker, setShowDatePicker] = useState(false); // State to show date picker
  const [showTimePicker, setShowTimePicker] = useState(false); // State to show time picker
  const [selectedItem, setSelectedItem] = useState(null); // State to hold the selected item for editing
  const [date, setDate] = useState(new Date()); // State to hold selected date
  const [mode, setMode] = useState('date'); // State to hold mode of picker (date/time)

  const years = ['2023', '2024'];
  const examTypes = ['Mid-term', 'Final'];

  const demoData = {
    '2023': {
      'Mid-term': [
        { id: '1', date: '2023-03-15', subject: 'Math', time: '10:00 AM - 12:00 PM' },
        { id: '2', date: '2023-03-16', subject: 'Physics', time: '1:00 PM - 3:00 PM' },
      ],
      'Final': [
        { id: '3', date: '2023-06-20', subject: 'Math', time: '9:00 AM - 11:00 AM' },
        { id: '4', date: '2023-06-21', subject: 'Physics', time: '2:00 PM - 4:00 PM' },
      ],
    },
    '2024': {
      'Mid-term': [
        { id: '5', date: '2024-03-15', subject: 'Chemistry', time: '10:00 AM - 12:00 PM' },
        { id: '6', date: '2024-03-16', subject: 'Biology', time: '1:00 PM - 3:00 PM' },
      ],
      'Final': [
        { id: '7', date: '2024-06-20', subject: 'Chemistry', time: '9:00 AM - 11:00 AM' },
        { id: '8', date: '2024-06-21', subject: 'Biology', time: '2:00 PM - 4:00 PM' },
      ],
    },
  };

  const toggleYearDropdown = () => {
    setShowYearDropdown(!showYearDropdown);
    setShowExamTypeDropdown(false); // Close exam type dropdown when opening year dropdown
    setShowDatePicker(false); // Close date picker when opening year dropdown
    setShowTimePicker(false); // Close time picker when opening year dropdown
  };

  const toggleExamTypeDropdown = () => {
    setShowExamTypeDropdown(!showExamTypeDropdown);
    setShowYearDropdown(false); // Close year dropdown when opening exam type dropdown
    setShowDatePicker(false); // Close date picker when opening exam type dropdown
    setShowTimePicker(false); // Close time picker when opening exam type dropdown
  };

  const selectYear = (year) => {
    setSelectedYear(year);
    fetchTimeTable(year, selectedExamType);
    setShowYearDropdown(false); // Close year dropdown after selection
    setShowDatePicker(false); // Close date picker after selection
    setShowTimePicker(false); // Close time picker after selection
  };

  const selectExamType = (type) => {
    setSelectedExamType(type);
    fetchTimeTable(selectedYear, type);
    setShowExamTypeDropdown(false); // Close exam type dropdown after selection
    setShowDatePicker(false); // Close date picker after selection
    setShowTimePicker(false); // Close time picker after selection
  };

  const fetchTimeTable = (year, examType) => {
    // Fetch from demo data
    setTimeTable(demoData[year][examType]);
  };

  const handleDateChange = (id, newDate) => {
    const updatedTimeTable = timeTable.map((item) =>
      item.id === id ? { ...item, date: newDate } : item
    );
    setTimeTable(updatedTimeTable);
  };

  const handleSubjectChange = (id, newSubject) => {
    const updatedTimeTable = timeTable.map((item) =>
      item.id === id ? { ...item, subject: newSubject } : item
    );
    setTimeTable(updatedTimeTable);
  };

  const handleTimeChange = (id, newTime) => {
    const updatedTimeTable = timeTable.map((item) =>
      item.id === id ? { ...item, time: newTime } : item
    );
    setTimeTable(updatedTimeTable);
  };

  const showPicker = (id, mode) => {
    setSelectedItem(id);
    setMode(mode);
    if (mode === 'date') {
      setShowDatePicker(true);
    } else if (mode === 'time') {
      setShowTimePicker(true);
    }
  };

  const hidePicker = () => {
    setShowDatePicker(false);
    setShowTimePicker(false);
    setSelectedItem(null);
  };

  const handleConfirm = (selectedDate) => {
    const currentDate = selectedDate || date;
    hidePicker();
    if (mode === 'date') {
      const formattedDate = currentDate.toISOString().split('T')[0];
      handleDateChange(selectedItem, formattedDate);
    } else if (mode === 'time') {
      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();
      const formattedTime = `${hours}:${minutes}`;
      handleTimeChange(selectedItem, formattedTime);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exam Timetable</Text>

      {/* Year Dropdown */}
      <TouchableOpacity onPress={toggleYearDropdown} style={styles.dropdown}>
        <Text>{selectedYear ? selectedYear : 'Select Year'}</Text>
        {showYearDropdown && (
          <View style={styles.dropdownOptions}>
            {years.map((year) => (
              <TouchableOpacity
                key={year}
                style={styles.dropdownOption}
                onPress={() => selectYear(year)}
              >
                <Text>{year}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </TouchableOpacity>

      {/* Exam Type Dropdown */}
      <TouchableOpacity onPress={toggleExamTypeDropdown} style={styles.dropdown}>
        <Text>{selectedExamType ? selectedExamType : 'Select Exam Type'}</Text>
        {showExamTypeDropdown && (
          <View style={styles.dropdownOptions}>
            {examTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.dropdownOption}
                onPress={() => selectExamType(type)}
              >
                <Text>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </TouchableOpacity>

      {/* Table */}
      <FlatList
        data={timeTable}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.cell, styles.editable]}
              onPress={() => showPicker(item.id, 'date')}
            >
              <Text>{item.date}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cell, styles.editable]}
              onPress={() => handleSubjectChange(item.id, 'New Subject')}
            >
              <Text>{item.subject}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cell, styles.editable]}
              onPress={() => showPicker(item.id, 'time')}
            >
              <Text>{item.time}</Text>
            </TouchableOpacity>
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Date</Text>
            <Text style={styles.headerCell}>Subject</Text>
            <Text style={styles.headerCell}>Time</Text>
          </View>
        )}
      />

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) =>
            handleConfirm(selectedDate || date)
          }
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) =>
            handleConfirm(selectedDate || date)
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  dropdownOptions: {
    marginTop: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dropdownOption: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 4,
  },
  editable: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    backgroundColor: '#eee',
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ExamTimeTable;
