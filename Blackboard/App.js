import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import ProfileScreen from './screens/ProfileScreen';
import StudentClassScreen from './screens/StudentClass';
import TeacherClassScreen from './screens/TeacherClass';
import ClassInfoScreen from './screens/ClassInfo';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen options={{headerShown:false}} name="Login" component={LoginScreen} />
        <Stack.Screen options={{headerShown:false}} name="Home" component={HomeScreen} />
        <Stack.Screen options={{headerShown:false}} name="Signup" component={SignUpScreen} />
        <Stack.Screen options={{headerShown:false}} name="Profile" component={ProfileScreen} />
        <Stack.Screen options={{headerShown:false}} name = "TeacherClass" component = {TeacherClassScreen}/>
        <Stack.Screen options={{headerShown:false}} name = "StudentClass" component = {StudentClassScreen}/>
        <Stack.Screen options={{headerShown:false}} name = "ClassInfo" component = {ClassInfoScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
