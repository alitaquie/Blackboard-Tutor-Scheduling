import React, { PureComponent } from "react"
import { Alert, StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView} from "react-native"
import { Agenda } from "react-native-calendars"
import Navbar from '../features/Navbar';
import { useNavigation } from '@react-navigation/native'
import { onSnapshot, doc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebase'

const ClassScreen = () => {
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.calHeight}>
        <AgendaScreen navigation={navigation} />
      </View>
      <Navbar navigation={navigation} />
    </KeyboardAvoidingView>
  );
};
class AgendaScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      items: {},
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
          renderEmptyData={this.renderEmptyData}
          showClosingKnob={true}
          theme={{
            calendarBackground: 'black',
            dayTextColor: 'white',
            monthTextColor: 'white',
            agendaDayTextColor: 'white',
            agendaDayNumColor: 'white',
            agendaTodayColor: 'white',
            reservationsBackgroundColor: "#212121",
          }}
        />
      </View>
    )
  }

loadItems = async () => {
  try {
      const items = {};
      userID = auth.currentUser.uid;
      const userRef = doc(db, "Users", userID);
      const unsub = onSnapshot(userRef, async (userSnapshot) => {
        if (userSnapshot.exists()) {
            const classes = userSnapshot.data().classes || [];

            for (const eventId of classes) {
                const eventRef = doc(db, "Events", eventId);
                const eventSnapshot = await getDoc(eventRef);

                if (eventSnapshot.exists()) {
                    const eventData = eventSnapshot.data();
                    const timestamp = eventData.date.seconds * 1000;
                    const date = new Date(timestamp);
                    const strTime = this.timeToString(date.getTime() - (7 * 60 * 60 * 1000)); // UTC-7

                    if (!items[strTime]) {
                        items[strTime] = [];
                    }

                    const existsIdx = items[strTime].findIndex(item => item.id === eventSnapshot.id);
                    if (existsIdx === -1) {
                      items[strTime].push({
                        id: eventSnapshot.id,
                        name: eventData.subject,
                        specific: eventData.course,
                        day: strTime,
                        location: eventData.location,
                        type: eventData.isGroup,
                        attendance: eventData.attendance,
                        eventData,
                      });
                    }
                }
            }
            this.setState({
              items: items,
            });
        }
      });
      return unsub;   
  } catch (error) {
      console.error("Error:", error.message);
  }
};

renderItem = (reservation, isFirst) => {
  const fontSize = isFirst ? 16 : 14;
  const color = isFirst ? "black" : "#43515c";

  return (
    <TouchableOpacity
      testID='item'
      style={[styles.item, { height: reservation.height }]}
      onPress={() => this.props.navigation.navigate('DisplayInfo', { classDetails: reservation })}
    >
      <Text style={{ fontSize, color }}>Course Name: {reservation.specific}</Text>
      <Text style={{ fontSize, color }}>Subject: {reservation.name}</Text>
      <Text style={{ fontSize, color }}>Date: {reservation.day}</Text>
      <Text style={{ fontSize, color }}>Location: {reservation.location}</Text>
    </TouchableOpacity>
  );
}


  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    )
  }

  renderEmptyData = () => {
    return (
      <View style={styles.emptyDataContainer}>
        <Text style={styles.emptyDataText}>No classes today</Text>
      </View>
    );
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
  calHeight: {
    maxHeight: '90%',
    height: '90%',
    top: '-3.5%'
  },

  emptyDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyDataText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold'
  },
})

export default ClassScreen;