import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, query, where, getDoc, doc , getDocs, updateDoc, arrayUnion, addDoc} from "firebase/firestore";
import { db } from '../firebase';

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
    const [review, setReview] = useState('');

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
  }, [classId]);

  return (
    <KeyboardAvoidingView style={styles.container}>
        <Text style={styles.boldText}>Teacher Class Page</Text>
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
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.button}>
            <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
    </KeyboardAvoidingView>
);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black'
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
        fontSize: 15,
        marginTop: 2,
        marginBottom: 2,
        color: 'white',
    },
    boldText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 2,
        marginBottom: 2,
        color: 'white',
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
        marginBottom: 5,
        color: 'white',
    },
    detailText: {
        fontSize: 16,
        marginBottom: 10,
        color: 'white',
    },
    studentsContainer: {
        marginBottom: 20,
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
    },
    flatList: {
        paddingTop: 10,
        maxHeight: 150,
      },
});

export default TeacherProfileScreen;