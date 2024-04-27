import React, { Component } from "react"
import Icon from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/FontAwesome5'
import { Alert, StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView } from "react-native"
import { Agenda } from "react-native-calendars"
import testIDs from "../testIDs"
import { useNavigation } from '@react-navigation/native';

export default class AgendaScreen extends Component {
  state = {
    items: undefined
  }

  goToHomeScreen = () => {
    this.props.navigation.navigate('Home');
  };

  goTotesting = () => {
    this.props.navigation.navigate('testing');
  };

  // reservationsKeyExtractor = (item, index) => {
  //   return `${item?.reservation?.day}${index}`;
  // };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Agenda
          testID={testIDs.agenda.CONTAINER}
          items={this.state.items}
          loadItemsForMonth={this.loadItems}
          // selected={"2017-05-16"}
          renderItem={this.renderItem}
          renderEmptyDate={this.renderEmptyDate}
          rowHasChanged={this.rowHasChanged}
          // markingType={'period'}
          // markedDates={{
          //    '2017-05-08': {textColor: '#43515c'},
          //    '2017-05-09': {textColor: '#43515c'},
          //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
          //    '2017-05-21': {startingDay: true, color: 'blue'},
          //    '2017-05-22': {endingDay: true, color: 'gray'},
          //    '2017-05-24': {startingDay: true, color: 'gray'},
          //    '2017-05-25': {color: 'gray'},
          //    '2017-05-26': {endingDay: true, color: 'gray'}}}
          // monthFormat={'yyyy'}
          // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
          // renderDay={this.renderDay}
          // hideExtraDays={false}
          // showOnlySelectedDayItems
          // reservationsKeyExtractor={this.reservationsKeyExtractor}
          showClosingKnob={true}
          theme={{
            calendarBackground: 'black',
            // // textSectionTitleColor: 'white',
            // selectedDayBackgroundColor: 'white',
            // selectedDayTextColor: 'white',
            // todayTextColor: 'white',
            dayTextColor: 'white',
            // // textDisabledColor: 'white',
            // // dotColor: 'black',
            // // selectedDotColor: 'black',
            // // arrowColor: 'white',
            monthTextColor: 'white',
            // // agendaKnobColor: 'black',
            agendaDayTextColor: 'black',
            agendaDayNumColor: 'black',
            agendaTodayColor: 'black',
            // agendaTodayFontWeight: 'bold',
            reservationsBackgroundColor: "darkgray",
          }}
        />
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navItem} onPress={this.goToHomeScreen}>
          <Icon2 name="home" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
          <Icon2 name="book" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={this.goTotesting}>
          <Icon name="person-circle" size={30} color="white" />
          </TouchableOpacity>
          {/* Add more items as needed */}
        </View>
      </KeyboardAvoidingView>
    )
  }

  loadItems = day => {
    const items = this.state.items || {}

    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000
        const strTime = this.timeToString(time)

        if (!items[strTime]) {
          items[strTime] = []

          const numItems = Math.floor(Math.random() * 3 + 1)
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              name: "Item for " + strTime + " #" + j,
              height: Math.max(50, Math.floor(Math.random() * 150)),
              day: strTime
            })
          }
        }
      }

      const newItems = {}
      Object.keys(items).forEach(key => {
        newItems[key] = items[key]
      })
      this.setState({
        items: newItems
      })
    }, 1000)
  }

  renderDay = day => {
    if (day) {
      return <Text style={styles.customDay}>{day.getDay()}</Text>
    }
    return <View style={styles.dayItem} />
  }

  renderItem = (reservation, isFirst) => {
    const fontSize = isFirst ? 16 : 14
    const color = isFirst ? "black" : "#43515c"

    return (
      <TouchableOpacity
        testID={testIDs.agenda.ITEM}
        style={[styles.item, { height: reservation.height }]}
        onPress={() => Alert.alert(reservation.name)}
      >
        <Text style={{ fontSize, color }}>{reservation.name}</Text>
      </TouchableOpacity>
    )
  }

  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    )
  }

  rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name
  }

  timeToString(time) {
    const date = new Date(time)
    return date.toISOString().split("T")[0]
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: '10%',
  },
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  customDay: {
    margin: 10,
    fontSize: 24,
    color: "green"
  },
  dayItem: {
    marginLeft: 34
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingVertical: 35,
    paddingHorizontal: 20,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'white'
  },
  navItem: {
    alignItems: 'center'
  }
})
