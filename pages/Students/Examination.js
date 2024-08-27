import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableWithoutFeedback } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../../Component/Config';

const Examination = () => {
  const [selectedExamType, setSelectedExamType] = useState('Half Yearly');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [examSchedule, setExamSchedule] = useState([]);
  const [clasess, setClass] = useState('');
  const [section, setSection] = useState('');

  const examTypes = ['Half Yearly', 'Final', 'Unit Test'];

  const handleDropdownToggle = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleExamTypeSelect = (examType) => {
    setSelectedExamType(examType);
    setIsDropdownVisible(false);
    fetchExamSchedule(examType);
  };

  const fetchExamSchedule = async (examType) => {
    try {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

      const response = await fetch(`${url}/exam_time_table`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "class": clasess,
          "section": section,
          "date": formattedDate,
          "exam_type": examType
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log('Received data:', data);
      setExamSchedule(data["Exam Time Table"] || []); // Adjusted to match the actual response structure
    } catch (error) {
      console.error('Error fetching exam schedule:', error);
      alert('Error fetching exam schedule: ' + error.message);
    }
  };

  const getUserProfile = async () => {
    try {
      const userProfile = await AsyncStorage.getItem('userProfile');
      if (userProfile !== null) {
        const parsedProfile = JSON.parse(userProfile);
        setClass(parsedProfile['Class']);
        // console.log(parsedProfile['Class']);
        setSection(parsedProfile['section_or_department']);
        // console.log(parsedProfile['section_or_department']);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const renderTableRow = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.Subject}</Text>
      <Text style={styles.tableCell}>{item.Date}</Text>
      <Text style={styles.tableCell}>{item.Time}</Text>
    </View>
  );

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.tableHeaderCell}>Subject</Text>
      <Text style={styles.tableHeaderCell}>Date</Text>
      <Text style={styles.tableHeaderCell}>Time</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exam Time-Table</Text>
      <TouchableWithoutFeedback onPress={handleDropdownToggle}>
        <View style={styles.dropdown}>
          <Text style={styles.dropdownText}>{selectedExamType}</Text>
        </View>
      </TouchableWithoutFeedback>
      {isDropdownVisible && (
        <View style={styles.dropdownItems}>
          {examTypes.map((examType, index) => (
            <TouchableWithoutFeedback key={index} onPress={() => handleExamTypeSelect(examType)}>
              <View style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText}>{examType}</Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      )}
      <FlatList
        ListHeaderComponent={renderTableHeader}
        data={examSchedule}
        keyExtractor={(item) => item.Date + item.Subject}
        renderItem={renderTableRow}
        contentContainerStyle={styles.table}
      />
    </View>
  );
};

export default Examination;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    marginVertical: wp('2%'),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  table: {
    marginTop: hp('2%'),
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: hp('2%'),
  },
  tableCell: {
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#aaa',
    paddingVertical: hp('1%'),
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    marginTop: hp('2%'),
    alignSelf: 'center',
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownItems: {
    marginTop: hp('1%'),
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  dropdownItem: {
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownItemText: {
    fontSize: 16,
  },
});
