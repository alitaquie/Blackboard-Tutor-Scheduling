import { ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/FontAwesome5'
import { useNavigation } from '@react-navigation/native';
import { getAuth } from "firebase/auth";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const goToHomeScreen = () => {
    navigation.navigate('Home');
  };
  const goTotesting = () => {
    navigation.navigate('testing');
  };

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user !== null) {
      setDisplayName(user.displayName || '');
      setEmail(user.email || '');
      setPhotoURL(user.photoURL || '');
      setEmailVerified(user.emailVerified || false);
    }
  }, []);

  return (


  
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.content}>
      <Text style={{color: 'white'}}>Profile Screen</Text>
      <Text style={{color: 'white'}}>{displayName}</Text>
      <Text style={{color: 'white'}}>{email}</Text>
      <Text style={{color: 'white'}}>{photoURL}</Text>
      <Text style={{color: 'white'}}>{emailVerified}</Text>
      <TouchableOpacity style={styles.button} onPress={goToHomeScreen}>
        <Text>Press Here</Text>
      </TouchableOpacity>


      </View>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={goToHomeScreen}>
        <Icon2 name="home" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
        <Icon2 name="book" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={goTotesting}>
        <Icon name="person-circle" size={30} color="white" />
        </TouchableOpacity>
        {/* Add more items as needed */}
      </View>
    </KeyboardAvoidingView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
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
  }
})