import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc } from "firebase/firestore";
import Navbar from './Navbar';
import { db, auth } from '../firebase';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userClasses, setUserClasses] = useState([]);
  const [userRole, setUserRole] = useState([]);
  const [classString, setClassString] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const translateClassString = async (classId) => {
    try {
      const classDocRef = doc(db, 'Events', classId);
      const classDocSnap = await getDoc(classDocRef);
      if (classDocSnap.exists()) {
        const className = classDocSnap.data().course;
        return className;
      }
    } catch (error) {
      console.error('Error fetching class data:', error);
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDocRef = doc(db, 'Users', auth.currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserRole(userData.role);
          setUserClasses(userData.classes || []);
  
          // translate class id string to course name
          const translatedClasses = [];
          for (const classString of userData.classes || []) {
            const className = await translateClassString(classString);
            translatedClasses.push(className);
          }
          setClassString(translatedClasses);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);


  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <View style={styles.content}>
          <Text style={styles.title}>Profile Screen</Text>
          <Text style={styles.notTitle}> Name: {auth.currentUser.displayName}</Text>
          <Text style={styles.notTitle}> Email: {auth.currentUser.email}</Text>
          <Text style={styles.notTitle}> Role: {userRole}</Text>
          <Text style={styles.notTitle}> Classes:</Text>
          {classString.map((className, index) => (
            <Text key={index} style={styles.notTitle}>{className}</Text>
          ))}
        </View>
      )}
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.logOutButton}>
        <Text>Logout</Text>
      </TouchableOpacity>
      <Navbar navigation={navigation} />
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey',
  },
  content: {
    flex: 1,
    marginTop: 50,
    alignItems: 'center',
    backgroundColor: 'white',
    width: '85%',
    borderRadius: 20,
  },
  title: {
    marginTop: 5,
    fontSize: 30,
    fontWeight: 'bold',
  },
  notTitle: {
    fontSize: 20,
    margin: 10,
  },
  logOutButton: {
    backgroundColor: 'lightblue',
    paddingVertical: 20,
    width: '30%',
    borderRadius: 5,
    alignItems: 'center',
    top: '-20%',
  },
});
