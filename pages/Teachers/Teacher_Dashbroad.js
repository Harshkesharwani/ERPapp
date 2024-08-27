import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { Teacher_dashboard } from '../../Component/DashboardData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../../Component/Config';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import profile from '../../assets/profile.png';
import { AntDesign } from '@expo/vector-icons';

const Teacher_Dashboard = ({ navigation }) => {

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
    </View>
  );

  return (
    <View style={styles.mainn}>
      <View style={styles.main}>
        <Text style={styles.dashboardTitle}>Teacher Dashboard</Text>
        {/* <View style={styles.box1}>
          <TouchableOpacity style={styles.img}>
            <Image source={profile} style={styles.profileImage} />
            <View style={styles.profile}>
              <Text style={styles.text}>Your Name</Text>
              <Text style={styles.text1}>Teacher</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <AntDesign name="logout" size={30} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View> */}
        <FlatList
          data={chunkArray(Teacher_dashboard, 3)}
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
  box1: {
    margin: wp('2%'),
    backgroundColor: '#567BC2',
    borderRadius: 15,
    padding: wp('2%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  img: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileImage: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
  },
  text: {
    fontSize: 25,
    paddingHorizontal: wp('5%'),
    color: 'white'
  },
  text1: {
    fontSize: 15,
    color: 'white'
  },
  profile: {
    justifyContent: 'center',
  },
  icon: {
    padding: wp('5%')
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

export default Teacher_Dashboard;
