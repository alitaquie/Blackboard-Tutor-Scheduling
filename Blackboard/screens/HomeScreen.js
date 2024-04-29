import { ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import Navbar from './Navbar'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.content}>
        <Text>Home Screen</Text>
      </View>
      <Navbar navigation={navigation}/>
    </KeyboardAvoidingView>
  );
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
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
  content:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
})