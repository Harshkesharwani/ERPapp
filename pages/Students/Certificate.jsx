import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { url } from '../../Component/Config';

const Certificate = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Certificate</Text>
      <Text style={styles.center}>No Certificate is available</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 30,
    margin: wp('2%'),
  },
  center: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
});

export default Certificate;
