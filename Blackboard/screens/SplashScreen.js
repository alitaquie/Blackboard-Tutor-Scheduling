import React, { useEffect } from 'react';
import { Text, StyleSheet, ImageBackground, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
    const navigation = useNavigation();
    spinValue = new Animated.Value(0);
    useEffect(() => {
        // Set up spinning animation (1 rotation)
        Animated.timing(
            this.spinValue,
            {
                toValue: 1, // rotations
                duration: 1500, // length
                easing: Easing.linear, // Easing = import from react-native
                useNativeDriver: true, // Native driver for performance
            }
        ).start();
        // Timeout length for loading screen
        setTimeout(() => {
            navigation.navigate('Login');
        }, 2000);
    }, []);
    // Interpolate beginning and end values
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <ImageBackground source={require('../assets/blackboard-bg.jpg')} resizeMode="cover" style={styles.container}>
            <Animated.Image source={require('../assets/full_logo.jpg')} style={[styles.logo, { transform: [{ rotate: spin }] }]} />
            <Text style={styles.text}>Blackboard</Text>
            <Text style={styles.text}>Tutor Scheduling</Text>
        </ImageBackground>
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
