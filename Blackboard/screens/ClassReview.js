import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback, ImageBackground, Animated, Platform, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, query, where, getDoc, doc , getDocs, updateDoc, arrayUnion, addDoc} from "firebase/firestore";
import { db } from '../firebase';
import BackButton from '../features/backButton';
import { MaterialIcons } from '@expo/vector-icons';

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
    const starRatingOptions = [1, 2, 3, 4, 5];
    const [starRating, setStarRating] = useState(null);
    const animatedButtonScale = new Animated.Value(1);

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
    
    // Add user review to the 'reviews' collection in the database
    const createReview = async () => {
        const newRef = collection(db, "Reviews");
        // If no star rating is selected, don't add the review
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
            // Add the review id to teacher's 'ratings' field
            const teacherRef = doc(db, 'Users', teacherId);
            await updateDoc(teacherRef, {
                ratings: arrayUnion(reviewDoc.id)
            });
            console.log("Review successfully created!");
            navigation.navigate("Profile");
        }
    }

    useEffect(() => {
        // Acquire Class ID and Information to be stored
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
        // Acquire Teacher ID and Information to be stored
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
            <KeyboardAvoidingView style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
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
        </TouchableWithoutFeedback>
    </ImageBackground>
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
});

export default ClassReviewScreen;