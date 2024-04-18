import * as React from 'react';
import { View, Text, Button, StyleSheet, Image, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword} from "firebase/auth"; // Firebase connectivity
import { initializeApp } from 'firebase/app'; // Firebase connectivity

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Background image from local assets */}
      <Image source={require('./assets/blackboard1.jpeg')} style={styles.backgroundImage} />
      {/* Kitten image used as logo, with explicit positioning and zIndex */}
      <Image source={{ uri: 'https://placekitten.com/200/200' }} style={styles.logo} />
      <View style={styles.buttonContainer}>
        <Button
          title="Get Started"
          onPress={() => navigation.navigate('SignUp')}
        />
        <Button
          title="Login"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
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

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>
        Hello World
      </Text>
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
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',  // Adjust content alignment
    alignItems: 'center',
    paddingTop: 40,  // Additional padding at the top
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',  // Text color set to white
  },
  inputContainer: {
    width: '80%',  // Control the width to center the inputs better
    marginTop: 100,  // Increased margin top to move the fields up
  },
  input: {
    width: '100%',
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: '#fff',  // Text color inside the inputs set to white
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Optional: Add background color to enhance visibility of white text
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  logo: {
    width: 200,
    height: 200,
    marginTop: 120,
    marginBottom: 60,
    zIndex: 1  // Ensure the logo appears on top of the background image
  },
  buttonContainer: {
    zIndex: 1  // Ensure buttons appear on top of the background image
  }
});

export default App;
