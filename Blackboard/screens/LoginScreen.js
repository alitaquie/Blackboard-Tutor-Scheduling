
import { ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from "firebase/auth";


const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    const handleLogIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User signed in successfully!");
            navigation.navigate("Home");
        } catch (error) {
            console.error('Login Error: ', error.message);
        } 
    }

    const handleRegister = () => {
        navigation.navigate("Signup");
    }

    return (
        <ImageBackground source={require('../assets/blackboard-bg.jpg')} resizeMode="cover" style={styles.image}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView style={styles.container} behavior="padding">
                    <View style={styles.content}>
                        <Image source={require('../assets/logo_text.jpg')} style={styles.logo}/>
                        <View style={styles.inputContainer}>
                            <TextInput placeholder="Email" value={email} onChangeText={text => setEmail(text)} placeholderTextColor= "gray" style={styles.input1} />
                            <TextInput placeholder="Password" value={password} onChangeText={text => setPassword(text)}  placeholderTextColor= "gray" style={styles.input2} secureTextEntry/>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={handleLogIn} style={styles.button}>
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleRegister} style={[styles.button, styles.buttonOutline]}>
                                <Text style={styles.buttonOutlineText}>Don't have an account?</Text>
                                <Text style={styles.buttonOutlineText}>Register Here!</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </ImageBackground>
    )
}


export default LoginScreen

const textConsts = {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        position: 'absolute',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    greetings: {
        color: 'white',
        fontStyle: 'italic',
        fontSize: 40,
        marginBottom: 40
    },
    logo: {
        width: '100%',
        height: '35%',
        borderRadius: 30,
        bottom: '55%',
        alignSelf: 'center'
    },
    inputContainer: {
        width: '150%',
        alignSelf: 'center',
        bottom: '35%'
        
    }, 
    input1: {
        ...textConsts,

    },
    input2: {
        ...textConsts,
        top: '20%'
        
    },
    buttonContainer: {
        width: '100%',
        alignSelf: 'center',
        marginTop: 40,
        bottom: '20%'
    },
    button: {
        backgroundColor: 'blue',
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
