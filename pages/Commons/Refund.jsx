import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { url } from '../../Component/Config';

const Refund = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Refund</Text>
            <Text style={styles.center}>No Refund is available</Text>
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
    center: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    },
});

export default Refund;
