import { ImageBackground, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Keyboard, TouchableWithoutFeedback  } from 'react-native'
import React, { useState } from 'react'
import { auth, db } from '../firebase'
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import BackButton from '../features/backButton';

const SignUpScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const handleRegister = async (email, full_name, password, user_role) => {
        try {
            if (!user_role) {
                alert('Please select a role (Student or Teacher) before signing up.');
                return; // Prevent further execution of the function
            }
            
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("User registered successfully!");
            await updateProfile(auth.currentUser, {
                displayName: full_name // Set the display name here
            });
            const docRef = doc(db, "Users", auth.currentUser.uid);
            await setDoc(docRef, {
                classes: [],
                name: full_name,
                email: email,
                pass: password,
                role: user_role
            });
                navigation.navigate("Home");

        } catch (error) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    alert(`Email address already in use.`);
                    break;
                case 'auth/invalid-email':
                    alert(`Email address is invalid.`);
                    break;
                case 'auth/operation-not-allowed':  
                    alert(`Error during sign up.`);
                    break;
                case 'auth/weak-password':
                    alert('Password is not strong enough.');
                    break;
                default:
                    alert("Sorry. Something went wrong on our end.");
                    console.error(error.message);
                    break;
            }
        }
    }

    return (
        <ImageBackground source={require('../assets/blackboard-bg.jpg')} resizeMode="cover" style={styles.image}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView style={styles.container} behavior="padding">
                    <View style={styles.content}>
                        <View style={styles.backStyle}>  
                            <BackButton dest="Login" passInfo={{}}/>
                        </View>
                        
                        <Image source={require('../assets/full_logo.jpg')} style={styles.logo}/>

                        <View style={styles.inputContainer}>
                            <TextInput placeholder="Email" placeholderTextColor="gray" value={email} onChangeText={text => setEmail(text)} style={styles.input} />
                            <TextInput placeholder="Full Name" placeholderTextColor="gray" value={user} onChangeText={text => setUser(text)} style={styles.input} />
                            <TextInput placeholder="Password" placeholderTextColor="gray" value={password} onChangeText={text => setPassword(text)} style={styles.input} secureTextEntry/>
                            <TextInput placeholder="Student or Teacher" placeholderTextColor="gray" value={role} onChangeText={text => setRole(text)} editable={false} style={styles.input} />
                            <View style={styles.roleContainer}>
                                <TouchableOpacity style={styles.radioButton} onPress={() => setRole('student')}>
                                    <Text style={styles.radioButtonText}>Student</Text>
                                    {role === 'student' && <View style={styles.radioButtonSelected} />}
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.radioButton} onPress={() => setRole('teacher')}>
                                    <Text style={styles.radioButtonText}>Teacher</Text>
                                    {role === 'teacher' && <View style={styles.radioButtonSelected} />}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => handleRegister(email, user, password, role)} style={styles.button}>
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </ImageBackground>
    )
}

export default SignUpScreen

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
        alignSelf: 'center',
        width: '100%'
    },
    backStyle: {
        bottom: '85%',
        left: '10%'
    },
    greetings: {
        color: 'white',
        fontStyle: 'italic',
        fontSize: 40,
        marginBottom: 40
    },
    logo: {
        width: '50%',
        height: '30%',
        borderRadius: 30,
        alignSelf: 'center',
        bottom: '75%',
    },
    inputContainer: {
        width: '80%',
        alignSelf: 'center'
    }, 
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        bottom: '90%'
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        bottom: '50%'
    },
    radioButton: {
        marginLeft: 20,
        marginRight: 20
    },
    radioButtonText: {
        color: 'white',
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
        alignSelf: 'center',
        bottom: '45%'
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