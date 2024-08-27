import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { dashboard } from '../../Component/DashboardData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const Dashboard = ({ navigation }) => {

  const getUserProfile = async () => {
    try {
      const userProfile = await AsyncStorage.getItem('userProfile');
      if (userProfile !== null) {
        console.log('User Profile:', JSON.parse(userProfile));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  const renderModule = ({ item }) => (
    <TouchableOpacity style={styles.moduleContainer} onPress={() => item.route && navigation.navigate(item.route)}>
      <View style={styles.image}>
        <Image source={item.icon} style={styles.inner} />
      </View>
      <Text style={styles.moduleText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderRow = ({ item }) => (
    <View style={styles.row}>
      {item.map((module) => (
        <TouchableOpacity key={module.title} style={styles.moduleContainer} onPress={() => module.route && navigation.navigate(module.route)}>
          <View style={styles.image}>
            <Image source={module.icon} style={styles.inner} />
          </View>
          <Text style={styles.moduleText}>{module.title}</Text>
        </TouchableOpacity>
      ))}
      {item.length < 3 && [...Array(3 - item.length)].map((_, index) => (
        <View key={`empty-${index}`} style={styles.moduleContainer} />
      ))}
    </View>
  );

  return (
    <View style={styles.mainn}>
      <View style={styles.main}>
        <Text style={styles.dashboardTitle}>Dashboard</Text>
        <FlatList
          data={chunkArray(dashboard, 3)}
          renderItem={renderRow}
          keyExtractor={(item, index) => `row-${index}`}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainn: {
    flex: 1,
    backgroundColor: '#B9B9B9',
  },
  main: {
    flex: 1,
    backgroundColor: 'white',
  },
  dashboardTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    margin: wp('4%'),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: wp('1%'), // Decreased margin between rows
  },
  moduleContainer: {
    alignItems: 'center',
    width: wp('28%'),
    marginHorizontal: wp('1%'), // Decreased horizontal margin between modules
  },
  image: {
    width: wp('15%'),
    height: wp('15%'),
    backgroundColor: 'white',
    borderRadius: wp('7.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: wp('1%'), // Decreased margin below the image
  },
  inner: {
    width: wp('10%'),
    height: wp('10%'),
  },
  moduleText: {
    fontSize: 15,
    textAlign: 'center',
  },
});

export default Dashboard;
