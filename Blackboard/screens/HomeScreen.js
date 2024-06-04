import React, { PureComponent } from "react"
import { Alert, StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView} from "react-native"
import { Agenda } from "react-native-calendars"
import Navbar from '../features/Navbar';
import { useNavigation } from '@react-navigation/native'
import { onSnapshot, doc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebase'

// Class Screen class component
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

// Agenda Screen class component
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
          // Test ID indicating agenda
          testID = 'agenda'
          // The list of items that have to be displayed in the agenda
          items={this.state.items}
          // Callback that gets called when items for a certain bonth should be loaded
          loadItemsForMonth={this.loadItems}
          // Specify how each item should be rendered in agenda
          renderItem={this.renderItem}
          // Specify how empty date content with no items should be rendered
          renderEmptyDate={this.renderEmptyDate}
          // Specify the item comparison function for increased performance
          rowHasChanged={this.rowHasChanged}
          // Specify what should be rendered instead of the ActivityIndicator
          renderEmptyData={this.renderEmptyData}
          // Knob visibility
          showClosingKnob={true}
          // Agenda theme
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

// Function to load items for the agenda
loadItems = async () => {
  try {
      const items = {};
      userID = auth.currentUser.uid;
      const userRef = doc(db, "Users", userID);
      const unsub = onSnapshot(userRef, async (userSnapshot) => { // Snapshot listener for real-time updates
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
                      // Push the event data to the items object
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
            // Update state with the items
            this.setState({
              items: items,
            });
        }
      });
      return unsub;   
  } catch (error) {
      // Log error message, if exists
      console.error("Error:", error.message);
  }
};

// Function to render each item in the agenda
renderItem = (reservation, isFirst) => {
  // Set font size and color depending on whether it is the first
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

  // Function to render when the data is empty
  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    )
  }

  // Function to render when there is no data
  renderEmptyData = () => {
    return (
      <View style={styles.emptyDataContainer}>
        <Text style={styles.emptyDataText}>No classes today</Text>
      </View>
    );
  }

  // Function to check if a row has changed
  rowHasChanged = (r1, r2) => {
    // Compare row names
    return r1.name !== r2.name
  }

  // Function to convert time to string format
  timeToString(time) {
    const date = new Date(time)
    return date.toISOString().split("T")[0]
  }
}

// Styles for components
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