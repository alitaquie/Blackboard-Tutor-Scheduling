import React, { PureComponent } from "react"
import { Alert, StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView } from "react-native"
import { Agenda } from "react-native-calendars"
import Navbar from './Navbar'
import { useNavigation } from '@react-navigation/native'
import { collection, getDocs, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from '../firebase'

const ClassScreen = () => {
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <AgendaScreen/>
      <Navbar navigation={navigation}/>
    </KeyboardAvoidingView>
  )
}

class AgendaScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      items: {}
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Agenda
          testID = 'agenda'
          items={this.state.items}
          loadItemsForMonth={this.loadItems}
          renderItem={this.renderItem}
          renderEmptyDate={this.renderEmptyDate}
          rowHasChanged={this.rowHasChanged}
          showClosingKnob={true}
          theme={{
            calendarBackground: 'black',
            dayTextColor: 'white',
            monthTextColor: 'white',
            agendaDayTextColor: 'black',
            agendaDayNumColor: 'black',
            agendaTodayColor: 'black',
            reservationsBackgroundColor: "darkgray",
          }}
        />
      </View>
    )
  }

  loadItems = async () => {
    try {
        const items = {};
        const eventsRef = collection(db, "Events");
        const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                const eventData = change.doc.data();
                const timestamp = eventData.date.seconds * 1000;
                const date = new Date(timestamp);
                const strTime = this.timeToString(date.getTime() - (7 * 60 * 60 * 1000)); // UTC-7

                if (!items[strTime]) {
                    items[strTime] = [];
                }

                if (change.type === "added") {
                    items[strTime].push({
                        id: change.doc.id,
                        height: 100 || 0,
                        name: eventData.subject,
                        day: strTime,
                        location: eventData.location,
                        type: eventData.type,
                        eventData,
                    });
                } else if (change.type === "modified") {
                    const index = items[strTime].findIndex(item => item.id === change.doc.id);
                    if (index !== -1) {
                        items[strTime][index] = {
                            id: change.doc.id,
                            height: 100 || 0,
                            name: eventData.subject,
                            day: strTime,
                            location: eventData.location,
                            type: eventData.type,
                            eventData,
                        };
                    }
                } else if (change.type === "removed") {
                    items[strTime] = items[strTime].filter(item => item.id !== change.doc.id);
                }
            });

            this.setState({
                items: items,
            });
        });
        return unsubscribe;
    } catch (error) {
        console.error("Error loading items:", error.message);
    }
};


  renderItem = (reservation, isFirst) => {
    const fontSize = isFirst ? 16 : 14
    const color = isFirst ? "black" : "#43515c"

    return (
      <TouchableOpacity
        testID='item'
        style={[styles.item, { height: reservation.height }]}
        onPress={() => Alert.alert(reservation.name)}
      >
        <Text style={{ fontSize, color }}>{reservation.name}</Text>
        <Text style={{ fontSize, color }}>{reservation.day}</Text>
        <Text style={{ fontSize, color }}>{reservation.location}</Text>
        <Text style={{ fontSize, color }}>{reservation.type}</Text>
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
    backgroundColor: 'black',
    paddingVertical: '5%',
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

export default ClassScreen;