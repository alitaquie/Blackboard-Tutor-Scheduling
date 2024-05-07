import { ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/FontAwesome5'
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar';
import {auth, db} from '../firebase';
import { doc, getDoc } from "firebase/firestore";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const getName = async () => {
    UserID = auth.currentUser.uid;
    console.log(UserID);
    const userDocRef = doc(db, "Users", UserID);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data().name;
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.content}>
        <Text style={styles.title}>Profile Screen</Text>
        <Text style={styles.notTitle}> Name: {auth.currentUser.displayName}</Text>
        <Text style={styles.notTitle}> Email: {auth.currentUser.email}</Text>
      </View>
      <TouchableOpacity onPress = {() => {navigation.navigate("Login")}} style={styles.logOutButton}>
          <Text>Logout</Text>
        </TouchableOpacity>
      <Navbar navigation={navigation} />
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey'
  },
  content: {
    flex: 1,
    marginTop: 50,
    alignItems: 'center',
    backgroundColor: 'white',
    width: "85%",
    borderRadius: 20,
  },
  title: {
    marginTop: 5,
    fontSize: 30,
    fontWeight: 'bold'
  },
  notTitle: {
    fontSize: 20,
    margin: 10
  },
  logOutButton: {
    backgroundColor: 'lightblue',
    paddingVertical: 20,
    width: '30%',
    borderRadius: 5,
    alignItems: 'center',
    top: '-20%'
  }
})