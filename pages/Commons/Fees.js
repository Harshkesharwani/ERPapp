import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { url } from '../../Component/Config';

const Fees = () => {
    const [selectedOption, setSelectedOption] = useState('Select Duration');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [feeData, setFeeData] = useState({
        tuition: 0,
        examFee: 0,
        sportsFee: 0,
        labFee: 0,
        libraryFee: 0,
        miscellaneous: 0,
        total: 0,
    });

    const handleSelectOption = async (option) => {
        setSelectedOption(option);
        setIsDropdownVisible(false);
        await fetchFeeData(option);
    };

    const fetchFeeData = async () => {
        try {
            const response = await fetch(`${url}/get_fee_amount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    class: '10',
                    duration: selectedOption,
                }),
            });

            const data = await response.json();


            const updatedFeeData = {
                tuition: data['Tution Fee'],
                examFee: data['Exam Fees'],
                sportsFee: data['Sports Fees'],
                labFee: data['Lab Fees'],
                libraryFee: data['Library Fees'],
                miscellaneous: data['Miscellaneous'],
                total: data['Tution Fee'] + data['Exam Fees'] + data['Sports Fees'] + data['Lab Fees'] + data['Library Fees'] + data['Miscellaneous'],
            };

            setFeeData(updatedFeeData);
        } catch (error) {
            console.error('Error fetching fee data:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Fees</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setIsDropdownVisible(!isDropdownVisible)}>
                <Text style={styles.dropdownText}>{selectedOption}</Text>
            </TouchableOpacity>
            {isDropdownVisible && (
                <View style={styles.dropdownList}>
                    {['bimonthly', 'Monthly', 'Annually', 'Quarterly'].map((option, index) => (
                        <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => handleSelectOption(option)}>
                            <Text style={styles.dropdownItemText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            <ScrollView style={styles.feeDetails}>
                <View style={styles.feeRow}>
                    <Text style={styles.feeLabel}>Tuition Fee:</Text>
                    <Text style={styles.feeAmount}>₹{feeData.tuition}</Text>
                </View>
                <View style={styles.feeRow}>
                    <Text style={styles.feeLabel}>Exam Fee:</Text>
                    <Text style={styles.feeAmount}>₹{feeData.examFee}</Text>
                </View>
                <View style={styles.feeRow}>
                    <Text style={styles.feeLabel}>Sports Fee:</Text>
                    <Text style={styles.feeAmount}>₹{feeData.sportsFee}</Text>
                </View>
                <View style={styles.feeRow}>
                    <Text style={styles.feeLabel}>Lab Fee:</Text>
                    <Text style={styles.feeAmount}>₹{feeData.labFee}</Text>
                </View>
                <View style={styles.feeRow}>
                    <Text style={styles.feeLabel}>Library Fee:</Text>
                    <Text style={styles.feeAmount}>₹{feeData.libraryFee}</Text>
                </View>
                <View style={styles.feeRow}>
                    <Text style={styles.feeLabel}>Miscellaneous:</Text>
                    <Text style={styles.feeAmount}>₹{feeData.miscellaneous}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalAmount}>₹{feeData.total}</Text>
                </View>
            </ScrollView>
            <TouchableOpacity style={styles.Paybtn}>
                <Text style={styles.PayText}>Pay: ₹ {feeData.total}</Text>
            </TouchableOpacity>
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
        marginBottom: wp('4%'),
    },
    dropdown: {
        height: 50,
        width: wp('90%'),
        borderColor: '#ccc',
        borderWidth: 1,
        justifyContent: 'center',
        paddingHorizontal: wp('3%'),
        borderRadius: 5,
        marginBottom: hp('2%'),
    },
    dropdownText: {
        fontSize: 18,
        color: '#000',
    },
    dropdownList: {
        width: wp('90%'),
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginBottom: hp('2%'),
    },
    dropdownItem: {
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('3%'),
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    dropdownItemText: {
        fontSize: 18,
        color: '#000',
    },
    feeDetails: {
        flex: 1,
    },
    feeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: hp('1%'),
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    feeLabel: {
        fontSize: 18,
    },
    feeAmount: {
        fontSize: 18,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: hp('1%'),
        borderTopWidth: 1,
        borderTopColor: '#000',
        marginTop: hp('2%'),
    },
    totalLabel: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    Paybtn: {
        backgroundColor: '#567BC2',
        padding: wp('3%'),
        borderRadius: 10,
    },
    PayText: {
        color: 'white',
        fontSize: 25,
        alignSelf: 'center',
    },
});

export default Fees;
