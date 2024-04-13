import * as React from 'react';
import { View, Text, Button, StyleSheet, Image, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

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
          }}
        />
      </View>
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
