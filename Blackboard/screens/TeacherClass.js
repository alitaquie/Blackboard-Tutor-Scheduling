import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Switch, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar';
import DateTimePicker from '@react-native-community/datetimepicker';
import {StatusBar} from 'expo-status-bar';
import { doc, setDoc, getDoc, collection, updateDoc } from "firebase/firestore";
import { db, auth } from '../firebase';

const TeacherClassScreen = () => {
  const navigation = useNavigation();
  const [course, setCourse] = useState('');
  const [isGroup, setIsGroup] = useState(false);
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [subject, setSubject] = useState('');
  const [attendance, setAttendance] = useState(0);

  const toggleSwitch = () => setIsGroup(previousState => !previousState);

  const createClass = async () => {
    // Logic to create a new class
    console.log('Creating class:', course, isGroup, date, location, subject, attendance);       

    const newRef = doc(collection(db, "Events"));
    await setDoc(newRef, {
      attendence: attendance,
      course: course,
      isGroup: isGroup,
      location: location,
      subject: subject,
      date: date
    });
    console.log("success");

    const userDocRef = doc(db, "Users", auth.currentUser.uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      await updateDoc(doc(db, "Users", auth.currentUser.uid), {
        classes: docSnap.data().classes.concat([newRef.id])
      });
      alert("Success! Class created.");
    } else {
      alert("Sorry, something went wrong on our end!");
    }
  };

  const onChange = (e, selectedDate) => {
    setDate(selectedDate);
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.content}>
        <Text style={styles.title}>Create New Class</Text>
        <TextInput
          style={styles.input}
          placeholder="Course Name"
          value={course}
          onChangeText={text => setCourse(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Location (City)"
          value={location}
          onChangeText={text => setLocation(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Subject"
          value={subject}
          onChangeText={text => setSubject(text)}
        />
        <View style={styles.datestyle}>
          <Text style={styles.filler}>Date / Time</Text>
          <DateTimePicker 
            value={date}
            mode={'date'}
            is24Hour={true}
            onChange={onChange}
          />

          <DateTimePicker
            value={date}
            mode={'time'}
            is24Hour={true}
            onChange={onChange}
          />
        </View>
        <View style={styles.checkboxContainer}>
          <Text style={styles.checkboxText}>Private</Text>
          <Switch
            trackColor={{ false: '#ffffff', true: '#000000' }}
            thumbColor={isGroup ? '#5eb7ff' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isGroup}
          />
          <Text style={styles.checkboxText}>Group</Text>
        </View>
        <TouchableOpacity style={styles.createButton} onPress={createClass}>
          <Text style={styles.ButtonText}>Create</Text>
        </TouchableOpacity>
      </View>
      <Navbar navigation={navigation} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#2b44bd'
  },
  content: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    fontSize: 40,
    top: '-15%',
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#c1e2e3',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 10,
    top: '-11%',
    width: '80%',
    alignSelf: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    top: '-10%'
  },
  datestyle: {
    flexDirection: 'row',
    backgroundColor: '#c1e2e3',
    borderRadius: 5,
    padding: 7,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    top: '-21%'
  },
  checkboxText: {
    margin: 10,
    fontSize: 25
  },
  filler: {
    color: '#93a7ab'
  },
  createButton: {
    backgroundColor: '#002842',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignSelf: 'center',
    bottom: '-10%'
  },
  ButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  }
});

export default TeacherClassScreen;