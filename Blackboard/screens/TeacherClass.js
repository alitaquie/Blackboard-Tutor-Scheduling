import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection } from "firebase/firestore";
import Navbar from './Navbar';

const TeacherClassScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [className, setClassName] = useState('');
  const [isGroup, setIsGroup] = useState(false);
  const [capacity, setCapacity] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [subject, setSubject] = useState('');

  const createClass = () => {
    // Logic to create a new class
    console.log('Creating class:', className, isGroup, capacity, date, location, subject);
    // After creating the class, you can close the modal
    setModalVisible(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.content}>
        <Text>Teacher Class Screen</Text>
        <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.createButtonText}>Create New Class</Text>
        </TouchableOpacity>
      </View>
      <Navbar navigation={navigation} />
      {modalVisible && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Class</Text>
            <TextInput
              style={styles.input}
              placeholder="Class Name"
              value={className}
              onChangeText={text => setClassName(text)}
            />
            <View style={styles.checkboxContainer}>
              <Text style={styles.checkboxText}>Group</Text>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isGroup ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={setIsGroup}
                value={isGroup}
              />
            </View>
            {isGroup && (
              <TextInput
                style={styles.input}
                placeholder="Capacity"
                keyboardType="numeric"
                value={capacity}
                onChangeText={text => setCapacity(text)}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Date"
              value={date}
              onChangeText={text => setDate(text)}
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
            <TouchableOpacity style={styles.createButton} onPress={createClass}>
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.createButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

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
  createButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20
  },
  createButtonText: {
    color: 'white',
    fontSize: 16
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  input: {
    backgroundColor: 'lightgrey',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  checkboxText: {
    marginRight: 10
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10
  }
});

export default TeacherClassScreen;