import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import Navbar from './Navbar';


const ClassScreen = () => {
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.content}>
        <Text>Class Screen</Text>
        {/* Button added to the middle of the screen */}
        <TouchableOpacity style={styles.button} onPress={() => {/* Handle button press */}}>
          <Text style={styles.buttonText}>Add Class</Text>
        </TouchableOpacity>
      </View>
      <Navbar navigation={navigation} />
    </KeyboardAvoidingView>
  );
};

export default ClassScreen;

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
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
    borderTopColor: 'white',
  },
  navItem: {
    alignItems: 'center',
  },
});