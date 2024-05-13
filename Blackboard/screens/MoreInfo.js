import React, { useState, useEffect } from 'react';
import { ScrollView, View, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, query, where, getDoc, doc, getDocs, updateDoc, arrayUnion, addDoc } from "firebase/firestore";
import { db } from '../firebase';

const MoreInfoScreen = ({ route }) => {
    const { expandedItemData, teacherId, teacherName } = route.params; 
    const [teacherReviews, setTeacherReviews] = useState([]);

    useEffect(() => {
        fetchReviews();
    }, []); 

    const fetchReviews = async () => {
        try {
            const reviewsRef = collection(db, "Reviews");
            const q = query(reviewsRef, where('teacher', '==', teacherId));
            const querySnapshot = await getDocs(q);
            const reviews = [];
            querySnapshot.forEach((doc) => {
                reviews.push(doc.data());
            });
            console.log("Fetched reviews:", reviews); 
            setTeacherReviews(reviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

  
    if (expandedItemData) {

        return (
            <View style={styles.container}>
                <Text style={styles.title}>Class Details</Text>
                <View style={styles.detailsContainer}>
                    <Text style={styles.detailLabel}>Title:</Text>
                    <Text style={styles.detailText}>{expandedItemData.title}</Text>
                    <Text style={styles.detailLabel}>Content:</Text>
                    <Text style={styles.detailText}>{expandedItemData.content}</Text>
                    <Text style={styles.detailLabel}>Teacher Name:</Text>
                    <Text style={styles.detailText}>{teacherName}</Text>
                </View>
                <View style={styles.reviewsContainer}>
                    <Text style={styles.title}>Teacher Reviews</Text>
                    <ScrollView style={styles.scrollView}>
                        {teacherReviews.map((review, index) => (
                            <View key={index} style={styles.reviewContainer}>
                                <Text style={styles.reviewText}>{review.review}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        );
    } else {
    
        return (
            <View style={styles.container}>
                <Text>Error: Unable to load class information.</Text>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },
    detailsContainer: {
        marginBottom: 20,
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
    reviewsContainer: {
        flex: 1,
        borderWidth: 2,
        borderColor: 'white',
        backgroundColor: 'black',
        paddingHorizontal: 10,
        maxHeight: 350,
    },
    scrollView: {
        flex: 1,
        marginBottom: 20,
        maxHeight: 300,
    },
    reviewContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    reviewText: {
        fontSize: 16,
        color: 'white',
    },
    // Define other styles here
});

export default MoreInfoScreen;
