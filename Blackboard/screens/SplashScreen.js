import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
//export default function SplashScreen({ navigation }) {
const SplashScreen = () => {
    const navigation = useNavigation();
    useEffect(() => {
        // Timeout length for loading screen
        setTimeout(() => {
        navigation.navigate('Login');
        }, 3000);
    });

    return (
        //<View style={styles.container}>
            <ImageBackground source={require('../assets/blackboard-bg.jpg')} resizeMode="cover" style={styles.container}>
                <Image source={require('../assets/full_logo.jpg')} style={styles.logo} />
                <Text style={styles.text}>Blackboard</Text>
                <Text style={styles.text}>Tutor Scheduling</Text>
            </ImageBackground>
        //</View>
    );
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
