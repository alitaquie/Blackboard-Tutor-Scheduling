import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, query, where, getDoc, doc , getDocs, updateDoc, arrayUnion, addDoc} from "firebase/firestore";
import { db } from '../firebase';
import BackButton from '../features/backButton';

const ClassReviewScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { className, classId } = route.params;
    const [subject, setSubject] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [review, setReview] = useState('');
    
    const createReview = async () => {
        const newRef = collection(db, "Reviews");
        const reviewDoc = await addDoc(newRef, {
            teacher: teacherId,
            review: review,
        });
        const teacherRef = doc(db, 'Users', teacherId);
        await updateDoc(teacherRef, {
            ratings: arrayUnion(reviewDoc.id)
        });
        console.log("Review successfully created!");
        navigation.navigate("Profile");
    }

    useEffect(() => {
        const fetchClass = async () => {
            try {
            const classDocRef = doc(db, 'Events', classId);
            const classDocSnap = await getDoc(classDocRef);
            if (classDocSnap.exists()) {
                const classData = classDocSnap.data();
                setSubject(classData.subject || '');
                const dateObj = classData.date.toDate();
                strTime = dateObj.toString();
                setDate(strTime);
                setLocation(classData.location || '');
            }
            } catch (error) {
            console.error('Error fetching class info:', error);
            }
        };
        const fetchTeacher = async () => {
            try {
            const usersRef = collection(db, 'Users');
            const q = query(usersRef, where('role', '==', 'teacher'));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                if (userData.classes && userData.classes.includes(classId)) {
                setTeacherName(userData.name);
                setTeacherId(doc.id);
                return;
                }
            });
            } catch (error) {
            console.error('Error fetching teacher data:', error);
            }
        };
        fetchClass();
        fetchTeacher();
  }, [classId]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ImageBackground source={require('../assets/blackboard-bg.jpg')} resizeMode="cover" style={styles.image}>
            <KeyboardAvoidingView style={styles.container}>
                {/* <View style={styles.content}> */}
                <BackButton dest="Profile" passInfo={{}}/>
                <Text style={styles.boldText}>Review Page</Text>
                <View style={styles.reviewsContainer}>
                    <Text style={styles.detailLabel}>Teacher Name:</Text>
                    <Text style={styles.detailText}>{teacherName}</Text>
                    <Text style={styles.detailLabel}>Course Name:</Text>
                    <Text style={styles.detailText}>{className}</Text>
                    <Text style={styles.detailLabel}>Subject:</Text>
                    <Text style={styles.detailText}>{subject}</Text>
                    <Text style={styles.detailLabel}>Date:</Text>
                    <Text style={styles.detailText}>{date}</Text>
                    <Text style={styles.detailLabel}>Location:</Text>
                    <Text style={styles.detailText}>{location}</Text>
                </View>
                <Text style={styles.boldText}>Leave A Review for your Teacher:</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        multiline={true}
                        placeholder="Review"
                        value={review}
                        onChangeText={text => setReview(text)}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={createReview}>
                    <Text style={styles.buttonText}>Post</Text>
                </TouchableOpacity>
                {/* </View> */}
            </KeyboardAvoidingView>
        </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    button: {
        backgroundColor: 'white',
        margin: 15,
        paddingVertical: 6,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        width: '25%'
    },
    buttonText: {
        fontSize: 25,
        margin: 2
    },
    content: {
        flex: 1,
        marginTop: 50,
        alignItems: 'center',
        backgroundColor: 'white',
        width: '85%',
        borderRadius: 20,
    },
    fieldText: {
        fontSize: 15,
        marginTop: 2,
        marginBottom: 2,
        color: 'white',
    },
    boldText: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10,
        color: 'white',
        textAlign: 'center'
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 5,
        margin: 10,
        width: '80%',
    },
    detailsContainer: {
        marginBottom: 20,
    },
    reviewsContainer: {
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: 'black',
        padding: 5,
        marginBottom: 30,
        borderRadius: 5
    },
    inputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: 'black',
        padding: 20,
        justifyContent: 'center',
        borderRadius: 5
    },
    detailLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'white',
    },
    detailText: {
        fontSize: 16,
        marginBottom: 10,
        color: 'white',
    },
    filler: {
        margin: 20
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    }
});

export default ClassReviewScreen;