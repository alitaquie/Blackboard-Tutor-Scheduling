import { ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/FontAwesome5'
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const goToHomeScreen = () => {
    navigation.navigate('Home');
  };
  const goToProfileScreen = () => {
    navigation.navigate('Profile');
  };
  return (


  
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.content} color = "whites">
      <Text style={{color: 'white'}}>Home Screen</Text>
      </View>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={goToHomeScreen}>
        <Icon2 name="home" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
        <Icon2 name="book" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={goToProfileScreen}>
        <Icon name="person-circle" size={30} color="white" />
        </TouchableOpacity>
        {/* Add more items as needed */}
      </View>
    </KeyboardAvoidingView>
  )
}

export default HomeScreen

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