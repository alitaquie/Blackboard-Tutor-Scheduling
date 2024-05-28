import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Text, FlatList, ImageBackground, Switch, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, query, where, getDoc, doc , getDocs, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import BackButton from '../features/backButton';

const TeacherProfileScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { className, classId } = route.params;
    const [subject, setSubject] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [students, setStudents] = useState([]);
    const [teacherId, setTeacherId] = useState('');
    const [isClosed, setIsClosed] = useState(false);
    const [currClose, setCurrClose] = useState(null);

    const toggleSwitch = () => setIsClosed(previousState => !previousState);

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

                    const closeState = classData.hasOwnProperty('closed') ? classData.closed : false;
                    setIsClosed(closeState);
                    setCurrClose(closeState);
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
                console.error('Error fetching teacher info:', error);
            }
        };
        const fetchStudents = async () => {
            try {
                const usersRef = collection(db, 'Users');
                const q = query(usersRef, where('role', '==', 'student'));
                const querySnapshot = await getDocs(q);
                const studentsData = [];
                querySnapshot.forEach((doc) => {
                    const userData = doc.data();
                    if (userData.classes && userData.classes.includes(classId)) {
                        studentsData.push({ name: userData.name, id: doc.id });
                    }
                });
                setStudents(studentsData);
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };
      
        fetchClass();
        fetchTeacher();
        fetchStudents();
  }, [classId, navigation]);

  const handleBackPress = async () => {
    console.log('Saving state:', isClosed);
    const docRef = doc(db, "Events", classId);
    if (docRef) {
        await updateDoc(docRef, { closed: isClosed });
        alert("The class has been updated!");
    }
  };

  return (
    <ImageBackground source={require('../assets/blackboard-bg.jpg')} resizeMode="cover" style={styles.image}>
        <KeyboardAvoidingView style={styles.container}>
            <BackButton dest="Profile" passInfo={{}} handleBackPress={handleBackPress} />
            <Text style={styles.boldText}>Teacher Class Page</Text>
            <View style={styles.reviewsContainer}>
                <View style={styles.snap}>
                    <Text style={styles.detailLabel}>Teacher Name: </Text>
                    <Text style={styles.detailText}>{teacherName}</Text>
                </View>

                <View style={styles.snap}>
                    <Text style={styles.detailLabel}>Course Name: </Text>
                    <Text style={styles.detailText}>{className}</Text>
                </View>

                <View style={styles.snap}>
                    <Text style={styles.detailLabel}>Subject: </Text>
                    <Text style={styles.detailText}>{subject}</Text>
                </View>

                <View style={styles.snap}>
                    <Text style={styles.detailLabel}>Date: </Text>
                    <Text style={styles.detailText}>{date}</Text>
                </View>

                <View style={styles.snap}>
                    <Text style={styles.detailLabel}>Location: </Text>
                    <Text style={styles.detailText}>{location}</Text>
                </View>

                <View style={styles.snap}>
                    <Text style={styles.detailLabel}>Is Closed: </Text>
                    <Text style={styles.detailText}>{currClose ? 'Yes' : 'No'}</Text>
                </View>
            </View>

            <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>Open</Text>
                <Switch
                trackColor={{ false: '#262626', true: '#000000' }}
                thumbColor={isClosed ? 'white' : '#f4f3f4'}
                ios_backgroundColor="#171717"
                onValueChange={toggleSwitch}
                value={isClosed}
                style={styles.toggle}
                />
                <Text style={styles.toggleText}>Closed</Text>
            </View>
            <View style={styles.studentsContainer}>
                <Text style={styles.fieldText}>Students</Text>
                <FlatList
                    data={students}
                    renderItem={({ item }) => (
                        <View style={styles.studentItem}>
                            <Text style={styles.studentName}>{item.name}</Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.flatList}
                />
            </View>
        </KeyboardAvoidingView>
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
        borderRadius: 10,
        width: '25%'
    },
    buttonText: {
        fontSize: 25,
        marginTop: 2,
        marginBottom: 2,
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
        fontSize: 20,
        marginTop: 10,
        color: 'white',
        textAlign: 'center'
    },
    boldText: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10,
        color: 'white',
        textAlign: 'center'
    },
    snap: {
        flexDirection: 'row',
        margin: 10
    },
    input: {
        backgroundColor: '#c1e2e3',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 5,
        marginBottom: 10,
        width: '80%',
        alignSelf: 'center',
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
    },
    detailLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    detailText: {
        fontSize: 17,
        color: 'white',
    },
    studentsContainer: {
        height: '40%'
    },
    studentItem: {
        backgroundColor: 'white',
        marginVertical: 5,
        paddingVertical: 10,
        paddingHorizontal: 50,
        borderRadius: 10,
        color: 'white',
    },
    studentName: {
        fontSize: 16,
        color: 'black',
        textAlign: 'center'
    },
    flatList: {
        paddingTop: 10,
        maxHeight: '100%',
        width: '80%',
        alignSelf: 'center'
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignSelf: 'center'
    },
    toggleText: {
        color: 'white',
        fontSize: 20,
        margin: 10,
    },
    toggle: {
        alignSelf: 'center'
    }
      
});

export default TeacherProfileScreen;