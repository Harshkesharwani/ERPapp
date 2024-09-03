import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import logo from '../assets/erp.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../Component/Config';

const CustomDropdown = ({ selectedValue, onValueChange, options }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Text style={styles.dropdownText}>{selectedValue}</Text>
        <Entypo name={isDropdownOpen ? "chevron-small-up" : "chevron-small-down"} size={24} color="black" />
      </TouchableOpacity>
      {isDropdownOpen && (
        <View style={styles.dropdownOptions}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownOption}
              onPress={() => {
                onValueChange(option);
                setIsDropdownOpen(false);
              }}
            >
              <Text style={styles.dropdownOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const Login = ({ navigation }) => {
  const [user_id, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true); // State to toggle password visibility

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  const handleLogin = async () => {
    const data = {
      user_id,
      password,
    };
    try {
      const response = await fetch(`${url}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const result = await response.json();
        await AsyncStorage.setItem('userProfile', JSON.stringify(result.result));

        if (result.result.profile_type === "student") {
          navigation.replace('StudentStack');
        } else if (result.result.profile_type === "teacher") {
          navigation.replace('TeacherStack');
        } else {
          navigation.replace('AdminStack');
        }
      }
      // throw new Error("Login not working");
    } catch (error) {
      console.log("Login not working", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.main}>
          <View style={styles.logo_section}>
            <Image source={logo} style={styles.logo} />
          </View>
          <View style={styles.titleText}>
            <Text style={styles.mainText}>
              Login here
            </Text>
            <Text style={styles.mainText2}>Get access to your ERP and more</Text>
          </View>
          {/* Username/Email input */}
          <View>
            <View style={styles.input}>
              <TextInput
                style={styles.inputBtn}
                placeholder='jon@email.com'
                value={user_id}
                onChangeText={text => setEmail(text)}
              />
            </View>
          </View>
          {/* Password input */}
          <View>
            <View style={styles.input}>
              <TextInput
                style={styles.inputBtn}
                placeholder='********'
                secureTextEntry={hidePassword} // Toggle secureTextEntry based on state
                value={password}
                onChangeText={text => setPassword(text)}
              />
              {/* Toggle button for password visibility */}
              <TouchableOpacity
                style={styles.visibilityBtn}
                onPress={togglePasswordVisibility}
              >
                <Entypo name={hidePassword ? "eye-with-line" : "eye"} size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          {/* Login button */}
          <View style={styles.btn}>
            <TouchableOpacity onPress={handleLogin}>
              <View style={styles.LoginBtn}>
                <Text style={styles.singBtnText}>Login</Text>
              </View>
            </TouchableOpacity>
          </View>
          {/* Sign up text */}
          <View>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.singText2}>Forget Password</Text>
            </TouchableOpacity>
          </View>
          {/* <View>
            <TouchableOpacity onPress={() => navigation.navigate('sign')}>
              <Text style={styles.singText}>Don't have any account? <Text style={styles.singText2}>Sign Up</Text></Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    alignItems: 'center',
    gap: 15,
  },
  logo_section: {
    alignItems: 'center',
  },
  logo: {
    height: 310,
    width: 310,
  },
  titleText: {
    gap: 10,
  },
  mainText: {
    color: '#374EF1',
    fontSize: 25,
    alignSelf: 'center',
    fontWeight: '900',
    marginTop: 10,
  },
  mainText2: {
    color: "#6C6D71",
    alignSelf: 'center',
    fontFamily: 'Roboto',
  },
  dropdownContainer: {
    marginVertical: 12,
    width: 350,
  },
  dropdown: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#4C4C4F',
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 10,
    paddingHorizontal: 10,
  },
  dropdownText: {
    color: '#4C4C4F',
  },
  dropdownOptions: {
    position: 'absolute',
    top: 45,
    width: '100%',
    borderColor: '#4C4C4F',
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 10,
    zIndex: 1000,
  },
  dropdownOption: {
    padding: 10,
  },
  dropdownOptionText: {
    color: '#4C4C4F',
  },
  input: {
    justifyContent: 'center',
    marginBottom: 15,
  },
  inputBtn: {
    backgroundColor: 'white',
    width: 350,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderColor: '#4C4C4F',
    elevation: 10,
    paddingHorizontal: 10,
  },
  LoginBtn: {
    backgroundColor: "#336EFF",
    width: 300,
    height: 45,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  singBtnText: {
    color: 'white',
    fontSize: 15,
  },
  singText: {
    color: '#6C6D71',
  },
  singText2: {
    color: "#336EFF",
    textDecorationLine: 'underline',
  },
  btn: {
    marginBottom: 15,
  },
  visibilityBtn: {
    position: 'absolute',
    right: 10,
  },
});
