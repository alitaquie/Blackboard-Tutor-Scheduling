import { ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";


const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('')
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')

    const handleRegister = async (email, user, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("User registered successfully!");
            await updateProfile(auth.currentUser, {
                displayName: user // Set the display name here
            });
            navigation.navigate("Home");
        } catch (error) {
            console.error("Registration Error: ", error.message);
        }
    }

    return (
        <ImageBackground source={require('../assets/blackboard(1).jpeg')} resizeMode="cover" style={styles.image}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                    <Image source={require('../assets/full_logo.jpg')} style={styles.logo}/>
                    <View style={styles.inputContainer}>
                        <TextInput placeholder="Email" value={email} onChangeText={text => setEmail(text)} style={styles.input} />
                        <TextInput placeholder="Username" value={user} onChangeText={text => setUser(text)} style={styles.input} />
                        <TextInput placeholder="Password" value={password} onChangeText={text => setPassword(text)} style={styles.input} secureTextEntry/>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => handleRegister(email, user, password)} style={styles.button}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    greetings: {
        color: 'white',
        fontStyle: 'italic',
        fontSize: 40,
        marginBottom: 40
    },
    logo: {
        width: '50%',
        height: '10%',
        marginBottom: 10,
        borderRadius: 40
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer: {
        
        width: '80%'
    }, 
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 40
    },
    button: {
        backgroundColor: 'blue',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: 'blue',
        borderWidth: 2
    },
    buttonOutlineText: {
        color: 'blue',
        fontWeight: '600',
        fontSize: 16,
    }
})