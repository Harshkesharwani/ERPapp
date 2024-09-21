import { StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const styleses = StyleSheet.create({
    container: {
      flex: 1,
      padding: wp('5%'),  
      backgroundColor: '#fff',
    },
    headerText: {   
      fontSize: 30,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: hp('2%'),
    },
    calendarStyle: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 10,
      marginBottom: hp('2%'),
    },
    dayDetailsContainer: {
      marginTop: hp('2%'),
      padding: 15,
      backgroundColor: '#f5f5f5',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
    },
    dayDetailsText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#222',
      marginBottom: hp('1%'),
    },
    statusText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#999',
      marginBottom: hp('1%'),
    },
    apiText: {
      fontSize: 16,
      color: '#444',
      marginBottom: hp('0.5%'),
    },
  });

export default styles;