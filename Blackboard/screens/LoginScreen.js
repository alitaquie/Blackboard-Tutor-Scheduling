import { ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { auth } from '../firebase'

const image = {uri: ''};

const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignUp = () => {
        auth.createUserWithEmailAndPassword(email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
        })
    }
    return (
        <ImageBackground source={require('../assets/blackboard(1).jpeg')} resizeMode="cover" style={styles.image}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                    <Text style={styles.greetings}>Welcome!</Text>
                    <View style={styles.inputContainer}>
                        <TextInput placeholder="Email/Username" value={email} onChangeText={text => setEmail(text)} style={styles.input} />
                        <TextInput placeholder="Password" value={password} onChangeText={text => setPassword(text)} style={styles.input} secureTextEntry/>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => {}} style={styles.button}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {}} style={[styles.button, styles.buttonOutline]}>
                            <Text style={styles.buttonOutlineText}>Register</Text>
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
        fontSize: 16
    }
})