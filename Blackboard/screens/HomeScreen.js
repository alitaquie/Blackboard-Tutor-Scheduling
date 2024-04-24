import { ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'
import Navbar from './Navbar'
import { useNavigation } from '@react-navigation/native';
        
const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.content}>
        <Text>Home Screen</Text>
      </View>
      <Navbar navigation={navigation}/>
    </KeyboardAvoidingView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
},
content:{
  flex:1,
  justifyContent: 'center',
  alignItems: 'center'
},

})