import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
// import { border } from '@chakra-ui/react';


const Footer = () => {
  const navigation = useNavigation();

  const Menu = () => {
    navigation.navigate('Menu');
  }
  const Home = () => {
    navigation.navigate('dashboard');
  }
  const chat = () => {
    navigation.navigate('ChatList');
  }

  const notifications = () => {
    navigation.navigate('Notification');
  }
  return (
    <View style={styles.main}>
      <TouchableOpacity onPress={Home}>
        <FontAwesome name="home" size={40} color="white" style={styles.bell} />
      </TouchableOpacity>
      <TouchableOpacity onPress={chat}>
        <FontAwesome name="comments" size={40} color="white" style={styles.bell} />
      </TouchableOpacity>
      <TouchableOpacity onPress={notifications}>
        <FontAwesome name="bell" size={40} color="white" style={styles.bell} />
      </TouchableOpacity>
      <TouchableOpacity onPress={Menu}>
        <FontAwesome name="user" size={40} color="white" style={styles.bell} />
      </TouchableOpacity>

    </View>
  )
}

export default Footer

const styles = StyleSheet.create({
  main: {
    display: 'flex',
    position: 'fixed',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#567BC2',
    // marginTop: 0,
    bottom: 0,
    padding: 5,
    margin: 10,
    borderRadius: 10,
  },

  bell: {

    fontSize: 33,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center', padding: 5,

  }
})