import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import ProfileScreen from './screens/ProfileScreen';
import StudentClassScreen from './screens/StudentClass';
import TeacherClassScreen from './screens/TeacherClass';
import ClassInfoScreen from './screens/ClassInfo';
import MoreInfoScreen from './screens/MoreInfo';
import ClassReviewScreen from './screens/ClassReview';
import TeacherProfileScreen from './screens/TeacherProfile';
import DisplayInfoScreen from './screens/DisplayInfo';
import 'react-native-reanimated';
import BackButton from './features/backButton';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Splash" component={SplashScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Signup" component={SignUpScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Profile" component={ProfileScreen} />
        <Stack.Screen options={{ headerShown: false }} name="TeacherClass" component={TeacherClassScreen} />
        <Stack.Screen options={{ headerShown: false }} name="StudentClass" component={StudentClassScreen} />
        <Stack.Screen options={{ headerShown: false }} name="ClassInfo" component={ClassInfoScreen} />
        <Stack.Screen options={{ headerShown: false }} name="MoreInfo" component={MoreInfoScreen} />
        <Stack.Screen options={{ headerShown: false }} name="ClassReview" component={ClassReviewScreen} />
        <Stack.Screen options={{ headerShown: false }} name="TeacherProfile" component={TeacherProfileScreen} />
        <Stack.Screen options={{ headerShown: false }} name="BackButton" component={BackButton} />
        <Stack.Screen options={{ headerShown: false }} name="DisplayInfo" component={DisplayInfoScreen} />
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
