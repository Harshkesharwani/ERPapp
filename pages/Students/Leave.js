import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from '../../Component/Config';

const Leave = () => {
  const [leaveData, setLeaves] = useState({ leaves: [] });

  const fetchUserProfile = async () => {
    const userProfile = await AsyncStorage.getItem('userProfile');
    if (userProfile) {
      const parsedProfile = JSON.parse(userProfile);
      fetchLeaves(parsedProfile["enrollment_or_employee_id"]);
    }
  };

  const fetchLeaves = async (student) => {
    try {
      const response = await fetch(`${url}/leaves`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          enrollment_or_employment_id: student,
        })
      });
      if (response.ok) {
        const data = await response.json();
        // Transform data here
        const transformedData = data.leaves.map(leave => {
          const [day, month, year] = leave.from_date.split('-').map(Number);
          return {
            ...leave,
            from_day: day,
            from_month: month,
            from_year: year,
            to_day: leave.to_date ? leave.to_date.split('-')[0] : null,
            to_month: leave.to_date ? leave.to_date.split('-')[1] : null,
            to_year: leave.to_date ? leave.to_date.split('-')[2] : null,
          };
        });
        setLeaves({ leaves: transformedData });
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const renderLeaveItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.detailsContainer}>
        <Text style={styles.dateText}>{item.from_day}/{item.from_month}/{item.from_year} - {item.to_day}/{item.to_month}/{item.to_year}</Text>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.type}>{item.type}</Text>
        <Text style={styles.type}>Admin/Teacher</Text>
      </View>
    </View>
  );

  const renderYear = ({ item: year }) => {
    const months = getMonthsForYear(year);
    return (
      <View style={styles.yearContainer}>
        {months.map((month, monthIndex) => (
          <View key={monthIndex} style={styles.monthContainer}>
            {/* <Text style={styles.monthText}>{month}/{year}</Text> */}
            <FlatList
              data={leaveData.leaves.filter(item => item.from_year === year && item.from_month === month)}
              keyExtractor={(item) => `${item.from_year}-${item.from_month}-${item.from_day}`}
              renderItem={renderLeaveItem}
            />
          </View>
        ))}
      </View>
    );
  };

  const years = leaveData.leaves.length ? Array.from(new Set(leaveData.leaves.map(item => item.from_year))) : [];
  const getMonthsForYear = (year) => Array.from(new Set(leaveData.leaves.filter(item => item.from_year === year).map(item => item.from_month)));

  return (
    <FlatList
      data={years}
      renderItem={renderYear}
      keyExtractor={(item) => item.toString()}
      ListHeaderComponent={<Text style={styles.title}>Leaves</Text>}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: wp('5%'),
    // backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    marginBottom: wp('2%'),
  },
  yearContainer: {
    marginBottom: wp('6%'),
  },
  monthContainer: {
    marginBottom: wp('4%'),
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'column',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // marginVertical: wp('2%'),
    borderWidth: 0.5,
    padding: wp('2%'),
    borderRadius: 10,
  },
  dateText: {
    fontSize: 18,
  },
  detailsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  type: {
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    fontSize: 18,
  },
  statusText: {
    fontSize: 18,
    color: 'green', // You can use different colors based on status
  },
});

export default Leave;
