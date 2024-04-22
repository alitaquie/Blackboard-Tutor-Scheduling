import { ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React, { useState } from 'react'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const SignUpScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('')
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState(null);

    const handleRegister = () => {
        if (!role) {
            alert('Please select a role (Student or Teacher) before signing up.');
            return; // Prevent further execution of the function
        }
        createUserWithEmailAndPassword(auth, email, password);
        navigation.navigate("Home");
    }

    return (
        <ImageBackground source={require('../assets/blackboard(1).jpeg')} resizeMode="cover" style={styles.image}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                    <Image source={require('../assets/full_logo.jpg')} style={styles.logo}/>
                    <View style={styles.inputContainer}>
                        <TextInput placeholder="Email" placeholderTextColor="black" value={email} onChangeText={text => setEmail(text)} style={styles.input} />
                        <TextInput placeholder="Username" placeholderTextColor="black" value={user} onChangeText={text => setUser(text)} style={styles.input} />
                        <TextInput placeholder="Password" placeholderTextColor="black" alue={password} onChangeText={text => setPassword(text)} style={styles.input} secureTextEntry/>
                        <TextInput placeholder="Student or Teacher" placeholderTextColor="black" value={role} onChangeText={text => setRole(text)} editable={false} style={styles.input} />
                        <View style={styles.roleContainer}>
                            <TouchableOpacity style={styles.radioButton} onPress={() => setRole('Student')}>
                                <Text style={styles.radioButtonText}>Student</Text>
                                {role === 'Student' && <View style={styles.radioButtonSelected} />}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.radioButton} onPress={() => setRole('Teacher')}>
                                <Text style={styles.radioButtonText}>Teacher</Text>
                                {role === 'Teacher' && <View style={styles.radioButtonSelected} />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleRegister} style={styles.button}>
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    )
}

export default SignUpScreen

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
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    radioButtonText: {
        color: 'white',
        marginRight: 5,
    },
    radioButtonSelected: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'white',
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
    },
})