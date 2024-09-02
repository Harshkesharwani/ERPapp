import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Alert } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { url } from '../../Component/Config';

const AvailableBooks = () => {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${url}/library_books_fetch`); // replace with your actual API endpoint
      const data = await response.json();
      // console.log(data);
      setBooks(data.Result);
    } catch (error) {
      console.error('Error fetching books data:', error);
      Alert.alert('Error', 'Failed to fetch books data.');
    }
  };

  useEffect(() => {
    fetchBooks();
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
        <Text style={styles.bookDetail}>Subject: {item.subject}</Text>
        <Text style={[styles.bookStatus, { color: item.status === 'available' ? 'green' : 'red' }]}>
          Status: {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={books}
      renderItem={renderBookItem}
      keyExtractor={(item) => item.book_name} // assuming book_name is unique
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
  bookStatus: {
    fontSize: wp('3.5%'),
  },
});

export default AvailableBooks;
