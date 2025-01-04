import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Footer = () => {
  const navigation = useNavigation();

  const Home = async () => {
    try {
      const userProfile = await AsyncStorage.getItem('userProfile');
      if (userProfile !== null) {
        const parsedProfile = JSON.parse(userProfile);
        if (parsedProfile.profile_type === "student") {
          navigation.replace('StudentStack');
        } else if (parsedProfile.profile_type === "teacher") {
          navigation.replace('TeacherStack');
        } else {
          navigation.replace('AdminStack');
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const chat = () => {
    navigation.navigate('ChatList');
  };

  const notifications = () => {
    navigation.navigate('Notification');
  };

  const Menu = () => {
    navigation.navigate('Menu');
  };

  return (
    <View style={styles.main}>
      <TouchableOpacity onPress={Home}>
        <FontAwesome name="home" size={40} color="white" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={chat}>
        <FontAwesome name="comments" size={40} color="white" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={notifications}>
        <FontAwesome name="bell" size={40} color="white" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={Menu}>
        <FontAwesome name="user" size={40} color="white" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  main: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#567BC2',
    bottom: 0,
    width: '100%',
    padding: 10,
  },
  icon: {
    fontSize: 33,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
