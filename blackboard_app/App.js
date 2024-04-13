import * as React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://placekitten.com/200/200' }} style={styles.logo} />
      <Button
        title="Get Started"
        onPress={() => navigation.navigate('SignUp')}
      />
      <Button
        title="Login"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
}

function SignUpScreen({ navigation }) {
  // Implement sign-up logic
  return (
    <View style={styles.container}>
      <Text>Sign Up Screen</Text>
      {/* Implement your sign-up form here */}
    </View>
  );
}

function LoginScreen({ navigation }) {
  // Implement login logic
  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
      {/* Implement your login form here */}
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20
  }
});

export default App;
