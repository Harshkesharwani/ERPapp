import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window');

export default function Main() {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleSearchPress = () => {
    setSearchVisible(!searchVisible);
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    // Implement your search logic here
    console.log('Searching for:', text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DAV SCHOOL</Text>

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleSearchPress}>
            <FontAwesome name="search" size={hp('3%')} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {searchVisible && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search dashboard options..."
            value={searchText}
            onChangeText={handleSearchTextChange}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#567BC2',
    padding: hp('2%'),
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: hp('3%'),
  },
  iconContainer: {
    flexDirection: 'row',
    gap: hp('2%'),
  },
  searchContainer: {
    padding: hp('1%'),
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 50,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: hp('1%'),
    borderRadius: 5,
    width: '100%',
  },
  dashboard: {
    padding: hp('2%'),
  },
  dashboardTitle: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
  },
});
