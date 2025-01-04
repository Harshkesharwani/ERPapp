import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Pressable } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import profile from '../../assets/profile.png';
import arjunProfile from '../../assets/profile.png'; // Replace with the actual path to Arjun's image
import priyaProfile from '../../assets/profile.png';
import password from '../../assets/icons/password.png';
import Help from '../../assets/icons/help.png';
import Logout from '../../assets/icons/logout.png';


const Menu = ({ navigation }) => {
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [Name, setName] = useState('');
    const [Profile, setProfile] = useState('');

    const getUserProfile = async () => {
        try {
            const userProfile = await AsyncStorage.getItem('userProfile');
            if (userProfile !== null) {
                const parsedProfile = JSON.parse(userProfile);
                // console.log('User Profile:', JSON.parse(userProfile));
                setName(parsedProfile["Name"]);
                setProfile(parsedProfile["profile_type"]);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };
    useEffect(() => {
        getUserProfile();
    }, []);

    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const ChangePassword = () => {
        navigation.navigate('ChangePassword');
    }

    const Help1 = () => {
        navigation.navigate('HelpandSupport');
    }

    const Handlelogout = () => {
        AsyncStorage.removeItem('userProfile');
        navigation.replace('login');
    }

    return (
        <View style={styles.container}>
            <View style={styles.box1}>
                <TouchableOpacity style={styles.img}>
                    <Image source={profile} style={styles.profileImage}></Image>
                    <View style={styles.profile}>
                        <Text style={styles.text}>{Name}</Text>
                        <Text style={styles.text1}>{Profile}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.text2}>Edit</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container1}>
                {Profile == 'student' && (
                    <Pressable style={styles.dropdownToggle} onPress={toggleDropdown}>
                        <Text style={styles.dropdownToggleText}>Siblings Info</Text>
                    </Pressable>
                )}
                {isDropdownVisible && (
                    <View style={styles.dropdown}>
                        <View style={styles.dropdownItem}>
                            <Image source={arjunProfile} style={styles.siblingImage}></Image>
                            <View style={styles.siblingInfo}>
                                <Text style={styles.dropdownText}>Name: Arjun</Text>
                                <Text style={styles.dropdownText}>Class: 5</Text>
                                <Text style={styles.dropdownText}>Section: A</Text>
                            </View>
                        </View>
                        <View style={styles.dropdownItem}>
                            <Image source={priyaProfile} style={styles.siblingImage}></Image>
                            <View style={styles.siblingInfo}>
                                <Text style={styles.dropdownText}>Name: Priya</Text>
                                <Text style={styles.dropdownText}>Class: 3</Text>
                                <Text style={styles.dropdownText}>Section: B</Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>
            <View style={styles.container2}>
                <TouchableOpacity style={styles.container3} onPress={ChangePassword}>
                    <Image source={password} />
                    <Text style={styles.text3}>Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.container3} onPress={Help1}>
                    <Image source={Help} />
                    <Text style={styles.text3}>Help</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.container3} onPress={Handlelogout}>
                    <Image source={Logout} />
                    <Text style={styles.text3}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp('5%'),
    },
    img: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    profileImage: {
        width: wp('15%'),
        height: wp('15%'),
        borderRadius: wp('7.5%'),
    },
    text: {
        fontSize: 25,
        paddingHorizontal: wp('5%'),
        color: 'white',
    },
    text1: {
        flexDirection: 'column',
        paddingHorizontal: wp('5%'),
        color: 'white',
    },
    profile: {
        justifyContent: 'center',
    },
    box1: {
        margin: wp('2%'),
        backgroundColor: '#567BC2',
        borderRadius: 15,
        padding: wp('3%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: wp('5%'),
    },
    button: {
        backgroundColor: 'white',
        borderRadius: 10,
        height: hp('4%'),
        justifyContent: 'center',
        alignSelf: 'center',
        width: wp('15%'),
    },
    text2: {
        color: '#567BC2',
        textAlign: 'center',
    },
    container1: {
        marginTop: wp('5%'),
    },
    dropdownToggle: {
        backgroundColor: '#567BC2',
        padding: wp('3%'),
        borderRadius: 10,
    },
    dropdownToggleText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
    },
    dropdown: {
        marginTop: wp('2%'),
        backgroundColor: '#E8E8E8',
        borderRadius: 10,
        padding: wp('3%'),
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: wp('2%'),
    },
    siblingImage: {
        width: wp('10%'),
        height: wp('10%'),
        borderRadius: wp('5%'),
        marginRight: wp('5%'),
    },
    siblingInfo: {
        flexDirection: 'column',
    },
    dropdownText: {
        fontSize: 16,
    },
    container3: {
        margin: wp('5%'),
        flexDirection: 'row',
        borderWidth: 1,
        paddingHorizontal: wp('5%'),
        paddingVertical: wp('3%'),
        borderRadius: 30
    },
    text3: {
        alignSelf: 'center',
        marginLeft: wp('10%'),
        fontSize: 20,
    }
});

export default Menu;
