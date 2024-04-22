import { ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React, {useState} from 'react';
import {Calendar, LocaleConfig} from 'react-native-calendars';

const App = () => {
  const [selected, setSelected] = useState('');

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={day => {
          setSelected(day.dateString);
        }}
        markedDates={{
          [selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
        }}
      />
    </View>
  );
};

export default App

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      // alignItems: 'center'
  },
})