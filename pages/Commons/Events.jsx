import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { url } from '../../Component/Config';

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const convertMonthNumberToName = (monthNumber) => {
  return monthNames[parseInt(monthNumber, 10) - 1];
};

const Events = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const newMarkedDates = {};
    events.forEach(event => {
      const { date, month, year } = event;
      const monthNumber = monthNames.indexOf(month) + 1;
      const formattedMonth = monthNumber < 10 ? `0${monthNumber}` : monthNumber.toString();
      const dateString = `${year}-${formattedMonth}-${date}`;
      newMarkedDates[dateString] = { marked: true, dotColor: 'blue' };
    });
    setMarkedDates(newMarkedDates);
  }, [events]);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleMonthChange = async (months) => {
    const newMonth = months[0].month < 10 ? `0${months[0].month}` : `${months[0].month}`;
    const monthly = convertMonthNumberToName(newMonth);
    const newYear = months[0].year;
    const monthString = `${newMonth}-${newYear}`;
    setCurrentMonth(monthString);

    // Fetch events from API
    try {
      const response = await fetch(`${url}/events`, { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ month: monthly }),
      });

      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const renderEventItem = ({ item, index }) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventText}>
        {item.eventname}
      </Text>
      <View style={styles.Eventcol}>
        <Text style={styles.eventText}>{item.date}</Text>
        <Text style={styles.eventText}>{item.dayOfWeek}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Events</Text>
      <Calendar
        current={selectedDate || undefined}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        style={styles.calendar_style}
        onVisibleMonthsChange={handleMonthChange}
      />
      <FlatList
        data={events}
        keyExtractor={(item, index) => `${item.date}-${item.month}-${item.year}-${index}`}
        renderItem={renderEventItem}
        style={styles.eventList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#fff',
  },
  calendar_style: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  text: {
    fontSize: 30,
    margin: wp('2%'),
  },
  eventList: {
    marginTop: hp('2%'),
  },
  eventItem: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  eventText: {
    fontSize: 25,
  },
  Eventcol: {
    flexDirection: 'column'
  }
});

export default Events;
