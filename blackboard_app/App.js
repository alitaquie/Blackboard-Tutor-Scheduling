import * as React from 'react';
import { useState } from 'react';
import { KeyboardAvoidingView, View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#000"
          value={email}
          onChangeText={text => setEmail(text)} 
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#000"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('HomeScreen')}
          style = {styles.button}
        >
            <Text style={styles.buttonText }>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function HomeScreen({ navigation }) {
  // Implement sign-up logic
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      {/* Implement your sign-up form here */}
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
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
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
  },
  inputContainer: {
    width: '80%'
},
input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
},
buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
},
button:{
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
},
buttonOutline:{
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
},
buttonText:{
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
},
buttonOutlineText:{
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
},
});

export default App;