// NotificationPage.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const NotificationPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      {/* Display notifications here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: wp('5%'),
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    // marginBottom: 20,
  },
});

export default NotificationPage;
