import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Alert } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../../Component/Config';

const MyBooks = () => {
  const [books, setBooks] = useState([]);

  const fetchBooks = async (student_id) => {
    try {
      const response = await fetch(`${url}/books_issued_fetch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Ensure correct Content-Type header
        },
        body: JSON.stringify({
          enrollment_or_employee_id: student_id,
        })
      });
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setBooks(data.result);
    } catch (error) {
      console.error('Error fetching books data:', error);
      Alert.alert('Error', 'Failed to fetch books data.');
    }
  };


  const getUserProfile = async () => {
    try {
      const userProfile = await AsyncStorage.getItem('userProfile');
      if (userProfile !== null) {
        const parsedProfile = JSON.parse(userProfile);
        // console.log('User Profile:', parsedProfile);
        // setStudent_id(parsedProfile["Student ID"]);
        fetchBooks(parsedProfile["enrollment_or_employee_id"]);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
    getUserProfile();
  }, []);

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Image
        source={{ uri: item.image }}
        style={styles.bookImage}
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.book_name}</Text>
        <Text style={styles.bookDetail}>Class: {item.class}</Text>
        <Text style={styles.bookIssuedDate}>Issued on: {item.issued_on}</Text>
        <Text style={styles.bookReturnDate}>Return date: {item.return_date}</Text>
        <Text style={[styles.bookStatus, { color: item.status === 'returned' ? 'green' : 'red' }]}>
          Status: {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={books}
      renderItem={renderBookItem}
      keyExtractor={(item) => item.books_name} // assuming books_name is unique
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: wp('4%'),
  },
  bookItem: {
    flexDirection: 'row',
    marginBottom: hp('2%'),
    backgroundColor: '#fff',
    padding: wp('4%'),
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  bookImage: {
    width: wp('15%'),
    height: wp('20%'),
    marginRight: wp('4%'),
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
  },
  bookDetail: {
    fontSize: wp('3.5%'),
    color: '#555',
  },
  bookIssuedDate: {
    fontSize: wp('3.5%'),
    color: '#555',
  },
  bookReturnDate: {
    fontSize: wp('3.5%'),
    color: '#555',
  },
  bookStatus: {
    fontSize: wp('3.5%'),
  },
});

export default MyBooks;
