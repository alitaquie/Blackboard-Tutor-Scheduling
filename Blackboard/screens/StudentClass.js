import { ImageBackground, Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar';

const StudentClassScreen = () => {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('');

  return (
    <ImageBackground source={require('../assets/blackboard(1).jpeg')} resizeMode="cover" style={styles.image}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Image source={require('../assets/full_logo.jpg')} style={styles.logo} />
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Date"
            value={date}
            onChangeText={text => setDate(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Location"
            value={location}
            onChangeText={text => setLocation(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Subject"
            value={subject}
            onChangeText={text => setSubject(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Type"
            value={type}
            onChangeText={text => setType(text)}
            style={styles.input}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => {}} style={styles.button}>
            <Text style={styles.buttonText}>Find Events</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default StudentClassScreen;

const styles = StyleSheet.create({
  logo: {
      width: '50%',
      height: '10%',
      marginBottom: 10,
      borderRadius: 40
  },
  image: {
      flex: 1,
      justifyContent: 'center',
  },
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
  },
  inputContainer: {
      
      width: '80%'
  }, 
  input: {
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 5,
      color: 'black',
  },
  buttonContainer: {
      width: '60%',
      justifyContent: 'center',
      alignContent: 'center',
      marginTop: 40
  },
  buttonContainer: {
      width: '60%',
      justifyContent: 'center',
      alignContent: 'center',
      marginTop: 40
  },
  button: {
      backgroundColor: 'blue',
      width: '100%',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center'
  },
  buttonText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 16
  },
  buttonOutline: {
      backgroundColor: 'white',
      marginTop: 5,
      borderColor: 'blue',
      borderWidth: 2
  },
  buttonOutlineText: {
      color: 'blue',
      fontWeight: '600',
      fontSize: 16,
  },
});
