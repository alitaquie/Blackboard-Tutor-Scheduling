import { ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar';
import { db } from '../firebase'
import { Timestamp, addDoc, collection } from "firebase/firestore";


const ClassScreen = () => {
    const navigation = useNavigation();
    const [theDate, setDate] = useState('');
    const [theLocation, setLocation] = useState('');
    const [theSubject, setSubject] = useState('');
    const [theType, setType] = useState('');

    const handleAdd = async (date, location, subject, type) => {
        try {
            const docRef = await addDoc(collection(db, "Events"), {
                date: Timestamp.fromDate(new Date()),
                location: theLocation,
                subject: theSubject,
                type: theType,
              });
            console.log("Event added successfully!");
            navigation.navigate("Home");
        } catch (error) {
            console.error("Error adding event:", error.message);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={styles.content}>
                <Text>Class Screen</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput placeholder="Date" value={theDate} onChangeText={text => setDate(text)} style={styles.input} />
                <TextInput placeholder="Location" value={theLocation} onChangeText={text => setLocation(text)} style={styles.input}/>
                <TextInput placeholder="Subject" value={theSubject} onChangeText={text => setSubject(text)} style={styles.input} />
                <TextInput placeholder="Type" value={theType} onChangeText={text => setType(text)} style={styles.input}/>
            </View>
            <TouchableOpacity onPress={() => handleAdd(theDate, theLocation, theSubject, theType)} style={styles.button}>
                <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
            <Navbar navigation={navigation} />
        </KeyboardAvoidingView>
  );
};

export default ClassScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'cyan'
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
    },
    inputContainer: {
            
        width: '80%'
    }, 
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5
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
    }
})