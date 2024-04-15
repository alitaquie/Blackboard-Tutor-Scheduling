import * as React from 'react';
import { useState } from 'react';
import { KeyboardAvoidingView, View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword} from "firebase/auth"; // Firebase connectivity
import { initializeApp } from 'firebase/app'; // Firebase connectivity

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
  // Note: Need to provide AsyncStorage
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSignUp = () => {
    const firebaseConfig = {
      apiKey: "AIzaSyAPWJQdZePfzjpRlRtMT_gY3HktQvqizAw",
      authDomain: "blackboard-41f8a.firebaseapp.com",
      projectId: "blackboard-41f8a",
      storageBucket: "blackboard-41f8a.appspot.com",
      messagingSenderId: "52140658788",
      appId: "1:52140658788:web:46a71eb9e5a26e86ce0f71",
      measurementId: "G-W7BR765CXM"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        
        updateProfile(auth.currentUser, {
          displayName: name
        }).then(() => {
          // Profile updated!
          // ...
          alert("Account Created!")
        }).catch(error => alert(error.message))

        // ...
      })
      .catch(error => alert(error.message))
  }    

  return (
    <View style={styles.container}>
      {/* Background image from local assets, same as used in the WelcomeScreen */}
      <Image source={require('./assets/blackboard1.jpeg')} style={styles.backgroundImage} />
      <Text style={styles.header}>Sign Up</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}  // Ensures the password is hidden
        />
        <Button
          title="Sign Up"
          onPress={() => {
            console.log('Signing up with:', name, email, password);
            handleSignUp();
          }}
        />
      </View>
    </View>
  );
}

function LoginScreen({ navigation }) {
  // Implement login logic
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = () => {
    const firebaseConfig = {
      apiKey: "AIzaSyAPWJQdZePfzjpRlRtMT_gY3HktQvqizAw",
      authDomain: "blackboard-41f8a.firebaseapp.com",
      projectId: "blackboard-41f8a",
      storageBucket: "blackboard-41f8a.appspot.com",
      messagingSenderId: "52140658788",
      appId: "1:52140658788:web:46a71eb9e5a26e86ce0f71",
      measurementId: "G-W7BR765CXM"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      alert("Logged In!")
      // ...
    })
    .catch(error => alert(error.message))
  }  

  return (
    <View style={styles.container}>
      {/* Background image from local assets, same as used in the WelcomeScreen */}
      <Image source={require('./assets/blackboard1.jpeg')} style={styles.backgroundImage} />
      <Text style={styles.header}>Log In</Text>
      <View style={styles.inputContainer}>
        {/* <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
        /> */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}  // Ensures the password is hidden
        />
        <Button
          title="Log In"
          onPress={() => {
            console.log('Logging in with:', email, password);
            handleLogin();
          }}
        />
      </View>
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