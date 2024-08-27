import { StyleSheet, Text, View,TextInput,TouchableOpacity } from 'react-native'
import React from 'react'

const Sign = ({navigation}) => {
  return (
    <View style={styles.main}>
      <Text style={styles.signText}>Sign</Text>
      <Text style={styles.title}>Get sccess to your ERP and more</Text>
      <View style={styles.input_section}>
       <TextInput style={styles.textInput} placeholder='  Enrollment Number'></TextInput>
       <TextInput style={styles.textInput} placeholder='  Full Name ?'></TextInput>
       <TextInput style={styles.textInput}placeholder='  Email'></TextInput>
       <TextInput style={styles.textInput}placeholder='  Email'></TextInput>
       
      </View>
      <View style={styles.Login_section}>
       <TouchableOpacity>
        <View style={styles.Register}>
        <Text style={styles.registerText}>Register</Text>
        </View>
       </TouchableOpacity>
      </View>
      <TouchableOpacity  onPress={() => navigation.navigate('login')}>
      <Text style={styles.singText}>Already have any account <Text style={styles.singText2}>Login</Text></Text>
      </TouchableOpacity>
    </View>
  )
}

export default Sign

const styles = StyleSheet.create({
    signText:{
        fontSize:35,
    },
    main:{
        alignItems:"center",
        gap:10,
    },
    input_section:{
        gap:10,
        marginBottom:10,
    },
    textInput:{
        backgroundColor:'white',
        width:350,
        height:45,
        borderRadius:20,
        alignItems:'center',
        justifyContent:'center',
        borderWidth: 0.5,
        borderColor: '#4C4C4F',
        elevation:12,
        
    },
    Register:{
      backgroundColor:"#336EFF",
      width:300,
      height:45,
      borderRadius:20,
      alignItems:'center',
      justifyContent:'center',
      elevation:10,
    },
    registerText:{
        color:'white',
    },
    title:{
        color:"#6C6D71",
      alignSelf:'center',
      fontFamily: 'Roboto',
    },
    singText:{
        color:'#6C6D71',
        
      },
      singText2:{
        color:"#336EFF",
        textDecorationLine:'underline',
      },
})