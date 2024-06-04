import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback, ImageBackground, Animated, Platform, Modal, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, query, where, getDoc, doc , getDocs, updateDoc, arrayUnion, addDoc} from "firebase/firestore";
import { db } from '../firebase';
import BackButton from '../features/backButton';
import moment from 'moment';
import { MaterialIcons } from '@expo/vector-icons';

// Class Review Screen component
const ClassReviewScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { className, classId } = route.params;

    // State variables
    const [subject, setSubject] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [review, setReview] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    // Star rating options
    const starRatingOptions = [1, 2, 3, 4, 5];
    const [starRating, setStarRating] = useState(null);

    // Button press effect
    const animatedButtonScale = new Animated.Value(1);

    // Animation button
    const handlePressIn = () => {
        Animated.spring(animatedButtonScale, {
            toValue: 1.5,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();
    };
    const handlePressOut = () => {
        Animated.spring(animatedButtonScale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
            bounciness: 4,
        }).start();
    };
    const animatedScaleStyle = {
        transform: [{ scale: animatedButtonScale }],
    };
    
    // Create a new review and update the teacher's document with the review ID
    const createReview = async () => {
        const newRef = collection(db, "Reviews");
        if (!starRating) {
            console.log("No star rating");
            Alert.alert("Error", "Please select a star rating before leaving a review.");
            return;
        } else {
            const reviewDoc = await addDoc(newRef, {
                teacher: teacherId,
                review: review,
                starRating: starRating,
            });
            const teacherRef = doc(db, 'Users', teacherId);
            await updateDoc(teacherRef, {
                ratings: arrayUnion(reviewDoc.id)
            });
            console.log("Review successfully created!");
            setModalVisible(false);
            navigation.navigate("Profile");
        }
    } 

    // Check if the class date is in the future
    const isFutureClass = () => {
        const currentDate = new Date();
        const classDate = moment(date, 'dddd, MMMM DD, YYYY [at] hh:mm A').toDate();
        console.log(classDate);
        console.log(currentDate);
        console.log(classDate > currentDate);
        return currentDate > classDate;
    };

    // Fetch class and teacher data 
    useEffect(() => {
        const fetchClass = async () => {
            try {
            const classDocRef = doc(db, 'Events', classId);
            const classDocSnap = await getDoc(classDocRef);
            const classData = classDocSnap.data();
                setSubject(classData.subject || '');
                const dateObj = classData.date.toDate();
                
                const options = {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                };
                const formattedDate = dateObj.toLocaleDateString('en-US', options);
                setDate(formattedDate);
                setLocation(classData.location || '');
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
          <ImageBackground source={require('../assets/blackboard-bg.jpg')} resizeMode="cover" style={styles.image}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView style={styles.container}>
                    <BackButton dest="Profile" passInfo={{}} />
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
                    {isFutureClass() && ( // Render the button only if it's not a future class
                        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                            <Text style={styles.buttonText}>Leave A Review</Text>
                        </TouchableOpacity>
                    )}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Leave A Review for your Teacher:</Text>
                               
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.heading}>{starRating ? `${starRating}*` : 'Tap to rate'}</Text>
                                        <View style={styles.stars}>
                                            {starRatingOptions.map((option) => (
                                                <TouchableWithoutFeedback
                                                    onPressIn={() => handlePressIn(option)}
                                                    onPressOut={() => handlePressOut(option)}
                                                    onPress={() => setStarRating(option)}
                                                    key={option}
                                                >
                                                    <Animated.View style={animatedScaleStyle}>
                                                        <MaterialIcons
                                                            name={starRating >= option ? 'star' : 'star-border'}
                                                            size={32}
                                                            style={starRating >= option ? styles.starSelected : styles.starUnselected}
                                                        />
                                                    </Animated.View>
                                                </TouchableWithoutFeedback>
                                            ))}
                                        </View>
                                        </View>
                                        <TextInput
                                            style={styles.input}
                                            multiline={true}
                                            placeholder="Review"
                                            placeholderTextColor="#ccc"
                                            value={review}
                                            onChangeText={text => setReview(text)}
                                        />
                                <TouchableOpacity style={styles.button} onPress={createReview}>
                                    <Text style={styles.buttonText}>Post</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.buttonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    </ImageBackground>
);
};


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
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: 'black',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
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
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    stars: {
        display: 'flex',
        flexDirection: 'row',
    },
    starUnselected: {
        color: '#aaa',
    },
    starSelected: {
        color: '#ffb300',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'black',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    inputContainer: {
        width: '100%',
    },
    stars: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#2196F3',
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginVertical: 5,
        width: '100%',
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: '#d9534f',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ClassReviewScreen;